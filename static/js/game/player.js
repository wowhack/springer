Player = Factory( "Player", Entity, Transform, Intersection );
Player.proto.init = function( x,y, gravity ) {
	pp.log("Placing new player @ " + x + "," + y );


	this.init_position = [x,y];
	this.set_position(x,y);
	this.set_scale([179 / 2.0,203/2.0]);
	// this.debug_quad    = Debugquad.new( x,y, [32,32] );
	this.gravity       = gravity || 1;
	this.forward_speed = 80 * 2;

	this.wobble        = false;
	this.wobble_speed  = 14.0;
	this.wobble_value  = 0.0;
	this.wobble_amp    = 2.0;

	this.jump_critical_reset = 0.7;
	this.jump_critical_time = 0.0;

	this.velocity     = [0,0];
	this.force        = [0,0];
	this.last_segment = -1
	this.jumpstate    = {}

	this.feet_wobble = 0;

	this.qb = new PXF.QuadBatch( pp.ctx );

	this.qb.Reset();
	this.qb.depth = 0;
	this.qb.AddCentered( 0,0,1,1);
	this.qb.End();

	this.textures = {
		body_0 : pp.get_resource("jerry")
	};

	this.jerryshader = new PXF.Shader( pp.ctx, "static/shaders/jerry.vs", "static/shaders/jerry.fs", true);

	// -- this.jumpstate.jump_velocity = 1500 * 3

	// this.playerstate = "dead";
	this.playerstate = "active";

	this.jumpstate.jump_velocity = 2500 * 0.5
	this.jumpstate.disable = function() {
		this.jump_ok = false
	}

	this.jumpstate.enable = function() {
		this.jump_ok = true
	}
};

function calc_cell_data( cell, cells, rows )
{
	
  var sdt = 1.0 / cells
  var tdt = 1.0 / rows

  var s = (cell % cells) * sdt
  var t = (Math.floor( cell / cells )) * tdt

  return { s : s, t : t, sdt : sdt, tdt : tdt }

}

Player.proto.reset = function() {
	this.x            = this.init_position[0];
	this.y            = this.init_position[1];
	this.velocity     = [0,0];
	this.force        = [0,0];
	this.last_segment = -1;
}

Player.proto.do_jump = function() {
	if ( this.jumpstate.jump_ok) {// || this.jump_critical_time > 0.0 ) {
		// vec2.add( this.force, [ 0, this.jumpstate.jump_velocity * this.jump_critical_time*this.jump_critical_time*this.jump_critical_time*this.jump_critical_time*this.jump_critical_time, 0 ], this.force );
		// vec2.add( this.force, [ 0, this.jumpstate.jump_velocity * this.jump_critical_time*this.jump_critical_time*this.jump_critical_time ], this.force );
		// console.log("jump", this.force);
		game.particlerunner.create_korvparty(30, this.x, this.y);

		this.jump_critical_time = this.jump_critical_reset;
		this.i_did_jump = true;
		return true;
	}
	return false;
}

Player.proto.update = function ( level, track_pos, dt ) {

	// console.log(dt);

	dt = 1 / 30.0; // is this real wife

	if (!pp.ctx._inputState.mouseDown)
	{
		this.jump_critical_time = 0;
	}
	if ( this.jump_critical_time > 0.0 ) {
		vec2.add( this.force, [ 0, this.jumpstate.jump_velocity * this.jump_critical_time, 0 ], this.force );

		if (this.jump_critical_time > this.jump_critical_reset - 0.1)
			game.particlerunner.create_korvparty(30, this.x, this.y);
	}

	if ( this.wobble && this.jumpstate.jump_ok ) {
		 this.wobble_value = this.wobble_value + dt * this.wobble_speed;
	}

	if (this.jump_critical_time > 0) {
		this.jump_critical_time = this.jump_critical_time - dt
		// console.log(this.jump_critical_time);
	}

	// -- vec2.add( self.velocity, {self.forward_speed * dt, -self.gravity * dt} )
	vec2.add( this.velocity, [ this.force[0] * dt, this.force[1] * dt - this.gravity * dt ], this.velocity );

	if ( this.i_did_jump )
	{
		console.log(this.velocity[1]);
		this.i_did_jump = false;
	}

	// console.log(this.velocity[1]);

	// console.log(this.gravity * dt);

	// this.x = this.x + this.velocity[1] * dt + this.forward_speed * dt
	this.x = track_pos / 2;
	this.y = this.y + this.velocity[1] * dt 

	this.force = [0,0];

	// var p_minx = this.x - this.s[0];
	// var p_maxx = this.x + this.s[0];
	// var p_miny = this.y - this.s[1];
	// var p_maxy = this.y + this.s[1];

	this.qb.Reset();
	this.qb.depth = 0;

	///// feet
	var cell_data = calc_cell_data( 2, 4, 4 )
	var s = cell_data.s
	var t = cell_data.t
	var sdt = cell_data.sdt
	var tdt = cell_data.tdt

	this.qb.SetCoords(
                          s, t+tdt,
                      s+sdt, t+tdt,
                      s+sdt, t,
                          s, t,
                    0);
	// this.qb.AddTopLeft( this.x, this.y-this.s[1]/4, 40, 40);
	this.feet_wobble += dt*4;
	this.qb.AddCentered( this.x+this.s[0]/2 - 20, this.y+6, 40, 40, Math.sin(this.feet_wobble));
	this.qb.AddCentered( this.x+this.s[0]/2 - 10, this.y+6, 40, 40, Math.sin(this.feet_wobble+0.2));
	this.qb.AddCentered( this.x+this.s[0]/2 - 0, this.y+6,  40, 40, Math.sin(this.feet_wobble+0.2*2));
	this.qb.AddCentered( this.x+this.s[0]/2 + 10, this.y+6, 40, 40, Math.sin(this.feet_wobble+0.2*3));
	this.qb.AddCentered( this.x+this.s[0]/2 + 20, this.y+6, 40, 40, Math.sin(this.feet_wobble+0.2*4));


	///// head
	var cell_data = calc_cell_data( 0, 2, 2 )
	var s = cell_data.s
	var t = cell_data.t
	var sdt = cell_data.sdt
	var tdt = cell_data.tdt

	this.qb.SetCoords(
                          s, t+tdt,
                      s+sdt, t+tdt,
                      s+sdt, t,
                          s, t,
                    0);
	this.qb.AddCentered( this.x+this.s[0]/2, this.y+this.s[1]/2, 100, 100);


	var cell_data = calc_cell_data( 2, 2, 2 )
	var s = cell_data.s
	var t = cell_data.t
	var sdt = cell_data.sdt
	var tdt = cell_data.tdt

	this.qb.SetCoords(
                          s, t+tdt,
                      s+sdt, t+tdt,
                      s+sdt, t,
                          s, t,
                    0);

	if (this.jumpstate.jump_ok)
		this.qb.AddCentered( this.x+this.s[0]/2, this.y+this.s[1]/2, 100, 100);
	// this.qb.AddTopLeft( this.x, this.y+this.s[1], this.s[0], -this.s[1]);

	// this.qb.AddCentered( this.x, this.y+this.s[1], this.s[0], -this.s[1] )
	// this.qb:AddCentered( self.x + 14 + math.sin(self.wobble_value * 0.6 + math.pi) * 0.2, self.y-17+wobble_y, 32, 32, math.sin(self.wobble_value * 0.6 + math.pi) * 0.3 + 0.5 )



	// this.qb.AddCentered( this.x, this.y, this.s[0]*2, this.s[1]*2);
	this.qb.End();

	// console.log(level.query_segments);

	// console.log(p_minx,p_maxx);

	//var segments       = level.track_segments; //level.query_segments( [ p_minx, p_maxx ] );
	var segments       = level.query_segments( { s : this.x, e : this.x+this.s[0] } );

	// console.log(segments.length);

	this.jumpstate.disable();

	var segment_missed = false;

	if ( this.player_dead_timer !== undefined )
	{
		this.player_dead_timer += dt;

		if ( this.player_dead_timer > 5 )
		{
			game.player_dead();
			delete this.player_dead_timer;
		};
	};

	// -- best algorithm award goes to... backend boys
	//for ( var k = 0; k < segments.length; k++ ) {
	for ( var k in segments ) {

		k = Number(k);

		var v = segments[k];

		if ( k > this.last_segment) {
			if ( this.y < segments[k].h + 90 ) {

				// console.log("missed " + k);

				segment_missed = true;
			}
		}
	}

	if ( !segment_missed ) {
		// for k,v in pairs(segments) do 
		//for ( var k = 0; k < segments.length; k++ ) {
		for ( var k in segments ) {

			k = Number(k);

			var v = segments[k];

			if ( this.y <= v.h + 90 ) {

				// console.log("missed?");

				this.y = v.h + 90;// + this.s[1]*2.0;
				this.jumpstate.enable();
				this.jump_critical_time = this.jump_critical_reset;
				this.velocity[1] = 0;
			}

			this.last_segment = k;
		}
	};

	if ( segment_missed && this.player_dead_timer === undefined )
	{
		this.player_dead_timer = 0;
	} else {
		if ( this.player_dead_timer === undefined )
		{
			game.tick_score();
		}
	}

	this.dt = dt;
};




Player.proto.draw = function ( camera ) {

	var shader = this.jerryshader; //pp.ctx.Shaderlib.forward;

	shader.Bind();
	// shader.SetUniform("color",[0,0,0]);

	var camera_view = camera.get_screen_coords()
	camera_view = [ camera_view[0][0], camera_view[1][0] ];

	var camera_pmtx = camera.get_projection() //--mat4.ortho( 0, 200, 0, 100, -1, 1 )
	var camera_vmtx = camera.get_transform()  //--mat4.identity()
	mat4.inverse(camera_vmtx);

	shader.SetUniform( "pmtx", camera_pmtx );
	// shader.SetUniform( "uMVMatrix", camera_vmtx );

	var player_mtx = mat4.identity();

	if ( this.wobble ) {
		mat4.translate( player_mtx, [ 0, Math.sin( this.wobble_value) * this.wobble_amp, 0 ] ); 
	};

	mat4.multiply( camera_vmtx, player_mtx, player_mtx );

	shader.SetUniform( "vmtx", mat4.identity() );
	shader.SetUniform( "mmtx", player_mtx );

	var alpha = 1;

	if ( this.player_dead_timer !== undefined )
	{
		alpha = 1 - this.player_dead_timer / 5;
	};


	if ( this.reset_blinking_timer !== undefined )
	{
		this.reset_blinking_timer += this.dt;

		alpha = this.reset_blinking_timer / 1;

		if ( this.reset_blinking_timer > 1 )
			delete this.reset_blinking_timer;
	}

	shader.SetUniform( "alpha", alpha );

	// shader.SetUniform( "tex0", this.textures.body_0 );

	// console.log( player_mtx );

	// shader.SetUniform( "mmtx", player_mtx )

	shader.SetUniform("i", "tex0",  0 )

	this.textures.body_0.Bind( 0 );
	// this.debug_quad.Draw( shader );

	this.qb.BindBuffers( shader, { position : true, uv0 : true});
	this.qb.DrawBuffers( shader );
	this.qb.UnbindBuffers( shader, {position : true, uv0 : true});

	shader.Unbind();

};

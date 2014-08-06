function point_in_interval( p, x1, x2 )
{
	if (p >= x1) {
		if (p <= x2) {
			return 0
		}
		return -1
	}
	return 1
}

function segments_overlap( s1, s2 )
{
	// console.log("testing:", s1.s, s1.e, s2.s, s2.e);
	//console.log("testing:", s1, s2);
	// check if segment start is in "view"
	var s = point_in_interval(s1.s, s2.s, s2.e)
	if (s == 0) {
		return 0
	}

	// check if segment end is in "view"
	s = point_in_interval(s1.e, s2.s, s2.e)
	if (s == 0) {
		return 0
	}

	// // dont ask dont tell
	// s = point_in_interval(s2.e, s1.s, s1.e)
	// if (s == 0) {
	// 	return 0
	// }
	
	// check if "view" start is in segment
	// (special case where segment spawns larger than width of view)
	return point_in_interval(s2.s, s1.s, s1.e)

}

Gamelevel = function( uri ) {

	// build (or request from game server) track data

	this.shader = new PXF.Shader(pp.ctx,
		"static/shaders/ground.vs",
		"static/shaders/ground.fs",
		true);
	
	this.mountainshader = new PXF.Shader(pp.ctx,
		"static/shaders/mountains.vs",
		"static/shaders/mountains.fs",
		true);

	this.snowshader = new PXF.Shader(pp.ctx,
		"static/shaders/snow.vs",
		"static/shaders/snow.fs",
		true);

	// TEMP, use a static track
	//this.track_segments = [
	//	{s: 0, e: 200, h: 20, t: 1}, // { start, end, h = height, t = segment_type }
	//	{s: 250, e: 300, h: 25, t: 1},
	//	{s: 370, e: 600, h: 30, t: 1},
	//	{s: 700, e: 1000, h: 20, t: 2},
	//	{s: 1050, e: 1400, h: 30, t: 2}
	//];
	this.segments = [];
	console.log(echonest.current_song);

	var max_slopiness = 0.2;

	var sections = echonest.current_song.sections;
	var last_key = 0;
	for (var i in sections) {
		var section = sections[i];
		var start = section.start * 500;
		var end = start + section.duration * 500;

		var loudness = Math.abs(section.loudness);

		for (var cur_start = start; cur_start < end; ) {
			// start, end
			var length = 20 * loudness;
			var s = cur_start;
			var e = s + length;

			// height
			var h = 50 * section.key + Math.random() * 600;
			h = (1.0 - max_slopiness) * last_key + max_slopiness * h;
			last_key = h;

			// type
			var t = (i % 2 == 0) ? 0 : 1;

			if (e > end)
				e = end;

			this.segments.push({s: s, e: e, h: h, t: t});

			cur_start += length + 180;
		}
	}

	// console.log("this.segments:", this.segments.length);

	this.segment_qbs = [];
	for (var i = 0; i < 4; i += 1) {
		var qb = new PXF.QuadBatch( pp.ctx );
		qb.depth = 0;
		this.segment_qbs.push( qb );
	}

	// tmp
	this.tempquad = new PXF.QuadBatch( pp.ctx );
	this.tempquad.Reset();
	this.tempquad.depth = 0;
	this.tempquad.AddTopLeft(0,0,1,1);
	this.tempquad.End();

	this.backgroundquad = new PXF.QuadBatch(pp.ctx);
	this.backgroundquad.Reset();
	this.backgroundquad.depth = 0;
	this.backgroundquad.AddTopLeft(-1,-1,2,2);
	this.backgroundquad.End();

	this.snow = new PXF.QuadBatch(pp.ctx);
	this.snow.Reset();
	this.snow.depth = 0;
	this.snow.AddTopLeft(0,0,1,1);
	this.snow.End();
}

Gamelevel.prototype.update = function ( player_position ) { // does not use time delta, our time is fixed at all times...
	// do nothing
}

Gamelevel.prototype.draw = function( camera ) {
	// do nothing
	var camera_view = camera.get_screen_coords();
	    camera_view = { s : camera_view[0][0], e : camera_view[1][0] };
	var camera_pmtx = camera.get_projection(); //--mat4.ortho( 0, 200, 0, 100, -1, 1 )
	// var camera_pmtx = mat4.ortho( -1, 1, -1, 1, -1, 1 );
	var camera_vmtx = camera.get_transform(); //--mat4.identity()

	mat4.inverse(camera_vmtx);

	// console.log(camera_view);

	var visible_segments = this.query_segments( camera_view );
	/*var shader = pp.ctx.Shaderlib.forward;
	shader.Bind();

	shader.SetUniform( "uPMatrix", camera_pmtx );

	for ( var s in visible_segments )
	{
		var seg = visible_segments[s];
		var mtx = mat4.identity();

		mat4.translate( mtx, [ seg.s, seg.h,0]);
		mat4.scale(mtx,[ seg.e - seg.s, 10,1 ]);

		mat4.multiply( camera_vmtx, mtx, mtx );

		shader.SetUniform( "uMVMatrix", mtx );

		this.tempquad.BindBuffers( shader, { position : true, uv0 : true});
		this.tempquad.DrawBuffers( shader );
		this.tempquad.UnbindBuffers( shader, {position : true, uv0 : true});
	};

	shader.Unbind();*/

	for (var i in this.segment_qbs) {
		var v = this.segment_qbs[i];
		v.Reset();
	}
	
	for (var i in visible_segments) {
		var v = visible_segments[i];
		this.segment_qbs[v.t].SetNormal( v.e-v.s, v.h, 0 );
		// this.segment_qbs[v.t].AddTopLeft( v.s, v.h, v.e-v.s, -v.h );
		this.segment_qbs[v.t].AddTopLeft( v.s, v.h, v.e-v.s, 90 );
		// this.segment_qbs[v.t].depth = 0;
		// this.segment_qbs[v.t].AddTopLeft( 0, 0, 1000, 1000 );
	}
 	
 	//segments_qb.AddTopLeft(camera_view.s, 40, camera_view.e-camera_view.s, 10)

 	// end all qbs
	for (var i in this.segment_qbs) {
		var v = this.segment_qbs[i];
		v.End()
	}

	// draw mountains
	var mshader = this.mountainshader;
	mshader.Bind();
	mshader.SetUniform("tex0", 0 );

	mshader.SetUniform("mmtx", mat4.identity());

	if (typeof(scrolling) == "undefined") {
		scrolling = 100
		bigs = [0, 2, 3, 5, 5.5, 8, 3, 2];
		smalls = [0, 1, 3, 4, 7, 9, 3, 9];
	}
	if (game.state == game.GAME_STATES.PLAYING) {
		scrolling = 1
	} else {
		scrolling = 0
	}

	var world = mat4.identity();
	mat4.scale(world, vec3.create([730 / pp.settings.width, 600 / pp.settings.height, 1.0]), world);
	mshader.SetUniform("backblend", 1.0);
	mshader.SetUniform("world", world);
	for (var i = 0; i < bigs.length; i+=1) {
		bigs[i] -= scrolling/300;
		if (bigs[i] < -2.0) {
			bigs[i] = 2 + Math.random() * bigs.length;
		}
		var big_mountain = mat4.identity();
		mat4.translate(big_mountain, vec3.create([bigs[i], -0.2, 1.0]), big_mountain);
		mshader.SetUniform("mmtx", big_mountain);
		var tex = pp.get_resource("berg_stor");
		mshader.SetUniform("tex_size", [ tex.width, tex.height ]);
		tex.Bind(0);
		var v = this.backgroundquad;
		v.BindBuffers(mshader, {position: true, uv0: true, normal: false});
		v.DrawBuffers(mshader);
		v.UnbindBuffers(mshader, {position: true, uv0: true, normal: false});
	}

	mshader.SetUniform("backblend", 0.0);
	for (var i = 0; i < smalls.length; i+=1) {
		smalls[i] -= scrolling/50;
		if (smalls[i] < -4.0) {
			smalls[i] = 4 + Math.random() * smalls.length;
		}
		var little_mountain = mat4.identity();
		mat4.scale(little_mountain, vec3.create([0.5, 0.5, 1.0]), little_mountain);
		mat4.translate(little_mountain, vec3.create([smalls[i], -1.3, 1.0]), little_mountain);
		mshader.SetUniform("mmtx", little_mountain);
		var tex = pp.get_resource("berg_liten");
		mshader.SetUniform("tex_size", [ tex.width, tex.height ]);
		tex.Bind(0);
		var v = this.backgroundquad;
		v.BindBuffers(mshader, {position: true, uv0: true, normal: false});
		v.DrawBuffers(mshader);
		v.UnbindBuffers(mshader, {position: true, uv0: true, normal: false});
	}

	mshader.Unbind();

	var shader = this.shader;

 	shader.Bind();
	// shader.SetUniform("pmtx", mat4.identity() );
	shader.SetUniform("pmtx", camera_pmtx );
	// shader.SetUniform("vmtx", mat4.identity() );
	shader.SetUniform("vmtx", camera_vmtx );
	shader.SetUniform("mmtx", mat4.identity() );

	shader.SetUniform("cap_width", 40.0 );
	shader.SetUniform("cap_height", 40.0 );

	shader.SetUniform("tex0", 0 );
	// shader.SetUniform("tex_mid",   1 );
	// shader.SetUniform("tex_right", 2 );

    shader.SetUniform("pixels_to_coords", 1.0 );
	
// 	-- draw all qbs
	for (var i in this.segment_qbs) {
		var v = this.segment_qbs[i];

		// --print(visible_segments[i][2] - visible_segments[i][1])
		// -- if (visible_segments[i]) then
		// 	-- shader:SetUniform("f", "block_width", visible_segments[i][2] - visible_segments[i][1] )
		// -- end

		//segment_textures[i].left:Bind( 0 )
		// segment_textures[i].mid:Bind( 1 )
		// segment_textures[i].right:Bind( 2 )
		var tex = pp.get_resource( "ground_0" );
    	shader.SetUniform("tex_size", [ tex.width, tex.height ] );
		tex.Bind( 0 );

		//v.Draw( shader );
		v.BindBuffers( shader, { position : true, uv0 : true, normal: true});
		v.DrawBuffers( shader );
		v.UnbindBuffers( shader, {position : true, uv0 : true, normal: true});

		// segment_textures[i].right:Unbind( )
		// segment_textures[i].mid:Unbind( )
		// segment_textures[i].left:Unbind( )
	}

    shader.Unbind()

	// draw snow!
	var sshader = this.snowshader;
	sshader.Bind();
	sshader.SetUniform("tex0", 0 );
	sshader.SetUniform("mmtx", mat4.identity());

	if (typeof(snow_particles) == "undefined") {
		snow_particles = [];
		for (var i = 0; i < 50; i += 1) {
			snow_particles.push([Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random(), Math.random() * 1, Math.random() * 1 + 1]);
		}
	}

	var world = mat4.identity();
	mat4.scale(world, vec3.create([0.015, 0.015, 1.0]), world);
	sshader.SetUniform("world", world);
	for (var i = 0; i < snow_particles.length; i+=1) {
		var p = snow_particles[i];
		p[1] -= (scrolling / 200) * p[3];

		var xdiff = Math.sin(p[2]) * 0.5;
		p[2] += 0.05;
		p[0] -= (scrolling / 200) * p[4] * xdiff;

		if (p[1] < -1.0) {
			p[1] = 1.0;
			p[0] = Math.random() * 2 - 1;
			p[3] = Math.random() * 2;
			p[4] = Math.random() * 3;
		}

		var trans = mat4.identity();
		mat4.translate(trans, vec3.create([p[0], p[1], 1.0]), trans);
		sshader.SetUniform("mmtx", trans);
		var tex = pp.get_resource("snow_lonely");
		sshader.SetUniform("tex_size", [ tex.width, tex.height ]);
		tex.Bind(0);
		var v = this.backgroundquad;
		v.BindBuffers(sshader, {position: true, uv0: true, normal: false});
		v.DrawBuffers(sshader);
		v.UnbindBuffers(sshader, {position: true, uv0: true, normal: false});
	}

	sshader.Unbind();
};

Gamelevel.prototype.amazing_grace = function ( start_pos, end_pos )
{

	for (var i = 0; i < this.segments.length; i++) {
		
		var v = this.segments[i];
		if (v.e > end_pos)
		{
			v.s = start_pos;

			return v;
		} else {
			v.s = 0;
			v.e = 0;
		}

	};

};

Gamelevel.prototype.query_segments = function ( view ) {
	
	if (this.segments.length <= 0)
	{
		return [];
	}

	var found_segments = {};

	for (var i = 0; i < this.segments.length; i++) {
		var v = this.segments[i];
		var s = segments_overlap( v, view );

		if (s == 0) {
			//table.insert(possibility_stack, i)
			found_segments[i] = v;
		}

		if (s > 0)
			break;
	};


	return found_segments;

	// todo build binary search tree instead of binary list search below

	var found_segments = [];
	var possibility_stack = [];
	var checked = {};

	// binary search to find first hit
	//for i,v in ipairs( this.segments ) do
	var bound_size = this.segments.length-1;
	var bound_s = 0;
	var bound_f = bound_size;
	bound_size = Math.ceil( bound_size / 2 );

	var i = bound_size;
	var last_i = -1; // whoops, this might need to change into -1 since we are not using Lua
	var last_last_i = -2;

	// while (true) do
	while (true)
	{

		console.log(i);

		bound_size = Math.max( Math.ceil(bound_size / 2), 1);

		var v = this.segments[i];
		var s = segments_overlap( v, view );

		console.log("hej",s);

		console.log("segment",v,view);

		if (s == 0) {
			//table.insert(possibility_stack, i)
			possibility_stack.push(i);
			break;
		}

		if (s < 0) {
			i = ( i + bound_size );
		} else {
			i = ( i - bound_size );
		}

		// console.log("i " .. i )

		if ( i == last_last_i || i < bound_s || i > bound_f) {
			// console.log("no segments found");
			break;
		}

		last_last_i = last_i;
		last_i = i;

	}

	// collect nearby segments
	// console.log("#possibility_stack:", #possibility_stack)
	// while (#possibility_stack > 0) do
	while (possibility_stack.length > 0) {

		var i = possibility_stack.pop();
		if (!checked[i]) {
			checked[i] = true;

			if (i >= 0 && i < this.segments.length) {

				// console.log(i)
				// table.insert( found_segments, this.segments[i])
				var v = this.segments[i];
				var s = segments_overlap( v, view );
				if (s == 0) {
					//found_segments[i] = v;
					found_segments.push(v);
				}

				// add siblings
				possibility_stack.push(i + 1);
				possibility_stack.push(i - 1);


			}
			
		}

	}

	console.log("found_segments:", found_segments.length);

	ducksucker();
	// console.log(found_segments);

	return found_segments;

}

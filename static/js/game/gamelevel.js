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

	var max_slopiness = 0.1;

	var sections = echonest.current_song.sections;
	var last_key = 0;

	console.log("generating segments");
	for (var i in sections) {
		var section = sections[i];
		var start = section.start * 500;
		var end = start + section.duration * 500;

		var loudness = Math.abs(section.loudness);

		for (var cur_start = start; cur_start < end; ) {
			// start, end
			var length = 60 * loudness;
			var s = cur_start;
			var e = s + length;

			// height
			var h = 10 * section.key;
			h = (1.0 - max_slopiness) * last_key + max_slopiness * h;
			last_key = h;

			// type
			var t = (i % 2 == 0) ? 0 : 1;

			if (e > end)
				e = end;

			this.segments.push({s: s, e: e, h: h, t: t});

			cur_start += length + 40;
		}
	}

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
		this.segment_qbs[v.t].AddTopLeft( v.s, v.h, v.e-v.s, 160 );
		// this.segment_qbs[v.t].depth = 0;
		// this.segment_qbs[v.t].AddTopLeft( 0, 0, 1000, 1000 );
	}
 	
 	//segments_qb.AddTopLeft(camera_view.s, 40, camera_view.e-camera_view.s, 10)

 	// end all qbs
	for (var i in this.segment_qbs) {
		var v = this.segment_qbs[i];
		v.End()
	}

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
    
};

Gamelevel.prototype.query_segments = function ( view ) {
	
	if (this.segments.length <= 0)
	{
		return [];
	}	

	// todo build binary search tree instead of binary list search below

	var found_segments = {};
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

		// console.log(i);

		bound_size = Math.max( Math.ceil(bound_size / 2), 1);

		var v = this.segments[i];
		var s = segments_overlap( v, view );

		// console.log("hej",s);

		// console.log("segment",v,view);

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
					found_segments[i] = v;
				}

				// add siblings
				possibility_stack.push(i + 1);
				possibility_stack.push(i - 1);


			}
			
		}

	}

	// console.log(found_segments);

	return found_segments;

}

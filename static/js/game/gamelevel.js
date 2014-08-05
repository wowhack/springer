Gamelevel = function( uri ) {

	// build (or request from game server) track data

	// TEMP, use a static track
	this.track_segments = [
		{s : 0,    e : 200, h : 20, t : 1}, // { start, end, h = height, t = segment_type }
		{s : 250,  e : 300, h : 25, t : 1},
		{s : 370,  e : 600, h : 30, t : 1},
		{s : 700,  e : 1000, h : 20, t : 2},
		{s : 1050, e : 1400, h : 30, t : 2}
	];

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
	    camera_view = [ camera_view[0][0], camera_view[1][0] ];
	var camera_pmtx = camera.get_projection(); //--mat4.ortho( 0, 200, 0, 100, -1, 1 )
	// var camera_pmtx = mat4.ortho( -1, 1, -1, 1, -1, 1 );
	var camera_vmtx = camera.get_transform(); //--mat4.identity()

	mat4.inverse(camera_vmtx);

	var visible_segments = this.track_segments; //self:query_segments( camera_view )

	var shader = pp.ctx.Shaderlib.forward;
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

	shader.Unbind();
};

// 	-- reset all qbs
// 	for i,v in ipairs(segment_qbs) do
// 		v:Reset()
// 	end
	
// 	for k,v in pairs(visible_segments) do

// 		-- segment caps sizes
// 		--local cap_w = 20

// 		segment_qbs[v["t"]]:SetNormals( { v[2]-v[1], v["h"], 0 } )
// 		segment_qbs[v["t"]]:AddTopLeft( v[1], v["h"], v[2]-v[1], -v["h"] ) -- middle
// 		--segment_qbs[v["t"]]:AddTopLeft( v[1]+cap_w, v["h"], v[2]-v[1]-cap_w*2, -v["h"] ) -- middle
// 		--segment_qbs[v["t"]]:AddTopLeft( v[1], v["h"], v[1]+cap_w, -v["h"] ) -- cap left

// 	end
// 	--segments_qb:AddTopLeft(camera_view[1], 40, camera_view[2]-camera_view[1], 10)

// 	-- end all qbs
// 	for i,v in ipairs(segment_qbs) do
// 		v:Finish()
// 	end

// 	local shader = assets["ground_shader"]

// 	shader:Bind()

// 	shader:SetUniform("mat4", "pmtx", camera_pmtx )
// 	shader:SetUniform("mat4", "vmtx", camera_vmtx )
// 	shader:SetUniform("mat4", "mmtx", mat4.identity() )

// 	shader:SetUniform("f", "cap_width",  25.0 )
// 	shader:SetUniform("f", "cap_height",  40.0 )

// 	shader:SetUniform("i", "tex_left",  0 )
// 	shader:SetUniform("i", "tex_mid",   1 )
// 	shader:SetUniform("i", "tex_right", 2 )

// 	-- shader:SetUniform("f", "pixels_to_coords", 1.0 )

// 	-- draw all qbs
// 	for i,v in ipairs(segment_qbs) do

// 		--print(visible_segments[i][2] - visible_segments[i][1])
// 		-- if (visible_segments[i]) then
// 			-- shader:SetUniform("f", "block_width", visible_segments[i][2] - visible_segments[i][1] )
// 		-- end

// 		segment_textures[i].left:Bind( 0 )
// 		segment_textures[i].mid:Bind( 1 )
// 		segment_textures[i].right:Bind( 2 )

// 		v:Draw( shader )

// 		segment_textures[i].right:Unbind( )
// 		segment_textures[i].mid:Unbind( )
// 		segment_textures[i].left:Unbind( )
// 	end

// 	shader:Unbind()
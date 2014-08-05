Debugquad = Factory("Debugquad", Entity, Transform )

Debugquad.proto.init = function( x, y, s, r ) {
	this.x  = x || 0;
	this.y  = y || 0;
	this.s  = s || [1,1];
	this.r  = r || 0;
	this.qb = new PXF.QuadBatch( pp.ctx );

	this.qb.Begin();
	this.qb.AddCentered(0,0,2,2);
	this.qb.End();

	this.shader = pp.ctx.Shaderlib.forward;
}

Debugquad.proto.draw = function(camera)
{
	var mtx  = this.get_transform();
	var cmtx = mat4.inverse( camera.get_transform());

	mat4.multiply( cmtx, mtx, mtx );

	this.shader.Bind();

	this.shader.SetUniform( "uPMatrix", camera.get_projection() );
	this.shader.SetUniform( "uMVMatrix", mtx );
	this.shader.SetUniform( "uColor", [1,1,1] );

	this.qb.Bind(   this.shader, { position : true, uv0 : true});
	this.qb.Draw(   this.shader );
	this.qb.Unbind( this.shader, {position : true, uv0 : true});

	this.shader.Unbind()
}
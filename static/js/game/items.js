Item = Factory( "Item", Entity, Transform, Intersection );

Item.proto.init = function( x, y ) {

	pp.log("Emitting new item @ " + x + "," + y );

	this.rotation = Math.random();

	this.set_position( x,y );
	this.set_scale([64,64]);

	this.shader = pp.ctx.Shaderlib.forward;
	this.qb     = new PXF.QuadBatch( pp.ctx );

	this.qb.Reset();
	this.qb.depth = 0;
	this.qb.AddCentered( 0,0,this.s[0],this.s[1] );
	this.qb.End();
};

Item.proto.update = function( dt ) 
{

}

Item.proto.draw = function( camera ) 
{
	var camera_pmtx = camera.get_projection();
	var camera_vmtx = camera.get_transform();
	mat4.inverse(camera_vmtx);

	var mtx = mat4.identity();

	mat4.translate(mtx, [this.x,this.y,0]);

	mat4.multiply( camera_vmtx, mtx, mtx );

	this.shader.Bind();
	this.shader.SetUniform("uMVMatrix", mtx );
	this.shader.SetUniform("uPMatrix", camera_pmtx);

	var bb = { position : true, uv0 : true, normal : false };

	this.qb.BindBuffers( this.shader, bb );
	this.qb.DrawBuffers( this.shader, bb );
	this.qb.UnbindBuffers( this.shader, bb );

	this.shader.Unbind();
}
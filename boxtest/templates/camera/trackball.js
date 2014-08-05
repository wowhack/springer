porcupine.instance.prototype.trackball_camera = function( config )
{
	config = config || {};

	if(!this.cameras) this.cameras = {};

	var camera = new PXF.TrackballCamera( this.ctx, null, config );
	var newid = guid("roam_camera");

	camera.Perspective( config.fov || 50, this.settings.aspect, config.near || 0.1, config.far || 1000);
	this.cameras[newid] = camera;

	return camera;
};
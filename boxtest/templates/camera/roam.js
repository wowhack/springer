
porcupine.instance.prototype.roam_camera = function( config )
{
	if(!this.cameras) this.cameras = {};
	
	config = config || {};

	var newid = guid("roam_camera");
	var camera = new PXF.GestureRoamCamera( this.ctx, null, config );

	camera.Perspective( config.fov || 50, this.settings.aspect, config.near || 0.1, config.far || 1000);

	this.ctx.RegisterKeyCallback("wasdqe", function(state, c) {
	    if(state != "up") {
	    	var wasd_speed  = this.transformMultiplier * 10;
	        var key_dir_lut = { 
	        	"W": [0.0, 0.0, -wasd_speed],
	        	"S": [0.0, 0.0, wasd_speed],
	        	"A": [-wasd_speed, 0.0, 0.0],
	        	"D": [wasd_speed, 0.0, 0.0],
	        	"E": [0,wasd_speed,0],
	        	"Q": [0,-wasd_speed,0]};
	        var move_vec    = vec3.create(key_dir_lut[c]);
	        this.ApplyMove(move_vec);
	    };
	}.bind( camera ));

	this.cameras[newid] = camera;
	return camera;
}

Springer = function( config )
{
	var screen = porcupine.instance.prototype.empty_screen.apply(null, arguments);
	screen.GAME_STATES = { STOPPED:1, PLAYING:2, PAUSED:3, LOADING:4 };

	screen.init = function( instance )
	{
		var offs = pp.settings.height / 1.8;
		this.camera = Camera.new( [0, pp.settings.width*1.3, offs, pp.settings.height*1.3 + offs] );
		//this.camera = Camera.new( [0, pp.settings.width, pp.settings.height, pp.settings.height + pp.settings.height ] );
		this.player = Player.new( 50,500,100 ); // start x,y,gravity

		this.camera.set_look_at( this.player );

		this.state = this.GAME_STATES.STOPPED;

		this.gamelevel = new Gamelevel();
	};

	screen.update = function( instance, dt, vis )
	{

		if (this.state == this.GAME_STATES.PLAYING)
		{

			this.player.update( this.gamelevel, spotify.position(), dt );
			// console.log("pruppdate");
		} else {
			console.log( "not playrign", this.state );
		}
		
	};

	screen.draw = function( instance, vis )
	{
		var gl = pp.ctx.gl;

		gl.viewport( 0, 0, pp.settings.width, pp.settings.height );
	    gl.disable(gl.DEPTH_TEST);
	    gl.enable(gl.BLEND);

	    gl.clearColor( 0.25, 0.25, 0.25, 1 );
	    gl.clear( gl.COLOR_BUFFER_BIT );

	    pp.ctx.FullscreenPass( pp.ctx.Shaderlib.forward, { uPMatrix : mat4.identity(), uMVMatrix : mat4.identity(), tex0 : pp.get_resource("bg_0") }, { normal : false, position : true, uv0 : true } );

	    this.gamelevel.draw( this.camera );
	    this.player.draw( this.camera );

	};

	screen.start_new = function ( uri ) {
		

		// todo clean up old level

		this.gamelevel = new Gamelevel( uri );
		hide_modal();

		this.gamelevel.amazing_grace( 0, 1000 );
		this.player.reset();
	}

	screen.restart = function () {

		console.log("time to start a new game:", spotify._track.uri );
		this.start_new( spotify._track.uri );
		
	};

	return screen;
}


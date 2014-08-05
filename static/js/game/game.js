
Springer = function( config )
{
	var screen = porcupine.instance.prototype.empty_screen.apply(null, arguments);
	screen.GAME_STATES = { STOPPED:1, PLAYING:2, PAUSED:3, LOADING:4 };

	screen.init = function( instance )
	{
		this.camera = Camera.new( [0, pp.settings.width, pp.settings.height, pp.settings.height + pp.settings.height ] );
		this.player = Player.new( 0,200,100 ); // start x,y,gravity

		this.camera.set_look_at( this.player );

		this.state = this.GAME_STATES.STOPPED;

		this.gamelevel = new Gamelevel();
	};

	screen.update = function( instance, dt, vis )
	{

		if (this.state == this.GAME_STATES.PLAYING)
			this.player.update( this.gamelevel, spotify.position(), dt );
		
	};

	screen.draw = function( instance, vis )
	{
		var gl = pp.ctx.gl;

		gl.viewport( 0, 0, pp.settings.width, pp.settings.height );
	    gl.disable(gl.DEPTH_TEST);
	    gl.enable(gl.BLEND);

	    gl.clearColor( 0.25, 0.25, 0.25, 1 );
	    gl.clear( gl.COLOR_BUFFER_BIT );

	    this.gamelevel.draw( this.camera );
	    this.player.draw( this.camera );

	};

	screen.start_new = function ( uri ) {
		

		// todo clean up old level

		this.gamelevel = new Gamelevel( uri );
		hide_modal();
	}

	screen.restart = function () {

		console.log("time to start a new game:", spotify._track.uri );
		this.start_new( spotify._track.uri );
		
	};

	return screen;
}


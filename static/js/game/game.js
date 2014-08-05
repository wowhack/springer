Springer = function( config )
{
	var screen = porcupine.instance.prototype.empty_screen.apply(null, arguments);
	screen.GAME_STATES = { STOPPED:1, PLAYING:2, PAUSED:3, LOADING:4 };

	screen.init = function( instance )
	{
		this.camera = Camera.new( [0, pp.settings.width, 0, pp.settings.height] );
		this.player = Player.new( 0,0,100 ); // start x,y,gravity

		this.camera.set_look_at( this.player );

		this.state = this.GAME_STATES.STOPPED;

		this.gamelevel = new Gamelevel();
	};

	screen.update = function( instance, dt, vis )
	{
		this.player.update( spotify.position() );
		
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

	};

	screen.start_new = function ( uri ) {
		

		// todo clean up old level

		this.level = new Gamelevel( uri );
	}

	return screen;
}

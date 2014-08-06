
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

		this.score_value = 1;

		this.reset_score();

		spotify.playing_change(function (arg) {
			if (!arg.playing) {
				game.state = screen.GAME_STATES.PAUSED;
			} else {
				game.state = screen.GAME_STATES.PLAYING;
			}
		});

		this.logoqb = new PXF.QuadBatch( pp.ctx );
		this.logoshader = new PXF.Shader( pp.ctx, "static/shaders/logo.vs", "static/shaders/logo.fs", true);
		this.logo_wobble = 0;
		this.particlerunner = new ParticleRunner();
	};

	screen.player_dead = function()
	{
		console.log("Oh he dead..");

		var amazing_race = this.gamelevel.amazing_grace( this.player.x, this.player.x + 400);

		
		this.player.y = amazing_race.h+200;
	}

	screen.update = function( instance, dt, vis )
	{
		pp.ctx.UpdateInput();
		pp.ctx._gestureState.Update();

		var gestures = pp.ctx.GetGestures();

		if (this.state == this.GAME_STATES.PLAYING)
		{
			if ( gestures.tap )
			{
				if (this.player.do_jump())
					this.particlerunner.create_korvparty(30, this.player.x, this.player.y);
			}

			this.player.update( this.gamelevel, spotify.position(), dt );
			// console.log("pruppdate");
		} else {
			console.log( "not playrign", this.state );
		}

		this.logo_wobble += dt*2;
		this.logoqb.Reset();
		this.logoqb.depth = 0;
		this.logoqb.AddCentered(120, 100, 512 / 3, 405 / 3, Math.sin(this.logo_wobble*2) * 0.1);
		this.logoqb.End();
		
	};

	screen.draw = function( instance, vis )
	{
		var gl = pp.ctx.gl;

		gl.viewport( 0, 0, pp.settings.width, pp.settings.height );
	    gl.disable(gl.DEPTH_TEST);
	    gl.disable(gl.CULL_FACE);
	    gl.enable(gl.BLEND);

	    gl.clearColor( 0.25, 0.25, 0.25, 1 );
	    gl.clear( gl.COLOR_BUFFER_BIT );

	    pp.ctx.FullscreenPass( pp.ctx.Shaderlib.forward, { uPMatrix : mat4.identity(), uMVMatrix : mat4.identity(), tex0 : pp.get_resource("bg_0") }, { normal : false, position : true, uv0 : true } );

	    this.gamelevel.draw( this.camera );
	    this.player.draw( this.camera );
	    this.particlerunner.update();
	    this.particlerunner.draw( this.camera );

	    	    // Draw logo
	    var logomat = mat4.identity();
	    mat4.scale(logomat, [1+Math.cos(this.logo_wobble)*0.1,1+Math.cos(this.logo_wobble)*0.1,1], logomat);

	    this.logoshader.Bind()
	    this.logoshader.SetUniform("pmtx", mat4.ortho(0, pp.settings.width, pp.settings.height, 0, -1, 1));
	    this.logoshader.SetUniform("vmtx", mat4.identity());
	    this.logoshader.SetUniform("mmtx", logomat);
	    this.logoshader.SetUniform("tex0", 0);
	    pp.get_resource("logo").Bind(0);
	    this.logoqb.BindBuffers( this.logoshader, { position : true, uv0 : true, normal: true});
		this.logoqb.DrawBuffers( this.logoshader );
		this.logoqb.UnbindBuffers( this.logoshader, {position : true, uv0 : true, normal: true});
		this.logoshader.Unbind();
	};

	screen.update_score = function() 
	{
		var score_span       = document.getElementById("score_span");
		score_span.innerHTML = this.score;
	}


	screen.tick_score = function() {
		this.score += this.score_value;
		this.update_score();
	};

	screen.reset_score = function() 
	{
		this.score = 0;
		this.update_score();
	}

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



Springer = function( config )
{
	var screen = porcupine.instance.prototype.empty_screen.apply(null, arguments);
	screen.GAME_STATES = { STOPPED:1, PLAYING:2, PAUSED:3, LOADING:4 };

	screen.init = function( instance )
	{
		var offs = pp.settings.height / 1.8;
		this.camera = Camera.new( [0, pp.settings.width*1.3, offs, pp.settings.height*1.3 + offs] );
		//this.camera = Camera.new( [0, pp.settings.width, pp.settings.height, pp.settings.height + pp.settings.height ] );
		this.player = Player.new( 50,500, 150 ); // start x,y,gravity

		this.camera.set_look_at( this.player );

		this.state = this.GAME_STATES.STOPPED;

		this.gamelevel = new Gamelevel();

		this.neg_score_div = document.getElementById("score_dead");

		this.score_value = 1;

		this.reset_score();

		spotify.playing_change(function (arg) {
			if (!arg.playing) {
				game.state = screen.GAME_STATES.PAUSED;
			} else {
				game.state = screen.GAME_STATES.PLAYING;
			}
		});
	};

	screen.player_dead = function()
	{
		console.log("Oh he dead..");

		var amazing_race = this.gamelevel.amazing_grace( this.player.x, this.player.x + 400);
		
		this.player.y = amazing_race.h+200;

		this.player.reset_blinking_timer = 0;

		this.score -= 500;

		this.do_neg_score = true;
		this.neg_score_div.style.top = "65px";
		this.neg_score_div.innerHTML = "-500";

		// this.neg_score_div = neg_score_div;
	}

	screen.update = function( instance, dt, vis )
	{
		pp.ctx.UpdateInput();
		pp.ctx._gestureState.Update();

		var gestures = pp.ctx.GetGestures();

		if (this.state == this.GAME_STATES.PLAYING)
		{
			if ( gestures.touch )
			{
				this.player.do_jump();
			}

			this.player.update( this.gamelevel, spotify.position(), dt );
			// console.log("pruppdate");
		} else {
			console.log( "not playrign", this.state );
		};

		if ( this.do_neg_score )
		{
			console.log("doing negative score..");

			// console.log(this.)

			this.neg_score_div.style.display = "block";

			if(this.neg_score_div_timer === undefined)
			{
				this.neg_score_div_timer = 0;
			} else {
				this.neg_score_div_timer += 0.025;
			};

			if ( this.neg_score_div_timer > 3.5 )
			{
				console.log("die");

				this.neg_score_div.style.top     = "15px";
				// this.neg_score_div.style.display = "none";

				this.neg_score_div.innerHTML = "";

				delete this.neg_score_div_timer;
				delete this.do_neg_score;
			};
		} else {
			// this.neg_score_div.style.top = "15px";
			// this.neg_score_div.style.top = "15px";
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


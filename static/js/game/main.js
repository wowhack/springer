var main = {}

main.init = function () {
	canvas = document.getElementById("glcanvas");

	pp     = new porcupine.instance( canvas, { debug : true } );
	pp.log("Porcupine viewer template example");

	spotify.models.player.addEventListener('change', function( arg ) {
		// did we change track? if so, create new room!
		// tmp_change_room( arg.data.track.uri );
		start_new_game( arg.data.track.uri );
		// console.warn("player changed");
	});

	/*
	 * Load templates and create screens
	 */
	porcupine.templates.get( [
			"static/js/game/factory.js",
			"static/js/game/gamefactories.js",
			"static/js/game/player.js",
			"static/js/game/gamelevel.js",
			"static/js/game/game.js",
			"static/js/game/camera.js"
			],
			function()
			{
			// här kan man ha kod

			// realtime analysis setup
			require(["static/js/game/realtime"],
				function(realtime) {
					realtime.init(spotify.models.player);
				});

			// todo: preloadscreen..

			game   = Springer({});

			camera = Camera.new( [0, pp.settings.width, 0, pp.settings.height] );
			player = Player.new( 0,0,100 ); // start x,y,gravity

			camera.set_look_at( player );

			spotify.models.player.load("track", function ( arg ) {
				start_new_game( arg.track.uri );
			});

			pp.push_screen(game);
			});

	// pp.push_screen( pp.preloadscreen( {
	// 		// "box_scene" : { loader: PXF.Scene, args : ["boxtest/scene.js"] }
	// 	}, function(progress) {
	// 			if (progress < 1.0)
	// 				return;
	// 		}) // pp.preloadscreen()
	// 	);

	pp.run();

	// start_new_game( spotify.track.uri ); // gamelevel

}

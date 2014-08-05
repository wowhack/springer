var main = {}

main.init = function () {
	canvas = document.getElementById("glcanvas");

	pp     = new porcupine.instance( canvas, { debug : true } );
	pp.log("Porcupine viewer template example");

	//spotify.models.player.addEventListener('change', function( arg ) {
	//	// did we change track? if so, create new room!
	//	// tmp_change_room( arg.data.track.uri );
	//	game.start_new( arg.data.track.uri );
	//	// console.warn("player changed");
	//});

	porcupine.templates.get( [ 
		"static/js/game/factory.js",
		"static/js/game/gamefactories.js" ], function() {

			porcupine.templates.get( [ 
				"static/js/game/player.js",
				"static/js/game/game.js",
				"static/js/game/camera.js",
				"static/js/game/gamelevel.js",
				"static/js/game/debugquad.js"
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

			//spotify.models.player.load("track", "position").done(function(p) {
			//	game.start_new( p.track.uri );
			//});

			pp.push_screen(game);
			});
		});

	pp.run();

	// start_new_game( spotify.track.uri ); // gamelevel

}

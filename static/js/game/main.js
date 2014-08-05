canvas = document.getElementById("glcanvas");

pp     = new porcupine.instance( canvas, { debug : true } );
pp.log("Porcupine viewer template example");

/* 
 * Load templates and create screens
 */

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

			// todo: preloadscreen..

			game   = Springer({}); 

			pp.push_screen(game);
		});
	});

// pp.push_screen( pp.preloadscreen( {
// 		// "box_scene" : { loader: PXF.Scene, args : ["boxtest/scene.js"] }
// 	}, function(progress) {
// 			if (progress < 1.0)
// 				return;
// 		}) // pp.preloadscreen()
// 	);

pp.run();
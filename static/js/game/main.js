canvas = document.getElementById("glcanvas");

pp     = new porcupine.instance( canvas, { debug : true } );
pp.log("Porcupine viewer template example");

/* 
 * Load templates and create screens
 */
porcupine.templates.get( [ 
	"static/js/game/factory.js",
	"static/js/game/gamefactories.js",
	"static/js/game/player.js",
	"static/js/game/game.js",
	"static/js/game/camera.js",
	"static/js/game/debugquad.js"
	], 
function()
{ 
	// här kan man ha kod

	// todo: preloadscreen..

	game   = Springer({}); 

	camera = Camera.new( [0, pp.settings.width, 0, pp.settings.height] );
	player = Player.new( 0,0,100 ); // start x,y,gravity

	camera.set_look_at( player );

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
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
					"static/js/game/debugquad.js",
					"static/js/game/particlefx.js",
					"static/js/game/items.js"
					], 
				function()
				{ 


					pp.push_screen( pp.preloadscreen( {
						// "box_scene" : { loader: PXF.Scene, args : ["boxtest/scene.js"] }
						"ground_0" : { loader: PXF.Texture, args : ["texture/ground_0.png"] },
						"jerry" : { loader: PXF.Texture, args : ["texture/jerry_lut.png", {magFilter : 9729, minFilter : 9729}] },
						"bg_0" : { loader: PXF.Texture, args : ["texture/bg_0.png"] },
						"korv_0" : { loader: PXF.Texture, args : ["texture/korv_red.png"] },
						"melonen" : { loader: PXF.Texture, args : ["texture/melonen.png"] },
						"korv_1" : { loader: PXF.Texture, args : ["texture/korv_rosa.png"] },
						"berg_stor" : { loader: PXF.Texture, args : ["texture/berg_stort.png"] },
						"berg_liten" : { loader: PXF.Texture, args : ["texture/berg_litet.png"] },
						"logo" : { loader: PXF.Texture, args : ["texture/logo.png"] },
						"snow_small" : { loader: PXF.Texture, args : ["texture/snow_small.png"] },
						"snow_lonely" : { loader: PXF.Texture, args : ["texture/snow_lonely.png"] }
					}, function(progress) {
							if (progress < 1.0)
								return;
							// här kan man ha kod

							// realtime analysis setup
							require(["static/js/game/realtime"],
								function(realtime) {
									realtime.init(spotify.models.player);
								});

							// todo: preloadscreen..

							game   = Springer({}); 
							spotify.track(function(arg) {
									var uri = arg.track.uri;
									echonest.handle_load_echonest(uri);
								});

							// camera = Camera.new( [0, pp.settings.width, 0, pp.settings.height] );
							// player = Player.new( 0, 0, 100 ); // start x,y,gravity

							// camera.set_look_at( player );

							//spotify.models.player.load("track", "position").done(function(p) {
							//	game.start_new( p.track.uri );
							//});

							pp.push_screen(game);
						}));
				});
			});

	pp.run();

	// start_new_game( spotify.track.uri ); // gamelevel

}

// dont be mad, i put function here..

function show_modal () {

	var elem = document.getElementById("stopped_modal");
	elem.style.display = "block";

}

function hide_modal () {

	var elem = document.getElementById("stopped_modal");
	elem.style.display = "none";

}

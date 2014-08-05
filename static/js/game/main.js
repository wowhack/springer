canvas = document.getElementById("glcanvas");

pp     = new porcupine.instance( canvas, { debug : true } );
pp.log("Porcupine viewer template example");

pp.push_screen( pp.preloadscreen( {
		// "box_scene" : { loader: PXF.Scene, args : ["boxtest/scene.js"] }
	}, function(progress) {
			if (progress < 1.0)
				return;
		
			/* 
			 * Load templates and create screens
			 */
			porcupine.templates.get( [ 
				"static/js/game/factory.js" ], 
			function()
			{ 
				// här kan man ha kod
			});

		}) // pp.preloadscreen()
	);

pp.run();
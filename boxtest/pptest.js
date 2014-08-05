{
	canvas = document.getElementById("glcanvas");
	pp     = new porcupine.instance( canvas, { debug : true } );

	pp.log("Porcupine viewer template example");

	pp.push_screen( pp.preloadscreen( {
		"box_scene" : { loader: PXF.Scene, args : ["boxtest/scene.js"] }
	}, function(progress) {
			if (progress < 1.0)
				return;
		
			/* 
			 * Load templates and create screens
			 */
			porcupine.templates.get( [ 
				"boxtest/templates/viewer/viewer.js",  
				"boxtest/templates/camera/roam.js",
				"boxtest/templates/camera/trackball.js" ], 
			function()
			{
				pp.log("Finished loading screen templates");

				// create temlated views
				viewer   = porcupine.templates.viewer( { background_color : [0.25,0.25,0.25,1] } );

				viewer.scene  = pp.get_resource("box_scene");
				// viewer.camera = pp.roam_camera({
				// 	dragMultiplier      : 5,
				// 	transformMultiplier : 0.01,
				// 	zoomMultiplier      : 100,
				// 	zoomFovMax          : 100,
				// 	move_inertia        : pp.get_device().platform == "iOS" ? [0.95,0.95,0.95] : [0.9,0.9,0.9],
				// 	orient_inertia      : pp.get_device().platform == "iOS" ? [0.9,0.9]:[0.7,0.7]
				// });
				viewer.camera = pp.trackball_camera({ 
					move_multiplier : pp.get_device().platform == "iOS" ? 1 : 1,
					move_inertia : pp.get_device().platform == "iOS" ? [0.95,0.95,0.95] : [0.9,0.9,0.9],
					orient_multiplier : pp.get_device().platform == "iOS" ? 0.1 : 0.05
				});

				viewer.camera.ApplyZoom( 0.7 );
				viewer.camera.ApplyLookat( [0,0,0] );

				pp.push_screen( viewer );
			});

		}) // pp.preloadscreen()
	);
	pp.run();
};
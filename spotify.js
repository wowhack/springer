var spotify = {}

curTime = function() {
	var date = new Date();
	return date.getTime();
}

update_track = function() {
	spotify.models.player.load("track", "position").done(function(p) {
		spotify._position = p.position;
		spotify._track = p.track;
		spotify._fetch_time = curTime();
	});
}

spotify.position = function() {
	var now = curTime();
	update_track();
	return spotify._position + (now - spotify._fetch_time);
}


require(['$api/models'], function(models) {
	spotify.models = models;

	var test = function () {
		console.log("position: " + spotify.position());
		setTimeout(test, 1000);
	};
	test();

	main.init();
});

var spotify = {}

curTime = function() {
	var date = new Date();
	return date.getTime();
}

update_track = function() {
	spotify.models.player.load("track", "position", "playing").done(function(p) {
		spotify._position = p.position;
		spotify._track = p.track;
		spotify._playing = p.playing;
		spotify._fetch_time = curTime();
	});
}

spotify.position = function() {
	if (!spotify._playing) {
		return spotify._position;
	}

	var now = curTime();
	if (now - spotify._fetch_time > 5000)
		update_track();
	return spotify._position + (now - spotify._fetch_time);
}

spotify.track = function(callback) {
	spotify.models.player.load("track").done(callback);
}

spotify.track_change = function(callback) {
	spotify.models.player.addEventListener("change:track", function() {
		spotify.track(callback);
	});
}

spotify.playing = function(callback) {
	spotify.models.player.load("playing").done(function(d) {
		callback(d);
	});
}

spotify.playing_change = function(callback) {
	spotify.models.player.addEventListener("change:playing", function() {
		spotify.playing(callback);
	});
}

spotify.pause = function() {
	spotify.models.player.pause();
}

spotify.play = function() {
	spotify.models.player.play();
}

require(['$api/models'], function(models) {
	spotify.models = models;

	update_track()

	main.init();
	echonest.init();

	//spotify.playing_change(function(b) {console.log("playing: ", b)});
	spotify.track_change(function() {
		// update the position now that we've changed track.
		spotify._fetch_time = 0;
		spotify.position();
	});

	spotify.playing_change(function (arg) {
		spotify._position = arg.position;
		spotify._playing = arg.playing;
		spotify._fetch_time = curTime();
	});
});

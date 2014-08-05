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
		callback(d.playing);
	});
}

spotify.playing_change = function(callback) {
	spotify.models.player.addEventListener("change:playing", function() {
		spotify.playing(callback);
	});
}

require(['$api/models'], function(models) {
	spotify.models = models;

	spotify.position();

	main.init();
	echonest.init();

	spotify.playing_change(function(b) {console.log("playing: ", b)});
});

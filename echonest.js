var echonest = {}

fetch_uri = function(uri, callback) {
	console.log("fetching uri: " + uri);

	var xmlhttp;
	if (window.XMLHttpRequest) {
		xmlhttp = new XMLHttpRequest();
	} else {
		xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	}

	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
			var data = JSON.parse(xmlhttp.responseText);
			callback(data);
		}
	}

	xmlhttp.open("GET", uri, true);
	xmlhttp.send();
}

fetch_song_id = function(song, song_id) {
	var song_url = "http://developer.echonest.com/api/v4/track/profile?api_key=KL9ORZ8ADN2NFYSGZ&id=spotify:track:" + song_id + "&format=json&bucket=audio_summary";

	fetch_uri(song_url, function(data) {
		song.data = data;

		if (data["response"]["status"]["code"] != 0) {
			console.log("unable to fetch echonest data for " + song_url);
			song.available = false;
		} else {
			song.artist = data["response"]["track"]["artist"];
			song.analysis_url = data["response"]["track"]["audio_summary"]["analysis_url"];
			song.available = true;

			fetch_uri(song.analysis_url, function(data) {
				song.analysis_data = data;
				song.beats = data["beats"];
				song.meta = data["meta"];
				song.track = data["track"];
				song.bars = data["bars"];
				song.tatums = data["tatums"];
				song.sections = data["sections"];
				song.segments = data["segments"];

				if (song.completed_callback != undefined) {
					song.completed_callback(song);
				}
			});
		}
	});
}

echonest.song = function(uri, completed_callback) {
	this.uri = uri;
	this.data = undefined;
	this.completed_callback = completed_callback;

	fetch_song_id(this, this.uri);

	return this;
}

echonest.handle_load_echonest = function(uri) {
	if (typeof(game) == "undefined")
		return;
	spotify.pause();
	game.state = game.GAME_STATES.LOADING;
	echonest.current_song = new echonest.song(uri, function() {
		console.log("echonest ready with " + uri);
		spotify.track(function () {
			game.start_new(uri);
			game.state = game.GAME_STATES.PLAYING;
			spotify.play();
		});
	});
};

echonest.init = function () {
	// initial loading of echonest data.
	spotify.track(function(arg) {
		var uri = arg.track.uri;
		echonest.handle_load_echonest(uri);
	});

	// load of echonest data when song changes.
	spotify.track_change(function (arg) {
		var uri = arg.track.uri;
		echonest.handle_load_echonest(uri);
	});
}

var spotify = {}

spotify.position = function() {
	
}

require(['$api/models'], function(models) {
	spotify.models = models;

	main.init();
});

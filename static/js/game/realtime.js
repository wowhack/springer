require([
  '$api/models',
  '$api/audio',
], function (models, audio) {
  'use strict';

/*
There are three events:
	- audio: Triggered when a frame of audio data is ready.
	field: {boolean} playing Whether audio is being played or buffered. 
	field: {number} deadline Timestamp of when the event will be audible. 
	field: {number} base Frequency interval of the fundamental bands.
	field: {Object} audio Lists of numbers for audio data.
		This object contains 2 objects, namely "spectrum" and "wave", each with "left" and "right" arrays.
		A spectrum array is the loudness of each frequency band (as defined in opt_bands) in decibel, a 
		float with range from -96 (quietest level represented by 16 bit audio) to +12. A wave array is the 
		amplitude of 256 samples of audio (down sampled to 11Khz), a float from 0 to 1.
	- pause: Triggered when the music pauses, but buffer remains full.
	- reset: Triggered when the audio buffer resets (skip, seek, etc.). 
*/
  var audio_event_handlers = {
    audio: function (event) {
      console.log(event)
      return true;
    },
    pause: function (event) {
      return true;
    },
    reset: function (event) {
      return true;
    }
  };

  var init = function() {
  	var analyzer = audio.RealtimeAnalyzer.forPlayer(models.player, audio.BANDS31);
    analyzer.addEventListener("audio", audio_event_handlers.audio);
    analyzer.addEventListener("pause", audio_event_handlers.pause);
    analyzer.addEventListener("reset", audio_event_handlers.reset);
  }

  exports.init = init
});
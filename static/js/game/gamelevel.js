var gamelevel = function( uri ) {

	// build (or request from game server) track data

	// TEMP, use a static track
	this.track_segments = {
		{0, 200, h=20, t=1}, // { start, end, h = height, t = segment_type }
		{250, 300, h=25, t=1},
		{370, 600, h=30, t=1},
		{700, 1000, h=20, t=2},
		{1050, 1400, h=30, t=2}
	};

}

gamelevel.prototype.update = function ( player_position ) { // does not use time delta, our time is fixed at all times...
	// do nothing
}


gamelevel.prototype.draw = function( camera ) {
	// do nothing
};
function point_in_interval( p, x1, x2 )
{
	if (p >= x1) {
		if (p <= x2) {
			return 0
		}
		return -1
	}
	return 1
}

function segments_overlap( s1, s2 )
{
	// check if segment start is in "view"
	var s = point_in_interval(s1[1], s2[1], s2[2])
	if (s == 0) {
		return 0
	}

	// check if segment end is in "view"
	s = point_in_interval(s1[2], s2[1], s2[2])
	if (s == 0) {
		return 0
	}
	
	// check if "view" start is in segment
	// (special case where segment spawns larger than width of view)
	return point_in_interval(s2[1], s1[1], s1[2])

}

var gamelevel = function( uri ) {

	// build (or request from game server) track data

	// TEMP, use a static track
	this.track_segments = [
		{s: 0, e: 200, h: 20, t: 1}, // { start, end, h = height, t = segment_type }
		{s: 250, e: 300, h: 25, t: 1},
		{s: 370, e: 600, h: 30, t: 1},
		{s: 700, e: 1000, h: 20, t: 2},
		{s: 1050, e: 1400, h: 30, t: 2}
	];

}

gamelevel.prototype.update = function ( player_position ) { // does not use time delta, our time is fixed at all times...
	// do nothing
}


gamelevel.prototype.draw = function( camera ) {
	// do nothing
};

gamelevel.prototype.query_segments = function ( self, view ) {
	
	// todo build binary search tree instead of binary list search below

	var found_segments = [];
	var possibility_stack = [];
	var checked = {};

	// binary search to find first hit
	//for i,v in ipairs( this.segments ) do
	var bound_size = this.segments.length;
	var bound_s = 0;
	var bound_f = bound_size;
	bound_size = Math.ceil( bound_size / 2 );

	var i = bound_size;
	var last_i = 0; // whoops, this might need to change into -1 since we are not using Lua
	var last_last_i = 0;

	// while (true) do
	while (true)
	{

		bound_size = Math.max( Math.ceil(bound_size / 2), 1);

		var v = this.segments[i];
		var s = segments_overlap( v, view );
		if (s == 0) {
			//table.insert(possibility_stack, i)
			possibility_stack.push(i);
			break;
		}

		if (s < 0) {
			i = ( i + bound_size );
		} else {
			i = ( i - bound_size );
		}

		// console.log("i " .. i )

		if ( i == last_last_i || i < bound_s || i > bound_f) {
			console.log("no segments found");
			break;
		}

		last_last_i = last_i;
		last_i = i;

	}

	// collect nearby segments
	// console.log("#possibility_stack:", #possibility_stack)
	// while (#possibility_stack > 0) do
	while (possibility_stack.length > 0) {

		var i = possibility_stack.pop();
		if (!checked[i]) {
			checked[i] = true;

			if (i >= 1 && i <= this.segments.length) {

				//console.log(i)
				// table.insert( found_segments, this.segments[i])
				var v = this.segments[i];
				var s = segments_overlap( v, view );
				if (s == 0) {
					found_segments[i] = v;
				}

				// add siblings
				possibility_stack.push(i + 1);
				possibility_stack.push(i - 1);


			}
			
		}

	}

	return found_segments;

}
Player = Factory( "Player", Entity, Transform, Intersection );
Player.proto.init = function( x,y, gravity ) {
	pp.log("Placing new player @ " + x + "," + y );
};

Player.proto.update = function ( track_pos ) {
	this.x = track_pos / 2;
	// console.log(this.x);
}

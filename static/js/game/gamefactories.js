// Entity : basic object state handling
Entity  = { 
	init   : function() { pp.log("Initializing " + this.type + " " + this.uid); },
	draw   : function() {}, 
	update : function() {} 
}

Transform    = {
	x : 0,
	y : 0,
	r : 0,
	s : [1, 1],

	set_position  : function(x,y) { this.x=x;this.y=y; },
	get_position  : function()    { return [this.x,this.y] },
	set_scale     : function(s)   { this.s = s },
	get_scale     : function()    { return this.s },
	set_rotation  : function(r)   { this.r = r },
	get_rotation  : function()    { return this.r },
	get_transform : function()    { 
	
		var mtx = mat4.identity();
		mat4.translate( mtx, [ this.x,this.y,0] );
		mat4.rotate( mtx, this.r, [0,0,1] );
		mat4.scale( mtx, [ this.s[0], this.s[1], 1 ] );

		return mtx
	},

	translate  : function( dx,dy ) {
		this.x = this.x + dx
		this.y = this.y + dy
	}
};

// intersection between box1 and box2
Intersection   = {
	intersect_box : function(box1,box2)
	{
		if ( box1[2] < box2[0] || box1[0] > box2[2] ||
		     box1[3] < box2[1] || box1[1] > box2[3] )
			return false;

		return true;
	}
}
// Entity : basic object state handling
Entity  = { 
	init   : function() { pp.log("Initializing " + this.type + " " + this.uid); },
	draw   : function() {}, 
	update : function() {} 
}

Transform    = {
	// x = 0,
	// y = 0,
	// r = 0,
	// s = {1, 1},
	// set_position  = function(self,x,y) self.x=x;self.y=y; end,
	// get_position  = function(self) return {self.x,self.y} end,
	// set_scale     = function(self,s) self.s = s end,
	// get_scale     = function(self) return self.s end,
	// set_rotation  = function(self,r) self.r = r end,
	// get_rotation  = function(self) return self.r end,
	// get_transform = function(self)
	
	// 	local mtx = mat4.identity()
	// 	mat4.translate( mtx, {self.x,self.y,0} )
	// 	mat4.rotate( mtx, self.r, {0,0,1} )
	// 	mat4.scale( mtx, { self.s[1], self.s[2], 1 } )

	// 	return mtx
	// end,
	// translate  = function(self,dx,dy) 
	// 	self.x = self.x + dx
	// 	self.y = self.y + dy
	// end
};

// 
Intersection   = {
	// intersect_box = function(self,box1,box2)
	// 	if ( box1[3] < box2[1] or box1[1] > box2[3] or
	// 	     box1[4] < box2[2] or box1[2] > box2[4] ) then
	// 		return false
	// 	end

	// 	return true
	// end
}
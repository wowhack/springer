
Camera = Factory( "Camera", Entity, Transform )
Camera.proto.init = function( view ) {
	this.view = view;
	this._get_transform = this.get_transform;

	this.get_transform = function()
	{
		var old_x = this.x;
		var old_y = this.y;

		if ( this.look_at )
		{
			this.x = old_x + this.look_at.x - this.view[1] / 2;
			this.y = old_y + this.look_at.y - this.view[3] / 2;
		};

		var transform = this._get_transform();

		this.x = old_x;
		this.y = old_y;

		return transform;
	};

	this.get_screen_coords = function() {
		var inv_pmtx = mat4.create( this.get_transform() );

		mat4.inverse( inv_pmtx );
		mat4.multiply( this.get_projection(), inv_pmtx, inv_pmtx);
		mat4.inverse(inv_pmtx);

		var minp = [-1,-1,0];
		var maxp = [1,1,0];

		mat4.multiplyVec3(inv_pmtx,minp);
		mat4.multiplyVec3(inv_pmtx,maxp);

		return [ minp, maxp ];
	};
	
	this.get_projection = function() {
		this.projection = mat4.ortho( this.view[0], this.view[1], this.view[2], this.view[3],-1,1);
		return mat4.create(this.projection);
	};

	this.set_look_at = function( object ) {
		this.look_at = object
	};
};

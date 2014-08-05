Springer = function( config )
{
	var screen = porcupine.instance.prototype.empty_screen.apply(null, arguments);

	screen.init = function( instance )
	{
	};

	screen.update = function( instance, dt, vis )
	{
		
	};

	screen.draw = function( instance, vis )
	{};

	screen.start_new = function ( uri ) {
		

		// todo clean up old level

		this.level = new gamelevel( uri );
	}

	return screen;
}
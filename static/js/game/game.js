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

	return screen;
}
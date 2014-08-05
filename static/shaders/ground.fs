precision mediump float;uniform sampler2D tex0;
uniform float vis;
uniform float cap_width;
uniform float cap_height;
uniform vec2 tex_size;

varying float block_width;
varying float block_height;
varying vec2 v_uv0;
varying vec3 v_color;

void main()
{
	//gl_FragColor = texture2D( tex0, v_uv0 );
	//return;

	//float block_width = tex_size.y;

	// recalc texture coords
	vec2 new_uv = v_uv0;
	// new_uv.s = (new_uv.s * block_width) * 0.001;
	new_uv.s = (new_uv.s * block_width); // pixels
	//new_uv.t = (new_uv.t * block_height); // pixels
	//new_uv.t = (new_uv.t * block_width); // pixels

	/*if (new_uv.t < block_height - cap_height)
	{
		//gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
		//return;
		new_uv.t = mod(new_uv.t / cap_height, 0.5);
	} else {
		new_uv.t = (new_uv.t - (block_height - cap_height)) / (cap_height);
	}*/
	//float lol_internet = new_uv.s * 2.0 / 2.0;
	//if (lol_internet < 0.5)
	//if ( 0.5 >= v_uv0.s )
	// {
	// 	//gl_FragColor = texture2D( tex0, new_uv );
	// 	gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
	// 	return;
	// }

	if (new_uv.s < cap_width)
	{
		float cappy = cap_width / tex_size.s;




		new_uv.s = new_uv.s / cap_width; // [ 0..1 ]
		new_uv.s = new_uv.s * cappy;
		gl_FragColor = texture2D( tex0, new_uv );
		return;

	}
	else if (new_uv.s > block_width - cap_width)
	{
		float cappy = cap_width / tex_size.s;

		new_uv.s = (new_uv.s - (block_width - cap_width)) / cap_width; // [ 0..1 ]
		//gl_FragColor = vec4(new_uv, 0.0, 1.0);
		//return;

		new_uv.s = (1.0 - cappy) + new_uv.s * cappy;
		// new_uv.s = (new_uv.s - (block_width - cap_width)) / cap_width;
		gl_FragColor = texture2D( tex0, new_uv );
		return;
	}

	// new_uv.s *= 0.003;
	new_uv.s = 0.5; //mod(new_uv.s, 1.0);

	//gl_FragColor = vec4(1.0, 0.0, 0.0, 0.0);
	gl_FragColor = texture2D( tex0, new_uv );
	//gl_FragColor = vec4( v_uv0, 0.0, 1.0 );
	// gl_FragColor.rgb = texcol.rgb * v_color;// + vec4(0.4, 0.0, 0.0, 0.0);
	//gl_FragColor.rgb = v_color;// + vec4(0.4, 0.0, 0.0, 0.0);
	// gl_FragColor.a = texcol.a * vis;
	//gl_FragColor.a = 1.0;
	//gl_FragColor = vec4(color, 1.0);
}
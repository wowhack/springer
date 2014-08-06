precision mediump float;uniform sampler2D tex0;
uniform float vis;
//uniform float cap_width;
//uniform float cap_height;
uniform vec2 tex_size;

//varying float block_width;
//varying float block_height;
varying vec2 v_uv0;
varying vec3 v_color;
varying float height;

uniform float backblend;

void main()
{
	//ff ce cd

	vec4 texcolor = texture2D( tex0, v_uv0 );
	if (backblend > 0.5) {
		vec4 mixed = mix(vec4(1.0, 0.8, 0.8, 1.0), texcolor, height * 0.95);

		mixed.a = texcolor.a;

		gl_FragColor = mixed;
	} else {
		gl_FragColor = texcolor;
	}

}

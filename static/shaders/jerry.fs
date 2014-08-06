precision mediump float;

uniform sampler2D tex0;
uniform float vis;
uniform vec2 tex_size;

uniform float alpha;

varying vec2 v_uv0;

void main()
{
	// gl_FragColor = vec4( v_uv0, 0.0, 1.0 );
	// gl_FragColor = vec4( v_uv0, 0.0, 1.0 );

	vec4 sample = texture2D( tex0, v_uv0 );



	gl_FragColor = sample * alpha;
}
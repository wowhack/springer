precision mediump float;

varying vec2 v_uv0;

uniform float alpha;
uniform sampler2D tex0;

void main()
{
	vec4 sample = texture2D(tex0, v_uv0 );

	gl_FragColor = sample * alpha;
}
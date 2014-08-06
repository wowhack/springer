precision mediump float;uniform sampler2D tex0;
uniform float vis;
uniform vec2 tex_size;

varying vec2 v_uv0;
varying vec3 v_color;

void main()
{
	//ff ce cd

	vec4 texcolor = texture2D( tex0, v_uv0 );
	gl_FragColor = texcolor;
}

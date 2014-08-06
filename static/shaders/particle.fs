precision mediump float;uniform sampler2D tex0;
uniform float vis;
uniform float fade;
uniform vec2 tex_size;

varying float block_width;
varying float block_height;
varying vec2 v_uv0;
varying vec3 v_color;

void main()
{
	gl_FragColor = texture2D( tex0, v_uv0 );
	return;
}
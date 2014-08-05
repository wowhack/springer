precision mediump float;

attribute vec3 position;
attribute vec2 uv0;
attribute vec3 normal;

uniform mat4 pmtx;
uniform mat4 vmtx;
uniform mat4 mmtx;

varying float block_width;
varying float block_height;
varying vec2 v_uv0;
varying vec3 v_color;

void main()
{
	// v_uv0   = vec2(uv0.s, uv0.t);
	v_uv0   = uv0;
	//v_color = normal;
	block_width = normal.x;
	block_height = normal.y;

	// gl_Position = vec4(position.xyz, 1.0);
	gl_Position = pmtx * vmtx * mmtx * vec4(position.xyz, 1.0);
	
}
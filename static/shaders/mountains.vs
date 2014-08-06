precision mediump float;

attribute vec3 position;
attribute vec2 uv0;
attribute vec3 normal;

uniform mat4 mmtx;
uniform mat4 world;

varying vec2 v_uv0;
varying vec3 v_color;
varying float height;

void main()
{
	// v_uv0   = vec2(uv0.s, uv0.t);
	v_uv0   = uv0;
	//v_color = normal;
	//block_width = normal.x;
	//block_height = normal.y;

	// gl_Position = vec4(position.xyz, 1.0);
	//gl_Position = pmtx * vmtx * mmtx * vec4(position.xyz, 1.0);
	gl_Position = mmtx * world * vec4(position.xyz, 1.0);
	
	height = uv0.y;
}

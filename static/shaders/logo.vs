precision mediump float;

attribute vec3 position;
attribute vec2 uv0;

uniform mat4 pmtx;
uniform mat4 vmtx;
uniform mat4 mmtx;

varying vec2 v_uv0;

void main()
{
	v_uv0   = vec2(uv0.s, 1.0 - uv0.t);
	// v_uv0   = uv0;
	// gl_Position = vec4(position.xyz, 1.0);
	// gl_Position = vec4(position.xyz, 1.0);
	gl_Position = pmtx * vmtx * mmtx * vec4(position.xyz, 1.0);
	
}
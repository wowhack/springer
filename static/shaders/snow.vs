precision mediump float;

attribute vec3 position;
attribute vec2 uv0;
attribute vec3 normal;

uniform mat4 mmtx;
uniform mat4 world;

varying vec2 v_uv0;
varying vec3 v_color;

void main()
{
	v_uv0   = uv0;
	gl_Position = mmtx * world *  vec4(position.xyz, 1.0);
}

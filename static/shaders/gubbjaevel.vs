precision mediump float;

attribute vec3 position;
attribute vec2 uv0;

uniform mat4 uPMatrix;
uniform mat4 uMVMatrix;

varying vec2 v_uv0;

void main()
{
	v_uv0       = uv0;
	gl_Position = uPMatrix * uMVMatrix * vec4(position.xyz, 1.0);	
}
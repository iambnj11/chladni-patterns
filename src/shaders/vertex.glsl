uniform float uN;
uniform float uM;
uniform float uTime;
uniform float uRenderMode;
uniform float uAmplitude;
uniform float uZStatic;
uniform float uZHeight;

varying vec2 vUv;
varying float vZ;

float chladni(vec2 p, float n, float m) {
  return cos(n * 3.14159265 * p.x) * cos(m * 3.14159265 * p.y)
       - cos(m * 3.14159265 * p.x) * cos(n * 3.14159265 * p.y);
}

void main() {
  vUv = uv;
  vec2 p = uv * 2.0 - 1.0;
  float z = chladni(p, uN, uM);
  vZ = z;

  vec3 pos = position;
  if (uRenderMode > 0.5) {
    float disp;
    if (uZStatic > 0.5) {
      disp = uZHeight;
    } else {
      disp = uAmplitude * sin(uTime * 1.5);
    }
    pos.z = z * disp;
  }
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}

uniform float uN;
uniform float uM;
uniform float uTime;
uniform float uAmplitude;
uniform float uZStatic;
uniform float uZHeight;

varying float vZ;

float chladni(vec2 p, float n, float m) {
  return cos(n * 3.14159265 * p.x) * cos(m * 3.14159265 * p.y)
       - cos(m * 3.14159265 * p.x) * cos(n * 3.14159265 * p.y);
}

void main() {
  float z = chladni(position.xy, uN, uM);
  vZ = z;

  vec3 pos = position;
  float disp;
  if (uZStatic > 0.5) {
    disp = uZHeight;
  } else {
    disp = uAmplitude * sin(uTime * 1.5);
  }
  pos.z = z * disp;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  gl_PointSize = 2.0;
}

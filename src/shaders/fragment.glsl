uniform float uN;
uniform float uM;
uniform float uTime;
uniform float uThreshold;
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform vec3 uColorC;
uniform float uRenderMode;

varying vec2 vUv;
varying float vZ;

void main() {
  float z = vZ;

  float nodal = 1.0 - smoothstep(0.0, uThreshold, abs(z));

  float pulse = 0.5 + 0.5 * sin(uTime * 2.0 + z * 6.0);

  float t = abs(z);
  vec3 col = mix(uColorA, uColorB, smoothstep(0.0, 0.5, t));
  col = mix(col, uColorC, smoothstep(0.5, 1.0, t));

  col = mix(col, uColorB * 1.4, nodal * (0.5 + 0.5 * pulse));

  vec2 uv2 = vUv * 2.0 - 1.0;
  float vign = 1.0 - smoothstep(0.6, 1.4, length(uv2));
  col *= vign;

  gl_FragColor = vec4(col, 1.0);
}

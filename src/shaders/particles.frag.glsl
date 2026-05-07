uniform float uThreshold;
uniform vec3 uColorB;

varying float vZ;

void main() {
  // Circular point shape
  vec2 c = gl_PointCoord - 0.5;
  if (length(c) > 0.5) discard;

  // Bright on nodal lines (|z| near 0), dim elsewhere — preserves the sand aesthetic
  float nodal = 1.0 - smoothstep(0.0, uThreshold * 2.0, abs(vZ));
  float alpha = mix(0.04, 0.9, nodal);

  gl_FragColor = vec4(uColorB, alpha);
}

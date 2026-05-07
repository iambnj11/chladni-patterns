import * as THREE from 'three';
import { scene } from './scene.js';
import { uniforms } from './mesh.js';
import particleVert from './shaders/particles.vert.glsl?raw';
import particleFrag from './shaders/particles.frag.glsl?raw';

let particleSystem = null;

export function buildParticles() {
  removeParticles();

  const count = 60000;
  const positions = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    positions[i * 3]     = Math.random() * 2 - 1;
    positions[i * 3 + 1] = Math.random() * 2 - 1;
    positions[i * 3 + 2] = 0;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const mat = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: particleVert,
    fragmentShader: particleFrag,
    transparent: true,
    depthWrite: false,
  });

  particleSystem = new THREE.Points(geo, mat);
  scene.add(particleSystem);
}

export function removeParticles() {
  if (!particleSystem) return;
  scene.remove(particleSystem);
  particleSystem.geometry.dispose();
  particleSystem.material.dispose();
  particleSystem = null;
}

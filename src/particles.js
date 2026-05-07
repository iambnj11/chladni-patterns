import * as THREE from 'three';
import { scene } from './scene.js';
import { state } from './state.js';
import { PALETTES } from './constants.js';

let particleSystem = null;

export function buildParticles() {
  removeParticles();

  const N = state.n, M = state.m;
  const count = 60000;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  let idx = 0;

  function chladni(x, y) {
    return Math.cos(N * Math.PI * x) * Math.cos(M * Math.PI * y)
         - Math.cos(M * Math.PI * x) * Math.cos(N * Math.PI * y);
  }

  let attempts = 0;
  while (idx < count && attempts < count * 20) {
    attempts++;
    const px = Math.random() * 2 - 1;
    const py = Math.random() * 2 - 1;
    const z = chladni(px, py);
    if (Math.abs(z) < state.threshold * 1.5) {
      positions[idx * 3]     = px;
      positions[idx * 3 + 1] = py;
      positions[idx * 3 + 2] = 0;
      const pal = PALETTES[state.palette];
      colors[idx * 3]     = pal[1][0];
      colors[idx * 3 + 1] = pal[1][1];
      colors[idx * 3 + 2] = pal[1][2];
      idx++;
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions.slice(0, idx * 3), 3));
  geo.setAttribute('color', new THREE.BufferAttribute(colors.slice(0, idx * 3), 3));

  particleSystem = new THREE.Points(geo, new THREE.PointsMaterial({
    size: 0.003,
    vertexColors: true,
    transparent: true,
    opacity: 0.85,
  }));

  scene.add(particleSystem);
}

export function removeParticles() {
  if (!particleSystem) return;
  scene.remove(particleSystem);
  particleSystem.geometry.dispose();
  particleSystem.material.dispose();
  particleSystem = null;
}

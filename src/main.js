import * as THREE from 'three';
import { renderer, scene, camera } from './scene.js';
import { uniforms, mesh } from './mesh.js';
import { controls } from './controls.js';
import { state } from './state.js';
import { freqToMode } from './constants.js';
import { getDominantFrequency } from './audio.js';
import { syncFreqUI } from './ui.js';
import { isTweenActive } from './presets.js';
import { buildParticles } from './particles.js';

// Initialize default render state (particles)
mesh.visible = false;
buildParticles();

const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  const dt = clock.getDelta();
  state.time += dt * state.speed;
  uniforms.uTime.value = state.time;

  if (state.micActive) {
    const domFreq = getDominantFrequency();
    if (domFreq !== null) {
      const clampedFreq = Math.max(20, Math.min(2000, domFreq));
      state.freq = clampedFreq;
      const { n, m } = freqToMode(clampedFreq);
      state.targetN = n;
      state.targetM = m;
      syncFreqUI(clampedFreq, n, m);
    }
  }

  // Skip lerp while GSAP preset tween owns state.n/m
  if (!isTweenActive()) {
    const lerpSpeed = 2.5 * dt;
    state.n += (state.targetN - state.n) * lerpSpeed;
    state.m += (state.targetM - state.m) * lerpSpeed;
  }
  uniforms.uN.value = state.n;
  uniforms.uM.value = state.m;

  controls.update();
  renderer.render(scene, camera);
}

animate();

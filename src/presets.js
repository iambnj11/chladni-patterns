import gsap from 'gsap';
import { state } from './state.js';
import { buildParticles } from './particles.js';

export const PRESETS = [
  { name: 'A4',       n: 2, m: 3 },
  { name: 'Octave',   n: 1, m: 2 },
  { name: 'Cross',    n: 1, m: 3 },
  { name: 'Harmonic', n: 3, m: 5 },
  { name: 'Star',     n: 4, m: 4 },
  { name: 'Radial',   n: 6, m: 6 },
  { name: 'Web',      n: 5, m: 7 },
];

let _isTweening = false;
export function isTweenActive() { return _isTweening; }

export function applyPreset(preset) {
  state.targetN = preset.n;
  state.targetM = preset.m;

  // Particles have baked positions — snap immediately rather than animating invisibly
  if (state.renderMode === 'particles') {
    state.n = preset.n;
    state.m = preset.m;
    buildParticles();
    return;
  }

  _isTweening = true;
  gsap.killTweensOf(state);
  gsap.to(state, {
    n: preset.n,
    m: preset.m,
    duration: 1.2,
    ease: 'power2.inOut',
    onComplete() {
      _isTweening = false;
    },
  });
}

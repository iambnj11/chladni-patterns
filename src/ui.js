import { state } from './state.js';
import { uniforms, mesh } from './mesh.js';
import { buildParticles, removeParticles } from './particles.js';
import { startMic, stopMic } from './audio.js';
import { PALETTES, freqToMode } from './constants.js';
import { PRESETS, applyPreset } from './presets.js';

const freqSlider   = document.getElementById('freq-slider');
const nSlider      = document.getElementById('n-slider');
const mSlider      = document.getElementById('m-slider');
const threshSlider = document.getElementById('thresh-slider');
const speedSlider  = document.getElementById('speed-slider');
const freqVal      = document.getElementById('freq-val');
const nVal         = document.getElementById('n-val');
const mVal         = document.getElementById('m-val');
const threshVal    = document.getElementById('thresh-val');
const speedVal     = document.getElementById('speed-val');
const freqDisplay  = document.getElementById('freq-display');
const modeDisplay  = document.getElementById('mode-display');

function updateFreqDisplay(hz) {
  freqDisplay.innerHTML = `${Math.round(hz)} <span>Hz</span>`;
  freqVal.textContent = `${Math.round(hz)} Hz`;
}

function setFrequency(hz) {
  state.freq = hz;
  const { n, m } = freqToMode(hz);
  state.targetN = n;
  state.targetM = m;
  updateFreqDisplay(hz);
  modeDisplay.textContent = `mode n=${n.toFixed(1)} m=${m.toFixed(1)}`;
}

export function syncFreqUI(hz, n, m) {
  freqSlider.value = hz;
  nSlider.value = n;
  mSlider.value = m;
  nVal.textContent = n.toFixed(1);
  mVal.textContent = m.toFixed(1);
  updateFreqDisplay(hz);
  modeDisplay.textContent = `mode n=${n.toFixed(1)} m=${m.toFixed(1)}`;
}

freqSlider.addEventListener('input', e => {
  setFrequency(+e.target.value);
  nSlider.value = state.targetN;
  mSlider.value = state.targetM;
  nVal.textContent = state.targetN.toFixed(1);
  mVal.textContent = state.targetM.toFixed(1);
  if (state.renderMode === 'particles') buildParticles();
});

nSlider.addEventListener('input', e => {
  state.targetN = +e.target.value;
  nVal.textContent = (+e.target.value).toFixed(1);
  if (state.renderMode === 'particles') buildParticles();
});

mSlider.addEventListener('input', e => {
  state.targetM = +e.target.value;
  mVal.textContent = (+e.target.value).toFixed(1);
  if (state.renderMode === 'particles') buildParticles();
});

threshSlider.addEventListener('input', e => {
  state.threshold = +e.target.value;
  threshVal.textContent = (+e.target.value).toFixed(2);
  uniforms.uThreshold.value = state.threshold;
  if (state.renderMode === 'particles') buildParticles();
});

speedSlider.addEventListener('input', e => {
  state.speed = +e.target.value;
  speedVal.textContent = (+e.target.value).toFixed(1);
});

const zHeightRow    = document.getElementById('z-height-row');
const zHeightSlider = document.getElementById('zheight-slider');
const zHeightVal    = document.getElementById('zheight-val');

document.querySelectorAll('[data-zmode]').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('[data-zmode]').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    state.zMode = btn.dataset.zmode;
    uniforms.uZStatic.value = state.zMode === 'manual' ? 1.0 : 0.0;
    zHeightRow.style.display = state.zMode === 'manual' ? 'flex' : 'none';
  });
});

zHeightSlider.addEventListener('input', e => {
  uniforms.uZHeight.value = +e.target.value;
  zHeightVal.textContent = (+e.target.value).toFixed(2);
});

document.querySelectorAll('[data-mode]').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('[data-mode]').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    state.renderMode = btn.dataset.mode;
    uniforms.uRenderMode.value = state.renderMode === 'relief' ? 1.0 : 0.0;
    mesh.visible = state.renderMode !== 'particles';
    if (state.renderMode === 'particles') buildParticles();
    else removeParticles();
  });
});

document.querySelectorAll('[data-palette]').forEach(sw => {
  sw.addEventListener('click', () => {
    document.querySelectorAll('[data-palette]').forEach(s => s.classList.remove('active'));
    sw.classList.add('active');
    state.palette = +sw.dataset.palette;
    const pal = PALETTES[state.palette];
    uniforms.uColorA.value.set(...pal[0]);
    uniforms.uColorB.value.set(...pal[1]);
    uniforms.uColorC.value.set(...pal[2]);
    if (state.renderMode === 'particles') buildParticles();
  });
});

const presetRow = document.getElementById('preset-row');
PRESETS.forEach(preset => {
  const btn = document.createElement('button');
  btn.className = 'toggle-btn';
  btn.textContent = preset.name;
  btn.addEventListener('click', () => {
    presetRow.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    applyPreset(preset);
  });
  presetRow.appendChild(btn);
});

document.getElementById('mic-btn').addEventListener('click', () => {
  if (state.micActive) stopMic(); else startMic();
});

document.getElementById('panel-toggle').addEventListener('click', () => {
  document.getElementById('panel').classList.toggle('open');
});

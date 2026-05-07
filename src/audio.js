import { state } from './state.js';

let audioCtx = null, analyser = null, micStream = null;

export async function startMic() {
  try {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    micStream = stream;
    const source = audioCtx.createMediaStreamSource(stream);
    analyser = audioCtx.createAnalyser();
    analyser.fftSize = 2048;
    source.connect(analyser);
    state.micActive = true;
    const btn = document.getElementById('mic-btn');
    btn.classList.add('active');
    btn.innerHTML = '<div class="mic-dot"></div> Microphone ON';
  } catch {
    alert('Microphone access denied or unavailable.');
  }
}

export function stopMic() {
  if (micStream) micStream.getTracks().forEach(t => t.stop());
  if (audioCtx) audioCtx.close();
  analyser = null;
  state.micActive = false;
  const btn = document.getElementById('mic-btn');
  btn.classList.remove('active');
  btn.innerHTML = '<div class="mic-dot"></div> Enable Microphone';
}

export function getDominantFrequency() {
  if (!analyser) return null;
  const buf = new Uint8Array(analyser.frequencyBinCount);
  analyser.getByteFrequencyData(buf);
  let maxVal = 0, maxIdx = 0;
  for (let i = 2; i < buf.length; i++) {
    if (buf[i] > maxVal) { maxVal = buf[i]; maxIdx = i; }
  }
  if (maxVal < 20) return null;
  const nyquist = audioCtx.sampleRate / 2;
  return (maxIdx / analyser.frequencyBinCount) * nyquist;
}

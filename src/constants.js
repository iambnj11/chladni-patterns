export const FREQ_MODES = [
  { freq: 50,   n: 1, m: 1 },
  { freq: 100,  n: 1, m: 2 },
  { freq: 170,  n: 2, m: 1 },
  { freq: 240,  n: 2, m: 2 },
  { freq: 350,  n: 1, m: 3 },
  { freq: 440,  n: 2, m: 3 },
  { freq: 550,  n: 3, m: 2 },
  { freq: 660,  n: 3, m: 3 },
  { freq: 800,  n: 1, m: 4 },
  { freq: 950,  n: 4, m: 1 },
  { freq: 1100, n: 2, m: 4 },
  { freq: 1300, n: 4, m: 2 },
  { freq: 1500, n: 3, m: 4 },
  { freq: 1700, n: 4, m: 3 },
  { freq: 2000, n: 4, m: 4 },
];

export function freqToMode(freq) {
  if (freq <= FREQ_MODES[0].freq) return { ...FREQ_MODES[0] };
  if (freq >= FREQ_MODES[FREQ_MODES.length - 1].freq) return { ...FREQ_MODES[FREQ_MODES.length - 1] };
  for (let i = 0; i < FREQ_MODES.length - 1; i++) {
    const a = FREQ_MODES[i], b = FREQ_MODES[i + 1];
    if (freq >= a.freq && freq <= b.freq) {
      const t = (freq - a.freq) / (b.freq - a.freq);
      return { n: a.n + t * (b.n - a.n), m: a.m + t * (b.m - a.m) };
    }
  }
}

export const PALETTES = [
  [[0.0, 0.0, 0.05],   [0.0, 0.9, 1.0],   [1.0, 1.0, 1.0]],
  [[0.04, 0.0, 0.06],  [1.0, 0.42, 0.2],  [1.0, 0.9, 0.4]],
  [[0.0, 0.0, 0.0],    [0.48, 0.18, 1.0], [0.0, 1.0, 0.7]],
  [[0.95, 0.95, 0.95], [0.5, 0.5, 0.5],   [0.1, 0.1, 0.1]],
];

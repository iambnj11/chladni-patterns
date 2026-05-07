# Chladni Pattern Visualizer

A real-time Chladni pattern visualizer built with Vite and Three.js.

Chladni patterns are the nodal lines that form on a vibrating plate at resonant frequencies — the formula `z(x,y) = cos(nπx)·cos(mπy) − cos(mπx)·cos(nπy)` is evaluated per-vertex in a GLSL shader on a 512×512 plane mesh. The visualizer exposes n/m mode parameters, render modes (flat, relief, particles), color palettes, and optional live microphone input that maps dominant frequency to mode parameters in real time.

## Stack

- **Vite** — build tooling and dev server
- **Three.js** — WebGL renderer, geometry, ShaderMaterial
- **Three.js OrbitControls** — camera rotation and zoom
- **GSAP** — smooth animated transitions between mode presets

## Architecture

```
src/
  main.js          entry point + render loop
  style.css        all panel and UI styles
  shaders/
    vertex.glsl    Chladni displacement + relief mode
    fragment.glsl  nodal line coloring, palette, vignette
  constants.js     PALETTES, FREQ_MODES, freqToMode()
  state.js         shared app state object
  scene.js         renderer, scene, camera
  mesh.js          PlaneGeometry, ShaderMaterial, uniforms
  particles.js     buildParticles() — point cloud on nodal lines
  controls.js      OrbitControls setup
  presets.js       named (n, m) presets + GSAP tween
  audio.js         mic start/stop, getDominantFrequency()
  ui.js            all DOM event listeners
```

## Shader uniforms (do not rename)

| Uniform | Type | Purpose |
|---|---|---|
| `uN` | float | mode parameter n |
| `uM` | float | mode parameter m |
| `uTime` | float | animation clock |
| `uThreshold` | float | nodal line width |
| `uColorA/B/C` | vec3 | palette colors |
| `uRenderMode` | float | 0=flat, 1=relief |
| `uAmplitude` | float | relief displacement scale |

## Preset system

Named buttons in the panel trigger GSAP tweens on `state.n` and `state.m` (duration 1.2s, `power2.inOut`). The `onUpdate` callback writes directly to `uniforms.uN.value` / `uniforms.uM.value` to bypass the render loop's lerp during the tween.

## TODO

- [ ] Add a MIDI input option alongside the mic
- [ ] Add an export button that captures the canvas as a PNG
- [ ] Create a 3D version where the plate is a sphere instead of a plane

## Running the Project

```bash
npm install
npm run dev      # Dev server at localhost:5173
npm run build    # Production build → dist/
```

---

## Collaboration Rules

These rules govern how we work together on this project.

- **Never commit or push without user validation.** After implementing a feature, tell the user what to test and wait for their explicit confirmation that it works in the browser before running `git commit`. The only exception is a cleanup or trivial fix the user explicitly asks to commit mid-session.

---

## Security & Data Handling Rules

These rules apply in all sessions on this project, regardless of what is requested.

- **Never include `.env` contents or any secret/token in tool calls, web requests, or chat output.** Secrets live in `.env` files only.
- **Never send user data or file contents to external URLs without explicit user confirmation.** This covers any outbound HTTP request (fetch, Axios, XHR, etc.) carrying file contents, user audio data, or personal information — whether in the body, query parameters, headers, or form fields.
- **Microphone access must be gated behind explicit user action** (button click). Never auto-start audio capture on page load.
- **Canvas exports (PNG) must be triggered as browser downloads only.** Use `<a download>` + `toDataURL()`. Do not POST canvas data to any external endpoint.
- **`npm install` is permitted without prompting** only for packages explicitly requested by the user. Do not install unlisted packages as a side-effect of another task.

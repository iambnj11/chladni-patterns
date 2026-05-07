import * as THREE from 'three';
import { scene } from './scene.js';
import { state } from './state.js';
import { PALETTES } from './constants.js';
import vertexShader from './shaders/vertex.glsl?raw';
import fragmentShader from './shaders/fragment.glsl?raw';

const geometry = new THREE.PlaneGeometry(2, 2, 512, 512);

export const uniforms = {
  uN:          { value: state.n },
  uM:          { value: state.m },
  uTime:       { value: 0 },
  uThreshold:  { value: state.threshold },
  uColorA:     { value: new THREE.Vector3(...PALETTES[0][0]) },
  uColorB:     { value: new THREE.Vector3(...PALETTES[0][1]) },
  uColorC:     { value: new THREE.Vector3(...PALETTES[0][2]) },
  uRenderMode: { value: 0.0 },
  uAmplitude:  { value: 0.3 },
  uZStatic:    { value: 0.0 },
  uZHeight:    { value: 0.0 },
};

export const mesh = new THREE.Mesh(
  geometry,
  new THREE.ShaderMaterial({ vertexShader, fragmentShader, uniforms, side: THREE.DoubleSide })
);

scene.add(mesh);

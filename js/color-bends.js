import * as THREE from 'three';

const MAX_COLORS = 8;

const VERT = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 1.0);
}
`;

const FRAG = `
#define MAX_COLORS ${MAX_COLORS}
uniform vec2 uCanvas;
uniform float uTime;
uniform float uSpeed;
uniform vec2 uRot;
uniform int uColorCount;
uniform vec3 uColors[MAX_COLORS];
uniform int uTransparent;
uniform float uScale;
uniform float uFrequency;
uniform float uWarpStrength;
uniform vec2 uPointer;
uniform float uMouseInfluence;
uniform float uParallax;
uniform float uNoise;
uniform int uIterations;
uniform float uIntensity;
uniform float uBandWidth;
varying vec2 vUv;

void main() {
  float t = uTime * uSpeed;
  vec2 p = vUv * 2.0 - 1.0;
  p += uPointer * uParallax * 0.1;
  vec2 rp = vec2(p.x * uRot.x - p.y * uRot.y, p.x * uRot.y + p.y * uRot.x);
  vec2 q = vec2(rp.x * (uCanvas.x / uCanvas.y), rp.y);
  q /= max(uScale, 0.0001);
  q /= 0.5 + 0.2 * dot(q, q);
  q += 0.2 * cos(t) - 7.56;
  vec2 toward = (uPointer - rp);
  q += toward * uMouseInfluence * 0.2;

    for (int j = 0; j < 5; j++) {
      if (j >= uIterations - 1) break;
      vec2 rr = sin(1.5 * (q.yx * uFrequency) + 2.0 * cos(q * uFrequency));
      q += (rr - q) * 0.15;
    }

    vec3 col = vec3(0.0);
    float a = 1.0;

    if (uColorCount > 0) {
      vec2 s = q;
      vec3 sumCol = vec3(0.0);
      float cover = 0.0;
      for (int i = 0; i < MAX_COLORS; ++i) {
            if (i >= uColorCount) break;
            s -= 0.01;
            vec2 r = sin(1.5 * (s.yx * uFrequency) + 2.0 * cos(s * uFrequency));
            float m0 = length(r + sin(5.0 * r.y * uFrequency - 3.0 * t + float(i)) / 4.0);
            float kBelow = clamp(uWarpStrength, 0.0, 1.0);
            float kMix = pow(kBelow, 0.3);
            float gain = 1.0 + max(uWarpStrength - 1.0, 0.0);
            vec2 disp = (r - s) * kBelow;
            vec2 warped = s + disp * gain;
            float m1 = length(warped + sin(5.0 * warped.y * uFrequency - 3.0 * t + float(i)) / 4.0);
            float m = mix(m0, m1, kMix);
            float w = 1.0 - exp(-uBandWidth / exp(uBandWidth * m));
            sumCol += uColors[i] * w;
            cover = max(cover, w);
      }
      col = clamp(sumCol, 0.0, 1.0);
      a = uTransparent > 0 ? cover : 1.0;
    } else {
        vec2 s = q;
        for (int k = 0; k < 3; ++k) {
            s -= 0.01;
            vec2 r = sin(1.5 * (s.yx * uFrequency) + 2.0 * cos(s * uFrequency));
            float m0 = length(r + sin(5.0 * r.y * uFrequency - 3.0 * t + float(k)) / 4.0);
            float kBelow = clamp(uWarpStrength, 0.0, 1.0);
            float kMix = pow(kBelow, 0.3);
            float gain = 1.0 + max(uWarpStrength - 1.0, 0.0);
            vec2 disp = (r - s) * kBelow;
            vec2 warped = s + disp * gain;
            float m1 = length(warped + sin(5.0 * warped.y * uFrequency - 3.0 * t + float(k)) / 4.0);
            float m = mix(m0, m1, kMix);
            col[k] = 1.0 - exp(-uBandWidth / exp(uBandWidth * m));
        }
        a = uTransparent > 0 ? max(max(col.r, col.g), col.b) : 1.0;
    }

    col *= uIntensity;

    if (uNoise > 0.0001) {
      float n = fract(sin(dot(gl_FragCoord.xy + vec2(uTime), vec2(12.9898, 78.233))) * 43758.5453123);
      col += (n - 0.5) * uNoise;
      col = clamp(col, 0.0, 1.0);
    }

    vec3 rgb = (uTransparent > 0) ? col * a : col;
    gl_FragColor = vec4(rgb, a);
}
`;

function parseDataAttrs(el, defaults) {
  const result = { ...defaults };

  const colorsAttr = el.dataset.colors;
  if (colorsAttr) {
    try {
      result.colors = JSON.parse(colorsAttr);
    } catch {
      result.colors = colorsAttr.split(',').map(function (s) { return s.trim(); });
    }
  }

  if (el.dataset.rotation !== undefined) result.rotation = parseFloat(el.dataset.rotation);
  if (el.dataset.autoRotate !== undefined) result.autoRotate = parseFloat(el.dataset.autoRotate);
  if (el.dataset.speed !== undefined) result.speed = parseFloat(el.dataset.speed);
  if (el.dataset.scale !== undefined) result.scale = parseFloat(el.dataset.scale);
  if (el.dataset.frequency !== undefined) result.frequency = parseFloat(el.dataset.frequency);
  if (el.dataset.warpStrength !== undefined) result.warpStrength = parseFloat(el.dataset.warpStrength);
  if (el.dataset.mouseInfluence !== undefined) result.mouseInfluence = parseFloat(el.dataset.mouseInfluence);
  if (el.dataset.parallax !== undefined) result.parallax = parseFloat(el.dataset.parallax);
  if (el.dataset.noise !== undefined) result.noise = parseFloat(el.dataset.noise);
  if (el.dataset.iterations !== undefined) result.iterations = parseInt(el.dataset.iterations, 10);
  if (el.dataset.intensity !== undefined) result.intensity = parseFloat(el.dataset.intensity);
  if (el.dataset.bandWidth !== undefined) result.bandWidth = parseFloat(el.dataset.bandWidth);
  result.transparent = el.hasAttribute('data-transparent');

  return result;
}

function hexToVec3(hex) {
  const h = hex.replace('#', '').trim();
  const v = h.length === 3
    ? [parseInt(h[0] + h[0], 16), parseInt(h[1] + h[1], 16), parseInt(h[2] + h[2], 16)]
    : [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
  return new THREE.Vector3(v[0] / 255, v[1] / 255, v[2] / 255);
}

function initColorBends(ctn) {
  const config = parseDataAttrs(ctn, {
    colors: [],
    rotation: 90,
    autoRotate: 0,
    speed: 0.2,
    scale: 1,
    frequency: 1,
    warpStrength: 1,
    mouseInfluence: 1,
    parallax: 0.5,
    noise: 0.15,
    iterations: 1,
    intensity: 1.5,
    bandWidth: 6,
    transparent: true
  });

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

  const geometry = new THREE.PlaneGeometry(2, 2);

  const uColorsArray = [];
  for (let i = 0; i < MAX_COLORS; i++) {
    uColorsArray.push(new THREE.Vector3(0, 0, 0));
  }

  const parsedColors = (config.colors || []).filter(Boolean).slice(0, MAX_COLORS).map(hexToVec3);
  for (let i = 0; i < parsedColors.length; i++) {
    uColorsArray[i].copy(parsedColors[i]);
  }

  const material = new THREE.ShaderMaterial({
    vertexShader: VERT,
    fragmentShader: FRAG,
    uniforms: {
      uCanvas: { value: new THREE.Vector2(1, 1) },
      uTime: { value: 0 },
      uSpeed: { value: config.speed },
      uRot: { value: new THREE.Vector2(1, 0) },
      uColorCount: { value: parsedColors.length },
      uColors: { value: uColorsArray },
      uTransparent: { value: config.transparent ? 1 : 0 },
      uScale: { value: config.scale },
      uFrequency: { value: config.frequency },
      uWarpStrength: { value: config.warpStrength },
      uPointer: { value: new THREE.Vector2(0, 0) },
      uMouseInfluence: { value: config.mouseInfluence },
      uParallax: { value: config.parallax },
      uNoise: { value: config.noise },
      uIterations: { value: config.iterations },
      uIntensity: { value: config.intensity },
      uBandWidth: { value: config.bandWidth }
    },
    premultipliedAlpha: true,
    transparent: true
  });

  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  const renderer = new THREE.WebGLRenderer({
    antialias: false,
    powerPreference: 'high-performance',
    alpha: true
  });
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(0x000000, config.transparent ? 0 : 1);
  renderer.domElement.style.width = '100%';
  renderer.domElement.style.height = '100%';
  renderer.domElement.style.display = 'block';
  ctn.appendChild(renderer.domElement);

  var rotationDeg = config.rotation;
  var autoRotateSpeed = config.autoRotate;

  var pointerTarget = new THREE.Vector2(0, 0);
  var pointerCurrent = new THREE.Vector2(0, 0);
  var pointerSmooth = 8;

  function onPointerMove(e) {
    var rect = ctn.getBoundingClientRect();
    var x = ((e.clientX - rect.left) / (rect.width || 1)) * 2 - 1;
    var y = -(((e.clientY - rect.top) / (rect.height || 1)) * 2 - 1);
    pointerTarget.set(x, y);
  }

  ctn.addEventListener('pointermove', onPointerMove);

  function resize() {
    var w = ctn.clientWidth || 1;
    var h = ctn.clientHeight || 1;
    renderer.setSize(w, h, false);
    material.uniforms.uCanvas.value.set(w, h);
  }

  resize();

  var resizeObserver = null;
  if ('ResizeObserver' in window) {
    resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(ctn);
  } else {
    window.addEventListener('resize', resize);
  }

  var clock = new THREE.Clock();
  var animateId;

  function update() {
    animateId = requestAnimationFrame(update);
    var dt = clock.getDelta();
    var elapsed = clock.elapsedTime;

    material.uniforms.uTime.value = elapsed;

    var deg = (rotationDeg % 360) + autoRotateSpeed * elapsed;
    var rad = (deg * Math.PI) / 180;
    var c = Math.cos(rad);
    var s = Math.sin(rad);
    material.uniforms.uRot.value.set(c, s);

    var amt = Math.min(1, dt * pointerSmooth);
    pointerCurrent.lerp(pointerTarget, amt);
    material.uniforms.uPointer.value.copy(pointerCurrent);

    renderer.render(scene, camera);
  }

  animateId = requestAnimationFrame(update);

  function cleanup() {
    cancelAnimationFrame(animateId);
    ctn.removeEventListener('pointermove', onPointerMove);
    if (resizeObserver) {
      resizeObserver.disconnect();
    } else {
      window.removeEventListener('resize', resize);
    }
    geometry.dispose();
    material.dispose();
    renderer.dispose();
    renderer.forceContextLoss();
    if (renderer.domElement && renderer.domElement.parentNode === ctn) {
      ctn.removeChild(renderer.domElement);
    }
  }

  window.addEventListener('beforeunload', function onBeforeUnload() {
    cleanup();
    window.removeEventListener('beforeunload', onBeforeUnload);
  });
}

document.addEventListener('DOMContentLoaded', function () {
  var ctn = document.querySelector('.color-bends-container');
  if (ctn) {
    initColorBends(ctn);
  }
});

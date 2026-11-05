"use client";

import { useEffect, useRef, type MutableRefObject } from "react";
import Image from "next/image";
import styles from "./portifolio.module.css";
import type { MeteorStamp } from "./HeroMeteors";

// v7: uncut ski (blob-only mask). Everyday is full size, bottom-anchored, centred.
// skiScale is ~5% under the old 1.15 so the head stays a little larger than the face.
const everydaySrc = "/images/hero/everyday.png?v=v7d";
const skiSrc = "/images/hero/ski.png?v=v7d";
const everydayDrawScale = 1.0;
const skiScale = 1.09;
// Shift ski left so the red-jacket shoulder meets the suit; y=0 keeps the beanie over the hair.
const skiAlign = { x: -9 / 1086, y: 0 };
const faceCenterUV = { x: 0.5, y: 0.38 };

const VERTEX_SHADER_SOURCE = `
attribute vec2 aPosition;
attribute vec2 aUv;
varying vec2 vUv;

void main() {
  vUv = aUv;
  gl_Position = vec4(aPosition, 0.0, 1.0);
}
`;

const FRAGMENT_SHADER_SOURCE = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

varying vec2 vUv;

uniform sampler2D uTexEveryday;
uniform sampler2D uTexSki;
uniform vec2 uResolution;
uniform float uAspect;
uniform vec2 uCoverScale;
uniform float uFade;
uniform float uTime;
uniform float uSkiScale;
uniform vec2 uSkiOffset;
uniform vec2 uFaceCenter;
uniform float uEverydayDrawScale;

// 7 metaball points: (centerX, centerY, radius, stretch)
// centerX, centerY in raw UV coordinates [0, 1]
// radius in aspect-corrected screen coordinates
// stretch along velocity direction (1.0 = no stretch)
uniform vec4 uBalls[7];

// 7 metaball directions & squash: (dirX, dirY, squash, unused)
// dirX, dirY is normalized velocity direction in screen space
// squash is perpendicular squash factor (1.0 / sqrt(stretch))
uniform vec4 uDirs[7];

// Wash stamps in the same aspect-corrected space as the metaballs: (x, y, radius, alpha)
uniform vec4 uWash[12];
uniform float uWashActive;

float washDisc(vec2 p, vec4 stamp) {
  if (stamp.w <= 0.001 || stamp.z <= 0.001) return 0.0;
  return (1.0 - smoothstep(stamp.z * 0.45, stamp.z, length(p - stamp.xy))) * stamp.w;
}

// Simplex 2D noise (Stefan Gustavson) for smooth, organic boundary perturbation
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187,
                      0.366025403784439,
                     -0.577350269189626,
                      0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
        + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m;
  m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

// Polynomial smooth minimum (Inigo Quilez) for organic slime metaball merging
float smin(float a, float b, float k) {
  float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
  return mix(b, a, h) - k * h * (1.0 - h);
}

// Distance to an oriented squashed/stretched metaball in aspect-corrected screen coordinates
float sdBall(vec2 p, vec4 ball, vec4 dir) {
  float r = ball.z;
  if (r <= 0.001) return 1e4;
  vec2 d = p - vec2(ball.x * uAspect, ball.y);
  if (ball.w <= 1.01) {
    return length(d) - r;
  }
  float dPar = dot(d, dir.xy);
  float dPerp = d.x * (-dir.y) + d.y * dir.x;
  vec2 q = vec2(dPar / ball.w, dPerp / dir.z);
  return (length(q) - r) * dir.z;
}

// Fast high-quality pseudo-random hash without trigonometric artifacts
float hash12(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

void main() {
  // 1. Cover mapping, then shrink everyday (bottom-anchored + horizontally centred)
  vec2 uvCover = (vUv - 0.5) * uCoverScale + 0.5;
  float ES = max(uEverydayDrawScale, 0.05);
  // Image rect: width ES centred, height ES bottom-aligned within cover UV
  vec2 uvEveryday;
  uvEveryday.x = (uvCover.x - 0.5) / ES + 0.5;
  uvEveryday.y = (uvCover.y - (1.0 - ES)) / ES;
  float inEveryday = step(0.0, uvEveryday.x) * step(uvEveryday.x, 1.0)
                   * step(0.0, uvEveryday.y) * step(uvEveryday.y, 1.0);
  vec2 uvEverydayClamped = clamp(uvEveryday, 0.0, 1.0);

  // 2. Aspect-corrected screen coordinates
  vec2 p = vec2(vUv.x * uAspect, vUv.y);
  float pixelSize = 1.0 / max(uResolution.y, 1.0);
  float aa = max(pixelSize * 4.5, 0.0035);

  float washMask = 0.0;
  if (uWashActive > 0.0) {
    washMask = max(washMask, washDisc(p, uWash[0]));
    washMask = max(washMask, washDisc(p, uWash[1]));
    washMask = max(washMask, washDisc(p, uWash[2]));
    washMask = max(washMask, washDisc(p, uWash[3]));
    washMask = max(washMask, washDisc(p, uWash[4]));
    washMask = max(washMask, washDisc(p, uWash[5]));
    washMask = max(washMask, washDisc(p, uWash[6]));
    washMask = max(washMask, washDisc(p, uWash[7]));
    washMask = max(washMask, washDisc(p, uWash[8]));
    washMask = max(washMask, washDisc(p, uWash[9]));
    washMask = max(washMask, washDisc(p, uWash[10]));
    washMask = max(washMask, washDisc(p, uWash[11]));
  }

  // Shortcut when neither the pointer blob nor the wash is opening the ski photo
  if (uFade <= 0.0005 && washMask <= 0.001) {
    vec4 base = texture2D(uTexEveryday, uvEverydayClamped) * inEveryday;
    gl_FragColor = base;
    return;
  }

  // 3. Evaluate 7 metaball points merged with smin
  const float K_SMIN = 0.055;
  float d = sdBall(p, uBalls[0], uDirs[0]);
  d = smin(d, sdBall(p, uBalls[1], uDirs[1]), K_SMIN);
  d = smin(d, sdBall(p, uBalls[2], uDirs[2]), K_SMIN);
  d = smin(d, sdBall(p, uBalls[3], uDirs[3]), K_SMIN);
  d = smin(d, sdBall(p, uBalls[4], uDirs[4]), K_SMIN);
  d = smin(d, sdBall(p, uBalls[5], uDirs[5]), K_SMIN);
  d = smin(d, sdBall(p, uBalls[6], uDirs[6]), K_SMIN);

  // 4. Organic amoeba noise
  vec2 np = p * 6.0;
  float t = uTime * 1.6;
  float n = snoise(np + vec2(t * 0.4, t * 0.3)) * 0.013
          + snoise(np * 1.8 - vec2(t * 0.55, -t * 0.45)) * 0.006;
  float totalSdf = d - n;

  // 5. Soft slime blob — reveal mask is BLOB ONLY (never clip ski to everyday silhouette)
  float maxR = max(max(max(uBalls[0].z, uBalls[1].z), max(uBalls[2].z, uBalls[3].z)), max(max(uBalls[4].z, uBalls[5].z), uBalls[6].z));
  float blobMask = (1.0 - smoothstep(-aa, aa, totalSdf)) * uFade * smoothstep(0.012, 0.03, maxR);
  blobMask = clamp(max(blobMask, washMask), 0.0, 1.0);

  vec4 colEveryday = texture2D(uTexEveryday, uvEverydayClamped) * inEveryday;

  if (blobMask <= 0.0) {
    gl_FragColor = colEveryday;
    return;
  }

  // 6. Ski relative to the SAME bottom-anchored layout as everyday, then skiScale (larger → covers hair/shoulders)
  float S = max(uSkiScale, 0.05);
  vec2 uvSki = (uvEveryday - uFaceCenter) / S + uFaceCenter - uSkiOffset;
  float inSki = step(0.0, uvSki.x) * step(uvSki.x, 1.0) * step(0.0, uvSki.y) * step(uvSki.y, 1.0);
  vec4 colSki = texture2D(uTexSki, clamp(uvSki, 0.0, 1.0)) * inSki;

  // 7. Ski PERSON cut-out only over shared everyday/page background (no snow fill, no ski scene plate)
  // Edge fringe falls back to --snow-white so it blends into the snowfield stage
  vec3 eRgb = colEveryday.a > 0.01 ? (colEveryday.rgb / max(colEveryday.a, 0.001)) : vec3(0.973, 0.980, 0.976);
  float skiA = clamp(colSki.a, 0.0, 1.0);
  vec3 skiRgb = skiA > 0.01 ? (colSki.rgb / max(colSki.a, 0.001)) : eRgb;
  vec3 insideRgb = mix(eRgb, skiRgb, skiA);
  // Keep everyday alpha so the snowfield+contours stay the shared backdrop outside the cut-out
  float insideA = max(colEveryday.a, skiA);
  vec4 finalInside = vec4(insideRgb * insideA, insideA);

  // 8. Blob-only composite (ski head can extend past everyday silhouette; uncut)
  gl_FragColor = mix(colEveryday, finalInside, blobMask);
}
`;

function createShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function createProgram(
  gl: WebGLRenderingContext,
  vertexShader: WebGLShader,
  fragmentShader: WebGLShader
): WebGLProgram | null {
  const program = gl.createProgram();
  if (!program) return null;
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    gl.deleteProgram(program);
    return null;
  }
  return program;
}

function createTexture(gl: WebGLRenderingContext, image: HTMLImageElement): WebGLTexture | null {
  const texture = gl.createTexture();
  if (!texture) return null;
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
  // Premultiply on upload to match premultipliedAlpha canvas so cut-out alpha stays transparent
  gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
  return texture;
}

interface Metaball {
  x: number;
  y: number;
  vx: number;
  vy: number;
  idleRadius: number;
  realRadius: number;
  stiffness: number;
  damping: number;
  currentRadius: number;
  stretch: number;
  squash: number;
  dirX: number;
  dirY: number;
}

const createMetaballs = (): Metaball[] => [
  // 0: Core lead point. Hover stays a tight window; idle is smaller still.
  { x: 0.5, y: 0.5, vx: 0, vy: 0, idleRadius: 0.048, realRadius: 0.150, stiffness: 220, damping: 24, currentRadius: 0, stretch: 1, squash: 1, dirX: 0, dirY: 0 },
  // 1: Anterior core satellite (gentle breathing lobe)
  { x: 0.5, y: 0.5, vx: 0, vy: 0, idleRadius: 0.038, realRadius: 0.120, stiffness: 170, damping: 20, currentRadius: 0, stretch: 1, squash: 1, dirX: 0, dirY: 0 },
  // 2: Lateral core satellite (gentle breathing lobe)
  { x: 0.5, y: 0.5, vx: 0, vy: 0, idleRadius: 0.034, realRadius: 0.108, stiffness: 140, damping: 17, currentRadius: 0, stretch: 1, squash: 1, dirX: 0, dirY: 0 },
  // 3: Mid-body bridge
  { x: 0.5, y: 0.5, vx: 0, vy: 0, idleRadius: 0.030, realRadius: 0.096, stiffness: 105, damping: 14, currentRadius: 0, stretch: 1, squash: 1, dirX: 0, dirY: 0 },
  // 4: Trailing tail droplet 1 (splits at high speed, remerges on slow/stop)
  { x: 0.5, y: 0.5, vx: 0, vy: 0, idleRadius: 0.026, realRadius: 0.082, stiffness: 75, damping: 11, currentRadius: 0, stretch: 1, squash: 1, dirX: 0, dirY: 0 },
  // 5: Trailing tail droplet 2
  { x: 0.5, y: 0.5, vx: 0, vy: 0, idleRadius: 0.022, realRadius: 0.068, stiffness: 50, damping: 9, currentRadius: 0, stretch: 1, squash: 1, dirX: 0, dirY: 0 },
  // 6: Trailing tail droplet 3 (tip of tail)
  { x: 0.5, y: 0.5, vx: 0, vy: 0, idleRadius: 0.018, realRadius: 0.056, stiffness: 32, damping: 7, currentRadius: 0, stretch: 1, squash: 1, dirX: 0, dirY: 0 },
];

export function PortraitReveal({
  locked,
  washRef,
}: {
  locked: boolean;
  washRef: MutableRefObject<MeteorStamp[]>;
}) {
  const figureRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fallbackRef = useRef<HTMLImageElement>(null);
  const lockedRef = useRef(locked);

  useEffect(() => {
    lockedRef.current = locked;
  }, [locked]);

  useEffect(() => {
    const figure = figureRef.current;
    const canvas = canvasRef.current;
    const fallback = fallbackRef.current;
    if (!figure || !canvas) return;

    // Respect prefers-reduced-motion: leave plain base image visible
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      if (fallback) fallback.style.opacity = "1";
      canvas.style.display = "none";
      return;
    }

    const gl =
      canvas.getContext("webgl", { alpha: true, antialias: true, premultipliedAlpha: true }) ||
      (canvas.getContext("experimental-webgl", { alpha: true, antialias: true, premultipliedAlpha: true }) as WebGLRenderingContext | null);

    if (!gl) {
      // WebGL unsupported: keep fallback image visible
      if (fallback) fallback.style.opacity = "1";
      canvas.style.display = "none";
      return;
    }

    const vertShader = createShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER_SOURCE);
    const fragShader = createShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER_SOURCE);
    if (!vertShader || !fragShader) {
      if (fallback) fallback.style.opacity = "1";
      return;
    }

    const program = createProgram(gl, vertShader, fragShader);
    if (!program) {
      if (fallback) fallback.style.opacity = "1";
      return;
    }

    gl.useProgram(program);

    // Quad geometry: clip space coordinates and matching UVs (0,0 is top-left)
    const vertices = new Float32Array([
      -1, -1, 0, 1,
       1, -1, 1, 1,
      -1,  1, 0, 0,
      -1,  1, 0, 0,
       1, -1, 1, 1,
       1,  1, 1, 0,
    ]);

    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const aPositionLoc = gl.getAttribLocation(program, "aPosition");
    const aUvLoc = gl.getAttribLocation(program, "aUv");

    gl.enableVertexAttribArray(aPositionLoc);
    gl.vertexAttribPointer(aPositionLoc, 2, gl.FLOAT, false, 16, 0);

    gl.enableVertexAttribArray(aUvLoc);
    gl.vertexAttribPointer(aUvLoc, 2, gl.FLOAT, false, 16, 8);

    // Uniform locations
    const uTexEverydayLoc = gl.getUniformLocation(program, "uTexEveryday");
    const uTexSkiLoc = gl.getUniformLocation(program, "uTexSki");
    const uResolutionLoc = gl.getUniformLocation(program, "uResolution");
    const uAspectLoc = gl.getUniformLocation(program, "uAspect");
    const uCoverScaleLoc = gl.getUniformLocation(program, "uCoverScale");
    const uFadeLoc = gl.getUniformLocation(program, "uFade");
    const uTimeLoc = gl.getUniformLocation(program, "uTime");
    const uSkiScaleLoc = gl.getUniformLocation(program, "uSkiScale");
    const uSkiOffsetLoc = gl.getUniformLocation(program, "uSkiOffset");
    const uFaceCenterLoc = gl.getUniformLocation(program, "uFaceCenter");
    const uEverydayDrawScaleLoc = gl.getUniformLocation(program, "uEverydayDrawScale");
    const uBallsLoc = gl.getUniformLocation(program, "uBalls[0]") || gl.getUniformLocation(program, "uBalls");
    const uDirsLoc = gl.getUniformLocation(program, "uDirs[0]") || gl.getUniformLocation(program, "uDirs");
    const uWashLoc = gl.getUniformLocation(program, "uWash[0]") || gl.getUniformLocation(program, "uWash");
    const uWashActiveLoc = gl.getUniformLocation(program, "uWashActive");
    const washData = new Float32Array(12 * 4);

    // Texture state
    let texEveryday: WebGLTexture | null = null;
    let texSki: WebGLTexture | null = null;
    let everydayReady = false;
    let skiReady = false;

    const imgEveryday = new window.Image();
    const imgSki = new window.Image();
    imgEveryday.crossOrigin = "anonymous";
    imgSki.crossOrigin = "anonymous";

    imgEveryday.onload = () => {
      if (!gl.isContextLost()) {
        texEveryday = createTexture(gl, imgEveryday);
        everydayReady = true;
      }
    };
    imgSki.onload = () => {
      if (!gl.isContextLost()) {
        texSki = createTexture(gl, imgSki);
        skiReady = true;
      }
    };

    imgEveryday.src = everydaySrc;
    imgSki.src = skiSrc;

    // Metaballs state & animation
    const metaballs = createMetaballs();
    const ballsUniformData = new Float32Array(7 * 4);
    const dirsUniformData = new Float32Array(7 * 4);

    let width = 0;
    let height = 0;
    let dpr = 1;
    let rafId = 0;
    let isVisible = false;

    const targetMouse = { x: 0.5, y: 0.38 };
    let currentFade = 0.0;
    let lastFrameTime = 0;
    let isHovering = false;

    // Idle auto-animation state
    let isUserDriving = false;
    let userDriveBlend = 0.0;
    let lastUserPointerTime = 0;
    let idleStartTime = performance.now();
    let idleWasResting = true;

    const PASS_DURATION_MS = 2800; // 2.8s active wandering pass
    const REST_DURATION_MS = 2200; // 2.2s resting phase
    const CYCLE_DURATION_MS = PASS_DURATION_MS + REST_DURATION_MS;

    const getVirtualCursor = (timeSec: number) => {
      // Smooth Lissajous curve across face & upper body
      // Face / ski goggles: x ~ 0.50, y ~ 0.29; Chest: x ~ 0.50, y ~ 0.48
      const x = 0.50 + 0.12 * Math.sin(timeSec * 1.45) + 0.035 * Math.sin(timeSec * 3.1 + 0.8);
      const y = 0.38 + 0.11 * Math.cos(timeSec * 1.05 + 0.4) + 0.025 * Math.cos(timeSec * 2.2);
      return { x, y };
    };

    const updateDimensions = () => {
      const rect = figure.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2.0);
      const targetW = Math.min(1086, Math.max(Math.round(width * dpr), 720));
      const targetH = Math.round(targetW * (1448 / 1086));

      if (canvas.width !== targetW || canvas.height !== targetH) {
        canvas.width = targetW;
        canvas.height = targetH;
        gl.viewport(0, 0, targetW, targetH);
      }
    };

    const render = (now: number) => {
      rafId = 0;
      if (!isVisible || !width || !height || !everydayReady || !skiReady) {
        if (isVisible) rafId = requestAnimationFrame(render);
        return;
      }

      // Hide fallback once WebGL is ready and rendering
      if (fallback && fallback.style.opacity !== "0") {
        fallback.style.opacity = "0";
      }

      const dt = Math.min(0.033, Math.max(0.008, lastFrameTime > 0 ? (now - lastFrameTime) / 1000 : 0.016));
      lastFrameTime = now;

      const timeSinceUser = lastUserPointerTime > 0 ? (now - lastUserPointerTime) : Infinity;

      if (isUserDriving) {
        // Real user pointer input is active
        const isStopped = !isHovering || (timeSinceUser > 50);
        const USER_FADE_DURATION_MS = 1200;
        const stoppedElapsedMs = isStopped ? Math.max(0, timeSinceUser - 50) : 0;
        const fadeProgress = Math.min(1.0, stoppedElapsedMs / USER_FADE_DURATION_MS);

        if (isHovering && !isStopped) {
          currentFade += (1.0 - currentFade) * 0.25;
        } else {
          const remaining = 1.0 - fadeProgress;
          currentFade = Math.max(0.0, remaining * remaining * (3.0 - 2.0 * remaining));
        }

        // Real pointer input takes over immediately; idle resumes ~2s after mouse stops (after normal fade)
        if (timeSinceUser > 3250 && currentFade <= 0.001) {
          isUserDriving = false;
          idleStartTime = now;
          idleWasResting = true;
        }
      } else {
        // IDLE AUTO-ANIMATION: drives the slime with virtual cursor wandering across face/upper body
        const idleElapsed = now - idleStartTime;
        const cycleTime = idleElapsed % CYCLE_DURATION_MS;

        if (cycleTime < PASS_DURATION_MS) {
          const passTimeSec = cycleTime / 1000;
          // Smooth fade envelope over the pass (fade in first 0.45s, fade out last 0.55s)
          const fadeIn = Math.min(1.0, passTimeSec / 0.45);
          const fadeOut = Math.min(1.0, (PASS_DURATION_MS / 1000 - passTimeSec) / 0.55);
          let targetFade = Math.max(0.0, Math.min(fadeIn, fadeOut));
          targetFade = targetFade * targetFade * (3.0 - 2.0 * targetFade);

          currentFade += (targetFade - currentFade) * 0.22;

          const pos = getVirtualCursor(now * 0.001);
          targetMouse.x = pos.x;
          targetMouse.y = pos.y;

          if (idleWasResting) {
            idleWasResting = false;
            for (let i = 0; i < metaballs.length; i++) {
              metaballs[i].x = pos.x;
              metaballs[i].y = pos.y;
              metaballs[i].vx = 0;
              metaballs[i].vy = 0;
              metaballs[i].stretch = 1.0;
              metaballs[i].squash = 1.0;
              metaballs[i].dirX = 0;
              metaballs[i].dirY = 0;
            }
          }
        } else {
          // Rest period: fade out and pause
          idleWasResting = true;
          currentFade *= 0.85;
          if (currentFade < 0.0005) {
            currentFade = 0.0;
          }
        }
      }

      // Smoothly blend between idle radius (userDriveBlend = 0) and real cursor radius (userDriveBlend = 1)
      const targetDriveBlend = isUserDriving ? 1.0 : 0.0;
      userDriveBlend += (targetDriveBlend - userDriveBlend) * Math.min(1.0, dt * 7.5);

      const shrinkFactor = isUserDriving
        ? Math.max(0.0, 1.0 - (1.0 - currentFade) * 0.85)
        : Math.max(0.25, currentFade);

      // Canvas aspect ratio for metric velocity calculations
      const canvasAspect = width / Math.max(1, height);

      // Subtle organic breathing oscillation for core satellites
      const breathTime = now * 0.0025;
      const breathX1 = Math.cos(breathTime) * 0.012;
      const breathY1 = Math.sin(breathTime) * 0.012;
      const breathX2 = Math.cos(breathTime + 2.1) * 0.010;
      const breathY2 = Math.sin(breathTime + 2.1) * 0.010;

      // Update spring-damper physics for all 7 metaballs
      for (let i = 0; i < metaballs.length; i++) {
        const b = metaballs[i];
        let targetX = targetMouse.x;
        let targetY = targetMouse.y;

        if (i === 0) {
          // Lead point follows the (real or virtual) cursor directly
        } else if (i === 1) {
          targetX = metaballs[0].x + breathX1;
          targetY = metaballs[0].y + breathY1;
        } else if (i === 2) {
          targetX = metaballs[0].x + breathX2;
          targetY = metaballs[0].y + breathY2;
        } else if (i === 3) {
          targetX = metaballs[0].x;
          targetY = metaballs[0].y;
        } else {
          // Trailing tail droplets follow preceding point in the chain
          targetX = metaballs[i - 1].x;
          targetY = metaballs[i - 1].y;
        }

        const fx = b.stiffness * (targetX - b.x) - b.damping * b.vx;
        const fy = b.stiffness * (targetY - b.y) - b.damping * b.vy;

        b.vx += fx * dt;
        b.vy += fy * dt;
        b.x += b.vx * dt;
        b.y += b.vy * dt;

        // Velocity in aspect-corrected screen space
        const scrVx = b.vx * canvasAspect;
        const scrVy = b.vy;
        const scrSpeed = Math.hypot(scrVx, scrVy);

        if (scrSpeed > 0.02) {
          b.dirX = scrVx / scrSpeed;
          b.dirY = scrVy / scrSpeed;
          const stretchAmount = Math.min(0.70, scrSpeed * 0.32);
          b.stretch = 1.0 + stretchAmount;
          b.squash = 1.0 / Math.sqrt(b.stretch);
        } else {
          b.dirX = 0;
          b.dirY = 0;
          b.stretch = 1.0;
          b.squash = 1.0;
        }

        const baseRadius = b.idleRadius + (b.realRadius - b.idleRadius) * userDriveBlend;
        b.currentRadius = baseRadius * shrinkFactor;
      }

      // Object-fit cover mapping
      const imgAspect = 1086 / 1448;
      let scaleX = 1.0;
      let scaleY = 1.0;
      if (canvasAspect > imgAspect) {
        scaleY = imgAspect / canvasAspect;
      } else {
        scaleX = canvasAspect / imgAspect;
      }

      gl.useProgram(program);

      // Textures
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, texEveryday);
      gl.uniform1i(uTexEverydayLoc, 0);

      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, texSki);
      gl.uniform1i(uTexSkiLoc, 1);

      // Uniforms
      gl.uniform2f(uResolutionLoc, canvas.width, canvas.height);
      gl.uniform1f(uAspectLoc, canvasAspect);
      gl.uniform2f(uCoverScaleLoc, scaleX, scaleY);
      gl.uniform1f(uFadeLoc, currentFade);
      gl.uniform1f(uTimeLoc, now * 0.001);
      gl.uniform1f(uSkiScaleLoc, skiScale);
      gl.uniform2f(uSkiOffsetLoc, skiAlign.x, skiAlign.y);
      gl.uniform2f(uFaceCenterLoc, faceCenterUV.x, faceCenterUV.y);
      gl.uniform1f(uEverydayDrawScaleLoc, everydayDrawScale);

      // Pack 7 metaball positions, radii, directions, stretch and squash
      for (let i = 0; i < metaballs.length; i++) {
        const b = metaballs[i];
        const base = i * 4;
        ballsUniformData[base + 0] = b.x;
        ballsUniformData[base + 1] = b.y;
        ballsUniformData[base + 2] = b.currentRadius;
        ballsUniformData[base + 3] = b.stretch;

        dirsUniformData[base + 0] = b.dirX;
        dirsUniformData[base + 1] = b.dirY;
        dirsUniformData[base + 2] = b.squash;
        dirsUniformData[base + 3] = 0.0;
      }
      gl.uniform4fv(uBallsLoc, ballsUniformData);
      gl.uniform4fv(uDirsLoc, dirsUniformData);

      washData.fill(0);
      let washActive = 0;
      const stamps = washRef.current;
      if (stamps.length > 0) {
        const rect = figure.getBoundingClientRect();
        const h = Math.max(1, rect.height);
        for (let i = 0; i < Math.min(12, stamps.length); i++) {
          const stamp = stamps[i];
          if (stamp.a <= 0.05) continue;
          washActive = 1;
          washData.set([(stamp.x - rect.left) / h, (stamp.y - rect.top) / h, stamp.r / h, stamp.a], i * 4);
        }
      }
      gl.uniform4fv(uWashLoc, washData);
      gl.uniform1f(uWashActiveLoc, washActive);

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 6);

      // Keep RAF loop running while visible
      if (isVisible) {
        rafId = requestAnimationFrame(render);
      }
    };

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType === "touch" && !lockedRef.current) return;
      const rect = figure.getBoundingClientRect();
      const px = (event.clientX - rect.left) / Math.max(1, rect.width);
      const py = (event.clientY - rect.top) / Math.max(1, rect.height);

      const now = performance.now();
      const isOver = px >= -0.05 && px <= 1.05 && py >= -0.05 && py <= 1.05;

      if (isOver) {
        lastUserPointerTime = now;
        isUserDriving = true;
        isHovering = true;
        targetMouse.x = px;
        targetMouse.y = py;

        // If waking from fully faded / idle state, snap all metaballs directly to cursor
        if (currentFade <= 0.005) {
          for (let i = 0; i < metaballs.length; i++) {
            metaballs[i].x = px;
            metaballs[i].y = py;
            metaballs[i].vx = 0;
            metaballs[i].vy = 0;
            metaballs[i].stretch = 1.0;
            metaballs[i].squash = 1.0;
            metaballs[i].dirX = 0;
            metaballs[i].dirY = 0;
          }
        }
      } else if (isUserDriving) {
        isHovering = false;
      }
    };

    const onPointerLeave = () => {
      isHovering = false;
    };

    // Observers: Pause when offscreen & handle figure resizing
    const resizeObserver = new ResizeObserver(() => {
      updateDimensions();
      if (isVisible && !rafId) {
        lastFrameTime = performance.now();
        rafId = requestAnimationFrame(render);
      }
    });
    resizeObserver.observe(figure);

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible && !rafId) {
          lastFrameTime = performance.now();
          rafId = requestAnimationFrame(render);
        } else if (!isVisible && rafId) {
          cancelAnimationFrame(rafId);
          rafId = 0;
        }
      },
      { threshold: 0.02 }
    );
    intersectionObserver.observe(figure);

    updateDimensions();

    // Capture interaction across the hero container & figure
    const heroTarget = figure.closest("[data-reveal-hero]") || figure.parentElement;
    heroTarget?.addEventListener("pointermove", onPointerMove as EventListener);
    heroTarget?.addEventListener("pointerdown", onPointerMove as EventListener);
    heroTarget?.addEventListener("pointerleave", onPointerLeave as EventListener);
    figure.addEventListener("pointermove", onPointerMove as EventListener);
    figure.addEventListener("pointerdown", onPointerMove as EventListener);
    window.addEventListener("pointerup", onPointerLeave);
    window.addEventListener("pointercancel", onPointerLeave);

    return () => {
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      if (rafId) cancelAnimationFrame(rafId);

      heroTarget?.removeEventListener("pointermove", onPointerMove as EventListener);
      heroTarget?.removeEventListener("pointerdown", onPointerMove as EventListener);
      heroTarget?.removeEventListener("pointerleave", onPointerLeave as EventListener);
      figure.removeEventListener("pointermove", onPointerMove as EventListener);
      figure.removeEventListener("pointerdown", onPointerMove as EventListener);
      window.removeEventListener("pointerup", onPointerLeave);
      window.removeEventListener("pointercancel", onPointerLeave);

      if (vertexBuffer) gl.deleteBuffer(vertexBuffer);
      if (texEveryday) gl.deleteTexture(texEveryday);
      if (texSki) gl.deleteTexture(texSki);
      if (vertShader) gl.deleteShader(vertShader);
      if (fragShader) gl.deleteShader(fragShader);
      if (program) gl.deleteProgram(program);
    };
  }, [washRef]);

  return (
    <div className={styles.figure} ref={figureRef}>
      <Image
        ref={fallbackRef}
        src={everydaySrc}
        alt="Gabriel Jabour in a navy suit"
        width={1086}
        height={1448}
        unoptimized
        priority
        className={styles.fallback}
      />
      <canvas ref={canvasRef} aria-hidden="true" />
    </div>
  );
}

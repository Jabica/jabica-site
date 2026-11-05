"use client";

import { useEffect, useRef } from "react";
import styles from "./portifolio.module.css";

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
#ifdef GL_OES_standard_derivatives
#extension GL_OES_standard_derivatives : enable
#define HAS_DERIVATIVES 1
#endif

#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

varying vec2 vUv;

uniform vec2 uResolution;
uniform float uTime;
uniform vec2 uMouse;
uniform float uMouseActive;
uniform float uMouseSpeed;
uniform float uScrollOffset;
uniform float uScrollWarp;
uniform float uDarkPhase;
uniform float uLightTone;
uniform float uLineWidth;
uniform float uDensity;

// --- Simplex Noise 2D (Stefan Gustavson & Ian McEwan) ---
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

void main() {
  // 1. Aspect-corrected UV space so topographical features stay isotropic
  float aspect = uResolution.x / max(uResolution.y, 1.0);
  vec2 uv = vec2(vUv.x * aspect, vUv.y);

  // 2. Parallax vertical shift driven by scroll
  uv.y += uScrollOffset;

  // 3. Ambient slow drift (hypnotic, smooth evolution)
  float t = uTime * mix(0.16, 0.038, uDarkPhase);
  vec2 drift1 = vec2(t * 0.58, t * 0.38);
  vec2 drift2 = vec2(-t * 0.44, t * 0.48);
  vec2 drift3 = vec2(t * 0.32, -t * 0.35);

  // 4. Cursor deflection & ripple wave setup
  vec2 mouseAspect = vec2(uMouse.x * aspect, uMouse.y);
  vec2 toMouse = uv - mouseAspect;
  float dist = length(toMouse);

  // Local height bump
  float bumpRadius = 0.48;
  float bumpFactor = clamp(1.0 - dist / bumpRadius, 0.0, 1.0);
  float smoothBump = bumpFactor * bumpFactor * (3.0 - 2.0 * bumpFactor);
  float heightBump = smoothBump * 0.32 * uMouseActive;

  // Coordinate deflection pushing field lines away from cursor
  vec2 pushDir = (dist > 0.001) ? (toMouse / dist) : vec2(0.0);
  vec2 uvWarped = uv - pushDir * smoothBump * 0.072 * uMouseActive;

  // Expanding ripples radiating outward from cursor
  float rippleRadius = 0.68;
  float rippleFactor = clamp(1.0 - dist / rippleRadius, 0.0, 1.0);
  float smoothRipple = rippleFactor * rippleFactor;
  float rippleWave = sin(dist * 34.0 - uTime * 4.6);
  float rippleAmp = (0.03 + uMouseSpeed * 0.09) * smoothRipple * uMouseActive;
  float ripple = rippleWave * rippleAmp;

  // 5. Multi-scale Domain Warping
  // Level 1: gentle large-scale flow
  vec2 q = vec2(
    snoise(uvWarped * 1.15 + drift1),
    snoise(uvWarped * 1.15 + vec2(5.2, 1.3) + drift2)
  );

  // Level 2: secondary curling warp modulated by scroll
  vec2 warpScroll = vec2(uScrollWarp * 0.28, uScrollWarp * 0.18);
  vec2 r = vec2(
    snoise(uvWarped * 1.45 + 2.2 * q + vec2(1.7, 9.2) + drift3 + warpScroll),
    snoise(uvWarped * 1.45 + 2.2 * q + vec2(8.3, 2.8) - drift3 - warpScroll)
  );

  // Keep the light field broad and smooth; retain the detailed field in dark mode.
  vec2 p = uvWarped * 1.35 + 2.4 * r;
  float hLight = snoise(uvWarped * 0.95 + q * 0.35 + drift1);
  float hDark = snoise(p) * 0.65 + snoise(p * 2.05 + drift1) * 0.35;
  float h = mix(hLight, hDark, uDarkPhase);

  // Add cursor local height bump and expanding ripples
  h += heightBump + ripple;

  // 6. Topographic contour lines via fract/smoothstep + fwidth derivatives
  float val = h * uDensity;
  float lineFrac = fract(val);
  float distToLine = min(lineFrac, 1.0 - lineFrac);

  #ifdef HAS_DERIVATIVES
  float fw = max(fwidth(val), 0.00008);
  #else
  float fw = max(uDensity * (2.4 / max(uResolution.y, 1.0)), 0.001);
  #endif

  float pixelDist = distToLine / fw;

  // Crisp anti-aliased line
  float halfWidth = uLineWidth * 0.5;
  float aa = 0.85; // 0.85px anti-aliased edge
  float lineMask = 1.0 - smoothstep(halfWidth - aa, halfWidth + aa, pixelDist);

  // Soft radiant bloom around lines in dark mode
  float glow = (1.0 - smoothstep(halfWidth, halfWidth + 3.2, pixelDist)) * 0.22 * uDarkPhase;

  // 7. Site palette colours:
  // Snow hero: var(--ice-grey) #95a6b7, carried at a higher alpha to stay
  // visible against the snowfield instead of the old navy stage.
  // Ink phase: var(--snow-white) #eef3f7
  vec3 colHero = mix(
    vec3(149.0 / 255.0, 166.0 / 255.0, 183.0 / 255.0),
    vec3(61.0 / 255.0, 82.0 / 255.0, 102.0 / 255.0),
    uLightTone
  );
  float alphaHero = mix(0.52, 0.38, uLightTone);

  vec3 colDark = vec3(238.0 / 255.0, 243.0 / 255.0, 247.0 / 255.0);
  float alphaDark = 0.46;

  vec3 lineColor = mix(colHero, colDark, uDarkPhase);
  float baseAlpha = mix(alphaHero, alphaDark, uDarkPhase);
  float finalAlpha = clamp(lineMask * baseAlpha + glow, 0.0, 1.0);

  // Output premultiplied alpha for seamless blending
  gl_FragColor = vec4(lineColor * finalAlpha, finalAlpha);
}
`;

function createShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
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

export function MovingContours({ tone = "transition" }: { tone?: "transition" | "light" | "lightTransition" }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const stage = canvas.closest("[data-reveal-hero]") || canvas.parentElement;
    if (!stage) return;

    // Track prefers-reduced-motion media query
    const reducedQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let isReduced = reducedQuery.matches;

    // Coarse pointer detection
    const coarseQuery = window.matchMedia("(pointer: coarse)");
    let isCoarse = coarseQuery.matches;

    // WebGL context setup
    const gl =
      (canvas.getContext("webgl2", { alpha: true, antialias: false, premultipliedAlpha: true }) as WebGLRenderingContext | null) ||
      (canvas.getContext("webgl", { alpha: true, antialias: false, premultipliedAlpha: true }) as WebGLRenderingContext | null) ||
      (canvas.getContext("experimental-webgl", { alpha: true, antialias: false, premultipliedAlpha: true }) as WebGLRenderingContext | null);

    if (gl) {
      // Enable standard derivatives extension if available
      gl.getExtension("OES_standard_derivatives");
    }

    // 2D Canvas fallback state if WebGL is unavailable
    const ctx2d = !gl ? canvas.getContext("2d") : null;

    let width = 0;
    let height = 0;
    let rafId = 0;
    let isVisible = false;

    // Program & buffers (WebGL)
    let vertShader: WebGLShader | null = null;
    let fragShader: WebGLShader | null = null;
    let program: WebGLProgram | null = null;
    let vertexBuffer: WebGLBuffer | null = null;

    let uResolutionLoc: WebGLUniformLocation | null = null;
    let uTimeLoc: WebGLUniformLocation | null = null;
    let uMouseLoc: WebGLUniformLocation | null = null;
    let uMouseActiveLoc: WebGLUniformLocation | null = null;
    let uMouseSpeedLoc: WebGLUniformLocation | null = null;
    let uScrollOffsetLoc: WebGLUniformLocation | null = null;
    let uScrollWarpLoc: WebGLUniformLocation | null = null;
    let uDarkPhaseLoc: WebGLUniformLocation | null = null;
    let uLightToneLoc: WebGLUniformLocation | null = null;
    let uLineWidthLoc: WebGLUniformLocation | null = null;
    let uDensityLoc: WebGLUniformLocation | null = null;

    if (gl) {
      vertShader = createShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER_SOURCE);
      fragShader = createShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER_SOURCE);

      if (vertShader && fragShader) {
        program = createProgram(gl, vertShader, fragShader);
      }

      if (program) {
        gl.useProgram(program);

        // Full-screen quad
        const vertices = new Float32Array([
          -1, -1, 0, 0,
           1, -1, 1, 0,
          -1,  1, 0, 1,
          -1,  1, 0, 1,
           1, -1, 1, 0,
           1,  1, 1, 1,
        ]);

        vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

        const aPositionLoc = gl.getAttribLocation(program, "aPosition");
        const aUvLoc = gl.getAttribLocation(program, "aUv");

        gl.enableVertexAttribArray(aPositionLoc);
        gl.vertexAttribPointer(aPositionLoc, 2, gl.FLOAT, false, 16, 0);

        gl.enableVertexAttribArray(aUvLoc);
        gl.vertexAttribPointer(aUvLoc, 2, gl.FLOAT, false, 16, 8);

        uResolutionLoc = gl.getUniformLocation(program, "uResolution");
        uTimeLoc = gl.getUniformLocation(program, "uTime");
        uMouseLoc = gl.getUniformLocation(program, "uMouse");
        uMouseActiveLoc = gl.getUniformLocation(program, "uMouseActive");
        uMouseSpeedLoc = gl.getUniformLocation(program, "uMouseSpeed");
        uScrollOffsetLoc = gl.getUniformLocation(program, "uScrollOffset");
        uScrollWarpLoc = gl.getUniformLocation(program, "uScrollWarp");
        uDarkPhaseLoc = gl.getUniformLocation(program, "uDarkPhase");
        uLightToneLoc = gl.getUniformLocation(program, "uLightTone");
        uLineWidthLoc = gl.getUniformLocation(program, "uLineWidth");
        uDensityLoc = gl.getUniformLocation(program, "uDensity");
      }
    }

    // Interaction state
    const targetMouse = { x: 0.5, y: 0.5, active: 0 };
    const currentMouse = { x: 0.5, y: 0.5, active: 0, speed: 0 };
    let lastPointerTime = 0;

    // Scroll state
    const scrollState = {
      offset: 0,
      warp: 0,
      darkPhase: 0,
    };

    const getScrollMetrics = () => {
      const scrollY = window.scrollY || window.pageYOffset || 0;
      const viewportH = window.innerHeight || 800;

      const container = stage.parentElement;
      let progress = 0;
      if (container) {
        const rect = container.getBoundingClientRect();
        const pinDistance = rect.height - viewportH;
        if (pinDistance > 0) {
          progress = Math.max(0, Math.min(1, -rect.top / pinDistance));
        }
      } else {
        const pinDistance = viewportH * 2.8;
        progress = Math.max(0, Math.min(1, scrollY / pinDistance));
      }

      // Dark phase: 8% to 45% of sequence
      let darkPhase = 0;
      if (progress >= 0.08) {
        const t = Math.min(1, (progress - 0.08) / (0.45 - 0.08));
        darkPhase = t * t * (3 - 2 * t);
      }

      return { scrollY, progress, darkPhase };
    };

    const updateSize = () => {
      const rect = stage.getBoundingClientRect();
      width = rect.width || window.innerWidth;
      height = rect.height || window.innerHeight;

      // Cap device pixel ratio at 1.5
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const targetW = Math.round(width * dpr);
      const targetH = Math.round(height * dpr);

      if (canvas.width !== targetW || canvas.height !== targetH) {
        canvas.width = targetW;
        canvas.height = targetH;
        if (gl) {
          gl.viewport(0, 0, targetW, targetH);
        }
      }

      if (isReduced) {
        renderFrame(0);
      }
    };

    const render2DFallback = (timeSec: number, darkPhase: number) => {
      if (!ctx2d) return;
      ctx2d.clearRect(0, 0, canvas.width, canvas.height);
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      ctx2d.save();
      ctx2d.scale(dpr, dpr);

      // Line color based on dark phase
      ctx2d.strokeStyle =
        darkPhase > 0.4
          ? `rgba(238, 243, 247, ${0.28 + darkPhase * 0.18})`
          : tone !== "transition"
            ? "rgba(61, 82, 102, 0.64)"
            : `rgba(149, 166, 183, ${0.52 - darkPhase * 0.2})`;
      ctx2d.lineWidth = 1.0;

      const numLines = 7;
      const stepY = height / (numLines + 1);

      for (let i = 1; i <= numLines; i++) {
        const baseY = i * stepY + Math.sin(timeSec * 0.4 + i) * 20;
        ctx2d.beginPath();
        for (let x = 0; x <= width; x += 30) {
          const nx = x / width;
          const wave =
            Math.sin(nx * 4.5 + timeSec * 0.5 + i * 0.8) * 26 +
            Math.cos(nx * 2.8 - timeSec * 0.35 + i * 0.5) * 18;

          // Local cursor deflection
          let cursorPush = 0;
          if (currentMouse.active > 0.01) {
            const mx = currentMouse.x * width;
            const my = (1.0 - currentMouse.y) * height;
            const dx = x - mx;
            const dy = (baseY + wave) - my;
            const d = Math.hypot(dx, dy);
            if (d < 220) {
              const f = 1.0 - d / 220;
              cursorPush = Math.sin(d * 0.05 - timeSec * 4.0) * 18 * f * currentMouse.active;
            }
          }

          const y = baseY + wave + cursorPush;
          if (x === 0) ctx2d.moveTo(x, y);
          else ctx2d.lineTo(x, y);
        }
        ctx2d.stroke();
      }

      ctx2d.restore();
    };

    const renderFrame = (now: number) => {
      if (!width || !height) return;

      const timeSec = isReduced ? 0 : now * 0.001;
      const { scrollY, progress, darkPhase } = getScrollMetrics();
      const phase = tone === "light" ? 0 : isReduced ? 1 : darkPhase;
      if (tone === "light") {
        scrollState.darkPhase = 0;
      }

      // Smooth scroll state
      scrollState.offset += (scrollY * 0.00032 - scrollState.offset) * 0.12;
      scrollState.warp += (progress * 1.5 - scrollState.warp) * 0.12;
      scrollState.darkPhase += (phase - scrollState.darkPhase) * 0.12;

      // Mouse easing
      if (!isCoarse && !isReduced) {
        if (now - lastPointerTime > 1600) {
          targetMouse.active = 0;
        }
        const prevX = currentMouse.x;
        const prevY = currentMouse.y;
        currentMouse.x += (targetMouse.x - currentMouse.x) * 0.12;
        currentMouse.y += (targetMouse.y - currentMouse.y) * 0.12;
        currentMouse.active += (targetMouse.active - currentMouse.active) * 0.08;

        const vx = currentMouse.x - prevX;
        const vy = currentMouse.y - prevY;
        const speed = Math.min(Math.hypot(vx, vy) * 25.0, 1.0);
        currentMouse.speed += (speed - currentMouse.speed) * 0.15;
      } else {
        currentMouse.active = 0;
        currentMouse.speed = 0;
      }

      if (gl && program) {
        gl.useProgram(program);

        gl.uniform2f(uResolutionLoc, canvas.width, canvas.height);
        gl.uniform1f(uTimeLoc, timeSec);
        gl.uniform2f(uMouseLoc, currentMouse.x, currentMouse.y);
        gl.uniform1f(uMouseActiveLoc, currentMouse.active);
        gl.uniform1f(uMouseSpeedLoc, currentMouse.speed);
        gl.uniform1f(uScrollOffsetLoc, scrollState.offset);
        gl.uniform1f(uScrollWarpLoc, scrollState.warp);
        gl.uniform1f(uDarkPhaseLoc, scrollState.darkPhase);
        gl.uniform1f(uLightToneLoc, tone === "transition" ? 0 : 1);
        gl.uniform1f(uLineWidthLoc, tone === "lightTransition" ? 1.7 - scrollState.darkPhase * 0.6 : 1.1);
        gl.uniform1f(uDensityLoc, tone === "lightTransition" ? 3.0 + scrollState.darkPhase * 1.8 : 4.8);

        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
      } else if (ctx2d) {
        render2DFallback(timeSec, scrollState.darkPhase);
      }
    };

    const loop = (now: number) => {
      rafId = 0;
      if (!isVisible || document.hidden) return;

      renderFrame(now);

      if (!isReduced) {
        rafId = requestAnimationFrame(loop);
      }
    };

    // Pointer event listeners
    const onPointerMove = (e: PointerEvent) => {
      if (isReduced || isCoarse) return;
      const rect = canvas.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;

      // Invert Y so 0 is at bottom, 1 is at top for WebGL coordinates
      targetMouse.x = (e.clientX - rect.left) / rect.width;
      targetMouse.y = 1.0 - (e.clientY - rect.top) / rect.height;
      targetMouse.active = 1.0;
      lastPointerTime = performance.now();

      if (isReduced && isVisible) {
        renderFrame(0);
      }
    };

    const onPointerLeave = () => {
      targetMouse.active = 0;
    };

    // Pause when tab hidden
    const onVisibilityChange = () => {
      if (document.hidden) {
        if (rafId) {
          cancelAnimationFrame(rafId);
          rafId = 0;
        }
      } else {
        if (!rafId && !isReduced && isVisible) {
          rafId = requestAnimationFrame(loop);
        }
      }
    };

    // Motion preference changes
    const onReducedChange = (e: MediaQueryListEvent) => {
      isReduced = e.matches;
      if (isReduced) {
        if (rafId) {
          cancelAnimationFrame(rafId);
          rafId = 0;
        }
        renderFrame(0);
      } else {
        if (!rafId && isVisible && !document.hidden) {
          rafId = requestAnimationFrame(loop);
        }
      }
    };

    const onCoarseChange = (e: MediaQueryListEvent) => {
      isCoarse = e.matches;
    };

    // Observers
    const resizeObserver = new ResizeObserver(() => {
      updateSize();
      if (!isReduced && isVisible && !rafId && !document.hidden) {
        rafId = requestAnimationFrame(loop);
      }
    });
    resizeObserver.observe(stage);

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible) {
          if (isReduced) {
            renderFrame(0);
          } else if (!rafId && !document.hidden) {
            rafId = requestAnimationFrame(loop);
          }
        } else if (rafId) {
          cancelAnimationFrame(rafId);
          rafId = 0;
        }
      },
      { threshold: 0.01 }
    );
    intersectionObserver.observe(stage);

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerleave", onPointerLeave);
    window.addEventListener("resize", updateSize, { passive: true });
    document.addEventListener("visibilitychange", onVisibilityChange);
    reducedQuery.addEventListener("change", onReducedChange);
    coarseQuery.addEventListener("change", onCoarseChange);

    updateSize();

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("resize", updateSize);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      reducedQuery.removeEventListener("change", onReducedChange);
      coarseQuery.removeEventListener("change", onCoarseChange);

      if (gl) {
        if (vertexBuffer) gl.deleteBuffer(vertexBuffer);
        if (vertShader) gl.deleteShader(vertShader);
        if (fragShader) gl.deleteShader(fragShader);
        if (program) gl.deleteProgram(program);
      }
    };
  }, [tone]);

  return <canvas className={styles.contours} ref={canvasRef} aria-hidden="true" />;
}

export default MovingContours;

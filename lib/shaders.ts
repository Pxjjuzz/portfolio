export const particleVertex = /* glsl */ `
attribute float aSeed;
attribute float aSize;
attribute float aTint;
uniform float uTime;
uniform vec2 uPointer;
uniform float uPixelRatio;
varying float vTint;
varying float vFade;
varying float vFar;

void main() {
  vec3 pos = position;
  float drift = uTime * (0.1 + aSeed * 0.16);
  pos.y += sin(drift + aSeed * 12.0) * 0.85;
  pos.x += cos(drift * 0.8 + aSeed * 7.0) * 0.85 + uPointer.x * (1.2 + aSeed * 2.4);
  pos.z += sin(drift * 0.6 + aSeed * 3.0) * 1.1;

  vec4 mv = modelViewMatrix * vec4(pos, 1.0);
  float depth = max(-mv.z, 0.001);
  float size = aSize * uPixelRatio * (240.0 / depth);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = clamp(size, 0.7, 13.0);

  vTint = aTint;
  vFar = smoothstep(60.0, 260.0, depth);
  vFade = smoothstep(1.5, 9.0, depth);
}
`;

export const particleFragment = /* glsl */ `
precision mediump float;
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform float uOpacity;
varying float vTint;
varying float vFade;
varying float vFar;

void main() {
  vec2 uv = gl_PointCoord - 0.5;
  float d = length(uv);
  float alpha = smoothstep(0.5, 0.04, d);
  vec3 color = mix(uColorA, uColorB, vTint);
  float core = smoothstep(0.16, 0.0, d) * 0.7;
  gl_FragColor = vec4(color + core, alpha * uOpacity * vFade * (1.0 - vFar * 0.85));
}
`;

export const orbVertex = /* glsl */ `
varying vec3 vNormalW;
varying vec3 vViewDir;
varying vec3 vPos;

void main() {
  vNormalW = normalize(normalMatrix * normal);
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  vViewDir = -mv.xyz;
  vPos = position;
  gl_Position = projectionMatrix * mv;
}
`;

export const orbFragment = /* glsl */ `
precision mediump float;
uniform float uTime;
uniform float uHover;
uniform float uOpacity;
uniform vec3 uColorA;
uniform vec3 uColorB;
varying vec3 vNormalW;
varying vec3 vViewDir;
varying vec3 vPos;

void main() {
  vec3 view = normalize(vViewDir);
  float fres = pow(1.0 - max(dot(normalize(vNormalW), view), 0.0), 2.6);
  float bands = 0.5 + 0.5 * sin(vPos.y * 5.0 - uTime * 1.2 + sin(vPos.x * 3.4 + uTime * 0.6) * 1.4);
  float pulse = 0.5 + 0.5 * sin(uTime * 1.6);
  vec3 color = mix(uColorA, uColorB, clamp(bands * 0.55 + fres * 0.45, 0.0, 1.0));
  float alpha = (fres * 0.9 + 0.06 + pulse * 0.03) * uOpacity * (1.0 + uHover * 0.7);
  gl_FragColor = vec4(color, alpha);
}
`;

export const holoVertex = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const holoFragment = /* glsl */ `
precision mediump float;
uniform float uTime;
uniform float uOpacity;
uniform float uGrid;
uniform vec3 uColor;
varying vec2 vUv;

void main() {
  vec2 g = abs(fract(vUv * vec2(26.0, 16.0)) - 0.5);
  float grid = smoothstep(0.5, 0.44, max(g.x, g.y)) * uGrid;
  float sweepPos = fract(uTime * 0.14);
  float sweep = smoothstep(0.035, 0.0, abs(vUv.y - sweepPos));
  float border = 1.0 - smoothstep(0.0, 0.012, min(min(vUv.x, 1.0 - vUv.x), min(vUv.y, 1.0 - vUv.y)));
  float edgeFade = smoothstep(0.0, 0.05, vUv.x) * smoothstep(0.0, 0.05, 1.0 - vUv.x)
    * smoothstep(0.0, 0.05, vUv.y) * smoothstep(0.0, 0.05, 1.0 - vUv.y);
  float alpha = (grid * 0.28 + sweep * 0.55 + border * 0.5 + 0.03) * edgeFade * uOpacity;
  gl_FragColor = vec4(uColor, alpha);
}
`;

export const backdropFragment = /* glsl */ `
precision mediump float;
uniform vec3 uColor;
uniform vec3 uColorDeep;
uniform float uOpacity;
uniform float uTime;
varying vec2 vUv;

void main() {
  vec2 centered = vUv - vec2(0.5);
  float radial = smoothstep(0.85, 0.0, length(centered * vec2(1.15, 1.35)));
  float breathe = 0.9 + 0.1 * sin(uTime * 0.25);
  vec3 color = mix(uColorDeep, uColor, radial * breathe);
  gl_FragColor = vec4(color, uOpacity * (0.25 + radial * 0.75));
}
`;

export const scanFragment = /* glsl */ `
precision mediump float;
uniform float uTime;
uniform float uOpacity;
uniform float uProgress;
uniform vec3 uColor;
varying vec2 vUv;

void main() {
  float bar = fract(uTime * 0.35);
  float diff = abs(vUv.y - bar);
  float beam = smoothstep(0.06, 0.0, diff);
  float gridY = smoothstep(0.02, 0.0, abs(fract(vUv.y * 30.0) - 0.5) - 0.48);
  float fill = step(vUv.y, uProgress) * 0.16;
  float frame = 1.0 - smoothstep(0.0, 0.02, min(min(vUv.x, 1.0 - vUv.x), min(vUv.y, 1.0 - vUv.y)));
  float alpha = (beam * 0.75 + gridY * 0.25 + fill + frame * 0.25) * uOpacity;
  gl_FragColor = vec4(uColor, alpha);
}
`;
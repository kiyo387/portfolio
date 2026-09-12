import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// ─── GLSL Shaders for Pearlescent Chromatic Liquid Mesh ───────────────────────

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uScroll;

  varying vec2 vUv;
  varying float vElevation;

  // 2D Simplex Noise
  vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

  float snoise(vec2 v){
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
             -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy) );
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod(i, 289.0);
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
    + i.x + vec3(0.0, i1.x, 1.0 ));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m;
    m = m*m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  void main() {
    vUv = uv;

    vec3 pos = position;

    // Multi-frequency harmonic wave superposition
    float t = uTime * 0.22;
    float n1 = snoise(uv * 1.5 + vec2(t * 0.3, t * 0.25));
    float n2 = snoise(uv * 3.0 - vec2(t * 0.4, t * 0.35)) * 0.5;
    float n3 = snoise(uv * 4.5 + vec2(t * 0.5, -t * 0.3)) * 0.25;

    float wave = (n1 + n2 + n3) * 0.35;

    // Interactive cursor wave deflection
    float distToMouse = distance(uv, uMouse);
    float mouseWave = smoothstep(0.5, 0.0, distToMouse) * 0.25;
    float ripple = sin(distToMouse * 14.0 - uTime * 2.2) * mouseWave;

    // Scroll vertical parallax offset
    float scrollDisplace = sin(uv.y * 3.1415 + uScroll * 2.2) * 0.12;

    float elevation = wave + ripple + scrollDisplace;
    pos.z += elevation;

    vElevation = elevation;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform float uTime;
  uniform vec2 uMouse;

  varying vec2 vUv;
  varying float vElevation;

  void main() {
    // Curated Pearlescent Chromatic Palette
    vec3 basePearl = vec3(0.985, 0.988, 0.992); // Crisp Pearl White
    vec3 skyBlue   = vec3(0.22, 0.74, 0.97);    // Sky Cyan (#38bdf8)
    vec3 lilacIris = vec3(0.72, 0.52, 0.98);    // Soft Lilac Violet (#c084fc)
    vec3 softIndigo = vec3(0.48, 0.52, 0.98);   // Soft Indigo (#818cf8)
    vec3 warmPeach = vec3(0.99, 0.84, 0.72);    // Warm Peach Pearl (#fed7aa)

    // Elevation factor [-0.5, 0.5] -> [0.0, 1.0]
    float t = clamp((vElevation + 0.3) * 1.5, 0.0, 1.0);

    // Smooth chromatic gradient blending
    vec3 c1 = mix(basePearl, skyBlue, smoothstep(0.08, 0.45, t));
    vec3 c2 = mix(c1, lilacIris, smoothstep(0.35, 0.75, t));
    vec3 c3 = mix(c2, softIndigo, smoothstep(0.65, 0.90, t));
    vec3 finalColor = mix(c3, warmPeach, smoothstep(0.85, 1.0, t));

    // Dynamic cursor proximity aura
    float mouseDist = distance(vUv, uMouse);
    float mouseGlow = smoothstep(0.42, 0.0, mouseDist);
    finalColor = mix(finalColor, skyBlue, mouseGlow * 0.22);

    // Alpha wash: transparent and calibrated for high foreground text contrast
    float alpha = 0.10 + smoothstep(0.1, 0.85, t) * 0.22 + mouseGlow * 0.12;

    gl_FragColor = vec4(finalColor, alpha);
  }
`;

// ─── Fluid Chromatic Mesh Plane Component ─────────────────────────────────────

function ChromaticLiquidPlane() {
  const meshRef = useRef();
  const { viewport } = useThree();

  const mouseTarget = useRef(new THREE.Vector2(0.5, 0.5));
  const mouseCurrent = useRef(new THREE.Vector2(0.5, 0.5));

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uScroll: { value: 0 },
    }),
    []
  );

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseTarget.current.x = e.clientX / window.innerWidth;
      mouseTarget.current.y = 1.0 - e.clientY / window.innerHeight;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame((state) => {
    if (!meshRef.current) return;

    // Smooth mouse lerp
    mouseCurrent.current.lerp(mouseTarget.current, 0.06);

    uniforms.uTime.value = state.clock.getElapsedTime();
    uniforms.uMouse.value.copy(mouseCurrent.current);

    // Synchronize vertical scroll displacement
    const scrollMax = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const scrollProgress = window.scrollY / scrollMax;
    uniforms.uScroll.value = scrollProgress;

    // Subtle breathing rotation
    meshRef.current.rotation.z = Math.sin(state.clock.getElapsedTime() * 0.1) * 0.015;
  });

  return (
    <mesh
      ref={meshRef}
      position={[0, 0, 0]}
      scale={[viewport.width * 1.4, viewport.height * 1.4, 1]}
    >
      <planeGeometry args={[1, 1, 96, 96]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

// ─── Main Unified Spatial Scene Export ────────────────────────────────────────

export default function UnifiedSpatialScene() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      <Canvas
        camera={{ position: [0, 0, 4.5], fov: 45 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        dpr={[1, 1.75]}
        className="w-full h-full"
      >
        {/* Full-Viewport Clean Pearlescent Chromatic Mesh Gradient */}
        <ChromaticLiquidPlane />
      </Canvas>
    </div>
  );
}

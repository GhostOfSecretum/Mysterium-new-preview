import { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const VERT = /* glsl */`
  uniform float uTime;
  uniform vec2  uMouse;
  varying float vElevation;
  varying vec2  vUv;

  void main() {
    vUv = uv;
    vec3 pos = position;

    float wave1 = sin(pos.x * 0.5 + uTime * 1.1) * 0.7;
    float wave2 = cos(pos.y * 0.45 + uTime * 0.85) * 0.6;
    float wave3 = sin((pos.x + pos.y) * 0.3 + uTime * 0.65) * 0.4;

    float mDist  = length(pos.xy - uMouse * 10.0);
    float mWave  = sin(mDist * 1.5 - uTime * 3.5) * exp(-mDist * 0.18) * 1.2;

    vElevation = wave1 + wave2 + wave3 + mWave;
    pos.z += vElevation;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const FRAG = /* glsl */`
  uniform float uTime;
  varying float vElevation;
  varying vec2  vUv;

  void main() {
    vec3 low  = vec3(0.051, 0.408, 0.471);  // #0d6878
    vec3 mid  = vec3(0.102, 0.561, 0.659);  // #1a8fa8
    vec3 high = vec3(0.251, 0.878, 0.816);  // #40e0d0

    float t  = clamp((vElevation + 1.8) / 3.6, 0.0, 1.0);
    vec3 col = t < 0.5 ? mix(low, mid, t * 2.0) : mix(mid, high, (t - 0.5) * 2.0);

    float spec   = pow(max(0.0, vElevation / 2.0), 4.0) * 0.6;
    col += high * spec;

    vec2 uv      = vUv - 0.5;
    float fade   = 1.0 - smoothstep(0.32, 0.5, length(uv));

    gl_FragColor = vec4(col, fade * 0.88);
  }
`;

export default function ChromeRippleScene() {
  const meshRef   = useRef();
  const matRef    = useRef();
  const { mouse } = useThree();

  const uniforms = useMemo(() => ({
    uTime:  { value: 0 },
    uMouse: { value: new THREE.Vector2(0, 0) },
  }), []);

  useFrame(({ clock }) => {
    if (!matRef.current) return;
    matRef.current.uniforms.uTime.value  = clock.getElapsedTime();
    matRef.current.uniforms.uMouse.value.lerp(mouse, 0.05);
  });

  return (
    <mesh ref={meshRef} rotation={[-0.3, 0, 0]}>
      <planeGeometry args={[24, 20, 120, 100]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={VERT}
        fragmentShader={FRAG}
        uniforms={uniforms}
        transparent
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

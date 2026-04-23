import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const STREAM_COUNT  = 90;
const POINTS_PER_STREAM = 22;
const TOTAL = STREAM_COUNT * POINTS_PER_STREAM;
const Y_TOP = 9;
const Y_BOT = -9;
const Y_RANGE = Y_TOP - Y_BOT;

// Pre-allocated colors to avoid per-frame allocations
const _c1 = new THREE.Color("#40e0d0");
const _c2 = new THREE.Color("#1a8fa8");
const _tmp = new THREE.Color();

export default function DataStreamsScene() {
  const pointsRef = useRef();

  const { positions, colors, speeds, offsets } = useMemo(() => {
    const pos     = new Float32Array(TOTAL * 3);
    const col     = new Float32Array(TOTAL * 3);
    const speeds  = new Float32Array(STREAM_COUNT);
    const offsets = new Float32Array(STREAM_COUNT);

    const c1 = new THREE.Color("#40e0d0");
    const c2 = new THREE.Color("#1a8fa8");

    for (let s = 0; s < STREAM_COUNT; s++) {
      speeds[s]  = 0.8 + Math.random() * 2.2;
      offsets[s] = Math.random() * Y_RANGE;

      const x = (Math.random() - 0.5) * 28;
      const z = (Math.random() - 0.5) * 10 - 2;

      for (let p = 0; p < POINTS_PER_STREAM; p++) {
        const idx = (s * POINTS_PER_STREAM + p) * 3;
        const t   = p / POINTS_PER_STREAM;

        pos[idx + 0] = x + (Math.random() - 0.5) * 0.08;
        pos[idx + 1] = Y_TOP - offsets[s] - t * 1.8;
        pos[idx + 2] = z;

        const bright = 1 - t;
        const c = c1.clone().lerp(c2, t);
        col[idx + 0] = c.r * bright;
        col[idx + 1] = c.g * bright;
        col[idx + 2] = c.b * bright;
      }
    }
    return { positions: pos, colors: col, speeds, offsets };
  }, []);

  const stateRef = useRef({ streamY: new Float32Array(STREAM_COUNT).map((_, i) => offsets[i]) });

  useFrame((_, delta) => {
    if (!pointsRef.current) return;
    const posAttr = pointsRef.current.geometry.attributes.position;
    const colAttr = pointsRef.current.geometry.attributes.color;
    const state   = stateRef.current;

    for (let s = 0; s < STREAM_COUNT; s++) {
      state.streamY[s] = (state.streamY[s] + speeds[s] * delta) % Y_RANGE;

      const baseX = posAttr.getX(s * POINTS_PER_STREAM);
      const baseZ = posAttr.getZ(s * POINTS_PER_STREAM);

      for (let p = 0; p < POINTS_PER_STREAM; p++) {
        const idx = s * POINTS_PER_STREAM + p;
        const t   = p / POINTS_PER_STREAM;
        const y   = Y_TOP - state.streamY[s] - t * 1.8;
        const wrappedY = ((y - Y_BOT) % Y_RANGE + Y_RANGE) % Y_RANGE + Y_BOT;

        posAttr.setXYZ(idx, baseX, wrappedY, baseZ);

        const bright = Math.max(0, 1 - t);
        _tmp.copy(_c1).lerp(_c2, t);
        colAttr.setXYZ(idx, _tmp.r * bright, _tmp.g * bright, _tmp.b * bright);
      }
    }

    posAttr.needsUpdate = true;
    colAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.055}
        vertexColors
        sizeAttenuation
        transparent
        opacity={1}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

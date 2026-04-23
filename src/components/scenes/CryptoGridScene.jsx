import { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const COLS = 40;
const ROWS = 28;
const STEP = 0.6;

export default function CryptoGridScene() {
  const pointsRef = useRef();
  const linesRef  = useRef();
  const { mouse } = useThree();
  const rot = useRef({ x: 0, y: 0 });

  const { positions, colors, linePositions } = useMemo(() => {
    const count   = COLS * ROWS;
    const pos     = new Float32Array(count * 3);
    const col     = new Float32Array(count * 3);

    const c1 = new THREE.Color("#40e0d0");
    const c2 = new THREE.Color("#1a8fa8");
    const c3 = new THREE.Color("#0d6878");

    let i = 0;
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const x = (c - COLS / 2) * STEP;
        const y = (r - ROWS / 2) * STEP;
        pos[i * 3 + 0] = x;
        pos[i * 3 + 1] = y;
        pos[i * 3 + 2] = 0;

        const t = (c + r) / (COLS + ROWS);
        const blended = t < 0.5 ? c1.clone().lerp(c2, t * 2) : c2.clone().lerp(c3, (t - 0.5) * 2);
        col[i * 3 + 0] = blended.r;
        col[i * 3 + 1] = blended.g;
        col[i * 3 + 2] = blended.b;
        i++;
      }
    }

    // Horizontal + vertical grid lines
    const lineVerts = [];
    for (let r = 0; r < ROWS; r++) {
      const y = (r - ROWS / 2) * STEP;
      lineVerts.push((-(COLS / 2)) * STEP, y, 0, ((COLS / 2) - 1) * STEP, y, 0);
    }
    for (let c = 0; c < COLS; c++) {
      const x = (c - COLS / 2) * STEP;
      lineVerts.push(x, (-(ROWS / 2)) * STEP, 0, x, ((ROWS / 2) - 1) * STEP, 0);
    }

    return { positions: pos, colors: col, linePositions: new Float32Array(lineVerts) };
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    // Smooth mouse follow
    rot.current.x += (-mouse.y * 0.35 - rot.current.x) * 0.04;
    rot.current.y += ( mouse.x * 0.5  - rot.current.y) * 0.04;

    const group = pointsRef.current?.parent;
    if (group) {
      group.rotation.x = rot.current.x;
      group.rotation.y = rot.current.y;
    }

    // Wave Z displacement
    if (pointsRef.current) {
      const posAttr = pointsRef.current.geometry.attributes.position;
      let i = 0;
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          const x = (c - COLS / 2) * STEP;
          const y = (r - ROWS / 2) * STEP;
          const z =
            Math.sin(x * 0.4 + t * 0.9) * 0.9 +
            Math.cos(y * 0.35 + t * 0.7) * 0.7 +
            Math.sin((x + y) * 0.22 + t * 0.5) * 0.4;
          posAttr.setZ(i, z);
          i++;
        }
      }
      posAttr.needsUpdate = true;
    }

    // Same wave on grid lines
    if (linesRef.current) {
      const posAttr = linesRef.current.geometry.attributes.position;
      let vi = 0;
      for (let r = 0; r < ROWS; r++) {
        const y = (r - ROWS / 2) * STEP;
        for (let ci = 0; ci < 2; ci++) {
          const x = ci === 0 ? (-(COLS / 2)) * STEP : ((COLS / 2) - 1) * STEP;
          const z =
            Math.sin(x * 0.4 + t * 0.9) * 0.9 +
            Math.cos(y * 0.35 + t * 0.7) * 0.7 +
            Math.sin((x + y) * 0.22 + t * 0.5) * 0.4;
          posAttr.setZ(vi, z);
          vi++;
        }
      }
      for (let c = 0; c < COLS; c++) {
        const x = (c - COLS / 2) * STEP;
        for (let ri = 0; ri < 2; ri++) {
          const y = ri === 0 ? (-(ROWS / 2)) * STEP : ((ROWS / 2) - 1) * STEP;
          const z =
            Math.sin(x * 0.4 + t * 0.9) * 0.9 +
            Math.cos(y * 0.35 + t * 0.7) * 0.7 +
            Math.sin((x + y) * 0.22 + t * 0.5) * 0.4;
          posAttr.setZ(vi, z);
          vi++;
        }
      }
      posAttr.needsUpdate = true;
    }
  });

  return (
    <group>
      {/* Grid lines */}
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={linePositions}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#1a8fa8" transparent opacity={0.18} />
      </lineSegments>

      {/* Points */}
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
          size={0.06}
          vertexColors
          sizeAttenuation
          transparent
          opacity={0.9}
        />
      </points>
    </group>
  );
}

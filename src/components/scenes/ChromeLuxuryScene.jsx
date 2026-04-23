import { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const ORBITERS = [
  { radius: 4.5, speed: 0.4,  size: 0.55, color: "#40e0d0", phase: 0       },
  { radius: 6.0, speed: 0.25, size: 0.4,  color: "#1a8fa8", phase: 2.1     },
  { radius: 3.2, speed: 0.65, size: 0.3,  color: "#40e0d0", phase: 4.2     },
  { radius: 7.2, speed: 0.18, size: 0.65, color: "#0d6878", phase: 1.05    },
  { radius: 5.0, speed: 0.5,  size: 0.25, color: "#40e0d0", phase: 3.14    },
];

export default function ChromeLuxuryScene() {
  const groupRef  = useRef();
  const mainRef   = useRef();
  const orbRefs   = useRef(ORBITERS.map(() => ({ ref: { current: null } })));
  const { mouse } = useThree();
  const rot       = useRef({ x: 0, y: 0 });

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    rot.current.x += (-mouse.y * 0.3 - rot.current.x) * 0.03;
    rot.current.y += ( mouse.x * 0.4 - rot.current.y) * 0.03;

    if (groupRef.current) {
      groupRef.current.rotation.x = rot.current.x;
      groupRef.current.rotation.y = rot.current.y + t * 0.06;
    }

    if (mainRef.current) {
      mainRef.current.rotation.y = t * 0.2;
      mainRef.current.rotation.x = Math.sin(t * 0.15) * 0.2;
    }

    orbRefs.current.forEach(({ ref }, i) => {
      const o = ORBITERS[i];
      if (!ref.current) return;
      const angle = t * o.speed + o.phase;
      ref.current.position.x = Math.cos(angle) * o.radius;
      ref.current.position.y = Math.sin(angle * 0.6) * o.radius * 0.4;
      ref.current.position.z = Math.sin(angle) * o.radius * 0.5;
      ref.current.rotation.y = t * 0.8;
    });
  });

  return (
    <group ref={groupRef}>
      {/* Lights */}
      <ambientLight intensity={0.05} color="#010810" />
      <directionalLight position={[5, 8, 5]}  intensity={1.8} color="#ffffff" />
      <pointLight      position={[8, 2, 4]}   intensity={3.0} color="#40e0d0" distance={20} decay={2} />
      <pointLight      position={[-6, -3, 3]} intensity={2.0} color="#1a8fa8" distance={18} decay={2} />
      <pointLight      position={[0, -8, -4]} intensity={1.5} color="#0d6878" distance={15} decay={2} />
      <spotLight
        position={[0, 12, 8]}
        intensity={4}
        color="#40e0d0"
        angle={0.4}
        penumbra={0.8}
        distance={30}
        decay={2}
      />

      {/* Main sphere */}
      <mesh ref={mainRef}>
        <sphereGeometry args={[2.2, 128, 128]} />
        <meshPhysicalMaterial
          color="#8ad8e8"
          metalness={1}
          roughness={0.05}
          envMapIntensity={1}
          reflectivity={1}
        />
      </mesh>

      {/* Inner glow sphere */}
      <mesh>
        <sphereGeometry args={[2.3, 32, 32]} />
        <meshBasicMaterial
          color="#40e0d0"
          transparent
          opacity={0.04}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Orbiting spheres */}
      {ORBITERS.map((o, i) => (
        <mesh key={i} ref={(el) => { if (el) orbRefs.current[i].ref.current = el; }}>
          <sphereGeometry args={[o.size, 32, 32]} />
          <meshPhysicalMaterial
            color={o.color}
            metalness={1}
            roughness={0.08}
            envMapIntensity={1}
          />
        </mesh>
      ))}

      {/* Teal ring */}
      <mesh rotation={[Math.PI / 2.2, 0, 0]}>
        <torusGeometry args={[3.8, 0.04, 16, 120]} />
        <meshBasicMaterial color="#40e0d0" transparent opacity={0.35} />
      </mesh>
      <mesh rotation={[Math.PI / 2.2, 0.8, 0]}>
        <torusGeometry args={[5.5, 0.025, 16, 120]} />
        <meshBasicMaterial color="#1a8fa8" transparent opacity={0.2} />
      </mesh>
    </group>
  );
}

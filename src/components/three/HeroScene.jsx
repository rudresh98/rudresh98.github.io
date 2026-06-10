"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Float,
  Icosahedron,
  MeshDistortMaterial,
  Sparkles,
} from "@react-three/drei";

// Shared scroll progress (0 at top of hero, ~1 after one viewport). Read
// imperatively in useFrame so we never re-render React on scroll.
function useScrollProgress() {
  const ref = useRef(0);
  if (typeof window !== "undefined") {
    // attach once
    if (!ref.attached) {
      ref.attached = true;
      const update = () => {
        ref.current = Math.min(
          1,
          window.scrollY / (window.innerHeight || 1)
        );
      };
      update();
      window.addEventListener("scroll", update, { passive: true });
    }
  }
  return ref;
}

function Blob({ scroll }) {
  const group = useRef();
  const mat = useRef();
  const { pointer } = useThree();

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const g = group.current;
    if (!g) return;
    const s = scroll.current;

    // base idle rotation
    g.rotation.y += delta * 0.18;
    g.rotation.x = Math.sin(t * 0.25) * 0.18;
    g.rotation.z = s * 0.6;

    // pointer parallax + scroll sink — ease toward targets
    const px = pointer.x * 0.5;
    const py = pointer.y * 0.4;
    g.position.x += (px * 0.6 - g.position.x) * 0.05;
    g.position.y += (py * 0.5 - s * 1.4 - g.position.y) * 0.05;

    // shrink the blob as the user scrolls past the hero
    const targetScale = 1 - s * 0.35;
    g.scale.setScalar(g.scale.x + (targetScale - g.scale.x) * 0.08);

    // breathe the distortion
    if (mat.current) {
      mat.current.distort = 0.34 + Math.sin(t * 0.6) * 0.06 + s * 0.15;
    }
  });

  return (
    <group ref={group}>
      <Float speed={1.4} rotationIntensity={0.4} floatIntensity={0.9}>
        {/* core distorted blob */}
        <Icosahedron args={[1.35, 12]}>
          <MeshDistortMaterial
            ref={mat}
            color="#15c2d8"
            emissive="#0a6e8c"
            emissiveIntensity={0.35}
            roughness={0.18}
            metalness={0.65}
            distort={0.35}
            speed={1.8}
          />
        </Icosahedron>

        {/* faceted wireframe shell around it */}
        <Icosahedron args={[1.9, 1]}>
          <meshBasicMaterial
            color="#7c5cff"
            wireframe
            transparent
            opacity={0.18}
          />
        </Icosahedron>
      </Float>
    </group>
  );
}

function Rig({ scroll }) {
  const { camera } = useThree();
  useFrame(() => {
    // subtle dolly out on scroll for depth
    const targetZ = 5 + scroll.current * 1.5;
    camera.position.z += (targetZ - camera.position.z) * 0.05;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

export default function HeroScene() {
  const scroll = useScrollProgress();
  const dpr = useMemo(() => [1, 1.6], []);

  return (
    <Canvas
      dpr={dpr}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0, 5], fov: 42 }}
      style={{ width: "100%", height: "100%" }}
    >
      <ambientLight intensity={0.45} />
      <directionalLight position={[3, 4, 5]} intensity={1.6} color="#9be9ff" />
      <pointLight position={[-4, -2, 2]} intensity={40} color="#7c5cff" />
      <pointLight position={[4, 3, -2]} intensity={24} color="#19d3e6" />

      <Blob scroll={scroll} />

      <Sparkles
        count={60}
        scale={[9, 6, 4]}
        size={2.2}
        speed={0.3}
        opacity={0.6}
        color="#9be9ff"
      />
      <Rig scroll={scroll} />
    </Canvas>
  );
}

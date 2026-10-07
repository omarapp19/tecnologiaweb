"use client";

import React, { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Icosahedron, Float, MeshDistortMaterial } from "@react-three/drei";
import { useDesign } from "@/context/DesignContext";
import * as THREE from "three";

function FloatingShape() {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHover] = useState(false);
  const { designMode } = useDesign();

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.2;
      meshRef.current.rotation.y += delta * 0.3;
    }
  });

  const materialColor = designMode === "neo" ? "#60a5fa" : "#3b82f6"; // Lighter in neo, default blue otherwise

  return (
    <Float speed={2} rotationIntensity={1.5} floatIntensity={2}>
      <Icosahedron
        ref={meshRef}
        args={[1, 0]}
        scale={hovered ? 1.2 : 1}
        onPointerOver={() => setHover(true)}
        onPointerOut={() => setHover(false)}
      >
        <MeshDistortMaterial
          color={materialColor}
          wireframe={designMode === "glass"} // Wireframe looks good in glass, solid in neo
          distort={0.3}
          speed={2}
          roughness={0.2}
          metalness={0.8}
        />
      </Icosahedron>
    </Float>
  );
}

export default function ThreeElement() {
  return (
    <div className="w-full h-full absolute inset-0 -z-10 opacity-60">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <FloatingShape />
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
      </Canvas>
    </div>
  );
}

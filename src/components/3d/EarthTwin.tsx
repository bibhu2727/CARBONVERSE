'use client';

import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { useRPGStore } from '@/store/useRPGStore';

const EARTH_COLORS = {
  1: '#8b4513', // Polluted (Brown/Red)
  2: '#cd853f', // Recovering (Orange/Brown)
  3: '#3b82f6', // Balanced (Blue)
  4: '#10b981', // Green (Emerald)
  5: '#059669', // Flourishing (Deep Green)
  6: '#a855f7'  // Paradise (Aurora Purple/Green mix)
};

const EMISSIVE_COLORS = {
  1: '#4a0404',
  2: '#8b4513',
  3: '#1e3a8a',
  4: '#064e3b',
  5: '#065f46',
  6: '#7e22ce'
};

function Earth({ stage }: { stage: number }) {
  const earthRef = useRef<THREE.Mesh>(null);
  
  const targetColor = new THREE.Color(EARTH_COLORS[stage as keyof typeof EARTH_COLORS] || EARTH_COLORS[1]);
  const targetEmissive = new THREE.Color(EMISSIVE_COLORS[stage as keyof typeof EMISSIVE_COLORS] || EMISSIVE_COLORS[1]);

  useFrame(() => {
    if (earthRef.current) {
      earthRef.current.rotation.y += 0.001;
      const material = earthRef.current.material as THREE.MeshStandardMaterial;
      material.color.lerp(targetColor, 0.05);
      material.emissive.lerp(targetEmissive, 0.05);
    }
  });

  return (
    <mesh ref={earthRef}>
      <sphereGeometry args={[2.5, 64, 64]} />
      <meshStandardMaterial 
        roughness={0.6} 
        metalness={0.1} 
        emissiveIntensity={stage >= 5 ? 0.6 : 0.2}
        wireframe={stage === 1} // Polluted stage looks broken
      />
    </mesh>
  );
}

export default function EarthTwin() {
  const earthStage = useRPGStore(state => state.earthStage);

  return (
    <div style={{ width: '100%', height: '100vh', position: 'absolute', top: 0, left: 0, zIndex: 0 }}>
      <Canvas camera={{ position: [0, 0, 8] }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 3, 5]} intensity={1.5} />
        <Stars 
          radius={100} depth={50} count={5000} factor={4} 
          saturation={earthStage >= 4 ? 1 : 0} 
          fade speed={1} 
        />
        <Earth stage={earthStage} />
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
      </Canvas>
    </div>
  );
}

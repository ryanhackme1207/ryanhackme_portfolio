import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface TutorialMarkerProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  color?: string;
  active: boolean;
}

export const TutorialMarker: React.FC<TutorialMarkerProps> = ({
  position,
  rotation = [-Math.PI / 2, 0, 0], // Flat sitting by default
  color = '#00ffcc',
  active
}) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();
    const scaleVal = 1.0 + Math.sin(t * 5.0) * 0.15;
    meshRef.current.scale.set(scaleVal, scaleVal, scaleVal);
    if (meshRef.current.material) {
      const mat = meshRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.4 + Math.sin(t * 5.0) * 0.25;
    }
  });

  if (!active) return null;

  return (
    <mesh position={position} rotation={rotation} ref={meshRef}>
      <ringGeometry args={[0.07, 0.09, 32]} />
      <meshBasicMaterial color={color} transparent opacity={0.6} side={THREE.DoubleSide} depthWrite={false} />
    </mesh>
  );
};

export default TutorialMarker;

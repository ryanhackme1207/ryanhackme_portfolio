import React, { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface InteractiveObjectProps {
  children: React.ReactNode;
  onClick: () => void;
  activeView: string;
  targetView: string;
  glowColor?: string;
}

export const InteractiveObject: React.FC<InteractiveObjectProps> = ({
  children,
  onClick,
  activeView,
  targetView,
  glowColor = "#00f0ff"
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const isInteractable = activeView === 'desk';
  const isSelected = activeView === targetView;
  const { camera, raycaster, gl } = useThree();

  // Animate hover state
  useFrame((state) => {
    if (!groupRef.current) return;

    const isLocked = document.pointerLockElement === gl.domElement;
    const time = state.clock.getElapsedTime();

    // In pointer-lock mode: raycast from screen center to determine hover
    if (isLocked && isInteractable) {
      const center = new THREE.Vector2(0, 0);
      raycaster.setFromCamera(center, camera);
      const intersects = raycaster.intersectObjects(groupRef.current.children, true);
      const nowHovered = intersects.length > 0;
      if (nowHovered !== hovered) {
        setHovered(nowHovered);
      }
    }

    // Pulse scale slightly on hover
    if (hovered && isInteractable) {
      const scale = 1 + Math.sin(time * 10) * 0.015;
      groupRef.current.scale.set(scale, scale, scale);
    } else {
      const currentScale = groupRef.current.scale.x;
      const targetScale = isSelected ? 1.05 : 1.0;
      const step = 0.1;
      const newScale = currentScale + (targetScale - currentScale) * step;
      groupRef.current.scale.set(newScale, newScale, newScale);
    }
  });

  // Normal (non-locked) mouse hover
  const handlePointerOver = (e: any) => {
    if (!isInteractable) return;
    if (document.pointerLockElement === gl.domElement) return; // handled by raycaster
    e.stopPropagation();
    setHovered(true);
    document.body.style.cursor = 'pointer';
  };

  const handlePointerOut = () => {
    if (document.pointerLockElement === gl.domElement) return;
    setHovered(false);
    document.body.style.cursor = 'default';
  };

  // Normal (non-locked) click
  const handleClick = (e: any) => {
    if (!isInteractable) return;
    // In pointer-lock mode, ignore — interactions handled by keypress / separate click
    if (document.pointerLockElement === gl.domElement) return;
    e.stopPropagation();
    setHovered(false);
    document.body.style.cursor = 'default';
    onClick();
  };

  // Pointer-lock mode: listen for 'interact' events fired from the canvas click handler
  useEffect(() => {
    const handleLockedClick = () => {
      if (!isInteractable) return;
      if (!groupRef.current) return;
      const isLocked = document.pointerLockElement !== null;
      if (!isLocked) return;

      // Raycast from screen center
      const center = new THREE.Vector2(0, 0);
      raycaster.setFromCamera(center, camera);
      const intersects = raycaster.intersectObjects(groupRef.current.children, true);
      if (intersects.length > 0) {
        onClick();
      }
    };

    window.addEventListener('locked-interact', handleLockedClick);
    return () => window.removeEventListener('locked-interact', handleLockedClick);
  }, [isInteractable, onClick, raycaster, camera]);

  return (
    <group
      ref={groupRef}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={handleClick}
    >
      {children}

      {/* HUD Scanner Bounding Box Ring on Hover */}
      {hovered && isInteractable && (
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1.3, 1.3, 1.3]} />
          <meshBasicMaterial
            color={glowColor}
            wireframe
            transparent
            opacity={0.3}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      )}
    </group>
  );
};
export default InteractiveObject;

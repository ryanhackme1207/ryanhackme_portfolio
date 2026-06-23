import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Html } from '@react-three/drei';

interface EntranceCorridorProps {
  entranceStage: 'black_world' | 'door_opening' | 'teleporting' | 'entered';
  setEntranceStage: (stage: 'black_world' | 'door_opening' | 'teleporting' | 'entered') => void;
}

export const EntranceCorridor: React.FC<EntranceCorridorProps> = ({
  entranceStage,
  setEntranceStage
}) => {
  const leftPanelRef = useRef<THREE.Mesh>(null);
  const rightPanelRef = useRef<THREE.Mesh>(null);
  
  const [portalOpacity, setPortalOpacity] = useState(0);
  const [doorOpenProgress, setDoorOpenProgress] = useState(0);

  // Trigger door open animation when clicked
  const handleOpenDoor = () => {
    if (entranceStage === 'black_world') {
      setEntranceStage('door_opening');
    }
  };

  useFrame(() => {
    // 1. If door is opening, animate door panels sliding sideways
    if (entranceStage === 'door_opening') {
      setDoorOpenProgress((prev) => {
        const next = Math.min(1, prev + 0.007); // slide speed
        if (next >= 1) {
          // Once door is fully open, start teleportation stage
          setEntranceStage('teleporting');
        }
        return next;
      });
    }

    // Apply sliding offsets to panels
    if (leftPanelRef.current && rightPanelRef.current) {
      // Slide left panel by -0.75 X, right panel by +0.75 X
      leftPanelRef.current.position.x = -0.41 - (doorOpenProgress * 0.75);
      rightPanelRef.current.position.x = 0.41 + (doorOpenProgress * 0.75);
    }

    // Portal glow opacity increases
    if (entranceStage === 'door_opening' || entranceStage === 'teleporting') {
      setPortalOpacity((prev) => Math.min(1, prev + 0.03));
    }
  });

  return (
    <group>
      {/* Dark World Lighting */}
      <ambientLight intensity={0.15} />
      <pointLight position={[0, 2.0, 21.2]} color="#00ffcc" intensity={4.5} distance={7} decay={1.5} />
      <pointLight position={[0, 1.0, 24.5]} color="#b100e8" intensity={2.0} distance={6} decay={2} />

      {/* Cybernetic Entrance Gateway Frame */}
      <group position={[0, 0, 20]}>
        {/* Left Post */}
        <mesh position={[-0.9, 1.1, 0]} castShadow>
          <boxGeometry args={[0.15, 2.2, 0.15]} />
          <meshStandardMaterial color="#0b0816" roughness={0.3} metalness={0.9} emissive="#00ffcc" emissiveIntensity={0.3} />
        </mesh>
        
        {/* Right Post */}
        <mesh position={[0.9, 1.1, 0]} castShadow>
          <boxGeometry args={[0.15, 2.2, 0.15]} />
          <meshStandardMaterial color="#0b0816" roughness={0.3} metalness={0.9} emissive="#00ffcc" emissiveIntensity={0.3} />
        </mesh>

        {/* Top Header Panel */}
        <mesh position={[0, 2.22, 0]} castShadow>
          <boxGeometry args={[1.95, 0.15, 0.15]} />
          <meshStandardMaterial color="#0b0816" roughness={0.3} metalness={0.9} emissive="#00ffcc" emissiveIntensity={0.3} />
        </mesh>

        {/* Sliding Left Door Panel */}
        <mesh 
          ref={leftPanelRef} 
          position={[-0.41, 1.1, -0.02]} 
          castShadow
          onClick={handleOpenDoor}
          onPointerOver={(e) => {
            if (entranceStage === 'black_world') {
              e.stopPropagation();
              document.body.style.cursor = 'pointer';
            }
          }}
          onPointerOut={() => {
            document.body.style.cursor = 'default';
          }}
        >
          <boxGeometry args={[0.82, 2.05, 0.05]} />
          <meshStandardMaterial color="#150f29" roughness={0.5} metalness={0.8} />
        </mesh>

        {/* Sliding Right Door Panel */}
        <mesh 
          ref={rightPanelRef} 
          position={[0.41, 1.1, -0.02]} 
          castShadow
          onClick={handleOpenDoor}
          onPointerOver={(e) => {
            if (entranceStage === 'black_world') {
              e.stopPropagation();
              document.body.style.cursor = 'pointer';
            }
          }}
          onPointerOut={() => {
            document.body.style.cursor = 'default';
          }}
        >
          <boxGeometry args={[0.82, 2.05, 0.05]} />
          <meshStandardMaterial color="#150f29" roughness={0.5} metalness={0.8} />
        </mesh>

        {/* Cyber Hologram Display above the Door */}
        <Html position={[0, 2.65, 0.1]} transform scale={[0.18, 0.18, 0.18]}>
          <div style={{
            fontFamily: 'monospace',
            color: '#39ff14',
            textShadow: '0 0 8px #39ff14',
            fontSize: '20px',
            fontWeight: 'bold',
            textAlign: 'center',
            background: 'rgba(5, 2, 10, 0.85)',
            padding: '6px 16px',
            borderRadius: '4px',
            border: '1px solid #39ff14',
            whiteSpace: 'nowrap',
            letterSpacing: '2px',
            userSelect: 'none'
          }}>
            SYSTEM GATEWAY // CLICK GATEWAY TO ENTER
          </div>
        </Html>

        {/* Interactive Glowing Access Button (Clicking this opens the door) */}
        {entranceStage === 'black_world' && (
          <mesh 
            position={[0, 1.1, 0.08]} 
            onClick={handleOpenDoor}
            onPointerOver={(e) => {
              e.stopPropagation();
              document.body.style.cursor = 'pointer';
            }}
            onPointerOut={() => {
              document.body.style.cursor = 'default';
            }}
          >
            <sphereGeometry args={[0.07, 16, 16]} />
            <meshStandardMaterial color="#00ffcc" emissive="#00ffcc" emissiveIntensity={6} />
          </mesh>
        )}

        {/* White Portal Flash behind door panels */}
        <mesh position={[0, 1.1, -0.06]}>
          <planeGeometry args={[1.65, 2.1]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={portalOpacity} toneMapped={false} />
        </mesh>
      </group>

      {/* Cyber Grid Floor for depth perspective in the black world */}
      <gridHelper args={[40, 40, '#b100e8', '#220638']} position={[0, 0, 25]} />
    </group>
  );
};

export default EntranceCorridor;

import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Line } from '@react-three/drei';
import * as THREE from 'three';

interface EnvironmentDetailsProps {
  lampOn: boolean;
  setLampOn: (on: boolean) => void;
  activeView: string;
}

// -------------------------------------------------------------
// PHYSICALLY INTERACTIVE / DRAGGABLE ITEM (COKE CAN & SNACKS)
// -------------------------------------------------------------
interface DraggableItemProps {
  type: 'can' | 'snack';
  initialPosition: [number, number, number];
  color: string;
  fridgeOpen: boolean;
  labelColor?: string;
  scale?: [number, number, number];
}

const DraggableItem: React.FC<DraggableItemProps> = ({
  type,
  initialPosition,
  color,
  fridgeOpen,
  labelColor = '#ffffff',
  scale = [1, 1, 1]
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isThrown, setIsThrown] = useState(false);
  const velocityRef = useRef<[number, number, number]>([0, 0, 0]);

  useFrame((state) => {
    if (!groupRef.current) return;

    if (isDragging) {
      // Raycast project mouse position onto a Z depth plane (approx depth of current item)
      const vector = new THREE.Vector3(state.pointer.x, state.pointer.y, 0.5);
      vector.unproject(state.camera);
      const dir = vector.sub(state.camera.position).normalize();
      
      // Calculate intersection distance with a Z plane relative to current depth
      const currentZ = groupRef.current.position.z;
      const distance = (currentZ - state.camera.position.z) / dir.z;
      const targetPos = state.camera.position.clone().add(dir.multiplyScalar(distance));

      // Calculate translation velocity vector
      const deltaX = targetPos.x - groupRef.current.position.x;
      const deltaY = targetPos.y - groupRef.current.position.y;
      const deltaZ = targetPos.z - groupRef.current.position.z;

      // Update positions smoothly
      groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetPos.x, 0.3);
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetPos.y, 0.3);
      groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, targetPos.z, 0.3);

      // Boundary clamp inside room
      groupRef.current.position.x = THREE.MathUtils.clamp(groupRef.current.position.x, -4.5, 4.5);
      groupRef.current.position.y = THREE.MathUtils.clamp(groupRef.current.position.y, 0.06, 3.5);
      groupRef.current.position.z = THREE.MathUtils.clamp(groupRef.current.position.z, -0.9, 4.5);

      // Track momentum velocity
      velocityRef.current = [deltaX * 0.5, deltaY * 0.5, deltaZ * 0.5];
    } else if (isThrown) {
      // Apply gravity
      velocityRef.current[1] -= 0.016;

      // Apply drag friction
      velocityRef.current[0] *= 0.98;
      velocityRef.current[2] *= 0.98;

      let newX = groupRef.current.position.x + velocityRef.current[0];
      let newY = groupRef.current.position.y + velocityRef.current[1];
      let newZ = groupRef.current.position.z + velocityRef.current[2];

      // Floor bounce check (floor height y = 0.06)
      if (newY <= 0.06) {
        newY = 0.06;
        velocityRef.current[1] = -velocityRef.current[1] * 0.55; // bounce elasticity
        velocityRef.current[0] *= 0.65; // floor friction
        velocityRef.current[2] *= 0.65;
      }

      // Ceiling bounce
      if (newY >= 3.8) {
        newY = 3.8;
        velocityRef.current[1] = -velocityRef.current[1] * 0.55;
      }

      // Left/Right Walls bounce
      if (newX <= -4.8) {
        newX = -4.8;
        velocityRef.current[0] = -velocityRef.current[0] * 0.55;
      } else if (newX >= 4.8) {
        newX = 4.8;
        velocityRef.current[0] = -velocityRef.current[0] * 0.55;
      }

      // Back/Front Walls bounce
      if (newZ <= -0.95) {
        newZ = -0.95;
        velocityRef.current[2] = -velocityRef.current[2] * 0.55;
      } else if (newZ >= 4.85) {
        newZ = 4.85;
        velocityRef.current[2] = -velocityRef.current[2] * 0.55;
      }

      groupRef.current.position.set(newX, newY, newZ);
    }
  });

  const handlePointerDown = (e: any) => {
    // Can only grab if the fridge is open OR if it is already out of the fridge
    if (!fridgeOpen && !isThrown) return;
    
    e.stopPropagation();
    setIsDragging(true);
    setIsThrown(false);
    (window as any).isDraggingDraggableItem = true;
    document.body.style.cursor = 'grabbing';
  };

  const handlePointerUp = (e: any) => {
    if (!isDragging) return;
    e.stopPropagation();
    setIsDragging(false);
    setIsThrown(true);
    (window as any).isDraggingDraggableItem = false;
    document.body.style.cursor = 'default';
  };

  const handlePointerOver = (e: any) => {
    if (fridgeOpen || isThrown) {
      e.stopPropagation();
      document.body.style.cursor = 'grab';
    }
  };

  const handlePointerOut = () => {
    document.body.style.cursor = 'default';
  };

  return (
    <group
      ref={groupRef}
      position={initialPosition}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      scale={scale}
    >
      {type === 'can' ? (
        <group>
          {/* Main Soda Can Cylinder */}
          <mesh castShadow>
            <cylinderGeometry args={[0.035, 0.035, 0.1, 12]} />
            <meshStandardMaterial color={color} roughness={0.35} metalness={0.8} />
          </mesh>
          {/* Label ring */}
          <mesh position={[0, 0, 0.001]}>
            <cylinderGeometry args={[0.036, 0.036, 0.04, 12]} />
            <meshStandardMaterial color={labelColor} roughness={0.4} />
          </mesh>
        </group>
      ) : (
        /* Snack Box */
        <mesh castShadow>
          <boxGeometry args={[0.13, 0.06, 0.13]} />
          <meshStandardMaterial color={color} roughness={0.85} />
        </mesh>
      )}
    </group>
  );
};

// -------------------------------------------------------------
// ENVIRONMENT DETAILS COMPONENT
// -------------------------------------------------------------
export const EnvironmentDetails: React.FC<EnvironmentDetailsProps> = ({
  lampOn,
  setLampOn,
  activeView
}) => {
  const [lampHovered, setLampHovered] = useState(false);
  const [serverHovered, setServerHovered] = useState(false);
  const [fridgeOpen, setFridgeOpen] = useState(false);
  const [plantRustleTime, setPlantRustleTime] = useState(0);
  const plantRef = useRef<THREE.Group>(null);
  const serverLEDsRef = useRef<THREE.Group>(null);
  const pcFansRef = useRef<THREE.Group>(null);

  // Animate server rack flashing lights & PC rotating fans
  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    // 1. Server LEDs
    if (serverLEDsRef.current) {
      serverLEDsRef.current.children.forEach((mesh, index) => {
        const standardMaterial = (mesh as THREE.Mesh).material as THREE.MeshStandardMaterial;
        if (standardMaterial) {
          const speed = 3 + (index % 5) * 2;
          const blink = Math.sin(time * speed + index) > 0.3;
          const baseIntensity = serverHovered ? 2.5 : 1.2;
          standardMaterial.emissiveIntensity = blink ? baseIntensity : 0.05;
        }
      });
    }

    // 2. PC Fans Rotation (Gaming Room Element)
    if (pcFansRef.current) {
      pcFansRef.current.children.forEach((fanGroup) => {
        fanGroup.rotation.z = time * 8; // Fast spin
      });
    }

    // 3. Plant Leaves Rustle
    if (plantRef.current && plantRustleTime > 0) {
      const elapsed = (Date.now() / 1000) - plantRustleTime;
      if (elapsed < 1.0) {
        // Decay oscillating angle back to rest
        plantRef.current.rotation.y = Math.sin(elapsed * 20) * 0.16 * (1.0 - elapsed);
        plantRef.current.rotation.x = Math.sin(elapsed * 12) * 0.05 * (1.0 - elapsed);
      } else {
        plantRef.current.rotation.y = 0;
        plantRef.current.rotation.x = 0;
      }
    }
  });

  const handleLampClick = (e: any) => {
    e.stopPropagation();
    setLampOn(!lampOn);
  };

  const handleLampOver = (e: any) => {
    if (activeView === 'desk') {
      e.stopPropagation();
      setLampHovered(true);
      document.body.style.cursor = 'pointer';
    }
  };

  const handleLampOut = () => {
    setLampHovered(false);
    document.body.style.cursor = 'default';
  };

  // Generate server LED coordinates
  const leds: { pos: [number, number, number]; color: string }[] = [];
  const colPositions = [-2.85, 2.85];
  colPositions.forEach((xOffset) => {
    for (let row = 0; row < 10; row++) {
      for (let col = 0; col < 3; col++) {
        const color = (row + col) % 2 === 0 ? "#b100e8" : "#39ff14";
        leds.push({
          pos: [
            xOffset + (col - 1) * 0.12, 
            0.6 + row * 0.18, 
            -0.8 + (Math.random() * 0.01)
          ],
          color
        });
      }
    }
  });

  return (
    <group>
      {/* ========================================== */}
      {/*   ROOM STRUCTURE: FLOOR & WALLS            */}
      {/* ========================================== */}
      {/* Floor (Tactile grid patterns) */}
      <mesh position={[0, -0.01, 2]} receiveShadow>
        <boxGeometry args={[10, 0.02, 7]} />
        <meshStandardMaterial color="#120c24" roughness={0.85} metalness={0.1} />
      </mesh>
      {/* Floor Grid lines (decorations) */}
      <gridHelper args={[10, 10, "#39ff14", "#200f3e"]} position={[0, 0.005, 2]} />

      {/* Concrete Grey Back Wall */}
      <mesh position={[0, 2.0, -1.05]} receiveShadow>
        <boxGeometry args={[10, 4.0, 0.1]} />
        <meshStandardMaterial color="#484b54" roughness={0.85} />
      </mesh>

      {/* Concrete Grey Left Wall */}
      <mesh position={[-5.0, 2.0, 2]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <boxGeometry args={[6.1, 4.0, 0.1]} />
        <meshStandardMaterial color="#484b54" roughness={0.85} />
      </mesh>

      {/* Concrete Grey Right Wall */}
      <mesh position={[5.0, 2.0, 2]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <boxGeometry args={[6.1, 4.0, 0.1]} />
        <meshStandardMaterial color="#484b54" roughness={0.85} />
      </mesh>

      {/* Concrete Grey Front Wall (Enclosing the 360 view room) */}
      <mesh position={[0, 2.0, 5.0]} rotation={[0, Math.PI, 0]} receiveShadow>
        <boxGeometry args={[10, 4.0, 0.1]} />
        <meshStandardMaterial color="#484b54" roughness={0.85} />
      </mesh>

      {/* ========================================== */}
      {/*   DECORATIVE CEILING LIGHTS                */}
      {/* ========================================== */}
      {/* Purple Ceiling LED Strip */}
      <mesh position={[-2, 3.9, 2]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.02, 0.02, 3.5, 8]} />
        <meshStandardMaterial color="#b100e8" emissive="#b100e8" emissiveIntensity={5} />
      </mesh>
      {/* Green Ceiling LED Strip */}
      <mesh position={[2, 3.9, 2]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.02, 0.02, 3.5, 8]} />
        <meshStandardMaterial color="#39ff14" emissive="#39ff14" emissiveIntensity={5} />
      </mesh>

      {/* Bright Ceiling Spotlights casting downwards to illuminate the room */}
      <pointLight position={[-3, 3.8, 1]} color="#ffffff" intensity={2.8} distance={7} decay={1.3} />
      <pointLight position={[3, 3.8, 1]} color="#ffffff" intensity={2.8} distance={7} decay={1.3} />
      <pointLight position={[0, 3.8, 3.5]} color="#ffffff" intensity={2.8} distance={7} decay={1.3} />

      {/* Left Wall Poster 1: Cyberpunk Netrunner Frame */}
      <group position={[-4.94, 2.1, 1.2]} rotation={[0, Math.PI / 2, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.8, 1.1, 0.02]} />
          <meshStandardMaterial color="#0c051a" roughness={0.6} />
        </mesh>
        <mesh position={[0, 0, 0.012]}>
          <planeGeometry args={[0.72, 1.02]} />
          <meshStandardMaterial color="#b100e8" emissive="#b100e8" emissiveIntensity={0.6} />
        </mesh>
        {/* Neon green inner crosshair lines */}
        <Line points={[[-0.2, 0.3, 0.015], [0.2, 0.3, 0.015]]} color="#39ff14" lineWidth={1.5} />
        <Line points={[[-0.3, -0.2, 0.015], [0.3, -0.2, 0.015]]} color="#39ff14" lineWidth={1.5} />
      </group>

      {/* Left Wall Poster 2: Security Shield Frame */}
      <group position={[-4.94, 2.1, 2.8]} rotation={[0, Math.PI / 2, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.8, 1.1, 0.02]} />
          <meshStandardMaterial color="#0c051a" roughness={0.6} />
        </mesh>
        <mesh position={[0, 0, 0.012]}>
          <planeGeometry args={[0.72, 1.02]} />
          <meshStandardMaterial color="#39ff14" emissive="#39ff14" emissiveIntensity={0.6} />
        </mesh>
        {/* Neon purple inner logo shield */}
        <Line points={[[-0.15, 0.2, 0.015], [0.15, 0.2, 0.015], [0.2, -0.1, 0.015], [0, -0.3, 0.015], [-0.2, -0.1, 0.015], [-0.15, 0.2, 0.015]]} color="#b100e8" lineWidth={2} />
      </group>

      {/* Right Wall Gaming Shelf with Trophies */}
      <group position={[4.9, 1.9, 2.0]} rotation={[0, -Math.PI / 2, 0]}>
        {/* Floating Shelf Board */}
        <mesh castShadow>
          <boxGeometry args={[1.5, 0.04, 0.25]} />
          <meshStandardMaterial color="#1a0f2b" roughness={0.3} metalness={0.7} />
        </mesh>
        {/* Glowing Trophy 1 (Golden sphere) */}
        <mesh position={[-0.4, 0.14, 0]} castShadow>
          <sphereGeometry args={[0.07, 16, 16]} />
          <meshStandardMaterial color="#ffd700" emissive="#ffd700" emissiveIntensity={1.8} roughness={0.1} />
        </mesh>
        {/* Glowing Trophy 2 (Cyan crystal pyramid) */}
        <mesh position={[0.4, 0.15, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
          <coneGeometry args={[0.06, 0.18, 4]} />
          <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={2.5} roughness={0.1} />
        </mesh>
      </group>

      {/* Front Wall (Behind Camera) sci-fi circular neon portal clock */}
      <group position={[0, 2.3, 4.94]} rotation={[0, Math.PI, 0]}>
        {/* Ring casing */}
        <mesh castShadow>
          <torusGeometry args={[0.7, 0.06, 8, 32]} />
          <meshStandardMaterial color="#0e061a" roughness={0.3} />
        </mesh>
        {/* Neon Clock hand 1 (Purple) */}
        <mesh position={[0, 0, 0.02]} rotation={[0, 0, Math.PI / 6]}>
          <boxGeometry args={[0.03, 0.45, 0.01]} />
          <meshStandardMaterial color="#b100e8" emissive="#b100e8" emissiveIntensity={5} />
        </mesh>
        {/* Neon Clock hand 2 (Green) */}
        <mesh position={[0, 0, 0.02]} rotation={[0, 0, -Math.PI / 3]}>
          <boxGeometry args={[0.03, 0.32, 0.01]} />
          <meshStandardMaterial color="#39ff14" emissive="#39ff14" emissiveIntensity={5} />
        </mesh>
      </group>

      {/* ========================================== */}
      {/*   1. SERVER RACKS WITH RGB VERTICAL ACCENTS */}
      {/* ========================================== */}
      {/* Left Server Cabinet */}
      <mesh position={[-2.85, 1.2, -0.9]} castShadow receiveShadow>
        <boxGeometry args={[0.7, 2.4, 0.7]} />
        <meshStandardMaterial color="#0f0720" roughness={0.4} metalness={0.9} />
      </mesh>
      {/* Left cabinet vertical glow stripe */}
      <mesh position={[-2.48, 1.2, -0.53]}>
        <boxGeometry args={[0.015, 2.38, 0.015]} />
        <meshStandardMaterial color="#b100e8" emissive="#b100e8" emissiveIntensity={3} />
      </mesh>

      {/* Right Server Cabinet */}
      <mesh position={[2.85, 1.2, -0.9]} castShadow receiveShadow>
        <boxGeometry args={[0.7, 2.4, 0.7]} />
        <meshStandardMaterial color="#0f0720" roughness={0.4} metalness={0.9} />
      </mesh>
      {/* Right cabinet vertical glow stripe */}
      <mesh position={[2.48, 1.2, -0.53]}>
        <boxGeometry args={[0.015, 2.38, 0.015]} />
        <meshStandardMaterial color="#39ff14" emissive="#39ff14" emissiveIntensity={3} />
      </mesh>

      {/* Flashing Server LEDs */}
      <group 
        ref={serverLEDsRef}
        onPointerOver={() => setServerHovered(true)}
        onPointerOut={() => setServerHovered(false)}
      >
        {leds.map((led, index) => (
          <mesh key={index} position={[led.pos[0], led.pos[1] + 0.2, led.pos[2] + 0.1]}>
            <boxGeometry args={[0.04, 0.04, 0.04]} />
            <meshStandardMaterial 
              color={led.color} 
              emissive={led.color} 
              emissiveIntensity={1.0} 
              roughness={0} 
            />
          </mesh>
        ))}
      </group>

      {/* ========================================== */}
      {/*   2. COHESIVE CYBER ERGONOMIC GAMING CHAIR */}
      {/* ========================================== */}
      <group position={[0, 0, 1.52]} rotation={[0, 0, 0]}>
        {/* 5 Wheel Legs Spokes */}
        {[0, 1, 2, 3, 4].map((i) => {
          const angle = (i * Math.PI * 2) / 5;
          return (
            <mesh key={i} position={[Math.sin(angle) * 0.15, 0.04, Math.cos(angle) * 0.15]} rotation={[0, angle, Math.PI / 2]} castShadow>
              <cylinderGeometry args={[0.015, 0.015, 0.3]} />
              <meshStandardMaterial color="#0c0715" roughness={0.4} />
            </mesh>
          );
        })}
        {/* Hydraulic Cylinder */}
        <mesh position={[0, 0.2, 0]} castShadow>
          <cylinderGeometry args={[0.035, 0.035, 0.32]} />
          <meshStandardMaterial color="#2d2d3a" metalness={0.9} roughness={0.1} />
        </mesh>
        {/* Seat Cushion */}
        <mesh position={[0, 0.38, 0]} castShadow>
          <boxGeometry args={[0.55, 0.08, 0.52]} />
          <meshStandardMaterial color="#100720" roughness={0.7} />
        </mesh>
        {/* Contoured Backrest */}
        <mesh position={[0, 0.8, 0.2]} rotation={[0.08, 0, 0]} castShadow>
          <boxGeometry args={[0.48, 0.72, 0.06]} />
          <meshStandardMaterial color="#12092b" roughness={0.8} />
        </mesh>
        {/* Backrest connecting bar */}
        <mesh position={[0, 0.58, 0.22]} rotation={[0.08, 0, 0]} castShadow>
          <boxGeometry args={[0.08, 0.42, 0.03]} />
          <meshStandardMaterial color="#1c142c" metalness={0.8} roughness={0.3} />
        </mesh>
        {/* Armrest Left Support */}
        <mesh position={[-0.28, 0.49, 0.05]} castShadow>
          <boxGeometry args={[0.03, 0.22, 0.03]} />
          <meshStandardMaterial color="#1c142c" roughness={0.5} />
        </mesh>
        {/* Armrest Left Pad */}
        <mesh position={[-0.28, 0.6, 0.05]} castShadow>
          <boxGeometry args={[0.06, 0.03, 0.26]} />
          <meshStandardMaterial color="#0b0616" roughness={0.6} />
        </mesh>
        {/* Armrest Right Support */}
        <mesh position={[0.28, 0.49, 0.05]} castShadow>
          <boxGeometry args={[0.03, 0.22, 0.03]} />
          <meshStandardMaterial color="#1c142c" roughness={0.5} />
        </mesh>
        {/* Armrest Right Pad */}
        <mesh position={[0.28, 0.6, 0.05]} castShadow>
          <boxGeometry args={[0.06, 0.03, 0.26]} />
          <meshStandardMaterial color="#0b0616" roughness={0.6} />
        </mesh>
        {/* Chair RGB lights */}
        <mesh position={[-0.25, 0.8, 0.23]} rotation={[0.08, 0, 0]}>
          <boxGeometry args={[0.02, 0.65, 0.02]} />
          <meshStandardMaterial color="#b100e8" emissive="#b100e8" emissiveIntensity={2.5} />
        </mesh>
        <mesh position={[0.25, 0.8, 0.23]} rotation={[0.08, 0, 0]}>
          <boxGeometry args={[0.02, 0.65, 0.02]} />
          <meshStandardMaterial color="#39ff14" emissive="#39ff14" emissiveIntensity={2.5} />
        </mesh>
      </group>

      {/* ========================================== */}
      {/*   3. TABLE LAMP (WITH TOGGLE SWITCH)       */}
      {/* ========================================== */}
      <group 
        position={[-1.6, 0.8, -0.3]} 
        onClick={handleLampClick}
        onPointerOver={handleLampOver}
        onPointerOut={handleLampOut}
      >
        <mesh position={[0, 0.015, 0]} castShadow>
          <cylinderGeometry args={[0.1, 0.1, 0.02, 16]} />
          <meshStandardMaterial color="#1f1435" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0.2, 0]} rotation={[0.2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.012, 0.012, 0.4]} />
          <meshStandardMaterial color="#352654" metalness={0.9} roughness={0.1} />
        </mesh>
        <mesh position={[0, 0.45, 0.08]} rotation={[-0.4, 0, 0]} castShadow>
          <cylinderGeometry args={[0.01, 0.01, 0.3]} />
          <meshStandardMaterial color="#352654" metalness={0.9} roughness={0.1} />
        </mesh>
        <mesh position={[0, 0.58, 0.18]} rotation={[0.4, 0, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.03, 0.12, 16]} />
          <meshStandardMaterial 
            color={lampHovered ? "#b100e8" : "#1f1435"} 
            roughness={0.3} 
            metalness={0.7} 
          />
        </mesh>
        <mesh position={[0, 0.53, 0.16]}>
          <sphereGeometry args={[0.022, 16, 16]} />
          <meshBasicMaterial color={lampOn ? "#ffffff" : "#444455"} />
        </mesh>

        {lampOn && (
          <spotLight
            position={[0, 0.52, 0.15]}
            angle={0.7}
            penumbra={0.6}
            intensity={4.0}
            color="#ffffff"
            castShadow
            target-position={[-1.1, 0.8, 0.4]}
          />
        )}
      </group>

      {/* ========================================== */}
      {/*   4. SCATTERED BOOKS & DECORATIONS         */}
      {/* ========================================== */}
      <group position={[-1.7, 0.8, -0.65]} rotation={[0, Math.PI / 12, 0]}>
        <mesh position={[0, 0.02, 0]} castShadow>
          <boxGeometry args={[0.26, 0.04, 0.32]} />
          <meshStandardMaterial color="#311042" roughness={0.9} />
        </mesh>
        <mesh position={[0.01, 0.05, 0.01]} rotation={[0, -Math.PI / 24, 0]} castShadow>
          <boxGeometry args={[0.24, 0.03, 0.3]} />
          <meshStandardMaterial color="#1a2f1b" roughness={0.9} />
        </mesh>
        <mesh position={[-0.01, 0.075, 0.02]} rotation={[0, Math.PI / 18, 0]} castShadow>
          <boxGeometry args={[0.22, 0.025, 0.28]} />
          <meshStandardMaterial color="#2c0c16" roughness={0.9} />
        </mesh>
      </group>

      {/* Coffee Mug */}
      <group position={[1.2, 0.8, 0.65]} rotation={[0, -Math.PI / 6, 0]}>
        <mesh position={[0, 0.04, 0]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 0.08, 16]} />
          <meshStandardMaterial color="#0e0618" roughness={0.3} />
        </mesh>
        <mesh position={[0.04, 0.04, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.025, 0.007, 8, 16, Math.PI]} />
          <meshStandardMaterial color="#0e0618" roughness={0.3} />
        </mesh>
      </group>

      {/* ========================================== */}
      {/*   5. COMPLEX NETWORK WIRING                */}
      {/* ========================================== */}
      <Line
        points={[
          [-2.5, 0.4, -0.65],
          [-2.2, 0.2, -0.2],
          [-1.5, 0.76, -0.4]
        ]}
        color="#b100e8"
        lineWidth={2}
        transparent
        opacity={0.7}
      />
      <Line
        points={[
          [-2.5, 0.8, -0.7],
          [-2.0, 0.4, -0.5],
          [-0.2, 0.76, -0.7]
        ]}
        color="#39ff14"
        lineWidth={2.5}
        transparent
        opacity={0.8}
      />
      <Line
        points={[
          [2.5, 0.5, -0.65],
          [2.0, 0.2, -0.3],
          [1.5, 0.76, -0.4]
        ]}
        color="#39ff14"
        lineWidth={2}
        transparent
        opacity={0.7}
      />
      <Line
        points={[
          [2.5, 1.8, -0.75],
          [1.8, 2.5, -0.8]
        ]}
        color="#b100e8"
        lineWidth={1.5}
        transparent
        opacity={0.6}
      />

      {/* ========================================== */}
      {/*   6. WALL RGB LED TUBES                    */}
      {/* ========================================== */}
      <group position={[0, 1.25, -0.96]}>
        {/* Top Purple Glow Strip */}
        <mesh position={[0, 0.04, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.015, 0.015, 4.4, 8]} />
          <meshStandardMaterial color="#b100e8" emissive="#b100e8" emissiveIntensity={5} />
        </mesh>
        {/* Bottom Green Glow Strip */}
        <mesh position={[0, -0.04, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.015, 0.015, 4.4, 8]} />
          <meshStandardMaterial color="#39ff14" emissive="#39ff14" emissiveIntensity={5} />
        </mesh>
        
        {/* Glowing illumination backwash on wall */}
        <pointLight position={[-1.2, 0.1, 0.15]} color="#b100e8" intensity={2.8} distance={3.8} decay={1.8} />
        <pointLight position={[1.2, 0.1, 0.15]} color="#39ff14" intensity={2.8} distance={3.8} decay={1.8} />
      </group>

      {/* ========================================== */}
      {/*   7. NEON CODE BRACKETS WALL SIGN          */}
      {/* ========================================== */}
      <group position={[0, 2.45, -0.98]}>
        {/* Bracket Left */}
        <mesh position={[-0.45, 0, 0]} rotation={[0, 0, Math.PI / 4]}>
          <boxGeometry args={[0.025, 0.28, 0.015]} />
          <meshStandardMaterial color="#b100e8" emissive="#b100e8" emissiveIntensity={7} />
        </mesh>
        <mesh position={[-0.45, -0.14, 0]} rotation={[0, 0, -Math.PI / 4]}>
          <boxGeometry args={[0.025, 0.28, 0.015]} />
          <meshStandardMaterial color="#b100e8" emissive="#b100e8" emissiveIntensity={7} />
        </mesh>
        
        {/* Slash Center */}
        <mesh position={[0, -0.07, 0]} rotation={[0, 0, -Math.PI / 8]}>
          <boxGeometry args={[0.025, 0.45, 0.015]} />
          <meshStandardMaterial color="#39ff14" emissive="#39ff14" emissiveIntensity={8} />
        </mesh>

        {/* Bracket Right */}
        <mesh position={[0.45, 0, 0]} rotation={[0, 0, -Math.PI / 4]}>
          <boxGeometry args={[0.025, 0.28, 0.015]} />
          <meshStandardMaterial color="#b100e8" emissive="#b100e8" emissiveIntensity={7} />
        </mesh>
        <mesh position={[0.45, -0.14, 0]} rotation={[0, 0, Math.PI / 4]}>
          <boxGeometry args={[0.025, 0.28, 0.015]} />
          <meshStandardMaterial color="#b100e8" emissive="#b100e8" emissiveIntensity={7} />
        </mesh>

        {/* Neon Light Cast */}
        <pointLight position={[0, -0.07, 0.2]} color="#b100e8" intensity={2.0} distance={3.0} />
      </group>

      {/* ========================================== */}
      {/*   8. DESKTOP GAMING SPEAKERS WITH RGB RINGS */}
      {/* ========================================== */}
      {/* Left Speaker */}
      <group position={[-1.25, 0.92, -0.12]} rotation={[0, Math.PI / 8, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.13, 0.24, 0.13]} />
          <meshStandardMaterial color="#0e061a" roughness={0.3} metalness={0.7} />
        </mesh>
        <mesh position={[0, -0.04, 0.066]}>
          <ringGeometry args={[0.034, 0.04, 32]} />
          <meshStandardMaterial color="#b100e8" emissive="#b100e8" emissiveIntensity={5} />
        </mesh>
        <mesh position={[0, 0.05, 0.066]}>
          <ringGeometry args={[0.018, 0.022, 32]} />
          <meshStandardMaterial color="#39ff14" emissive="#39ff14" emissiveIntensity={5} />
        </mesh>
      </group>

      {/* Right Speaker */}
      <group position={[1.25, 0.92, -0.12]} rotation={[0, -Math.PI / 8, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.13, 0.24, 0.13]} />
          <meshStandardMaterial color="#0e061a" roughness={0.3} metalness={0.7} />
        </mesh>
        <mesh position={[0, -0.04, 0.066]}>
          <ringGeometry args={[0.034, 0.04, 32]} />
          <meshStandardMaterial color="#39ff14" emissive="#39ff14" emissiveIntensity={5} />
        </mesh>
        <mesh position={[0, 0.05, 0.066]}>
          <ringGeometry args={[0.018, 0.022, 32]} />
          <meshStandardMaterial color="#b100e8" emissive="#b100e8" emissiveIntensity={5} />
        </mesh>
      </group>

      {/* ========================================== */}
      {/*   9. HIGH-END DESKTOP GAMING PC CASE       */}
      {/* ========================================== */}
      <group position={[2.0, 1.05, -0.22]} rotation={[0, -Math.PI / 6, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.26, 0.52, 0.44]} />
          <meshStandardMaterial color="#080312" roughness={0.15} metalness={0.95} />
        </mesh>
        <mesh position={[-0.132, 0, 0]}>
          <boxGeometry args={[0.005, 0.46, 0.38]} />
          <meshStandardMaterial color="#b100e8" transparent opacity={0.32} roughness={0.05} metalness={0.9} />
        </mesh>
        <pointLight position={[0, 0.05, 0]} color="#b100e8" intensity={1.8} distance={1.8} />
        <pointLight position={[0, -0.15, 0.05]} color="#39ff14" intensity={1.4} distance={1.5} />

        <mesh position={[0, 0.08, -0.05]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.05, 0.05, 0.03, 16]} />
          <meshStandardMaterial color="#39ff14" emissive="#39ff14" emissiveIntensity={3.5} />
        </mesh>
        <mesh position={[0.02, 0.1, 0.08]}>
          <boxGeometry args={[0.01, 0.09, 0.014]} />
          <meshStandardMaterial color="#b100e8" emissive="#b100e8" emissiveIntensity={4} />
        </mesh>
        <mesh position={[0.02, 0.1, 0.10]}>
          <boxGeometry args={[0.01, 0.09, 0.014]} />
          <meshStandardMaterial color="#39ff14" emissive="#39ff14" emissiveIntensity={4} />
        </mesh>

        <group ref={pcFansRef}>
          <group position={[0, 0.14, 0.222]}>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <ringGeometry args={[0.045, 0.075, 16]} />
              <meshStandardMaterial color="#b100e8" emissive="#b100e8" emissiveIntensity={3} transparent opacity={0.8} />
            </mesh>
            <Line points={[[-0.07, 0, 0], [0.07, 0, 0]]} color="#b100e8" lineWidth={2} />
            <Line points={[[0, -0.07, 0], [0, 0.07, 0]]} color="#b100e8" lineWidth={2} />
          </group>
          <group position={[0, -0.1, 0.222]}>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <ringGeometry args={[0.045, 0.075, 16]} />
              <meshStandardMaterial color="#39ff14" emissive="#39ff14" emissiveIntensity={3} transparent opacity={0.8} />
            </mesh>
            <Line points={[[-0.07, 0, 0], [0.07, 0, 0]]} color="#39ff14" lineWidth={2} />
            <Line points={[[0, -0.07, 0], [0, 0.07, 0]]} color="#39ff14" lineWidth={2} />
          </group>
          <group position={[0, 0.12, -0.222]}>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <ringGeometry args={[0.04, 0.065, 16]} />
              <meshStandardMaterial color="#b100e8" emissive="#b100e8" emissiveIntensity={3} transparent opacity={0.8} />
            </mesh>
            <Line points={[[-0.06, 0, 0], [0.06, 0, 0]]} color="#b100e8" lineWidth={2} />
            <Line points={[[0, -0.06, 0], [0, 0.06, 0]]} color="#b100e8" lineWidth={2} />
          </group>
        </group>
      </group>

      {/* ========================================== */}
      {/*   GLOWING RETRO PIXEL ART ON THE WALL      */}
      {/* ========================================== */}
      {/* Left Wall Pixel Art: Space Invader */}
      <group position={[-1.85, 2.3, -0.99]}>
        <mesh position={[0, 0, -0.01]}>
          <boxGeometry args={[0.42, 0.42, 0.01]} />
          <meshStandardMaterial color="#080312" roughness={0.5} />
        </mesh>
        <Line 
          points={[
            [-0.21, 0.21, 0],
            [0.21, 0.21, 0],
            [0.21, -0.21, 0],
            [-0.21, -0.21, 0],
            [-0.21, 0.21, 0]
          ]}
          color="#39ff14"
          lineWidth={1.5}
        />
        {invaderPixels.map(([r, c], idx) => (
          <mesh key={idx} position={[(c - 3.5) * 0.04, (3.5 - r) * 0.04, 0]}>
            <boxGeometry args={[0.034, 0.034, 0.012]} />
            <meshStandardMaterial color="#39ff14" emissive="#39ff14" emissiveIntensity={6} />
          </mesh>
        ))}
      </group>

      {/* Right Wall Pixel Art: Security Key */}
      <group position={[1.85, 2.3, -0.99]}>
        <mesh position={[0, 0, -0.01]}>
          <boxGeometry args={[0.42, 0.42, 0.01]} />
          <meshStandardMaterial color="#080312" roughness={0.5} />
        </mesh>
        <Line 
          points={[
            [-0.21, 0.21, 0],
            [0.21, 0.21, 0],
            [0.21, -0.21, 0],
            [-0.21, -0.21, 0],
            [-0.21, 0.21, 0]
          ]}
          color="#b100e8"
          lineWidth={1.5}
        />
        {keyPixels.map(([r, c], idx) => (
          <mesh key={idx} position={[(c - 3.5) * 0.04, (3.5 - r) * 0.04, 0]}>
            <boxGeometry args={[0.034, 0.034, 0.012]} />
            <meshStandardMaterial color="#b100e8" emissive="#b100e8" emissiveIntensity={6} />
          </mesh>
        ))}
      </group>

      {/* ========================================== */}
      {/*   REFRIGERATOR MAIN UNIT                   */}
      {/* ========================================== */}
      <group position={[-2.3, 0.5, -0.25]} rotation={[0, Math.PI / 4, 0]}>
        {/* Main outer metal casing */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.5, 1.0, 0.5]} />
          <meshStandardMaterial color="#0f0b18" roughness={0.2} metalness={0.8} />
        </mesh>
        {/* Bottom Shelf Wire */}
        <mesh position={[0, -0.15, 0.02]}>
          <boxGeometry args={[0.46, 0.015, 0.42]} />
          <meshStandardMaterial color="#1a122e" roughness={0.5} />
        </mesh>
        {/* Middle Shelf Wire */}
        <mesh position={[0, 0.2, 0.02]}>
          <boxGeometry args={[0.46, 0.015, 0.42]} />
          <meshStandardMaterial color="#1a122e" roughness={0.5} />
        </mesh>
        {/* LED Interior Backwash Light */}
        <pointLight position={[0, 0.15, 0.1]} color="#00f0ff" intensity={2.5} distance={1.8} />

        {/* Swinging transparent door hinged on the side */}
        <mesh 
          position={fridgeOpen ? [0.22, 0, 0.36] : [0, 0, 0.251]} 
          rotation={fridgeOpen ? [0, Math.PI / 2.2, 0] : [0, 0, 0]}
          onClick={(e) => {
            e.stopPropagation();
            setFridgeOpen(!fridgeOpen);
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            document.body.style.cursor = 'pointer';
          }}
          onPointerOut={() => {
            document.body.style.cursor = 'default';
          }}
        >
          <boxGeometry args={[0.46, 0.94, 0.01]} />
          <meshStandardMaterial color="#00d8ff" transparent opacity={0.2} roughness={0.05} metalness={0.9} />
        </mesh>
      </group>

      {/* ========================================== */}
      {/*   PHYSICALLY INTERACTIVE COKE CANS & SNACKS */}
      {/* ========================================== */}
      {/* Absolute positioned items mapped on shelf coordinates */}
      <DraggableItem type="can" color="#ff0000" labelColor="#ffffff" initialPosition={[-2.33, 0.4, -0.11]} fridgeOpen={fridgeOpen} />
      <DraggableItem type="can" color="#ff0000" labelColor="#ffffff" initialPosition={[-2.27, 0.4, -0.22]} fridgeOpen={fridgeOpen} />
      <DraggableItem type="can" color="#ff0000" labelColor="#ffffff" initialPosition={[-2.16, 0.4, -0.28]} fridgeOpen={fridgeOpen} />
      <DraggableItem type="can" color="#ff0000" labelColor="#ffffff" initialPosition={[-2.3, 0.75, -0.17]} fridgeOpen={fridgeOpen} />
      <DraggableItem type="can" color="#ff0000" labelColor="#ffffff" initialPosition={[-2.22, 0.75, -0.25]} fridgeOpen={fridgeOpen} />
      
      <DraggableItem type="snack" color="#ff6b00" initialPosition={[-2.36, 1.01, -0.19]} fridgeOpen={fridgeOpen} />
      <DraggableItem type="snack" color="#ffcc00" initialPosition={[-2.21, 1.01, -0.27]} fridgeOpen={fridgeOpen} />

      {/* ========================================== */}
      {/*   WALL AIR CONDITIONER (AIRCOND)           */}
      {/* ========================================== */}
      <group position={[0, 3.4, -0.98]}>
        <mesh castShadow>
          <boxGeometry args={[1.2, 0.28, 0.22]} />
          <meshStandardMaterial color="#f0f2f5" roughness={0.2} metalness={0.1} />
        </mesh>
        <mesh position={[0, -0.13, 0.02]} rotation={[0.2, 0, 0]} castShadow>
          <boxGeometry args={[1.1, 0.02, 0.18]} />
          <meshStandardMaterial color="#dcdfe4" roughness={0.3} />
        </mesh>
        <mesh position={[0.5, -0.06, 0.111]}>
          <sphereGeometry args={[0.012, 8, 8]} />
          <meshStandardMaterial color="#39ff14" emissive="#39ff14" emissiveIntensity={3} />
        </mesh>
        <pointLight position={[0, -0.2, 0.15]} color="#00d8ff" intensity={1.5} distance={2.5} decay={2} />
      </group>

      {/* ========================================== */}
      {/*   MEDIUM/LARGE HOUSEPLANT (RIGHT CORNER)   */}
      {/* ========================================== */}
      <group position={[3.6, 0.22, 3.2]}>
        {/* Ceramic Clay Pot (Medium size) */}
        <mesh castShadow>
          <cylinderGeometry args={[0.26, 0.18, 0.45, 12]} />
          <meshStandardMaterial color="#8e533d" roughness={0.8} />
        </mesh>
        {/* Soil */}
        <mesh position={[0, 0.21, 0]}>
          <cylinderGeometry args={[0.25, 0.25, 0.02, 12]} />
          <meshStandardMaterial color="#3d2314" roughness={0.9} />
        </mesh>
        {/* Palm Leaves group (Click/hover to rustle) */}
        <group 
          ref={plantRef}
          position={[0, 0.24, 0]}
          onClick={(e) => {
            e.stopPropagation();
            setPlantRustleTime(Date.now() / 1000);
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            document.body.style.cursor = 'pointer';
          }}
          onPointerOut={() => {
            document.body.style.cursor = 'default';
          }}
        >
          <mesh rotation={[0.35, 0, 0.1]} castShadow>
            <boxGeometry args={[0.06, 0.9, 0.15]} />
            <meshStandardMaterial color="#1a6321" roughness={0.75} />
          </mesh>
          <mesh rotation={[-0.35, Math.PI / 3, -0.1]} castShadow>
            <boxGeometry args={[0.06, 0.9, 0.15]} />
            <meshStandardMaterial color="#1a6321" roughness={0.75} />
          </mesh>
          <mesh rotation={[0.2, -Math.PI / 3, 0.2]} castShadow>
            <boxGeometry args={[0.06, 0.9, 0.15]} />
            <meshStandardMaterial color="#1a6321" roughness={0.75} />
          </mesh>
          <mesh rotation={[-0.3, -Math.PI / 1.5, -0.15]} castShadow>
            <boxGeometry args={[0.05, 0.75, 0.12]} />
            <meshStandardMaterial color="#217929" roughness={0.75} />
          </mesh>
          <mesh rotation={[0.3, Math.PI / 1.5, 0.15]} castShadow>
            <boxGeometry args={[0.05, 0.75, 0.12]} />
            <meshStandardMaterial color="#217929" roughness={0.75} />
          </mesh>
        </group>
      </group>

    </group>
  );
};

// Retro Pixel Art Coordinate Arrays
const invaderPixels = [
  [0, 2], [0, 5],
  [1, 3], [1, 4],
  [2, 1], [2, 2], [2, 3], [2, 4], [2, 5], [2, 6],
  [3, 0], [3, 1], [3, 3], [3, 4], [3, 6], [3, 7],
  [4, 0], [4, 1], [4, 2], [4, 3], [4, 4], [4, 5], [4, 6], [4, 7],
  [5, 1], [5, 2], [5, 3], [5, 4], [5, 5], [5, 6],
  [6, 1], [6, 6],
  [7, 0], [7, 7]
];

const keyPixels = [
  [0, 3], [0, 4],
  [1, 2], [1, 5],
  [2, 2], [2, 5],
  [3, 3], [3, 4],
  [4, 3], [4, 4],
  [5, 3], [5, 4], [5, 6],
  [6, 3], [6, 4],
  [7, 3], [7, 4], [7, 6]
];

export default EnvironmentDetails;

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import type { ViewState } from '../types';
import InteractiveObject from './InteractiveObject';
import CyberDashboard from './CyberDashboard';

interface HackingDeskProps {
  activeView: ViewState;
  onNavigate: (view: ViewState) => void;
}

export const HackingDesk: React.FC<HackingDeskProps> = ({ 
  activeView, 
  onNavigate
}) => {
  const usbHoloRef = useRef<THREE.Mesh>(null);
  const phoneGlowRef = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);

  // Animate elements inside the frame loop
  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    // Rotate USB holographic rings (mixed purple and green)
    if (usbHoloRef.current) {
      usbHoloRef.current.rotation.y = time * 1.8;
      usbHoloRef.current.rotation.z = Math.cos(time * 0.8) * 0.15;
      usbHoloRef.current.position.y = 0.96 + Math.sin(time * 3) * 0.015;
    }

    // Pulse phone screen
    if (phoneGlowRef.current) {
      const material = phoneGlowRef.current.material as THREE.MeshStandardMaterial;
      if (material) {
        material.emissiveIntensity = 0.4 + Math.sin(time * 5) * 0.25;
      }
    }

    // Rotate atmospheric dust particles
    if (particlesRef.current) {
      particlesRef.current.rotation.y = time * 0.04;
      particlesRef.current.rotation.z = Math.sin(time * 0.03) * 0.03;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* 1. SCENE LIGHTING (Strictly Purple to Green Gradient ambient vibes) */}
      {/* Deep purple ambient glow for the room */}
      <ambientLight intensity={0.7} color="#8a5cd6" />

      {/* Main room light (overhead purple ambient fill) */}
      <directionalLight 
        position={[0, 5, 0]} 
        intensity={2.8} 
        color="#9c4df4" 
        castShadow
        shadow-bias={-0.001}
      />

      {/* Warm room lighting to make objects (fridge, chair, floor) visible */}
      <directionalLight 
        position={[0, 8, 4]} 
        intensity={2.2} 
        color="#ffffff" 
        castShadow
      />

      {/* Under-desk neon LED strip (Pulsing Magenta/Purple) */}
      <pointLight 
        position={[0, 0.5, -0.8]} 
        intensity={3.8} 
        color="#b100e8" 
        distance={4.5} 
      />

      {/* Active network green light on right wall/back corner */}
      <pointLight 
        position={[2.5, 0.9, -0.4]} 
        intensity={1.8} 
        color="#39ff14" 
        distance={3.2} 
      />

      {/* Monitor screen glow (casting soft green/purple light downwards onto keyboard) */}
      <spotLight
        position={[0, 1.6, -0.15]}
        angle={1.0}
        penumbra={0.8}
        intensity={2.2}
        color="#b100e8"
        target-position={[0, 0.8, 0.8]}
      />
      <spotLight
        position={[0, 1.6, -0.1]}
        angle={1.0}
        penumbra={0.8}
        intensity={1.2}
        color="#39ff14"
        target-position={[0, 0.8, 0.8]}
      />

      {/* 2. DESK STRUCTURE */}
      {/* Table Top (Deep obsidian/carbon color) */}
      <mesh position={[0, 0.77, 0.2]} receiveShadow castShadow>
        <boxGeometry args={[5.2, 0.06, 2.2]} />
        <meshStandardMaterial 
          color="#06030c" 
          roughness={0.18} 
          metalness={0.85} 
        />
      </mesh>
      
      {/* Left side support pillar */}
      <mesh position={[-2.4, 0.38, 0.2]} castShadow>
        <boxGeometry args={[0.08, 0.76, 2.0]} />
        <meshStandardMaterial color="#0c0716" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Right side support pillar */}
      <mesh position={[2.4, 0.38, 0.2]} castShadow>
        <boxGeometry args={[0.08, 0.76, 2.0]} />
        <meshStandardMaterial color="#0c0716" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Supporting backboard beam */}
      <mesh position={[0, 0.6, -0.6]} castShadow>
        <boxGeometry args={[4.7, 0.15, 0.05]} />
        <meshStandardMaterial color="#0b0614" metalness={0.8} />
      </mesh>

      {/* LED Backlight Bar (Glows neon purple) */}
      <mesh position={[0, 0.77, -0.9]}>
        <boxGeometry args={[4.8, 0.02, 0.02]} />
        <meshBasicMaterial color="#b100e8" />
      </mesh>

      {/* 3. PERIPHERALS */}
      {/* Keyboard with purple glow outline */}
      <group position={[0, 0.8, 0.5]}>
        <mesh position={[0, 0.01, 0]} castShadow>
          <boxGeometry args={[0.9, 0.025, 0.25]} />
          <meshStandardMaterial color="#120822" roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.001, 0]}>
          <boxGeometry args={[0.93, 0.008, 0.28]} />
          <meshBasicMaterial color="#b100e8" transparent opacity={0.5} />
        </mesh>
      </group>

      {/* Mouse */}
      <mesh position={[0.7, 0.815, 0.55]} castShadow>
        <boxGeometry args={[0.08, 0.03, 0.14]} />
        <meshStandardMaterial color="#180c2c" roughness={0.4} />
      </mesh>

      {/* 4. CENTRAL MONITOR (VIRTUAL PC) */}
      <InteractiveObject 
        onClick={() => onNavigate('monitor')} 
        activeView={activeView}
        targetView="monitor"
        glowColor="#b100e8"
      >
        {/* Scale wrapper: shrink entire monitor to look like a normal desk monitor */}
        <group scale={[0.75, 0.75, 0.75]} position={[0, 0.8, 0]}>
          {/* Base Mount Plate */}
          <mesh position={[0, 0.015, -0.2]} castShadow receiveShadow>
            <boxGeometry args={[0.6, 0.02, 0.4]} />
            <meshStandardMaterial color="#0c0716" metalness={0.8} roughness={0.2} />
          </mesh>

          {/* Vertical stand pole */}
          <mesh position={[0, 0.45, -0.2]} castShadow>
            <boxGeometry args={[0.08, 0.9, 0.08]} />
            <meshStandardMaterial color="#140b25" metalness={0.9} roughness={0.1} />
          </mesh>

          {/* Widescreen Frame Bezel */}
          <mesh position={[0, 0.9, -0.05]} castShadow>
            <boxGeometry args={[1.7, 1.06, 0.08]} />
            <meshStandardMaterial color="#0a0512" metalness={0.8} roughness={0.3} />
          </mesh>

          {/* Bezel Glowing bottom lip */}
          <mesh position={[0, 0.39, -0.03]}>
            <boxGeometry args={[0.15, 0.03, 0.01]} />
            <meshStandardMaterial color="#b100e8" emissive="#b100e8" emissiveIntensity={0.6} />
          </mesh>

          {/* Dark Glass screen surface — 1.6 wide × 0.96 high */}
          <mesh position={[0, 0.9, -0.01]}>
            <boxGeometry args={[1.6, 0.96, 0.01]} />
            <meshStandardMaterial 
              color="#0f071f" 
              roughness={0.2} 
              metalness={0.8}
              emissive="#120822"
              emissiveIntensity={0.5}
            />
          </mesh>

          {/* Interactive virtual screen: 1000×600 px at scale 0.16 = 1.6×0.96 units — matches glass exactly */}
          <Html
            transform
            scale={[0.16, 0.16, 0.16]}
            position={[0, 0.9, 0.01]}
          >
            <div
              style={{
                width: '1000px',
                height: '600px',
                pointerEvents: activeView === 'monitor' ? 'auto' : 'none',
                backgroundColor: '#030107',
                border: '2px solid #1a0f30',
                borderRadius: '4px',
                boxShadow: '0 0 15px rgba(177, 0, 232, 0.3)',
                overflow: 'hidden'
              }}
            >
              <CyberDashboard onNavigate={onNavigate} />
            </div>
          </Html>
        </group>
      </InteractiveObject>

      {/* 5. SECURITY USB KEY (SKILLS & CERTS) */}
      <InteractiveObject 
        onClick={() => onNavigate('usb')} 
        activeView={activeView}
        targetView="usb"
        glowColor="#39ff14"
      >
        <group position={[-1.7, 0.8, 0.45]} rotation={[0, Math.PI / 6, 0]}>
          {/* Metal USB Case */}
          <mesh position={[0, 0.02, 0]} castShadow>
            <boxGeometry args={[0.08, 0.04, 0.22]} />
            <meshStandardMaterial color="#1a0f2b" metalness={0.9} roughness={0.15} />
          </mesh>
          {/* Gold plug tip */}
          <mesh position={[0, 0.02, -0.12]}>
            <boxGeometry args={[0.06, 0.02, 0.04]} />
            <meshStandardMaterial color="#d4af37" metalness={0.9} />
          </mesh>
          {/* Pulsing indicator bulb (Green) */}
          <mesh position={[0, 0.042, 0.05]}>
            <sphereGeometry args={[0.012, 16, 16]} />
            <meshStandardMaterial color="#39ff14" emissive="#39ff14" emissiveIntensity={0.8} />
          </mesh>
          
          {/* Holographic glowing rings above the USB (Green/Purple) */}
          <mesh ref={usbHoloRef} position={[0, 0.15, 0]}>
            <torusGeometry args={[0.18, 0.008, 8, 24]} />
            <meshBasicMaterial 
              color="#39ff14" 
              wireframe
              transparent 
              opacity={0.7} 
            />
          </mesh>
        </group>
      </InteractiveObject>

      {/* 6. MANILA DOSSIER FOLDER (PROJECTS) -> Recolored deep purple dossier */}
      <InteractiveObject 
        onClick={() => onNavigate('folder')} 
        activeView={activeView}
        targetView="folder"
        glowColor="#b100e8"
      >
        <group position={[1.7, 0.8, 0.45]} rotation={[0, -Math.PI / 9, 0]}>
          {/* Folder base cover (Deep Purple instead of beige) */}
          <mesh position={[0, 0.005, 0]} rotation={[0.01, 0, 0]} castShadow>
            <boxGeometry args={[0.42, 0.01, 0.52]} />
            <meshStandardMaterial color="#32004f" roughness={0.7} />
          </mesh>
          {/* Inner data sheets (offset) */}
          <mesh position={[0.01, 0.012, -0.01]} rotation={[0, 0.03, 0]} castShadow>
            <boxGeometry args={[0.39, 0.005, 0.49]} />
            <meshStandardMaterial color="#f0eaff" roughness={0.85} />
          </mesh>
          <mesh position={[-0.01, 0.018, 0.01]} rotation={[0, -0.05, 0]}>
            <boxGeometry args={[0.38, 0.005, 0.48]} />
            <meshStandardMaterial color="#e2d6ff" roughness={0.85} />
          </mesh>
          {/* Top Folder cover (Half-open, dark purple) */}
          <mesh position={[-0.04, 0.05, -0.02]} rotation={[0, 0, -0.16]} castShadow>
            <boxGeometry args={[0.42, 0.01, 0.52]} />
            <meshStandardMaterial color="#24003b" roughness={0.7} />
          </mesh>
          
          {/* Glowing Green strip marker on folder cover */}
          <mesh position={[-0.04, 0.056, 0.12]} rotation={[0, 0, -0.16]}>
            <boxGeometry args={[0.28, 0.002, 0.04]} />
            <meshBasicMaterial color="#39ff14" />
          </mesh>
        </group>
      </InteractiveObject>

      {/* 7. SMARTPHONE (CONTACT LINKS) */}
      <InteractiveObject 
        onClick={() => onNavigate('phone')} 
        activeView={activeView}
        targetView="phone"
        glowColor="#39ff14"
      >
        <group position={[-0.75, 0.8, 0.72]} rotation={[0, Math.PI / 10, 0]}>
          {/* Matte phone frame */}
          <mesh position={[0, 0.01, 0]} castShadow>
            <boxGeometry args={[0.18, 0.02, 0.34]} />
            <meshStandardMaterial color="#0a0512" metalness={0.9} roughness={0.15} />
          </mesh>
          {/* Screen with purple-green gradient emission */}
          <mesh ref={phoneGlowRef} position={[0, 0.021, 0]}>
            <boxGeometry args={[0.17, 0.002, 0.33]} />
            <meshStandardMaterial 
              color="#0d041a" 
              emissive="#b100e8" 
              emissiveIntensity={0.5} 
              roughness={0.1} 
            />
          </mesh>
        </group>
      </InteractiveObject>

      {/* 8. FLOATING DATA GRID PARTICLES (Purple to green gradient colors) */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[
              new Float32Array(
                Array.from({ length: 480 }, () => [
                  (Math.random() - 0.5) * 8.5, // X bounds
                  Math.random() * 4.2 + 0.6,   // Y bounds (above desk)
                  (Math.random() - 0.5) * 6.5  // Z bounds
                ]).flat()
              ),
              3
            ]}
          />
        </bufferGeometry>
        <pointsMaterial 
          size={0.018} 
          color="#8b5cf6" // purple-green blending
          transparent 
          opacity={0.55} 
          blending={THREE.AdditiveBlending}
          sizeAttenuation
        />
      </points>
    </group>
  );
};

export default HackingDesk;

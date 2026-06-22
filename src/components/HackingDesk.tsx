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
      {/* Table Top (Sleek modern matte grey concrete/slate color) */}
      <mesh position={[0, 0.77, 0.2]} receiveShadow castShadow>
        <boxGeometry args={[5.2, 0.06, 2.2]} />
        <meshStandardMaterial 
          color="#525862" 
          roughness={0.35} 
          metalness={0.3} 
        />
      </mesh>
      
      {/* Left side support pillar (Industrial steel grey) */}
      <mesh position={[-2.4, 0.38, 0.2]} castShadow>
        <boxGeometry args={[0.08, 0.76, 2.0]} />
        <meshStandardMaterial color="#353b45" metalness={0.85} roughness={0.25} />
      </mesh>

      {/* Right side support pillar (Industrial steel grey) */}
      <mesh position={[2.4, 0.38, 0.2]} castShadow>
        <boxGeometry args={[0.08, 0.76, 2.0]} />
        <meshStandardMaterial color="#353b45" metalness={0.85} roughness={0.25} />
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
      {/* Mechanical Keyboard with keycaps & purple glow outline */}
      <group position={[0, 0.8, 0.5]}>
        {/* Keyboard Chassis */}
        <mesh position={[0, 0.01, 0]} castShadow>
          <boxGeometry args={[0.92, 0.028, 0.28]} />
          <meshStandardMaterial color="#0c0716" roughness={0.6} metalness={0.8} />
        </mesh>
        {/* Keyboard Underglow base */}
        <mesh position={[0, 0.002, 0]}>
          <boxGeometry args={[0.95, 0.008, 0.31]} />
          <meshBasicMaterial color="#b100e8" transparent opacity={0.6} />
        </mesh>

        {/* TKL Mechanical Keycaps Grid */}
        <group position={[0, 0.025, 0]}>
          {[-2, -1, 0, 1, 2].map((rowIdx) => {
            const z = rowIdx * 0.046; // 5 rows
            return [-7, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7].map((colIdx) => {
              const x = colIdx * 0.056; // 15 columns
              
              // 1. Spacebar (Row 2, Center cols -1, 0, 1)
              if (rowIdx === 2 && colIdx >= -2 && colIdx <= 2) {
                if (colIdx === 0) {
                  return (
                    <mesh key={`spacebar`} position={[0, 0.008, z]} castShadow>
                      <boxGeometry args={[0.26, 0.014, 0.038]} />
                      <meshStandardMaterial color="#39ff14" roughness={0.4} emissive="#39ff14" emissiveIntensity={0.2} />
                    </mesh>
                  );
                }
                return null; // Skip other cols covered by spacebar
              }

              // 2. Special keys (WASD)
              // W key: rowIdx = -1, colIdx = -4
              // A, S, D keys: rowIdx = 0, colIdx = -5, -4, -3
              const isWASD = (rowIdx === -1 && colIdx === -4) || (rowIdx === 0 && (colIdx === -5 || colIdx === -4 || colIdx === -3));

              // Esc key: rowIdx = -2, colIdx = -7
              const isEsc = rowIdx === -2 && colIdx === -7;

              // Enter key: rowIdx = 0, colIdx = 6
              const isEnter = rowIdx === 0 && colIdx === 6;

              let keyColor = "#272730";
              let keyEmissive = "#000000";
              if (isWASD) {
                keyColor = "#39ff14";
                keyEmissive = "#39ff14";
              } else if (isEsc) {
                keyColor = "#39ff14";
                keyEmissive = "#39ff14";
              } else if (isEnter) {
                keyColor = "#b100e8";
                keyEmissive = "#b100e8";
              } else if (colIdx === -7 || colIdx === 7 || rowIdx === -2) {
                // Modifiers and Fn row
                keyColor = "#1a122e";
              }

              return (
                <mesh key={`${rowIdx}-${colIdx}`} position={[x, 0.008, z]} castShadow>
                  <boxGeometry args={[0.046, 0.014, 0.036]} />
                  <meshStandardMaterial 
                    color={keyColor} 
                    roughness={0.4} 
                    emissive={keyEmissive}
                    emissiveIntensity={keyEmissive !== "#000000" ? 0.8 : 0}
                  />
                </mesh>
              );
            });
          })}
        </group>
      </group>

      {/* Gaming Mouse Group */}
      <group position={[0.7, 0.8, 0.55]} rotation={[0, -Math.PI / 12, 0]}>
        {/* Mouse Base Pad/Plate */}
        <mesh castShadow>
          <boxGeometry args={[0.076, 0.01, 0.134]} />
          <meshStandardMaterial color="#0c0715" roughness={0.7} />
        </mesh>
        
        {/* Contoured Palm Rest Body */}
        <mesh position={[0, 0.015, 0.02]} castShadow>
          <boxGeometry args={[0.07, 0.028, 0.08]} />
          <meshStandardMaterial color="#1f1435" roughness={0.3} metalness={0.2} />
        </mesh>

        {/* Left Clicker Button */}
        <mesh position={[-0.018, 0.012, -0.04]} castShadow>
          <boxGeometry args={[0.032, 0.02, 0.05]} />
          <meshStandardMaterial color="#111115" roughness={0.4} />
        </mesh>

        {/* Right Clicker Button */}
        <mesh position={[0.018, 0.012, -0.04]} castShadow>
          <boxGeometry args={[0.032, 0.02, 0.05]} />
          <meshStandardMaterial color="#111115" roughness={0.4} />
        </mesh>

        {/* Glowing Scroll Wheel */}
        <mesh position={[0, 0.018, -0.04]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.008, 0.008, 0.006, 12]} />
          <meshStandardMaterial color="#39ff14" emissive="#39ff14" emissiveIntensity={4} />
        </mesh>

        {/* Side Grip thumb buttons */}
        <mesh position={[-0.039, 0.01, 0.01]}>
          <boxGeometry args={[0.004, 0.008, 0.02]} />
          <meshStandardMaterial color="#39ff14" emissive="#39ff14" emissiveIntensity={2} />
        </mesh>

        {/* RGB Neon Seam Strip (Down the center split and back palm arch) */}
        <mesh position={[0, 0.02, 0.01]}>
          <boxGeometry args={[0.002, 0.022, 0.07]} />
          <meshStandardMaterial color="#b100e8" emissive="#b100e8" emissiveIntensity={3} />
        </mesh>
        <mesh position={[0, 0.01, 0.055]} rotation={[0.4, 0, 0]}>
          <boxGeometry args={[0.06, 0.012, 0.003]} />
          <meshStandardMaterial color="#b100e8" emissive="#b100e8" emissiveIntensity={4} />
        </mesh>
      </group>

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

          {/* Interactive virtual screen: Fits perfectly flush inside the 1.6x0.96 monitor glass */}
          <Html
            transform
            scale={[0.152, 0.152, 0.152]}
            position={[0, 0.9, -0.005]}
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

      {/* 5. SECURITY USB KEY (SKILLS & CERTS - RED/BLACK SANDISK STYLE) */}
      <InteractiveObject 
        onClick={() => onNavigate('usb')} 
        activeView={activeView}
        targetView="usb"
        glowColor="#ff3b30"
      >
        <group position={[-1.7, 0.8, 0.45]} rotation={[0, Math.PI / 6, 0]}>
          {/* Silver plug connector */}
          <mesh position={[0, 0.02, -0.11]}>
            <boxGeometry args={[0.06, 0.02, 0.06]} />
            <meshStandardMaterial color="#cccccc" metalness={0.95} roughness={0.15} />
          </mesh>
          {/* SanDisk main body - black matte plastic */}
          <mesh position={[0, 0.02, -0.02]} castShadow>
            <boxGeometry args={[0.08, 0.035, 0.14]} />
            <meshStandardMaterial color="#121212" roughness={0.65} metalness={0.15} />
          </mesh>
          {/* SanDisk red middle grip stripe */}
          <mesh position={[0, 0.02, -0.01]}>
            <boxGeometry args={[0.082, 0.038, 0.015]} />
            <meshStandardMaterial color="#e61c24" roughness={0.4} />
          </mesh>
          {/* SanDisk red loop/tail connector hook */}
          <mesh position={[0, 0.02, 0.07]} castShadow>
            <boxGeometry args={[0.08, 0.035, 0.08]} />
            <meshStandardMaterial color="#e61c24" roughness={0.4} />
          </mesh>
          {/* Pulsing indicator bulb (Red) */}
          <mesh position={[0, 0.04, 0.04]}>
            <sphereGeometry args={[0.012, 16, 16]} />
            <meshStandardMaterial color="#ff3b30" emissive="#ff3b30" emissiveIntensity={1.5} />
          </mesh>
          
          {/* Holographic glowing rings above the USB (Red) */}
          <mesh ref={usbHoloRef} position={[0, 0.15, 0]}>
            <torusGeometry args={[0.18, 0.008, 8, 24]} />
            <meshBasicMaterial 
              color="#e61c24" 
              wireframe
              transparent 
              opacity={0.75} 
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

      {/* 7. SMARTPHONE (CONTACT LINKS - IPHONE STYLE) */}
      <InteractiveObject 
        onClick={() => onNavigate('phone')} 
        activeView={activeView}
        targetView="phone"
        glowColor="#007aff"
      >
        <group position={[-0.75, 0.8, 0.72]} rotation={[0, Math.PI / 10, 0]}>
          {/* Titanium Silver iPhone Bezel */}
          <mesh position={[0, 0.01, 0]} castShadow>
            <boxGeometry args={[0.18, 0.02, 0.34]} />
            <meshStandardMaterial color="#d1d5db" metalness={0.9} roughness={0.15} />
          </mesh>
          {/* Glass display screen */}
          <mesh ref={phoneGlowRef} position={[0, 0.021, 0]}>
            <boxGeometry args={[0.17, 0.002, 0.33]} />
            <meshStandardMaterial 
              color="#0c0c0e" 
              emissive="#0055ff" 
              emissiveIntensity={0.3} 
              roughness={0.08} 
            />
          </mesh>
          {/* Dynamic Island pill notch */}
          <mesh position={[0, 0.0225, -0.11]}>
            <boxGeometry args={[0.045, 0.003, 0.014]} />
            <meshStandardMaterial color="#020202" roughness={0.9} />
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

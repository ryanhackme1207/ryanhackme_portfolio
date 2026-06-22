import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import type { ViewState } from '../types';
import HackingDesk from './HackingDesk';
import EnvironmentDetails from './EnvironmentDetails';
import CameraRig from './CameraRig';

interface LabSceneProps {
  activeView: ViewState;
  onNavigate: (view: ViewState) => void;
  lampOn: boolean;
  setLampOn: (on: boolean) => void;
}

export const LabScene: React.FC<LabSceneProps> = ({ 
  activeView, 
  onNavigate,
  lampOn,
  setLampOn
}) => {
  const [isTransitioning, setIsTransitioning] = useState(false);

  return (
    // When not in desk or monitor view, disable pointer events on the entire 3D canvas layer
    // so HTML overlays (USB/Folder/Phone panels) can receive clicks
    <div className={`w-full h-full bg-cyber-bg absolute inset-0 z-0 ${(activeView !== 'desk' && activeView !== 'monitor') ? 'pointer-events-none' : ''}`}>
      <Canvas
        shadows
        dpr={[1, 1.5]}
        gl={{ 
          antialias: true, 
          alpha: false,
          powerPreference: "high-performance" 
        }}
        camera={{ fov: 60, near: 0.1, far: 40 }}
        onPointerMissed={() => {
          // Only reset view when not in pointer-lock FPS mode, monitor view, or seat view
          if (activeView !== 'desk' && activeView !== 'monitor' && activeView !== 'chair' && !isTransitioning && !document.pointerLockElement) {
            onNavigate('desk');
          }
        }}
      >
        <color attach="background" args={["#050209"]} />
        <fog attach="fog" args={["#050209", 12, 35]} />
        
        {/* Hacking Desk Central setup */}
        <HackingDesk 
          activeView={activeView} 
          onNavigate={onNavigate} 
        />
        
        {/* Hacking Lab Environment details (Chair, Server racks, Lamp) */}
        <EnvironmentDetails 
          lampOn={lampOn} 
          setLampOn={setLampOn}
          activeView={activeView}
          onNavigate={onNavigate}
        />

        {/* Dynamic camera positioning logic */}
        <CameraRig 
          activeView={activeView} 
          onTransitionChange={setIsTransitioning}
        />
      </Canvas>
    </div>
  );
};

export default LabScene;

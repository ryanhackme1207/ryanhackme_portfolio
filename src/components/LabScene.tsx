import React, { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import type { ViewState } from '../types';
import HackingDesk from './HackingDesk';
import EnvironmentDetails from './EnvironmentDetails';
import CameraRig from './CameraRig';
import EntranceCorridor from './EntranceCorridor';

interface AdaptiveQualityControllerProps {
  highQuality: boolean;
  setHighQuality: (hq: boolean) => void;
  onShowPerfAlert: (msg: string) => void;
}

const AdaptiveQualityController: React.FC<AdaptiveQualityControllerProps> = ({
  highQuality,
  setHighQuality,
  onShowPerfAlert
}) => {
  const { gl } = useThree();
  const frameCount = useRef(0);
  const lastTime = useRef(performance.now());
  const fpsHistory = useRef<number[]>([]);
  const hasDowngraded = useRef(false);

  useFrame(() => {
    frameCount.current++;
    const now = performance.now();
    const elapsed = now - lastTime.current;

    // Check FPS every 1.5 seconds
    if (elapsed >= 1500) {
      const currentFps = (frameCount.current * 1000) / elapsed;
      frameCount.current = 0;
      lastTime.current = now;

      fpsHistory.current.push(currentFps);
      if (fpsHistory.current.length > 4) {
        fpsHistory.current.shift();
      }

      if (highQuality && !hasDowngraded.current && fpsHistory.current.length >= 3) {
        const averageFps = fpsHistory.current.reduce((a, b) => a + b, 0) / fpsHistory.current.length;
        if (averageFps < 28) {
          hasDowngraded.current = true;
          setHighQuality(false);
          gl.setPixelRatio(0.75);
          onShowPerfAlert("SYS-PROTECT: LOW FPS DETECTED. FORCING ADAPTIVE PERFORMANCE STAGE.");
        }
      }
    }
  });

  return null;
};

interface MatrixTunnelOverlayProps {
  progress: number;
  phase: 'none' | 'warp' | 'decrypt' | 'glitch' | 'fade_out';
}

const MatrixTunnelOverlay: React.FC<MatrixTunnelOverlayProps> = ({ progress, phase }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (phase !== 'decrypt' && phase !== 'glitch') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const columns = Math.floor(canvas.width / 20);
    const rainDrops = Array(columns).fill(1);
    const chars = "01010101ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    const draw = () => {
      ctx.fillStyle = 'rgba(5, 2, 9, 0.08)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < rainDrops.length; i++) {
        const text = chars.charAt(Math.floor(Math.random() * chars.length));
        const x = i * 20;
        const y = rainDrops[i] * 20;

        ctx.fillStyle = i % 3 === 0 ? '#b100e8' : '#39ff14';
        ctx.font = '15px monospace';
        ctx.fillText(text, x, y);

        if (y > canvas.height && Math.random() > 0.975) {
          rainDrops[i] = 0;
        }
        rainDrops[i]++;
      }
      animationId = requestAnimationFrame(draw);
    };

    draw();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, [phase]);

  const isGlitch = phase === 'glitch';
  const isFadeOut = phase === 'fade_out';
  const isWarp = phase === 'warp';

  if (phase === 'none') return null;

  return (
    <div className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-black font-mono transition-opacity duration-1000 ${
      isFadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
    }`}>
      {(phase === 'decrypt' || phase === 'glitch') && (
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-45" />
      )}

      <div className={`relative z-10 w-[90%] max-w-lg p-6 bg-black/95 border border-cyber-neonPurple/40 rounded-lg text-center shadow-[0_0_30px_rgba(177,0,232,0.25)] ${
        isGlitch ? 'animate-pulse border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.4)]' : ''
      }`}>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyber-neonPurple/5 to-transparent pointer-events-none animate-scanline" />

        {isWarp && (
          <div className="space-y-4 animate-pulse">
            <h2 className="text-sm font-bold text-cyber-neonGreen tracking-[4px] uppercase">
              ⚡ INITIATING QUANTUM LEAP ⚡
            </h2>
            <p className="text-[10px] text-cyber-text/60">BENDING SPACE-TIME METRIC FOR SECURE ENCRYPTED HOST CONNECTION...</p>
          </div>
        )}

        {(phase === 'decrypt' || phase === 'glitch') && (
          <div className="space-y-5">
            <h2 className={`text-sm font-bold tracking-[3px] uppercase ${isGlitch ? 'text-red-500 animate-pulse' : 'text-cyber-neonPurple'}`}>
              {isGlitch ? '⚡ COMPILING PHYSICAL FRAME ⚡' : '🛡️ DECRYPTING SECURITY PROTOCOLS 🛡️'}
            </h2>
            
            <div className="text-[9px] text-cyber-text/70 space-y-1 text-left bg-cyber-dark/60 p-3 rounded border border-cyber-neonPurple/10 h-28 overflow-hidden font-mono">
              <p className="text-cyber-neonGreen">&gt; CONNECTED TO HOST // RYAN_LAI_TING_HONG</p>
              {progress > 15 && <p className="text-cyber-neonPurple">&gt; DECOMPRESSING MEMORY BLOCKS... OK</p>}
              {progress > 40 && <p className="text-cyber-neonGreen">&gt; MOUNTING THREE.JS SHADER KERNEL... OK</p>}
              {progress > 65 && <p className="text-cyber-neonPurple">&gt; PARSING PORTFOLIO DOM OBJECTS... OK</p>}
              {progress > 85 && <p className="text-cyber-neonGreen">&gt; SHIELDING NODE NETWORK ROUTE... OK</p>}
              {progress >= 100 && <p className="text-red-500 animate-pulse">&gt; ESTABLISHING ANALYST INTERACTION FRAME... VERIFIED</p>}
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-[9px] text-cyber-text/50">
                <span>SYSTEM SYNC STATUS</span>
                <span className={isGlitch ? 'text-red-500 font-bold animate-pulse' : 'text-cyber-neonGreen font-bold'}>
                  {progress}%
                </span>
              </div>
              <div className="w-full h-2.5 bg-cyber-dark rounded-full overflow-hidden border border-cyber-neonPurple/20 p-0.5">
                <div 
                  className={`h-full rounded-full transition-all duration-100 ${
                    isGlitch ? 'bg-red-500 shadow-[0_0_10px_#ef4444]' : 'bg-cyber-neonGreen shadow-[0_0_10px_#39ff14]'
                  }`} 
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

interface LabSceneProps {
  activeView: ViewState;
  onNavigate: (view: ViewState) => void;
  lampOn: boolean;
  setLampOn: (on: boolean) => void;
  highQuality: boolean;
  setHighQuality: (hq: boolean) => void;
  onShowPerfAlert: (msg: string) => void;
  completedTutorialSteps: {
    monitor: boolean;
    usb: boolean;
    folder: boolean;
    phone: boolean;
    fridge: boolean;
    sofa: boolean;
    physics: boolean;
  };
  onFridgeOpen: () => void;
  onPhysicsInteract: () => void;
  entranceStage: 'black_world' | 'door_opening' | 'teleporting' | 'entered';
  setEntranceStage: (stage: 'black_world' | 'door_opening' | 'teleporting' | 'entered') => void;
}

export const LabScene: React.FC<LabSceneProps> = ({ 
  activeView, 
  onNavigate,
  lampOn,
  setLampOn,
  highQuality,
  setHighQuality,
  onShowPerfAlert,
  completedTutorialSteps,
  onFridgeOpen,
  onPhysicsInteract,
  entranceStage,
  setEntranceStage
}) => {
  const [isTransitioning, setIsTransitioning] = useState(false);

  const [matrixPhase, setMatrixPhase] = useState<'none' | 'warp' | 'decrypt' | 'glitch' | 'fade_out'>('none');
  const [decryptProgress, setDecryptProgress] = useState(0);

  // Watch entranceStage to trigger matrix transition
  useEffect(() => {
    if (entranceStage !== 'teleporting') return;

    setMatrixPhase('warp');
    setDecryptProgress(0);

    let warpTimeout: any;
    let decryptInterval: any;
    let glitchTimeout: any;
    let fadeTimeout: any;

    warpTimeout = setTimeout(() => {
      setMatrixPhase('decrypt');

      let currentProgress = 0;
      decryptInterval = setInterval(() => {
        currentProgress += Math.floor(Math.random() * 8) + 8;
        if (currentProgress >= 100) {
          currentProgress = 100;
          setDecryptProgress(100);
          clearInterval(decryptInterval);

          setMatrixPhase('glitch');
          glitchTimeout = setTimeout(() => {
            setEntranceStage('entered');
            setMatrixPhase('fade_out');

            fadeTimeout = setTimeout(() => {
              setMatrixPhase('none');
              sessionStorage.setItem('ryansec_entered', 'true');
            }, 1000);
          }, 600);
        } else {
          setDecryptProgress(currentProgress);
        }
      }, 70);
    }, 1500);

    return () => {
      clearTimeout(warpTimeout);
      if (decryptInterval) clearInterval(decryptInterval);
      clearTimeout(glitchTimeout);
      clearTimeout(fadeTimeout);
    };
  }, [entranceStage]);

  return (
    // When not in desk or monitor view, disable pointer events on the entire 3D canvas layer
    // so HTML overlays (USB/Folder/Phone panels) can receive clicks
    <div className={`w-full h-full bg-cyber-bg absolute inset-0 z-0 ${(activeView !== 'desk' && activeView !== 'monitor') ? 'pointer-events-none' : ''}`}>
      <Canvas
        shadows={highQuality}
        dpr={highQuality ? [1, 1.5] : 1}
        gl={{ 
          antialias: highQuality, 
          alpha: false,
          powerPreference: "high-performance",
          precision: highQuality ? "highp" : "mediump"
        }}
        camera={{ fov: 60, near: 0.1, far: 40 }}
        onPointerMissed={() => {
          // Only reset view when not in pointer-lock FPS mode, monitor view, or seat view
          if (activeView !== 'desk' && activeView !== 'monitor' && activeView !== 'chair' && !isTransitioning && !document.pointerLockElement) {
            onNavigate('desk');
          }
        }}
      >
        <AdaptiveQualityController 
          highQuality={highQuality} 
          setHighQuality={setHighQuality} 
          onShowPerfAlert={onShowPerfAlert} 
        />
        <color attach="background" args={["#050209"]} />
        <fog attach="fog" args={["#050209", 12, 35]} />
        
        {entranceStage === 'entered' ? (
          <>
            {/* Hacking Desk Central setup */}
            <HackingDesk 
              activeView={activeView} 
              onNavigate={onNavigate} 
              completedTutorialSteps={completedTutorialSteps}
            />
            
            {/* Hacking Lab Environment details (Chair, Server racks, Lamp) */}
            <EnvironmentDetails 
              lampOn={lampOn} 
              setLampOn={setLampOn}
              activeView={activeView}
              onNavigate={onNavigate}
              completedTutorialSteps={completedTutorialSteps}
              onFridgeOpen={onFridgeOpen}
              onPhysicsInteract={onPhysicsInteract}
            />
          </>
        ) : (
          <EntranceCorridor 
            entranceStage={entranceStage}
            setEntranceStage={setEntranceStage}
          />
        )}

        {/* Dynamic camera positioning logic */}
        <CameraRig 
          activeView={activeView} 
          onTransitionChange={setIsTransitioning}
          entranceStage={entranceStage}
        />
      </Canvas>

      {/* Dynamic Cyber Matrix Teleportation Overlay */}
      <MatrixTunnelOverlay progress={decryptProgress} phase={matrixPhase} />
    </div>
  );
};

export default LabScene;

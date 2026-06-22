import React, { useEffect, useState } from 'react';
import { Shield, Monitor, HardDrive, AlertTriangle } from 'lucide-react';

interface GatewayScreenProps {
  onSelect3D: () => void;
  onSelectNormal: () => void;
  isMobile: boolean;
}

export const GatewayScreen: React.FC<GatewayScreenProps> = ({
  onSelect3D,
  onSelectNormal,
  isMobile
}) => {
  const [bootLogs, setBootLogs] = useState<string[]>([]);

  // Simulation of secure handshakes and checks on load
  useEffect(() => {
    const logs = [
      "INITIALIZING GATEWAY BOOT MATRIX...",
      "SECURITY PROFILE DETECTED: LAI TING HONG",
      isMobile 
        ? "HARDWARE PROBE: MOBILE CHIPSET DETECTED -> DISABLING 3D CANVAS FOR STABILITY" 
        : "HARDWARE PROBE: DESKTOP GRAPHICS ENGAGED -> 3D MODE AVAILABLE",
      "INTEGRITY CHECK: CCNA PORTFOLIO PATHS - PASSED",
      "ESTABLISHING SECURE HANDSHAKE... ACTIVE"
    ];

    let currentLogIndex = 0;
    const interval = setInterval(() => {
      if (currentLogIndex < logs.length) {
        setBootLogs((prev) => [...prev, logs[currentLogIndex]]);
        currentLogIndex++;
      } else {
        clearInterval(interval);
      }
    }, 600);

    return () => clearInterval(interval);
  }, [isMobile]);

  return (
    <div className="w-full h-full min-h-screen relative bg-cyber-bg overflow-hidden flex items-center justify-center font-sans select-none text-cyber-text p-4">
      {/* Background Neon Glow Orbs */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-cyber-neonPurple/10 filter blur-[80px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-cyber-neonGreen/10 filter blur-[90px] animate-pulse" />

      {/* Cyber Grid Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.06]"
        style={{
          backgroundImage: `linear-gradient(#39ff14 1px, transparent 1px), linear-gradient(90deg, #39ff14 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }}
      />

      {/* Core Terminal Card */}
      <div className="cyber-panel-purple max-w-xl w-full p-6 md:p-8 bg-cyber-dark/95 border-cyber-neonPurple/40 shadow-glow-purple flex flex-col gap-6 relative z-10">
        
        {/* Brand Header */}
        <div className="flex items-center gap-3.5 border-b border-cyber-neonPurple/25 pb-4">
          <div className="w-12 h-12 rounded bg-cyber-neonPurple/10 border border-cyber-neonPurple/40 flex items-center justify-center text-cyber-neonPurple animate-pulse shadow-glow-purple">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-base md:text-lg font-bold tracking-widest font-mono text-gradient uppercase">
              LTN_SEC_HOST://ACCESS_GATEWAY
            </h1>
            <p className="text-[10px] md:text-xs text-cyber-text/60 font-mono mt-0.5">
              LAI TING HONG · CYBERSECURITY & NETWORK ENGINEER
            </p>
          </div>
        </div>

        {/* Live Diagnostics Log Panel */}
        <div className="cyber-panel-green bg-black/90 border-cyber-neonGreen/25 p-4 font-mono text-[10px] md:text-xs text-cyber-neonGreen space-y-1.5 min-h-[140px] max-h-[160px] overflow-y-auto custom-scrollbar">
          {bootLogs.map((log, index) => (
            <div key={index} className="flex gap-2">
              <span className="text-cyber-neonPurple/80 font-bold">&gt;</span>
              <span className="leading-tight uppercase">{log}</span>
            </div>
          ))}
          {bootLogs.length < 5 && (
            <div className="flex items-center gap-1.5 animate-pulse text-cyber-neonGreen/45">
              <span className="w-1 h-3.5 bg-cyber-neonGreen/60 animate-blink"></span>
              ANALYZING ENVIRONMENT...
            </div>
          )}
        </div>

        {/* Choice Interface */}
        <div className="flex flex-col sm:flex-row gap-4 mt-2">
          
          {/* OPTION 1: 3D Lab (Locked on mobile) */}
          <div className="flex-1 flex flex-col justify-between p-4 bg-cyber-dark border border-cyber-neonPurple/20 hover:border-cyber-neonPurple/55 rounded-md transition-all flex-col gap-3">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-xs font-bold font-mono text-cyber-heading">
                  <Monitor className="w-4 h-4 text-cyber-neonPurple" />
                  01 // 3D INTERFACE
                </span>
                {isMobile && (
                  <span className="px-1.5 py-0.5 bg-red-500/10 border border-red-500/20 text-red-500 rounded text-[8px] font-mono font-bold flex items-center gap-1 uppercase">
                    <AlertTriangle className="w-2.5 h-2.5" /> Locked
                  </span>
                )}
              </div>
              <p className="text-[10px] md:text-xs text-cyber-text/60 font-mono leading-relaxed">
                First-person cyber analyst desk. WASD walking controls. Requires desktop GPU.
              </p>
            </div>
            
            <button
              onClick={onSelect3D}
              disabled={isMobile}
              className={`w-full py-2.5 px-4 font-mono text-xs font-bold uppercase rounded border transition-all cursor-pointer ${
                isMobile 
                  ? 'bg-red-500/5 border-red-500/15 text-red-500/50 cursor-not-allowed opacity-50' 
                  : 'bg-cyber-neonPurple/10 border-cyber-neonPurple/40 text-cyber-neonPurple hover:bg-cyber-neonPurple/20 hover:shadow-glow-purple'
              }`}
            >
              {isMobile ? '3D Mode Locked' : 'Launch 3D Lab'}
            </button>
          </div>

          {/* OPTION 2: Classic 2D Portfolio */}
          <div className="flex-1 flex flex-col justify-between p-4 bg-cyber-dark border border-cyber-neonGreen/20 hover:border-cyber-neonGreen/55 rounded-md transition-all flex-col gap-3">
            <div className="space-y-1.5">
              <span className="flex items-center gap-1.5 text-xs font-bold font-mono text-cyber-heading">
                <HardDrive className="w-4 h-4 text-cyber-neonGreen" />
                02 // CLASSIC 2D VIEW
              </span>
              <p className="text-[10px] md:text-xs text-cyber-text/60 font-mono leading-relaxed">
                Lightweight, high-performance static website. Optimized for mobile, touch screens, and all devices.
              </p>
            </div>
            
            <button
              onClick={onSelectNormal}
              className="w-full py-2.5 px-4 bg-cyber-neonGreen/10 border-cyber-neonGreen/40 text-cyber-neonGreen hover:bg-cyber-neonGreen/20 hover:shadow-glow-green font-mono text-xs font-bold uppercase rounded transition-all cursor-pointer"
            >
              Launch Classic 2D
            </button>
          </div>

        </div>

        {/* Footer */}
        <p className="text-[9px] text-cyber-text/45 font-mono text-center mt-2 border-t border-cyber-neonPurple/10 pt-3">
          SECURITY PROTOCOL ENFORCED BY LAI TING HONG // MELAKA MMU 2026
        </p>

      </div>
    </div>
  );
};

export default GatewayScreen;

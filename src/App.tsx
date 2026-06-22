import { useState, useEffect } from 'react';
import type { ViewState } from './types';
import LabScene from './components/LabScene';
import GatewayScreen from './components/GatewayScreen';
import { USBOverlay, FolderOverlay, PhoneOverlay } from './components/OverlayUIs';
import { Shield, Eye, Network, RefreshCw, Volume2, VolumeX, HelpCircle, CornerDownLeft, Zap, Sparkles } from 'lucide-react';

function App() {
  const [entryMode, setEntryMode] = useState<'gateway' | '3d'>('gateway');
  const [activeView, setActiveView] = useState<ViewState>('desk');
  const [muteSound, setMuteSound] = useState(true);
  const [lampOn, setLampOn] = useState(true);
  const [highQuality, setHighQuality] = useState(false); // Default to false (Performance Mode) for smooth rendering in Chrome
  const [isMobile, setIsMobile] = useState(false);
  const [systemAlert, setSystemAlert] = useState('SYS-LOG INGEST: 8 SUSPICIOUS THREATS IN PAST 24H');
  const [logs, setLogs] = useState<string[]>([
    "SECURE SHELL ESTABLISHED TO 192.168.1.107",
    "DECRYPTING PORTFOLIO DATA STREAMS...",
    "WARNING: UNFILTERED PACKETS DETECTED ON PUBLIC ROUTE",
    "ENFORCING IPS RULE-MATRIX 4049"
  ]);

  const [isPointerLocked, setIsPointerLocked] = useState(false);

  // Monitor pointer lock custom events
  useEffect(() => {
    const handleLockChange = (e: Event) => {
      const customEvent = e as CustomEvent<boolean>;
      setIsPointerLocked(customEvent.detail);
    };
    window.addEventListener('pointerlockchange-custom', handleLockChange as EventListener);
    
    const handleStandardLockChange = () => {
      setIsPointerLocked(document.pointerLockElement !== null);
    };
    document.addEventListener('pointerlockchange', handleStandardLockChange);

    return () => {
      window.removeEventListener('pointerlockchange-custom', handleLockChange as EventListener);
      document.removeEventListener('pointerlockchange', handleStandardLockChange);
    };
  }, []);

  // Mobile device detection
  useEffect(() => {
    const checkMobile = () => {
      const mobileWidth = window.innerWidth < 768;
      const mobileAgent = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      setIsMobile(mobileWidth || mobileAgent);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Escape key handler to reset view in 3D mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveView('desk');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // System alert loop
  useEffect(() => {
    const alerts = [
      "SYS-LOG INGEST: 8 SUSPICIOUS THREATS IN PAST 24H",
      "VLAN PORT SECURITY VERIFIED - LAI TING HONG",
      "CCNA PROTOCOLS COMPLIANT: OSPF ENFORCED",
      "MMU NETSEC BACKBONE CONFIGURED",
      "WEVO ALIGNMENT PARITY: SECURE",
      "HASH ROTATION ACTIVE: SHA-256 INTEGRITY OK"
    ];
    
    const interval = setInterval(() => {
      const randomAlert = alerts[Math.floor(Math.random() * alerts.length)];
      setSystemAlert(randomAlert);

      const systemLogs = [
        `AUDIT: Host verification requested by MMU-SEC-DHCP`,
        `VPN: Recipient handshake refreshed: public key accepted`,
        `STATUS: Hash throughput optimization simulation running`,
        `NET: Port 443 active. SSL/TLS negotiation successful`,
        `WEVO: Career profile parsed successfully. Fit factor optimal.`
      ];
      const randomLog = systemLogs[Math.floor(Math.random() * systemLogs.length)];
      setLogs(prev => [randomLog, ...prev.slice(0, 3)]);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  const handleNavigate = (view: ViewState) => {
    setActiveView(view);
  };

  const launch3D = () => {
    if (!isMobile) {
      setEntryMode('3d');
    }
  };

  const launchNormal = () => {
    // Redirect window to the classic static HTML website folder served from Vite public
    window.location.href = '/normal-mode/index.html';
  };

  // 1. If we are on the gateway choice screen, render it
  if (entryMode === 'gateway') {
    return (
      <GatewayScreen 
        onSelect3D={launch3D} 
        onSelectNormal={launchNormal} 
        isMobile={isMobile} 
      />
    );
  }

  // 2. Otherwise render the immersive 3D scene (desktop only)
  return (
    <div className="w-full h-full relative bg-cyber-bg overflow-hidden flex flex-col font-sans select-none">
      
      {/* 1. Main 3D Canvas Scene */}
      <LabScene 
        activeView={activeView} 
        onNavigate={handleNavigate} 
        lampOn={lampOn}
        setLampOn={setLampOn}
        highQuality={highQuality}
      />

      {/* 2. Top-Level Cybersecurity HUD (Header) */}
      <div className="absolute top-0 left-0 w-full p-4 pointer-events-none flex justify-between items-start z-10">
        
        {/* Title Brand Panel */}
        <div className="cyber-panel-purple p-3 bg-cyber-dark/85 backdrop-blur-md pointer-events-auto border-cyber-neonPurple/30 flex items-center gap-3 animate-fade-in">
          <div className="w-9 h-9 rounded bg-cyber-neonPurple/10 border border-cyber-neonPurple/35 flex items-center justify-center text-cyber-neonPurple">
            <Shield className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-widest text-cyber-heading font-mono text-gradient">
              LTN_SEC_HOST://LAI_TING_HONG
            </h1>
            <p className="text-[10px] text-cyber-text/60 font-mono flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 bg-cyber-neonGreen rounded-full animate-ping"></span>
              MMU MELAKA // NETWORK SECURITY ANALYST
            </p>
          </div>
        </div>

        {/* Central Live Ticker Status */}
        <div className="hidden md:flex cyber-panel-purple px-4 py-3 bg-cyber-dark/85 backdrop-blur-md pointer-events-auto border-cyber-neonPurple/20 items-center gap-2 font-mono text-[10px] tracking-wider text-cyber-neonPurple">
          <span className="text-cyber-text/50">SYS_ALERT:</span>
          <span className="font-bold uppercase animate-pulse text-gradient">{systemAlert}</span>
        </div>

        {/* Control Center (Sound, Quality, Reset, Return to Gateway) */}
        <div className="cyber-panel-purple p-2 bg-cyber-dark/85 backdrop-blur-md pointer-events-auto border-cyber-neonPurple/30 flex items-center gap-1.5">
          {/* Sound Toggle */}
          <button 
            onClick={() => setMuteSound(!muteSound)}
            className="p-1.5 hover:bg-cyber-neonPurple/15 rounded text-cyber-text hover:text-cyber-neonPurple transition-colors cursor-pointer"
            title={muteSound ? "Unmute Ambient Sound" : "Mute Sound"}
          >
            {muteSound ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-cyber-neonGreen animate-pulse" />}
          </button>
          
          <div className="w-[1px] h-4 bg-cyber-neonPurple/20" />

          {/* Quality Toggle */}
          <button 
            onClick={() => setHighQuality(!highQuality)}
            className="p-1.5 hover:bg-cyber-neonPurple/15 rounded text-cyber-text hover:text-cyber-neonPurple transition-colors cursor-pointer flex items-center gap-1"
            title={highQuality ? "Switch to Performance Mode (Smoother)" : "Switch to High Quality Mode (Shadows)"}
          >
            {highQuality ? (
              <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
            ) : (
              <Zap className="w-4 h-4 text-cyber-neonGreen" />
            )}
            <span className="text-[9px] font-mono font-semibold hidden sm:inline">
              {highQuality ? "HIGH-Q" : "PERF-MODE"}
            </span>
          </button>
          
          <div className="w-[1px] h-4 bg-cyber-neonPurple/20" />
          
          {/* Global Reset View */}
          <button 
            onClick={() => handleNavigate('desk')}
            disabled={activeView === 'desk'}
            className="p-1.5 hover:bg-cyber-neonPurple/15 disabled:opacity-40 disabled:hover:bg-transparent rounded text-cyber-text hover:text-cyber-neonPurple transition-colors cursor-pointer"
            title="Reset Camera Position"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <div className="w-[1px] h-4 bg-cyber-neonPurple/20" />

          {/* Go Back to Access Gateway */}
          <button
            onClick={() => setEntryMode('gateway')}
            className="px-2 py-1 bg-cyber-neonPurple/10 border border-cyber-neonPurple/30 text-cyber-neonPurple font-mono text-[10px] uppercase rounded hover:bg-cyber-neonPurple/25 transition-all cursor-pointer"
            title="Return to Access Gateway"
          >
            Exit 3D
          </button>
        </div>

      </div>

      {/* 3. Floating HUD Sidebar (Diagnostic stats & node index) */}
      {activeView === 'desk' && (
        <div className="absolute right-4 top-24 w-64 pointer-events-none z-10 flex flex-col gap-4">
          
          {/* Node Directory Analyzer */}
          <div className="cyber-panel-purple p-3.5 bg-cyber-dark/80 backdrop-blur-md border-cyber-neonPurple/20 pointer-events-auto space-y-3 animate-fade-in">
            <h3 className="text-xs font-bold tracking-wider font-mono text-cyber-heading border-b border-cyber-neonPurple/20 pb-1.5 uppercase flex items-center justify-between">
              <span className="text-gradient">Nodes Diagnostic</span>
              <Eye className="w-3.5 h-3.5 text-cyber-neonPurple" />
            </h3>
            
            <div className="space-y-2 font-mono text-[10px]">
              <div 
                onClick={() => handleNavigate('monitor')}
                className="flex items-center justify-between p-1.5 bg-cyber-neonPurple/5 hover:bg-cyber-neonPurple/15 border border-cyber-neonPurple/10 rounded cursor-pointer transition-colors"
              >
                <span className="text-cyber-text/80">01. Virtual PC</span>
                <span className="text-gradient font-bold">READY</span>
              </div>
              <div 
                onClick={() => handleNavigate('usb')}
                className="flex items-center justify-between p-1.5 bg-cyber-neonGreen/5 hover:bg-cyber-neonGreen/15 border border-cyber-neonGreen/10 rounded cursor-pointer transition-colors"
              >
                <span className="text-cyber-text/80">02. Security USB</span>
                <span className="text-cyber-neonGreen font-bold">DETECTED</span>
              </div>
              <div 
                onClick={() => handleNavigate('folder')}
                className="flex items-center justify-between p-1.5 bg-cyber-neonPurple/5 hover:bg-cyber-neonPurple/15 border border-cyber-neonPurple/10 rounded cursor-pointer transition-colors"
              >
                <span className="text-cyber-text/80">03. Manila Dossier</span>
                <span className="text-gradient font-bold">LOGGED</span>
              </div>
              <div 
                onClick={() => handleNavigate('phone')}
                className="flex items-center justify-between p-1.5 bg-cyber-neonGreen/5 hover:bg-cyber-neonGreen/15 border border-cyber-neonGreen/10 rounded cursor-pointer transition-colors"
              >
                <span className="text-cyber-text/80">04. Smartphone</span>
                <span className="text-gradient font-bold">SECURE</span>
              </div>
            </div>
          </div>

          {/* Micro Terminal Log Stream */}
          <div className="cyber-panel-purple p-3.5 bg-cyber-dark/80 backdrop-blur-md border-cyber-neonPurple/20 pointer-events-auto space-y-2 animate-fade-in">
            <h3 className="text-xs font-bold tracking-wider font-mono text-cyber-heading uppercase border-b border-cyber-neonPurple/20 pb-1 flex justify-between items-center">
              <span className="text-gradient">Security Feed</span>
              <Network className="w-3.5 h-3.5 text-cyber-neonGreen" />
            </h3>
            <div className="font-mono text-[9px] text-cyber-text/75 space-y-1.5 max-h-24 overflow-y-auto custom-scrollbar">
              {logs.map((log, idx) => (
                <div key={idx} className="leading-tight border-b border-cyber-neonPurple/5 pb-0.5 last:border-b-0">
                  {log.includes('WARNING') ? <span className="text-cyber-neonGreen">{log}</span> : log}
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* 4. Bottom Navigation Prompt & Helper HUD */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 p-3 bg-cyber-dark/85 border border-cyber-neonPurple/25 rounded-md shadow-glow-purple text-xs font-mono text-cyber-neonPurple pointer-events-auto z-10 flex items-center gap-3 animate-fade-in max-w-[90vw] text-center justify-center">
        <HelpCircle className="w-4 h-4 text-cyber-neonPurple animate-pulse flex-shrink-0" />
        
        {activeView === 'desk' && (
          <span className="leading-tight text-cyber-neonPurple/90">
            {isPointerLocked ? (
              <span>[Move mouse to look around. Walk with <strong className="text-cyber-neonGreen">WASD/Arrows</strong>. Aim & click on objects to inspect. Press <strong className="text-cyber-neonGreen">ESC</strong> to release mouse.]</span>
            ) : (
              <span>[Click on the desk to lock mouse and look around. Select <strong className="text-cyber-neonGreen">Monitor</strong>, <strong className="text-cyber-neonGreen">USB Key</strong>, <strong className="text-cyber-neonGreen">Dossier</strong>, or <strong className="text-cyber-neonGreen">Phone</strong> to zoom in.]</span>
            )}
          </span>
        )}

        {activeView !== 'desk' && (
          <button 
            onClick={() => handleNavigate('desk')}
            className="flex items-center gap-1.5 font-bold uppercase text-cyber-neonGreen hover:text-cyber-heading transition-colors cursor-pointer text-[11px]"
          >
            <CornerDownLeft className="w-4 h-4 text-cyber-neonGreen" /> Click here or Press [ESC] to return to Analyst Desk
          </button>
        )}
      </div>

      {/* 5. Floating Inspect View Modals / Overlays */}
      {activeView === 'usb' && (
        <USBOverlay onClose={() => handleNavigate('desk')} />
      )}
      
      {activeView === 'folder' && (
        <FolderOverlay onClose={() => handleNavigate('desk')} />
      )}

      {activeView === 'phone' && (
        <PhoneOverlay onClose={() => handleNavigate('desk')} />
      )}

      {/* 6. Center Crosshair (for Pointer Lock target aiming) */}
      {activeView === 'desk' && isPointerLocked && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
          <div className="relative w-6 h-6 flex items-center justify-center">
            {/* Outer animated pulse rings */}
            <div className="absolute w-6 h-6 border border-cyber-neonGreen/20 rounded-full animate-ping" />
            <div className="absolute w-4.5 h-4.5 border border-cyber-neonPurple/40 rounded-full" />
            {/* Horizontal & vertical hash lines */}
            <div className="absolute w-2 h-[1px] bg-cyber-neonGreen/50 left-[-4px]" />
            <div className="absolute w-2 h-[1px] bg-cyber-neonGreen/50 right-[-4px]" />
            <div className="absolute h-2 w-[1px] bg-cyber-neonGreen/50 top-[-4px]" />
            <div className="absolute h-2 w-[1px] bg-cyber-neonGreen/50 bottom-[-4px]" />
            {/* Center target dot */}
            <div className="w-1.5 h-1.5 bg-cyber-neonGreen rounded-full shadow-[0_0_8px_#39ff14]" />
          </div>
        </div>
      )}

      {/* Ambient background soundtrack simulated state */}
      {!muteSound && (
        <iframe 
          className="hidden" 
          src="https://www.youtube.com/embed/5Wq1GyP9e-c?autoplay=1&loop=1&mute=0" 
          title="Ambient Sound Stream" 
          allow="autoplay"
        />
      )}

    </div>
  );
}

export default App;

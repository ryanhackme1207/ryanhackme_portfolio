import { useState, useEffect } from 'react';
import type { ViewState } from './types';
import LabScene from './components/LabScene';
import GatewayScreen from './components/GatewayScreen';
import { USBOverlay, FolderOverlay, PhoneOverlay } from './components/OverlayUIs';
import { Shield, Eye, Network, RefreshCw, Volume2, VolumeX, HelpCircle, CornerDownLeft, Zap, Sparkles } from 'lucide-react';

const checkWebGLSupport = () => {
  try {
    const canvas = document.createElement('canvas');
    const gl = (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')) as WebGLRenderingContext | null;
    if (!gl) return { supported: false, accelerated: false };
    
    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    if (debugInfo) {
      const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || '';
      const isSoftware = /swiftshader|llvmpipe|software rasterizer|microsoft basic render/i.test(renderer);
      return { supported: true, accelerated: !isSoftware, renderer };
    }
    return { supported: true, accelerated: true, renderer: 'Unknown' };
  } catch (e) {
    return { supported: false, accelerated: false };
  }
};

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
  const [entranceStage, setEntranceStage] = useState<'black_world' | 'door_opening' | 'teleporting' | 'entered'>(() => {
    return sessionStorage.getItem('ryansec_entered') === 'true' ? 'entered' : 'black_world';
  });

  const [completedTutorialSteps, setCompletedTutorialSteps] = useState<{
    monitor: boolean;
    usb: boolean;
    folder: boolean;
    phone: boolean;
    fridge: boolean;
    sofa: boolean;
    physics: boolean;
  }>(() => {
    const saved = localStorage.getItem('ryansec_tutorial');
    if (saved) return JSON.parse(saved);
    return {
      monitor: false,
      usb: false,
      folder: false,
      phone: false,
      fridge: false,
      sofa: false,
      physics: false
    };
  });

  const updateTutorialStep = (step: keyof typeof completedTutorialSteps) => {
    setCompletedTutorialSteps((prev) => {
      const next = { ...prev, [step]: true };
      localStorage.setItem('ryansec_tutorial', JSON.stringify(next));
      return next;
    });

    const messages: Record<string, string> = {
      monitor: "TUTORIAL: Monitor connection verified.",
      usb: "TUTORIAL: Security USB key signature verified.",
      folder: "TUTORIAL: Analyst Dossier parsed successfully.",
      phone: "TUTORIAL: Mobile SSL channel established.",
      fridge: "TUTORIAL: Hydration reservoir unlocked.",
      sofa: "TUTORIAL: Ergonomic posture recalibrated.",
      physics: "TUTORIAL: Environmental kinematics validated."
    };

    setLogs((prev) => [
      `[TUTORIAL] ✅ ${messages[step] || step}`,
      ...prev.slice(0, 4)
    ]);
  };

  const resetTutorial = () => {
    const reset = {
      monitor: false,
      usb: false,
      folder: false,
      phone: false,
      fridge: false,
      sofa: false,
      physics: false
    };
    setCompletedTutorialSteps(reset);
    localStorage.setItem('ryansec_tutorial', JSON.stringify(reset));
    
    setLogs((prev) => [
      `[TUTORIAL] 🔄 Training sequence reset requested.`,
      ...prev.slice(0, 4)
    ]);
  };

  useEffect(() => {
    if (activeView === 'monitor' && !completedTutorialSteps.monitor) {
      updateTutorialStep('monitor');
    } else if (activeView === 'usb' && !completedTutorialSteps.usb) {
      updateTutorialStep('usb');
    } else if (activeView === 'folder' && !completedTutorialSteps.folder) {
      updateTutorialStep('folder');
    } else if (activeView === 'phone' && !completedTutorialSteps.phone) {
      updateTutorialStep('phone');
    } else if (activeView === 'sofa' && !completedTutorialSteps.sofa) {
      updateTutorialStep('sofa');
    }
  }, [activeView]);

  const [hwAccelerationAlert, setHwAccelerationAlert] = useState<string | null>(null);

  useEffect(() => {
    const status = checkWebGLSupport();
    if (!status.supported) {
      setHwAccelerationAlert("WebGL is not supported by your browser or card. 3D mode is disabled.");
    } else if (!status.accelerated) {
      setHwAccelerationAlert("Hardware Acceleration is disabled! The 3D scene is running on CPU software emulation. Please toggle 'Use graphics acceleration when available' in Chrome settings for smooth performance.");
    }
  }, []);

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

  // Lock page scrolling to prevent browser from auto-scrolling when 3D HTML elements are focused
  useEffect(() => {
    const handleScroll = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target && target.scrollTop !== undefined) {
        // Reset scroll only if the target is HTML, Body, #root, or the WebGL canvas container
        if (
          target === document.documentElement ||
          target === document.body ||
          target.id === 'root' ||
          target.tagName === 'CANVAS' ||
          target.classList.contains('webgl')
        ) {
          if (target.scrollTop !== 0) target.scrollTop = 0;
          if (target.scrollLeft !== 0) target.scrollLeft = 0;
        }
      }
      // Also lock window scrolling
      if (window.scrollY !== 0 || window.scrollX !== 0) {
        window.scrollTo(0, 0);
      }
    };
    // Use capture phase (true) to catch scroll events on any nested elements (like #root)
    window.addEventListener('scroll', handleScroll, true);
    return () => {
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, []);

  // System alert loop
  useEffect(() => {
    const alerts = [
      "SYS-LOG INGEST: 8 SUSPICIOUS THREATS IN PAST 24H",
      "VLAN PORT SECURITY VERIFIED - RYAN LAI TING HONG",
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
      sessionStorage.removeItem('ryansec_entered');
      setEntranceStage('black_world');
      setEntryMode('3d');
    }
  };

  const launchNormal = () => {
    // Redirect window to the classic static HTML website folder served from Vite public
    window.location.href = '/normal-mode/index.html';
  };

  const triggerSystemAlert = (msg: string) => {
    setSystemAlert(msg);
    setLogs((prev) => [
      `[${new Date().toLocaleTimeString()}] ${msg}`,
      ...prev.slice(0, 4)
    ]);
  };

  // 1. If we are on the gateway choice screen, render it
  if (entryMode === 'gateway') {
    return (
      <div className="w-full h-full relative">
        <GatewayScreen 
          onSelect3D={launch3D} 
          onSelectNormal={launchNormal} 
          isMobile={isMobile} 
        />
        {hwAccelerationAlert && (
          <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-50 w-[90%] max-w-xl">
            <div className="cyber-panel-purple p-3 bg-red-950/85 backdrop-blur-md border-red-500/40 text-red-200 font-mono text-xs flex items-start gap-3 shadow-[0_0_15px_rgba(239,68,68,0.3)] pointer-events-auto">
              <span className="p-1 bg-red-500/20 rounded text-red-400 font-bold animate-pulse">⚠️ WARNING</span>
              <div className="flex-1">
                <p className="font-bold uppercase tracking-wider text-red-400 text-[10px]">Hardware Acceleration Disabled</p>
                <p className="mt-1 text-[9px] text-red-300/80 leading-normal">{hwAccelerationAlert}</p>
              </div>
              <button 
                onClick={() => setHwAccelerationAlert(null)}
                className="text-red-400 hover:text-white font-bold ml-2 cursor-pointer"
              >
                [X]
              </button>
            </div>
          </div>
        )}
      </div>
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
        setHighQuality={setHighQuality}
        onShowPerfAlert={triggerSystemAlert}
        completedTutorialSteps={completedTutorialSteps}
        onFridgeOpen={() => updateTutorialStep('fridge')}
        onPhysicsInteract={() => updateTutorialStep('physics')}
        entranceStage={entranceStage}
        setEntranceStage={setEntranceStage}
      />

      {/* 2. Top-Level Cybersecurity HUD (Header) */}
      {entranceStage === 'entered' && (
        <div className="absolute top-0 left-0 w-full p-4 pointer-events-none flex justify-between items-start z-10">
          
          {/* Title Brand Panel */}
          <div className="cyber-panel-purple p-3 bg-cyber-dark/85 backdrop-blur-md pointer-events-auto border-cyber-neonPurple/30 flex items-center gap-3 animate-fade-in">
            <div className="w-9 h-9 rounded bg-cyber-neonPurple/10 border border-cyber-neonPurple/35 flex items-center justify-center text-cyber-neonPurple">
              <Shield className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-widest text-cyber-heading font-mono text-gradient">
                LTN_SEC_HOST://RYAN_LAI_TING_HONG
              </h1>
              <p className="text-[10px] text-cyber-text/60 font-mono flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 bg-cyber-neonGreen rounded-full animate-ping"></span>
                MMU CYBERJAYA // NETWORK SECURITY ANALYST
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
              onClick={() => {
                sessionStorage.removeItem('ryansec_entered');
                setEntranceStage('black_world');
                setEntryMode('gateway');
              }}
              className="px-2 py-1 bg-cyber-neonPurple/10 border border-cyber-neonPurple/30 text-cyber-neonPurple font-mono text-[10px] uppercase rounded hover:bg-cyber-neonPurple/25 transition-all cursor-pointer"
              title="Return to Access Gateway"
            >
              Exit 3D
            </button>
          </div>

        </div>
      )}

      {/* 3. Floating HUD Sidebar (Diagnostic stats & node index) */}
      {entranceStage === 'entered' && activeView === 'desk' && (
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

      {/* 3D Interactive Guide (Mission Tracker) */}
      {entranceStage === 'entered' && activeView === 'desk' && (
        <div className="absolute left-4 top-24 w-68 pointer-events-none z-10 flex flex-col gap-4">
          <div className="cyber-panel-purple p-3.5 bg-cyber-dark/85 backdrop-blur-md border-cyber-neonPurple/20 pointer-events-auto space-y-3 animate-fade-in shadow-glow-purple">
            <h3 className="text-xs font-bold tracking-wider font-mono text-cyber-heading border-b border-cyber-neonPurple/20 pb-1.5 uppercase flex items-center justify-between">
              <span className="text-gradient font-bold flex items-center gap-1">⚔️ Tutorial Protocol</span>
              <button 
                onClick={resetTutorial}
                className="text-[8px] font-mono px-1 py-0.5 bg-cyber-neonPurple/10 text-cyber-neonPurple border border-cyber-neonPurple/30 rounded hover:bg-cyber-neonPurple/30 transition-all cursor-pointer font-bold"
                title="Reset Tutorial Data"
              >
                Reset
              </button>
            </h3>

            <div className="space-y-2.5 font-mono text-[9px] leading-tight">
              {/* Task 1: Monitor */}
              <div className="flex items-start gap-2">
                <span className={`w-3.5 h-3.5 rounded border flex items-center justify-center font-bold text-[8px] flex-shrink-0 transition-all ${
                  completedTutorialSteps.monitor 
                    ? 'bg-cyber-neonGreen/10 border-cyber-neonGreen text-cyber-neonGreen' 
                    : 'border-cyber-text/30 text-cyber-text/40'
                }`}>
                  {completedTutorialSteps.monitor ? '✓' : '1'}
                </span>
                <div className="flex-1">
                  <p className={`transition-all ${completedTutorialSteps.monitor ? 'text-cyber-text/40 line-through' : 'text-cyber-heading font-semibold'}`}>
                    Zoom into Virtual PC Monitor
                  </p>
                  <p className="text-[8px] text-cyber-text/40 mt-0.5">Click PC screen to access shell</p>
                </div>
              </div>

              {/* Task 2: USB */}
              <div className="flex items-start gap-2">
                <span className={`w-3.5 h-3.5 rounded border flex items-center justify-center font-bold text-[8px] flex-shrink-0 transition-all ${
                  completedTutorialSteps.usb 
                    ? 'bg-cyber-neonGreen/10 border-cyber-neonGreen text-cyber-neonGreen' 
                    : 'border-cyber-text/30 text-cyber-text/40'
                }`}>
                  {completedTutorialSteps.usb ? '✓' : '2'}
                </span>
                <div className="flex-1">
                  <p className={`transition-all ${completedTutorialSteps.usb ? 'text-cyber-text/40 line-through' : 'text-cyber-heading font-semibold'}`}>
                    Decrypt Security USB Key
                  </p>
                  <p className="text-[8px] text-cyber-text/40 mt-0.5">Click the glowing USB on the desk</p>
                </div>
              </div>

              {/* Task 3: Folder */}
              <div className="flex items-start gap-2">
                <span className={`w-3.5 h-3.5 rounded border flex items-center justify-center font-bold text-[8px] flex-shrink-0 transition-all ${
                  completedTutorialSteps.folder 
                    ? 'bg-cyber-neonGreen/10 border-cyber-neonGreen text-cyber-neonGreen' 
                    : 'border-cyber-text/30 text-cyber-text/40'
                }`}>
                  {completedTutorialSteps.folder ? '✓' : '3'}
                </span>
                <div className="flex-1">
                  <p className={`transition-all ${completedTutorialSteps.folder ? 'text-cyber-text/40 line-through' : 'text-cyber-heading font-semibold'}`}>
                    Analyze Target Dossier
                  </p>
                  <p className="text-[8px] text-cyber-text/40 mt-0.5">Click the Manila folder on the desk</p>
                </div>
              </div>

              {/* Task 4: Phone */}
              <div className="flex items-start gap-2">
                <span className={`w-3.5 h-3.5 rounded border flex items-center justify-center font-bold text-[8px] flex-shrink-0 transition-all ${
                  completedTutorialSteps.phone 
                    ? 'bg-cyber-neonGreen/10 border-cyber-neonGreen text-cyber-neonGreen' 
                    : 'border-cyber-text/30 text-cyber-text/40'
                }`}>
                  {completedTutorialSteps.phone ? '✓' : '4'}
                </span>
                <div className="flex-1">
                  <p className={`transition-all ${completedTutorialSteps.phone ? 'text-cyber-text/40 line-through' : 'text-cyber-heading font-semibold'}`}>
                    Decode Mobile Comms
                  </p>
                  <p className="text-[8px] text-cyber-text/40 mt-0.5">Click the smartphone on the desk</p>
                </div>
              </div>

              {/* Task 5: Fridge */}
              <div className="flex items-start gap-2">
                <span className={`w-3.5 h-3.5 rounded border flex items-center justify-center font-bold text-[8px] flex-shrink-0 transition-all ${
                  completedTutorialSteps.fridge 
                    ? 'bg-cyber-neonGreen/10 border-cyber-neonGreen text-cyber-neonGreen' 
                    : 'border-cyber-text/30 text-cyber-text/40'
                }`}>
                  {completedTutorialSteps.fridge ? '✓' : '5'}
                </span>
                <div className="flex-1">
                  <p className={`transition-all ${completedTutorialSteps.fridge ? 'text-cyber-text/40 line-through' : 'text-cyber-heading font-semibold'}`}>
                    Access Hydration Reservoir
                  </p>
                  <p className="text-[8px] text-cyber-text/40 mt-0.5">Click the glass door of the fridge</p>
                </div>
              </div>

              {/* Task 6: Sofa */}
              <div className="flex items-start gap-2">
                <span className={`w-3.5 h-3.5 rounded border flex items-center justify-center font-bold text-[8px] flex-shrink-0 transition-all ${
                  completedTutorialSteps.sofa 
                    ? 'bg-cyber-neonGreen/10 border-cyber-neonGreen text-cyber-neonGreen' 
                    : 'border-cyber-text/30 text-cyber-text/40'
                }`}>
                  {completedTutorialSteps.sofa ? '✓' : '6'}
                </span>
                <div className="flex-1">
                  <p className={`transition-all ${completedTutorialSteps.sofa ? 'text-cyber-text/40 line-through' : 'text-cyber-heading font-semibold'}`}>
                    Recalibrate Comfort (Sofa)
                  </p>
                  <p className="text-[8px] text-cyber-text/40 mt-0.5">Click the grey sofa to take a seat</p>
                </div>
              </div>

              {/* Task 7: Physics */}
              <div className="flex items-start gap-2">
                <span className={`w-3.5 h-3.5 rounded border flex items-center justify-center font-bold text-[8px] flex-shrink-0 transition-all ${
                  completedTutorialSteps.physics 
                    ? 'bg-cyber-neonGreen/10 border-cyber-neonGreen text-cyber-neonGreen' 
                    : 'border-cyber-text/30 text-cyber-text/40'
                }`}>
                  {completedTutorialSteps.physics ? '✓' : '7'}
                </span>
                <div className="flex-1">
                  <p className={`transition-all ${completedTutorialSteps.physics ? 'text-cyber-text/40 line-through' : 'text-cyber-heading font-semibold'}`}>
                    Environmental Physics
                  </p>
                  <p className="text-[8px] text-cyber-text/40 mt-0.5">Drag/throw any soda can or plant</p>
                </div>
              </div>
            </div>

            {/* Mission Complete Overlay */}
            {Object.values(completedTutorialSteps).every(Boolean) && (
              <div className="pt-2 border-t border-cyber-neonGreen/20 text-center text-cyber-neonGreen font-bold animate-pulse text-[10px]">
                🏆 TRAINING COMPLETION VERIFIED!
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4. Bottom Navigation Prompt & Helper HUD */}
      {entranceStage === 'entered' && (
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
      )}

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
      {entranceStage === 'entered' && activeView === 'desk' && isPointerLocked && (
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
      {entranceStage === 'entered' && !muteSound && (
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

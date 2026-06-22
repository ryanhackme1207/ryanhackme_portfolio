import React, { useState, useEffect, useRef } from 'react';
import { Shield, Network, FileText, Send, Terminal, Activity } from 'lucide-react';
import type { ViewState } from '../types';

interface CyberDashboardProps {
  onNavigate: (view: ViewState) => void;
}

export const CyberDashboard: React.FC<CyberDashboardProps> = ({ onNavigate }) => {
  const [terminalInput, setTerminalInput] = useState('');
  const [terminalLines, setTerminalLines] = useState<string[]>([
    'SECURE CONNECTION ESTABLISHED TO CODENAME: LTH_WORKSPACE',
    'INITIALIZING SYSTEM DIAGNOSTICS...',
    'READY. Type "help" for available protocols.',
    ''
  ]);
  const [scanProgress, setScanProgress] = useState(0);
  const [isScanning, setIsScanning] = useState(false);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll terminal
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminalLines]);

  const runScanner = () => {
    if (isScanning) return;
    setIsScanning(true);
    setScanProgress(0);
    setTerminalLines(prev => [...prev, '>> STAGE 1: INITIATING NETWORK ROUTER SCAN...']);
  };

  useEffect(() => {
    if (!isScanning) return;
    if (scanProgress < 100) {
      const timer = setTimeout(() => {
        setScanProgress(prev => prev + 5);
        if (scanProgress % 25 === 0) {
          setTerminalLines(prev => [
            ...prev, 
            `>> Progress: ${scanProgress}%. Scanning subnet IP allocations...`
          ]);
        }
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setIsScanning(false);
      setTerminalLines(prev => [
        ...prev,
        '>> SCAN COMPLETE. NO VULNERABILITIES FOUND.',
        '>> STATUS: SECURE. 100% network packets conform to RFC standards.'
      ]);
    }
  }, [isScanning, scanProgress]);

  // Terminal commands interpreter
  const handleTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = terminalInput.trim().toLowerCase();
    if (!cmd) return;

    let response: string[] = [];
    switch (cmd) {
      case 'help':
        response = [
          'AVAILABLE TERMINAL COMMANDS:',
          '  about       - Analyst Profile & Bio',
          '  mmu         - Academic credentials & network security studies',
          '  wevo        - Target career alignment details for Wevo',
          '  skills      - Quick system hardware/software skillset audit',
          '  scan        - Run active vulnerability & network scanner',
          '  clear       - Clear screen logs',
          '  usb / folder / phone - Interface with physical room assets'
        ];
        break;
      case 'about':
        response = [
          'ANALYST SPECIFICATION:',
          '  Name: Lai Ting Hong',
          '  Specialization: Network Security & Cybersecurity Enthusiast',
          '  Location: Malaysia (MMU Melaka Campus)',
          '  Bio: Passionate about designing secure WAN architectures, monitoring network traffic, and resolving complex threat scenarios. Eager to launch my career as a Security or Network Engineer.'
        ];
        break;
      case 'mmu':
        response = [
          'ACADEMIC BACKGROUND:',
          '  Institution: Multimedia University (MMU), Melaka',
          '  Program: Bachelor of Computer Science (Hons) Specializing in Network Security',
          '  Core Focus: Cryptography, WAN Technologies, Threat Intelligence, Penetration Testing.',
          '  Project: Optimized secure hashing algorithms (6-bit & 8-bit mapping for high-speed routers).'
        ];
        break;
      case 'wevo':
        response = [
          'WEVO ALIGNMENT:',
          '  Objective: Seeking Junior Network Engineer / Security Analyst role.',
          '  Value Prop: Hand-on knowledge in firewalls, routing protocols (OSPF, BGP), and vulnerability assessment.',
          '  Fit: Eager to contribute to Wevo\'s managed security and robust enterprise network deployments.'
        ];
        break;
      case 'skills':
        response = [
          'AUDITING CORE SKILLS:',
          '  [★] Network: Cisco packet tracer, Wireshark, WAN routing/switching',
          '  [★] Security: Metasploit, Nmap, Cryptography, Snort IDS, VPNs',
          '  [★] Programming: C++, Python, JavaScript (R3F, WebGL)',
          '  Type "usb" or click the physical USB stick to inspect certified credentials.'
        ];
        break;
      case 'scan':
        response = ['Starting system scan...'];
        setTimeout(runScanner, 100);
        break;
      case 'clear':
        setTerminalLines([]);
        setTerminalInput('');
        return;
      case 'usb':
        response = ['Redirecting physical orientation to USB...'];
        setTimeout(() => onNavigate('usb'), 800);
        break;
      case 'folder':
        response = ['Opening physical folder container...'];
        setTimeout(() => onNavigate('folder'), 800);
        break;
      case 'phone':
        response = ['Establishing cellular data downlink...'];
        setTimeout(() => onNavigate('phone'), 800);
        break;
      default:
        response = [`Command "${cmd}" not recognized. Type "help" for instructions.`];
    }

    setTerminalLines(prev => [...prev, `guest@LTH-SEC-OS:~$ ${terminalInput}`, ...response, '']);
    setTerminalInput('');
  };

  return (
    <div className="w-full h-full bg-[#020105] border-2 border-cyber-neonPurple text-cyber-text font-sans rounded-lg shadow-glow-purple-lg overflow-hidden flex flex-col scanlines relative select-none">
      
      {/* OS Header Bar */}
      <div className="bg-[#050209] px-4 py-2 flex items-center justify-between border-b border-cyber-neonPurple/30 text-xs font-mono">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-cyber-neonPurple animate-pulse" />
          <span className="text-gradient font-bold tracking-widest uppercase">LTN_SEC_HOST://LAI_TING_HONG</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 bg-cyber-neonGreen rounded-full animate-ping"></span>
            <span className="text-cyber-neonGreen">MMU MALAKA // NETWORK SECURITY ANALYST</span>
          </span>
        </div>
      </div>

      {/* Main Workspace Grid */}
      <div className="flex-1 grid grid-cols-12 overflow-hidden">
        
        {/* Left Column (col-span-7): Network diagram / status & Terminal Console */}
        <div className="col-span-7 flex flex-col bg-[#020105] border-r border-cyber-neonPurple/20 overflow-hidden">
          
          {/* Subnet Topology Diagram & specific host info */}
          <div className="p-4 border-b border-cyber-neonPurple/15 space-y-3 bg-[#030107]/50 flex-shrink-0">
            <div className="flex items-center justify-between border-b border-cyber-neonPurple/10 pb-1">
              <span className="text-[10px] font-mono text-cyber-neonGreen font-semibold uppercase tracking-wider flex items-center gap-1.5">
                <Network className="w-4 h-4 text-cyber-neonGreen" /> Subnet Topology Audit
              </span>
              <span className="text-[9px] font-mono text-cyber-neonPurple">VLAN_107: SECURE</span>
            </div>

            {/* Network Mini Diagram Graphic */}
            <div className="grid grid-cols-5 gap-2 items-center justify-center p-2 border border-cyber-neonPurple/15 bg-black rounded font-mono text-[9px] text-center">
              <div className="p-1 border border-cyber-neonPurple/30 rounded bg-cyber-neonPurple/5 text-cyber-neonPurple">
                <div>WAN</div>
                <div className="text-[7px] text-cyber-text/50">OSPF/BGP</div>
              </div>
              <div className="text-cyber-neonGreen text-xs">◀──▶</div>
              <div className="p-1 border border-cyber-neonGreen/30 rounded bg-cyber-neonGreen/5 text-cyber-neonGreen">
                <div>FW_WALL</div>
                <div className="text-[7px] text-cyber-text/50">FILTERING</div>
              </div>
              <div className="text-cyber-neonPurple text-xs">◀──▶</div>
              <div className="p-1 border border-cyber-neonPurple/30 rounded bg-cyber-neonPurple/5 text-cyber-neonPurple">
                <div>HOST_PC</div>
                <div className="text-[7px] text-cyber-neonGreen">192.168.1.107</div>
              </div>
            </div>

            {/* Host Details Grid */}
            <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-cyber-text/80">
              <div className="p-1.5 bg-black border border-cyber-neonPurple/10 rounded">
                <div className="text-[8px] text-cyber-text/40 uppercase">GATEWAY ROUTER:</div>
                <div className="text-cyber-neonPurple font-bold">192.168.1.1 (CCNA-OSPF)</div>
              </div>
              <div className="p-1.5 bg-black border border-cyber-neonPurple/10 rounded">
                <div className="text-[8px] text-cyber-text/40 uppercase">IDS FIREWALL:</div>
                <div className="text-cyber-neonGreen font-bold">Snort-IDS Online</div>
              </div>
            </div>
          </div>

          {/* Interactive Console Terminal */}
          <div className="flex-1 flex flex-col overflow-hidden bg-black font-mono text-xs">
            <div className="bg-[#050209] px-3 py-1 flex items-center justify-between border-b border-cyber-neonPurple/15 text-[10px] text-cyber-neonPurple/70">
              <span className="flex items-center gap-1"><Terminal className="w-3.5 h-3.5" /> INTERACTIVE PORTFOLIO CONSOLE</span>
              <span>guest@LTH-SEC-OS</span>
            </div>
            
            {/* Terminal Screen lines */}
            <div className="flex-1 p-3 overflow-y-auto custom-scrollbar text-[10px] text-cyber-neonGreen space-y-1">
              {terminalLines.map((line, idx) => (
                <div key={idx} className="whitespace-pre-wrap leading-tight">
                  {line.startsWith('>>') ? (
                    <span className="text-cyber-neonGreen font-bold">{line}</span>
                  ) : line.startsWith('guest@') ? (
                    <span className="text-cyber-neonPurple font-bold">{line}</span>
                  ) : (
                    line
                  )}
                </div>
              ))}
              <div ref={terminalEndRef} />
            </div>

            {/* Input Prompt Form */}
            <form onSubmit={handleTerminalSubmit} className="flex border-t border-cyber-neonPurple/20 bg-[#050209]/95">
              <span className="px-3 py-1.5 text-cyber-neonPurple font-bold bg-[#030107] select-none flex items-center text-[10px]">guest@LTH:~$</span>
              <input
                type="text"
                value={terminalInput}
                onChange={(e) => setTerminalInput(e.target.value)}
                placeholder="Type 'help', 'about', 'wevo', 'mmu'..."
                className="flex-1 bg-transparent text-cyber-neonGreen focus:outline-none px-2 py-1.5 placeholder-cyber-neonPurple/30 text-[10px] font-mono"
              />
              <button 
                type="submit" 
                className="px-3 bg-cyber-neonPurple/10 hover:bg-cyber-neonPurple/25 border-l border-cyber-neonPurple/20 text-cyber-neonPurple transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

        </div>

        {/* Right Column (col-span-5): NODES DIAGNOSTIC & SECURITY FEED */}
        <div className="col-span-5 flex flex-col bg-[#020105] overflow-hidden justify-between">
          
          {/* Nodes Diagnostic Panel */}
          <div className="p-4 border-b border-cyber-neonPurple/15 bg-black flex-1 overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between border-b border-cyber-neonPurple/20 pb-1.5 mb-2">
              <span className="text-xs font-bold font-mono tracking-widest text-gradient">NODES DIAGNOSTIC</span>
              <Activity className="w-4 h-4 text-cyber-neonPurple animate-pulse" />
            </div>
            
            <div className="space-y-2 font-mono text-[10px]">
              <div className="flex items-center justify-between p-2 border border-cyber-neonPurple/10 bg-[#030107] rounded hover:border-cyber-neonPurple/40 transition-colors">
                <span className="text-cyber-text/70">01. Virtual PC</span>
                <span className="text-gradient font-bold">READY</span>
              </div>
              <div className="flex items-center justify-between p-2 border border-cyber-neonPurple/10 bg-[#030107] rounded hover:border-cyber-neonGreen/45 transition-colors">
                <span className="text-cyber-text/70">02. Security USB</span>
                <span className="text-cyber-neonGreen font-bold animate-pulse">DETECTED</span>
              </div>
              <div className="flex items-center justify-between p-2 border border-cyber-neonPurple/10 bg-[#030107] rounded hover:border-cyber-neonPurple/40 transition-colors">
                <span className="text-cyber-text/70">03. Manila Dossier</span>
                <span className="text-gradient font-bold">LOGGED</span>
              </div>
              <div className="flex items-center justify-between p-2 border border-cyber-neonPurple/10 bg-[#030107] rounded hover:border-cyber-neonGreen/45 transition-colors">
                <span className="text-cyber-text/70">04. Smartphone</span>
                <span className="text-gradient font-bold">SECURE</span>
              </div>
            </div>
          </div>

          {/* Security Feed Panel */}
          <div className="p-4 bg-black border-t border-cyber-neonPurple/15 flex-1 overflow-hidden flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-cyber-neonPurple/20 pb-1.5 mb-2">
                <span className="text-xs font-bold font-mono tracking-widest text-gradient">SECURITY FEED</span>
                <FileText className="w-4 h-4 text-cyber-neonGreen" />
              </div>
              
              <div className="font-mono text-[9px] text-cyber-text/80 space-y-1.5 h-36 overflow-y-auto custom-scrollbar">
                <div className="text-cyber-neonGreen">• Host verification requested by LTH-PC</div>
                <div className="text-cyber-neonPurple">• Handshake refreshed with MMU gateway router</div>
                <div className="text-cyber-text/60">• Active logs segmenting OSPF area network bounds</div>
                <div className="text-cyber-neonGreen">• Security audit log initialized on 192.168.1.107</div>
                <div className="text-cyber-text/60">• VPN tunnel integrity check completed successfully</div>
                <div className="text-cyber-neonPurple">• Hashing simulation logs exported to master folder</div>
              </div>
            </div>

            {/* Quick shortcuts presets */}
            <div className="flex gap-1.5 text-[9px] font-mono justify-end mt-2 pt-2 border-t border-cyber-neonPurple/10">
              <button onClick={() => onNavigate('usb')} className="px-1.5 py-0.5 bg-cyber-neonGreen/10 border border-cyber-neonGreen/30 hover:bg-cyber-neonGreen/20 text-cyber-neonGreen rounded transition-colors">USB KEY</button>
              <button onClick={() => onNavigate('folder')} className="px-1.5 py-0.5 bg-cyber-neonPurple/10 border border-cyber-neonPurple/30 hover:bg-cyber-neonPurple/20 text-cyber-neonPurple rounded transition-colors">DOSSIER</button>
              <button onClick={() => onNavigate('phone')} className="px-1.5 py-0.5 bg-cyber-neonGreen/10 border border-cyber-neonGreen/30 hover:bg-cyber-neonGreen/20 text-cyber-neonGreen rounded transition-colors">PHONE</button>
            </div>
          </div>

        </div>

      </div>

      {/* Bottom Instruction Bar */}
      <div className="bg-[#050209] px-4 py-2 flex items-center justify-center border-t border-cyber-neonPurple/30 text-[10px] font-mono text-center text-cyber-neonGreen">
        <span>[Click monitor to zoom in. Select the USB Key, Beige Folder (recolored purple), or Smartphone to inspect details.]</span>
      </div>

    </div>
  );
};

export default CyberDashboard;

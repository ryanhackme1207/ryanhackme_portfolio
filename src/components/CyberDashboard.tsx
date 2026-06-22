import React, { useState, useEffect, useRef } from 'react';
import { Shield, Network, FileText, Send, Terminal, Activity } from 'lucide-react';
import type { ViewState } from '../types';

interface CyberDashboardProps {
  onNavigate: (view: ViewState) => void;
}

export const CyberDashboard: React.FC<CyberDashboardProps> = ({ onNavigate }) => {
  const [terminalInput, setTerminalInput] = useState('');
  const [appsMenuOpen, setAppsMenuOpen] = useState(false);
  const terminalInputRef = useRef<HTMLInputElement>(null);
  const [terminalLines, setTerminalLines] = useState<string[]>([
    '┌──(kali㉿kali)-[~]',
    '└─$ lth_system_init',
    'STAGED INTRUSION WORKSPACE LOADED SUCCESSFULLY.',
    'TARGET HOST SYSTEM AUDIT: ACTIVE...',
    'Type "help" for a list of attack surface tools.',
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
          'KALI AUDIT TOOLBOX COMMANDS:',
          '  about       - Information about Lead Security Analyst Lai Ting Hong',
          '  mmu         - Target academic training & network security degree audits',
          '  wevo        - Alignment goals & career objectives with Wevo Security',
          '  skills      - Audited tools (Wireshark, Metasploit, Nmap, C++, Python)',
          '  scan        - Execute Nmap vulnerability & sub-network scan',
          '  clear       - Wipe the active shell log buffer',
          '  usb / folder / phone - Inspect target hardware peripherals directly'
        ];
        break;
      case 'about':
        response = [
          '  Analyst Identity: Lai Ting Hong',
          '  Focus Area: Network Infrastructure & Critical Security Systems',
          '  Affiliation: Multimedia University (MMU Melaka Campus)',
          '  Objective: Cyber security specialist ready to secure network assets'
        ];
        break;
      case 'mmu':
        response = [
          '  Location: Multimedia University (MMU), Melaka, Malaysia',
          '  Course: Bachelor of Computer Science (Hons) - Network Security Major',
          '  Expertise: Cryptographic verification, firewall topology, high-speed routing hashes'
        ];
        break;
      case 'wevo':
        response = [
          '  Objective: Junior Network Engineer / Security Analyst role',
          '  Skillset: Routing (OSPF, BGP), VPN configuration, Intrusion Detection Systems',
          '  Target: Wevo Security operations and managed service infrastructure'
        ];
        break;
      case 'skills':
        response = [
          '  Network Tools: Wireshark, Cisco Packet Tracer, OSPF Routing Switches',
          '  Sec Tools: Nmap, Metasploit Framework, Cryptographic Ciphers, Snort IDS',
          '  Languages: C++, Python scripting, React/WebGL high-speed web apps'
        ];
        break;
      case 'scan':
        response = ['>> nmap -sV -O -F 192.168.1.0/24', 'Starting active network map scanner...'];
        setTimeout(runScanner, 100);
        break;
      case 'clear':
        setTerminalLines([]);
        setTerminalInput('');
        return;
      case 'usb':
        response = ['[!] Relocating viewport target to Security USB key...'];
        setTimeout(() => onNavigate('usb'), 800);
        break;
      case 'folder':
        response = ['[!] Relocating viewport target to Manila Dossier...'];
        setTimeout(() => onNavigate('folder'), 800);
        break;
      case 'phone':
        response = ['[!] Establishing encrypted SSL session to Smartphone...'];
        setTimeout(() => onNavigate('phone'), 800);
        break;
      default:
        response = [`zsh: command not found: ${cmd}`];
    }

    setTerminalLines(prev => [
      ...prev, 
      `┌──(kali㉿kali)-[~]`, 
      `└─$ ${terminalInput}`, 
      ...response, 
      ''
    ]);
    setTerminalInput('');
  };

  return (
    <div className="w-full h-full bg-[#0f141c] border-2 border-[#1f2937] text-[#a9b1d6] font-sans rounded-lg shadow-[0_0_20px_rgba(6,182,212,0.15)] overflow-hidden flex flex-col scanlines relative select-none">
      
      {/* Kali Dragon Wallpaper Watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] z-0 select-none">
        <svg viewBox="0 0 100 100" className="w-[260px] h-[260px] text-cyan-400 fill-current">
          <path d="M50 5C35 15 25 35 25 50c0 10 3 20 8 28-3-15-5-25-3-35 5-20 20-33 20-33s-5 12-1 25c3 10 10 15 15 25 5 10 6 22 3 32-5-12-12-18-20-22-5-3-10-3-15-3 5-10 15-20 28-25 15-5 25-2 30 8 3 6 3 15 0 22-5 10-15 15-25 15 12-2 20-10 23-20 2-8 0-18-5-25-8-12-22-15-30-22 5 3 12 8 15 18 2 8-1 15-5 20-5 5-12 8-18 6 10 0 18-5 22-12 2-5 1-12-2-18-5-8-12-12-18-18z" />
        </svg>
      </div>

      {/* Kali Linux Panel/Taskbar */}
      <div className="bg-[#0f141c] text-[#a9b1d6] h-8 px-3 flex items-center justify-between border-b border-cyan-500/20 text-xs font-sans select-none z-10 relative">
        <div className="flex items-center gap-3">
          {/* Kali Logo (Blue/cyan dragon SVG) */}
          <div 
            onClick={() => setAppsMenuOpen(!appsMenuOpen)}
            className="w-5 h-5 flex items-center justify-center bg-cyan-500/10 rounded cursor-pointer hover:bg-cyan-500/25 transition-colors"
          >
            <svg viewBox="0 0 100 100" className="w-4.5 h-4.5 fill-cyan-400 text-cyan-400">
              <path d="M50 5C35 15 25 35 25 50c0 10 3 20 8 28-3-15-5-25-3-35 5-20 20-33 20-33s-5 12-1 25c3 10 10 15 15 25 5 10 6 22 3 32-5-12-12-18-20-22-5-3-10-3-15-3 5-10 15-20 28-25 15-5 25-2 30 8 3 6 3 15 0 22-5 10-15 15-25 15 12-2 20-10 23-20 2-8 0-18-5-25-8-12-22-15-30-22 5 3 12 8 15 18 2 8-1 15-5 20-5 5-12 8-18 6 10 0 18-5 22-12 2-5 1-12-2-18-5-8-12-12-18-18z" />
            </svg>
          </div>
          <span 
            onClick={() => setAppsMenuOpen(!appsMenuOpen)}
            className="font-bold text-white hover:text-cyan-400 cursor-pointer transition-colors text-[11px] flex items-center gap-1"
          >
            Applications <span className="text-[8px] text-zinc-500">▼</span>
          </span>
          
          {/* Applications Dropdown Menu */}
          {appsMenuOpen && (
            <div className="absolute top-8 left-3 w-56 bg-[#121824] border border-cyan-500/30 rounded shadow-2xl z-50 text-[11px] font-mono text-zinc-300 overflow-hidden divide-y divide-cyan-500/10">
              <div className="px-3 py-1.5 text-cyan-400 font-bold uppercase tracking-wider text-[9px] bg-[#0f141c]">Auditing Menu</div>
              <div className="flex flex-col">
                <button
                  onClick={() => {
                    setAppsMenuOpen(false);
                    terminalInputRef.current?.focus();
                    setTerminalLines(prev => [...prev, '>> FOCUSING INTERACTIVE SHELL BUFFER...', '']);
                  }}
                  className="px-3 py-2 text-left hover:bg-cyan-500/10 hover:text-cyan-400 transition-colors flex items-center gap-2 cursor-pointer focus:outline-none"
                >
                  <Terminal className="w-3.5 h-3.5" /> 1. Launch Terminal Shell
                </button>
                <button
                  onClick={() => {
                    setAppsMenuOpen(false);
                    runScanner();
                  }}
                  className="px-3 py-2 text-left hover:bg-cyan-500/10 hover:text-[#39ff14] transition-colors flex items-center gap-2 cursor-pointer focus:outline-none"
                >
                  <Network className="w-3.5 h-3.5" /> 2. Run Network Audit (Scan)
                </button>
                <button
                  onClick={() => {
                    setAppsMenuOpen(false);
                    onNavigate('usb');
                  }}
                  className="px-3 py-2 text-left hover:bg-cyan-500/10 hover:text-cyan-400 transition-colors flex items-center gap-2 cursor-pointer focus:outline-none"
                >
                  <Shield className="w-3.5 h-3.5" /> 3. Mount Security USB
                </button>
                <button
                  onClick={() => {
                    setAppsMenuOpen(false);
                    onNavigate('folder');
                  }}
                  className="px-3 py-2 text-left hover:bg-cyan-500/10 hover:text-cyan-400 transition-colors flex items-center gap-2 cursor-pointer focus:outline-none"
                >
                  <FileText className="w-3.5 h-3.5" /> 4. Read Manila Dossier
                </button>
                <button
                  onClick={() => {
                    setAppsMenuOpen(false);
                    onNavigate('phone');
                  }}
                  className="px-3 py-2 text-left hover:bg-cyan-500/10 hover:text-cyan-400 transition-colors flex items-center gap-2 cursor-pointer focus:outline-none"
                >
                  <Activity className="w-3.5 h-3.5" /> 5. Connect Smartphone Link
                </button>
              </div>
            </div>
          )}

          <span className="text-zinc-600">|</span>
          {/* Launcher shortcuts */}
          <div className="flex items-center gap-2">
            <button 
              onClick={() => {
                terminalInputRef.current?.focus();
                setTerminalLines(prev => [...prev, '>> FOCUSING INTERACTIVE SHELL BUFFER...', '']);
              }}
              className="w-5 h-5 rounded hover:bg-white/10 flex items-center justify-center text-cyan-400 cursor-pointer focus:outline-none" 
              title="Kali Terminal"
            >
              <Terminal className="w-3.5 h-3.5" />
            </button>
            <button 
              onClick={runScanner}
              className="w-5 h-5 rounded hover:bg-white/10 flex items-center justify-center text-[#39ff14] cursor-pointer focus:outline-none" 
              title="Network Audit"
            >
              <Network className="w-3.5 h-3.5" />
            </button>
            <button 
              onClick={() => onNavigate('folder')}
              className="w-5 h-5 rounded hover:bg-white/10 flex items-center justify-center text-amber-500 cursor-pointer focus:outline-none" 
              title="Credential Folder"
            >
              <FileText className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
        
        {/* Center: Live Time Clock */}
        <div className="font-semibold text-white/90 text-[11px] font-mono flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-ping"></span>
          {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
        </div>
        
        {/* Right Status Info */}
        <div className="flex items-center gap-3.5 text-[10px] font-mono">
          <span className="text-cyan-400">kali@lth-workstation</span>
          <span className="text-zinc-600">|</span>
          <div className="flex items-center gap-2 text-zinc-400">
            <span>CPU 18%</span>
            <span>RAM 4.2G</span>
            <span className="text-[#39ff14] animate-pulse">● VPN ON</span>
          </div>
        </div>
      </div>

      {/* Main Workspace Grid */}
      <div className="flex-1 grid grid-cols-12 overflow-hidden z-10">
        
        {/* Left Column (col-span-7): Network diagram / status & Terminal Console */}
        <div className="col-span-7 flex flex-col bg-[#0f141c] border-r border-cyan-500/10 overflow-hidden">
          
          {/* Subnet Topology Diagram & specific host info */}
          <div className="p-4 border-b border-cyan-500/10 space-y-3 bg-[#161a22]/60 flex-shrink-0">
            <div className="flex items-center justify-between border-b border-cyan-500/10 pb-1">
              <span className="text-[10px] font-mono text-[#39ff14] font-semibold uppercase tracking-wider flex items-center gap-1.5">
                <Network className="w-4 h-4 text-[#39ff14]" /> Subnet Topology Audit
              </span>
              <span className="text-[9px] font-mono text-cyan-400">VLAN_107: SECURE</span>
            </div>

            {/* Network Mini Diagram Graphic */}
            <div className="grid grid-cols-5 gap-2 items-center justify-center p-2 border border-cyan-500/10 bg-[#090d16] rounded font-mono text-[9px] text-center">
              <div className="p-1 border border-cyan-500/30 rounded bg-cyan-500/5 text-cyan-400">
                <div>WAN</div>
                <div className="text-[7px] text-zinc-500">OSPF/BGP</div>
              </div>
              <div className="text-[#39ff14] text-xs">◀──▶</div>
              <div className="p-1 border border-green-500/30 rounded bg-green-500/5 text-green-400">
                <div>FW_WALL</div>
                <div className="text-[7px] text-zinc-500">FILTERING</div>
              </div>
              <div className="text-cyan-400 text-xs">◀──▶</div>
              <div className="p-1 border border-cyan-500/30 rounded bg-cyan-500/5 text-cyan-400">
                <div>HOST_PC</div>
                <div className="text-[7px] text-[#39ff14]">192.168.1.107</div>
              </div>
            </div>

            {/* Host Details Grid */}
            <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-zinc-300">
              <div className="p-1.5 bg-[#090d16] border border-cyan-500/10 rounded">
                <div className="text-[8px] text-zinc-500 uppercase">GATEWAY ROUTER:</div>
                <div className="text-cyan-400 font-bold">192.168.1.1 (CCNA-OSPF)</div>
              </div>
              <div className="p-1.5 bg-[#090d16] border border-cyan-500/10 rounded">
                <div className="text-[8px] text-zinc-500 uppercase">IDS FIREWALL:</div>
                <div className="text-green-400 font-bold">Snort-IDS Online</div>
              </div>
            </div>
          </div>

          {/* Interactive Console Terminal */}
          <div className="flex-1 flex flex-col overflow-hidden bg-[#0c1017] font-mono text-xs">
            <div className="bg-[#121824] px-3 py-1 flex items-center justify-between border-b border-cyan-500/10 text-[10px] text-cyan-400/80">
              <span className="flex items-center gap-1"><Terminal className="w-3.5 h-3.5" /> INTERACTIVE PORTFOLIO CONSOLE</span>
              <span>kali@lth-workstation</span>
            </div>
            
            {/* Terminal Screen lines */}
            <div className="flex-1 p-3 overflow-y-auto custom-scrollbar text-[10px] text-[#c0caf5] space-y-1">
              {terminalLines.map((line, idx) => (
                <div key={idx} className="whitespace-pre-wrap leading-tight">
                  {line.startsWith('┌──') ? (
                    <span className="text-cyan-400 font-bold">{line}</span>
                  ) : line.startsWith('└─$') ? (
                    <span className="text-white font-bold">{line}</span>
                  ) : line.startsWith('>>') ? (
                    <span className="text-[#39ff14] font-bold">{line}</span>
                  ) : (
                    line
                  )}
                </div>
              ))}
              <div ref={terminalEndRef} />
            </div>

            {/* Input Prompt Form */}
            <div className="flex flex-col border-t border-[#1e222b] bg-[#0c1017]">
              <div className="px-3 pt-1.5 text-cyan-400 font-mono text-[9px] select-none">
                ┌──(kali㉿kali)-[~]
              </div>
              <form onSubmit={handleTerminalSubmit} className="flex bg-[#0c1017] items-center pb-1">
                <span className="pl-3 py-1 text-white font-mono select-none text-[10px] mr-1">└─$</span>
                <input
                  ref={terminalInputRef}
                  type="text"
                  value={terminalInput}
                  onChange={(e) => setTerminalInput(e.target.value)}
                  placeholder="Type 'help', 'about', 'wevo', 'skills'..."
                  className="flex-1 bg-transparent text-white focus:outline-none px-2 py-1 placeholder-white/20 text-[10px] font-mono"
                />
                <button 
                  type="submit" 
                  className="px-3 py-1 bg-cyan-500/10 hover:bg-cyan-500/25 border-l border-cyan-500/20 text-cyan-400 transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </div>

        </div>

        {/* Right Column (col-span-5): NODES DIAGNOSTIC & SECURITY FEED */}
        <div className="col-span-5 flex flex-col bg-[#0f141c] overflow-hidden justify-between">
          
          {/* Nodes Diagnostic Panel */}
          <div className="p-4 border-b border-cyan-500/10 bg-[#0c1017]/80 flex-1 overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between border-b border-cyan-500/20 pb-1.5 mb-2">
              <span className="text-xs font-bold font-mono tracking-widest text-cyan-400">NODES DIAGNOSTIC</span>
              <Activity className="w-4 h-4 text-cyan-400 animate-pulse" />
            </div>
            
            <div className="space-y-2 font-mono text-[10px]">
              <button 
                onClick={() => onNavigate('monitor')}
                className="w-full flex items-center justify-between p-2 border border-cyan-500/10 bg-[#161a22] rounded hover:border-cyan-400/40 hover:bg-cyan-500/5 transition-all text-left cursor-pointer focus:outline-none"
              >
                <span className="text-zinc-300">01. Virtual PC</span>
                <span className="text-cyan-400 font-bold">READY</span>
              </button>
              <button 
                onClick={() => onNavigate('usb')}
                className="w-full flex items-center justify-between p-2 border border-cyan-500/10 bg-[#161a22] rounded hover:border-green-400/40 hover:bg-green-500/5 transition-all text-left cursor-pointer focus:outline-none"
              >
                <span className="text-zinc-300">02. Security USB</span>
                <span className="text-green-400 font-bold animate-pulse">DETECTED</span>
              </button>
              <button 
                onClick={() => onNavigate('folder')}
                className="w-full flex items-center justify-between p-2 border border-cyan-500/10 bg-[#161a22] rounded hover:border-cyan-400/40 hover:bg-cyan-500/5 transition-all text-left cursor-pointer focus:outline-none"
              >
                <span className="text-zinc-300">03. Manila Dossier</span>
                <span className="text-cyan-400 font-bold">LOGGED</span>
              </button>
              <button 
                onClick={() => onNavigate('phone')}
                className="w-full flex items-center justify-between p-2 border border-cyan-500/10 bg-[#161a22] rounded hover:border-green-400/40 hover:bg-green-500/5 transition-all text-left cursor-pointer focus:outline-none"
              >
                <span className="text-zinc-300">04. Smartphone</span>
                <span className="text-cyan-400 font-bold">SECURE</span>
              </button>
            </div>
          </div>

          {/* Security Feed Panel */}
          <div className="p-4 bg-[#0c1017]/80 border-t border-cyan-500/10 flex-1 overflow-hidden flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-cyan-500/20 pb-1.5 mb-2">
                <span className="text-xs font-bold font-mono tracking-widest text-cyan-400">SECURITY FEED</span>
                <FileText className="w-4 h-4 text-green-400" />
              </div>
              
              <div className="font-mono text-[9px] text-[#c0caf5] space-y-1.5 h-36 overflow-y-auto custom-scrollbar">
                <div className="text-green-400">• Host verification requested by LTH-PC</div>
                <div className="text-cyan-400">• Handshake refreshed with MMU gateway router</div>
                <div className="text-zinc-400">• Active logs segmenting OSPF area network bounds</div>
                <div className="text-green-400">• Security audit log initialized on 192.168.1.107</div>
                <div className="text-zinc-400">• VPN tunnel integrity check completed successfully</div>
                <div className="text-cyan-400">• Hashing simulation logs exported to master folder</div>
              </div>
            </div>

            {/* Quick shortcuts presets */}
            <div className="flex gap-1.5 text-[9px] font-mono justify-end mt-2 pt-2 border-t border-cyan-500/10">
              <button onClick={() => onNavigate('usb')} className="px-1.5 py-0.5 bg-green-500/10 border border-green-400/30 hover:bg-green-500/20 text-green-400 rounded transition-colors">USB KEY</button>
              <button onClick={() => onNavigate('folder')} className="px-1.5 py-0.5 bg-cyan-500/10 border border-cyan-400/30 hover:bg-cyan-500/20 text-cyan-400 rounded transition-colors">DOSSIER</button>
              <button onClick={() => onNavigate('phone')} className="px-1.5 py-0.5 bg-green-500/10 border border-green-400/30 hover:bg-green-500/20 text-green-400 rounded transition-colors">PHONE</button>
            </div>
          </div>

        </div>

      </div>

      {/* Bottom Instruction Bar */}
      <div className="bg-[#121824] px-4 py-2 flex items-center justify-center border-t border-cyan-500/20 text-[10px] font-mono text-center text-green-400">
        <span>[Kali Linux SecOS - Press ESC to return to Analyst Desk]</span>
      </div>

    </div>
  );
};

export default CyberDashboard;

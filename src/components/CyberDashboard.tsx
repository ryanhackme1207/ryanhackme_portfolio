import React, { useState, useEffect, useRef } from 'react';
import { Shield, Network, FileText, Send, Terminal, Activity } from 'lucide-react';
import type { ViewState } from '../types';

interface CyberDashboardProps {
  onNavigate: (view: ViewState) => void;
}

export const CyberDashboard: React.FC<CyberDashboardProps> = ({ onNavigate }) => {
  // Boot & OS State Management
  const [bootState, setBootState] = useState<'loader' | 'booting_linux' | 'booting_windows' | 'linux' | 'windows'>('loader');
  const [selectedLoaderIndex, setSelectedLoaderIndex] = useState(0); // 0 for Linux, 1 for Windows
  const [bootLogs, setBootLogs] = useState<string[]>([]);

  // Kali Linux (Linux) Console State
  const [terminalInput, setTerminalInput] = useState('');
  const [appsMenuOpen, setAppsMenuOpen] = useState(false);
  const terminalInputRef = useRef<HTMLInputElement>(null);
  const [terminalLines, setTerminalLines] = useState<string[]>([
    '┌──(kali㉿kali)-[~]',
    '└─$ ryansec_system_init',
    'STAGED INTRUSION WORKSPACE LOADED SUCCESSFULLY.',
    'TARGET HOST SYSTEM AUDIT: ACTIVE...',
    'Type "help" for a list of attack surface tools.',
    ''
  ]);
  const [scanProgress, setScanProgress] = useState(0);
  const [isScanning, setIsScanning] = useState(false);
  const terminalScrollRef = useRef<HTMLDivElement>(null);

  // Windows PowerShell State
  const [winTerminalLines, setWinTerminalLines] = useState<string[]>([
    'Windows PowerShell',
    'Copyright (C) Microsoft Corporation. All rights reserved.',
    '',
    'PS C:\\Users\\RyanLai> Get-NetworkAudit -ObsessiveMode',
    'STATUS: ACTIVE',
    'ADAPTER: Intel(R) Wi-Fi 6E AX211 (MMU-CYBERJAYA-WIFI)',
    'IP ADDRESS: 192.168.1.107',
    'NETWORK OBSESSION FACTOR: 100% (CRITICAL)',
    'Type "help" or "Get-Command" to list custom scripts.',
    ''
  ]);
  const [winTerminalInput, setWinTerminalInput] = useState('');
  const winTerminalInputRef = useRef<HTMLInputElement>(null);
  const winTerminalScrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll Kali Linux terminal without scrolling viewport
  useEffect(() => {
    if (terminalScrollRef.current) {
      terminalScrollRef.current.scrollTop = terminalScrollRef.current.scrollHeight;
    }
  }, [terminalLines]);

  // Auto-scroll Windows terminal without scrolling viewport
  useEffect(() => {
    if (winTerminalScrollRef.current) {
      winTerminalScrollRef.current.scrollTop = winTerminalScrollRef.current.scrollHeight;
    }
  }, [winTerminalLines]);

  // Reset scroll to (0,0) on input focus to double-insure viewport stays locked
  const preventFocusScroll = () => {
    setTimeout(() => {
      window.scrollTo(0, 0);
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
    }, 0);
  };

  // Auto-focus inputs on state change without triggering browser window scrolling
  useEffect(() => {
    if (bootState === 'linux') {
      setTimeout(() => terminalInputRef.current?.focus({ preventScroll: true }), 100);
    } else if (bootState === 'windows') {
      setTimeout(() => winTerminalInputRef.current?.focus({ preventScroll: true }), 100);
    }
  }, [bootState]);

  // Boot transition logic
  const startBootTransition = (os: 'linux' | 'windows') => {
    setBootState(os === 'linux' ? 'booting_linux' : 'booting_windows');
    setBootLogs([]);
    
    const logs = os === 'linux' ? [
      "Initializing Linux Kernel v6.6.0-kali-amd64...",
      "Detecting hardware profiles: desktop workstation...",
      "Mounting WebGL framebuffers: OK",
      "Starting target network system initialization...",
      "Handshake: Multimedia University (Cyberjaya) Gateway... CONNECTED",
      "Activating VPN profile (IPSec Tunnel)... SECURE",
      "Ingesting routing matrix: CCNA-OSPF backbone... LOADED",
      "Launching Kali Desktop Workspace..."
    ] : [
      "Loading Windows Boot Manager...",
      "Selected boot record: Windows 11 Enterprise (Build 22621)",
      "Loading NT Kernel and Hal.dll...",
      "Initializing drivers: ethernet AX211, graphics NV-RTX...",
      "Contacting Domain Controller: MMU-CYBERJAYA.edu.my...",
      "Loading user profile: C:\\Users\\RyanLai...",
      "Setting up PowerShell network diagnostics environment...",
      "Starting Windows Terminal shell..."
    ];

    let currentLogIndex = 0;
    const interval = setInterval(() => {
      if (currentLogIndex < logs.length) {
        setBootLogs(prev => [...prev, logs[currentLogIndex]]);
        currentLogIndex++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setBootState(os);
        }, 300);
      }
    }, 150);
  };

  // Keyboard navigation for bootloader
  useEffect(() => {
    if (bootState !== 'loader') return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        setSelectedLoaderIndex(0);
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        setSelectedLoaderIndex(1);
      } else if (e.key === 'Enter') {
        startBootTransition(selectedLoaderIndex === 0 ? 'linux' : 'windows');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [bootState, selectedLoaderIndex]);

  // Nmap Scan Simulator for Kali
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

  // Kali Terminal commands interpreter
  const handleTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = terminalInput.trim().toLowerCase();
    if (!cmd) return;

    let response: string[] = [];
    switch (cmd) {
      case 'help':
        response = [
          'KALI AUDIT TOOLBOX COMMANDS:',
          '  about       - Information about Lead Security Analyst Ryan Lai Ting Hong',
          '  mmu         - Target academic training & network security degree audits',
          '  wevo        - Alignment goals & career objectives with Wevo Security',
          '  skills      - Audited tools (Wireshark, Metasploit, Nmap, C++, Python)',
          '  scan        - Execute Nmap vulnerability & sub-network scan',
          '  clear       - Wipe the active shell log buffer',
          '  reboot      - Restart computer to Boot Manager (Dual Boot)',
          '  usb / folder / phone - Inspect target hardware peripherals directly'
        ];
        break;
      case 'about':
        response = [
          '  Analyst Identity: Ryan Lai Ting Hong',
          '  Focus Area: High-Performance Network Engineering & Offensive Security (Network Fanatic)',
          '  Affiliation: Multimedia University (MMU Cyberjaya Campus)',
          '  Objective: Cyber security specialist ready to secure network assets'
        ];
        break;
      case 'mmu':
        response = [
          '  Location: Multimedia University (MMU), Cyberjaya, Malaysia',
          '  Course: Bachelor of Computer Science (Hons) - Network Security Major',
          '  Expertise: Cryptographic verification, firewall topology, high-speed routing hashes, Link Aggregation'
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
      case 'reboot':
      case 'restart':
        setBootState('loader');
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

  // Windows PowerShell commands interpreter
  const handleWinTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = winTerminalInput.trim().toLowerCase();
    if (!cmd) return;

    let response: string[] = [];
    switch (cmd) {
      case 'help':
      case 'get-command':
      case 'get-help':
        response = [
          'Custom PowerShell Cmdlets:',
          '  Get-About          - Detailed background on Ryan Lai Ting Hong',
          '  Get-MMU            - Multimedia University Cyberjaya records',
          '  Get-NetworkStats   - Real-time routing and hashing performance metrics',
          '  Get-Projects       - List of key implementations and repositories',
          '  Invoke-SubnetScan  - Execute active scanning utility',
          '  Clear-Host / cls   - Clear the shell buffer',
          '  Restart-Computer   - Reboot computer to Boot Manager (Dual Boot)',
          '  usb / folder / phone - Inspect target hardware peripherals'
        ];
        break;
      case 'get-about':
      case 'about':
        response = [
          '  Name             : Ryan Lai Ting Hong',
          '  University       : Multimedia University (MMU Cyberjaya)',
          '  Degree           : Bachelor of Computer Science (Hons) - Cybersecurity',
          '  Interest Level   : Network Fanatic / Network-Obsessed',
          '  Focus Areas      : WAN routing optimization, Link Aggregation, OSPF tuning,',
          '                     Offensive Network Audits, packet load-balancing.'
        ];
        break;
      case 'get-mmu':
      case 'mmu':
        response = [
          '  Academic Institution : Multimedia University (MMU)',
          '  Campus               : Cyberjaya, Selangor, Malaysia',
          '  Major                : CS - Cybersecurity & Network Security',
          '  Status               : Final Year Undergraduate (Open to Internship)',
          '  Thesis Work          : Hash-Based Load Balancing LAG optimization using 20 years',
          '                         of real network data (MAWI Archive).'
        ];
        break;
      case 'get-networkstats':
      case 'network':
        response = [
          '  Active Protocols  : OSPFv3 (Area 0), BGP (AS 65107), STP (802.1D)',
          '  Link Hashing      : 6-Bit & 8-Bit flow mapping metrics (Mecon3)',
          '  Average Ping      : 2ms (Gateway MMU-CYBERJAYA-CORE)',
          '  Throughput        : 10 Gbps Link Aggregation Group (LAG)',
          '  Status            : 100% Network-Crazy Obsession Active'
        ];
        break;
      case 'get-projects':
      case 'projects':
        response = [
          '  Name: Enumeration Technovation',
          '  Type: Ethical Hacking & Pen-testing (Vulnerable E-Commerce)',
          '  Repo: https://github.com/ryanhackme1207/technovation_ecommerce_vulnerable_environment',
          '',
          '  Name: Hash-Based Load Balancing LAG Analysis',
          '  Type: Network Hashing & Performance (Vite/React/WebGL desk)',
          '  Link: https://mawi.wide.ad.jp/mawi/',
          '',
          '  Name: NVRGATE Note Hub',
          '  Type: Centralized Digital Library (MMU Cyberjaya Faculty Notes)',
          '  Link: https://ryanhackme1207.github.io/NVRGATE/'
        ];
        break;
      case 'invoke-subnetscan':
      case 'scan':
        response = [
          '>> Initiating network scan via PowerShell audit script...',
          'Progress: [========================================] 100%',
          '>> SCAN COMPLETE. NO CRITICAL THREATS DISCOVERED.'
        ];
        break;
      case 'clear-host':
      case 'cls':
        setWinTerminalLines([]);
        setWinTerminalInput('');
        return;
      case 'restart-computer':
      case 'reboot':
        setBootState('loader');
        setWinTerminalInput('');
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
        response = [
          `The term '${winTerminalInput}' is not recognized as the name of a cmdlet, function, script file, or operable program.`,
          'Check the spelling of the name, or if a path was included, verify that the path is correct and try again.'
        ];
    }

    setWinTerminalLines(prev => [
      ...prev,
      `PS C:\\Users\\RyanLai> ${winTerminalInput}`,
      ...response,
      ''
    ]);
    setWinTerminalInput('');
  };

  // ==========================================
  // RENDER SCREEN DEPENDING ON BOOT STATE
  // ==========================================

  // 1. BOOT LOADER / SELECTION MENU
  if (bootState === 'loader') {
    return (
      <div className="w-full h-full bg-[#0a0f1d] flex flex-col justify-between p-8 font-mono text-[#a9b1d6] select-none border-2 border-slate-800 rounded-lg shadow-2xl relative scanlines">
        <div 
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(#00f0ff 1px, transparent 1px), linear-gradient(90deg, #00f0ff 1px, transparent 1px)`,
            backgroundSize: '20px 20px'
          }}
        />
        
        <div className="border-b border-[#00f0ff]/20 pb-4">
          <div className="flex items-center justify-between text-xs text-[#00f0ff] mb-2">
            <span>SYSTEM UEFI BOOT MANAGER v3.0</span>
            <span className="animate-pulse">● SYSTEMS NOMINAL</span>
          </div>
          <div className="text-sm font-bold text-white tracking-widest uppercase">
            Select Operating System to Boot:
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-center gap-4 my-6">
          <button
            onClick={() => startBootTransition('linux')}
            onMouseEnter={() => setSelectedLoaderIndex(0)}
            className={`group flex items-center justify-between p-4 rounded border transition-all text-left cursor-pointer focus:outline-none ${
              selectedLoaderIndex === 0 
                ? 'bg-[#8b5cf6]/10 border-[#8b5cf6] text-white shadow-[0_0_15px_rgba(139,92,246,0.25)]' 
                : 'bg-black/40 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded flex items-center justify-center border transition-all ${
                selectedLoaderIndex === 0 
                  ? 'bg-[#8b5cf6]/20 border-[#8b5cf6] text-[#8b5cf6]' 
                  : 'bg-slate-900 border-slate-700 text-slate-500'
              }`}>
                <Terminal className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold font-mono">1. KALI LINUX SEC-OS</div>
                <div className="text-[10px] text-slate-500 font-mono mt-0.5">Pentesting Workspace &amp; Offensive Security Shell</div>
              </div>
            </div>
            <span className="text-[10px] opacity-0 group-hover:opacity-100 transition-opacity text-[#8b5cf6]">&lt; ENTER TO BOOT &gt;</span>
          </button>

          <button
            onClick={() => startBootTransition('windows')}
            onMouseEnter={() => setSelectedLoaderIndex(1)}
            className={`group flex items-center justify-between p-4 rounded border transition-all text-left cursor-pointer focus:outline-none ${
              selectedLoaderIndex === 1 
                ? 'bg-[#007aff]/10 border-[#007aff] text-white shadow-[0_0_15px_rgba(0,122,255,0.25)]' 
                : 'bg-black/40 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded flex items-center justify-center border transition-all ${
                selectedLoaderIndex === 1 
                  ? 'bg-[#007aff]/20 border-[#007aff] text-[#007aff]' 
                  : 'bg-slate-900 border-slate-700 text-slate-500'
              }`}>
                <Network className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold font-mono">2. WINDOWS 11 ENTERPRISE</div>
                <div className="text-[10px] text-slate-500 font-mono mt-0.5">Network Auditing Platform &amp; PowerShell Environment</div>
              </div>
            </div>
            <span className="text-[10px] opacity-0 group-hover:opacity-100 transition-opacity text-[#007aff]">&lt; ENTER TO BOOT &gt;</span>
          </button>
        </div>

        <div className="border-t border-slate-800 pt-4 flex justify-between items-center text-[9px] text-slate-600 font-mono">
          <span>Use MOUSE hover or W/S/Arrow keys to navigate, Click or Enter to select</span>
          <span>RYANSEC-UEFI v3.0</span>
        </div>
      </div>
    );
  }

  // 2. BOOT SEQUENCE TERMINAL (OS LOADING STATE)
  if (bootState === 'booting_linux' || bootState === 'booting_windows') {
    return (
      <div className="w-full h-full bg-black flex flex-col justify-between p-8 font-mono text-[#39ff14] select-none border-2 border-slate-800 rounded-lg shadow-2xl relative scanlines">
        <div className="flex-1 flex flex-col justify-start overflow-y-auto space-y-1 text-[10px] custom-scrollbar">
          {bootLogs.map((log, idx) => (
            <div key={idx} className="flex gap-2">
              <span>[+]</span>
              <span className="uppercase">{log}</span>
            </div>
          ))}
          <div className="flex items-center gap-1.5 animate-pulse text-[#39ff14]/65">
            <span className="w-1 h-3.5 bg-[#39ff14] animate-blink"></span>
            <span>LOADING ENVIRONMENT SYSTEM MODULES...</span>
          </div>
        </div>
        <div className="border-t border-slate-950 pt-2 text-[9px] text-zinc-600 flex justify-between">
          <span>BOOT SEQUENCE ACTIVE</span>
          <span>{bootState === 'booting_linux' ? 'KERNEL: KALI-6.6.0' : 'KERNEL: NT-10.0.22621'}</span>
        </div>
      </div>
    );
  }

  // 3. WINDOWS POWERSHELL ENVIRONMENT
  if (bootState === 'windows') {
    return (
      <div className="w-full h-full bg-[#0c2447] text-[#e0e0e0] font-sans rounded-lg border-2 border-slate-800 shadow-2xl overflow-hidden flex flex-col scanlines relative select-none">
        
        {/* Windows Terminal Title Bar */}
        <div className="bg-[#1b3457] text-[#d6e4f0] h-8 px-3 flex items-center justify-between border-b border-[#007aff]/35 text-xs select-none z-10 relative">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 flex items-center justify-center text-[#00a2ed]">
              <Terminal className="w-3.5 h-3.5 text-[#00a2ed]" />
            </div>
            <span className="font-bold text-white text-[11px] font-mono">
              Windows PowerShell - Administrator: RyanLai@RYANSEC-PC
            </span>
          </div>
          
          <div className="flex items-center gap-3.5 text-[10px] font-mono">
            <span className="text-[#00a2ed]">PS C:\Users\RyanLai</span>
            <span className="text-[#3b5998]">|</span>
            <div className="flex items-center gap-2 text-zinc-400">
              <span className="text-[#39ff14] animate-pulse">● NET-ONLINE</span>
            </div>
          </div>
        </div>

        {/* PowerShell Body Layout */}
        <div className="flex-1 grid grid-cols-12 overflow-hidden z-10">
          
          {/* Console Area */}
          <div className="col-span-8 flex flex-col bg-[#0c2447] border-r border-[#007aff]/20 overflow-hidden">
            <div className="flex-1 flex flex-col overflow-hidden font-mono text-xs p-3">
              <div ref={winTerminalScrollRef} className="flex-1 overflow-y-auto custom-scrollbar text-[10px] text-[#f2f4f7] space-y-1">
                {winTerminalLines.map((line, idx) => (
                  <div key={idx} className="whitespace-pre-wrap leading-tight">
                    {line.startsWith('PS ') ? (
                      <span className="text-[#00a2ed] font-bold">{line}</span>
                    ) : line.startsWith('STATUS:') || line.startsWith('SUCCESS:') || line.includes('ACTIVE') || line.includes('CONNECTED') ? (
                      <span className="text-[#39ff14] font-bold">{line}</span>
                    ) : line.startsWith('The term ') || line.startsWith('Check the spelling') || line.startsWith('ERROR:') ? (
                      <span className="text-red-400 font-bold">{line}</span>
                    ) : (
                      line
                    )}
                  </div>
                ))}
              </div>

              {/* Input Form */}
              <div className="flex items-center border-t border-[#1b3457]/50 pt-1.5 bg-[#0c2447]">
                <span className="text-[#00a2ed] font-mono select-none text-[10px] mr-1.5 font-bold">PS C:\Users\RyanLai&gt;</span>
                <form onSubmit={handleWinTerminalSubmit} className="flex-1 flex items-center">
                  <input
                    ref={winTerminalInputRef}
                    type="text"
                    value={winTerminalInput}
                    onChange={(e) => setWinTerminalInput(e.target.value)}
                    onFocus={preventFocusScroll}
                    placeholder="Type 'help', 'Get-About', 'Get-NetworkStats'..."
                    className="flex-1 bg-transparent text-white focus:outline-none py-1 placeholder-white/20 text-[10px] font-mono"
                  />
                  <button 
                    type="submit" 
                    className="px-3 py-1 bg-[#007aff]/15 hover:bg-[#007aff]/30 text-[#00a2ed] transition-colors border-l border-[#007aff]/20 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* PowerShell Sidebar */}
          <div className="col-span-4 flex flex-col bg-[#081b37] overflow-hidden justify-between p-4">
            <div>
              <div className="flex items-center justify-between border-b border-[#00a2ed]/45 pb-1.5 mb-3">
                <span className="text-xs font-bold font-mono tracking-widest text-[#00a2ed]">AUDITING PANEL</span>
                <Activity className="w-4 h-4 text-[#00a2ed] animate-pulse" />
              </div>
              
              <div className="space-y-2 font-mono text-[9px] text-zinc-300">
                <div className="p-2 border border-[#007aff]/20 bg-[#06142c] rounded">
                  <div className="text-zinc-500 uppercase text-[7px]">Target OS:</div>
                  <div className="text-white font-bold">Windows 11 Enterprise</div>
                </div>
                <div className="p-2 border border-[#007aff]/20 bg-[#06142c] rounded">
                  <div className="text-zinc-500 uppercase text-[7px]">Network Adapter:</div>
                  <div className="text-white font-bold">Intel Wi-Fi 6E (192.168.1.107)</div>
                </div>
                <div className="p-2 border border-[#007aff]/20 bg-[#06142c] rounded">
                  <div className="text-zinc-500 uppercase text-[7px]">Active Subnet Hashing:</div>
                  <div className="text-[#39ff14] font-bold">OSPF Area 0 Link balancing</div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-col gap-2 mt-4 pt-3 border-t border-[#007aff]/15">
              <button 
                onClick={() => startBootTransition('linux')} 
                className="w-full py-1.5 px-3 bg-[#8b5cf6]/10 border border-[#8b5cf6]/35 hover:bg-[#8b5cf6]/20 text-[#8b5cf6] rounded transition-colors text-center text-[9px] font-mono font-bold cursor-pointer"
              >
                BOOT TO KALI LINUX
              </button>
              <button 
                onClick={() => setBootState('loader')} 
                className="w-full py-1.5 px-3 bg-red-500/10 border border-red-500/35 hover:bg-red-500/20 text-red-400 rounded transition-colors text-center text-[9px] font-mono font-bold cursor-pointer"
              >
                REBOOT COMPUTER (GRUB)
              </button>
            </div>
          </div>

        </div>

        {/* Windows Footer */}
        <div className="bg-[#081932] px-4 py-2 flex items-center justify-center border-t border-[#007aff]/25 text-[10px] font-mono text-center text-[#00a2ed]">
          <span>[Win11 Powershell Audit - Press ESC to return to Analyst Desk]</span>
        </div>

      </div>
    );
  }

  // 4. KALI LINUX ENVIRONMENT (EXISTING SYSTEM)
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
          <span className="text-cyan-400">kali@ryansec-workstation</span>
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
              <span>kali@ryansec-workstation</span>
            </div>
            
            {/* Terminal Screen lines */}
            <div ref={terminalScrollRef} className="flex-1 p-3 overflow-y-auto custom-scrollbar text-[10px] text-[#c0caf5] space-y-1">
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
                  onFocus={() => {
                    const x = window.scrollX;
                    const y = window.scrollY;
                    window.onscroll = () => window.scrollTo(x, y);
                    setTimeout(() => { window.onscroll = null; }, 100);
                  }}
                  placeholder="Type 'help', 'about', 'wevo', 'skills'..."
                  className="flex-1 bg-transparent text-white focus:outline-none px-2 py-1 placeholder-white/20 text-[10px] font-mono"
                />
                <button 
                  type="submit" 
                  className="px-3 py-1 bg-cyan-500/10 hover:bg-cyan-500/25 border-l border-cyan-500/20 text-cyan-400 transition-colors cursor-pointer"
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
                onClick={() => startBootTransition('windows')}
                className="w-full flex items-center justify-between p-2 border border-cyan-500/10 bg-[#161a22] rounded hover:border-[#007aff]/45 hover:bg-[#007aff]/5 transition-all text-left cursor-pointer focus:outline-none"
              >
                <span className="text-zinc-300">01. Boot Windows</span>
                <span className="text-[#00a2ed] font-bold">READY</span>
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
                <div className="text-green-400">• Host verification requested by RYANSEC-PC</div>
                <div className="text-cyan-400">• Handshake refreshed with MMU gateway router</div>
                <div className="text-zinc-400">• Active logs segmenting OSPF area network bounds</div>
                <div className="text-green-400">• Security audit log initialized on 192.168.1.107</div>
                <div className="text-zinc-400">• VPN tunnel integrity check completed successfully</div>
                <div className="text-cyan-400">• Hashing simulation logs exported to master folder</div>
              </div>
            </div>

            {/* Quick Actions Panel */}
            <div className="flex gap-1.5 text-[9px] font-mono justify-end mt-2 pt-2 border-t border-cyan-500/10">
              <button onClick={() => setBootState('loader')} className="px-1.5 py-0.5 bg-red-500/10 border border-red-400/30 hover:bg-red-500/20 text-red-400 rounded transition-colors cursor-pointer">REBOOT</button>
              <button onClick={() => onNavigate('usb')} className="px-1.5 py-0.5 bg-green-500/10 border border-green-400/30 hover:bg-green-500/20 text-green-400 rounded transition-colors cursor-pointer">USB KEY</button>
              <button onClick={() => onNavigate('folder')} className="px-1.5 py-0.5 bg-cyan-500/10 border border-cyan-400/30 hover:bg-cyan-500/20 text-cyan-400 rounded transition-colors cursor-pointer">DOSSIER</button>
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

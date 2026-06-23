import React, { useState, useEffect, useRef } from 'react';
import { Key, ShieldCheck, X, Folder, ExternalLink, Network, Shield, Terminal, Code, Cpu, Mail, Phone as PhoneIcon, Linkedin, Send, Radio, Lock, Wifi, Battery, Unlock, MessageSquare, Compass, ChevronLeft } from 'lucide-react';
import type { Project } from '../types';

// ==========================================
// 1. USB OVERLAY (SKILLS & CERTIFICATIONS)
// ==========================================
interface USBOverlayProps {
  onClose: () => void;
}

export const USBOverlay: React.FC<USBOverlayProps> = ({ onClose }) => {
  const categories = [
    {
      title: "Network Engineering",
      color: "border-cyber-neonPurple text-cyber-neonPurple",
      skills: [
        { name: "OSI 7-Layer & Subnetting", level: 90 },
        { name: "OSPF, BGP & STP routing", level: 85 },
        { name: "IPSec VPN & ACL rulesets", level: 82 },
        { name: "Firewall & Switches Config", level: 88 }
      ]
    },
    {
      title: "Ethical Hacking",
      color: "border-cyber-neonGreen text-cyber-neonGreen",
      skills: [
        { name: "OWASP Top 10 Vulnerabilities", level: 85 },
        { name: "Kali Linux / Parrot OS pentest", level: 82 },
        { name: "Nmap & Wireshark log audits", level: 90 },
        { name: "Metasploit & SQLMap validation", level: 78 }
      ]
    },
    {
      title: "Security & Compliance",
      color: "border-cyber-purple text-cyber-purple",
      skills: [
        { name: "ISO 27001 & CIA Triad Audit", level: 75 },
        { name: "Incident Response Procedures", level: 80 },
        { name: "PDPA & GDPR framework compliance", level: 85 },
        { name: "PCI-DSS security architecture", level: 70 }
      ]
    }
  ];

  return (
    <div className="absolute inset-0 bg-cyber-bg/85 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="w-full max-w-3xl cyber-panel-purple p-6 bg-cyber-dark/95 border-2 border-cyber-neonPurple max-h-[90vh] overflow-y-auto custom-scrollbar scanlines">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-cyber-neonPurple/30 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <Key className="w-6 h-6 text-cyber-neonPurple animate-pulse" />
            <div>
              <h2 className="text-xl font-bold tracking-wider text-cyber-heading font-mono text-gradient">ENCRYPTED_USB_KEY://DECRYPTED</h2>
              <p className="text-xs text-cyber-text/50 font-mono">VLAN SECURE AUDIT - RYAN LAI TING HONG SKILL MATRIX</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 border border-cyber-neonPurple/30 hover:border-cyber-neonGreen bg-cyber-neonPurple/5 hover:bg-cyber-neonGreen/10 rounded transition-all text-cyber-neonPurple hover:text-cyber-neonGreen group cursor-pointer"
          >
            <X className="w-5 h-5 group-hover:rotate-90 transition-transform" />
          </button>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="space-y-6 md:col-span-2">
            {categories.map((cat, idx) => (
              <div key={idx} className={`border-l-2 pl-4 py-1 space-y-4 ${cat.color.split(' ')[0]}`}>
                <h3 className={`text-md font-bold uppercase tracking-wider font-mono ${cat.color.split(' ')[1]}`}>
                  {cat.title}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {cat.skills.map((skill, sIdx) => (
                    <div key={sIdx} className="space-y-1.5">
                      <div className="flex justify-between text-xs font-mono text-cyber-text/90">
                        <span>{skill.name}</span>
                        <span className="font-semibold text-cyber-neonGreen">{skill.level}%</span>
                      </div>
                      <div className="w-full bg-cyber-dark/80 border border-cyber-neonPurple/15 h-2 rounded overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-cyber-neonPurple to-cyber-neonGreen h-full rounded transition-all duration-1000" 
                          style={{ width: `${skill.level}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="md:col-span-2 mt-2 p-4 bg-cyber-dark border border-cyber-neonPurple/20 rounded font-mono text-xs space-y-4">
            <div className="flex items-center gap-2 text-cyber-neonGreen font-bold border-b border-cyber-neonPurple/20 pb-2">
              <ShieldCheck className="w-4 h-4" /> VERIFIED CISCO & CREDLY BADGES:
            </div>
            <div className="flex flex-wrap justify-center gap-6 py-2">
              <div className="flex flex-col items-center bg-black/40 p-3 rounded border border-cyber-neonPurple/15 text-center gap-2 w-[180px]">
                <iframe 
                  src="https://www.credly.com/embedded_badge/28f53370-7e66-464c-b4cb-ce9008d98bce" 
                  width="150" 
                  height="270" 
                  frameBorder="0" 
                  scrolling="no" 
                  title="Ethical Hacking Certification"
                />
                <div className="text-[10px] text-cyber-heading font-bold mt-1">Ethical Hacking</div>
                <div className="text-[9px] text-cyber-text/50">Cisco / Credly</div>
              </div>
              <div className="flex flex-col items-center bg-black/40 p-3 rounded border border-cyber-neonPurple/15 text-center gap-2 w-[180px]">
                <iframe 
                  src="https://www.credly.com/embedded_badge/012cdd0d-8a3b-4d62-8b67-5572922723a7" 
                  width="150" 
                  height="270" 
                  frameBorder="0" 
                  scrolling="no" 
                  title="Cybersecurity Certification"
                />
                <div className="text-[10px] text-cyber-heading font-bold mt-1">Cybersecurity</div>
                <div className="text-[9px] text-cyber-text/50">Cisco / Credly</div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-cyber-text/85 leading-relaxed text-[11px] border-t border-cyber-neonPurple/20 pt-3">
              <div>
                • <strong className="text-cyber-heading">MMU CS Cybersecurity Major:</strong> Studying OSPF/BGP WAN structures, Incident Response, and Pentesting at Multimedia University (Cyberjaya).
              </div>
              <div>
                • <strong className="text-cyber-heading">Practical Vulnerability Audits:</strong> Hands-on experience with OWASP Top 10 threat simulation, SIEM parsing, and ACL rule hardening.
              </div>
            </div>
          </div>

        </div>

        {/* Back Button */}
        <div className="flex justify-end mt-6 border-t border-cyber-neonPurple/20 pt-4">
          <button 
            onClick={onClose}
            className="cyber-button-purple"
          >
            DISCONNECT KEY
          </button>
        </div>

      </div>
    </div>
  );
};


// ==========================================
// 2. FOLDER OVERLAY (PROJECTS PORTFOLIO)
// ==========================================
interface FolderOverlayProps {
  onClose: () => void;
}

export const FolderOverlay: React.FC<FolderOverlayProps> = ({ onClose }) => {
  const [selectedIdx, setSelectedIdx] = useState<number>(0);

  const projects: Project[] = [
    {
      title: "Enumeration Technovation",
      category: "Ethical Hacking & Penetration Testing",
      description: "Built a complete, fully-functioning fake e-commerce website with deliberate security flaws to simulate a real-world company server, then successfully compromised the environment using Kali Linux tooling to identify vulnerability fixes.",
      tags: ["Kali Linux", "OWASP Top 10", "SQLMap", "Vulnerability Remediation"],
      details: [
        "Constructed a database-driven target web server mimicking realistic transaction layers.",
        "Conducted pen-testing audits uncovering hidden SQL injections, cross-site script risks, and Auth vulnerabilities.",
        "Documented exploit remediation actions, locking down the vulnerable inputs and API routes.",
        "Demonstrated the critical mindset needed to counter real-world threat actors."
      ],
      github: "https://github.com/ryanhackme1207/technovation_ecommerce_vulnerable_environment.git"
    },
    {
      title: "Hash-Based Load Balancing LAG Analysis",
      category: "Network Engineering & Performance Audit",
      description: "Final Year Project: analyzed 20 years of real-world internet traffic data (over 400 packet captures from the MAWI Archive) to optimize and test hash-sorting algorithm load balancing for high-speed hardware routers.",
      tags: ["OSPF/BGP", "Cisco & Juniper", "Algorithm Performance", "Packet Analysis"],
      details: [
        "Analyzed massive traffic captures to map packets and measure port/bin collision rates.",
        "Compared 6-bit and 8-bit hash mappings to optimize link aggregation group (LAG) load distributions.",
        "Created simulation datasets detailing OSPF WAN traffic splits.",
        "Derived performance indicators ensuring minimal latency and path jitter on enterprise scale links."
      ],
      github: "https://mawi.wide.ad.jp/mawi/"
    },
    {
      title: "NVRGATE Note Hub",
      category: "Web Engineering & Educational Archiving",
      description: "Programmed and launched a centralized digital library resource platform for MMU Cyberjaya student lecture materials, safeguarding academic knowledge from faculty deletion over time.",
      tags: ["HTML5", "CSS3", "JavaScript", "Centralized Storage"],
      details: [
        "Developed a responsive multi-faculty study deck interface.",
        "Connected persistent document storage enabling student note downloads.",
        "Mitigated data loss by backing up academic materials for multiple faculties.",
        "Launched the platform live to the student body."
      ],
      link: "https://ryanhackme1207.github.io/NVRGATE/"
    }
  ];

  const activeProject = projects[selectedIdx];

  return (
    <div className="absolute inset-0 bg-cyber-bg/85 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="w-full max-w-4xl cyber-panel-purple p-6 bg-cyber-dark/95 border-2 border-cyber-neonPurple max-h-[90vh] overflow-hidden flex flex-col scanlines">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-cyber-neonPurple/30 pb-4 mb-4 flex-shrink-0">
          <div className="flex items-center gap-3">
            <Folder className="w-6 h-6 text-cyber-neonPurple animate-pulse" />
            <div>
              <h2 className="text-xl font-bold tracking-wider text-cyber-heading font-mono text-gradient">DOSSIER_ARCHIVE://PROJECT_FILES</h2>
              <p className="text-xs text-cyber-text/50 font-mono">INTELLIGENCE BRIEFING ON RYAN LAI TING HONG PROJECTS</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 border border-cyber-neonPurple/30 hover:border-cyber-neonGreen bg-cyber-neonPurple/5 hover:bg-cyber-neonGreen/10 rounded transition-all text-cyber-neonPurple hover:text-cyber-neonGreen group cursor-pointer"
          >
            <X className="w-5 h-5 group-hover:rotate-90 transition-transform" />
          </button>
        </div>

        {/* Project Layout Split */}
        <div className="flex-1 grid grid-cols-12 gap-5 overflow-hidden">
          
          {/* Project List Sidebar (Deep Purple Folder Indices) */}
          <div className="col-span-12 md:col-span-4 flex flex-col gap-2 overflow-y-auto custom-scrollbar pr-1">
            <span className="text-[10px] font-mono text-cyber-text/40 uppercase tracking-widest px-2 mb-1">Index Files</span>
            {projects.map((p, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedIdx(idx)}
                className={`w-full p-3 rounded text-left border font-mono text-xs transition-all flex flex-col gap-1 cursor-pointer ${
                  selectedIdx === idx 
                    ? 'bg-cyber-neonPurple/15 border-cyber-neonPurple text-cyber-neonPurple shadow-glow-purple' 
                    : 'bg-cyber-dark/50 border-cyber-neonPurple/20 text-cyber-text/70 hover:bg-cyber-neonPurple/5 hover:text-cyber-heading'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold truncate">
                  {idx === 0 || idx === 1 ? <Network className="w-3.5 h-3.5 text-cyber-neonGreen" /> : idx === 2 ? <Shield className="w-3.5 h-3.5 text-cyber-neonGreen" /> : <Terminal className="w-3.5 h-3.5 text-cyber-neonGreen" />}
                  PROJECT_{idx + 1}
                </div>
                <div className="truncate text-[10px] text-cyber-text/55">{p.title}</div>
              </button>
            ))}
          </div>

          {/* Active Project Viewer */}
          <div className="col-span-12 md:col-span-8 flex flex-col justify-between overflow-y-auto custom-scrollbar bg-cyber-dark/40 border border-cyber-neonPurple/10 rounded p-4 gap-4">
            
            <div className="space-y-3">
              {/* Title & Category */}
              <div>
                <span className="text-[10px] font-mono bg-cyber-neonPurple/15 text-cyber-neonGreen border border-cyber-neonGreen/30 px-2 py-0.5 rounded uppercase">
                  {activeProject.category}
                </span>
                <h3 className="text-md md:text-lg font-bold text-cyber-heading tracking-wide mt-2 font-mono text-gradient">
                  {activeProject.title}
                </h3>
              </div>

              {/* Description */}
              <p className="text-xs text-cyber-text leading-relaxed font-sans bg-cyber-dark/60 p-3 border border-cyber-neonPurple/5 rounded">
                {activeProject.description}
              </p>

              {/* Tech Tags */}
              <div className="flex flex-wrap gap-1.5">
                {activeProject.tags.map((t, idx) => (
                  <span key={idx} className="flex items-center gap-1 text-[9px] font-mono bg-cyber-dark/80 text-cyber-neonGreen border border-cyber-neonGreen/20 px-2 py-0.5 rounded animate-pulse-slow">
                    <Code className="w-2.5 h-2.5" /> {t}
                  </span>
                ))}
              </div>

              {/* Bullet Details */}
              <div className="space-y-1.5 font-mono text-[11px] text-cyber-text/85">
                <div className="font-bold text-cyber-heading text-xs mb-2 uppercase tracking-wide border-b border-cyber-neonPurple/10 pb-0.5">TECHNICAL BULLET BRIEF:</div>
                {activeProject.details.map((detail, idx) => (
                  <div key={idx} className="flex items-start gap-1.5">
                    <span className="text-cyber-neonPurple mt-0.5 flex-shrink-0">▶</span>
                    <span>{detail}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Links */}
            <div className="flex gap-3 border-t border-cyber-neonPurple/10 pt-4 flex-shrink-0">
              {activeProject.github && (
                <a 
                  href={activeProject.github} 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center gap-1.5 text-xs font-mono text-cyber-neonPurple bg-cyber-neonPurple/5 hover:bg-cyber-neonPurple/15 border border-cyber-neonPurple/30 px-3 py-1.5 rounded transition-all hover:shadow-glow-purple"
                >
                  <Cpu className="w-3.5 h-3.5" /> REPO ARCHIVE <ExternalLink className="w-3 h-3" />
                </a>
              )}
              {activeProject.link && (
                <a 
                  href={activeProject.link} 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center gap-1.5 text-xs font-mono text-cyber-neonGreen bg-cyber-neonGreen/5 hover:bg-cyber-neonGreen/15 border border-cyber-neonGreen/30 px-3 py-1.5 rounded transition-all hover:shadow-glow-green"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> LIVE SERVER <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>

          </div>

        </div>

        {/* Back Button */}
        <div className="flex justify-end mt-4 border-t border-cyber-neonPurple/20 pt-4 flex-shrink-0">
          <button 
            onClick={onClose}
            className="cyber-button-purple"
          >
            DISMISS DOSSIER
          </button>
        </div>

      </div>
    </div>
  );
};


// ==========================================
// 3. PHONE OVERLAY (CONTACT LINKS & INTERACTIVE SEND)
// ==========================================
interface PhoneOverlayProps {
  onClose: () => void;
}

export const PhoneOverlay: React.FC<PhoneOverlayProps> = ({ onClose }) => {
  const [iosScreen, setIosScreen] = useState<'lock' | 'home' | 'messages' | 'terminal'>('lock');
  const [timeStr, setTimeStr] = useState('13:06');
  const [dateStr, setDateStr] = useState('Monday, June 22');
  
  // Chat chatbot state
  const [chatMessages, setChatMessages] = useState<{ id: string; sender: 'incoming' | 'outgoing' | 'system'; text: string }[]>([
    { id: '1', sender: 'incoming', text: "Hello! Secure end-to-end encrypted connection established." },
    { id: '2', sender: 'incoming', text: "To transmit a secure message to my network, please enter your name." }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [chatStep, setChatStep] = useState(0); // 0: name, 1: email, 2: message, 3: sending simulation, 4: complete
  const [visitorName, setVisitorName] = useState('');
  const [visitorEmail, setVisitorEmail] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Terminal state
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    "LTH SecOS v14.2.1-RELEASE (tty0)",
    "Secure Shell handshake established.",
    "Type 'help' for a list of available host commands.",
    ""
  ]);
  const [terminalInput, setTerminalInput] = useState('');
  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Update clock
  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      const hrs = String(d.getHours()).padStart(2, '0');
      const mins = String(d.getMinutes()).padStart(2, '0');
      setTimeStr(`${hrs}:${mins}`);
      
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      setDateStr(`${days[d.getDay()]}, ${months[d.getMonth()]} ${d.getDate()}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  // Scroll chats to bottom
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isTyping, iosScreen]);

  // Scroll terminal to bottom
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [terminalLogs, iosScreen]);

  const handleSendChat = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputValue.trim()) return;

    const userText = inputValue;
    setInputValue('');

    // Add user's outgoing message
    setChatMessages(prev => [...prev, { id: String(Date.now()), sender: 'outgoing', text: userText }]);

    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      
      if (chatStep === 0) {
        setVisitorName(userText);
        setChatMessages(prev => [
          ...prev, 
          { id: String(Date.now() + 1), sender: 'incoming', text: `Thanks, ${userText}. Now, please enter your email address so I can get back to you.` }
        ]);
        setChatStep(1);
      } else if (chatStep === 1) {
        // Simple email validator regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(userText)) {
          setChatMessages(prev => [
            ...prev, 
            { id: String(Date.now() + 1), sender: 'incoming', text: "Hmm, that email doesn't look valid. Please enter a valid return email address." }
          ]);
          return;
        }
        setVisitorEmail(userText);
        setChatMessages(prev => [
          ...prev, 
          { id: String(Date.now() + 1), sender: 'incoming', text: "Email registered. Please type your secure message payload." }
        ]);
        setChatStep(2);
      } else if (chatStep === 2) {
        setChatMessages(prev => [
          ...prev,
          { id: String(Date.now() + 1), sender: 'system', text: ">> INITIALIZING SECURE PACKET CONVERSION..." },
          { id: String(Date.now() + 2), sender: 'system', text: ">> APPLYING AES-256 ENCRYPTION SCHEME..." },
          { id: String(Date.now() + 3), sender: 'system', text: ">> ROUTING VIA IPSEC VPN GATEWAY (192.168.99.1)..." },
          { id: String(Date.now() + 4), sender: 'system', text: ">> STATUS 202 - MESSAGE IN QUEUE." }
        ]);
        setChatStep(3);
        
        setTimeout(() => {
          setChatMessages(prev => [
            ...prev,
            { id: String(Date.now() + 5), sender: 'incoming', text: `Message transmitted! Your packet has been securely sealed. Ryan Lai Ting Hong will receive your ping shortly. We will reply to your address at ${visitorEmail}. Thank you, ${visitorName || 'guest'}!` }
          ]);
          setChatStep(4);
        }, 1500);
      }
    }, 1200);
  };

  const handleResetChat = () => {
    setChatMessages([
      { id: '1', sender: 'incoming', text: "Hello! Secure end-to-end encrypted connection established." },
      { id: '2', sender: 'incoming', text: "To transmit a secure message to my network, please enter your name." }
    ]);
    setChatStep(0);
    setVisitorName('');
    setVisitorEmail('');
    setInputValue('');
  };

  const handleTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!terminalInput.trim()) return;

    const cmd = terminalInput.trim().toLowerCase();
    setTerminalInput('');
    setTerminalLogs(prev => [...prev, `lth-user@secos:~$ ${cmd}`]);

    setTimeout(() => {
      if (cmd === 'help') {
        setTerminalLogs(prev => [
          ...prev,
          "Available commands:",
          "  help     - Display host documentation index",
          "  skills   - List Ryan Lai Ting Hong's core skills",
          "  status   - Show environment networking details",
          "  exploit  - Execute simulated system test",
          "  clear    - Clear console buffers",
          "  exit     - Exit shell"
        ]);
      } else if (cmd === 'clear') {
        setTerminalLogs([]);
      } else if (cmd === 'skills') {
        setTerminalLogs(prev => [
          ...prev,
          "Network Security:",
          "  - OSPF, BGP, STP, VLAN routing rulesets",
          "  - IPSec VPN, SSL, TLS tunnel negotiation",
          "Ethical Hacking:",
          "  - OWASP Top 10 web vulnerabilities",
          "  - Kali Linux pentests & Wireshark logs analysis",
          "Compliance:",
          "  - ISO 27001, PDPA, CIA triad policy guidelines"
        ]);
      } else if (cmd === 'status') {
        setTerminalLogs(prev => [
          ...prev,
          "OS Version  : SecOS v14.2.1-RELEASE",
          "VLAN IP     : 192.168.99.2",
          "VPN Status  : Connected (IPSec tunnel active)",
          "Uptime      : 42m 12s",
          "CPU Load    : 4.8%"
        ]);
      } else if (cmd === 'exit') {
        setIosScreen('home');
      } else if (cmd === 'exploit') {
        setTerminalLogs(prev => [...prev, ">> PINGING EXPLOIT HOST GATEWAY...", ">> INJECTING BUFFER OVERFLOW BUFFER (0x41414141)..."]);
        setTimeout(() => {
          setTerminalLogs(prev => [
            ...prev,
            ">> BYPASSING STACK OVERFLOW CANARIES...",
            ">> STAGE-1 PAYLOAD DEPLOYED AT MEMORY 0x00FF8C12...",
            ">> ROOT SECURITY ACCESS GRANTED! SYSTEM DISRUPTED."
          ]);
        }, 1000);
      } else {
        setTerminalLogs(prev => [...prev, `secos: command not found: ${cmd}`]);
      }
    }, 150);
  };

  const handleHomeBtnClick = () => {
    if (iosScreen === 'lock') {
      setIosScreen('home');
    } else {
      setIosScreen('home');
    }
  };

  return (
    <div className="absolute inset-0 bg-[#090610]/85 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in font-sans selection:bg-[#007aff]/30">
      
      {/* Outer Phone Bezel Structure (Titanium iPhone Design) */}
      <div className="w-[370px] h-[670px] bg-[#1c1c1e] border-[8px] border-[#d1d5db] rounded-[48px] shadow-[0_0_50px_rgba(0,122,255,0.25)] overflow-hidden flex flex-col relative">
        
        {/* Dynamic Island Notch */}
        <div className="absolute top-2.5 left-1/2 transform -translate-x-1/2 w-28 h-6 bg-black rounded-full z-30 flex items-center justify-between px-3 text-[9px] text-[#00ff66] font-mono select-none">
          <div className="w-1.5 h-1.5 rounded-full bg-[#1c1c1e] border border-zinc-700"></div>
          {iosScreen === 'messages' && <span className="animate-pulse flex items-center gap-0.5"><div className="w-1 h-1 rounded-full bg-green-500"></div> iMessage</span>}
          {iosScreen === 'terminal' && <span className="animate-pulse flex items-center gap-0.5"><div className="w-1 h-1 rounded-full bg-red-500"></div> shell</span>}
          {iosScreen === 'home' && <span className="text-zinc-500">SecOS</span>}
          {iosScreen === 'lock' && <Lock className="w-2.5 h-2.5 text-zinc-500" />}
          <div className="w-2 h-2 rounded-full bg-zinc-900 flex justify-center items-center">
            <div className="w-0.5 h-0.5 rounded-full bg-blue-900"></div>
          </div>
        </div>

        {/* Top Status Bar Inside Screen */}
        <div className="h-10 bg-transparent flex justify-between items-end px-6 pb-1 select-none z-20 text-white font-medium text-xs">
          <span>{timeStr}</span>
          <div className="flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-white/90 animate-pulse" />
            <span className="text-[10px] tracking-tighter">5G</span>
            <Wifi className="w-3.5 h-3.5 text-white/90" />
            <Battery className="w-4 h-4 text-white/95" />
          </div>
        </div>

        {/* Main Display Area */}
        <div className="flex-1 relative overflow-hidden select-none">
          
          {/* ========================================== */}
          {/*   LOCK SCREEN SCREEN                       */}
          {/* ========================================== */}
          {iosScreen === 'lock' && (
            <div 
              onClick={() => setIosScreen('home')}
              className="absolute inset-0 bg-gradient-to-b from-[#180e29] via-[#3b1754] to-[#120a1f] flex flex-col items-center justify-between p-6 cursor-pointer text-center animate-fade-in"
            >
              <div className="w-full flex flex-col items-center mt-6">
                <div className="flex items-center gap-1 mb-2 text-white/60">
                  <Lock className="w-3.5 h-3.5" />
                  <span className="text-[10px] uppercase tracking-widest font-semibold">Sealed Connection</span>
                </div>
                <span className="text-white/60 text-xs font-semibold uppercase tracking-wider">{dateStr}</span>
                <span className="text-white/90 font-light text-5xl tracking-wide my-1.5">{timeStr}</span>
              </div>

              {/* Glassmorphic Notification Widget */}
              <div className="w-full max-w-[300px] bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-3 text-left shadow-lg transition-transform hover:scale-[1.02] cursor-pointer flex flex-col gap-1.5">
                <div className="flex justify-between items-center text-[10px] text-white/50 font-semibold">
                  <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3 text-[#34c759]" /> MESSAGES</span>
                  <span>now</span>
                </div>
                <div className="text-xs font-bold text-white/95">Ryan Lai Ting Hong</div>
                <div className="text-xs text-white/70 leading-snug">Secure handshake established. Tap to open communications tunnel.</div>
              </div>

              <div className="w-full flex flex-col items-center gap-1 mb-4 select-none animate-bounce">
                <Unlock className="w-4 h-4 text-white/40" />
                <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Tap Screen to Unlock</span>
              </div>
            </div>
          )}

          {/* ========================================== */}
          {/*   HOME SCREEN                              */}
          {/* ========================================== */}
          {iosScreen === 'home' && (
            <div 
              className="absolute inset-0 bg-gradient-to-b from-[#150d24] via-[#200f3e] to-[#0f091a] flex flex-col justify-between p-6 animate-fade-in"
            >
              {/* App Grid */}
              <div className="grid grid-cols-4 gap-y-6 gap-x-4 mt-6">
                {/* Messages */}
                <button 
                  onClick={() => setIosScreen('messages')}
                  className="flex flex-col items-center gap-1.5 cursor-pointer focus:outline-none"
                >
                  <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-[#2ecc71] to-[#27ae60] flex items-center justify-center shadow-lg shadow-green-950/20 active:scale-90 transition-transform">
                    <MessageSquare className="w-7 h-7 text-white" />
                  </div>
                  <span className="text-[10px] text-white/80 font-medium tracking-tight">Messages</span>
                </button>

                {/* Terminal */}
                <button 
                  onClick={() => setIosScreen('terminal')}
                  className="flex flex-col items-center gap-1.5 cursor-pointer focus:outline-none"
                >
                  <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-[#2c3e50] to-[#1a252f] border border-zinc-800 flex items-center justify-center shadow-lg active:scale-90 transition-transform">
                    <Terminal className="w-6.5 h-6.5 text-[#39ff14]" />
                  </div>
                  <span className="text-[10px] text-white/80 font-medium tracking-tight">Terminal</span>
                </button>

                {/* Safari (GitHub) */}
                <a 
                  href="https://github.com/ryanhackme" 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex flex-col items-center gap-1.5 focus:outline-none"
                >
                  <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-[#3498db] to-[#2980b9] flex items-center justify-center shadow-lg active:scale-90 transition-transform">
                    <Compass className="w-7 h-7 text-white" />
                  </div>
                  <span className="text-[10px] text-white/80 font-medium tracking-tight">Safari</span>
                </a>

                {/* LinkedIn */}
                <a 
                  href="https://linkedin.com/in/lai-ting-hong" 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex flex-col items-center gap-1.5 focus:outline-none"
                >
                  <div className="w-13 h-13 rounded-2xl bg-[#0077b5] flex items-center justify-center shadow-lg active:scale-90 transition-transform">
                    <Linkedin className="w-7 h-7 text-white" />
                  </div>
                  <span className="text-[10px] text-white/80 font-medium tracking-tight">LinkedIn</span>
                </a>

                {/* Direct Mail */}
                <a 
                  href="mailto:ryan.cyber.work@gmail.com" 
                  className="flex flex-col items-center gap-1.5 focus:outline-none"
                >
                  <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-[#e74c3c] to-[#c0392b] flex items-center justify-center shadow-lg active:scale-90 transition-transform">
                    <Mail className="w-6.5 h-6.5 text-white" />
                  </div>
                  <span className="text-[10px] text-white/80 font-medium tracking-tight">Mail</span>
                </a>

                {/* Direct Phone */}
                <a 
                  href="tel:+601112248122" 
                  className="flex flex-col items-center gap-1.5 focus:outline-none"
                >
                  <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-[#2ecc71] to-[#27ae60] flex items-center justify-center shadow-lg active:scale-90 transition-transform">
                    <PhoneIcon className="w-6.5 h-6.5 text-white" />
                  </div>
                  <span className="text-[10px] text-white/80 font-medium tracking-tight">Phone</span>
                </a>
              </div>

              {/* Bottom iOS frosted glass dock containing quick launch */}
              <div className="w-full bg-white/10 backdrop-blur-xl border border-white/15 rounded-3xl p-3 flex justify-around items-center shadow-2xl mb-2">
                <button 
                  onClick={() => setIosScreen('messages')} 
                  className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#2ecc71] to-[#27ae60] flex items-center justify-center active:scale-95 transition-transform"
                >
                  <MessageSquare className="w-6 h-6 text-white" />
                </button>
                <button 
                  onClick={() => setIosScreen('terminal')}
                  className="w-12 h-12 rounded-xl bg-black border border-zinc-800 flex items-center justify-center active:scale-95 transition-transform"
                >
                  <Terminal className="w-6 h-6 text-[#39ff14]" />
                </button>
                <a 
                  href="https://github.com/ryanhackme" 
                  target="_blank" 
                  rel="noreferrer"
                  className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#3498db] to-[#2980b9] flex items-center justify-center active:scale-95 transition-transform"
                >
                  <Compass className="w-6.5 h-6.5 text-white" />
                </a>
                <a 
                  href="mailto:ryan.cyber.work@gmail.com"
                  className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#e74c3c] to-[#c0392b] flex items-center justify-center active:scale-95 transition-transform"
                >
                  <Mail className="w-6 h-6 text-white" />
                </a>
              </div>
            </div>
          )}

          {/* ========================================== */}
          {/*   MESSAGES APP (IMESSAGE STYLE CHATBOT)    */}
          {/* ========================================== */}
          {iosScreen === 'messages' && (
            <div className="absolute inset-0 bg-black flex flex-col animate-fade-in text-white">
              
              {/* iMessage Header */}
              <div className="h-14 bg-[#121212] border-b border-zinc-800 flex items-center justify-between px-3 z-10">
                <button 
                  onClick={() => setIosScreen('home')}
                  className="flex items-center text-[#0b84ff] text-xs font-semibold cursor-pointer"
                >
                  <ChevronLeft className="w-5 h-5 -ml-1.5" /> Home
                </button>
                <div className="flex flex-col items-center">
                  <div className="w-6 h-6 rounded-full bg-zinc-700 flex items-center justify-center text-[10px] font-bold text-white select-none">
                    RL
                  </div>
                  <span className="text-[10px] font-bold text-zinc-300 mt-0.5">Ryan Lai Ting Hong</span>
                </div>
                <div className="w-10 h-1"></div> {/* spacer */}
              </div>

              {/* Chat Thread */}
              <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-3 flex flex-col">
                <div className="text-[9px] text-zinc-500 text-center uppercase tracking-widest my-2 select-none">iMessage • End-to-End Encrypted</div>
                
                {chatMessages.map((msg) => (
                  <div 
                    key={msg.id}
                    className={`max-w-[75%] px-3.5 py-2 rounded-2xl text-xs font-sans whitespace-pre-wrap leading-relaxed select-text ${
                      msg.sender === 'incoming' 
                        ? 'self-start bg-[#262629] text-white rounded-tl-sm' 
                        : msg.sender === 'outgoing' 
                        ? 'self-end bg-[#0b84ff] text-white rounded-tr-sm' 
                        : 'self-center bg-zinc-900/50 border border-zinc-800 text-cyber-neonPurple px-3 py-1.5 rounded-lg font-mono text-[9px] max-w-[90%] text-center leading-normal'
                    }`}
                  >
                    {msg.text}
                  </div>
                ))}

                {isTyping && (
                  <div className="self-start bg-[#262629] px-4 py-2.5 rounded-2xl rounded-tl-sm flex gap-1 items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-500 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-500 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-500 animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                )}

                <div ref={chatEndRef} />
              </div>

              {/* Chat input box */}
              <div className="p-3 bg-[#121214] border-t border-zinc-900">
                {chatStep === 4 ? (
                  <button 
                    onClick={handleResetChat}
                    className="w-full bg-[#1c1c1e] hover:bg-[#2c2c2e] border border-zinc-800 text-[#0b84ff] py-2 rounded-xl text-xs font-semibold cursor-pointer active:scale-[0.98] transition-transform"
                  >
                    Send Another Secure Ping
                  </button>
                ) : (
                  <form onSubmit={handleSendChat} className="flex gap-2 items-center">
                    <input 
                      type={chatStep === 1 ? "email" : "text"}
                      required
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder={
                        chatStep === 0 ? "Type your name..." : 
                        chatStep === 1 ? "Type your return email..." : 
                        chatStep === 2 ? "Type secure message..." : 
                        "Encrypting connection..."
                      }
                      disabled={chatStep === 3 || isTyping}
                      className="flex-1 bg-[#1c1c1e] text-white text-xs px-3.5 py-2.5 rounded-full border border-zinc-800 focus:outline-none focus:border-[#0b84ff] placeholder-zinc-500"
                    />
                    <button 
                      type="submit"
                      disabled={!inputValue.trim() || chatStep === 3 || isTyping}
                      className="w-8 h-8 rounded-full bg-[#0b84ff] hover:bg-[#1a8cff] active:scale-90 flex items-center justify-center text-white disabled:opacity-40 transition-transform cursor-pointer"
                    >
                      <Send className="w-4 h-4 transform rotate-45 -translate-x-0.5" />
                    </button>
                  </form>
                )}
              </div>

            </div>
          )}

          {/* ========================================== */}
          {/*   TERMINAL APP                             */}
          {/* ========================================== */}
          {iosScreen === 'terminal' && (
            <div className="absolute inset-0 bg-[#020205] flex flex-col animate-fade-in text-[#39ff14] font-mono">
              
              {/* Terminal Header */}
              <div className="h-12 bg-zinc-900/60 border-b border-zinc-800/40 flex items-center justify-between px-3 text-white">
                <span className="text-xs font-semibold select-none flex items-center gap-1.5"><Terminal className="w-3.5 h-3.5 text-[#39ff14]" /> SecOS Shell</span>
                <button 
                  onClick={() => setIosScreen('home')}
                  className="text-xs text-zinc-400 hover:text-white cursor-pointer select-none"
                >
                  Exit
                </button>
              </div>

              {/* Scrollable logs */}
              <div className="flex-1 overflow-y-auto p-4 space-y-1.5 text-[10px] leading-relaxed custom-scrollbar">
                {terminalLogs.map((log, index) => (
                  <div key={index} className="whitespace-pre-wrap select-text">{log}</div>
                ))}
                <div ref={terminalEndRef} />
              </div>

              {/* Terminal Input form */}
              <form onSubmit={handleTerminalSubmit} className="p-3 bg-black/80 border-t border-zinc-800/30 flex items-center gap-2">
                <span className="text-zinc-500 text-[10px] select-none">lth-user@secos:~$</span>
                <input 
                  type="text"
                  value={terminalInput}
                  onChange={(e) => setTerminalInput(e.target.value)}
                  placeholder="Type help..."
                  className="flex-1 bg-transparent text-[#39ff14] text-[10px] font-mono focus:outline-none"
                  autoFocus
                />
              </form>

            </div>
          )}

          {/* Home swipe indicator bar overlay at the very bottom */}
          {iosScreen !== 'lock' && (
            <div 
              onClick={() => setIosScreen('home')}
              className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-white/40 rounded-full z-30 cursor-pointer hover:bg-white/60"
            />
          )}

        </div>

        {/* Physical Home Button on the iPhone casing */}
        <div className="bg-[#1c1c1e] py-3.5 border-t border-zinc-800 flex justify-center items-center flex-shrink-0 select-none z-20">
          <button 
            onClick={handleHomeBtnClick}
            className="w-10 h-10 rounded-full border border-zinc-700 active:scale-95 bg-zinc-900 hover:bg-zinc-800 flex items-center justify-center transition-all cursor-pointer shadow-inner"
            title="iOS Home Button"
          >
            <div className="w-4.5 h-4.5 rounded-[5px] border border-zinc-600"></div>
          </button>
        </div>

      </div>

      {/* Floating close X button on outer overlay */}
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 p-2 bg-black/60 border border-zinc-800 hover:border-red-500 rounded-full transition-all text-zinc-400 hover:text-red-500 cursor-pointer"
        title="Close Device View"
      >
        <X className="w-5 h-5" />
      </button>

    </div>
  );
};

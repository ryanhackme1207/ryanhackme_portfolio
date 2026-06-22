import React, { useState } from 'react';
import { Key, ShieldCheck, X, Folder, ExternalLink, Network, Shield, Terminal, Code, Cpu, Smartphone, Mail, Phone as PhoneIcon, Github, Linkedin, Send, Radio, Lock } from 'lucide-react';
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
              <p className="text-xs text-cyber-text/50 font-mono">VLAN SECURE AUDIT - LAI TING HONG SKILL MATRIX</p>
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
                • <strong className="text-cyber-heading">MMU CS Cybersecurity Major:</strong> Studying OSPF/BGP WAN structures, Incident Response, and Pentesting at Multimedia University.
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
      description: "Programmed and launched a centralized digital library resource platform for MMU Melaka student lecture materials, safeguarding academic knowledge from faculty deletion over time.",
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
              <p className="text-xs text-cyber-text/50 font-mono">INTELLIGENCE BRIEFING ON LAI TING HONG PROJECTS</p>
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
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sendingState, setSendingState] = useState<'idle' | 'encrypting' | 'routing' | 'sent'>('idle');
  const [consoleLogs, setConsoleLogs] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    setSendingState('encrypting');
    setConsoleLogs([
      ">> INITIALIZING SECURE PACKET CONVERSION...",
      ">> APPLIYING AES-256 ENCRYPTION SCHEME...",
      ">> SHA-256 HANDSHAKE HASH GENERATED..."
    ]);

    setTimeout(() => {
      setSendingState('routing');
      setConsoleLogs(prev => [
        ...prev,
        ">> SEARCHING OPTIMAL ROUTING PATHWAYS...",
        ">> ROUTING VIA IPSEC VPN GATEWAY (192.168.99.1)...",
        ">> PACKETS SEGMENTED AND SIGNED WITH PKI KEYS..."
      ]);
    }, 1200);

    setTimeout(() => {
      setSendingState('sent');
      setConsoleLogs(prev => [
        ...prev,
        ">> CONNECTION ESTABLISHED WITH LTH_SMTP_SERVER",
        ">> PACKETS INGESTED SUCCESSFULLY. TRANSMISSION COMPLETE.",
        ">> STATUS Code: 202 - MESSAGE IN QUEUE."
      ]);
      setName('');
      setEmail('');
      setMessage('');
    }, 2800);
  };

  return (
    <div className="absolute inset-0 bg-cyber-bg/80 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="w-[380px] h-[660px] bg-cyber-dark border-2 border-cyber-neonPurple rounded-3xl shadow-[0_0_35px_rgba(177,0,232,0.35)] overflow-hidden flex flex-col scanlines relative">
        
        {/* Smartphone Camera Notch */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-5 bg-cyber-bg border-b border-x border-cyber-neonPurple/30 rounded-b-xl z-20 flex justify-center items-center">
          <div className="w-2 h-2 bg-cyber-dark rounded-full border border-cyber-neonPurple/30 mr-4"></div>
          <div className="w-12 h-1.5 bg-cyber-dark/80 rounded-full border border-cyber-neonPurple/20"></div>
        </div>

        {/* Top Status Bar */}
        <div className="bg-cyber-dark px-6 pt-6 pb-2 border-b border-cyber-neonPurple/20 flex justify-between items-center text-[10px] font-mono text-cyber-neonPurple/70">
          <span className="flex items-center gap-1"><Radio className="w-3 h-3 text-cyber-neonGreen animate-pulse" /> 5G LTH_SEC</span>
          <span className="flex items-center gap-1 font-bold"><Lock className="w-3 h-3 text-cyber-neonGreen" /> VPN SECURE</span>
          <span>13:06 PM</span>
        </div>

        {/* Close button */}
        <div className="flex justify-between items-center px-4 py-3 bg-cyber-dark/60 border-b border-cyber-neonPurple/15 flex-shrink-0">
          <div className="flex items-center gap-2">
            <Smartphone className="w-4.5 h-4.5 text-cyber-neonPurple" />
            <span className="font-mono text-xs font-semibold text-cyber-heading">ANALYST_COMMS</span>
          </div>
          <button 
            onClick={onClose}
            className="p-1 border border-cyber-neonPurple/20 hover:border-cyber-neonGreen rounded bg-cyber-neonPurple/5 hover:bg-cyber-neonGreen/10 transition-all text-cyber-neonPurple hover:text-cyber-neonGreen cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Pane */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4">
          
          {/* Quick Links */}
          <div className="cyber-panel-purple p-3 bg-cyber-dark/80 space-y-2 border-cyber-neonPurple/20">
            <div className="text-[10px] font-mono text-cyber-text/50 uppercase tracking-widest border-b border-cyber-neonPurple/15 pb-1 flex justify-between">
              <span>Direct Comms</span>
              <span className="text-cyber-neonGreen flex items-center gap-0.5"><ShieldCheck className="w-3 h-3" /> VERIFIED</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <a 
                href="mailto:ryan.cyber.work@gmail.com" 
                className="flex items-center gap-2 p-2 bg-cyber-neonPurple/5 hover:bg-cyber-neonPurple/20 border border-cyber-neonPurple/20 rounded transition-all text-cyber-neonPurple"
              >
                <Mail className="w-4 h-4 flex-shrink-0 text-cyber-neonGreen" />
                <span className="truncate">ryan.cyber.work@gmail.com</span>
              </a>
              <a 
                href="tel:+601112248122" 
                className="flex items-center gap-2 p-2 bg-cyber-neonPurple/5 hover:bg-cyber-neonPurple/20 border border-cyber-neonPurple/20 rounded transition-all text-cyber-neonPurple"
              >
                <PhoneIcon className="w-4 h-4 flex-shrink-0 text-cyber-neonGreen" />
                <span>+601112248122</span>
              </a>
              <a 
                href="https://github.com/ryanhackme" 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center gap-2 p-2 bg-cyber-neonPurple/5 hover:bg-cyber-neonPurple/20 border border-cyber-neonPurple/20 rounded transition-all text-cyber-neonPurple"
              >
                <Github className="w-4 h-4 flex-shrink-0 text-cyber-neonGreen" />
                <span>GitHub</span>
              </a>
              <a 
                href="https://linkedin.com/in/lai-ting-hong" 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center gap-2 p-2 bg-cyber-neonPurple/5 hover:bg-cyber-neonPurple/20 border border-cyber-neonPurple/20 rounded transition-all text-cyber-neonPurple"
              >
                <Linkedin className="w-4 h-4 flex-shrink-0 text-cyber-neonGreen" />
                <span>LinkedIn</span>
              </a>
            </div>
          </div>

          {/* Secure Ping Form */}
          <div className="cyber-panel-purple p-3 bg-cyber-dark/80 border-cyber-neonPurple/20 flex flex-col gap-3">
            <div className="text-[10px] font-mono text-cyber-text/50 uppercase tracking-widest border-b border-cyber-neonPurple/15 pb-1">
              Transmit Encrypted Message
            </div>

            {sendingState === 'idle' && (
              <form onSubmit={handleSubmit} className="space-y-2.5 text-xs font-mono">
                <div className="space-y-1">
                  <label className="text-[10px] text-cyber-neonPurple/70 uppercase">Caller Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Security Auditor / Recruiter"
                    className="w-full bg-cyber-dark border border-cyber-neonPurple/25 rounded px-2 py-1.5 focus:outline-none focus:border-cyber-neonGreen text-cyber-heading"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-cyber-neonPurple/70 uppercase">VLAN Return Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="recruiter@wevo.com"
                    className="w-full bg-cyber-dark border border-cyber-neonPurple/25 rounded px-2 py-1.5 focus:outline-none focus:border-cyber-neonGreen text-cyber-heading"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-cyber-neonPurple/70 uppercase">Secure Message Payload</label>
                  <textarea
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                    placeholder="We would love to schedule a technical chat about network opportunities at Wevo..."
                    className="w-full bg-cyber-dark border border-cyber-neonPurple/25 rounded px-2 py-1.5 focus:outline-none focus:border-cyber-neonGreen text-cyber-heading resize-none"
                  />
                </div>
                
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 py-2 bg-cyber-neonPurple/15 hover:bg-cyber-neonPurple/30 text-cyber-neonPurple border border-cyber-neonPurple/40 rounded transition-all hover:shadow-glow-purple font-bold uppercase cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" /> PING ANALYST
                </button>
              </form>
            )}

            {sendingState !== 'idle' && (
              <div className="space-y-3 font-mono text-[10px]">
                <div className="bg-cyber-dark border border-cyber-neonPurple/10 p-2 rounded h-40 overflow-y-auto custom-scrollbar text-cyber-neonPurple space-y-1 flex flex-col justify-end">
                  {consoleLogs.map((log, idx) => (
                    <div key={idx} className="leading-tight">{log}</div>
                  ))}
                  {sendingState === 'encrypting' && <div className="text-cyber-neonGreen animate-pulse">&gt;&gt; ENCRYPTING CONTENT PROTOCOLS...</div>}
                  {sendingState === 'routing' && <div className="text-cyber-neonGreen animate-pulse">&gt;&gt; RESOLVING IPSEC ROUTER BOUNDS...</div>}
                  {sendingState === 'sent' && <div className="text-cyber-neonGreen font-bold">&gt;&gt; TRANSMISSION COMPLETED SUCESSFULLY!</div>}
                </div>

                {sendingState === 'sent' && (
                  <button
                    onClick={() => setSendingState('idle')}
                    className="w-full py-1.5 border border-cyber-neonPurple/30 hover:border-cyber-neonPurple text-cyber-neonPurple rounded transition-all hover:bg-cyber-neonPurple/10 cursor-pointer"
                  >
                    SEND ANOTHER PING
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="cyber-panel-purple p-3 bg-cyber-dark/80 border-cyber-neonPurple/15 space-y-1 text-[9px] font-mono text-cyber-text/50">
            <div>DEVICE: LTH-COMMS-LINK-X</div>
            <div>NET PATH: MELAKA-CELLULAR-NAT-3</div>
            <div>AUDIT SIG: LTH_HACKME_SECPORTFOLIO</div>
          </div>

        </div>

        {/* Physical Home Button on Mobile Device */}
        <div className="bg-cyber-dark py-3 border-t border-cyber-neonPurple/20 flex justify-center items-center flex-shrink-0">
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-full border border-cyber-neonPurple/35 hover:border-cyber-neonGreen bg-cyber-neonPurple/5 hover:bg-cyber-neonPurple/15 flex items-center justify-center transition-all cursor-pointer hover:shadow-glow-purple"
            title="Return to Desk"
          >
            <div className="w-4 h-4 rounded bg-cyber-neonPurple/40"></div>
          </button>
        </div>

      </div>
    </div>
  );
};

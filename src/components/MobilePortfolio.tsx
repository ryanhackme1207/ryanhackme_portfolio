import React, { useState } from 'react';
import { Shield, Mail, Phone, Github, Linkedin, Cpu, Key, FileText, ChevronDown, ChevronUp, Network, Zap } from 'lucide-react';

export const MobilePortfolio: React.FC = () => {
  const [openSection, setOpenSection] = useState<string | null>('about');

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  const skills = [
    { name: 'Network Security & Cryptography', level: 92, color: 'from-cyber-neonPurple to-pink-500' },
    { name: 'VLAN, DHCP & Port Security', level: 90, color: 'from-cyber-neonGreen to-emerald-500' },
    { name: 'Routing Protocols (CCNA, OSPF, BGP)', level: 88, color: 'from-cyber-neonPurple to-violet-600' },
    { name: 'C++ & Python Scripting (Hash Analysis)', level: 85, color: 'from-cyber-neonGreen to-teal-500' },
    { name: 'Firewall Administration & IPS/IDS', level: 80, color: 'from-cyber-neonPurple to-cyan-500' }
  ];

  return (
    <div className="w-full min-h-screen bg-cyber-bg text-cyber-text font-sans overflow-y-auto px-4 py-6 flex flex-col gap-6 select-none custom-scrollbar">
      {/* HEADER SECTION */}
      <div className="cyber-panel-purple p-4 bg-cyber-dark/95 border-cyber-neonPurple/40 flex flex-col gap-3 items-center text-center">
        <div className="w-12 h-12 rounded-full bg-cyber-neonPurple/10 border border-cyber-neonPurple flex items-center justify-center text-cyber-neonPurple animate-pulse shadow-glow-purple">
          <Shield className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-wider font-mono text-cyber-heading text-gradient">
            RYAN LAI TING HONG
          </h1>
          <p className="text-xs text-cyber-neonGreen font-mono uppercase tracking-widest mt-1">
            Cybersecurity & Network Security Specialist
          </p>
          <p className="text-[10px] text-cyber-text/60 font-mono mt-0.5">
            MMU Cyberjaya (Final Year) // Actively seeking roles at Wevo
          </p>
        </div>
        <div className="w-full h-[1px] bg-cyber-neonPurple/20 my-1" />
        <div className="flex items-center gap-1.5 font-mono text-[9px] text-cyber-neonGreen animate-pulse">
          <span className="w-1.5 h-1.5 bg-cyber-neonGreen rounded-full"></span>
          SYS_LOG: MOBILE INTEGRATION ONLINE // PORT 443 SECURE
        </div>
      </div>

      {/* SIMULATED GREEN TERMINAL */}
      <div className="cyber-panel-green p-4 bg-black/90 border-cyber-neonGreen/30 font-mono text-xs leading-relaxed space-y-2.5">
        <div className="flex items-center gap-1.5 border-b border-cyber-neonGreen/10 pb-2 mb-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500/80"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-green-500/80"></span>
          <span className="text-[10px] text-cyber-text/40 ml-1.5">ltn_sec_host://terminal</span>
        </div>
        <p className="text-cyber-neonGreen/60">$ cat portfolio_meta.dat</p>
        <p className="text-cyber-text/90">
          <span className="text-cyber-neonGreen font-bold">&gt; NAME:</span> Ryan Lai Ting Hong<br />
          <span className="text-cyber-neonGreen font-bold">&gt; INSTITUTION:</span> Multimedia University (Cyberjaya)<br />
          <span className="text-cyber-neonGreen font-bold">&gt; DIVISION:</span> Network Security & Cryptographic Analysis<br />
          <span className="text-cyber-neonGreen font-bold">&gt; CURRENT FOCUS:</span> Hashing performance metrics simulations across hybrid Cisco-to-Juniper backbones. Actively researching multi-bit flow mapping optimizations. Network-obsessed fanatic.
        </p>
        <div className="w-full h-[1px] bg-cyber-neonGreen/10 my-2" />
        <p className="text-[10px] text-cyber-text/50">
          Target Role: Security Engineer, Network Analyst, Penetration Tester, or Cybersecurity Auditor. Open to junior opportunities to contribute secure infrastructure audits.
        </p>
      </div>

      {/* ACCORDION CONTENTS (USB, Folder, Phone) */}
      <div className="flex flex-col gap-3.5">
        
        {/* SECTION 1: CORE PROJECTS (USB DRIVE) */}
        <div className="cyber-panel-purple bg-cyber-dark/85 border-cyber-neonPurple/20">
          <button 
            onClick={() => toggleSection('projects')}
            className="w-full p-4 flex items-center justify-between text-left font-mono text-xs font-bold text-cyber-heading border-b border-cyber-neonPurple/10"
          >
            <span className="flex items-center gap-2 text-gradient">
              <Cpu className="w-4 h-4 text-cyber-neonPurple" />
              [01. DIGITAL PROJECTS & ANALYZER]
            </span>
            {openSection === 'projects' ? <ChevronUp className="w-4 h-4 text-cyber-neonPurple" /> : <ChevronDown className="w-4 h-4 text-cyber-neonPurple" />}
          </button>
          
          {openSection === 'projects' && (
            <div className="p-4 space-y-4 font-mono text-xs text-cyber-text/85">
              {/* Project 1 */}
              <div className="space-y-1 border-l-2 border-cyber-neonPurple/30 pl-3">
                <h4 className="text-cyber-heading font-bold text-[13px] flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-cyber-neonGreen" />
                  Multi-Bit Hash Performance Analyzer
                </h4>
                <p className="text-[11px] text-cyber-text/70 mt-1 leading-relaxed">
                  Engineered C++ and Python scripts to run performance tests across multi-year data sets (2006-2026), simulating hashing efficiencies and packet speedups on Cisco/Juniper routing pipes.
                </p>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  <span className="px-1.5 py-0.5 bg-cyber-neonPurple/15 text-cyber-neonPurple rounded text-[9px]">C++ / Python</span>
                  <span className="px-1.5 py-0.5 bg-cyber-neonGreen/15 text-cyber-neonGreen rounded text-[9px]">Data Processing</span>
                  <span className="px-1.5 py-0.5 bg-cyber-neonPurple/15 text-cyber-neonPurple rounded text-[9px]">CSV Extraction</span>
                </div>
              </div>

              {/* Project 2 */}
              <div className="space-y-1 border-l-2 border-cyber-neonGreen/30 pl-3 pt-1">
                <h4 className="text-cyber-heading font-bold text-[13px] flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-cyber-neonPurple" />
                  Mecon3 Flow Mapping Logic
                </h4>
                <p className="text-[11px] text-cyber-text/70 mt-1 leading-relaxed">
                  Implemented flow-mapping logic in hash simulations to handle packet mapping across network buckets, correcting bin-suppression visual anomalies to yield accurate log distributions.
                </p>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  <span className="px-1.5 py-0.5 bg-cyber-neonGreen/15 text-cyber-neonGreen rounded text-[9px]">Network Hashing</span>
                  <span className="px-1.5 py-0.5 bg-cyber-neonPurple/15 text-cyber-neonPurple rounded text-[9px]">Algorithmic Mapping</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* SECTION 2: ACADEMIC DOSSIER (MANILA FOLDER) */}
        <div className="cyber-panel-purple bg-cyber-dark/85 border-cyber-neonPurple/20">
          <button 
            onClick={() => toggleSection('academic')}
            className="w-full p-4 flex items-center justify-between text-left font-mono text-xs font-bold text-cyber-heading border-b border-cyber-neonPurple/10"
          >
            <span className="flex items-center gap-2 text-gradient">
              <FileText className="w-4 h-4 text-cyber-neonPurple" />
              [02. EXPERIENCE & DOSSIER]
            </span>
            {openSection === 'academic' ? <ChevronUp className="w-4 h-4 text-cyber-neonPurple" /> : <ChevronDown className="w-4 h-4 text-cyber-neonPurple" />}
          </button>
          
          {openSection === 'academic' && (
            <div className="p-4 space-y-3 font-mono text-xs text-cyber-text/85">
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-cyber-heading font-bold">Multimedia University (Cyberjaya)</h4>
                    <p className="text-[10px] text-cyber-neonPurple">Bachelor of Computer Science (Specializing in Network Security)</p>
                  </div>
                  <span className="text-[10px] text-cyber-neonGreen font-semibold">2023 - Present</span>
                </div>
                <ul className="list-disc list-inside text-[11px] text-cyber-text/70 space-y-1 pl-1">
                  <li>Specialized in Network Audits, Cryptography, Packet Hashing Models, and Security Protocols.</li>
                  <li>Configured campus network topologies simulating multi-VLAN networks and access lists.</li>
                  <li>Graduating final year, with core technical thesis around router efficiency testing.</li>
                </ul>
              </div>
              <div className="w-full h-[1px] bg-cyber-neonPurple/10 my-2" />
              <div className="space-y-1">
                <h5 className="text-[11px] text-cyber-heading font-bold">Key Coursework Completed:</h5>
                <p className="text-[10px] text-cyber-text/60 leading-relaxed">
                  Network Auditing & Management // Cryptography & Info Security // Penetration Testing // Advanced Routing & Switching (CCNA level config: OSPF, RIP, VLSM) // Computer Forensics.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* SECTION 3: SKILLS MATRIX (SMARTPHONE APP) */}
        <div className="cyber-panel-purple bg-cyber-dark/85 border-cyber-neonPurple/20">
          <button 
            onClick={() => toggleSection('skills')}
            className="w-full p-4 flex items-center justify-between text-left font-mono text-xs font-bold text-cyber-heading border-b border-cyber-neonPurple/10"
          >
            <span className="flex items-center gap-2 text-gradient">
              <Network className="w-4 h-4 text-cyber-neonPurple" />
              [03. CORE SKILLS MATRIX]
            </span>
            {openSection === 'skills' ? <ChevronUp className="w-4 h-4 text-cyber-neonPurple" /> : <ChevronDown className="w-4 h-4 text-cyber-neonPurple" />}
          </button>
          
          {openSection === 'skills' && (
            <div className="p-4 space-y-4 font-mono text-xs">
              <div className="space-y-3.5">
                {skills.map((skill, index) => (
                  <div key={index} className="space-y-1.5">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-cyber-heading font-bold">{skill.name}</span>
                      <span className="text-cyber-neonGreen font-semibold">{skill.level}%</span>
                    </div>
                    {/* Glowing Skill bar */}
                    <div className="w-full h-2 bg-black/60 rounded-full border border-cyber-neonPurple/20 overflow-hidden">
                      <div 
                        className={`h-full rounded-full bg-gradient-to-r ${skill.color}`}
                        style={{ width: `${skill.level}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="w-full h-[1px] bg-cyber-neonPurple/10 my-2" />
              <div className="text-[10px] text-cyber-text/50">
                Familiar Tools: Wireshark, Nmap, Cisco Packet Tracer, Snort IDS, GNS3, Linux Bash, Git.
              </div>
            </div>
          )}
        </div>

      </div>

      {/* CONNECT / CONTACT SECTION */}
      <div className="cyber-panel-purple p-4 bg-cyber-dark/95 border-cyber-neonPurple/40 space-y-3">
        <h3 className="text-xs font-bold font-mono text-cyber-heading border-b border-cyber-neonPurple/20 pb-2 uppercase flex items-center justify-between">
          <span className="text-gradient">Secure Connection Channels</span>
          <Mail className="w-4 h-4 text-cyber-neonPurple animate-pulse" />
        </h3>
        
        <div className="grid grid-cols-2 gap-2.5 font-mono text-[10px]">
          <a 
            href="mailto:ryanlaitinghong@gmail.com" 
            className="flex items-center gap-1.5 p-2 bg-cyber-neonPurple/5 border border-cyber-neonPurple/20 rounded hover:bg-cyber-neonPurple/15 transition-all text-cyber-text hover:text-cyber-neonPurple"
          >
            <Mail className="w-3.5 h-3.5 text-cyber-neonPurple flex-shrink-0" />
            <span className="truncate">Email</span>
          </a>
          <a 
            href="tel:+60123456789" 
            className="flex items-center gap-1.5 p-2 bg-cyber-neonGreen/5 border border-cyber-neonGreen/20 rounded hover:bg-cyber-neonGreen/15 transition-all text-cyber-text hover:text-cyber-neonGreen"
          >
            <Phone className="w-3.5 h-3.5 text-cyber-neonGreen flex-shrink-0" />
            <span>Call Channel</span>
          </a>
          <a 
            href="https://github.com/ryanhackme1207" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center gap-1.5 p-2 bg-cyber-neonPurple/5 border border-cyber-neonPurple/20 rounded hover:bg-cyber-neonPurple/15 transition-all text-cyber-text hover:text-cyber-neonPurple"
          >
            <Github className="w-3.5 h-3.5 text-cyber-neonPurple flex-shrink-0" />
            <span>GitHub</span>
          </a>
          <a 
            href="https://linkedin.com" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center gap-1.5 p-2 bg-cyber-neonGreen/5 border border-cyber-neonGreen/20 rounded hover:bg-cyber-neonGreen/15 transition-all text-cyber-text hover:text-cyber-neonGreen"
          >
            <Linkedin className="w-3.5 h-3.5 text-cyber-neonGreen flex-shrink-0" />
            <span>LinkedIn</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default MobilePortfolio;

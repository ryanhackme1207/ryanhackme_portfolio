// Custom cursor
const dot = document.getElementById('cursorDot');
const ring = document.getElementById('cursorRing');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  dot.style.left = mx + 'px';
  dot.style.top = my + 'px';
});

function animRing() {
  rx += (mx - rx) * 0.12;
  ry += (my - ry) * 0.12;
  ring.style.left = rx + 'px';
  ring.style.top = ry + 'px';
  requestAnimationFrame(animRing);
}
animRing();

document.querySelectorAll('a, button, .skill-card, .cert-card').forEach(el => {
  el.addEventListener('mouseenter', () => ring.classList.add('expand'));
  el.addEventListener('mouseleave', () => ring.classList.remove('expand'));
});

// Nav scroll
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
});

// Reveal on scroll
const revEls = document.querySelectorAll('.rev');
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
    }
  });
}, { threshold: 0.12 });
revEls.forEach(el => obs.observe(el));

// Progress bars
const progFills = document.querySelectorAll('.prog-fill');
const progObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const w = parseFloat(e.target.dataset.width);
      e.target.style.width = (w * 100) + '%';
    }
  });
}, { threshold: 0.5 });
progFills.forEach(f => { progObs.observe(f); });

// Terminal typing on scroll
const termSection = document.getElementById('about');
let typed = false;
const termObs = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting && !typed) {
    typed = true;
    // already displayed statically
  }
}, { threshold: 0.3 });
termObs.observe(termSection);

// Skill tags hover ripple
document.querySelectorAll('.skill-tag').forEach(tag => {
  tag.addEventListener('mouseenter', function(e) {
    this.style.transform = 'scale(1.05)';
  });
  tag.addEventListener('mouseleave', function() {
    this.style.transform = 'scale(1)';
  });
});

// Hero name letter animation on load
(function() {
  const spans = document.querySelectorAll('.hero-name span');
  spans.forEach((s, i) => {
    s.style.opacity = '0';
    s.style.transform = 'translateY(40px)';
    s.style.display = 'block';
    s.style.transition = `opacity 0.9s ${0.3 + i*0.15}s cubic-bezier(0.22,1,0.36,1), transform 0.9s ${0.3 + i*0.15}s cubic-bezier(0.22,1,0.36,1)`;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        s.style.opacity = '';
        s.style.transform = '';
      });
    });
  });
})();

function getComplianceHtml(title, desc) {
  return `<p>${desc}</p>
<div class="compliance-interactive">
  <div class="comp-vault">
    <div class="comp-doc">
      <div class="doc-line"></div>
      <div class="doc-line"></div>
      <div class="doc-line short"></div>
      <div class="doc-stamp">${title}</div>
    </div>
    <div class="comp-scanner"></div>
    <div class="comp-shield">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
    </div>
  </div>
  <div class="comp-status">Status: </div>
</div>`;
}

function getNetworkSimHtml(title, desc, isOspf) {
  if (isOspf) {
    return `<p>${desc}</p>
<div class="network-sim-container">
  <svg viewBox="0 0 400 200" width="100%" height="200px" class="net-svg">
    <path d="M 100,150 L 200,50 L 300,150 Z" fill="none" stroke="var(--border2)" stroke-width="4"/>
    <path class="ospf-active-link" d="M 100,150 L 200,50 L 300,150" fill="none" stroke="var(--lime)" stroke-width="4" stroke-dasharray="10 10">
       <animate attributeName="stroke-dashoffset" from="100" to="0" dur="2s" repeatCount="indefinite"/>
    </path>
    <g class="net-node" data-info="<strong>Router 1:</strong><br>Cost to R3: 10<br>Role: Backbone">
      <circle cx="100" cy="150" r="25" fill="var(--surface)" stroke="var(--accent2)" stroke-width="2" class="node-bg"/>
      <text x="100" y="155" fill="var(--text)" font-family="monospace" font-size="12" text-anchor="middle">R1</text>
    </g>
    <g class="net-node" data-info="<strong>Router 2:</strong><br>Cost to R1: 5<br>Cost to R3: 5">
      <circle cx="200" cy="50" r="25" fill="var(--surface)" stroke="var(--accent2)" stroke-width="2" class="node-bg"/>
      <text x="200" y="55" fill="var(--text)" font-family="monospace" font-size="12" text-anchor="middle">R2</text>
    </g>
    <g class="net-node" data-info="<strong>Router 3:</strong><br>Cost to R1: 10<br>Role: Area 1">
      <circle cx="300" cy="150" r="25" fill="var(--surface)" stroke="var(--accent2)" stroke-width="2" class="node-bg"/>
      <text x="300" y="155" fill="var(--text)" font-family="monospace" font-size="12" text-anchor="middle">R3</text>
    </g>
  </svg>
  <div class="net-info-panel" id="netInfoPanel">Hover over a router to view OSPF routing metrics.</div>
</div>`;
  }
  
  return `<p>${desc}</p>
<div class="network-sim-container">
  <svg viewBox="0 0 400 200" width="100%" height="200px" class="net-svg">
    <path class="net-wire" d="M 50,150 L 150,150 L 250,100 L 350,100" fill="none" stroke="var(--border2)" stroke-width="4" stroke-linejoin="round"/>
    <circle cx="0" cy="0" r="6" fill="var(--lime)">
       <animateMotion path="M 50,150 L 150,150 L 250,100 L 350,100" dur="2.5s" repeatCount="indefinite" />
    </circle>
    <rect x="30" y="135" width="40" height="30" rx="4" fill="var(--surface)" stroke="var(--accent)" stroke-width="2"/>
    <text x="50" y="155" fill="var(--text)" font-family="monospace" font-size="12" text-anchor="middle">PC</text>
    <g class="net-node" data-info="<strong>Switch MAC Table:</strong><br>Port 1: 00:1A:2B:3C:4D:5E (PC)<br>Port 2: 00:1A:2B:3C:4D:5F (Router)">
      <rect x="130" y="140" width="40" height="20" rx="2" fill="var(--surface)" stroke="var(--lime)" stroke-width="2" class="node-bg"/>
      <circle cx="140" cy="150" r="3" fill="var(--lime)"/> <circle cx="150" cy="150" r="3" fill="var(--lime)"/> <circle cx="160" cy="150" r="3" fill="var(--lime)"/>
      <text x="150" y="175" fill="var(--text)" font-family="monospace" font-size="12" text-anchor="middle">Switch</text>
    </g>
    <g class="net-node" data-info="<strong>Router Routing Table:</strong><br>192.168.1.0/24 -&gt; Eth0 (Switch)<br>0.0.0.0/0 -&gt; WAN (Cloud)">
      <circle cx="250" cy="100" r="25" fill="var(--surface)" stroke="var(--accent2)" stroke-width="2" class="node-bg"/>
      <path d="M 240,100 L 260,100 M 250,90 L 250,110" stroke="var(--accent2)" stroke-width="2"/>
      <text x="250" y="145" fill="var(--text)" font-family="monospace" font-size="12" text-anchor="middle">Router</text>
    </g>
    <path d="M 330,100 Q 330,80 350,80 Q 370,80 370,100 Q 390,100 390,120 Q 370,120 350,120 Q 330,120 330,100" fill="var(--surface)" stroke="var(--muted)" stroke-width="2"/>
    <text x="360" y="105" fill="var(--text)" font-family="monospace" font-size="12" text-anchor="middle">Cloud</text>
  </svg>
  <div class="net-info-panel" id="netInfoPanel">Hover over the Switch or Router to inspect their configuration.</div>
</div>`;
}

// --- SKILL MODAL DATA ---
const skillExplanations = {  "OSI 7-Layer": `<p>The OSI model describes network communication in 7 layers. <strong>Hover over the stack</strong> to watch a packet travel, or hover over a layer to see its details.</p>
<div class="osi-interactive-wrapper">
  <div class="osi-stack-interactive">
    <div class="osi-packet">DATA</div>
    <div class="osi-layer-int" data-desc="End-user interface (HTTP, FTP). Data is generated here."><span>7</span> Application</div>
    <div class="osi-layer-int" data-desc="Data formatting, encryption, and compression (SSL/TLS, JPEG)."><span>6</span> Presentation</div>
    <div class="osi-layer-int" data-desc="Establishes, maintains, and terminates connections (RPC, NetBIOS)."><span>5</span> Session</div>
    <div class="osi-layer-int" data-desc="Reliable data transfer, segmentation, and error checking (TCP, UDP)."><span>4</span> Transport</div>
    <div class="osi-layer-int" data-desc="Routing packets across networks via IP addresses (IP, ICMP, Routers)."><span>3</span> Network</div>
    <div class="osi-layer-int" data-desc="Node-to-node frame delivery, MAC addresses, and switches (Ethernet, VLAN)."><span>2</span> Data Link</div>
    <div class="osi-layer-int" data-desc="Raw bit stream transmission over physical medium (Cables, Hubs, Wi-Fi)."><span>1</span> Physical</div>
  </div>
  <div class="osi-info-box" id="osiInfoBox">
    <strong>Hover over a layer</strong> to view its function.
  </div>
</div>`,  "IPv4 / IPv6": `<p>Protocols responsible for routing packets across networks. IPv4 uses 32-bit addresses, while IPv6 uses 128-bit addresses to solve IP exhaustion and improve security routing.</p>
<div class="ip-compare">
  <div class="ip-box ipv4">
    <div class="ip-title">IPv4</div>
    <div class="ip-addr">192.168.1.1</div>
    <div class="ip-stat">32-bit (4.3 Billion)</div>
  </div>
  <div class="ip-box ipv6">
    <div class="ip-title">IPv6</div>
    <div class="ip-addr">2001:0db8:85a3::8a2e:0370:7334</div>
    <div class="ip-stat">128-bit (Undepletable)</div>
  </div>
</div>`,
  "Subnetting": `<p>Subnetting divides a single large network into smaller, manageable sub-networks to improve security and performance. <strong>Hover over the main network</strong> below to see it split!</p>
<div class="subnet-interactive">
  <div class="subnet-block main-net">192.168.1.0/24<br><span>(256 IP Addresses)</span></div>
  <div class="subnet-split">
    <div class="subnet-block sub">192.168.1.0/25<br><span>(128 IPs)</span></div>
    <div class="subnet-block sub">192.168.1.128/25<br><span>(128 IPs)</span></div>
  </div>
</div>`,
  "OSPF": getNetworkSimHtml("OSPF", "Open Shortest Path First is a link-state routing protocol. Hover over the routers below to see how they calculate the best paths.", true),
  "DNS": "Domain Name System translates human-readable domain names into IP addresses. Understanding DNS is critical for preventing spoofing and cache poisoning attacks.",
  "AAA / RADIUS": "Authentication, Authorization, and Accounting frameworks. RADIUS is a protocol used to centrally manage network access.",
  "STP": "Spanning Tree Protocol prevents loop topologies in bridged Ethernet local area networks.",
  "IPSec VPN": "A secure network protocol suite that authenticates and encrypts packets of data to provide secure encrypted communication between two computers over an IP network.",
  "ACL": "Access Control Lists are a set of rules that grant or deny access to network environments, operating as a fundamental network firewall.",
  "Firewall Config": "Designing, implementing, and maintaining rules to monitor and control incoming and outgoing network traffic based on predetermined security rules.",
  "Switches & Routers": getNetworkSimHtml("Switches & Routers", "Core networking hardware. Hover over the devices in this Packet Tracer-style topology to view their internal MAC and Routing tables.", false),
  
  "OWASP Top 10": "A standard awareness document representing a broad consensus about the most critical security risks to web applications (e.g., Injection, Broken Authentication).",
  "Kali Linux": "A Debian-derived Linux distribution designed for digital forensics and penetration testing, containing hundreds of pre-installed security tools.",
  "Nmap": "Network Mapper is a free and open-source utility for network discovery and security auditing. It determines what hosts are available, what services they offer, and more.",
  "Wireshark": "The world's foremost and widely-used network protocol analyzer, allowing you to see what's happening on your network at a microscopic level.",
  "Metasploit": "A penetration testing framework that makes hacking simple. It's an essential tool used to find, exploit, and validate vulnerabilities.",
  "Hashcat": "The world's fastest and most advanced password recovery utility, supporting five unique modes of attack for over 300 highly-optimized hashing algorithms.",
  "SQLMap": "An open source penetration testing tool that automates the process of detecting and exploiting SQL injection flaws and taking over of database servers.",
  "SIEM": "Security Information and Event Management systems provide real-time analysis of security alerts generated by applications and network hardware.",
  "Phishing": `<p>The fraudulent attempt to obtain sensitive information. <strong>Hover over the highlighted parts</strong> of this simulated email to reveal the hidden threat.</p>
<div class="phishing-interactive">
  <div class="email-mock">
    <div class="email-header">
      From: <span class="suspect-item" data-reveal="hacker123@evil-domain.com">IT-Support &lt;support@company.com&gt;</span><br>
      Subject: URGENT: Password Expiry
    </div>
    <div class="email-body">
      Dear User, your password will expire in 2 hours.<br><br>
      <span class="suspect-btn suspect-item" data-reveal="http://192.168.1.55/login">Verify Account</span>
    </div>
  </div>
</div>`,
  "Win Exploitation": "Identifying and leveraging vulnerabilities within the Windows operating system and its associated services to gain unauthorized access.",
  
  "CIA Triad": `<p>Confidentiality, Integrity, and Availability. <strong>Hover over the pillars</strong> below to understand the core model of information security.</p>
<div class="cia-interactive">
  <div class="cia-pillar" data-title="Confidentiality" data-desc="Ensuring sensitive data is accessed only by authorized people. Example: Encryption.">C</div>
  <div class="cia-pillar" data-title="Integrity" data-desc="Maintaining accuracy and trustworthiness of data over its life cycle. Example: Hashing.">I</div>
  <div class="cia-pillar" data-title="Availability" data-desc="Ensuring systems and data are available when needed. Example: DDoS protection.">A</div>
</div>
<div class="cia-info-box" id="ciaInfoBox">
  <strong>Hover over a pillar</strong> to see its details.
</div>`,
  "Incident Response": "An organized approach to addressing and managing the aftermath of a security breach or cyberattack to limit damage and reduce recovery time.",
  "HIPAA": getComplianceHtml("HIPAA", "Health Insurance Portability and Accountability Act. Hover to see how medical data is safeguarded."),
  "PDPA": getComplianceHtml("PDPA", "Personal Data Protection Act. Hover to see data protection enforcement."),
  "GDPR": getComplianceHtml("GDPR", "General Data Protection Regulation. Hover to see stringent privacy compliance."),
  "PCI-DSS": getComplianceHtml("PCI-DSS", "Payment Card Industry Data Security Standard. Hover to encrypt card data."),
  "ISO 27001": getComplianceHtml("ISO 27001", "ISMS international standard. Hover to implement security framework."),
  "Frameworks": "Deep understanding of various security frameworks (NIST, CIS Controls) that provide a foundation for building a robust security posture."
};

const modal = document.getElementById('skillModal');
const modalTitle = document.getElementById('modalTitle');
const modalBody = document.getElementById('modalBody');
const closeModal = document.getElementById('closeModal');

document.querySelectorAll('.skill-tag').forEach(tag => {
  tag.style.cursor = 'pointer';
  tag.addEventListener('click', () => {
    const skillName = tag.innerText.trim();
    modalTitle.innerText = skillName;
    modalBody.innerHTML = skillExplanations[skillName] || "This skill showcases my proficiency in " + skillName + ". Contact me to learn more about my hands-on experience in this area.";
    modal.classList.add('active');
    
    // Initialize specific interactions if present
    if (skillName === "OSI 7-Layer") {
      const layers = document.querySelectorAll('.osi-layer-int');
      const infoBox = document.getElementById('osiInfoBox');
      layers.forEach(layer => {
        layer.addEventListener('mouseenter', () => {
          infoBox.innerHTML = `<strong>Layer ${layer.innerText}:</strong><br><br>${layer.dataset.desc}`;
          infoBox.classList.add('highlight');
        });
        layer.addEventListener('mouseleave', () => {
          infoBox.innerHTML = `<strong>Hover over a layer</strong> to view its function.`;
          infoBox.classList.remove('highlight');
        });
      });
    } else if (skillName === "CIA Triad") {
      const pillars = document.querySelectorAll('.cia-pillar');
      const infoBox = document.getElementById('ciaInfoBox');
      pillars.forEach(pillar => {
        pillar.addEventListener('mouseenter', () => {
          infoBox.innerHTML = `<strong>${pillar.dataset.title}:</strong><br><br>${pillar.dataset.desc}`;
          infoBox.classList.add('highlight');
        });
        pillar.addEventListener('mouseleave', () => {
          infoBox.innerHTML = `<strong>Hover over a pillar</strong> to see its details.`;
          infoBox.classList.remove('highlight');
        });
      });
    } else if (skillName === "OSPF" || skillName === "Switches & Routers") {
      const nodes = document.querySelectorAll('.net-node');
      const infoPanel = document.getElementById('netInfoPanel');
      if (nodes.length > 0 && infoPanel) {
        nodes.forEach(node => {
          node.addEventListener('mouseenter', () => {
            infoPanel.innerHTML = node.dataset.info;
            infoPanel.classList.add('highlight');
            node.querySelector('.node-bg').style.fill = 'rgba(91,111,255,0.2)';
          });
          node.addEventListener('mouseleave', () => {
            infoPanel.innerHTML = skillName === "OSPF" ? "Hover over a router to view OSPF routing metrics." : "Hover over the Switch or Router to inspect their configuration.";
            infoPanel.classList.remove('highlight');
            node.querySelector('.node-bg').style.fill = 'var(--surface)';
          });
        });
      }
    }
  });
});

closeModal.addEventListener('click', () => {
  modal.classList.remove('active');
});

modal.addEventListener('click', (e) => {
  if(e.target === modal) modal.classList.remove('active');
});

// ── HERO STAT COUNT-UP ANIMATION ──
(function() {
  const statNums = document.querySelectorAll('.hero-stat-num[data-target]');
  let counted = false;

  function animateCount(el) {
    const target = parseInt(el.dataset.target);
    const suffix = el.dataset.suffix || '';
    const duration = 1800;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);
      el.innerHTML = current + (suffix ? '<span>' + suffix + '</span>' : '');
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  const statsObs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && !counted) {
      counted = true;
      statNums.forEach((el, i) => {
        setTimeout(() => animateCount(el), i * 200);
      });
    }
  }, { threshold: 0.3 });

  const statsSection = document.querySelector('.hero-stats');
  if (statsSection) statsObs.observe(statsSection);
})();

// ── APPLE-STYLE ANIMATIONS ──

// 1. Loading Curtain
window.addEventListener('load', () => {
  const curtain = document.getElementById('loadingCurtain');
  const bar = document.querySelector('.loading-bar-fill');
  if (curtain && bar) {
    bar.style.width = '100%';
    setTimeout(() => {
      curtain.classList.add('hidden');
    }, 5000);
  }
});

// 2. Scroll Progress Bar
const scrollProgress = document.getElementById('scrollProgress');
window.addEventListener('scroll', () => {
  if (scrollProgress) {
    const scrollPx = document.documentElement.scrollTop;
    const winHeightPx = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollLen = `${scrollPx / winHeightPx * 100}%`;
    scrollProgress.style.width = scrollLen;
  }
});

// 3. 3D Tilt Effect on Cards
const tiltCards = document.querySelectorAll('.skill-card, .cert-card, .project-card');
tiltCards.forEach(card => {
  card.style.transformStyle = 'preserve-3d';
  card.style.perspective = '1000px';
  
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -5;
    const rotateY = ((x - centerX) / centerX) * 5;
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    card.style.transition = 'none';
  });
  
  card.addEventListener('mouseleave', () => {
    card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    card.style.transition = 'transform 0.5s ease-out';
  });
});

// 4. Parallax Hero Orbs
const orb1 = document.querySelector('.hero-orb');
const orb2 = document.querySelector('.hero-orb2');
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  if (orb1) orb1.style.transform = `translate(-50%, calc(-50% + ${y * 0.4}px))`;
  if (orb2) orb2.style.transform = `translateY(${y * 0.2}px)`;
});

// 5. Magnetic Hover on CTA Buttons
const magneticEls = document.querySelectorAll('.btn-main, .btn-outline');
magneticEls.forEach(el => {
  el.addEventListener('mousemove', e => {
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    el.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
    el.style.transition = 'none';
  });
  el.addEventListener('mouseleave', () => {
    el.style.transform = '';
    el.style.transition = 'transform 0.3s cubic-bezier(0.22,1,0.36,1)';
  });
});

// 6. Text Reveal in About section
const aboutParas = document.querySelectorAll('.about-body p');
aboutParas.forEach(p => {
  // Save HTML content to preserve <strong> tags if possible, or just strip them for animation simplicity
  const html = p.innerHTML;
  // Let's keep it simple and just do words, but we need to handle HTML elements inside
  // For safety, let's just do text nodes or split by space but keep innerHTML.
  // Actually, a simpler scroll reveal is to just reveal the whole paragraphs slightly differently,
  // or use intersection observer on the paragraphs to fade them up smoothly.
  // Since we already have .rev classes, let's enhance them instead!
});

const revElements = document.querySelectorAll('.rev');
const revObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });
revElements.forEach(el => revObs.observe(el));

// 7. Theme Toggle (Light/Dark Mode)
const themeToggleBtn = document.getElementById('themeToggle');
const currentTheme = localStorage.getItem('theme');

// If user previously selected light mode, apply it immediately
if (currentTheme === 'light') {
  document.body.classList.add('light-mode');
  const aiImg = document.querySelector('.hero-ai-img');
  if (aiImg) {
    aiImg.src = 'asset/whitetheme_ai.gif';
  }
}

if (themeToggleBtn) {
  themeToggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    
    const isLightMode = document.body.classList.contains('light-mode');
    
    // Update AI GIF
    const aiImg = document.querySelector('.hero-ai-img');
    if (aiImg) {
      aiImg.src = isLightMode ? 'asset/whitetheme_ai.gif' : 'asset/ai.gif';
    }
    
    // Save preference to localStorage
    localStorage.setItem('theme', isLightMode ? 'light' : 'dark');
  });
}



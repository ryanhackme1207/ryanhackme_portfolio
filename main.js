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

// --- SKILL MODAL DATA ---
const skillExplanations = {  "OSI 7-Layer": `<p>The Open Systems Interconnection model describes 7 layers of network communication, from physical hardware to application interfaces. Crucial for troubleshooting and network design.</p>
<div class="osi-stack">
  <div class="osi-layer" style="--delay: 0.1s"><span>7</span> Application</div>
  <div class="osi-layer" style="--delay: 0.2s"><span>6</span> Presentation</div>
  <div class="osi-layer" style="--delay: 0.3s"><span>5</span> Session</div>
  <div class="osi-layer" style="--delay: 0.4s"><span>4</span> Transport</div>
  <div class="osi-layer" style="--delay: 0.5s"><span>3</span> Network</div>
  <div class="osi-layer" style="--delay: 0.6s"><span>2</span> Data Link</div>
  <div class="osi-layer" style="--delay: 0.7s"><span>1</span> Physical</div>
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
  "Subnetting": "The practice of dividing a network into two or more smaller networks. Improves routing efficiency, security, and reduces broadcast domain sizes.",
  "OSPF": "Open Shortest Path First is a link-state routing protocol used to find the best path for packets in large IP networks.",
  "DNS": "Domain Name System translates human-readable domain names into IP addresses. Understanding DNS is critical for preventing spoofing and cache poisoning attacks.",
  "AAA / RADIUS": "Authentication, Authorization, and Accounting frameworks. RADIUS is a protocol used to centrally manage network access.",
  "STP": "Spanning Tree Protocol prevents loop topologies in bridged Ethernet local area networks.",
  "IPSec VPN": "A secure network protocol suite that authenticates and encrypts packets of data to provide secure encrypted communication between two computers over an IP network.",
  "ACL": "Access Control Lists are a set of rules that grant or deny access to network environments, operating as a fundamental network firewall.",
  "Firewall Config": "Designing, implementing, and maintaining rules to monitor and control incoming and outgoing network traffic based on predetermined security rules.",
  "Switches & Routers": "Core networking hardware. Switches connect devices on a computer network, while routers forward data packets between different computer networks.",
  
  "OWASP Top 10": "A standard awareness document representing a broad consensus about the most critical security risks to web applications (e.g., Injection, Broken Authentication).",
  "Kali Linux": "A Debian-derived Linux distribution designed for digital forensics and penetration testing, containing hundreds of pre-installed security tools.",
  "Nmap": "Network Mapper is a free and open-source utility for network discovery and security auditing. It determines what hosts are available, what services they offer, and more.",
  "Wireshark": "The world's foremost and widely-used network protocol analyzer, allowing you to see what's happening on your network at a microscopic level.",
  "Metasploit": "A penetration testing framework that makes hacking simple. It's an essential tool used to find, exploit, and validate vulnerabilities.",
  "Hashcat": "The world's fastest and most advanced password recovery utility, supporting five unique modes of attack for over 300 highly-optimized hashing algorithms.",
  "SQLMap": "An open source penetration testing tool that automates the process of detecting and exploiting SQL injection flaws and taking over of database servers.",
  "SIEM": "Security Information and Event Management systems provide real-time analysis of security alerts generated by applications and network hardware.",
  "Phishing": "The fraudulent attempt to obtain sensitive information by disguising oneself as a trustworthy entity in an electronic communication. I test employee awareness using simulated phishing.",
  "Win Exploitation": "Identifying and leveraging vulnerabilities within the Windows operating system and its associated services to gain unauthorized access.",
  
  "CIA Triad": "Confidentiality, Integrity, and Availability. The core model designed to guide policies for information security within an organization.",
  "Incident Response": "An organized approach to addressing and managing the aftermath of a security breach or cyberattack to limit damage and reduce recovery time.",
  "HIPAA": "Health Insurance Portability and Accountability Act. I understand the stringent data privacy and security provisions for safeguarding medical information.",
  "PDPA": "Personal Data Protection Act. Malaysian legislation that regulates the processing of personal data in commercial transactions.",
  "GDPR": "General Data Protection Regulation. The toughest privacy and security law in the world, imposing obligations onto organizations anywhere.",
  "PCI-DSS": "Payment Card Industry Data Security Standard. Information security standard for organizations that handle branded credit cards from the major card schemes.",
  "ISO 27001": "An international standard on how to manage information security, providing requirements for an Information Security Management System (ISMS).",
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
  });
});

closeModal.addEventListener('click', () => {
  modal.classList.remove('active');
});

modal.addEventListener('click', (e) => {
  if(e.target === modal) modal.classList.remove('active');
});


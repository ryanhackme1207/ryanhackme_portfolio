// ---- THREE.JS BACKGROUND ANIMATION ----
const canvasContainer = document.getElementById('canvas-container');

// Scene setup
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x050505, 0.001);

// Camera setup
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 120;

// Renderer setup
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
canvasContainer.appendChild(renderer.domElement);

// Network / Cyber Particles
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 300;

const posArray = new Float32Array(particlesCount * 3);
const colorsArray = new Float32Array(particlesCount * 3);

const color1 = new THREE.Color(0x00ffcc); // Teal
const color2 = new THREE.Color(0x0088ff); // Blue

for (let i = 0; i < particlesCount * 3; i+=3) {
    // Random positions
    posArray[i] = (Math.random() - 0.5) * 300;
    posArray[i+1] = (Math.random() - 0.5) * 300;
    posArray[i+2] = (Math.random() - 0.5) * 300;

    // Random colors mixing teal and blue
    const mixedColor = color1.clone().lerp(color2, Math.random());
    colorsArray[i] = mixedColor.r;
    colorsArray[i+1] = mixedColor.g;
    colorsArray[i+2] = mixedColor.b;
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorsArray, 3));

// Create a glowing material
const particlesMaterial = new THREE.PointsMaterial({
    size: 2,
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending
});

const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particlesMesh);

// Add connecting lines to simulate network
const lineMaterial = new THREE.LineBasicMaterial({
    color: 0x00ffcc,
    transparent: true,
    opacity: 0.05,
    blending: THREE.AdditiveBlending
});

// Create lines between close particles (simplified approach for performance)
const lineGeometry = new THREE.BufferGeometry();
const linePositions = [];
for (let i = 0; i < particlesCount; i++) {
    for (let j = i + 1; j < particlesCount; j++) {
        const dx = posArray[i*3] - posArray[j*3];
        const dy = posArray[i*3+1] - posArray[j*3+1];
        const dz = posArray[i*3+2] - posArray[j*3+2];
        const distSq = dx*dx + dy*dy + dz*dz;
        
        // Connect if close enough
        if (distSq < 1500 && Math.random() > 0.8) {
            linePositions.push(
                posArray[i*3], posArray[i*3+1], posArray[i*3+2],
                posArray[j*3], posArray[j*3+1], posArray[j*3+2]
            );
        }
    }
}
lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
const linesMesh = new THREE.LineSegments(lineGeometry, lineMaterial);
scene.add(linesMesh);

// Mouse interaction
let mouseX = 0;
let mouseY = 0;
let targetX = 0;
let targetY = 0;

const windowHalfX = window.innerWidth / 2;
const windowHalfY = window.innerHeight / 2;

document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX - windowHalfX);
    mouseY = (event.clientY - windowHalfY);
});

// Animation loop
const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();

    // Smooth mouse follow
    targetX = mouseX * 0.05;
    targetY = mouseY * 0.05;
    
    particlesMesh.rotation.y += 0.05 * (targetX * 0.01 - particlesMesh.rotation.y);
    particlesMesh.rotation.x += 0.05 * (targetY * 0.01 - particlesMesh.rotation.x);
    
    linesMesh.rotation.y = particlesMesh.rotation.y;
    linesMesh.rotation.x = particlesMesh.rotation.x;

    // Slow continuous rotation
    particlesMesh.rotation.y += 0.001;
    linesMesh.rotation.y += 0.001;

    // Slight wave effect
    const positions = particlesGeometry.attributes.position.array;
    for(let i = 0; i < particlesCount; i++) {
        const i3 = i * 3;
        positions[i3 + 1] += Math.sin(elapsedTime + positions[i3]) * 0.02;
    }
    particlesGeometry.attributes.position.needsUpdate = true;

    renderer.render(scene, camera);
}
animate();

// Handle Resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});


// ---- GSAP ANIMATIONS ----
gsap.registerPlugin(ScrollTrigger);

// Typed.js Animation
const typed = new Typed('.typed-text', {
    strings: ['Multimedia University Student', 'Cybersecurity Enthusiast', 'Network Security Expert', 'Network Engineering Prodigy'],
    typeSpeed: 50,
    backSpeed: 30,
    backDelay: 2000,
    loop: true
});

// Hero Section Intro
const tl = gsap.timeline();
tl.from(".logo", { y: -50, opacity: 0, duration: 1, ease: "power3.out" })
  .from(".nav-links li", { y: -50, opacity: 0, duration: 0.8, stagger: 0.1, ease: "power3.out" }, "-=0.5")
  .from(".hero .subtitle", { y: 30, opacity: 0, duration: 0.8, ease: "power3.out" }, "-=0.5")
  .from(".hero .title", { y: 30, opacity: 0, duration: 1, ease: "power3.out" }, "-=0.6")
  .from(".hero .description", { y: 30, opacity: 0, duration: 0.8, ease: "power3.out" }, "-=0.6")
  .from(".hero .cta-buttons .btn", { y: 30, opacity: 0, duration: 0.8, stagger: 0.2, ease: "power3.out" }, "-=0.6");

// Scroll Animations for Sections
gsap.utils.toArray("section").forEach(section => {
    // Skip hero because it's animated on load
    if(section.id === "hero") return;

    gsap.from(section.querySelectorAll(".section-title, .section-content > p, .about-text p, .skill-tag, .badge-wrapper, .contact-card"), {
        scrollTrigger: {
            trigger: section,
            start: "top 80%",
            toggleActions: "play none none reverse"
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out"
    });
});

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
      e.target.classList.add('animate');
    }
  });
}, { threshold: 0.5 });
progFills.forEach(f => { f.style.width = '0%'; progObs.observe(f); });

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

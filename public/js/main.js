/* ==========================================================================
   Ultra-Futuristic Client Micro-Interactions, Web Audio Synth & Dual Cursor
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initDualCursor();
  initParticleCanvas();
  initThemePicker();
  initTypingHeadline();
  initWebAudioSynth();
  initCategoryTabToggle();
  initMouseSpotlight();
  initScrollReveal();
  initCardTiltEffect();
  initHtmxListeners();
});

// Interactive Dual-Ring Neon Cursor
function initDualCursor() {
  const cursor = document.getElementById('custom-cursor');
  const ring = document.getElementById('custom-cursor-ring');
  if (!cursor || !ring) return;

  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    cursor.style.left = `${mouseX}px`;
    cursor.style.top = `${mouseY}px`;
  });

  function renderRing() {
    ringX += (mouseX - ringX) * 0.2;
    ringY += (mouseY - ringY) * 0.2;

    ring.style.left = `${ringX}px`;
    ring.style.top = `${ringY}px`;

    requestAnimationFrame(renderRing);
  }

  renderRing();

  // Hover states for interactive elements
  const hoverSelectors = 'a, button, input, textarea, .cat-btn, .skills-tab-btn, .terminal-tab, .project-card';
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(hoverSelectors)) {
      document.body.classList.add('cursor-hover');
    }
  });

  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(hoverSelectors)) {
      document.body.classList.remove('cursor-hover');
    }
  });
}

// Particle Matrix Canvas Background with Aurora Waves
function initParticleCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  const mouse = { x: null, y: null, radius: 180 };

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = Array.from({ length: 60 }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.5,
    vy: (Math.random() - 0.5) * 0.5,
    radius: Math.random() * 2.2 + 1,
    alpha: Math.random() * 0.6 + 0.25
  }));

  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Dynamic theme color lookup
    const accentColor = getComputedStyle(document.body).getPropertyValue('--accent-cyan').trim() || '#00f2fe';

    particles.forEach((p, i) => {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

      // Mouse interactive repelling
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          p.x -= (dx / dist) * force * 2.5;
          p.y -= (dy / dist) * force * 2.5;
        }
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = accentColor;
      ctx.globalAlpha = p.alpha;
      ctx.fill();

      // Connect nearby particles
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 150) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = accentColor;
          ctx.globalAlpha = 0.2 * (1 - dist / 150);
          ctx.lineWidth = 0.7;
          ctx.stroke();
        }
      }
    });

    ctx.globalAlpha = 1;
    requestAnimationFrame(animate);
  }

  animate();
}

// Live Dynamic Theme Accent Switcher (Cyan, Magenta, Emerald, Amber)
function initThemePicker() {
  const dots = document.querySelectorAll('.theme-dot');
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const theme = dot.getAttribute('data-theme-name');
      if (theme === 'cyan') {
        document.body.removeAttribute('data-theme');
      } else {
        document.body.setAttribute('data-theme', theme);
      }
      playSynthBeep(650, 0.05);
    });
  });
}

// Dynamic Typing Headline Animation
function initTypingHeadline() {
  const el = document.getElementById('typing-text');
  if (!el) return;

  const phrases = [
    "Fast & Server-Driven Digital Systems",
    "Low-Latency Rust Storage Engines",
    "Zero-Bundle HTMX Hypermedia Systems",
    "High-Throughput Distributed Services"
  ];

  let phraseIdx = 0;
  let charIdx = 0;
  let isDeleting = false;

  function type() {
    const currentPhrase = phrases[phraseIdx];

    if (isDeleting) {
      el.textContent = currentPhrase.substring(0, charIdx - 1);
      charIdx--;
    } else {
      el.textContent = currentPhrase.substring(0, charIdx + 1);
      charIdx++;
    }

    let delay = isDeleting ? 40 : 80;

    if (!isDeleting && charIdx === currentPhrase.length) {
      delay = 2200; // Pause at full phrase
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
      delay = 400;
    }

    setTimeout(type, delay);
  }

  type();
}

// Web Audio API Sci-Fi Synthesizer Sound Generator
let audioCtx = null;
let soundEnabled = true;

function initWebAudioSynth() {
  const toggleBtn = document.getElementById('audio-toggle');
  if (!toggleBtn) return;

  toggleBtn.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    toggleBtn.innerHTML = soundEnabled ?
      '<i class="fa-solid fa-volume-high"></i>' :
      '<i class="fa-solid fa-volume-xmark"></i>';
    toggleBtn.classList.toggle('muted', !soundEnabled);
    if (soundEnabled) playSynthBeep(880, 0.08);
  });

  // Attach sound triggers to interactive buttons
  document.addEventListener('click', (e) => {
    if (
      e.target.closest('.btn, .cat-btn, .skills-tab-btn, .terminal-tab, .nav-link, .modal-close-btn')
    ) {
      playSynthBeep(700, 0.04);
    }
  });
}

function playSynthBeep(freq = 600, duration = 0.05) {
  if (!soundEnabled) return;
  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.5, audioCtx.currentTime + duration);

    gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (err) {
    // Ignore audio context autoplay restrictions
  }
}

// Mouse Spotlight Gradient Tracking across Cards
function initMouseSpotlight() {
  document.addEventListener('mousemove', (e) => {
    const cards = document.querySelectorAll('.project-card, .spotlight-card, .skill-card, .article-card');
    cards.forEach(card => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });
}

// Interactive 3D Card Tilt Effect
function initCardTiltEffect() {
  document.addEventListener('mousemove', (e) => {
    const cards = document.querySelectorAll('.project-card');
    cards.forEach(card => {
      const rect = card.getBoundingClientRect();
      if (
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom
      ) {
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const rotateX = ((e.clientY - centerY) / (rect.height / 2)) * -6;
        const rotateY = ((e.clientX - centerX) / (rect.width / 2)) * 6;
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
      } else {
        if (card.style.transform.includes('rotateX')) {
          card.style.transform = '';
        }
      }
    });
  });
}

// Scroll Reveal Intersection Observer
function initScrollReveal() {
  const elements = document.querySelectorAll('.section-header, .project-filters, .contact-container, .skills-grid-container');
  elements.forEach(el => el.classList.add('reveal'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      }
    });
  }, { threshold: 0.15 });

  elements.forEach(el => observer.observe(el));
}

// Active Tab Button Toggle Helper
function initCategoryTabToggle() {
  document.addEventListener('click', (e) => {
    // Project Category Buttons
    if (e.target.matches('.cat-btn')) {
      const parent = e.target.closest('.category-tabs');
      if (parent) {
        parent.querySelectorAll('.cat-btn').forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
      }
    }

    // Skills Category Buttons
    if (e.target.matches('.skills-tab-btn')) {
      const parent = e.target.closest('.skills-nav');
      if (parent) {
        parent.querySelectorAll('.skills-tab-btn').forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
      }
    }

    // Code Terminal Tabs
    if (e.target.matches('.terminal-tab')) {
      const parent = e.target.closest('.terminal-tabs');
      if (parent) {
        parent.querySelectorAll('.terminal-tab').forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
      }
    }
  });
}

// Modal Dismiss Helpers
function closeModal(event) {
  if (event.target.classList.contains('modal-overlay')) {
    closeModalDirect();
  }
}

function closeModalDirect() {
  const container = document.getElementById('modal-container');
  if (container) {
    container.innerHTML = '';
  }
}

// Global ESC key listener to close modal
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeModalDirect();
  }
});

// HTMX Lifecycle Event Listeners
function initHtmxListeners() {
  // Clear contact form on successful response
  document.addEventListener('htmx:afterOnLoad', (evt) => {
    if (evt.detail.target.id === 'contact-response' && evt.detail.xhr.status === 200) {
      const form = document.getElementById('contact-form');
      if (form) form.reset();
    }
  });

  // Re-apply spotlight classes when HTMX injects new project cards
  document.addEventListener('htmx:afterSwap', (evt) => {
    const cards = evt.detail.target.querySelectorAll('.project-card');
    cards.forEach(card => card.classList.add('spotlight-card'));
  });
}

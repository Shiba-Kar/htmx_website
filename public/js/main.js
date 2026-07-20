/* ==========================================================================
   Alpine.js Reactive Component Stores, Web Audio Synth & Micro-Interactions
   ========================================================================== */

document.addEventListener('alpine:init', () => {
  // Global App Shell State
  Alpine.data('portfolioApp', () => ({
    setTheme(theme) {
      if (theme === 'cyan') {
        document.body.removeAttribute('data-theme');
      } else {
        document.body.setAttribute('data-theme', theme);
      }
      playSynthBeep(650, 0.05);
    }
  }));

  // Hero Live Stats State
  Alpine.data('statsApp', () => ({
    stats: { commits: 1480, uptime: '99.99%', activeProjects: 14 },
    async initStats() {
      await this.fetchStats();
      setInterval(() => this.fetchStats(), 15000);
    },
    async fetchStats() {
      try {
        const res = await fetch('/api/stats');
        if (res.ok) {
          this.stats = await res.json();
        }
      } catch (err) {
        console.error('Error fetching stats:', err);
      }
    }
  }));

  // Terminal Code Viewer State
  Alpine.data('terminalApp', () => ({
    activeLang: 'alpine',
    snippet: null,
    async selectLang(lang) {
      this.activeLang = lang;
      await this.fetchSnippet(lang);
      playSynthBeep(750, 0.04);
    },
    async fetchSnippet(lang) {
      try {
        const res = await fetch(`/api/code-snippet/${lang}`);
        if (res.ok) {
          this.snippet = await res.json();
        }
      } catch (err) {
        console.error('Error fetching code snippet:', err);
      }
    }
  }));

  // Projects Grid & Active Search State
  Alpine.data('projectsApp', () => ({
    query: '',
    category: 'all',
    projects: [],
    loading: false,
    init() {
      this.$watch('query', () => this.fetchProjects());
      this.$watch('category', () => this.fetchProjects());
    },
    setCategory(cat) {
      this.category = cat;
      playSynthBeep(700, 0.04);
    },
    async fetchProjects() {
      this.loading = true;
      try {
        const url = `/api/projects?category=${encodeURIComponent(this.category)}&query=${encodeURIComponent(this.query)}`;
        const res = await fetch(url);
        if (res.ok) {
          this.projects = await res.json();
        }
      } catch (err) {
        console.error('Error fetching projects:', err);
      } finally {
        this.loading = false;
      }
    }
  }));

  // Skills Matrix State
  Alpine.data('skillsApp', () => ({
    activeCategory: 'frontend',
    skillsGroup: null,
    async selectCategory(cat) {
      this.activeCategory = cat;
      await this.fetchSkills(cat);
      playSynthBeep(720, 0.04);
    },
    async fetchSkills(cat) {
      try {
        const res = await fetch(`/api/skills?category=${encodeURIComponent(cat)}`);
        if (res.ok) {
          this.skillsGroup = await res.json();
        }
      } catch (err) {
        console.error('Error fetching skills:', err);
      }
    }
  }));

  // Articles Feed & Load More State
  Alpine.data('articlesApp', () => ({
    articles: [],
    page: 1,
    hasMore: true,
    remaining: 0,
    loading: false,
    async fetchArticles() {
      this.loading = true;
      try {
        const res = await fetch(`/api/articles?page=${this.page}`);
        if (res.ok) {
          const data = await res.json();
          this.articles = [...this.articles, ...data.articles];
          this.hasMore = data.hasMore;
          this.remaining = data.remaining;
        }
      } catch (err) {
        console.error('Error fetching articles:', err);
      } finally {
        this.loading = false;
      }
    },
    async loadMore() {
      if (!this.hasMore || this.loading) return;
      this.page++;
      await this.fetchArticles();
      playSynthBeep(680, 0.04);
    }
  }));

  // Contact Form State
  Alpine.data('contactApp', () => ({
    form: { name: '', email: '', subject: '', message: '' },
    successMessage: null,
    errors: [],
    loading: false,
    async submitForm() {
      this.loading = true;
      this.successMessage = null;
      this.errors = [];
      try {
        const res = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.form)
        });
        const data = await res.json();
        if (res.ok && data.success) {
          this.successMessage = data.message;
          this.form = { name: '', email: '', subject: '', message: '' };
          playSynthBeep(900, 0.1);
        } else {
          this.errors = data.errors || ['Form submission error.'];
          playSynthBeep(400, 0.1);
        }
      } catch (err) {
        this.errors = ['Network connection error.'];
      } finally {
        this.loading = false;
      }
    }
  }));

  // Modal Dialog Overlay State
  Alpine.data('modalApp', () => ({
    open: false,
    project: null,
    async openModal(id) {
      try {
        const res = await fetch(`/api/project-detail/${id}`);
        if (res.ok) {
          this.project = await res.json();
          this.open = true;
          playSynthBeep(800, 0.05);
        }
      } catch (err) {
        console.error('Error opening modal:', err);
      }
    },
    close() {
      this.open = false;
      this.project = null;
    }
  }));
});

// Non-Alpine DOM & Micro-Interaction Enhancements
document.addEventListener('DOMContentLoaded', () => {
  initDualCursor();
  initParticleCanvas();
  initTypingHeadline();
  initWebAudioSynth();
  initMouseSpotlight();
  initScrollReveal();
  initCardTiltEffect();
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

// Particle Canvas Backdrop
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
    const accentColor = getComputedStyle(document.body).getPropertyValue('--accent-cyan').trim() || '#00f2fe';

    particles.forEach((p, i) => {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

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

// Dynamic Typing Headline Animation
function initTypingHeadline() {
  const el = document.getElementById('typing-text');
  if (!el) return;

  const phrases = [
    "Fast & Alpine.js Reactive Systems",
    "Low-Latency Go & Rust Backends",
    "Zero-Bloat Declarative Web UI",
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
      delay = 2200;
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

// Web Audio API Synthesizer
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
    // Ignore audio autoplay restrictions
  }
}

// Mouse Spotlight Tracking
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

// Interactive 3D Card Tilt
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

// Scroll Reveal Observer
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

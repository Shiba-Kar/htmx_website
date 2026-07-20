/* ==========================================================================
   Client-Side Interactive Enhancements & Particle Backdrop
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initParticleCanvas();
  initCategoryTabToggle();
  initHtmxListeners();
});

// Particle Matrix Canvas Background
function initParticleCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = Array.from({ length: 45 }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.4,
    vy: (Math.random() - 0.5) * 0.4,
    radius: Math.random() * 2 + 1,
    color: Math.random() > 0.5 ? 'rgba(0, 242, 254, ' : 'rgba(112, 0, 255, ',
    alpha: Math.random() * 0.5 + 0.2
  }));

  function animate() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach((p, i) => {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color + p.alpha + ')';
      ctx.fill();

      // Connect nearby particles with subtle lines
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 130) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(0, 242, 254, ${0.15 * (1 - dist / 130)})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    });

    requestAnimationFrame(animate);
  }

  animate();
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

// HTMX Lifecycle Listener
function initHtmxListeners() {
  // Clear contact form on successful response
  document.addEventListener('htmx:afterOnLoad', (evt) => {
    if (evt.detail.target.id === 'contact-response' && evt.detail.xhr.status === 200) {
      const form = document.getElementById('contact-form');
      if (form) form.reset();
    }
  });
}

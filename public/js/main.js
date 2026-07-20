/* ==========================================================================
   Client-Side Micro-Interactions, 3D Tilt, Mouse Spotlight & Particle Backdrop
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initParticleCanvas();
  initCategoryTabToggle();
  initMouseSpotlight();
  initScrollReveal();
  initCardTiltEffect();
  initHtmxListeners();
});

// Interactive Particle Matrix Backdrop with Mouse Interaction
function initParticleCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  const mouse = { x: null, y: null, radius: 170 };

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

  const particles = Array.from({ length: 55 }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.55,
    vy: (Math.random() - 0.5) * 0.55,
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

      // Mouse proximity interaction
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          p.x -= (dx / dist) * force * 2;
          p.y -= (dy / dist) * force * 2;
        }
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color + p.alpha + ')';
      ctx.fill();

      // Connect nearby particles with glowing lines
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 140) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(0, 242, 254, ${0.18 * (1 - dist / 140)})`;
          ctx.lineWidth = 0.65;
          ctx.stroke();
        }
      }
    });

    requestAnimationFrame(animate);
  }

  animate();
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

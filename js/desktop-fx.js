/* ==========================================================================
   DESKTOP DYNAMICS, FLUID CYBER CURSOR & KINETIC TYPOGRAPHY
   Real-Time Character Spotlight, Magnetic Attraction & Cursor Aura Physics
   ========================================================================== */

export function initDesktopEffects() {
  if (window.innerWidth < 768) return; // Keep mobile lightweight

  initFluidCyberCursor();
  initKineticSpotlightText();
  initLiquidOrbCursorTracking();
  init3DCardTilt();
  initMagneticElements();
  initScrollReveals();
}

/**
 * High-End Cyber Liquid Cursor Follower
 */
function initFluidCyberCursor() {
  // Create cursor elements
  const dot = document.createElement('div');
  dot.className = 'cyber-cursor-dot';
  
  const follower = document.createElement('div');
  follower.className = 'cyber-cursor-follower';

  document.body.appendChild(dot);
  document.body.appendChild(follower);

  let mouseX = -100, mouseY = -100;
  let followerX = -100, followerY = -100;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
  });

  function animateFollower() {
    followerX += (mouseX - followerX) * 0.18;
    followerY += (mouseY - followerY) * 0.18;

    follower.style.transform = `translate3d(${followerX}px, ${followerY}px, 0)`;
    requestAnimationFrame(animateFollower);
  }
  animateFollower();

  // Hover expansion on interactive elements
  const interactives = document.querySelectorAll('a, button, input, .comp-label-btn, .tilt-card, #three-hero-container, .scroll-video-card');
  interactives.forEach(el => {
    el.addEventListener('mouseenter', () => {
      follower.classList.add('cursor-hover');
      dot.classList.add('cursor-hover-dot');
    });
    el.addEventListener('mouseleave', () => {
      follower.classList.remove('cursor-hover');
      dot.classList.remove('cursor-hover-dot');
    });
  });
}

/**
 * Pronounced Kinetic Spotlight Text Engine:
 * Splits headings into reactive spans with real-time radial spotlight tracking
 */
function initKineticSpotlightText() {
  const titles = document.querySelectorAll('.hero-title, .section-title');

  titles.forEach(title => {
    title.addEventListener('mousemove', (e) => {
      const rect = title.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      title.style.setProperty('--spotlight-x', `${x}px`);
      title.style.setProperty('--spotlight-y', `${y}px`);

      // Dynamic 3D micro-tilt on the heading
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const tiltX = ((y - centerY) / centerY) * -4;
      const tiltY = ((x - centerX) / centerX) * 4;

      title.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
      title.style.textShadow = `${tiltY * -2}px ${tiltX * -2}px 28px rgba(245, 158, 11, 0.6), 0 0 16px rgba(255, 255, 255, 0.4)`;
    });

    title.addEventListener('mouseleave', () => {
      title.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg)';
      title.style.textShadow = 'none';
    });
  });

  // Body paragraphs proximity illumination
  const bodyTexts = document.querySelectorAll('.lead-text, .glass-card p');
  window.addEventListener('mousemove', (e) => {
    bodyTexts.forEach(el => {
      const rect = el.getBoundingClientRect();
      const dist = Math.hypot(e.clientX - (rect.left + rect.width / 2), e.clientY - (rect.top + rect.height / 2));
      if (dist < 280) {
        const factor = (1 - dist / 280);
        el.style.color = `rgba(248, 250, 252, ${0.7 + factor * 0.3})`;
        el.style.textShadow = `0 0 10px rgba(245, 158, 11, ${factor * 0.3})`;
      } else {
        el.style.color = '';
        el.style.textShadow = '';
      }
    });
  });
}

/**
 * Ambient Liquid Orbs smoothly drift and react to cursor coordinates
 */
function initLiquidOrbCursorTracking() {
  const orb1 = document.querySelector('.orb-1');
  const orb2 = document.querySelector('.orb-2');
  const orb3 = document.querySelector('.orb-3');

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let currentX = mouseX;
  let currentY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function updateOrbs() {
    currentX += (mouseX - currentX) * 0.04;
    currentY += (mouseY - currentY) * 0.04;

    const offsetX = (currentX / window.innerWidth - 0.5) * 100;
    const offsetY = (currentY / window.innerHeight - 0.5) * 100;

    if (orb1) orb1.style.transform = `translate(${offsetX * 1.4}px, ${offsetY * 1.4}px)`;
    if (orb2) orb2.style.transform = `translate(${-offsetX * 1.8}px, ${-offsetY * 1.8}px)`;
    if (orb3) orb3.style.transform = `translate(${offsetX * 1.1}px, ${-offsetY * 1.1}px)`;

    requestAnimationFrame(updateOrbs);
  }

  updateOrbs();
}

/**
 * 3D Tilt & Specular Optical Glare for Project Cards & Containers
 */
function init3DCardTilt() {
  const tiltCards = document.querySelectorAll('.tilt-card');

  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -7;
      const rotateY = ((x - centerX) / centerX) * 7;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
      
      // Update dynamic glare position
      card.style.setProperty('--glare-x', `${(x / rect.width) * 100}%`);
      card.style.setProperty('--glare-y', `${(y / rect.height) * 100}%`);
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    });
  });
}

/**
 * Magnetic CTAs: Gently attract toward cursor on hover
 */
function initMagneticElements() {
  const magnetics = document.querySelectorAll('.btn-magnetic');

  magnetics.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - (rect.left + rect.width / 2);
      const y = e.clientY - (rect.top + rect.height / 2);

      btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0px, 0px)';
    });
  });
}

/**
 * Kinetic Scroll Reveals with staggered opacity & smooth upward drift
 */
function initScrollReveals() {
  const reveals = document.querySelectorAll('.reveal-on-scroll');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

  reveals.forEach(el => observer.observe(el));
}

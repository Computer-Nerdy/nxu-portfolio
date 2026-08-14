/* ==========================================================================
   DESKTOP DYNAMICS & CURSOR-REACTIVE TEXT ENGINE
   Real-Time Cursor Proximity, 3D Card Tilt, Magnetic Physics & Kinetic Scroll
   ========================================================================== */

export function initDesktopEffects() {
  if (window.innerWidth < 768) return; // Keep mobile lightweight

  initCursorReactiveText();
  initLiquidOrbCursorTracking();
  init3DCardTilt();
  initMagneticElements();
  initScrollReveals();
}

/**
 * Cursor-Reactive Text Engine:
 * Headings, titles, and text dynamically illuminate and track the cursor position
 */
function initCursorReactiveText() {
  const reactiveHeadings = document.querySelectorAll('.hero-title, .section-title, .reactive-text, .tilt-card h3');

  window.addEventListener('mousemove', (e) => {
    reactiveHeadings.forEach(el => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Set cursor coordinate relative to each text element
      el.style.setProperty('--text-mouse-x', `${x}px`);
      el.style.setProperty('--text-mouse-y', `${y}px`);

      // Proximity check for magnetic subtle tilt
      const dist = Math.hypot(e.clientX - (rect.left + rect.width / 2), e.clientY - (rect.top + rect.height / 2));
      if (dist < 350) {
        const intensity = (1 - dist / 350);
        const shiftX = ((e.clientX - (rect.left + rect.width / 2)) / rect.width) * 4 * intensity;
        const shiftY = ((e.clientY - (rect.top + rect.height / 2)) / rect.height) * 4 * intensity;
        el.style.textShadow = `${shiftX * -1.5}px ${shiftY * -1.5}px 24px rgba(245, 158, 11, ${0.4 * intensity}), 0 0 12px rgba(255, 255, 255, ${0.3 * intensity})`;
      } else {
        el.style.textShadow = 'none';
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

    const offsetX = (currentX / window.innerWidth - 0.5) * 80;
    const offsetY = (currentY / window.innerHeight - 0.5) * 80;

    if (orb1) orb1.style.transform = `translate(${offsetX * 1.3}px, ${offsetY * 1.3}px)`;
    if (orb2) orb2.style.transform = `translate(${-offsetX * 1.6}px, ${-offsetY * 1.6}px)`;
    if (orb3) orb3.style.transform = `translate(${offsetX * 0.9}px, ${-offsetY * 0.9}px)`;

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

      const rotateX = ((y - centerY) / centerY) * -6;
      const rotateY = ((x - centerX) / centerX) * 6;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
      
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

      btn.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
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

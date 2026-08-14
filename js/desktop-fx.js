/* ==========================================================================
   DESKTOP DYNAMICS & REACTIVE LIQUID GLASS FX
   Cursor Physics, 3D Tilt Parallax, Specular Glare & Kinetic Scroll
   ========================================================================== */

export function initDesktopEffects() {
  if (window.innerWidth < 768) return; // Keep mobile ultra-fast

  initLiquidOrbCursorTracking();
  init3DCardTilt();
  initMagneticElements();
  initScrollReveals();
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

    const offsetX = (currentX / window.innerWidth - 0.5) * 60;
    const offsetY = (currentY / window.innerHeight - 0.5) * 60;

    if (orb1) orb1.style.transform = `translate(${offsetX * 1.2}px, ${offsetY * 1.2}px)`;
    if (orb2) orb2.style.transform = `translate(${-offsetX * 1.5}px, ${-offsetY * 1.5}px)`;
    if (orb3) orb3.style.transform = `translate(${offsetX * 0.8}px, ${-offsetY * 0.8}px)`;

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
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  reveals.forEach(el => observer.observe(el));
}

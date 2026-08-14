/* ==========================================================================
   OVER-REACTIVE DESKTOP DYNAMICS, VELOCITY CURSOR & CHARACTER-LEVEL KINETIC PHYSICS
   Individual letter repulsion, specular illumination, fluid wave displacement, and elastic recovery
   ========================================================================== */

export function initDesktopEffects() {
  if (window.innerWidth < 768) return; // Keep mobile lightweight

  initVelocityCyberCursor();
  initCharacterKineticPhysics();
  initLiquidOrbCursorTracking();
  init3DCardTilt();
  initMagneticElements();
  initScrollReveals();
}

/**
 * Velocity-Stretching Cyber Cursor with Shockwave Click Ripples
 */
function initVelocityCyberCursor() {
  const dot = document.createElement('div');
  dot.className = 'cyber-cursor-dot';

  const follower = document.createElement('div');
  follower.className = 'cyber-cursor-follower';

  document.body.appendChild(dot);
  document.body.appendChild(follower);

  let mouseX = -100, mouseY = -100;
  let prevMouseX = -100, prevMouseY = -100;
  let followerX = -100, followerY = -100;
  let currentAngle = 0;
  let currentScaleX = 1, currentScaleY = 1;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
  });

  function animateCursor() {
    const vx = mouseX - prevMouseX;
    const vy = mouseY - prevMouseY;
    const speed = Math.min(Math.hypot(vx, vy), 40);

    prevMouseX = mouseX;
    prevMouseY = mouseY;

    followerX += (mouseX - followerX) * 0.2;
    followerY += (mouseY - followerY) * 0.2;

    if (speed > 1.5) {
      currentAngle = Math.atan2(vy, vx);
      currentScaleX = 1 + speed * 0.035;
      currentScaleY = Math.max(0.65, 1 - speed * 0.02);
    } else {
      currentScaleX += (1 - currentScaleX) * 0.15;
      currentScaleY += (1 - currentScaleY) * 0.15;
    }

    follower.style.transform = `translate3d(${followerX}px, ${followerY}px, 0) rotate(${currentAngle}rad) scale(${currentScaleX}, ${currentScaleY})`;
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Click Shockwave Effect
  window.addEventListener('click', (e) => {
    const wave = document.createElement('div');
    wave.className = 'cursor-shockwave';
    wave.style.left = `${e.clientX}px`;
    wave.style.top = `${e.clientY}px`;
    document.body.appendChild(wave);

    setTimeout(() => wave.remove(), 600);
  });

  // Hover expansion on interactives
  const interactives = document.querySelectorAll('a, button, input, .comp-label-btn, .tilt-card, #three-hero-container');
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
 * Character-Level Kinetic Typography Engine:
 * Splits headings into individual interactive characters that repel, scale up,
 * push adjacent letters away, and light up with specular amber glow.
 */
function initCharacterKineticPhysics() {
  const headingElements = document.querySelectorAll('.hero-title, .section-title, .brand-name');
  const charNodes = [];

  headingElements.forEach(heading => {
    // Process text nodes to wrap letters in spans while preserving special markup
    wrapTextNodesInKineticSpans(heading, charNodes);
  });

  let mouse = { x: -2000, y: -2000 };

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = -2000;
    mouse.y = -2000;
  });

  // Kinetic Physics Update Loop
  function updateKineticChars() {
    charNodes.forEach(item => {
      const rect = item.element.getBoundingClientRect();
      const charCenterX = rect.left + rect.width / 2;
      const charCenterY = rect.top + rect.height / 2;

      const dx = mouse.x - charCenterX;
      const dy = mouse.y - charCenterY;
      const dist = Math.hypot(dx, dy);
      const radius = 130;

      if (dist < radius) {
        const force = Math.pow((1 - dist / radius), 1.8);
        const angle = Math.atan2(dy, dx);

        // Repel away from cursor
        item.targetX = -Math.cos(angle) * 26 * force;
        item.targetY = -Math.sin(angle) * 22 * force;
        item.targetScale = 1 + 0.38 * force;
        item.targetGlow = force;
      } else {
        item.targetX = 0;
        item.targetY = 0;
        item.targetScale = 1;
        item.targetGlow = 0;
      }

      // Elastic Spring Interpolation (Damping)
      item.currentX += (item.targetX - item.currentX) * 0.16;
      item.currentY += (item.targetY - item.currentY) * 0.16;
      item.currentScale += (item.targetScale - item.currentScale) * 0.16;
      item.currentGlow += (item.targetGlow - item.currentGlow) * 0.16;

      // Apply transform & glowing specular illumination
      if (Math.abs(item.currentX) > 0.01 || Math.abs(item.currentY) > 0.01 || Math.abs(item.currentScale - 1) > 0.01) {
        item.element.style.transform = `translate3d(${item.currentX}px, ${item.currentY}px, 0) scale(${item.currentScale})`;
        
        if (item.currentGlow > 0.08) {
          item.element.style.color = '#FFFFFF';
          item.element.style.textShadow = `0 0 18px rgba(245, 158, 11, ${item.currentGlow * 0.9}), 0 0 36px rgba(245, 158, 11, ${item.currentGlow * 0.6}), 0 0 60px rgba(217, 119, 6, ${item.currentGlow * 0.4})`;
        } else {
          item.element.style.color = '';
          item.element.style.textShadow = '';
        }
      } else {
        item.element.style.transform = 'translate3d(0, 0, 0) scale(1)';
        item.element.style.color = '';
        item.element.style.textShadow = '';
      }
    });

    requestAnimationFrame(updateKineticChars);
  }

  updateKineticChars();
}

function wrapTextNodesInKineticSpans(container, charList) {
  const childNodes = Array.from(container.childNodes);

  childNodes.forEach(node => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent;
      if (!text.trim() && text.length === 0) return;

      const fragment = document.createDocumentFragment();
      for (let i = 0; i < text.length; i++) {
        const char = text[i];
        if (char === ' ') {
          fragment.appendChild(document.createTextNode(' '));
        } else {
          const span = document.createElement('span');
          span.className = 'kinetic-char';
          span.textContent = char;
          fragment.appendChild(span);

          charList.push({
            element: span,
            currentX: 0,
            currentY: 0,
            targetX: 0,
            targetY: 0,
            currentScale: 1,
            targetScale: 1,
            currentGlow: 0,
            targetGlow: 0
          });
        }
      }
      container.replaceChild(fragment, node);
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      wrapTextNodesInKineticSpans(node, charList);
    }
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

    const offsetX = (currentX / window.innerWidth - 0.5) * 110;
    const offsetY = (currentY / window.innerHeight - 0.5) * 110;

    if (orb1) orb1.style.transform = `translate(${offsetX * 1.5}px, ${offsetY * 1.5}px)`;
    if (orb2) orb2.style.transform = `translate(${-offsetX * 1.9}px, ${-offsetY * 1.9}px)`;
    if (orb3) orb3.style.transform = `translate(${offsetX * 1.2}px, ${-offsetY * 1.2}px)`;

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

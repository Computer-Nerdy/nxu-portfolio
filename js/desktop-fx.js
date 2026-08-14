/* ==========================================================================
   HYPER-REACTIVE CHARACTER KINETICS — CRYSTAL SHARP & PROPER WORD WRAPPING
   Zero word-mangling, dynamic word wrapping, crystal-sharp typography
   ========================================================================== */

export function initDesktopEffects() {
  if (window.innerWidth < 768) return; // Keep mobile lightweight

  initVelocitySparkCursor();
  initCrystalSharpKineticPhysics();
  initSmoothParagraphIllumination();
  initLiquidOrbCursorTracking();
  init3DCardTilt();
  initMagneticElements();
  initScrollReveals();
}

/**
 * Velocity-Stretching Cursor with Neon Trailing Sparks & Shockwaves
 */
function initVelocitySparkCursor() {
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
  let sparkCounter = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;

    sparkCounter++;
    if (sparkCounter % 2 === 0) {
      spawnCursorSpark(mouseX, mouseY);
    }
  });

  function animateCursor() {
    const vx = mouseX - prevMouseX;
    const vy = mouseY - prevMouseY;
    const speed = Math.min(Math.hypot(vx, vy), 45);

    prevMouseX = mouseX;
    prevMouseY = mouseY;

    followerX += (mouseX - followerX) * 0.22;
    followerY += (mouseY - followerY) * 0.22;

    if (speed > 1.5) {
      currentAngle = Math.atan2(vy, vx);
      currentScaleX = 1 + speed * 0.045;
      currentScaleY = Math.max(0.6, 1 - speed * 0.025);
    } else {
      currentScaleX += (1 - currentScaleX) * 0.15;
      currentScaleY += (1 - currentScaleY) * 0.15;
    }

    follower.style.transform = `translate3d(${followerX}px, ${followerY}px, 0) rotate(${currentAngle}rad) scale(${currentScaleX}, ${currentScaleY})`;
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Click Shockwave Burst
  window.addEventListener('click', (e) => {
    const wave = document.createElement('div');
    wave.className = 'cursor-shockwave';
    wave.style.left = `${e.clientX}px`;
    wave.style.top = `${e.clientY}px`;
    document.body.appendChild(wave);

    for (let i = 0; i < 8; i++) {
      spawnCursorSpark(e.clientX + (Math.random() - 0.5) * 40, e.clientY + (Math.random() - 0.5) * 40);
    }

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

function spawnCursorSpark(x, y) {
  const spark = document.createElement('div');
  spark.className = 'kinetic-spark';
  spark.style.left = `${x}px`;
  spark.style.top = `${y}px`;
  
  const vx = (Math.random() - 0.5) * 3;
  const vy = (Math.random() - 0.5) * 3 - 1;
  const color = Math.random() > 0.3 ? '#F59E0B' : '#38BDF8';
  spark.style.backgroundColor = color;
  spark.style.boxShadow = `0 0 8px ${color}`;

  document.body.appendChild(spark);

  let curX = x, curY = y;
  let opacity = 1;
  let scale = Math.random() * 0.8 + 0.6;

  function animateSpark() {
    curX += vx;
    curY += vy;
    opacity -= 0.04;
    scale *= 0.94;

    spark.style.transform = `translate3d(${curX - x}px, ${curY - y}px, 0) scale(${scale})`;
    spark.style.opacity = opacity;

    if (opacity > 0) {
      requestAnimationFrame(animateSpark);
    } else {
      spark.remove();
    }
  }
  requestAnimationFrame(animateSpark);
}

/**
 * Crystal-Sharp Character Kinetic Typography with Dynamic Word Boundary Protection
 */
function initCrystalSharpKineticPhysics() {
  const headingElements = document.querySelectorAll('.hero-title, .section-title, .brand-name, .tilt-card h3');
  const charNodes = [];

  headingElements.forEach(heading => {
    wrapTextNodesInKineticWords(heading, charNodes);
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

  const TOTAL_LINGER_MS = 2200;

  function updateKineticPhysics() {
    const now = Date.now();

    charNodes.forEach(item => {
      const rect = item.element.getBoundingClientRect();
      const charCenterX = rect.left + rect.width / 2;
      const charCenterY = rect.top + rect.height / 2;

      const dx = mouse.x - charCenterX;
      const dy = mouse.y - charCenterY;
      const dist = Math.hypot(dx, dy);
      const radius = 140;

      if (dist < radius) {
        item.lastActiveTime = now;
        const force = Math.pow((1 - dist / radius), 1.4);
        const angle = Math.atan2(dy, dx);

        item.targetX = -Math.cos(angle) * 22 * force;
        item.targetY = -Math.sin(angle) * 18 * force;
        item.targetRotate = -Math.sin(angle) * 12 * force;
        item.targetScale = 1 + 0.24 * force;
        item.targetGlow = force;
      } else {
        const elapsed = now - item.lastActiveTime;

        if (elapsed < TOTAL_LINGER_MS) {
          const progress = elapsed / TOTAL_LINGER_MS;
          const easeFactor = 0.5 * (1 + Math.cos(Math.PI * progress));

          item.targetX = 0;
          item.targetY = -1 * easeFactor;
          item.targetRotate = 0;
          item.targetScale = 1 + 0.04 * easeFactor;
          item.targetGlow = easeFactor * 0.85;
        } else {
          item.targetX = 0;
          item.targetY = 0;
          item.targetRotate = 0;
          item.targetScale = 1;
          item.targetGlow = 0;
        }
      }

      const lerpFactor = 0.14;
      item.currentX += (item.targetX - item.currentX) * lerpFactor;
      item.currentY += (item.targetY - item.currentY) * lerpFactor;
      item.currentRotate += (item.targetRotate - item.currentRotate) * lerpFactor;
      item.currentScale += (item.targetScale - item.currentScale) * lerpFactor;
      item.currentGlow += (item.targetGlow - item.currentGlow) * lerpFactor;

      if (Math.abs(item.currentX) > 0.01 || Math.abs(item.currentY) > 0.01 || Math.abs(item.currentScale - 1) > 0.005) {
        item.element.style.transform = `translate3d(${item.currentX.toFixed(2)}px, ${item.currentY.toFixed(2)}px, 0) rotate(${item.currentRotate.toFixed(2)}deg) scale(${item.currentScale.toFixed(3)})`;
        
        if (item.currentGlow > 0.04) {
          item.element.style.color = '#FFFFFF';
          item.element.style.textShadow = `0 0 1px #FFFFFF, 0 0 8px rgba(245, 158, 11, ${(item.currentGlow * 0.8).toFixed(2)})`;
        } else {
          item.element.style.color = '';
          item.element.style.textShadow = '';
        }
      } else {
        item.element.style.transform = 'translate3d(0, 0, 0) rotate(0deg) scale(1)';
        item.element.style.color = '';
        item.element.style.textShadow = '';
      }
    });

    requestAnimationFrame(updateKineticPhysics);
  }

  updateKineticPhysics();
}

/**
 * Word-level wrapper: Ensures words never break awkwardly across lines,
 * while allowing each letter inside the word to dynamically react to cursor.
 */
function wrapTextNodesInKineticWords(container, charList) {
  const childNodes = Array.from(container.childNodes);

  childNodes.forEach(node => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent;
      if (!text.trim() && text.length === 0) return;

      const fragment = document.createDocumentFragment();
      // Split into words by whitespace
      const words = text.split(/(\s+)/);

      words.forEach(part => {
        if (/^\s+$/.test(part)) {
          // Preserve exact whitespace
          fragment.appendChild(document.createTextNode(part));
        } else if (part.length > 0) {
          // Create a word container that cannot be broken mid-word
          const wordSpan = document.createElement('span');
          wordSpan.className = 'kinetic-word';

          for (let i = 0; i < part.length; i++) {
            const char = part[i];
            const charSpan = document.createElement('span');
            charSpan.className = 'kinetic-char';
            charSpan.textContent = char;
            wordSpan.appendChild(charSpan);

            charList.push({
              element: charSpan,
              currentX: 0,
              currentY: 0,
              targetX: 0,
              targetY: 0,
              currentRotate: 0,
              targetRotate: 0,
              currentScale: 1,
              targetScale: 1,
              currentGlow: 0,
              targetGlow: 0,
              lastActiveTime: 0
            });
          }
          fragment.appendChild(wordSpan);
        }
      });

      container.replaceChild(fragment, node);
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      wrapTextNodesInKineticWords(node, charList);
    }
  });
}

/**
 * Paragraph & Description Illumination with Continuous Smoothstep Fade
 */
function initSmoothParagraphIllumination() {
  const bodyTexts = document.querySelectorAll('.lead-text, .glass-card p, .grid-skills li');
  const textItems = [];

  bodyTexts.forEach(el => {
    textItems.push({ element: el, lastActive: 0 });
  });

  window.addEventListener('mousemove', (e) => {
    const now = Date.now();
    textItems.forEach(item => {
      const rect = item.element.getBoundingClientRect();
      const dist = Math.hypot(e.clientX - (rect.left + rect.width / 2), e.clientY - (rect.top + rect.height / 2));
      if (dist < 260) {
        item.lastActive = now;
        item.element.classList.add('text-illuminated');
      }
    });
  });

  function checkParagraphFades() {
    const now = Date.now();
    textItems.forEach(item => {
      if (item.lastActive > 0 && now - item.lastActive > 2400) {
        item.element.classList.remove('text-illuminated');
      }
    });
    requestAnimationFrame(checkParagraphFades);
  }
  checkParagraphFades();
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

      const rotateX = ((y - centerY) / centerY) * -8;
      const rotateY = ((x - centerX) / centerX) * 8;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
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

      btn.style.transform = `translate(${x * 0.35}px, ${y * 0.35}px)`;
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

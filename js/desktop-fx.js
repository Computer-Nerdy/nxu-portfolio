/* ==========================================================================
   HIGH-VISIBILITY KINETIC TEXT MOTION & ELASTIC SPRING ENGINE
   - 100% Solid & Permanent Text Visibility at all times (Zero Opacity Drop)
   - Interactive Elastic Magnetic Text Sway, Elevation & Specular Starlight Glow
   - Velocity Cursor & 3D Tilt Parallax
   ========================================================================== */

export function initDesktopEffects() {
  if (window.innerWidth < 768) return; // Keep mobile lightweight

  initVelocitySparkCursor();
  initLiquidOrbCursorTracking();
  init3DCardTilt();
  initMagneticElements();
  initHighVisibilityKineticText();
}

/**
 * High-Visibility Kinetic Text Motion:
 * Words float, tilt, and illuminate dynamically near cursor with 100% continuous opacity.
 */
function initHighVisibilityKineticText() {
  const targetHeadings = document.querySelectorAll('.hero-title, .section-title, .brand-name');
  const wordsList = [];

  targetHeadings.forEach(heading => {
    wrapWordsForKineticMotion(heading, wordsList);
  });

  let mouseX = -1000, mouseY = -1000;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  window.addEventListener('mouseleave', () => {
    mouseX = -1000;
    mouseY = -1000;
  });

  function updateKineticMotion() {
    for (let i = 0; i < wordsList.length; i++) {
      const item = wordsList[i];
      const rect = item.element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const dx = mouseX - centerX;
      const dy = mouseY - centerY;
      const dist = Math.hypot(dx, dy);

      if (dist < 130) {
        const force = (1 - dist / 130);
        item.targetY = -force * 7;
        item.targetX = (dx / dist) * force * 3;
        item.targetScale = 1 + force * 0.04;
        item.targetRotate = (dx > 0 ? 1 : -1) * force * 2.5;
        item.targetGlow = force;
      } else {
        item.targetX = 0;
        item.targetY = 0;
        item.targetScale = 1;
        item.targetRotate = 0;
        item.targetGlow = 0;
      }

      // Smooth Spring Lerp
      item.currentX += (item.targetX - item.currentX) * 0.16;
      item.currentY += (item.targetY - item.currentY) * 0.16;
      item.currentScale += (item.targetScale - item.currentScale) * 0.16;
      item.currentRotate += (item.targetRotate - item.currentRotate) * 0.16;
      item.currentGlow += (item.targetGlow - item.currentGlow) * 0.16;

      if (Math.abs(item.currentY) > 0.05 || Math.abs(item.currentX) > 0.05 || Math.abs(item.currentScale - 1) > 0.005) {
        item.element.style.transform = `translate3d(${item.currentX.toFixed(2)}px, ${item.currentY.toFixed(2)}px, 0) rotate(${item.currentRotate.toFixed(2)}deg) scale(${item.currentScale.toFixed(3)})`;
        if (item.currentGlow > 0.05) {
          item.element.style.textShadow = `0 0 10px rgba(255, 255, 255, ${(item.currentGlow * 0.7).toFixed(2)}), 0 0 25px rgba(56, 189, 248, ${(item.currentGlow * 0.5).toFixed(2)})`;
        } else {
          item.element.style.textShadow = '';
        }
      } else {
        item.element.style.transform = 'translate3d(0, 0, 0) rotate(0deg) scale(1)';
        item.element.style.textShadow = '';
      }
    }

    requestAnimationFrame(updateKineticMotion);
  }

  updateKineticMotion();
}

function wrapWordsForKineticMotion(element, wordsList) {
  const childNodes = Array.from(element.childNodes);

  childNodes.forEach(node => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent;
      if (!text.trim() && text.length === 0) return;

      const fragment = document.createDocumentFragment();
      const words = text.split(/(\s+)/);

      words.forEach(part => {
        if (/^\s+$/.test(part)) {
          fragment.appendChild(document.createTextNode(part));
        } else if (part.length > 0) {
          const wordSpan = document.createElement('span');
          wordSpan.className = 'interactive-kinetic-word';
          wordSpan.textContent = part;
          fragment.appendChild(wordSpan);

          wordsList.push({
            element: wordSpan,
            currentX: 0,
            currentY: 0,
            targetX: 0,
            targetY: 0,
            currentRotate: 0,
            targetRotate: 0,
            currentScale: 1,
            targetScale: 1,
            currentGlow: 0,
            targetGlow: 0
          });
        }
      });

      element.replaceChild(fragment, node);
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      wrapWordsForKineticMotion(node, wordsList);
    }
  });
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
    if (sparkCounter % 3 === 0) {
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

    for (let i = 0; i < 6; i++) {
      spawnCursorSpark(e.clientX + (Math.random() - 0.5) * 30, e.clientY + (Math.random() - 0.5) * 30);
    }

    setTimeout(() => wave.remove(), 600);
  });

  // Hover expansion on interactives
  const interactives = document.querySelectorAll('a, button, input, .tilt-card, .interactive-kinetic-word');
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
  spark.className = 'cursor-spark';
  
  const size = Math.random() * 4 + 2;
  const hue = Math.random() > 0.5 ? '#38BDF8' : '#EC4899';

  spark.style.width = `${size}px`;
  spark.style.height = `${size}px`;
  spark.style.left = `${x}px`;
  spark.style.top = `${y}px`;
  spark.style.backgroundColor = hue;
  spark.style.boxShadow = `0 0 ${size * 2}px ${hue}`;

  const vx = (Math.random() - 0.5) * 45;
  const vy = (Math.random() - 0.5) * 45;

  document.body.appendChild(spark);

  requestAnimationFrame(() => {
    spark.style.transform = `translate3d(${vx}px, ${vy}px, 0) scale(0)`;
    spark.style.opacity = '0';
  });

  setTimeout(() => spark.remove(), 550);
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
    if (orb3) orb3.style.transform = `translate(${offsetX * 0.8}px, ${offsetY * 1.4}px)`;

    requestAnimationFrame(updateOrbs);
  }
  updateOrbs();
}

/**
 * High-Precision 3D Tilt for Interactive Cards
 */
function init3DCardTilt() {
  const cards = document.querySelectorAll('.tilt-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -6;
      const rotateY = ((x - centerX) / centerX) * 6;

      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-2px)`;

      const glareX = (x / rect.width) * 100;
      const glareY = (y / rect.height) * 100;
      card.style.setProperty('--glare-x', `${glareX}%`);
      card.style.setProperty('--glare-y', `${glareY}%`);
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
    });
  });
}

/**
 * Magnetic Button Attraction
 */
function initMagneticElements() {
  const magneticEls = document.querySelectorAll('.btn-magnetic');

  magneticEls.forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - (rect.left + rect.width / 2);
      const y = e.clientY - (rect.top + rect.height / 2);

      el.style.transform = `translate3d(${(x * 0.22).toFixed(2)}px, ${(y * 0.22).toFixed(2)}px, 0)`;
    });

    el.addEventListener('mouseleave', () => {
      el.style.transform = 'translate3d(0, 0, 0)';
    });
  });
}

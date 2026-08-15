/* ==========================================================================
   DESKTOP INTERACTIVE EFFECTS (SOLID STABLE TEXT ENGINE)
   - Zero character splitting or text disappearing/reappearing
   - Velocity-stretching cursor & magnetic interactive buttons
   - 3D card tilt & smooth cursor parallax
   ========================================================================== */

export function initDesktopEffects() {
  if (window.innerWidth < 768) return; // Keep mobile lightweight

  initVelocitySparkCursor();
  initLiquidOrbCursorTracking();
  init3DCardTilt();
  initMagneticElements();
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
  const interactives = document.querySelectorAll('a, button, input, .tilt-card');
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

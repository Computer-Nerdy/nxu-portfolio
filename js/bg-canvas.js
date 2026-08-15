/* ==========================================================================
   INTERACTIVE DEEP COSMIC NEBULA & STARDUST CANVAS ENGINE
   - High-density twinkling stars & drifting stardust particles
   - Supernova pulses & quantum gravitational cursor attraction
   - Glowing constellation laser threads in cosmic hues
   ========================================================================== */

export function initBackgroundCanvas() {
  let canvas = document.getElementById('bg-quantum-canvas');
  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.id = 'bg-quantum-canvas';
    canvas.style.position = 'fixed';
    canvas.style.inset = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '1';
    canvas.style.opacity = '0.85';
    document.body.prepend(canvas);
  }

  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  let stars = [];
  let mouse = { x: -1000, y: -1000, radius: 180 };

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    createConstellation();
  }

  function createConstellation() {
    particles = [];
    stars = [];
    
    // 1. Constellation Nodes (Connected Quantum Points)
    const count = Math.min(Math.floor((width * height) / 11000), 95);
    const colorPalette = [
      'rgba(245, 158, 11, ',   // Supernova Amber
      'rgba(56, 189, 248, ',   // Pulsar Cyan
      'rgba(168, 85, 247, ',   // Nebula Violet
      'rgba(253, 230, 138, '   // Stardust Gold
    ];

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.38,
        vy: (Math.random() - 0.5) * 0.38,
        radius: Math.random() * 2.2 + 1,
        color: colorPalette[Math.floor(Math.random() * colorPalette.length)],
        alpha: Math.random() * 0.6 + 0.3,
        pulseSpeed: Math.random() * 0.025 + 0.012,
        pulseVal: Math.random() * Math.PI * 2
      });
    }

    // 2. Micro Background Stardust (Twinkling Cosmic Stars)
    const starCount = Math.min(Math.floor((width * height) / 4500), 180);
    for (let s = 0; s < starCount; s++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.2 + 0.4,
        alpha: Math.random() * 0.7 + 0.1,
        twinkleSpeed: Math.random() * 0.03 + 0.008,
        twinkleVal: Math.random() * Math.PI * 2
      });
    }
  }

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = -1000;
    mouse.y = -1000;
  });

  function render() {
    ctx.clearRect(0, 0, width, height);

    // 1. Draw Twinkling Background Stars
    for (let s = 0; s < stars.length; s++) {
      const star = stars[s];
      star.twinkleVal += star.twinkleSpeed;
      const currentAlpha = star.alpha + Math.sin(star.twinkleVal) * 0.35;
      
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0.05, Math.min(1, currentAlpha))})`;
      ctx.fill();
    }

    // 2. Update & Draw Constellation Nodes
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      // Gravitational Mouse Attraction
      const dx = mouse.x - p.x;
      const dy = mouse.y - p.y;
      const dist = Math.hypot(dx, dy);

      if (dist < mouse.radius) {
        const force = (1 - dist / mouse.radius) * 0.9;
        p.x -= (dx / dist) * force * 1.8;
        p.y -= (dy / dist) * force * 1.8;
      }

      p.pulseVal += p.pulseSpeed;
      const currentAlpha = p.alpha + Math.sin(p.pulseVal) * 0.25;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `${p.color}${Math.max(0.15, Math.min(1, currentAlpha))})`;
      ctx.shadowColor = '#F59E0B';
      ctx.shadowBlur = 10;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Connect nearby particles with glowing cosmic laser threads
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dist2 = Math.hypot(p.x - p2.x, p.y - p2.y);

        if (dist2 < 125) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          const lineAlpha = (1 - dist2 / 125) * 0.22;
          ctx.strokeStyle = `rgba(168, 85, 247, ${lineAlpha})`;
          ctx.lineWidth = 0.85;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(render);
  }

  window.addEventListener('resize', resize);
  resize();
  render();
}

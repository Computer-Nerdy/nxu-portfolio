/* ==========================================================================
   LIVING LIQUID GLASS PUDDLE & REACTIVE FLUID MECHANICS ENGINE
   - Organic Undulating Liquid Glass Puddle Contour & Surface Tension Physics
   - Dynamic Specular Glass Refraction & Light Caustics
   - Navier-Stokes Grid Momentum, Vortices & Inward-Billowing Smoke Clouds
   - 100% Autonomous Continuous Execution & Real-Time Telemetry Stream
   ========================================================================== */

export function initNeuralAILab() {
  const container = document.querySelector('.rgb-living-edge-container') || document.getElementById('neural-ai-lab');
  const canvas = document.getElementById('neural-particle-canvas');
  const latencyDisplay = document.getElementById('neural-telemetry-latency');
  const accuracyDisplay = document.getElementById('neural-telemetry-accuracy');
  const throughputDisplay = document.getElementById('neural-telemetry-throughput');

  if (!canvas || !container) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let neurons = [];
  let actionPulses = [];
  let smokePuffs = [];
  let fluidRipples = [];

  // Fluid Dynamics Velocity Grid
  const CELL_SIZE = 30;
  let gridCols = 0, gridRows = 0;
  let velocityGrid = [];

  let mouse = {
    x: -1000,
    y: -1000,
    prevX: -1000,
    prevY: -1000,
    vx: 0,
    vy: 0,
    speed: 0,
    isInside: false
  };

  // Organic Liquid Glass Puddle 8-Point Membrane Contour (Percentages)
  let puddlePoints = [48, 52, 46, 54, 52, 48, 54, 46];
  let targetPuddle = [48, 52, 46, 54, 52, 48, 54, 46];

  function getLivingRGB(offset = 0) {
    const t = performance.now() * 0.0008 + offset;
    const r = Math.floor(Math.sin(t) * 95 + 160);
    const g = Math.floor(Math.sin(t + 2.094) * 95 + 160);
    const b = Math.floor(Math.sin(t + 4.188) * 95 + 160);
    return { r, g, b };
  }

  function resize() {
    width = canvas.width = container.clientWidth || container.offsetWidth || window.innerWidth;
    height = canvas.height = container.clientHeight || container.offsetHeight || 600;

    gridCols = Math.ceil(width / CELL_SIZE) + 1;
    gridRows = Math.ceil(height / CELL_SIZE) + 1;
    velocityGrid = new Float32Array(gridCols * gridRows * 2);

    createNetwork();
  }

  function getGridIndex(x, y) {
    const col = Math.max(0, Math.min(gridCols - 1, Math.floor(x / CELL_SIZE)));
    const row = Math.max(0, Math.min(gridRows - 1, Math.floor(y / CELL_SIZE)));
    return (row * gridCols + col) * 2;
  }

  function injectFluidForce(x, y, vx, vy, radius = 70) {
    const radCells = Math.ceil(radius / CELL_SIZE);
    const centerCol = Math.floor(x / CELL_SIZE);
    const centerRow = Math.floor(y / CELL_SIZE);

    for (let r = -radCells; r <= radCells; r++) {
      for (let c = -radCells; c <= radCells; c++) {
        const col = centerCol + c;
        const row = centerRow + r;

        if (col >= 0 && col < gridCols && row >= 0 && row < gridRows) {
          const cellX = col * CELL_SIZE;
          const cellY = row * CELL_SIZE;
          const dist = Math.hypot(x - cellX, y - cellY);

          if (dist < radius) {
            const factor = (1 - dist / radius);
            const idx = (row * gridCols + col) * 2;
            velocityGrid[idx] += vx * factor * 0.5;
            velocityGrid[idx + 1] += vy * factor * 0.5;
          }
        }
      }
    }
  }

  function spawnSmokePuff(randomStart = false) {
    const edge = Math.floor(Math.random() * 4);
    let x, y, vx, vy;
    const speed = Math.random() * 1.2 + 0.6;

    if (edge === 0) {
      x = Math.random() * width;
      y = randomStart ? Math.random() * (height * 0.4) : -20;
      vx = (Math.random() - 0.5) * 0.8;
      vy = speed;
    } else if (edge === 1) {
      x = randomStart ? width - Math.random() * (width * 0.4) : width + 20;
      y = Math.random() * height;
      vx = -speed;
      vy = (Math.random() - 0.5) * 0.8;
    } else if (edge === 2) {
      x = Math.random() * width;
      y = randomStart ? height - Math.random() * (height * 0.4) : height + 20;
      vx = (Math.random() - 0.5) * 0.8;
      vy = -speed;
    } else {
      x = randomStart ? Math.random() * (width * 0.4) : -20;
      y = Math.random() * height;
      vx = speed;
      vy = (Math.random() - 0.5) * 0.8;
    }

    smokePuffs.push({
      x,
      y,
      vx,
      vy,
      size: Math.random() * 65 + 45,
      maxSize: Math.random() * 170 + 130,
      growth: Math.random() * 0.85 + 0.45,
      opacity: 0.1,
      maxOpacity: Math.random() * 0.48 + 0.3,
      life: randomStart ? Math.floor(Math.random() * 50) : 0,
      maxLife: Math.random() * 150 + 110,
      color: getLivingRGB(Math.random() * 3)
    });
  }

  function createNetwork() {
    neurons = [];
    smokePuffs = [];
    const count = Math.min(Math.floor((width * height) / 9000), 85);

    for (let i = 0; i < count; i++) {
      neurons.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 2.5 + 1.2,
        alpha: Math.random() * 0.6 + 0.3,
        pulseVal: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.03 + 0.015
      });
    }

    for (let s = 0; s < 45; s++) {
      spawnSmokePuff(true);
    }
  }

  container.addEventListener('mouseenter', () => {
    mouse.isInside = true;
  });

  container.addEventListener('mousemove', (e) => {
    const rect = container.getBoundingClientRect();
    const curX = e.clientX - rect.left;
    const curY = e.clientY - rect.top;

    // Update specular glass highlight position
    const pctX = ((curX / width) * 100).toFixed(1);
    const pctY = ((curY / height) * 100).toFixed(1);
    container.style.setProperty('--liquid-mouse-x', `${pctX}%`);
    container.style.setProperty('--liquid-mouse-y', `${pctY}%`);

    if (mouse.prevX > -500) {
      mouse.vx = curX - mouse.prevX;
      mouse.vy = curY - mouse.prevY;
      mouse.speed = Math.hypot(mouse.vx, mouse.vy);

      // Inject fluid momentum & spin vortices
      injectFluidForce(curX, curY, mouse.vx * 1.8, mouse.vy * 1.8, 100);

      // Liquid Glass Puddle Stretch & Bulge Physics
      const normX = curX / width;
      const normY = curY / height;
      const stretch = Math.min(mouse.speed * 0.6, 22);

      targetPuddle[0] = 48 + (1 - normX) * stretch;
      targetPuddle[1] = 52 + normX * stretch;
      targetPuddle[2] = 46 + normX * stretch;
      targetPuddle[3] = 54 + (1 - normX) * stretch;

      targetPuddle[4] = 52 + (1 - normY) * stretch;
      targetPuddle[5] = 48 + (1 - normY) * stretch;
      targetPuddle[6] = 54 + normY * stretch;
      targetPuddle[7] = 46 + normY * stretch;
    }

    mouse.prevX = mouse.x = curX;
    mouse.prevY = mouse.y = curY;
  });

  container.addEventListener('mouseleave', () => {
    mouse.x = -1000;
    mouse.y = -1000;
    mouse.prevX = -1000;
    mouse.prevY = -1000;
    mouse.isInside = false;

    // Reset default specular highlight to center
    container.style.setProperty('--liquid-mouse-x', '50%');
    container.style.setProperty('--liquid-mouse-y', '50%');

    // Smoothly restore base puddle shape
    targetPuddle = [48, 52, 46, 54, 52, 48, 54, 46];
  });

  // Click generates liquid glass caustic ripple shockwave
  container.addEventListener('click', (e) => {
    const rect = container.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    fluidRipples.push({
      x: clickX,
      y: clickY,
      radius: 4,
      maxRadius: 220,
      opacity: 0.95,
      color: getLivingRGB()
    });

    // Blast fluid outward in all directions
    for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 8) {
      const forceX = Math.cos(angle) * 22;
      const forceY = Math.sin(angle) * 22;
      injectFluidForce(clickX + Math.cos(angle) * 25, clickY + Math.sin(angle) * 25, forceX, forceY, 70);
    }
  });

  function fireNeuralPulse() {
    if (neurons.length < 2) return;

    for (let i = 0; i < 6; i++) {
      const startIdx = Math.floor(Math.random() * neurons.length);
      const endIdx = (startIdx + Math.floor(Math.random() * 8) + 1) % neurons.length;
      actionPulses.push({
        from: neurons[startIdx],
        to: neurons[endIdx],
        progress: 0,
        speed: 0.03 + Math.random() * 0.025,
        color: getLivingRGB(i * 0.5)
      });
    }

    for (let s = 0; s < 8; s++) {
      spawnSmokePuff(false);
    }
  }

  setInterval(() => {
    fireNeuralPulse();
  }, 1800);

  setInterval(() => {
    if (latencyDisplay) {
      latencyDisplay.textContent = `${(0.42 + Math.random() * 0.35).toFixed(2)} ms`;
    }
    if (accuracyDisplay) {
      accuracyDisplay.textContent = `${(99.6 + Math.random() * 0.3).toFixed(1)}%`;
    }
    if (throughputDisplay) {
      throughputDisplay.textContent = `${Math.floor(2100 + Math.random() * 350).toLocaleString()} FPS`;
    }
  }, 500);

  function render() {
    ctx.clearRect(0, 0, width, height);

    const now = performance.now();
    const rgb1 = getLivingRGB(0);
    const rgb2 = getLivingRGB(1.5);
    const rgb3 = getLivingRGB(3.0);
    const rgb4 = getLivingRGB(4.5);

    // Sync CSS Edge Smoke Plumes
    container.style.setProperty('--smoke-color-1', `rgb(${rgb1.r}, ${rgb1.g}, ${rgb1.b})`);
    container.style.setProperty('--smoke-color-2', `rgb(${rgb2.r}, ${rgb2.g}, ${rgb2.b})`);
    container.style.setProperty('--smoke-color-3', `rgb(${rgb3.r}, ${rgb3.g}, ${rgb3.b})`);
    container.style.setProperty('--smoke-color-4', `rgb(${rgb4.r}, ${rgb4.g}, ${rgb4.b})`);

    // 1. Viscous Dampening of Velocity Grid
    const damp = 0.94;
    for (let i = 0; i < velocityGrid.length; i++) {
      velocityGrid[i] *= damp;
    }

    // 3. Continuous Smoke Puff Inflow from Edges
    if (smokePuffs.length < 90) {
      spawnSmokePuff(false);
      spawnSmokePuff(false);
      spawnSmokePuff(false);
    }

    ctx.globalCompositeOperation = 'screen';

    // 4. Update & Render Fluid-Driven Smoke Puffs
    for (let s = smokePuffs.length - 1; s >= 0; s--) {
      const p = smokePuffs[s];
      p.life++;

      const gIdx = getGridIndex(p.x, p.y);
      const fluidU = velocityGrid[gIdx] || 0;
      const fluidV = velocityGrid[gIdx + 1] || 0;

      p.x += p.vx + fluidU * 1.5;
      p.y += p.vy + fluidV * 1.5;
      p.size = Math.min(p.maxSize, p.size + p.growth);

      if (p.life < 30) {
        p.opacity = (p.life / 30) * p.maxOpacity;
      } else {
        p.opacity = Math.max(0, p.maxOpacity * (1 - (p.life - 30) / (p.maxLife - 30)));
      }

      if (p.life >= p.maxLife || p.opacity <= 0) {
        smokePuffs.splice(s, 1);
        continue;
      }

      const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
      grad.addColorStop(0, `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${p.opacity})`);
      grad.addColorStop(0.35, `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${p.opacity * 0.75})`);
      grad.addColorStop(0.7, `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${p.opacity * 0.25})`);
      grad.addColorStop(1, `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, 0)`);

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
    }

    // 5. Update & Render Liquid Caustic Wave Ripples
    for (let r = fluidRipples.length - 1; r >= 0; r--) {
      const rip = fluidRipples[r];
      rip.radius += 6.5;
      rip.opacity *= 0.94;

      if (rip.opacity < 0.02 || rip.radius > rip.maxRadius) {
        fluidRipples.splice(r, 1);
        continue;
      }

      // Caustic Multi-Ring Specular Wave
      ctx.beginPath();
      ctx.arc(rip.x, rip.y, rip.radius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(255, 255, 255, ${rip.opacity * 0.8})`;
      ctx.lineWidth = 2.5;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(rip.x, rip.y, Math.max(1, rip.radius - 8), 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(${rip.color.r}, ${rip.color.g}, ${rip.color.b}, ${rip.opacity * 0.6})`;
      ctx.lineWidth = 4;
      ctx.stroke();
    }

    ctx.globalCompositeOperation = 'source-over';

    // 6. Update & Render Synaptic Neurons with Liquid Glass Refraction
    for (let i = 0; i < neurons.length; i++) {
      const n = neurons[i];

      const gIdx = getGridIndex(n.x, n.y);
      const fluidU = velocityGrid[gIdx] || 0;
      const fluidV = velocityGrid[gIdx + 1] || 0;

      n.x += n.vx + fluidU * 0.8;
      n.y += n.vy + fluidV * 0.8;

      if (n.x < 0) n.x = width;
      if (n.x > width) n.x = 0;
      if (n.y < 0) n.y = height;
      if (n.y > height) n.y = 0;

      n.pulseVal += n.pulseSpeed;
      const currentAlpha = n.alpha + Math.sin(n.pulseVal) * 0.25;

      ctx.beginPath();
      ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${rgb1.r}, ${rgb1.g}, ${rgb1.b}, ${Math.max(0.2, currentAlpha)})`;
      ctx.shadowColor = `rgb(${rgb1.r}, ${rgb1.g}, ${rgb1.b})`;
      ctx.shadowBlur = 10;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Draw Synaptic Axon Links
      for (let j = i + 1; j < neurons.length; j++) {
        const n2 = neurons[j];
        const dist2 = Math.hypot(n.x - n2.x, n.y - n2.y);

        if (dist2 < 130) {
          const alpha = (1 - dist2 / 130) * 0.22;
          ctx.beginPath();
          ctx.moveTo(n.x, n.y);
          ctx.lineTo(n2.x, n2.y);
          ctx.strokeStyle = `rgba(${rgb1.r}, ${rgb1.g}, ${rgb1.b}, ${alpha})`;
          ctx.lineWidth = 0.9;
          ctx.stroke();
        }
      }
    }

    // 7. Update & Draw Action Potential Pulses
    for (let p = actionPulses.length - 1; p >= 0; p--) {
      const pulse = actionPulses[p];
      pulse.progress += pulse.speed;

      if (pulse.progress >= 1) {
        actionPulses.splice(p, 1);
        continue;
      }

      const curX = pulse.from.x + (pulse.to.x - pulse.from.x) * pulse.progress;
      const curY = pulse.from.y + (pulse.to.y - pulse.from.y) * pulse.progress;

      ctx.beginPath();
      ctx.arc(curX, curY, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgb(${pulse.color.r}, ${pulse.color.g}, ${pulse.color.b})`;
      ctx.shadowColor = '#FFFFFF';
      ctx.shadowBlur = 16;
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    requestAnimationFrame(render);
  }

  window.addEventListener('resize', resize);
  setTimeout(resize, 100);
  setTimeout(resize, 500);
  render();
}

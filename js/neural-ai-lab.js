/* ==========================================================================
   LIVING NEURAL AI LABORATORY & CHROMATIC EDGE SMOKE EMISSION ENGINE
   - Edge-Emitted Volumetric RGB Smoke & Atmospheric Vapor
   - Synchronized Chromatic Edge Hue & Synaptic Action Potential Pulses
   - 100% Autonomous Continuous Execution & Real-Time Telemetry Stream
   ========================================================================== */

export function initNeuralAILab() {
  const container = document.getElementById('neural-ai-lab');
  const canvas = document.getElementById('neural-particle-canvas');
  const latencyDisplay = document.getElementById('neural-telemetry-latency');
  const accuracyDisplay = document.getElementById('neural-telemetry-accuracy');
  const throughputDisplay = document.getElementById('neural-telemetry-throughput');
  const activePipelineName = document.getElementById('neural-active-pipeline-name');
  const activePipelineTag = document.getElementById('neural-active-pipeline-tag');
  const autonomousLogFeed = document.getElementById('neural-log-feed');

  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let neurons = [];
  let actionPulses = [];
  let smokePuffs = [];
  let mouse = { x: -1000, y: -1000, radius: 180 };

  const autonomousPipelines = [
    { name: "RF Spectrum Anomaly Classifier (Deep ResNet-34)", tag: "BATCH 128 · 240MHz", log: "Inference cycle: RF spectrum anomaly localized at 2.412 GHz · Confidence: 99.8%" },
    { name: "Auto-Patch AST Neural Code Repair Engine", tag: "AST SYNAPSE · ZERO-COPY", log: "AST parser node tree resolved · Autonomous patch compiled in 0.42ms" },
    { name: "Quantum Qubit VQE Decoherence Filter", tag: "1024 SHOTS · INT8 QUANT", log: "Variational quantum eigensolver converged · Fidelity threshold: 0.9994" },
    { name: "Edge TPU TinyML Real-Time Sensor Fusion", tag: "DMA STREAM · 520KB SRAM", log: "Sensor matrix fused: 6-DOF IMU + RF Telemetry synchronized" }
  ];

  let currentPipelineIdx = 0;

  function resize() {
    if (!container) return;
    const rect = container.getBoundingClientRect();
    width = canvas.width = rect.width;
    height = canvas.height = rect.height;
    createNetwork();
  }

  function getLivingRGB(offset = 0) {
    const t = performance.now() * 0.0006 + offset;
    const r = Math.floor(Math.sin(t) * 90 + 160);
    const g = Math.floor(Math.sin(t + 2.094) * 90 + 160);
    const b = Math.floor(Math.sin(t + 4.188) * 90 + 160);
    return { r, g, b };
  }

  function createNetwork() {
    neurons = [];
    smokePuffs = [];
    const count = Math.min(Math.floor((width * height) / 9500), 85);

    for (let i = 0; i < count; i++) {
      neurons.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 2.2 + 1.2,
        alpha: Math.random() * 0.6 + 0.3,
        pulseVal: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.03 + 0.015
      });
    }
  }

  container.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  container.addEventListener('mouseleave', () => {
    mouse.x = -1000;
    mouse.y = -1000;
  });

  // Spawn Chromatic Smoke Puff from the Inner Boundary Edges
  function emitEdgeSmoke() {
    if (smokePuffs.length > 90) return;

    // Pick random edge (0: top, 1: right, 2: bottom, 3: left)
    const edge = Math.floor(Math.random() * 4);
    let x, y, vx, vy;
    const speed = Math.random() * 0.7 + 0.25;

    if (edge === 0) {
      // Top edge emitting downward
      x = Math.random() * width;
      y = 4;
      vx = (Math.random() - 0.5) * 0.4;
      vy = speed;
    } else if (edge === 1) {
      // Right edge emitting leftward
      x = width - 4;
      y = Math.random() * height;
      vx = -speed;
      vy = (Math.random() - 0.5) * 0.4;
    } else if (edge === 2) {
      // Bottom edge emitting upward
      x = Math.random() * width;
      y = height - 4;
      vx = (Math.random() - 0.5) * 0.4;
      vy = -speed;
    } else {
      // Left edge emitting rightward
      x = 4;
      y = Math.random() * height;
      vx = speed;
      vy = (Math.random() - 0.5) * 0.4;
    }

    smokePuffs.push({
      x,
      y,
      vx,
      vy,
      size: Math.random() * 20 + 15,
      maxSize: Math.random() * 55 + 45,
      growth: Math.random() * 0.35 + 0.2,
      opacity: 0.01,
      maxOpacity: Math.random() * 0.18 + 0.1,
      fadeSpeed: Math.random() * 0.003 + 0.002,
      life: 0,
      maxLife: Math.random() * 140 + 120,
      color: getLivingRGB()
    });
  }

  // Automatically fire high-energy RGB synaptic action potential wave
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

    // Extra burst of edge smoke
    for (let s = 0; s < 8; s++) {
      emitEdgeSmoke();
    }
  }

  // Autonomous Pulse Loop (every 1.8 seconds)
  setInterval(() => {
    fireNeuralPulse();
  }, 1800);

  // Autonomous Streaming Telemetry (every 500ms)
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

  // Autonomous Pipeline Switcher (every 4 seconds)
  setInterval(() => {
    currentPipelineIdx = (currentPipelineIdx + 1) % autonomousPipelines.length;
    const current = autonomousPipelines[currentPipelineIdx];

    if (activePipelineName) activePipelineName.textContent = current.name;
    if (activePipelineTag) activePipelineTag.textContent = current.tag;
    if (autonomousLogFeed) {
      const timeStr = new Date().toISOString().substring(11, 19);
      autonomousLogFeed.textContent = `[${timeStr}] ${current.log}`;
    }
    fireNeuralPulse();
  }, 4000);

  function render() {
    ctx.clearRect(0, 0, width, height);

    const activeRGB = getLivingRGB();

    // 1. Continuous Edge Smoke Emission
    if (Math.random() > 0.4) {
      emitEdgeSmoke();
    }

    // 2. Render & Update Chromatic Smoke Puffs (Volumetric Vapor)
    for (let s = smokePuffs.length - 1; s >= 0; s--) {
      const p = smokePuffs[s];
      p.life++;
      p.x += p.vx;
      p.y += p.vy;
      p.size = Math.min(p.maxSize, p.size + p.growth);

      // Smooth fade in and out curve
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
      grad.addColorStop(0.55, `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${p.opacity * 0.4})`);
      grad.addColorStop(1, `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, 0)`);

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
    }

    // 3. Update & Draw Synaptic Neurons
    for (let i = 0; i < neurons.length; i++) {
      const n = neurons[i];

      n.x += n.vx;
      n.y += n.vy;

      if (n.x < 0) n.x = width;
      if (n.x > width) n.x = 0;
      if (n.y < 0) n.y = height;
      if (n.y > height) n.y = 0;

      // Mouse Gravitational Attractor
      const dx = mouse.x - n.x;
      const dy = mouse.y - n.y;
      const dist = Math.hypot(dx, dy);

      if (dist < mouse.radius) {
        const force = (1 - dist / mouse.radius) * 0.9;
        n.x -= (dx / dist) * force * 1.8;
        n.y -= (dy / dist) * force * 1.8;
      }

      n.pulseVal += n.pulseSpeed;
      const currentAlpha = n.alpha + Math.sin(n.pulseVal) * 0.25;

      ctx.beginPath();
      ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${activeRGB.r}, ${activeRGB.g}, ${activeRGB.b}, ${Math.max(0.2, currentAlpha)})`;
      ctx.shadowColor = `rgb(${activeRGB.r}, ${activeRGB.g}, ${activeRGB.b})`;
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
          ctx.strokeStyle = `rgba(${activeRGB.r}, ${activeRGB.g}, ${activeRGB.b}, ${alpha})`;
          ctx.lineWidth = 0.9;
          ctx.stroke();
        }
      }
    }

    // 4. Update & Draw Action Potential Pulses
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
  render();
}

/* ==========================================================================
   FULLY AUTONOMOUS NEURAL AI LABORATORY & REAL-TIME RGB PARTICLE ENGINE
   - 100% Automatic Execution — Zero Clicks Required
   - Autonomous Synaptic Action Potential Pulses & Dynamic Screen Edge Glow
   - Continuous Streaming Telemetry & Autonomous Model Pipeline Cycler
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
  let mouse = { x: -1000, y: -1000, radius: 170 };

  const rgbColors = [
    { r: 56, g: 189, b: 248 },   // Electric Cyan
    { r: 168, g: 85, b: 247 },   // Galactic Violet
    { r: 236, g: 72, b: 153 },   // Astral Magenta
    { r: 245, g: 158, b: 11 },   // Supernova Amber
    { r: 16, g: 185, b: 129 }    // Emerald Phosphor
  ];

  const autonomousPipelines = [
    { name: "RF Spectrum Anomaly Classifier (Deep ResNet-34)", tag: "BATCH 128 · 240MHz", log: "Inference cycle #8492: Spectrum anomaly detected at 2.412 GHz · Confidence: 99.8%" },
    { name: "Auto-Patch AST Neural Code Repair Engine", tag: "AST SYNAPSE · ZERO-COPY", log: "AST parser node tree resolved · Autonomous patch compiled in 0.42ms" },
    { name: "Quantum Qubit VQE Decoherence Filter", tag: "1024 SHOTS · INT8 QUANT", log: "Variational quantum eigensolver converged · Fidelity threshold: 0.9994" },
    { name: "Edge TPU TinyML Real-Time Sensor Fusion", tag: "DMA STREAM · 520KB SRAM", log: "Sensor matrix fused: 6-DOF IMU + RF Telemetry synchronized" }
  ];

  let currentPipelineIdx = 0;

  function resize() {
    if (!container) return;
    width = canvas.width = container.offsetWidth;
    height = canvas.height = container.offsetHeight;
    createNetwork();
  }

  function createNetwork() {
    neurons = [];
    const count = Math.min(Math.floor((width * height) / 9500), 90);

    for (let i = 0; i < count; i++) {
      const color = rgbColors[i % rgbColors.length];
      neurons.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        radius: Math.random() * 2.5 + 1.2,
        color: color,
        alpha: Math.random() * 0.6 + 0.35,
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

  // Automatically fire high-energy RGB synaptic action potential wave
  function fireNeuralPulse() {
    if (neurons.length < 2) return;

    for (let i = 0; i < 5; i++) {
      const startIdx = Math.floor(Math.random() * neurons.length);
      const endIdx = (startIdx + Math.floor(Math.random() * 8) + 1) % neurons.length;
      actionPulses.push({
        from: neurons[startIdx],
        to: neurons[endIdx],
        progress: 0,
        speed: 0.03 + Math.random() * 0.025,
        color: rgbColors[Math.floor(Math.random() * rgbColors.length)]
      });
    }

    // Flash screen edge glow
    if (container) {
      container.classList.add('edge-glow-supercharge');
      setTimeout(() => {
        container.classList.remove('edge-glow-supercharge');
      }, 600);
    }
  }

  // 1. Autonomous High-Frequency Pulse Loop (every 1.8 seconds)
  setInterval(() => {
    fireNeuralPulse();
  }, 1800);

  // 2. Autonomous Real-Time Telemetry Stream (Updates every 600ms)
  setInterval(() => {
    if (latencyDisplay) {
      latencyDisplay.textContent = `${(0.45 + Math.random() * 0.38).toFixed(2)} ms`;
    }
    if (accuracyDisplay) {
      accuracyDisplay.textContent = `${(99.6 + Math.random() * 0.3).toFixed(1)}%`;
    }
    if (throughputDisplay) {
      throughputDisplay.textContent = `${Math.floor(2100 + Math.random() * 350).toLocaleString()} FPS`;
    }
  }, 600);

  // 3. Autonomous AI Pipeline Switcher (Cycles every 4 seconds)
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

    // 1. Update & Draw Neurons
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
      ctx.fillStyle = `rgba(${n.color.r}, ${n.color.g}, ${n.color.b}, ${Math.max(0.2, currentAlpha)})`;
      ctx.shadowColor = `rgb(${n.color.r}, ${n.color.g}, ${n.color.b})`;
      ctx.shadowBlur = 12;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Draw Synaptic Axon Links
      for (let j = i + 1; j < neurons.length; j++) {
        const n2 = neurons[j];
        const dist2 = Math.hypot(n.x - n2.x, n.y - n2.y);

        if (dist2 < 135) {
          const alpha = (1 - dist2 / 135) * 0.24;
          ctx.beginPath();
          ctx.moveTo(n.x, n.y);
          ctx.lineTo(n2.x, n2.y);
          ctx.strokeStyle = `rgba(${n.color.r}, ${n.color.g}, ${n.color.b}, ${alpha})`;
          ctx.lineWidth = 0.95;
          ctx.stroke();
        }
      }
    }

    // 2. Update & Draw Action Potential Pulses
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

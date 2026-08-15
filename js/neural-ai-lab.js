/* ==========================================================================
   LIVING NEURAL AI LABORATORY & RGB SYNAPTIC PARTICLE ENGINE
   - Chromatic RGB Edge Screen Aura
   - Synaptic Node Network with Action Potential Laser Pulses
   - Interactive Pulse Trigger & Neural Model Telemetry
   ========================================================================== */

export function initNeuralAILab() {
  const container = document.getElementById('neural-ai-lab');
  const canvas = document.getElementById('neural-particle-canvas');
  const pulseBtn = document.getElementById('trigger-neural-pulse-btn');
  const modelSelect = document.getElementById('neural-model-select');
  const latencyDisplay = document.getElementById('neural-telemetry-latency');
  const accuracyDisplay = document.getElementById('neural-telemetry-accuracy');
  const throughputDisplay = document.getElementById('neural-telemetry-throughput');

  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let neurons = [];
  let actionPulses = [];
  let mouse = { x: -1000, y: -1000, radius: 170 };

  const rgbColors = [
    { r: 56, g: 189, b: 248 },   // Cyan
    { r: 168, g: 85, b: 247 },   // Violet
    { r: 236, g: 72, b: 153 },   // Pink/Magenta
    { r: 245, g: 158, b: 11 },   // Amber
    { r: 16, g: 185, b: 129 }    // Emerald
  ];

  function resize() {
    if (!container) return;
    width = canvas.width = container.offsetWidth;
    height = canvas.height = container.offsetHeight;
    createNetwork();
  }

  function createNetwork() {
    neurons = [];
    const count = Math.min(Math.floor((width * height) / 10000), 80);

    for (let i = 0; i < count; i++) {
      const color = rgbColors[i % rgbColors.length];
      neurons.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
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

  // Trigger high-energy RGB synaptic action potential wave
  function fireNeuralPulse() {
    for (let i = 0; i < 6; i++) {
      const startIdx = Math.floor(Math.random() * neurons.length);
      const endIdx = (startIdx + Math.floor(Math.random() * 6) + 1) % neurons.length;
      actionPulses.push({
        from: neurons[startIdx],
        to: neurons[endIdx],
        progress: 0,
        speed: 0.035 + Math.random() * 0.02,
        color: rgbColors[Math.floor(Math.random() * rgbColors.length)]
      });
    }

    // Flash screen edge glow
    if (container) {
      container.classList.add('edge-glow-supercharge');
      setTimeout(() => {
        container.classList.remove('edge-glow-supercharge');
      }, 700);
    }
  }

  if (pulseBtn) {
    pulseBtn.addEventListener('click', (e) => {
      e.preventDefault();
      fireNeuralPulse();
      
      // Simulate real-time inference latency fluctuation
      if (latencyDisplay) {
        latencyDisplay.textContent = `${(0.4 + Math.random() * 0.5).toFixed(2)} ms`;
      }
      if (accuracyDisplay) {
        accuracyDisplay.textContent = `${(99.6 + Math.random() * 0.3).toFixed(1)}%`;
      }
      if (throughputDisplay) {
        throughputDisplay.textContent = `${Math.floor(1800 + Math.random() * 400)} FPS`;
      }
    });
  }

  // Model Selector Simulator
  if (modelSelect) {
    modelSelect.addEventListener('change', () => {
      fireNeuralPulse();
      if (latencyDisplay) {
        latencyDisplay.textContent = `${(0.5 + Math.random() * 0.6).toFixed(2)} ms`;
      }
    });
  }

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
        n.x -= (dx / dist) * force * 2;
        n.y -= (dy / dist) * force * 2;
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

        if (dist2 < 130) {
          const alpha = (1 - dist2 / 130) * 0.22;
          ctx.beginPath();
          ctx.moveTo(n.x, n.y);
          ctx.lineTo(n2.x, n2.y);
          ctx.strokeStyle = `rgba(${n.color.r}, ${n.color.g}, ${n.color.b}, ${alpha})`;
          ctx.lineWidth = 0.9;
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

  // Ambient automatic synaptic pulses every 4.5 seconds
  setInterval(() => {
    if (Math.random() > 0.3) {
      fireNeuralPulse();
    }
  }, 4500);
}

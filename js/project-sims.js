import * as THREE from 'three';

// ==========================================
// 1. QUANTUMLENS: MINI 3D MESH & SHADER VIEWER
// ==========================================
let qScene, qCamera, qRenderer, qMesh;
let qCurrentMat = 'copper';

export function initQuantumSandbox() {
  const canvas = document.getElementById('quantum-sandbox-canvas');
  if (!canvas) return;

  const width = canvas.parentElement.clientWidth || 360;
  const height = canvas.parentElement.clientHeight || 270;

  qScene = new THREE.Scene();
  qCamera = new THREE.PerspectiveCamera(45, width / height, 0.1, 50);
  qCamera.position.set(0, 0, 4);

  qRenderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  qRenderer.setSize(width, height);
  qRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Lighting
  const ambLight = new THREE.AmbientLight(0x84B6E4, 1.5);
  qScene.add(ambLight);

  const dirLight = new THREE.DirectionalLight(0xF2A86B, 2.5);
  dirLight.position.set(2, 4, 3);
  qScene.add(dirLight);

  // Faceted Quantum Torus Knot Mesh
  const geo = new THREE.TorusKnotGeometry(0.9, 0.28, 64, 16);
  const mat = getQuantumMaterial('copper');
  qMesh = new THREE.Mesh(geo, mat);
  qScene.add(qMesh);

  // Material Switcher Buttons
  const buttons = document.querySelectorAll('.quantum-mat-btn');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      qCurrentMat = btn.dataset.mat;
      if (qMesh) qMesh.material = getQuantumMaterial(qCurrentMat);
    });
  });

  // Touch & Mouse Drag Rotation
  let isDragging = false;
  let prevPos = { x: 0, y: 0 };

  canvas.addEventListener('pointerdown', (e) => {
    isDragging = true;
    prevPos = { x: e.clientX, y: e.clientY };
  });

  window.addEventListener('pointermove', (e) => {
    if (!isDragging || !qMesh) return;
    const dx = e.clientX - prevPos.x;
    const dy = e.clientY - prevPos.y;
    qMesh.rotation.y += dx * 0.01;
    qMesh.rotation.x += dy * 0.01;
    prevPos = { x: e.clientX, y: e.clientY };
  });

  window.addEventListener('pointerup', () => { isDragging = false; });

  // Animation Loop
  function qAnimate() {
    requestAnimationFrame(qAnimate);
    if (!isDragging && qMesh) {
      qMesh.rotation.y += 0.008;
      qMesh.rotation.x += 0.004;
    }
    qRenderer.render(qScene, qCamera);
  }
  qAnimate();

  window.addEventListener('resize', () => {
    if (!canvas.parentElement) return;
    const w = canvas.parentElement.clientWidth;
    const h = canvas.parentElement.clientHeight;
    qCamera.aspect = w / h;
    qCamera.updateProjectionMatrix();
    qRenderer.setSize(w, h);
  });
}

function getQuantumMaterial(type) {
  if (type === 'wireframe') {
    return new THREE.MeshBasicMaterial({ color: 0x00F5D4, wireframe: true });
  } else if (type === 'glass') {
    return new THREE.MeshPhysicalMaterial({
      color: 0x84B6E4,
      transmission: 0.8,
      opacity: 0.9,
      transparent: true,
      roughness: 0.1,
      metalness: 0.1
    });
  } else {
    // Copper Metallic
    return new THREE.MeshStandardMaterial({
      color: 0xE0680E,
      metalness: 0.85,
      roughness: 0.25,
      emissive: 0x3A1804
    });
  }
}

// ==========================================
// 2. EDGE-AI POTHOLE MAPPER SIMULATOR
// ==========================================
export function initPotholeSimulator() {
  const canvas = document.getElementById('pothole-canvas');
  const triggerBtn = document.getElementById('trigger-bump-btn');
  const statusElem = document.getElementById('pothole-status');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = canvas.width = canvas.parentElement.clientWidth;
  let height = canvas.height = canvas.parentElement.clientHeight;

  let time = 0;
  let isBumpActive = false;
  let bumpIntensity = 0;
  const historyX = new Array(80).fill(0);
  const historyY = new Array(80).fill(0);
  const historyZ = new Array(80).fill(0);

  if (triggerBtn) {
    triggerBtn.addEventListener('click', () => {
      isBumpActive = true;
      bumpIntensity = 1.0;
      if (statusElem) {
        statusElem.className = 'text-red-400 font-bold';
        statusElem.textContent = '🚨 POTHOLE DETECTED [Confidence: 96.8%]';
      }
      setTimeout(() => {
        isBumpActive = false;
        if (statusElem) {
          statusElem.className = 'text-mint font-bold';
          statusElem.textContent = 'STATUS: NORMAL ROAD [98.2%]';
        }
      }, 2200);
    });
  }

  function draw() {
    requestAnimationFrame(draw);
    time += 0.05;

    ctx.clearRect(0, 0, width, height);

    // Update Telemetry Samples
    const noiseZ = (Math.sin(time * 3) * 4) + (isBumpActive ? (Math.random() - 0.5) * 40 * bumpIntensity : (Math.random() - 0.5) * 3);
    const noiseY = (Math.cos(time * 2) * 3) + (isBumpActive ? (Math.random() - 0.5) * 30 * bumpIntensity : (Math.random() - 0.5) * 2);
    const noiseX = (Math.sin(time * 1.5) * 2) + (isBumpActive ? (Math.random() - 0.5) * 20 * bumpIntensity : (Math.random() - 0.5) * 1);

    if (bumpIntensity > 0) bumpIntensity *= 0.94;

    historyZ.shift(); historyZ.push(noiseZ);
    historyY.shift(); historyY.push(noiseY);
    historyX.shift(); historyX.push(noiseX);

    // Draw Grid Lines
    ctx.strokeStyle = 'rgba(132, 182, 228, 0.08)';
    ctx.lineWidth = 1;
    for (let y = 0; y < height; y += 24) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Draw Legend / Channel Indicators
    ctx.font = '9px JetBrains Mono, monospace';
    ctx.fillStyle = '#00F5D4';
    ctx.fillText('ACCEL-Z (Vertical)', 8, 14);
    ctx.fillStyle = '#F2A86B';
    ctx.fillText('ACCEL-Y (Lateral)', 110, 14);
    ctx.fillStyle = '#84B6E4';
    ctx.fillText('ACCEL-X (Forward)', 210, 14);

    // Draw Graph Channels
    drawChannel(ctx, historyZ, '#00F5D4', height * 0.45, width);
    drawChannel(ctx, historyY, '#F2A86B', height * 0.65, width);
    drawChannel(ctx, historyX, '#84B6E4', height * 0.85, width);
  }

  function drawChannel(ctx, data, color, midY, w) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    const step = w / (data.length - 1);
    for (let i = 0; i < data.length; i++) {
      const x = i * step;
      const y = midY + data[i];
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  draw();

  window.addEventListener('resize', () => {
    if (!canvas.parentElement) return;
    width = canvas.width = canvas.parentElement.clientWidth;
    height = canvas.height = canvas.parentElement.clientHeight;
  });
}

// ==========================================
// 3. ESP32 BIOMETRIC & STRESS SIMULATOR
// ==========================================
export function initBiometricSimulator() {
  const canvas = document.getElementById('ecg-canvas');
  const slider = document.getElementById('stress-slider');
  const oledBpm = document.getElementById('oled-bpm');
  const oledState = document.getElementById('oled-state');
  const oledMetric = document.getElementById('oled-metric');
  const oledBar = document.getElementById('oled-bar');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = canvas.width = canvas.parentElement.clientWidth;
  let height = canvas.height = canvas.parentElement.clientHeight;

  let stressLevel = 25; // 0 to 100
  let ecgPhase = 0;
  const history = new Array(70).fill(0);

  if (slider) {
    slider.addEventListener('input', (e) => {
      stressLevel = parseInt(e.target.value);
      updateOLEDDisplay();
    });
  }

  function updateOLEDDisplay() {
    const bpm = Math.round(68 + (stressLevel / 100) * 65);
    const gsr = (0.2 + (stressLevel / 100) * 1.8).toFixed(2);

    if (oledBpm) oledBpm.textContent = `${bpm} BPM`;
    if (oledMetric) oledMetric.textContent = `GSR Index: ${gsr} uS`;
    if (oledBar) {
      oledBar.style.width = `${Math.max(10, stressLevel)}%`;
      if (stressLevel > 70) {
        oledBar.className = 'bg-red-400 h-full transition-all duration-300';
      } else if (stressLevel > 40) {
        oledBar.className = 'bg-yellow-400 h-full transition-all duration-300';
      } else {
        oledBar.className = 'bg-mint h-full transition-all duration-300';
      }
    }

    if (oledState) {
      if (stressLevel < 35) {
        oledState.textContent = 'STATE: CALM';
        oledState.className = 'text-mint text-xs font-bold';
      } else if (stressLevel < 70) {
        oledState.textContent = 'STATE: ELEVATED';
        oledState.className = 'text-yellow-400 text-xs font-bold';
      } else {
        oledState.textContent = 'STATE: HIGH STRESS';
        oledState.className = 'text-red-400 text-xs font-bold';
      }
    }
  }

  function drawECG() {
    requestAnimationFrame(drawECG);
    const speed = 0.08 + (stressLevel / 100) * 0.12;
    ecgPhase += speed;

    // ECG waveform synthesis (P-Q-R-S-T wave)
    const p = (ecgPhase % (Math.PI * 2));
    let sample = 0;
    if (p > 1.2 && p < 1.4) sample = Math.sin((p - 1.2) * Math.PI * 5) * 5; // P wave
    else if (p >= 1.4 && p < 1.48) sample = -4; // Q wave
    else if (p >= 1.48 && p < 1.62) sample = 28 + (stressLevel / 100) * 12; // R spike
    else if (p >= 1.62 && p < 1.72) sample = -8; // S wave
    else if (p >= 1.85 && p < 2.2) sample = Math.sin((p - 1.85) * Math.PI * 2.8) * 8; // T wave
    else sample = (Math.random() - 0.5) * 1.5;

    history.shift();
    history.push(sample);

    ctx.clearRect(0, 0, width, height);

    // Draw Grid
    ctx.strokeStyle = 'rgba(0, 245, 212, 0.06)';
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 16) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
    }
    for (let y = 0; y < height; y += 16) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
    }

    // Draw Heartbeat Trace
    ctx.strokeStyle = stressLevel > 70 ? '#F87171' : (stressLevel > 40 ? '#FBBF24' : '#00F5D4');
    ctx.lineWidth = 2;
    ctx.beginPath();
    const step = width / (history.length - 1);
    for (let i = 0; i < history.length; i++) {
      const x = i * step;
      const y = (height / 2) - history[i];
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  updateOLEDDisplay();
  drawECG();

  window.addEventListener('resize', () => {
    if (!canvas.parentElement) return;
    width = canvas.width = canvas.parentElement.clientWidth;
    height = canvas.height = canvas.parentElement.clientHeight;
  });
}

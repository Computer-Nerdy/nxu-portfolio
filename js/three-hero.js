import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

let scene, camera, renderer, boardGroup;
let isUserInteracting = false;
let targetRotationX = 0.35, targetRotationY = 0.6;
let animationFrameId;
let isVisible = true;

const container = document.getElementById('three-hero-container');
const labelTitle = document.getElementById('component-label-title');
const labelDesc = document.getElementById('component-label-desc');

const componentMap = {};

export function initThreeHero() {
  if (!container) return;

  const width = container.clientWidth || 500;
  const height = container.clientHeight || 400;

  // Scene
  scene = new THREE.Scene();

  // Camera - Wide fluid perspective
  camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
  camera.position.set(0, 2.6, 5.2);
  camera.lookAt(0, 0, 0);

  // High-End WebGL Renderer with sRGB & ACES Tone Mapping
  const isMobile = window.innerWidth < 768;
  const pixelRatio = isMobile ? Math.min(window.devicePixelRatio, 1.5) : Math.min(window.devicePixelRatio, 2);

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.setSize(width, height);
  renderer.setPixelRatio(pixelRatio);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.35;
  renderer.shadowMap.enabled = !isMobile;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  container.appendChild(renderer.domElement);

  // 3-Point Studio Lighting
  const ambientLight = new THREE.AmbientLight(0xFFFFFF, 2.2);
  scene.add(ambientLight);

  const mainLight = new THREE.DirectionalLight(0xFFFFFF, 3.2);
  mainLight.position.set(6, 12, 8);
  mainLight.castShadow = !isMobile;
  scene.add(mainLight);

  const fillLight1 = new THREE.DirectionalLight(0xE0F2FE, 2.0);
  fillLight1.position.set(-8, 5, -5);
  scene.add(fillLight1);

  const warmRim = new THREE.DirectionalLight(0xFEF3C7, 1.8);
  warmRim.position.set(2, -6, 6);
  scene.add(warmRim);

  // Load custom GLB model and apply realistic PBR materials
  loadESP32Model();

  // Attach Interaction Controls & Clickable Label List
  attachControls();
  attachLabelButtons();

  // Real-Time Dynamic Resize Observer
  const resizeObserver = new ResizeObserver((entries) => {
    for (let entry of entries) {
      const cr = entry.contentRect;
      if (cr.width > 0 && cr.height > 0) {
        camera.aspect = cr.width / cr.height;
        camera.updateProjectionMatrix();
        renderer.setSize(cr.width, cr.height);
      }
    }
  });
  resizeObserver.observe(container);

  // Visibility Observer
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      isVisible = entry.isIntersecting;
      if (isVisible && !animationFrameId) animate();
    });
  }, { threshold: 0.1 });
  observer.observe(container);

  animate();
}

function loadESP32Model() {
  const loader = new GLTFLoader();

  loader.load('models/esp32.glb', (gltf) => {
    const rawScene = gltf.scene;

    // Center geometry
    const box = new THREE.Box3().setFromObject(rawScene);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());

    rawScene.position.x = -center.x;
    rawScene.position.y = -center.y;
    rawScene.position.z = -center.z;

    const wrapper = new THREE.Group();
    wrapper.add(rawScene);

    // Auto-scale to fill viewport prominently (target dimension 4.8)
    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    const targetDim = 4.8;
    const scale = targetDim / maxDim;
    wrapper.scale.set(scale, scale, scale);

    // Apply Photorealistic PBR Materials to Sketchfab Geometry
    applyRealisticPBR(rawScene, size);

    boardGroup = wrapper;
    scene.add(boardGroup);

    setupComponentMapForGLTF();
  }, undefined, (err) => {
    console.error("Error loading GLB:", err);
  });
}

function applyRealisticPBR(model, totalSize) {
  const matPCB = new THREE.MeshStandardMaterial({
    color: 0x18181B, // Matte Obsidian Black PCB
    roughness: 0.38,
    metalness: 0.1,
    side: THREE.DoubleSide
  });

  const matShield = new THREE.MeshStandardMaterial({
    color: 0xE4E4E7, // Brushed Silver Metal Can
    metalness: 0.9,
    roughness: 0.18,
    side: THREE.DoubleSide
  });

  const matAntenna = new THREE.MeshStandardMaterial({
    color: 0xD97706, // Polished Copper / Gold RF Trace
    metalness: 0.88,
    roughness: 0.22,
    side: THREE.DoubleSide
  });

  const matPins = new THREE.MeshStandardMaterial({
    color: 0xF1F5F9, // Silver / Chrome Solder Pins
    metalness: 0.95,
    roughness: 0.12,
    side: THREE.DoubleSide
  });

  const matChips = new THREE.MeshStandardMaterial({
    color: 0x0F172A, // Matte IC Epoxy
    roughness: 0.45,
    metalness: 0.2,
    side: THREE.DoubleSide
  });

  const matCapacitor = new THREE.MeshStandardMaterial({
    color: 0xF59E0B, // Tantalum SMD Capacitor (Amber/Gold)
    roughness: 0.3,
    metalness: 0.3,
    side: THREE.DoubleSide
  });

  const matUSB = new THREE.MeshStandardMaterial({
    color: 0xE2E8F0, // Metal USB Housing
    metalness: 0.92,
    roughness: 0.15,
    side: THREE.DoubleSide
  });

  const matLED = new THREE.MeshStandardMaterial({
    color: 0x10B981,
    emissive: 0x10B981,
    emissiveIntensity: 1.2,
    roughness: 0.1,
    side: THREE.DoubleSide
  });

  model.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;

      child.geometry.computeBoundingBox();
      const meshBox = child.geometry.boundingBox;
      const meshSize = meshBox.getSize(new THREE.Vector3());
      const meshVol = meshSize.x * meshSize.y * meshSize.z;
      const meshCenter = meshBox.getCenter(new THREE.Vector3());

      if (meshVol > (totalSize.x * totalSize.y * totalSize.z * 0.25)) {
        child.material = matPCB;
      } else if (meshSize.x > totalSize.x * 0.3 && meshSize.z > totalSize.z * 0.3 && meshCenter.y > 0) {
        child.material = matShield;
      } else if (meshCenter.x < -totalSize.x * 0.28) {
        child.material = matAntenna;
      } else if (meshCenter.x > totalSize.x * 0.32) {
        child.material = matUSB;
      } else if (meshSize.y > meshSize.x * 1.5 || meshCenter.y < -totalSize.y * 0.2) {
        child.material = matPins;
      } else if (meshVol < 0.005) {
        child.material = (Math.random() > 0.4) ? matCapacitor : matLED;
      } else {
        child.material = matChips;
      }
    }
  });
}

function setupComponentMapForGLTF() {
  componentMap["mcu"] = {
    userData: {
      title: "ESP-WROOM-32 Microcontroller Shield",
      desc: "Xtensa dual-core LX6 32-bit CPU running up to 240MHz with 520KB SRAM and integrated Wi-Fi/Bluetooth."
    }
  };
  componentMap["antenna"] = {
    userData: {
      title: "2.4 GHz PCB Inverted-F Antenna",
      desc: "Meandered inverted-F trace antenna designed for optimal 2.4 GHz RF transmission efficiency."
    }
  };
  componentMap["gpio"] = {
    userData: {
      title: "Dual-Row 30-Pin / 38-Pin Headers",
      desc: "Full pinout access to I2C, SPI, UART, PWM, capacitive touch pins, and 12-bit analog inputs."
    }
  };
  componentMap["bridge"] = {
    userData: {
      title: "Silicon Labs CP2102 USB-to-UART Bridge",
      desc: "High-performance USB bridge supporting firmware burning and real-time serial telemetry."
    }
  };
  componentMap["buttons"] = {
    userData: {
      title: "Tactile Push Buttons (EN / BOOT)",
      desc: "Micro tactile switches for hardware resetting (EN) and entering serial bootloader flashing mode (BOOT / IO0)."
    }
  };
}

function attachLabelButtons() {
  const buttons = document.querySelectorAll('.comp-label-btn');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const targetKey = btn.dataset.comp;
      highlightComponent(targetKey);
    });
  });
}

export function highlightComponent(key) {
  const target = componentMap[key];
  if (!target || !labelTitle || !labelDesc) return;

  const data = target.userData;
  labelTitle.textContent = data.title;
  labelDesc.textContent = data.desc;

  if (key === 'mcu') { targetRotationX = 0.35; targetRotationY = 0.4; }
  else if (key === 'antenna') { targetRotationX = 0.35; targetRotationY = 1.2; }
  else if (key === 'gpio') { targetRotationX = 0.7; targetRotationY = 0.25; }
  else if (key === 'bridge') { targetRotationX = 0.35; targetRotationY = -0.3; }
  else if (key === 'buttons') { targetRotationX = 0.3; targetRotationY = -1.0; }
}

function attachControls() {
  let isDragging = false;
  let prevPos = { x: 0, y: 0 };

  const onPointerDown = (e) => {
    isDragging = true;
    isUserInteracting = true;
    const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    const clientY = e.clientY || (e.touches && e.touches[0].clientY) || 0;
    prevPos = { x: clientX, y: clientY };
  };

  const onPointerMove = (e) => {
    if (!isDragging) return;
    const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    const clientY = e.clientY || (e.touches && e.touches[0].clientY) || 0;

    const deltaX = clientX - prevPos.x;
    const deltaY = clientY - prevPos.y;

    targetRotationY += deltaX * 0.008;
    targetRotationX += deltaY * 0.008;

    prevPos = { x: clientX, y: clientY };
  };

  const onPointerUp = () => {
    isDragging = false;
    setTimeout(() => { isUserInteracting = false; }, 3000);
  };

  container.addEventListener('mousedown', onPointerDown);
  window.addEventListener('mousemove', onPointerMove);
  window.addEventListener('mouseup', onPointerUp);

  container.addEventListener('touchstart', onPointerDown, { passive: true });
  window.addEventListener('touchmove', onPointerMove, { passive: true });
  window.addEventListener('touchend', onPointerUp);

  const resetBtn = document.getElementById('reset-cam-btn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      targetRotationX = 0.35;
      targetRotationY = 0.6;
    });
  }

  window.addEventListener('resize', onWindowResize);
}

function onWindowResize() {
  if (!container || !renderer || !camera) return;
  const width = container.clientWidth;
  const height = container.clientHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
}

function animate() {
  if (!isVisible) {
    animationFrameId = null;
    return;
  }

  animationFrameId = requestAnimationFrame(animate);

  if (!isUserInteracting && boardGroup) {
    boardGroup.rotation.y += 0.0035;
    boardGroup.rotation.x = Math.sin(Date.now() * 0.0008) * 0.04 + 0.28;
  } else if (boardGroup) {
    boardGroup.rotation.y += (targetRotationY - boardGroup.rotation.y) * 0.1;
    boardGroup.rotation.x += (targetRotationX - boardGroup.rotation.x) * 0.1;
  }

  renderer.render(scene, camera);
}

/* ==========================================================================
   THEATRICAL 3D STAGE & ESP32 HARDWARE LAB
   True 360° free orbit, correct upright orientation, and interactive diagnostics HUD
   ========================================================================== */

import * as THREE from 'three';

let theatricalModal, theatricalContainer;
let tScene, tCamera, tRenderer, tBoardGroup;
let tSubMeshes = [];
let isTheatricalActive = false;
let animationId = null;

let autoOrbit = true;
let isExploded = false;
let isWireframe = false;

// 360° Free Orbit & Zoom Physics
let isDragging = false;
let prevMouse = { x: 0, y: 0 };
let currentRotX = 0.25;
let currentRotY = 0.0;
let targetRotX = 0.25;
let targetRotY = 0.0;
let cameraDistance = 5.2;
let targetCameraDistance = 5.2;

export function initTheatricalStage(sharedGLTF) {
  theatricalModal = document.getElementById('theatrical-modal');
  theatricalContainer = document.getElementById('theatrical-canvas-container');

  const openBtn = document.getElementById('open-theatrical-btn');
  const closeBtn = document.getElementById('close-theatrical-btn');
  
  const standardBtn = document.getElementById('theat-mode-standard');
  const explodeBtn = document.getElementById('theat-mode-exploded');
  const wireframeBtn = document.getElementById('theat-mode-wireframe');
  const autoRotateBtn = document.getElementById('theat-autorotate-btn');

  if (openBtn) {
    openBtn.addEventListener('click', () => openTheatricalView(sharedGLTF));
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', closeTheatricalView);
  }

  if (standardBtn) {
    standardBtn.addEventListener('click', () => {
      setAssemblyMode('standard');
      updateButtonStates(standardBtn);
    });
  }

  if (explodeBtn) {
    explodeBtn.addEventListener('click', () => {
      setAssemblyMode('exploded');
      updateButtonStates(explodeBtn);
    });
  }

  if (wireframeBtn) {
    wireframeBtn.addEventListener('click', () => {
      toggleWireframe();
      updateButtonStates(wireframeBtn, isWireframe);
    });
  }

  if (autoRotateBtn) {
    autoRotateBtn.addEventListener('click', () => {
      autoOrbit = !autoOrbit;
      autoRotateBtn.textContent = autoOrbit ? "Auto-Orbit: ON" : "Auto-Orbit: OFF";
      autoRotateBtn.classList.toggle('active', autoOrbit);
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isTheatricalActive) {
      closeTheatricalView();
    }
  });
}

function updateButtonStates(activeBtn, isToggleActive = true) {
  if (!activeBtn) return;
  if (activeBtn.id === 'theat-mode-standard' || activeBtn.id === 'theat-mode-exploded') {
    document.getElementById('theat-mode-standard')?.classList.remove('active');
    document.getElementById('theat-mode-exploded')?.classList.remove('active');
    activeBtn.classList.add('active');
  } else {
    activeBtn.classList.toggle('active', isToggleActive);
  }
}

function openTheatricalView(sharedModel) {
  if (!theatricalModal || !theatricalContainer) return;

  theatricalModal.classList.remove('hidden');
  theatricalModal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  isTheatricalActive = true;

  if (!tRenderer) {
    setupTheatricalScene(sharedModel);
  } else {
    onTheatricalResize();
  }

  // Reset to natural upright orientation
  targetRotX = 0.25;
  targetRotY = 0.0;
  currentRotX = 0.25;
  currentRotY = 0.0;
  targetCameraDistance = 5.2;

  animateTheatrical();
}

function closeTheatricalView() {
  if (!theatricalModal) return;

  theatricalModal.classList.add('hidden');
  theatricalModal.style.display = 'none';
  document.body.style.overflow = '';
  isTheatricalActive = false;

  if (animationId) {
    cancelAnimationFrame(animationId);
    animationId = null;
  }
}

function setupTheatricalScene(modelToClone) {
  const width = window.innerWidth;
  const height = window.innerHeight;

  tScene = new THREE.Scene();
  tCamera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
  tCamera.position.set(0, 0, cameraDistance);
  tCamera.lookAt(0, 0, 0);

  tRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
  tRenderer.setSize(width, height);
  tRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  tRenderer.outputColorSpace = THREE.SRGBColorSpace;
  tRenderer.toneMapping = THREE.ACESFilmicToneMapping;
  tRenderer.toneMappingExposure = 1.3;
  tRenderer.shadowMap.enabled = true;

  theatricalContainer.appendChild(tRenderer.domElement);

  // Cinematic 4-Point Studio Lighting Rig
  const ambient = new THREE.AmbientLight(0xFFFFFF, 2.2);
  tScene.add(ambient);

  const keyLight = new THREE.DirectionalLight(0xFFFFFF, 3.8);
  keyLight.position.set(6, 10, 8);
  tScene.add(keyLight);

  const rimCyan = new THREE.DirectionalLight(0x38BDF8, 2.6);
  rimCyan.position.set(-8, 5, -5);
  tScene.add(rimCyan);

  const fillAmber = new THREE.DirectionalLight(0xF59E0B, 2.2);
  fillAmber.position.set(4, -6, 5);
  tScene.add(fillAmber);

  // Board Anchor
  tBoardGroup = new THREE.Group();
  tScene.add(tBoardGroup);

  // Clone Model with Right-Side Up Orientation
  if (modelToClone) {
    const clone = modelToClone.clone(true);
    // Ensure clean centering and upright posture
    clone.position.set(0, 0, 0);
    tBoardGroup.add(clone);

    tSubMeshes = [];
    clone.traverse((child) => {
      if (child.isMesh) {
        tSubMeshes.push({
          mesh: child,
          originalPos: child.position.clone(),
          originalMat: child.material
        });
      }
    });
  }

  // Free 360° Orbit & Zoom Event Listeners
  theatricalContainer.addEventListener('mousedown', (e) => {
    isDragging = true;
    prevMouse = { x: e.clientX, y: e.clientY };
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging || !isTheatricalActive) return;
    const dx = e.clientX - prevMouse.x;
    const dy = e.clientY - prevMouse.y;

    targetRotY += dx * 0.008;
    targetRotX += dy * 0.008;

    // Clamp vertical tilt to prevent inverting
    targetRotX = Math.max(-Math.PI / 2 + 0.05, Math.min(Math.PI / 2 - 0.05, targetRotX));

    prevMouse = { x: e.clientX, y: e.clientY };
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
  });

  // Touch support for free orbit
  theatricalContainer.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
      isDragging = true;
      prevMouse = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    if (!isDragging || !isTheatricalActive || e.touches.length !== 1) return;
    const dx = e.touches[0].clientX - prevMouse.x;
    const dy = e.touches[0].clientY - prevMouse.y;

    targetRotY += dx * 0.008;
    targetRotX += dy * 0.008;
    targetRotX = Math.max(-Math.PI / 2 + 0.05, Math.min(Math.PI / 2 - 0.05, targetRotX));

    prevMouse = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  }, { passive: true });

  window.addEventListener('touchend', () => {
    isDragging = false;
  });

  // Mouse Wheel Zoom
  theatricalContainer.addEventListener('wheel', (e) => {
    if (!isTheatricalActive) return;
    e.preventDefault();
    targetCameraDistance = Math.max(2.5, Math.min(9.0, targetCameraDistance + e.deltaY * 0.005));
  }, { passive: false });

  window.addEventListener('resize', onTheatricalResize);
}

function setAssemblyMode(mode) {
  isExploded = (mode === 'exploded');

  tSubMeshes.forEach((item, index) => {
    if (isExploded) {
      const offsetY = (index % 4) * 0.4 + 0.25;
      const offsetX = ((index % 3) - 1) * 0.25;
      item.mesh.position.set(
        item.originalPos.x + offsetX,
        item.originalPos.y + offsetY,
        item.originalPos.z
      );
    } else {
      item.mesh.position.copy(item.originalPos);
    }
  });
}

function toggleWireframe() {
  isWireframe = !isWireframe;

  tSubMeshes.forEach((item) => {
    if (isWireframe) {
      item.mesh.material = new THREE.MeshBasicMaterial({
        color: 0xF59E0B,
        wireframe: true
      });
    } else {
      item.mesh.material = item.originalMat;
    }
  });
}

function onTheatricalResize() {
  if (!tCamera || !tRenderer || !isTheatricalActive) return;
  const width = window.innerWidth;
  const height = window.innerHeight;
  tCamera.aspect = width / height;
  tCamera.updateProjectionMatrix();
  tRenderer.setSize(width, height);
}

function animateTheatrical() {
  if (!isTheatricalActive) return;

  animationId = requestAnimationFrame(animateTheatrical);

  // Smooth Auto-Orbit if not manually dragging
  if (autoOrbit && !isDragging) {
    targetRotY += 0.005;
  }

  // Smooth Inertial Interpolation for 360° Free Orbit
  currentRotX += (targetRotX - currentRotX) * 0.12;
  currentRotY += (targetRotY - currentRotY) * 0.12;
  cameraDistance += (targetCameraDistance - cameraDistance) * 0.12;

  if (tBoardGroup) {
    tBoardGroup.rotation.x = currentRotX;
    tBoardGroup.rotation.y = currentRotY;
  }

  if (tCamera) {
    tCamera.position.z = cameraDistance;
  }

  tRenderer.render(tScene, tCamera);
}

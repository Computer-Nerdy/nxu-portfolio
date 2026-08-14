import * as THREE from 'three';

let theatricalModal, theatricalContainer;
let tScene, tCamera, tRenderer, tBoardGroup, tSubMeshes = [];
let isTheatricalActive = false;
let animationId;
let currentCinematicAngle = 0;
let isExploded = false;
let isWireframe = false;

export function initTheatricalStage(sharedGLTF) {
  theatricalModal = document.getElementById('theatrical-modal');
  theatricalContainer = document.getElementById('theatrical-canvas-container');

  const openBtn = document.getElementById('open-theatrical-btn');
  const closeBtn = document.getElementById('close-theatrical-btn');
  const explodedBtn = document.getElementById('theatrical-explode-btn');
  const wireframeBtn = document.getElementById('theatrical-wireframe-btn');
  const videoPipToggle = document.getElementById('theatrical-video-toggle');
  const theatricalVideo = document.getElementById('theatrical-video');

  if (openBtn) {
    openBtn.addEventListener('click', () => openTheatricalView(sharedGLTF));
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', closeTheatricalView);
  }

  if (explodedBtn) {
    explodedBtn.addEventListener('click', toggleExplodedView);
  }

  if (wireframeBtn) {
    wireframeBtn.addEventListener('click', toggleWireframeView);
  }

  if (videoPipToggle && theatricalVideo) {
    videoPipToggle.addEventListener('click', () => {
      theatricalVideo.muted = !theatricalVideo.muted;
      videoPipToggle.textContent = theatricalVideo.muted ? "🔇 Unmute Audio" : "🔊 Mute Audio";
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isTheatricalActive) {
      closeTheatricalView();
    }
  });
}

function openTheatricalView(sharedModel) {
  if (!theatricalModal || !theatricalContainer) return;

  theatricalModal.classList.remove('hidden');
  theatricalModal.classList.add('active');
  document.body.style.overflow = 'hidden';
  isTheatricalActive = true;

  const video = document.getElementById('theatrical-video');
  if (video) {
    video.currentTime = 0;
    video.play().catch(() => {});
  }

  if (!tRenderer) {
    setupTheatricalScene(sharedModel);
  } else {
    onTheatricalResize();
  }

  animateTheatrical();
}

function closeTheatricalView() {
  if (!theatricalModal) return;

  theatricalModal.classList.remove('active');
  theatricalModal.classList.add('hidden');
  document.body.style.overflow = '';
  isTheatricalActive = false;

  const video = document.getElementById('theatrical-video');
  if (video) {
    video.pause();
  }

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
  tCamera.position.set(0, 3.2, 6.5);
  tCamera.lookAt(0, 0, 0);

  tRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
  tRenderer.setSize(width, height);
  tRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  tRenderer.outputColorSpace = THREE.SRGBColorSpace;
  tRenderer.toneMapping = THREE.ACESFilmicToneMapping;
  tRenderer.toneMappingExposure = 1.4;
  tRenderer.shadowMap.enabled = true;
  tRenderer.shadowMap.type = THREE.PCFSoftShadowMap;

  theatricalContainer.appendChild(tRenderer.domElement);

  // Cinematic 3-Point Lighting Rig
  const ambient = new THREE.AmbientLight(0xFFFFFF, 2.4);
  tScene.add(ambient);

  const keyLight = new THREE.DirectionalLight(0xFFFFFF, 3.5);
  keyLight.position.set(8, 14, 10);
  keyLight.castShadow = true;
  tScene.add(keyLight);

  const cyanRim = new THREE.DirectionalLight(0x38BDF8, 2.5);
  cyanRim.position.set(-10, 6, -6);
  tScene.add(cyanRim);

  const amberFill = new THREE.DirectionalLight(0xF59E0B, 2.2);
  amberFill.position.set(4, -8, 6);
  tScene.add(amberFill);

  // Clone Model Assembly
  if (modelToClone) {
    const clone = modelToClone.clone(true);
    tBoardGroup = clone;
    tScene.add(tBoardGroup);

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

  // Mouse Orbit Drag Controls for Theatrical View
  let isDragging = false;
  let prevMouse = { x: 0, y: 0 };
  let targetRotY = 0.5, targetRotX = 0.35;

  theatricalContainer.addEventListener('mousedown', (e) => {
    isDragging = true;
    prevMouse = { x: e.clientX, y: e.clientY };
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging || !isTheatricalActive) return;
    const dx = e.clientX - prevMouse.x;
    const dy = e.clientY - prevMouse.y;

    targetRotY += dx * 0.007;
    targetRotX += dy * 0.007;

    prevMouse = { x: e.clientX, y: e.clientY };
  });

  window.addEventListener('mouseup', () => { isDragging = false; });
  window.addEventListener('resize', onTheatricalResize);
}

function toggleExplodedView() {
  isExploded = !isExploded;
  const btn = document.getElementById('theatrical-explode-btn');
  if (btn) {
    btn.classList.toggle('active', isExploded);
    btn.textContent = isExploded ? "Assembly: Exploded View" : "Assembly: Default View";
  }

  tSubMeshes.forEach((item, index) => {
    if (isExploded) {
      const offsetY = (index % 4) * 0.35 + 0.2;
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

function toggleWireframeView() {
  isWireframe = !isWireframe;
  const btn = document.getElementById('theatrical-wireframe-btn');
  if (btn) {
    btn.classList.toggle('active', isWireframe);
    btn.textContent = isWireframe ? "Mode: Wireframe Mesh" : "Mode: Photorealistic PBR";
  }

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

  if (tBoardGroup) {
    currentCinematicAngle += 0.004;
    tBoardGroup.rotation.y = currentCinematicAngle;
    tBoardGroup.rotation.x = Math.sin(currentCinematicAngle * 0.7) * 0.08 + 0.32;
  }

  tRenderer.render(tScene, tCamera);
}

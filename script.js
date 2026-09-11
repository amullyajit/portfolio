// Amullyajit Nandi - Portfolio Interactive Controller & 3D Engine

document.addEventListener('DOMContentLoaded', () => {
  init3DLoader();
  init3DBackground();
  initNavHighlighting();
  initProjectFilters();
  initModals();
  initContactForm();
  initCopyEmail();
  initCrazyClickTransitions();
});

// ==========================================
// 1. CRAZY 3D OPENING SPLASH LOADER
// ==========================================
function init3DLoader() {
  const container = document.getElementById('loader3DBox');
  const loaderBar = document.getElementById('loaderBar');
  const loaderPercent = document.getElementById('loaderPercent');
  const introLoader = document.getElementById('introLoader');

  if (!container || typeof THREE === 'undefined') {
    if (introLoader) setTimeout(() => introLoader.classList.add('loaded'), 1000);
    return;
  }

  // Three.js Scene for Loader
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 1000);
  camera.position.z = 3.5;

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(160, 160);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  // 3D Outer Wireframe Icosahedron
  const outerGeo = new THREE.IcosahedronGeometry(1.2, 1);
  const outerMat = new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: true, wireframeLinewidth: 2 });
  const outerMesh = new THREE.Mesh(outerGeo, outerMat);
  scene.add(outerMesh);

  // 3D Inner Solid Accent Core
  const innerGeo = new THREE.OctahedronGeometry(0.75, 0);
  const innerMat = new THREE.MeshBasicMaterial({ color: 0xFF5964 });
  const innerMesh = new THREE.Mesh(innerGeo, innerMat);
  scene.add(innerMesh);

  // Animation Loop
  let reqId;
  function animateLoader() {
    reqId = requestAnimationFrame(animateLoader);
    outerMesh.rotation.x += 0.015;
    outerMesh.rotation.y += 0.02;
    innerMesh.rotation.x -= 0.02;
    innerMesh.rotation.y -= 0.025;
    renderer.render(scene, camera);
  }
  animateLoader();

  // Progress Counter (0% -> 100%)
  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.floor(Math.random() * 8) + 4;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);

      if (loaderBar) loaderBar.style.width = '100%';
      if (loaderPercent) loaderPercent.textContent = '100%';

      setTimeout(() => {
        if (introLoader) introLoader.classList.add('loaded');
        cancelAnimationFrame(reqId);
      }, 350);
    } else {
      if (loaderBar) loaderBar.style.width = `${progress}%`;
      if (loaderPercent) loaderPercent.textContent = `${progress}%`;
    }
  }, 50);
}

// ==========================================
// 2. INTERACTIVE 3D SOFTWARE & TECH BACKGROUND CANVAS
// ==========================================
function init3DBackground() {
  const canvas = document.getElementById('bgCanvas3D');
  if (!canvas || typeof THREE === 'undefined') return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 12;

  const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Helper to generate CanvasTexture for Software & Code Badges
  function createTechBadgeTexture(text, bgColor, textColor = '#FFFFFF') {
    const texCanvas = document.createElement('canvas');
    texCanvas.width = 256;
    texCanvas.height = 128;
    const ctx = texCanvas.getContext('2d');

    // Background card
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, 256, 128);

    // Thick Neo-Brutalist Border
    ctx.lineWidth = 12;
    ctx.strokeStyle = '#000000';
    ctx.strokeRect(6, 6, 244, 116);

    // Code / Tech Text
    ctx.fillStyle = textColor;
    ctx.font = 'bold 52px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 128, 64);

    return new THREE.CanvasTexture(texCanvas);
  }

  const shapes = [];

  // Software & Code Badges data
  const techTokens = [
    { text: '</>', bg: '#FF5964', color: '#FFF' },
    { text: '{ }', bg: '#2B7FFF', color: '#FFF' },
    { text: 'JAVA', bg: '#007396', color: '#FFF' },
    { text: 'SPRING', bg: '#6DB33F', color: '#FFF' },
    { text: 'AI/ML', bg: '#FFD166', color: '#000' },
    { text: 'WebXR', bg: '#EF2D5E', color: '#FFF' },
    { text: 'Python', bg: '#3776AB', color: '#FFF' },
    { text: '0101', bg: '#06D6A0', color: '#000' },
    { text: 'SQL', bg: '#9D4EDD', color: '#FFF' },
    { text: 'API', bg: '#FF9F1C', color: '#000' },
    { text: 'Git', bg: '#F05032', color: '#FFF' },
    { text: '=>', bg: '#38BDF8', color: '#000' },
    { text: '[ ]', bg: '#181818', color: '#FFF' },
    { text: '3D VR', bg: '#2B7FFF', color: '#FFF' }
  ];

  // 1. Create Floating 3D Software Code Badges
  const badgeGeo = new THREE.PlaneGeometry(2.0, 1.0);

  techTokens.forEach((token) => {
    const texture = createTechBadgeTexture(token.text, token.bg, token.color);
    const mat = new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.45 // Lowered opacity for clean typography contrast
    });

    const mesh = new THREE.Mesh(badgeGeo, mat);

    // Random 3D Position - Pushed deeper in Z-axis
    mesh.position.x = (Math.random() - 0.5) * 32;
    mesh.position.y = (Math.random() - 0.5) * 32;
    mesh.position.z = (Math.random() - 0.5) * 12 - 4;

    mesh.rotation.x = (Math.random() - 0.5) * 0.4;
    mesh.rotation.y = (Math.random() - 0.5) * 0.6;

    mesh.userData = {
      rotSpeedX: (Math.random() - 0.5) * 0.006,
      rotSpeedY: (Math.random() - 0.5) * 0.008,
      floatSpeedY: (Math.random() - 0.5) * 0.005
    };

    scene.add(mesh);
    shapes.push(mesh);
  });

  // 2. Create Floating 3D Geometric Software Nodes
  const colors = [0xFF5964, 0x2B7FFF, 0xFFD166, 0x06D6A0, 0x9D4EDD, 0x000000];
  const geometries = [
    new THREE.BoxGeometry(1.1, 1.1, 1.1),
    new THREE.TetrahedronGeometry(1.1),
    new THREE.OctahedronGeometry(1.0),
    new THREE.TorusGeometry(0.8, 0.28, 12, 24),
    new THREE.IcosahedronGeometry(0.95)
  ];

  for (let i = 0; i < 14; i++) {
    const randomGeo = geometries[Math.floor(Math.random() * geometries.length)];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    const mat = new THREE.MeshBasicMaterial({
      color: randomColor,
      wireframe: true,
      wireframeLinewidth: 1.5,
      transparent: true,
      opacity: 0.35
    });

    const mesh = new THREE.Mesh(randomGeo, mat);

    mesh.position.x = (Math.random() - 0.5) * 32;
    mesh.position.y = (Math.random() - 0.5) * 32;
    mesh.position.z = (Math.random() - 0.5) * 14 - 5;

    mesh.rotation.x = Math.random() * Math.PI;
    mesh.rotation.y = Math.random() * Math.PI;
    
    mesh.userData = {
      rotSpeedX: (Math.random() - 0.5) * 0.01,
      rotSpeedY: (Math.random() - 0.5) * 0.012,
      floatSpeedY: (Math.random() - 0.5) * 0.004
    };

    scene.add(mesh);
    shapes.push(mesh);
  }

  // Interactive Mouse Parallax Dynamics
  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;
  let targetY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX - window.innerWidth / 2) * 0.0008;
    mouseY = (e.clientY - window.innerHeight / 2) * 0.0008;
  });

  // Render Loop
  function animateBg() {
    requestAnimationFrame(animateBg);

    targetX += (mouseX - targetX) * 0.05;
    targetY += (mouseY - targetY) * 0.05;

    camera.position.x = targetX * 4;
    camera.position.y = -targetY * 4;
    camera.lookAt(scene.position);

    shapes.forEach(shape => {
      shape.rotation.x += shape.userData.rotSpeedX;
      shape.rotation.y += shape.userData.rotSpeedY;
      shape.position.y += Math.sin(Date.now() * 0.001 + shape.position.x) * shape.userData.floatSpeedY;
    });

    renderer.render(scene, camera);
  }
  animateBg();

  // Responsive Resize
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

// 1. Navigation Active Section Observer
function initNavHighlighting() {
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-item[href^="#"]');

  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -60% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navItems.forEach(item => {
          if (item.getAttribute('href') === `#${id}`) {
            item.classList.add('active');
          } else {
            item.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => observer.observe(section));
}

// 2. Filter Projects Grid
function initProjectFilters() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const projectCards = document.querySelectorAll('.project-card');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.4s ease';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

// 3. Modal Popup System (Resume, Project Details)
function initModals() {
  const modalOverlay = document.getElementById('modalOverlay');
  const modalTitle = document.getElementById('modalTitle');
  const modalBody = document.getElementById('modalBody');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const resumeBtn = document.getElementById('resumeBtn');

  function openModal(title, contentHTML) {
    modalTitle.textContent = title;
    modalBody.innerHTML = contentHTML;
    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = 'auto';
  }

  // Resume Modal for Amullyajit Nandi
  if (resumeBtn) {
    resumeBtn.addEventListener('click', () => {
      openModal(
        '📄 Amullyajit Nandi - Resume Overview',
        `
        <div style="margin-bottom: 20px;">
          <h4 style="margin-bottom: 6px; font-size: 1.2rem; color: var(--text-main);">Amullyajit Nandi</h4>
          <p style="margin-bottom: 12px; font-weight:600; color: var(--accent-blue);">B.Tech CSE (IoTCSBT) @ IEM Kolkata (CGPA: 8.20)</p>
          <p style="margin-bottom: 14px; font-size: 0.95rem; line-height: 1.6;">
            Pre-final-year student at IEM Kolkata with hands-on experience in full-stack engineering, AI/ML models, 3D WebXR VR systems, and Blockchain technology.
          </p>
          
          <h4 style="margin-top: 16px; margin-bottom: 6px;">Key Highlights:</h4>
          <ul style="padding-left: 20px; line-height: 1.8; font-size:0.95rem;">
            <li><strong>Experience:</strong> Full Stack Engineer Trainee @ Sofzenix IT Solutions (E-Bank23 Core Banking)</li>
            <li><strong>Projects:</strong> Yatri_AI (3D VR Simulator), HEPASENSE (AI Health Diagnostics), BuildMyCity VR</li>
            <li><strong>Awards:</strong> 2nd Position in Govt. of WB Cyber Attack AI Competition, PEC Hacks 3.0 Auth0 Winner, 5x National Finalist</li>
            <li><strong>Certification:</strong> Introduction to Applied Cryptography (Univ of Colorado System)</li>
          </ul>
        </div>
        <div style="display: flex; gap: 12px; margin-top: 24px; flex-wrap: wrap;">
          <a href="mailto:amullyajitn@gmail.com" class="btn-brutal btn-primary">Contact Amullyajit 📧</a>
          <button class="btn-brutal btn-secondary" onclick="closeModal()">Close</button>
        </div>
        `
      );
    });
  }

  // Project Demo Triggers
  document.querySelectorAll('.demo-modal-trigger').forEach(btn => {
    btn.addEventListener('click', () => {
      const title = btn.getAttribute('data-title');
      const desc = btn.getAttribute('data-desc');
      openModal(
        `📌 ${title}`,
        `
        <p style="font-size: 1.1rem; margin-bottom: 20px; line-height: 1.7;">${desc}</p>
        <div style="background: #FAF7EE; border: 2px solid #000; padding: 16px; border-radius: 8px; margin-bottom: 20px;">
          <h4 style="margin-bottom: 8px;">Technical Specification:</h4>
          <ul style="padding-left: 20px; line-height: 1.8;">
            <li>Production-ready code architecture & state management</li>
            <li>Tested performance and responsive cross-device layout</li>
            <li>Integration with external APIs and data structures</li>
          </ul>
        </div>
        <div style="display: flex; gap: 12px;">
          <a href="https://github.com/amullyajit" target="_blank" class="btn-brutal btn-primary">GitHub Profile ↗</a>
          <button class="btn-brutal btn-secondary" onclick="closeModal()">Close</button>
        </div>
        `
      );
    });
  });

  // Close handlers
  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });
  }

  window.closeModal = closeModal;
}

// 4. Contact Form Handler (Delivers messages straight to amullyajitn@gmail.com)
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const message = document.getElementById('message').value;

      // Check if Web3Forms access key is set
      const accessKeyInput = form.querySelector('input[name="access_key"]');
      const accessKey = accessKeyInput ? accessKeyInput.value : '';

      if (accessKey && accessKey !== 'YOUR_FREE_WEB3FORMS_KEY') {
        // Send via Web3Forms API directly to Gmail
        try {
          const formData = new FormData(form);
          const response = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            body: formData
          });
          const result = await response.json();
          if (result.success) {
            showToast(`Thank you ${name}! Your message has been sent directly to Amullyajit's inbox! 🚀`);
            form.reset();
          } else {
            showToast('Form error. Opening email client...');
            launchMailto(name, email, message);
          }
        } catch (err) {
          launchMailto(name, email, message);
        }
      } else {
        // Fallback: Open visitor's mail client directly prefilled to amullyajitn@gmail.com
        launchMailto(name, email, message);
        showToast(`Opening your email client to send message to Amullyajit! 📧`);
        form.reset();
      }
    });
  }
}

function launchMailto(name, email, message) {
  const mailtoUrl = `mailto:amullyajitn@gmail.com?subject=${encodeURIComponent('Portfolio Message from ' + name)}&body=${encodeURIComponent('Name: ' + name + '\nEmail: ' + email + '\n\nMessage:\n' + message)}`;
  window.location.href = mailtoUrl;
}

// 5. Copy Email Action
function initCopyEmail() {
  const copyBtn = document.getElementById('copyEmailBtn');
  const emailText = document.getElementById('emailText');
  
  if (copyBtn && emailText) {
    copyBtn.addEventListener('click', () => {
      const email = emailText.textContent;
      navigator.clipboard.writeText(email).then(() => {
        showToast('Amullyajit\'s email copied to clipboard! 📋');
      }).catch(() => {
        showToast(`Email: ${email}`);
      });
    });
  }
}

// Global Toast Helper
function showToast(message) {
  const toast = document.getElementById('toastNotification');
  if (toast) {
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3500);
  }
}
window.showToast = showToast;

// ==========================================
// CRAZY BUTTON CLICK TRANSITIONS & PARTICLE BURSTS
// ==========================================
function initCrazyClickTransitions() {
  // Particle Burst Helper
  function createBurstParticles(x, y, emojis = ['⚡', '🚀', '✨', '💻', '💥']) {
    const particleCount = 8;
    for (let i = 0; i < particleCount; i++) {
      const p = document.createElement('div');
      p.className = 'click-particle';
      p.textContent = emojis[Math.floor(Math.random() * emojis.length)];

      const angle = (Math.PI * 2 * i) / particleCount + (Math.random() * 0.4 - 0.2);
      const distance = Math.random() * 80 + 40;
      const dx = `${Math.cos(angle) * distance}px`;
      const dy = `${Math.sin(angle) * distance - 30}px`;
      const rot = `${(Math.random() - 0.5) * 360}deg`;

      p.style.left = `${x}px`;
      p.style.top = `${y}px`;
      p.style.setProperty('--dx', dx);
      p.style.setProperty('--dy', dy);
      p.style.setProperty('--rot', rot);

      document.body.appendChild(p);

      setTimeout(() => p.remove(), 700);
    }
  }

  // 1. Hero CTAs & Primary Action Buttons (Neo-Brutalist Stamp & Particle Explosion)
  document.querySelectorAll('.btn-brutal, button[type="submit"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      btn.classList.remove('anim-stamp');
      void btn.offsetWidth; // Trigger reflow
      btn.classList.add('anim-stamp');

      createBurstParticles(e.clientX, e.clientY, ['⚡', '🚀', '✨', '💻', '💥', '🔥']);
    });
  });

  // 2. Top Header Navigation Pills (Cyber Wobble Flip & Burst)
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
      item.classList.remove('anim-wobble');
      void item.offsetWidth;
      item.classList.add('anim-wobble');

      createBurstParticles(e.clientX, e.clientY, ['⚡', '🎯', '🔥', '✨', '💻']);
    });
  });

  // 3. Project Category Filter Tabs (Rubber Band Pulse & 3D Staggered Card Pop)
  document.querySelectorAll('.tab-btn').forEach(tab => {
    tab.addEventListener('click', (e) => {
      tab.classList.remove('anim-rubber');
      void tab.offsetWidth;
      tab.classList.add('anim-rubber');

      createBurstParticles(e.clientX, e.clientY, ['📂', '⚡', '✨', '🎯']);

      // Staggered 3D Card Pop Animation on visible project cards
      setTimeout(() => {
        const visibleCards = document.querySelectorAll('.project-card[style*="display: flex"]');
        visibleCards.forEach((card, idx) => {
          card.classList.remove('anim-card-pop');
          void card.offsetWidth;
          setTimeout(() => {
            card.classList.add('anim-card-pop');
          }, idx * 90);
        });
      }, 50);
    });
  });

  // 4. Modal Open Triggers (RESUME & Project Demo Buttons)
  document.querySelectorAll('#resumeBtn, .demo-modal-trigger, .blog-read-btn').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      createBurstParticles(e.clientX, e.clientY, ['📄', '⚡', '🌟', '💻', '🚀']);
    });
  });

  // 5. Copy Email & Social Media Buttons (Stamp + Confetti Burst)
  document.querySelectorAll('#copyEmailBtn, .social-btn').forEach(sBtn => {
    sBtn.addEventListener('click', (e) => {
      createBurstParticles(e.clientX, e.clientY, ['📋', '✨', '🚀', '💙', '🎉', '⚡']);
    });
  });
}

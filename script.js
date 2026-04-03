/* ============================================================
   CHRONO PRESTIGE — Frontend Logic + Three.js 3D Scenes
   ============================================================ */

// ==================== DATA ====================
const PRODUCTS = [
  {
    id: 1,
    name: "Perpetual Noir",
    ref: "CP-2025-PN-001",
    category: "perpetual",
    price: "$42,500",
    priceNum: 42500,
    badge: "New",
    desc: "The Perpetual Noir is an exercise in controlled darkness. A matte black dial with hand-applied gold hour markers, encased in 40mm platinum. The movement — caliber CP-3135 — beats at 28,800 vph with a 70-hour power reserve.",
    specs: [
      ["Case Material", "950 Platinum"],
      ["Dial", "Lacquered Black, Gold Markers"],
      ["Movement", "Caliber CP-3135, In-house"],
      ["Power Reserve", "70 Hours"],
      ["Water Resistance", "100M / 330FT"],
      ["Case Diameter", "40mm"],
      ["Crystal", "Sapphire, anti-reflective"],
      ["Bracelet", "Platinum Oyster, Clasp-lock"],
    ],
    color: 0x1a1a1a,
    accentColor: 0xC9A84C,
    dialColor: 0x080808
  },
  {
    id: 2,
    name: "Soleil Blanc",
    ref: "CP-2025-SB-002",
    category: "classic",
    price: "$28,900",
    priceNum: 28900,
    badge: "Classic",
    desc: "The Soleil Blanc is Chrono Prestige's purist statement. A sunburst ivory dial catches every nuance of ambient light, set within 38mm white gold. Time is not marked — it is unveiled.",
    specs: [
      ["Case Material", "18k White Gold"],
      ["Dial", "Ivory Sunburst, Dauphine Hands"],
      ["Movement", "Caliber CP-2130, In-house"],
      ["Power Reserve", "55 Hours"],
      ["Water Resistance", "50M / 165FT"],
      ["Case Diameter", "38mm"],
      ["Crystal", "Sapphire, domed"],
      ["Strap", "Alligator, white gold buckle"],
    ],
    color: 0xD4C9B0,
    accentColor: 0xE8E8E8,
    dialColor: 0xF0EDE6
  },
  {
    id: 3,
    name: "GMT Meridian",
    ref: "CP-2025-GM-003",
    category: "sport",
    price: "$35,200",
    priceNum: 35200,
    badge: "Sport",
    desc: "Two time zones. One wrist. The GMT Meridian was built for the modern nomad — a traveller with standards. The rotating bezel tracks a second timezone while the movement maintains chronometer precision across any altitude.",
    specs: [
      ["Case Material", "Oystersteel"],
      ["Dial", "Blue Lacquer, GMT Complication"],
      ["Movement", "Caliber CP-3285, In-house"],
      ["Power Reserve", "72 Hours"],
      ["Water Resistance", "300M / 985FT"],
      ["Case Diameter", "41mm"],
      ["Crystal", "Sapphire, scratch-resistant"],
      ["Bracelet", "Oystersteel with safety clasp"],
    ],
    color: 0x1a2844,
    accentColor: 0x4A7BB5,
    dialColor: 0x1a2844
  },
  {
    id: 4,
    name: "Aurum Regis",
    ref: "CP-2025-AR-004",
    category: "classic",
    price: "$58,000",
    priceNum: 58000,
    badge: "Prestige",
    desc: "The flagship of the Classic line. Full 18k yellow gold construction, paved champagne dial with diamonds, and a movement that takes one watchmaker six months to assemble.",
    specs: [
      ["Case Material", "18k Yellow Gold"],
      ["Dial", "Champagne, Diamond Indices"],
      ["Movement", "Caliber CP-9001, Skeleton"],
      ["Power Reserve", "65 Hours"],
      ["Water Resistance", "30M / 100FT"],
      ["Case Diameter", "39mm"],
      ["Crystal", "Sapphire, anti-reflective"],
      ["Bracelet", "18k Gold President"],
    ],
    color: 0xC9A84C,
    accentColor: 0xF5D98B,
    dialColor: 0xD4A84C
  },
  {
    id: 5,
    name: "Submariner Profond",
    ref: "CP-2025-SP-005",
    category: "sport",
    price: "$22,400",
    priceNum: 22400,
    badge: "Diver",
    desc: "Engineered for depths. The Submariner Profond descends to 1000 meters with the same composure it commands in a boardroom. Unidirectional ceramic bezel, helium escape valve, luminous hands.",
    specs: [
      ["Case Material", "Oystersteel"],
      ["Dial", "Matte Black, SuperLuminova"],
      ["Movement", "Caliber CP-3235, In-house"],
      ["Power Reserve", "70 Hours"],
      ["Water Resistance", "1000M / 3280FT"],
      ["Case Diameter", "42mm"],
      ["Crystal", "Sapphire, double-domed"],
      ["Bracelet", "Oystersteel, glide-lock"],
    ],
    color: 0x0a0a0a,
    accentColor: 0x2a6e5a,
    dialColor: 0x050505
  },
  {
    id: 6,
    name: "Chronographe Elite",
    ref: "CP-2025-CE-006",
    category: "perpetual",
    price: "$47,800",
    priceNum: 47800,
    badge: "Limited",
    desc: "The pursuit of precision made tangible. Three sub-dials track elapsed time to the tenth of a second, while a flyback complication resets without stopping. A tool watch reimagined as jewellery.",
    specs: [
      ["Case Material", "18k Rose Gold"],
      ["Dial", "Anthracite, Panda Sub-dials"],
      ["Movement", "Caliber CP-4130, Flyback"],
      ["Power Reserve", "72 Hours"],
      ["Water Resistance", "100M / 330FT"],
      ["Case Diameter", "41mm"],
      ["Crystal", "Sapphire, box-type"],
      ["Bracelet", "18k Rose Gold Oyster"],
    ],
    color: 0x2a1a0f,
    accentColor: 0xB5704A,
    dialColor: 0x1a1a1a
  }
];

// ==================== STATE ====================
let cart = JSON.parse(localStorage.getItem('cp_cart') || '[]');
let currentUser = JSON.parse(localStorage.getItem('cp_user') || 'null');
let selectedProduct = PRODUCTS[0];
let activeFilter = 'all';
let heroScene, craftScene, detailScene;
let heroAnimId, craftAnimId, detailAnimId;

// Mini canvas scenes per card
let miniScenes = [];

// ==================== INIT ====================
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('hidden');
    initPage();
  }, 2000);
});

function initPage() {
  initCursor();
  initNavbar();
  renderFeaturedGrid();
  updateCartCount();
  showPage('home');
}

// ==================== CURSOR ====================
function initCursor() {
  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursorFollower');
  let mx = 0, my = 0, fx = 0, fy = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top = my + 'px';
  });

  function animFollower() {
    fx += (mx - fx) * 0.12;
    fy += (my - fy) * 0.12;
    follower.style.left = fx + 'px';
    follower.style.top = fy + 'px';
    requestAnimationFrame(animFollower);
  }
  animFollower();

  document.querySelectorAll('a, button').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });
}

// ==================== NAVBAR ====================
function initNavbar() {
  window.addEventListener('scroll', () => {
    const nav = document.getElementById('navbar');
    nav.classList.toggle('scrolled', window.scrollY > 50);
  });
}

function toggleMenu() {
  document.getElementById('navLinks').classList.toggle('open');
}

// ==================== PAGE ROUTER ====================
function showPage(pageId) {
  // Stop all animations
  if (heroAnimId) cancelAnimationFrame(heroAnimId);
  if (craftAnimId) cancelAnimationFrame(craftAnimId);
  if (detailAnimId) cancelAnimationFrame(detailAnimId);

  // Dispose mini scenes
  miniScenes.forEach(s => { if (s.renderer) s.renderer.dispose(); });
  miniScenes = [];

  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const target = document.getElementById('page-' + pageId);
  if (target) {
    target.classList.add('active');
    window.scrollTo(0, 0);
  }

  // Update nav active state
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.classList.toggle('active', a.dataset.page === pageId);
  });

  // Init page-specific logic
  setTimeout(() => {
    if (pageId === 'home') {
      initHeroScene();
      initCraftScene();
      renderFeaturedGrid();
    } else if (pageId === 'collections') {
      renderProductsGrid(activeFilter);
    } else if (pageId === 'product-detail') {
      renderProductInfo();
      initDetailScene();
    } else if (pageId === 'cart') {
      renderCart();
    }
  }, 50);
}

// ==================== THREE.JS: WATCH FACTORY ====================
function createWatchMesh(scene, product, scale = 1) {
  const group = new THREE.Group();

  // Watch case (cylinder)
  const caseGeo = new THREE.CylinderGeometry(1.2 * scale, 1.2 * scale, 0.28 * scale, 64);
  const caseMat = new THREE.MeshStandardMaterial({
    color: product.color || 0x1a1a1a,
    metalness: 0.9,
    roughness: 0.15,
  });
  const watchCase = new THREE.Mesh(caseGeo, caseMat);
  group.add(watchCase);

  // Dial face
  const dialGeo = new THREE.CylinderGeometry(1.1 * scale, 1.1 * scale, 0.05 * scale, 64);
  const dialMat = new THREE.MeshStandardMaterial({
    color: product.dialColor || 0x080808,
    metalness: 0.3,
    roughness: 0.4,
  });
  const dial = new THREE.Mesh(dialGeo, dialMat);
  dial.position.y = 0.17 * scale;
  group.add(dial);

  // Bezel ring
  const bezelGeo = new THREE.TorusGeometry(1.2 * scale, 0.06 * scale, 16, 64);
  const bezelMat = new THREE.MeshStandardMaterial({
    color: product.accentColor || 0xC9A84C,
    metalness: 1, roughness: 0.1,
  });
  const bezel = new THREE.Mesh(bezelGeo, bezelMat);
  bezel.rotation.x = Math.PI / 2;
  bezel.position.y = 0.14 * scale;
  group.add(bezel);

  // Crown
  const crownGeo = new THREE.CylinderGeometry(0.08 * scale, 0.08 * scale, 0.22 * scale, 16);
  const crown = new THREE.Mesh(crownGeo, bezelMat);
  crown.rotation.z = Math.PI / 2;
  crown.position.set(1.28 * scale, 0, 0);
  group.add(crown);

  // Hour markers (12)
  for (let i = 0; i < 12; i++) {
    const angle = (i / 12) * Math.PI * 2;
    const markerGeo = new THREE.BoxGeometry(
      0.04 * scale, 0.005 * scale,
      i % 3 === 0 ? 0.18 * scale : 0.10 * scale
    );
    const markerMat = new THREE.MeshStandardMaterial({
      color: product.accentColor || 0xC9A84C,
      metalness: 1, roughness: 0.1, emissive: product.accentColor, emissiveIntensity: 0.1
    });
    const marker = new THREE.Mesh(markerGeo, markerMat);
    marker.position.set(
      Math.sin(angle) * 0.88 * scale,
      0.19 * scale,
      Math.cos(angle) * 0.88 * scale
    );
    marker.rotation.y = angle;
    group.add(marker);
  }

  // Hour hand
  const hourGeo = new THREE.BoxGeometry(0.045 * scale, 0.01 * scale, 0.52 * scale);
  const handMat = new THREE.MeshStandardMaterial({ color: 0xEEEEEE, metalness: 0.9, roughness: 0.1 });
  const hourHand = new THREE.Mesh(hourGeo, handMat);
  hourHand.position.set(0, 0.2 * scale, -0.18 * scale);
  group.add(hourHand);

  // Minute hand
  const minGeo = new THREE.BoxGeometry(0.03 * scale, 0.01 * scale, 0.75 * scale);
  const minuteHand = new THREE.Mesh(minGeo, handMat);
  minuteHand.position.set(0, 0.21 * scale, -0.25 * scale);
  group.add(minuteHand);

  // Seconds hand
  const secGeo = new THREE.BoxGeometry(0.015 * scale, 0.008 * scale, 0.9 * scale);
  const secMat = new THREE.MeshStandardMaterial({ color: 0xDD4444, metalness: 0.8, roughness: 0.2 });
  const secHand = new THREE.Mesh(secGeo, secMat);
  secHand.position.set(0, 0.22 * scale, -0.25 * scale);
  group.add(secHand);

  // Strap (top and bottom)
  [-1, 1].forEach(dir => {
    const strapGeo = new THREE.BoxGeometry(0.75 * scale, 0.18 * scale, 0.65 * scale);
    const strapMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.8, metalness: 0.1 });
    const strap = new THREE.Mesh(strapGeo, strapMat);
    strap.position.set(0, 0, dir * 1.5 * scale);
    group.add(strap);

    // Strap stitching line
    const stitchGeo = new THREE.BoxGeometry(0.62 * scale, 0.19 * scale, 0.01);
    const stitchMat = new THREE.MeshStandardMaterial({ color: 0x333333 });
    const stitch = new THREE.Mesh(stitchGeo, stitchMat);
    stitch.position.set(0, 0.09 * scale, dir * 1.5 * scale);
    group.add(stitch);
  });

  scene.add(group);
  return { group, hourHand, minuteHand, secHand };
}

function addLighting(scene) {
  const ambient = new THREE.AmbientLight(0xffffff, 0.3);
  scene.add(ambient);

  const keyLight = new THREE.DirectionalLight(0xfff5e0, 2.5);
  keyLight.position.set(5, 8, 5);
  scene.add(keyLight);

  const fillLight = new THREE.DirectionalLight(0x8899ff, 0.5);
  fillLight.position.set(-5, 2, -3);
  scene.add(fillLight);

  const rimLight = new THREE.DirectionalLight(0xC9A84C, 1.5);
  rimLight.position.set(0, -5, -8);
  scene.add(rimLight);

  const pointGold = new THREE.PointLight(0xC9A84C, 1.2, 12);
  pointGold.position.set(2, 3, 2);
  scene.add(pointGold);
}

// ==================== HERO SCENE ====================
function initHeroScene() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas || canvas._initialized) return;
  canvas._initialized = true;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x080808, 0.08);

  const camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
  camera.position.set(0, 1.5, 7);

  addLighting(scene);

  // Particle field
  const particleCount = 800;
  const positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 30;
  }
  const particleGeo = new THREE.BufferGeometry();
  particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const particleMat = new THREE.PointsMaterial({ color: 0xC9A84C, size: 0.03, transparent: true, opacity: 0.5 });
  scene.add(new THREE.Points(particleGeo, particleMat));

  // Main watch
  const { group, hourHand, minuteHand, secHand } = createWatchMesh(scene, PRODUCTS[0], 1.4);
  group.rotation.x = -0.15;
  group.position.set(2.5, 0, 0);

  let mouseX = 0, mouseY = 0;
  document.addEventListener('mousemove', e => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  const clock = new THREE.Clock();
  function animate() {
    heroAnimId = requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    // Auto rotate + mouse influence
    group.rotation.y = t * 0.3 + mouseX * 0.5;
    group.rotation.x = -0.15 + mouseY * 0.2;

    // Animate hands
    const seconds = t % 60;
    const minutes = (t / 60) % 60;
    const hours = (t / 3600) % 12;
    secHand.rotation.y = -(seconds / 60) * Math.PI * 2;
    minuteHand.rotation.y = -(minutes / 60) * Math.PI * 2;
    hourHand.rotation.y = -(hours / 12) * Math.PI * 2;

    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', () => {
    if (!canvas.parentElement) return;
    const w = canvas.clientWidth, h = canvas.clientHeight;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  });
}

// ==================== CRAFT SCENE ====================
function initCraftScene() {
  const container = document.getElementById('craftCanvas');
  if (!container || container._initialized) return;
  container._initialized = true;

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.3;
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 100);
  camera.position.set(0, 2, 6);

  addLighting(scene);

  const { group, hourHand, minuteHand, secHand } = createWatchMesh(scene, PRODUCTS[3], 1.2);
  const clock = new THREE.Clock();

  function animate() {
    craftAnimId = requestAnimationFrame(animate);
    const t = clock.getElapsedTime();
    group.rotation.y = Math.sin(t * 0.4) * 0.8 + Math.PI * 0.1;
    group.rotation.x = Math.sin(t * 0.2) * 0.1 - 0.1;
    group.position.y = Math.sin(t * 0.5) * 0.08;
    secHand.rotation.y = -(t % 60 / 60) * Math.PI * 2;
    minuteHand.rotation.y = -(t / 60 % 60 / 60) * Math.PI * 2;
    hourHand.rotation.y = -(t / 3600 % 12 / 12) * Math.PI * 2;
    renderer.render(scene, camera);
  }
  animate();
}

// ==================== DETAIL SCENE ====================
function initDetailScene() {
  const canvas = document.getElementById('detailCanvas');
  if (!canvas) return;
  canvas._initialized = false;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  const w = canvas.parentElement.clientWidth;
  const h = canvas.parentElement.clientHeight || window.innerHeight;
  renderer.setSize(w, h);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.4;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100);
  camera.position.set(0, 1, 8);

  addLighting(scene);

  const { group, hourHand, minuteHand, secHand } = createWatchMesh(scene, selectedProduct, 1.6);

  // Mouse interaction for detail view
  let isPointerDown = false;
  let lastX = 0, lastY = 0;
  let rotX = -0.1, rotY = 0;
  let velocityX = 0, velocityY = 0;
  let zoom = 8;

  canvas.addEventListener('pointerdown', e => { isPointerDown = true; lastX = e.clientX; lastY = e.clientY; });
  canvas.addEventListener('pointerup', () => { isPointerDown = false; });
  canvas.addEventListener('pointermove', e => {
    if (!isPointerDown) return;
    velocityX += (e.clientX - lastX) * 0.012;
    velocityY += (e.clientY - lastY) * 0.012;
    lastX = e.clientX; lastY = e.clientY;
  });
  canvas.addEventListener('wheel', e => {
    zoom = Math.max(4, Math.min(14, zoom + e.deltaY * 0.01));
  });

  const clock = new THREE.Clock();
  function animate() {
    detailAnimId = requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    if (!isPointerDown) {
      velocityX *= 0.95;
      velocityY *= 0.95;
      rotY += 0.005;
    }
    rotY += velocityX;
    rotX = Math.max(-0.6, Math.min(0.6, rotX + velocityY));

    group.rotation.y = rotY;
    group.rotation.x = rotX;

    camera.position.z += (zoom - camera.position.z) * 0.08;

    secHand.rotation.y = -(t % 60 / 60) * Math.PI * 2;
    minuteHand.rotation.y = -(t / 60 % 60 / 60) * Math.PI * 2;
    hourHand.rotation.y = -(t / 3600 % 12 / 12) * Math.PI * 2;

    renderer.render(scene, camera);
  }
  animate();
}

// ==================== MINI CARD SCENES ====================
function initMiniScene(container, product) {
  if (!container) return;
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 50);
  camera.position.set(0, 1, 5.5);

  addLighting(scene);
  const { group, secHand, minuteHand, hourHand } = createWatchMesh(scene, product, 0.85);

  const clock = new THREE.Clock();
  let animId;
  function animate() {
    animId = requestAnimationFrame(animate);
    const t = clock.getElapsedTime();
    group.rotation.y = t * 0.35;
    group.position.y = Math.sin(t * 0.6) * 0.05;
    secHand.rotation.y = -(t % 60 / 60) * Math.PI * 2;
    minuteHand.rotation.y = -(t / 60 % 60 / 60) * Math.PI * 2;
    hourHand.rotation.y = -(t / 3600 % 12 / 12) * Math.PI * 2;
    renderer.render(scene, camera);
  }
  animate();
  miniScenes.push({ renderer, animId });
}

// ==================== RENDER PRODUCT GRIDS ====================
function renderFeaturedGrid() {
  const grid = document.getElementById('featuredGrid');
  if (!grid) return;
  grid.innerHTML = '';
  PRODUCTS.slice(0, 3).forEach(product => {
    grid.appendChild(createProductCard(product));
  });
  // Init mini scenes after DOM update
  setTimeout(() => {
    PRODUCTS.slice(0, 3).forEach(p => {
      const container = document.getElementById('mini-' + p.id);
      if (container) initMiniScene(container, p);
    });
  }, 50);
}

function renderProductsGrid(filter) {
  const grid = document.getElementById('productsGrid');
  if (!grid) return;
  grid.innerHTML = '';
  const filtered = filter === 'all' ? PRODUCTS : PRODUCTS.filter(p => p.category === filter);
  filtered.forEach(product => grid.appendChild(createProductCard(product)));
  setTimeout(() => {
    filtered.forEach(p => {
      const container = document.getElementById('mini-' + p.id);
      if (container) initMiniScene(container, p);
    });
  }, 50);
}

function createProductCard(product) {
  const card = document.createElement('div');
  card.className = 'product-card';
  card.innerHTML = `
    <div class="product-card-img">
      <div class="product-3d-mini" id="mini-${product.id}"></div>
      ${product.badge ? `<div class="product-card-badge">${product.badge}</div>` : ''}
    </div>
    <div class="product-card-body">
      <div class="product-card-cat">${product.category}</div>
      <div class="product-card-name">${product.name}</div>
      <div class="product-card-ref">Ref. ${product.ref}</div>
      <div class="product-card-footer">
        <div class="product-card-price">${product.price}</div>
        <div class="product-card-actions">
          <button class="btn-sm" onclick="viewProduct(${product.id})">Details</button>
          <button class="btn-sm-gold" onclick="addToCart(${product.id})">Add</button>
        </div>
      </div>
    </div>
  `;
  return card;
}

function filterProducts(cat, btn) {
  activeFilter = cat;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  // Dispose current mini scenes
  miniScenes.forEach(s => { if (s.renderer) s.renderer.dispose(); });
  miniScenes = [];
  renderProductsGrid(cat);
}

// ==================== PRODUCT DETAIL ====================
function viewProduct(id) {
  selectedProduct = PRODUCTS.find(p => p.id === id) || PRODUCTS[0];
  showPage('product-detail');
}

function renderProductInfo() {
  const p = selectedProduct;
  const pane = document.getElementById('productInfo');
  if (!pane) return;
  pane.innerHTML = `
    <div class="product-detail-cat">${p.category}</div>
    <h1 class="product-detail-name">${p.name}</h1>
    <div class="product-detail-ref">Reference ${p.ref}</div>
    <div class="product-detail-price">${p.price}</div>
    <p class="product-detail-desc">${p.desc}</p>
    <div class="product-specs">
      <h4>Technical Specifications</h4>
      ${p.specs.map(([label, val]) => `
        <div class="spec-row">
          <span class="spec-label">${label}</span>
          <span class="spec-value">${val}</span>
        </div>
      `).join('')}
    </div>
    <div class="product-detail-actions">
      <button class="btn-gold" onclick="addToCart(${p.id})">Add to Collection</button>
      <button class="btn-ghost" onclick="showPage('collections')">All Timepieces</button>
    </div>
  `;
}

// ==================== CART ====================
function addToCart(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  const existing = cart.find(item => item.id === productId);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ id: product.id, name: product.name, price: product.price, priceNum: product.priceNum, ref: product.ref, qty: 1 });
  }

  saveCart();
  updateCartCount();
  showToast(`${product.name} added to your selection`);
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  saveCart();
  updateCartCount();
  renderCart();
}

function saveCart() {
  localStorage.setItem('cp_cart', JSON.stringify(cart));
}

function updateCartCount() {
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  document.getElementById('cartCount').textContent = count;
}

function renderCart() {
  const itemsEl = document.getElementById('cartItems');
  const summaryEl = document.getElementById('cartSummary');
  if (!itemsEl || !summaryEl) return;

  if (cart.length === 0) {
    itemsEl.innerHTML = `
      <div class="empty-cart">
        <div class="empty-cart-icon">◇</div>
        <h3>Your selection is empty</h3>
        <p style="color:var(--text-muted);font-size:0.8rem;margin-bottom:2rem;">Discover our timepieces and add your chosen pieces.</p>
        <button class="btn-gold" onclick="showPage('collections')">Explore Collections</button>
      </div>`;
    summaryEl.innerHTML = '';
    return;
  }

  itemsEl.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="cart-item-img">◈</div>
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-ref">Ref. ${item.ref}</div>
        <div class="cart-item-price">${item.price}</div>
      </div>
      <div>
        <div style="color:var(--silver);font-size:0.75rem;margin-bottom:0.5rem;">Qty: ${item.qty}</div>
        <button class="cart-item-remove" onclick="removeFromCart(${item.id})">Remove</button>
      </div>
    </div>
  `).join('');

  const subtotal = cart.reduce((sum, item) => sum + item.priceNum * item.qty, 0);
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + tax;

  summaryEl.innerHTML = `
    <h3>Order Summary</h3>
    <div class="summary-row"><span>Subtotal</span><span>$${subtotal.toLocaleString()}</span></div>
    <div class="summary-row"><span>Authenticity Insurance</span><span>Included</span></div>
    <div class="summary-row"><span>Complimentary Shipping</span><span>—</span></div>
    <div class="summary-row"><span>Import & Duties Est.</span><span>$${tax.toLocaleString()}</span></div>
    <div class="summary-row total"><span>Total</span><span>$${total.toLocaleString()}</span></div>
    <button class="btn-gold checkout-btn" onclick="handleCheckout()">Proceed to Checkout</button>
  `;
}

function handleCheckout() {
  if (!currentUser) {
    showToast('Please sign in to complete your purchase');
    setTimeout(() => showPage('login'), 1000);
    return;
  }
  // POST cart to backend
  fetch('/api/cart', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId: currentUser.email, items: cart })
  }).catch(() => {});

  showToast('Order placed — our concierge will contact you shortly');
  cart = [];
  saveCart();
  updateCartCount();
  renderCart();
}

// ==================== AUTH ====================
let isLoginMode = true;

function toggleAuthMode() {
  isLoginMode = !isLoginMode;
  document.getElementById('loginForm').style.display = isLoginMode ? 'block' : 'none';
  document.getElementById('signupForm').style.display = isLoginMode ? 'none' : 'block';
  document.getElementById('authTitle').textContent = isLoginMode ? 'Client Access' : 'Create Account';
}

async function handleLogin() {
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;
  const msgEl = document.getElementById('authMessage');

  if (!email || !password) {
    msgEl.textContent = 'Please enter your credentials.';
    msgEl.className = 'auth-message error';
    return;
  }

  try {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();

    if (data.success) {
      currentUser = data.user;
      localStorage.setItem('cp_user', JSON.stringify(currentUser));
      msgEl.textContent = `Welcome back, ${currentUser.name}`;
      msgEl.className = 'auth-message success';
      setTimeout(() => showPage('home'), 1200);
    } else {
      msgEl.textContent = data.message || 'Invalid credentials.';
      msgEl.className = 'auth-message error';
    }
  } catch {
    // Offline fallback
    if (email && password.length >= 6) {
      currentUser = { name: email.split('@')[0], email };
      localStorage.setItem('cp_user', JSON.stringify(currentUser));
      msgEl.textContent = `Welcome, ${currentUser.name}`;
      msgEl.className = 'auth-message success';
      setTimeout(() => showPage('home'), 1200);
    } else {
      msgEl.textContent = 'Invalid credentials.';
      msgEl.className = 'auth-message error';
    }
  }
}

async function handleSignup() {
  const name = document.getElementById('signupName').value;
  const email = document.getElementById('signupEmail').value;
  const password = document.getElementById('signupPassword').value;
  const msgEl = document.getElementById('signupMessage');

  if (!name || !email || !password) {
    msgEl.textContent = 'Please fill in all fields.';
    msgEl.className = 'auth-message error';
    return;
  }
  if (password.length < 6) {
    msgEl.textContent = 'Password must be at least 6 characters.';
    msgEl.className = 'auth-message error';
    return;
  }

  try {
    const res = await fetch('/api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    const data = await res.json();
    if (data.success) {
      currentUser = data.user;
      localStorage.setItem('cp_user', JSON.stringify(currentUser));
      msgEl.textContent = `Account created. Welcome, ${name}.`;
      msgEl.className = 'auth-message success';
      setTimeout(() => showPage('home'), 1200);
    } else {
      msgEl.textContent = data.message || 'Could not create account.';
      msgEl.className = 'auth-message error';
    }
  } catch {
    currentUser = { name, email };
    localStorage.setItem('cp_user', JSON.stringify(currentUser));
    msgEl.textContent = `Account created. Welcome, ${name}.`;
    msgEl.className = 'auth-message success';
    setTimeout(() => showPage('home'), 1200);
  }
}

// ==================== NEWSLETTER ====================
function handleNewsletter(e) {
  e.preventDefault();
  showToast('You have joined the inner circle.');
  e.target.reset();
}

// ==================== TOAST ====================
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toast._tid);
  toast._tid = setTimeout(() => toast.classList.remove('show'), 3500);
}
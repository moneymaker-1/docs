/* =====================================================================
   Expo Time — Hero 3D scene (Three.js, classic script using global THREE)
   An extruded brand checkmark + floating exhibition "stands",
   brand-coloured lighting and mouse-driven parallax.
   Gracefully does nothing if WebGL / Three.js is unavailable.
   ===================================================================== */
(function () {
  "use strict";
  if (typeof THREE === "undefined") return; // three failed to load -> SVG fallback stays

  var BRAND = { yellow: 0xf3c716, navy: 0x293d50, cyan: 0x62b1b6, deep: 0x16222e };

  var container = document.getElementById("hero3d");
  if (container && supportsWebGL()) {
    try { init(container); } catch (e) { console.warn("3D disabled:", e); }
  }

function supportsWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(window.WebGLRenderingContext && (c.getContext("webgl") || c.getContext("experimental-webgl")));
  } catch (e) { return false; }
}

function init(container) {
  const canvas = container.querySelector(".hero3d-canvas");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  camera.position.set(0, 0.4, 10);

  const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  /* ---------- Lighting ---------- */
  scene.add(new THREE.AmbientLight(0xffffff, 0.5));
  scene.add(new THREE.HemisphereLight(0xbfe6ea, BRAND.deep, 0.45));

  const key = new THREE.DirectionalLight(0xffffff, 1.4);
  key.position.set(5, 8, 6);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.camera.near = 1; key.shadow.camera.far = 30;
  key.shadow.camera.left = -8; key.shadow.camera.right = 8;
  key.shadow.camera.top = 8; key.shadow.camera.bottom = -8;
  key.shadow.bias = -0.0005;
  scene.add(key);

  const glow = new THREE.PointLight(BRAND.yellow, 1.2, 40);
  glow.position.set(-5, 1, 5);
  scene.add(glow);

  const rim = new THREE.PointLight(BRAND.cyan, 1.0, 40);
  rim.position.set(6, -2, -3);
  scene.add(rim);

  /* ---------- Shadow-catching ground ---------- */
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(60, 60),
    new THREE.ShadowMaterial({ opacity: 0.28 })
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -3;
  ground.receiveShadow = true;
  scene.add(ground);

  /* ---------- The 3D checkmark ---------- */
  const world = new THREE.Group();
  scene.add(world);

  const checkMat = new THREE.MeshStandardMaterial({
    color: BRAND.yellow, metalness: 0.5, roughness: 0.28
  });

  const check = buildCheck(checkMat);
  check.position.set(-0.2, 0.3, 0);
  world.add(check);

  /* ---------- Floating exhibition "stands" ---------- */
  const stands = [];
  const standDefs = [
    { c: BRAND.navy, s: [1.4, 1.4, 1.4], p: [-3.4, 1.7, -1.5] },
    { c: BRAND.cyan, s: [1.1, 1.8, 1.1], p: [3.5, -1.4, -1] },
    { c: BRAND.navy, s: [1.0, 1.0, 1.0], p: [3.0, 2.2, -2.5] },
    { c: BRAND.cyan, s: [0.9, 0.9, 0.9], p: [-3.2, -1.9, -2] }
  ];
  standDefs.forEach(function (d) {
    const geo = new THREE.BoxGeometry(d.s[0], d.s[1], d.s[2], 1, 1, 1);
    const mat = new THREE.MeshStandardMaterial({ color: d.c, metalness: 0.25, roughness: 0.55 });
    const m = new THREE.Mesh(geo, mat);
    m.position.set(d.p[0], d.p[1], d.p[2]);
    m.rotation.set(Math.random() * 0.6, Math.random() * 0.8, 0);
    m.castShadow = true; m.receiveShadow = true;
    m.userData.baseY = d.p[1];
    m.userData.spin = (Math.random() * 0.4 + 0.2) * (Math.random() > 0.5 ? 1 : -1);
    m.userData.phase = Math.random() * Math.PI * 2;
    world.add(m);
    stands.push(m);
  });

  /* ---------- Ambient particles ---------- */
  const pCount = 90;
  const pPos = new Float32Array(pCount * 3);
  for (let i = 0; i < pCount; i++) {
    pPos[i * 3]     = (Math.random() - 0.5) * 16;
    pPos[i * 3 + 1] = (Math.random() - 0.5) * 12;
    pPos[i * 3 + 2] = (Math.random() - 0.5) * 10 - 2;
  }
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
  const particles = new THREE.Points(pGeo, new THREE.PointsMaterial({
    color: 0xffffff, size: 0.05, transparent: true, opacity: 0.5, depthWrite: false
  }));
  world.add(particles);

  /* ---------- Pointer parallax ---------- */
  const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
  function onPointer(e) {
    const r = container.getBoundingClientRect();
    pointer.tx = ((e.clientX - r.left) / r.width - 0.5) * 2;
    pointer.ty = ((e.clientY - r.top) / r.height - 0.5) * 2;
  }
  window.addEventListener("pointermove", onPointer, { passive: true });
  window.addEventListener("deviceorientation", function (e) {
    if (e.gamma == null) return;
    pointer.tx = Math.max(-1, Math.min(1, e.gamma / 30));
    pointer.ty = Math.max(-1, Math.min(1, ((e.beta || 0) - 45) / 30));
  });

  /* ---------- Sizing ---------- */
  function resize() {
    const w = container.clientWidth || 1;
    const h = container.clientHeight || 1;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  if ("ResizeObserver" in window) new ResizeObserver(resize).observe(container);
  else window.addEventListener("resize", resize);

  container.classList.add("has-3d");

  /* ---------- Render loop (paused when off-screen / tab hidden) ---------- */
  const clock = new THREE.Clock();
  let running = true, rafId = null;

  function frame() {
    if (!running) return;
    rafId = requestAnimationFrame(frame);
    const t = clock.getElapsedTime();

    pointer.x += (pointer.tx - pointer.x) * 0.06;
    pointer.y += (pointer.ty - pointer.y) * 0.06;

    if (!reduce) {
      check.rotation.y = Math.sin(t * 0.4) * 0.45 + pointer.x * 0.5;
      check.rotation.x = Math.cos(t * 0.35) * 0.12 - pointer.y * 0.25;
      check.position.y = 0.3 + Math.sin(t * 1.1) * 0.14;

      stands.forEach(function (m) {
        m.position.y = m.userData.baseY + Math.sin(t * 0.8 + m.userData.phase) * 0.28;
        m.rotation.y += m.userData.spin * 0.01;
        m.rotation.x += m.userData.spin * 0.004;
      });
      particles.rotation.y = t * 0.03;
    } else {
      check.rotation.y = pointer.x * 0.5;
      check.rotation.x = -pointer.y * 0.25;
    }

    world.rotation.y = pointer.x * 0.18;
    world.rotation.x = pointer.y * 0.10;

    camera.position.x += (pointer.x * 0.8 - camera.position.x) * 0.05;
    camera.position.y += (0.4 - pointer.y * 0.6 - camera.position.y) * 0.05;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
  }

  function start() { if (!running) { running = true; clock.start(); frame(); } }
  function stop() { running = false; if (rafId) cancelAnimationFrame(rafId); }

  document.addEventListener("visibilitychange", function () {
    if (document.hidden) stop(); else start();
  });
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { en.isIntersecting ? start() : stop(); });
    }, { threshold: 0.01 }).observe(container);
  }

  frame();
}

/* ---------- Build an extruded checkmark from a 2D shape ---------- */
function buildCheck(material) {
  const w = 0.92; // stroke half-width
  // Outline of a tick drawn counter-clockwise (x right, y up)
  const pts = [
    [-2.7,  0.55], [-1.15, -0.95], [ 2.15,  2.5],
    [ 3.05,  1.65], [-1.15, -2.75], [-3.6,  -0.35]
  ];
  const shape = new THREE.Shape();
  shape.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) shape.lineTo(pts[i][0], pts[i][1]);
  shape.closePath();

  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: 1.1, bevelEnabled: true, bevelThickness: 0.18,
    bevelSize: 0.18, bevelSegments: 4, curveSegments: 6
  });
  geo.center();

  const mesh = new THREE.Mesh(geo, material);
  mesh.castShadow = true; mesh.receiveShadow = true;

  const group = new THREE.Group();
  group.add(mesh);
  group.scale.setScalar(1.05);
  return group;
}
})();

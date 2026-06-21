/* =====================================================================
   Expo Time — Full-bleed interactive 3D exhibition stand (Three.js)
   A stylised exhibition booth inspired by the Rawaf Mina design:
   curved white canopy, logo wall, LED screens, patterned columns,
   reception desk, upper deck, lounge furniture and plants.
   Drag to orbit; auto-rotates when idle. Classic script (global THREE).
   Degrades to a static render image (CSS) if WebGL is unavailable.
   ===================================================================== */
(function () {
  "use strict";
  if (typeof THREE === "undefined") return;

  var BRAND = { yellow: 0xf3c716, gold: 0xc9a227, navy: 0x222b3a, cyan: 0x62b1b6 };

  var container = document.getElementById("hero3d");
  if (container && supportsWebGL()) {
    try { init(container); } catch (e) { console.warn("3D disabled:", e); }
  }

  function supportsWebGL() {
    try {
      var c = document.createElement("canvas");
      return !!(window.WebGLRenderingContext && (c.getContext("webgl") || c.getContext("experimental-webgl")));
    } catch (e) { return false; }
  }

  /* ---------------- Canvas-drawn textures ---------------- */
  function tex(draw, w, h) {
    var c = document.createElement("canvas"); c.width = w; c.height = h;
    draw(c.getContext("2d"), w, h);
    var t = new THREE.CanvasTexture(c); t.anisotropy = 4; return t;
  }
  function patternTexture() {
    return tex(function (x, w, h) {
      x.fillStyle = "#ffffff"; x.fillRect(0, 0, w, h);
      var n = 9;
      for (var i = 0; i < n; i++) {
        var cy = h / n * (i + 0.5);
        x.save(); x.translate(w / 2, cy); x.rotate(Math.PI / 4);
        x.fillStyle = i % 2 ? "#c9a227" : "#62b1b6"; x.fillRect(-18, -18, 36, 36);
        x.restore();
        x.fillStyle = i % 2 ? "#62b1b6" : "#c9a227";
        x.beginPath(); x.arc(w * 0.22, cy, 5, 0, 7); x.fill();
        x.beginPath(); x.arc(w * 0.78, cy, 5, 0, 7); x.fill();
      }
    }, 128, 512);
  }
  function logoTexture() {
    return tex(function (x, w, h) {
      x.clearRect(0, 0, w, h);
      x.fillStyle = "#ffffff"; x.textAlign = "center"; x.textBaseline = "middle";
      x.font = "800 96px Poppins, Arial, sans-serif";
      x.fillText("RAWAF", w / 2, h * 0.4);
      x.fillStyle = "#c9cfd6"; x.font = "600 30px Poppins, Arial, sans-serif";
      x.fillText("R A W A F   M I N A", w / 2, h * 0.72);
    }, 512, 220);
  }
  function screenTexture() {
    return tex(function (x, w, h) {
      var g = x.createLinearGradient(0, 0, w, h);
      g.addColorStop(0, "#0a3f8c"); g.addColorStop(0.5, "#1565d8"); g.addColorStop(1, "#0a2747");
      x.fillStyle = g; x.fillRect(0, 0, w, h);
      x.globalAlpha = 0.16; x.fillStyle = "#cfe8ff";
      for (var i = 0; i < 5; i++) { x.save(); x.translate(36 + i * 52, h / 2); x.rotate(-0.5); x.fillRect(-7, -h, 14, h * 2); x.restore(); }
      x.globalAlpha = 1;
    }, 256, 360);
  }
  function welcomeTexture() {
    return tex(function (x, w, h) {
      x.clearRect(0, 0, w, h);
      x.fillStyle = "#ffffff"; x.textAlign = "center"; x.textBaseline = "middle";
      x.font = "700 60px Poppins, Arial, sans-serif";
      x.fillText("WELCOME", w / 2, h / 2);
    }, 512, 128);
  }

  /* ---------------- Scene ---------------- */
  function init(container) {
    var canvas = container.querySelector(".hero3d-canvas");
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(40, 1, 0.1, 200);

    var renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    /* Lighting */
    scene.add(new THREE.AmbientLight(0xffffff, 0.5));
    scene.add(new THREE.HemisphereLight(0xcfeef2, BRAND.navy, 0.5));
    var key = new THREE.DirectionalLight(0xffffff, 1.5);
    key.position.set(-8, 14, 10); key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048);
    key.shadow.camera.near = 1; key.shadow.camera.far = 60;
    key.shadow.camera.left = -16; key.shadow.camera.right = 16;
    key.shadow.camera.top = 16; key.shadow.camera.bottom = -16;
    key.shadow.bias = -0.0004;
    scene.add(key);
    var warm = new THREE.PointLight(0xfff0d6, 0.7, 50); warm.position.set(0, 5, 3); scene.add(warm);
    var rim = new THREE.PointLight(BRAND.cyan, 0.6, 50); rim.position.set(8, 3, -4); scene.add(rim);

    /* Materials */
    var matWhite = new THREE.MeshStandardMaterial({ color: 0xf3f4f6, roughness: 0.55, metalness: 0.05 });
    var matGloss = new THREE.MeshStandardMaterial({ color: 0xfbfcfd, roughness: 0.25, metalness: 0.08 });
    var matNavy = new THREE.MeshStandardMaterial({ color: BRAND.navy, roughness: 0.7, metalness: 0.1 });
    var matFloor = new THREE.MeshStandardMaterial({ color: 0xe9e3d6, roughness: 0.85 });
    var matGlass = new THREE.MeshStandardMaterial({ color: 0x9fd6da, roughness: 0.1, metalness: 0, transparent: true, opacity: 0.22 });
    var matScreen = new THREE.MeshBasicMaterial({ map: screenTexture() });
    var matPattern = new THREE.MeshStandardMaterial({ map: patternTexture(), roughness: 0.6 });
    var matPlant = new THREE.MeshStandardMaterial({ color: 0x3f7d4f, roughness: 0.8 });

    var booth = new THREE.Group();
    scene.add(booth);

    function box(w, h, d, mat, x, y, z, cast) {
      var m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
      m.position.set(x, y, z);
      m.castShadow = cast !== false; m.receiveShadow = true;
      booth.add(m); return m;
    }
    function plane(w, h, mat, x, y, z, ry) {
      var m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), mat);
      m.position.set(x, y, z); if (ry) m.rotation.y = ry;
      booth.add(m); return m;
    }

    /* Floor platform */
    box(15, 0.3, 9, matFloor, 0, -0.15, 0).castShadow = false;
    var carpet = box(13.5, 0.06, 7.6, new THREE.MeshStandardMaterial({ color: 0xf6f3ec, roughness: 0.9 }), 0, 0.03, 0.4, false);
    carpet.receiveShadow = true;

    /* Back & side walls */
    box(15, 6.4, 0.25, matNavy, 0, 3.2, -4.3);
    box(0.25, 6.4, 9, matWhite, -7.4, 3.2, 0);          // left wall
    box(7.4, 6.6, 0.3, matWhite, -3.7, 3.3, -4.15);     // white frame over left/back

    /* Logo sign on back wall */
    var sign = box(4.2, 1.4, 0.18, matNavy, 2.4, 4.8, -4.15);
    plane(3.6, 1.2, new THREE.MeshBasicMaterial({ map: logoTexture(), transparent: true }), 2.4, 4.8, -4.04);

    /* Top canopy: roof + curved front fascia */
    box(15, 0.25, 8.4, matWhite, 0, 6.15, -0.1, true).castShadow = true;       // ceiling
    var fascia = box(15, 0.85, 1.0, matGloss, 0, 5.85, 3.6);                    // front beam
    // rounded front lip of the fascia
    var lip = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 15, 24, 1, false, 0, Math.PI),
      matGloss);
    lip.rotation.z = Math.PI / 2; lip.rotation.y = Math.PI; lip.position.set(0, 5.85, 4.1);
    lip.castShadow = true; booth.add(lip);

    /* Recessed light strip + downlights under canopy */
    var strip = new THREE.Mesh(new THREE.BoxGeometry(13.5, 0.05, 0.5),
      new THREE.MeshBasicMaterial({ color: 0xfff6df }));
    strip.position.set(0, 6.0, 3.0); booth.add(strip);
    for (var d = 0; d < 9; d++) {
      var dot = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 8),
        new THREE.MeshBasicMaterial({ color: 0xfff3d0 }));
      dot.position.set(-6 + d * 1.5, 5.98, 1.2); booth.add(dot);
    }

    /* Signature curved white swoosh (front-left sculptural element) */
    var curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-1.0, 5.2, 3.4),
      new THREE.Vector3(-1.8, 4.0, 3.2),
      new THREE.Vector3(-0.7, 2.7, 3.4),
      new THREE.Vector3(-2.3, 1.3, 3.5),
      new THREE.Vector3(-2.4, 0.1, 3.3)
    ]);
    var swoosh = new THREE.Mesh(new THREE.TubeGeometry(curve, 60, 0.42, 16, false), matGloss);
    swoosh.castShadow = true; booth.add(swoosh);
    // slim vertical louvres behind the swoosh
    for (var l = 0; l < 12; l++) {
      var lo = box(0.06, 4.6, 0.06, matNavy, -0.2 + l * 0.18, 3.0, 3.0, true);
      lo.castShadow = false;
    }

    /* Upper deck (two-story, left) with glass railing */
    box(5.4, 0.2, 6.2, matWhite, -4.4, 3.05, -0.6);
    plane(5.2, 1.0, matGlass, -4.4, 3.6, 2.45);
    box(5.2, 0.06, 0.06, matWhite, -4.4, 4.1, 2.45);   // rail cap
    // glass meeting room walls upstairs
    plane(5.0, 2.4, matGlass, -4.4, 4.45, 2.4);
    plane(6.0, 2.4, matGlass, -7.25, 4.45, -0.6, Math.PI / 2);

    /* Patterned columns */
    [-3.0, 5.6].forEach(function (cx) {
      box(0.55, 5.6, 0.55, matWhite, cx, 2.8, 3.2, true);
      plane(0.5, 4.4, matPattern, cx, 2.8, 3.49);
    });
    // a patterned panel on the back wall too
    plane(1.0, 4.0, matPattern, -1.4, 2.6, -4.0);

    /* LED screens */
    function screen(w, h, x, y, z, ry) {
      var frame = box(w + 0.12, h + 0.12, 0.12, matNavy, x, y, z, true);
      if (ry) frame.rotation.y = ry;
      var sc = plane(w, h, matScreen, x, y, z + (ry ? 0 : 0.08), ry);
      if (ry) { sc.position.x += Math.cos(ry) * 0.08; sc.position.z -= Math.sin(ry) * 0.08; }
    }
    screen(1.9, 2.9, 4.3, 2.6, -4.1);
    screen(1.7, 2.4, 6.6, 2.2, 1.0, -Math.PI / 2.3);
    screen(1.4, 2.0, -5.6, 1.8, 2.0);

    /* Reception desk */
    box(2.6, 1.0, 1.1, matWhite, 0, 0.5, 2.4);
    box(2.8, 0.12, 1.25, matNavy, 0, 1.06, 2.4);
    plane(2.3, 0.42, new THREE.MeshBasicMaterial({ map: welcomeTexture(), transparent: true }), 0, 0.56, 2.96);

    /* Furniture helpers */
    function sofa(x, z, ry) {
      var g = new THREE.Group();
      var seat = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.45, 0.95), matGloss);
      seat.position.y = 0.35; seat.castShadow = true; seat.receiveShadow = true;
      var back = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.6, 0.22), matGloss);
      back.position.set(0, 0.7, -0.37); back.castShadow = true;
      g.add(seat, back); g.position.set(x, 0.06, z); g.rotation.y = ry || 0;
      booth.add(g);
    }
    function chair(x, z) {
      var seat = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.24, 0.12, 16), matGloss);
      seat.position.set(x, 0.5, z); seat.castShadow = true; booth.add(seat);
      var back = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.08), matGloss);
      back.position.set(x, 0.78, z - 0.24); back.castShadow = true; booth.add(back);
      var leg = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.45, 8), matNavy);
      leg.position.set(x, 0.25, z); booth.add(leg);
    }
    function table(x, z) {
      var top = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 0.06, 24), matNavy);
      top.position.set(x, 0.55, z); top.castShadow = true; booth.add(top);
      var leg = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.55, 10), matNavy);
      leg.position.set(x, 0.28, z); booth.add(leg);
    }
    function plant(x, z) {
      var pot = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.22, 0.45, 12),
        new THREE.MeshStandardMaterial({ color: 0xdfdad0, roughness: 0.9 }));
      pot.position.set(x, 0.27, z); pot.castShadow = true; booth.add(pot);
      var bush = new THREE.Mesh(new THREE.IcosahedronGeometry(0.55, 1), matPlant);
      bush.position.set(x, 0.95, z); bush.scale.y = 1.3; bush.castShadow = true; booth.add(bush);
    }

    sofa(5.4, 2.4, -0.15);
    sofa(3.3, 3.0, 0.1);
    table(4.2, 1.4);
    chair(-4.6, 1.6); chair(-3.6, 1.6); table(-4.1, 1.0);
    plant(-6.4, 3.0); plant(6.6, 3.0); plant(1.7, -3.6); plant(-2.6, 1.2);

    /* Center & ground the booth */
    var bbox = new THREE.Box3().setFromObject(booth);
    var center = bbox.getCenter(new THREE.Vector3());
    booth.position.x -= center.x;
    booth.position.z -= center.z;

    /* Soft contact shadow on the gradient backdrop */
    var ground = new THREE.Mesh(new THREE.PlaneGeometry(80, 80), new THREE.ShadowMaterial({ opacity: 0.25 }));
    ground.rotation.x = -Math.PI / 2; ground.position.y = -0.02; ground.receiveShadow = true; scene.add(ground);

    /* ---------------- Orbit camera ---------------- */
    var target = new THREE.Vector3(0, 2.5, 0);
    var sph = { r: 21, theta: 0.78, phi: 1.40 };
    function updateTarget() {
      var w = container.clientWidth || 1;
      target.x = w > 1040 ? -3.2 : (w > 760 ? -1.4 : 0);   // push booth to the right on wide screens
      sph.r = w > 1040 ? 21 : (w > 760 ? 24 : 28);
    }
    function applyCamera() {
      var sp = Math.sin(sph.phi);
      camera.position.set(
        target.x + sph.r * sp * Math.sin(sph.theta),
        target.y + sph.r * Math.cos(sph.phi),
        target.z + sph.r * sp * Math.cos(sph.theta)
      );
      camera.lookAt(target);
    }

    /* Drag to orbit */
    var dragging = false, lastX = 0, lastY = 0;
    canvas.style.cursor = "grab";
    canvas.addEventListener("pointerdown", function (e) {
      dragging = true; lastX = e.clientX; lastY = e.clientY;
      canvas.style.cursor = "grabbing"; canvas.setPointerCapture && canvas.setPointerCapture(e.pointerId);
    });
    window.addEventListener("pointermove", function (e) {
      if (!dragging) return;
      sph.theta -= (e.clientX - lastX) * 0.005;
      sph.phi = Math.max(0.6, Math.min(1.5, sph.phi - (e.clientY - lastY) * 0.005));
      lastX = e.clientX; lastY = e.clientY;
    });
    window.addEventListener("pointerup", function () { dragging = false; canvas.style.cursor = "grab"; });

    /* Sizing */
    function resize() {
      var w = container.clientWidth || 1, h = container.clientHeight || 1;
      renderer.setSize(w, h, false);
      camera.aspect = w / h; camera.updateProjectionMatrix();
      updateTarget();
    }
    resize();
    if ("ResizeObserver" in window) new ResizeObserver(resize).observe(container);
    else window.addEventListener("resize", resize);

    container.classList.add("has-3d");

    /* Render loop */
    var running = true, rafId = null;
    function frame() {
      if (!running) return;
      rafId = requestAnimationFrame(frame);
      if (!dragging && !reduce) sph.theta += 0.0016;
      applyCamera();
      renderer.render(scene, camera);
    }
    function start() { if (!running) { running = true; frame(); } }
    function stop() { running = false; if (rafId) cancelAnimationFrame(rafId); }
    document.addEventListener("visibilitychange", function () { document.hidden ? stop() : start(); });
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (es) { es.forEach(function (en) { en.isIntersecting ? start() : stop(); }); },
        { threshold: 0.01 }).observe(container);
    }
    frame();
  }
})();

/* =====================================================================
   Expo Time — interactions
   ===================================================================== */
(function () {
  "use strict";

  /* ---------- Data: 9 services (from company profile) ---------- */
  var SERVICES = [
    {
      en: ["Event Organization & Management", "Full planning, coordination and on-site management for events of every scale."],
      ar: ["تنظيم وإدارة الفعاليات", "تخطيط وتنسيق وإدارة ميدانية متكاملة للفعاليات بمختلف أحجامها."],
      icon: '<rect x="3" y="4" width="18" height="17" rx="2"/><path d="M3 9h18M8 2v4M16 2v4"/><path d="M8 14l2.5 2.5L15 12"/>'
    },
    {
      en: ["Exhibition & Conference Setup", "Design, build and equip exhibition stands, pavilions and conference halls."],
      ar: ["تنفيذ وتجهيز المعارض والمؤتمرات", "تصميم وبناء وتجهيز أجنحة المعارض والأروقة وقاعات المؤتمرات."],
      icon: '<path d="M3 21h18"/><path d="M5 21V8l7-5 7 5v13"/><path d="M9 21v-6h6v6"/>'
    },
    {
      en: ["3D Stand Design", "Photoreal 3D concepts so you experience your stand before it is built."],
      ar: ["تصاميم ثلاثية الأبعاد", "تصاميم ثلاثية الأبعاد واقعية لتعيش تجربة جناحك قبل تنفيذه."],
      icon: '<path d="M12 2l9 5v10l-9 5-9-5V7z"/><path d="M12 22V12M21 7l-9 5-9-5"/>'
    },
    {
      en: ["Audio & Visual Services", "Professional sound, lighting and visual production that elevates the stage."],
      ar: ["خدمات الصوتيات والمرئيات", "إنتاج احترافي للصوت والإضاءة والمرئيات يرتقي بالمسرح والعرض."],
      icon: '<path d="M11 5L6 9H2v6h4l5 4z"/><path d="M16 9a4 4 0 010 6M19 6a8 8 0 010 12"/>'
    },
    {
      en: ["Studios — Montage, Sound & Graphics", "In-house studios for video editing, sound engineering and motion graphics."],
      ar: ["الاستوديوهات — مونتاج وصوت وجرافيك", "استوديوهات داخلية لمونتاج الفيديو وهندسة الصوت وموشن جرافيك."],
      icon: '<rect x="2" y="4" width="20" height="14" rx="2"/><path d="M10 9l5 3-5 3z"/><path d="M2 20h20"/>'
    },
    {
      en: ["Advertising Campaigns & PR", "Creative campaigns and public-relations management that build reputation."],
      ar: ["الحملات الإعلانية والعلاقات العامة", "حملات إبداعية وإدارة علاقات عامة تبني السمعة والحضور."],
      icon: '<path d="M3 11l16-7v16L3 13z"/><path d="M3 11v2a3 3 0 003 3h1"/><path d="M19 8a3 3 0 010 6"/>'
    },
    {
      en: ["Media Planning & Booking", "Strategic media planning and booking across the right channels and outlets."],
      ar: ["التخطيط والحجز لوسائل الإعلام", "تخطيط إعلامي استراتيجي وحجز عبر القنوات والمنافذ المناسبة."],
      icon: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 9h18M8 13h4M8 16h8"/>'
    },
    {
      en: ["Print & Gift Production", "Design and production of branded print materials and corporate gifts."],
      ar: ["تصميم وتنفيذ المطبوعات والهدايا", "تصميم وإنتاج المطبوعات الدعائية والهدايا المؤسسية بهويتك."],
      icon: '<path d="M6 9V2h12v7"/><rect x="6" y="13" width="12" height="8"/><path d="M6 17H4a2 2 0 01-2-2v-3a2 2 0 012-2h16a2 2 0 012 2v3a2 2 0 01-2 2h-2"/>'
    },
    {
      en: ["Professional Staffing", "Experienced administrative and organizing teams to run your event flawlessly."],
      ar: ["توفير الكوادر المحترفة", "فرق إدارية وتنظيمية ذات خبرة لإدارة فعاليتك بسلاسة واحترافية."],
      icon: '<circle cx="9" cy="8" r="3"/><path d="M3 20a6 6 0 0112 0"/><circle cx="17" cy="9" r="2.5"/><path d="M15 20a5 5 0 016-4.6"/>'
    }
  ];

  /* ---------- Build service cards ---------- */
  var grid = document.getElementById("servicesGrid");
  if (grid) {
    SERVICES.forEach(function (s) {
      var card = document.createElement("article");
      card.className = "service-card reveal";
      card.innerHTML =
        '<span class="service-icon"><svg viewBox="0 0 24 24" fill="none" stroke-linecap="round" stroke-linejoin="round">' + s.icon + "</svg></span>" +
        '<h3 data-en="' + s.en[0] + '" data-ar="' + s.ar[0] + '">' + s.en[0] + "</h3>" +
        '<p data-en="' + s.en[1] + '" data-ar="' + s.ar[1] + '">' + s.en[1] + "</p>";
      grid.appendChild(card);
    });
  }

  /* ---------- Build project tiles from real stand renders ---------- */
  var PROJECTS = [
    { img: "assets/img/projects/stand-02.jpg", en: ["Rawaf Mina — Main Facade", "Stand"], ar: ["رواف منى — الواجهة الرئيسية", "جناح"] },
    { img: "assets/img/projects/stand-01.jpg", en: ["Rawaf Mina — Front Elevation", "Design"], ar: ["رواف منى — الواجهة الأمامية", "تصميم"] },
    { img: "assets/img/projects/stand-05.jpg", en: ["Rawaf Mina — Double-Deck Booth", "3D"], ar: ["رواف منى — جناح بطابقين", "ثري دي"] },
    { img: "assets/img/projects/stand-03.jpg", en: ["Rawaf Mina — Hospitality Lounge", "Build"], ar: ["رواف منى — صالة الضيافة", "تنفيذ"] },
    { img: "assets/img/projects/stand-04.jpg", en: ["Rawaf Mina — Reception & Stairs", "Interior"], ar: ["رواف منى — الاستقبال والدرج", "تصميم داخلي"] },
    { img: "assets/img/projects/stand-01.jpg", en: ["Rawaf Mina — Aerial View", "Exhibition"], ar: ["رواف منى — منظور علوي", "معرض"] }
  ];
  var pGrid = document.getElementById("projectsGrid");
  if (pGrid) {
    PROJECTS.forEach(function (p) {
      var tile = document.createElement("article");
      tile.className = "project-tile reveal";
      tile.innerHTML =
        '<img src="' + p.img + '" alt="' + p.en[0] + '" loading="lazy" decoding="async" />' +
        '<div class="pt-label"><span data-en="' + p.en[0] + '" data-ar="' + p.ar[0] + '">' + p.en[0] + "</span>" +
        '<span class="pt-tag" data-en="' + p.en[1] + '" data-ar="' + p.ar[1] + '">' + p.en[1] + "</span></div>";
      pGrid.appendChild(tile);
    });
  }

  /* ---------- Populate service <select> ---------- */
  var select = document.getElementById("service");
  if (select) {
    select.appendChild(new Option("", "", true, true)); // placeholder, filled by lang
    SERVICES.forEach(function (s) {
      var o = document.createElement("option");
      o.value = s.en[0];
      o.setAttribute("data-en", s.en[0]);
      o.setAttribute("data-ar", s.ar[0]);
      o.textContent = s.en[0];
      select.appendChild(o);
    });
  }

  /* ---------- Language toggle (EN <-> AR + RTL) ---------- */
  var STORE = "expotime-lang";
  var htmlEl = document.documentElement;
  var langBtn = document.getElementById("langToggle");

  function applyLang(lang) {
    var isAr = lang === "ar";
    htmlEl.setAttribute("lang", lang);
    htmlEl.setAttribute("dir", isAr ? "rtl" : "ltr");

    document.querySelectorAll("[data-en]").forEach(function (el) {
      var val = el.getAttribute(isAr ? "data-ar" : "data-en");
      if (val == null) return;
      if (el.tagName === "OPTION") { el.textContent = val; }
      else { el.textContent = val; }
    });

    // placeholder option for the select
    if (select && select.options[0]) {
      var ph = isAr ? select.getAttribute("data-ph-ar") : select.getAttribute("data-ph-en");
      select.options[0].textContent = ph || "";
    }

    if (langBtn) langBtn.querySelector(".lang-current").textContent = isAr ? "EN" : "AR";
    try { localStorage.setItem(STORE, lang); } catch (e) {}
  }

  // cache select placeholder strings
  if (select) {
    select.setAttribute("data-ph-en", select.getAttribute("data-placeholder-en") || "Select a service");
    select.setAttribute("data-ph-ar", select.getAttribute("data-placeholder-ar") || "اختر خدمة");
  }

  var initial = "en";
  try { initial = localStorage.getItem(STORE) || "en"; } catch (e) {}
  applyLang(initial);

  if (langBtn) {
    langBtn.addEventListener("click", function () {
      applyLang(htmlEl.getAttribute("lang") === "ar" ? "en" : "ar");
    });
  }

  /* ---------- Mobile nav ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var menu = document.getElementById("nav-menu");
  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      var open = menu.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    menu.addEventListener("click", function (e) {
      if (e.target.tagName === "A") { menu.classList.remove("open"); toggle.setAttribute("aria-expanded", "false"); }
    });
  }

  /* ---------- Header shadow on scroll + active link ---------- */
  var header = document.querySelector(".site-header");
  var sections = Array.prototype.slice.call(document.querySelectorAll("main section[id]"));
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".nav-menu a"));

  function onScroll() {
    if (header) header.classList.toggle("scrolled", window.scrollY > 8);
    var pos = window.scrollY + 120;
    var current = "";
    sections.forEach(function (sec) { if (sec.offsetTop <= pos) current = sec.id; });
    navLinks.forEach(function (a) {
      a.classList.toggle("active", a.getAttribute("href") === "#" + current);
    });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Reveal on scroll ---------- */
  var revealEls = function () { return document.querySelectorAll(".reveal"); };
  // mark common blocks for reveal
  document.querySelectorAll(".section-head, .about-copy, .about-visual, .vision-card, .value-card, .why-item, .stat")
    .forEach(function (el) { el.classList.add("reveal"); });

  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    revealEls().forEach(function (el) { io.observe(el); });
  } else {
    revealEls().forEach(function (el) { el.classList.add("in"); });
  }

  /* ---------- Count-up stats ---------- */
  var counted = false;
  function runCounts() {
    if (counted) return;
    var statsSection = document.querySelector(".stats");
    if (!statsSection) return;
    var rect = statsSection.getBoundingClientRect();
    if (rect.top > window.innerHeight || rect.bottom < 0) return;
    counted = true;
    document.querySelectorAll(".stat-num").forEach(function (el) {
      var target = parseInt(el.getAttribute("data-count"), 10) || 0;
      var start = null, dur = 1400;
      function step(ts) {
        if (!start) start = ts;
        var p = Math.min((ts - start) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.floor(eased * target).toLocaleString();
        if (p < 1) requestAnimationFrame(step);
        else el.textContent = target.toLocaleString();
      }
      requestAnimationFrame(step);
    });
  }
  window.addEventListener("scroll", runCounts, { passive: true });
  window.addEventListener("load", runCounts);
  runCounts();

  /* ---------- Contact form (front-end validation + mailto fallback) ---------- */
  var form = document.getElementById("contactForm");
  var note = document.getElementById("formNote");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var isAr = htmlEl.getAttribute("lang") === "ar";
      var name = form.name.value.trim();
      var email = form.email.value.trim();
      var message = form.message.value.trim();
      var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

      if (!name || !emailOk || !message) {
        note.className = "form-note err";
        note.textContent = isAr ? "يرجى تعبئة الاسم والبريد الصحيح والرسالة." : "Please fill in your name, a valid email and a message.";
        return;
      }

      // Compose a mailto so the message reaches the company even without a backend.
      var subject = encodeURIComponent("Website enquiry — " + (form.service.value || "General") + " — " + name);
      var body = encodeURIComponent(
        "Name: " + name + "\nEmail: " + email + "\nPhone: " + form.phone.value +
        "\nService: " + form.service.value + "\n\n" + message
      );
      window.location.href = "mailto:info@expo-time.co?subject=" + subject + "&body=" + body;

      note.className = "form-note ok";
      note.textContent = isAr ? "شكراً! يتم فتح بريدك لإرسال الرسالة." : "Thank you! Your email app is opening to send the message.";
      form.reset();
    });
  }

  /* ---------- 3D tilt on cards (fine pointers only, respects reduced motion) ---------- */
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia("(pointer: fine)").matches;

  function addTilt(el, max) {
    el.classList.add("tilt");
    var glare = document.createElement("span");
    glare.className = "tilt-glare";
    el.appendChild(glare);
    var rect = null;

    el.addEventListener("pointerenter", function () { rect = el.getBoundingClientRect(); el.style.transitionDuration = "60ms"; });
    el.addEventListener("pointermove", function (e) {
      if (!rect) rect = el.getBoundingClientRect();
      var px = (e.clientX - rect.left) / rect.width;
      var py = (e.clientY - rect.top) / rect.height;
      var ry = (px - 0.5) * max * 2;
      var rx = (0.5 - py) * max * 2;
      el.style.transform = "rotateX(" + rx.toFixed(2) + "deg) rotateY(" + ry.toFixed(2) + "deg) translateY(-6px)";
      glare.style.setProperty("--gx", (px * 100).toFixed(1) + "%");
      glare.style.setProperty("--gy", (py * 100).toFixed(1) + "%");
    });
    el.addEventListener("pointerleave", function () {
      el.style.transitionDuration = "";
      el.style.transform = "";
      rect = null;
    });
  }

  if (finePointer && !reduceMotion) {
    document.querySelectorAll(".service-card").forEach(function (c) { addTilt(c, 7); });
    document.querySelectorAll(".project-tile").forEach(function (c) { addTilt(c, 6); });
  }

  /* ---------- Year ---------- */
  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
})();

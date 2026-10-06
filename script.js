(function () {
  "use strict";

  /* ═══════════════════════════════════════════════════════════════
     GLOBALS
  ═══════════════════════════════════════════════════════════════ */
  document.getElementById("year").textContent = new Date().getFullYear();
  var RM = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  /* ═══════════════════════════════════════════════════════════════
     MOBILE NAV
  ═══════════════════════════════════════════════════════════════ */
  var navToggle = document.getElementById("navToggle");
  var navMobile = document.getElementById("navLinksMobile");

  navToggle.addEventListener("click", function () {
    var o = navMobile.classList.toggle("open");
    navToggle.classList.toggle("open", o);
    navToggle.setAttribute("aria-expanded", String(o));
  });
  navMobile.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", function () {
      navMobile.classList.remove("open");
      navToggle.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });

  /* ═══════════════════════════════════════════════════════════════
     SCROLL PROGRESS
  ═══════════════════════════════════════════════════════════════ */
  var progressBar = document.getElementById("progressBar");
  function updateProgress() {
    var pct = window.scrollY / Math.max(1, document.documentElement.scrollHeight - window.innerHeight) * 100;
    progressBar.style.width = pct + "%";
  }
  window.addEventListener("scroll", updateProgress, { passive: true });
  updateProgress();

  /* ═══════════════════════════════════════════════════════════════
     SCROLL REVEAL  (simple fade, nothing stays hidden if JS/IO fails)
  ═══════════════════════════════════════════════════════════════ */
  var revEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !RM) {
    var revIO = new IntersectionObserver(function (ents) {
      ents.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in-view"); revIO.unobserve(e.target); }
      });
    }, { threshold: 0.05, rootMargin: "0px 0px -40px 0px" });
    revEls.forEach(function (el) { revIO.observe(el); });
  } else {
    revEls.forEach(function (el) { el.classList.add("in-view"); });
  }

  /* ═══════════════════════════════════════════════════════════════
     CRANK-SLIDER HERO ANIMATION
     Mouse X → rotation speed (left = slow, right = fast)
     Pauses automatically when the hero is off-screen.
  ═══════════════════════════════════════════════════════════════ */
    var canvas     = document.getElementById("fieldCanvas");
  var ctx        = canvas.getContext("2d");
  var DPR        = Math.min(window.devicePixelRatio || 1, 2);
  var crankAngle = 0;
  var mouseNorm  = 0.5;   // 0–1, updated on mousemove
  var crankRAF   = null;
  var heroVisible = true;

  var NCYL = 4;
  // Inline-4 firing geometry: pins 1&4 together, 2&3 180° opposite
  var THROWS = [0, Math.PI, Math.PI, 0];

  /* canvas helpers */
  function st(op, w) { ctx.strokeStyle = "rgba(255,255,255," + op + ")"; ctx.lineWidth = w; }
  function ln(x1,y1,x2,y2) { ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.stroke(); }
  function circ(x,y,r,fill) { ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); fill ? ctx.fill() : ctx.stroke(); }

  function journalBearing(x, y, r) {
    var g = ctx.createRadialGradient(x - r*0.35, y - r*0.35, r*0.15, x, y, r);
    g.addColorStop(0, "rgba(255,255,255,.95)");
    g.addColorStop(1, "rgba(255,255,255,.55)");
    ctx.fillStyle = g; circ(x, y, r, true);
    ctx.fillStyle = "#040404"; circ(x, y, r*0.4, true);
    st(0.15, 1); circ(x, y, r*1.18, false);
  }

  /* filleted counterweight — realistic teardrop/kidney web shape */
  function counterweight(cx, cy, angle, rOuter, rInner) {
    var spread = 1.5;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle + Math.PI); // points opposite the crank pin
    var g = ctx.createLinearGradient(0, -rOuter, 0, rInner);
    g.addColorStop(0, "rgba(255,255,255,.20)");
    g.addColorStop(1, "rgba(255,255,255,.07)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(0, 0, rOuter, -spread/2, spread/2);
    ctx.arc(0, 0, rInner, spread/2, -spread/2, true);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,.28)"; ctx.lineWidth = 1;
    ctx.stroke();
    ctx.restore();
  }

  /* crank web (the flat arm connecting journal to pin) with fillets */
  function crankWeb(cx, cy, pinX, pinY, halfW) {
    var dx = pinX - cx, dy = pinY - cy;
    var len = Math.sqrt(dx*dx + dy*dy);
    var nx = -dy/len, ny = dx/len;
    var g = ctx.createLinearGradient(cx, cy, pinX, pinY);
    g.addColorStop(0, "rgba(255,255,255,.16)");
    g.addColorStop(1, "rgba(255,255,255,.24)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(cx + nx*halfW, cy + ny*halfW);
    ctx.lineTo(pinX + nx*halfW*0.7, pinY + ny*halfW*0.7);
    ctx.lineTo(pinX - nx*halfW*0.7, pinY - ny*halfW*0.7);
    ctx.lineTo(cx - nx*halfW, cy - ny*halfW);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,.3)"; ctx.lineWidth = 0.75;
    ctx.stroke();
  }

  /* I-beam connecting rod with big-end cap + bolts, small-end bushing */
  function conRod(bigX, bigY, smallX, smallY, bigR, smallR) {
    var dx = smallX - bigX, dy = smallY - bigY;
    var len = Math.sqrt(dx*dx + dy*dy);
    var ang = Math.atan2(dy, dx);
    var shaftW = bigR * 0.5;

    ctx.save();
    ctx.translate(bigX, bigY);
    ctx.rotate(ang);

    /* shaft (I-beam silhouette, tapered) */
    var g = ctx.createLinearGradient(0, -shaftW/2, 0, shaftW/2);
    g.addColorStop(0, "rgba(255,255,255,.55)");
    g.addColorStop(0.5, "rgba(255,255,255,.22)");
    g.addColorStop(1, "rgba(255,255,255,.55)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(bigR * 0.55, -shaftW/2);
    ctx.lineTo(len - smallR * 0.75, -shaftW*0.32);
    ctx.lineTo(len - smallR * 0.75,  shaftW*0.32);
    ctx.lineTo(bigR * 0.55,  shaftW/2);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,.4)"; ctx.lineWidth = 0.75;
    ctx.stroke();

    /* big-end cap outline + bolts */
    st(0.5, 1.25);
    ctx.beginPath(); ctx.arc(0, 0, bigR * 1.22, 0, Math.PI*2); ctx.stroke();
    ctx.fillStyle = "rgba(255,255,255,.6)";
    circ(bigR * 0.85, -bigR * 0.85, 1.6, true);
    circ(bigR * 0.85,  bigR * 0.85, 1.6, true);

    /* small-end bushing */
    st(0.45, 1);
    ctx.beginPath(); ctx.arc(len, 0, smallR * 1.35, 0, Math.PI*2); ctx.stroke();

    ctx.restore();
  }

  /* piston with domed crown, ring belt, skirt taper, gudgeon boss */
  function piston(cx, topY, w, h, ringR) {
    var domeH = h * 0.16;
    var skirtTaper = w * 0.08;

    ctx.save();
    /* body — subtle vertical shading for cylindrical form */
    var g = ctx.createLinearGradient(cx - w/2, 0, cx + w/2, 0);
    g.addColorStop(0,    "rgba(255,255,255,.05)");
    g.addColorStop(0.15, "rgba(255,255,255,.28)");
    g.addColorStop(0.5,  "rgba(255,255,255,.10)");
    g.addColorStop(0.85, "rgba(255,255,255,.28)");
    g.addColorStop(1,    "rgba(255,255,255,.05)");
    ctx.fillStyle = g;

    ctx.beginPath();
    ctx.moveTo(cx - w/2, topY + domeH);
    ctx.quadraticCurveTo(cx, topY - domeH*0.6, cx + w/2, topY + domeH);
    ctx.lineTo(cx + w/2 - skirtTaper*0.3, topY + h);
    ctx.quadraticCurveTo(cx, topY + h + 3, cx - w/2 + skirtTaper*0.3, topY + h);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,.55)"; ctx.lineWidth = 1.25;
    ctx.stroke();

    /* ring belt grooves */
    st(0.35, 0.75);
    for (var i = 1; i <= 3; i++) {
      var ry = topY + domeH + (i / 4) * (h * 0.42);
      ln(cx - w/2 + 2, ry, cx + w/2 - 2, ry);
    }

    /* gudgeon (wrist pin) boss */
    var pinY = topY + h * 0.62;
    ctx.fillStyle = "rgba(255,255,255,.9)";
    circ(cx, pinY, ringR, true);
    ctx.fillStyle = "#040404";
    circ(cx, pinY, ringR * 0.45, true);
    st(0.3, 1); circ(cx, pinY, ringR * 1.4, false);

    ctx.restore();
    return pinY;
  }

  function sizeCanvas() {
    var r = canvas.parentElement.getBoundingClientRect();
    canvas.width  = r.width  * DPR;
    canvas.height = r.height * DPR;
    canvas.style.width  = r.width  + "px";
    canvas.style.height = r.height + "px";
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }

  function drawCrank(ts) {
    var r = canvas.parentElement.getBoundingClientRect();
    var W = r.width, H = r.height;
    ctx.clearRect(0, 0, W, H);

    var speed = 0.005 + mouseNorm * 0.032;
    crankAngle += speed;

    var margin   = Math.min(W, H) * 0.05;
    var usableW  = W - margin * 2;
    var usableH  = H - margin * 2;
    var cylSpace = usableW / NCYL;
    var crankR   = Math.max(26, Math.min(cylSpace * 0.26, usableH * 0.14, 120));
    var rodLen   = crankR * 3.3;
    var boreW    = Math.min(crankR * 1.85, cylSpace * 0.58);
    var pistonH  = boreW * 0.85;

    var startX = margin + cylSpace / 2;
    var crankY = H * 0.7;
    var deckY  = crankY - rodLen - crankR - pistonH * 1.15;
    var skirtY = crankY - rodLen + crankR + pistonH * 0.6;

    var cxs = [];
    for (var i = 0; i < NCYL; i++) cxs.push(startX + i * cylSpace);

    ctx.save();
    ctx.lineCap = "round"; ctx.lineJoin = "round";

    /* — engine block: shaded panel + deck line + oil-pan rail — */
    var blockG = ctx.createLinearGradient(0, deckY, 0, skirtY);
    blockG.addColorStop(0, "rgba(255,255,255,.05)");
    blockG.addColorStop(1, "rgba(255,255,255,.015)");
    ctx.fillStyle = blockG;
    ctx.fillRect(margin, deckY, usableW, skirtY - deckY);
    st(0.22, 1.25); ctx.strokeRect(margin, deckY, usableW, skirtY - deckY);
    st(0.35, 1.5); ln(margin, deckY, margin + usableW, deckY);          // deck (head gasket line)
    st(0.3, 1);    ln(margin, skirtY + crankR*0.55, margin + usableW, skirtY + crankR*0.55); // pan rail

    /* — cylinder liners: double line bore — */
    for (var c = 0; c < NCYL; c++) {
      st(0.28, 1);
      ln(cxs[c] - boreW/2,       deckY, cxs[c] - boreW/2,       skirtY);
      ln(cxs[c] + boreW/2,       deckY, cxs[c] + boreW/2,       skirtY);
      st(0.12, 0.75);
      ln(cxs[c] - boreW/2 - 4,   deckY, cxs[c] - boreW/2 - 4,   skirtY);
      ln(cxs[c] + boreW/2 + 4,   deckY, cxs[c] + boreW/2 + 4,   skirtY);
    }

    /* — crankcase centerline — */
    st(0.16, 1.5);
    ln(cxs[0] - crankR*1.7, crankY, cxs[NCYL-1] + crankR*1.7, crankY);

    for (var j = 0; j < NCYL; j++) {
      var theta = crankAngle + THROWS[j];
      var cx    = cxs[j];
      var cpX   = cx + crankR * Math.cos(theta);
      var cpY   = crankY + crankR * Math.sin(theta);
      var disc  = Math.max(0, rodLen*rodLen - Math.pow(cpX - cx, 2));
      var pY    = cpY - Math.sqrt(disc) - pistonH * 0.62; // piston crown Y

      counterweight(cx, crankY, theta, crankR * 1.05, crankR * 0.42);
      crankWeb(cx, crankY, cpX, cpY, crankR * 0.34);

      var pinY = piston(cx, pY, boreW, pistonH, crankR * 0.13);
      conRod(cpX, cpY, cx, pinY, crankR * 0.3, crankR * 0.15);

      journalBearing(cx, crankY, crankR * 0.24);
      journalBearing(cpX, cpY, crankR * 0.19);

      ctx.fillStyle = "rgba(255,255,255,.24)";
      ctx.font = '600 9px "JetBrains Mono",monospace'; ctx.textAlign = "center";
      ctx.fillText("CYL " + (j + 1), cx, deckY - 10);
    }

    /* — main bearing webs connecting journals — */
    for (var k = 0; k < NCYL - 1; k++) {
      st(0.3, crankR * 0.5);
      ln(cxs[k], crankY, cxs[k+1], crankY);
    }
    for (var k2 = 0; k2 < NCYL; k2++) journalBearing(cxs[k2], crankY, crankR * 0.24);

    /* — title block / readout, engineering-drawing style — */
    ctx.textAlign = "left";
    ctx.fillStyle = "rgba(255,255,255,.28)";
    ctx.font = '600 10px "JetBrains Mono",monospace';
    ctx.fillText("INLINE-4 · DOHC", margin, deckY - 24);
    ctx.fillStyle = "rgba(255,255,255,.16)";
    ctx.font = '9px "JetBrains Mono",monospace';
    var rpm = (speed * 60 * 60) / (2 * Math.PI);
    ctx.fillText("≈ " + Math.round(rpm) + " RPM   |   BORE " + Math.round(boreW) + "px   |   STROKE " + Math.round(crankR*2) + "px", margin, deckY - 12);

    ctx.restore();

    if (!RM && heroVisible) { crankRAF = requestAnimationFrame(drawCrank); } else { crankRAF = null; }
  }

  function setupHero() {
    sizeCanvas();
    if (crankRAF) cancelAnimationFrame(crankRAF);
    if (RM) { drawCrank(); return; }
    crankRAF = requestAnimationFrame(drawCrank);
  }

  setupHero();
  var rsz;
  window.addEventListener("resize", function () { clearTimeout(rsz); rsz = setTimeout(setupHero, 150); });

  /* mouse X → speed */
  document.addEventListener("mousemove", function (e) {
    mouseNorm = e.clientX / window.innerWidth;
  }, { passive: true });

  /* pause the animation when the hero scrolls out of view or the tab is hidden */
  var heroEl = document.querySelector(".hero");
  function resumeCrank() {
    if (RM || !heroVisible || document.hidden || crankRAF) return;
    crankRAF = requestAnimationFrame(drawCrank);
  }
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (ents) {
      heroVisible = ents[0].isIntersecting;
      if (heroVisible) resumeCrank();
    }, { threshold: 0 }).observe(heroEl);
  }
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) { if (crankRAF) { cancelAnimationFrame(crankRAF); crankRAF = null; } }
    else resumeCrank();
  });

  /* ═══════════════════════════════════════════════════════════════
     PROJECT HOVER ANNOTATIONS  (technical callouts on card hover)
  ═══════════════════════════════════════════════════════════════ */
  var ANNOTS = {
    "smartbins":            [["TYPE","AUTO SORTER"],["VISION","OPENCV"],["SERVOS","6"],["SENSORS","4 ULTRASONIC"]],
    "gaucho-racing": [["TYPE","FSAE RACE CAR"],["DIV","POWERTRAIN"],["SAFETY FACTOR","1.5"],["BRACKETS","-15% WT"]],
    "silver":               [["TYPE","24-IN VEX U"],   ["DRIVE","6-WHEEL TANK"], ["MTR","600 RPM × 8"],   ["GEAR","3:4 RATIO"]],
    "rays":                 [["TYPE","DISASTER MON"],  ["SENSE","MULTI-AXIS"],   ["MCU","ARD + PI"],      ["OUT","LIVE DASH"]],
    "neuro-drone": [["TYPE","EMG DRONE"],["FRAME","3D PRINTED"],["FLIGHTS","20+"],["ROLE","MECH DESIGN"]],
    "robotic-hand": [["TYPE","CABLE-DRIVEN"],["ACT","5 SERVOS"],["GRIP","UP TO 2 LB"],["MFG","3D PRINTED"]],
    "compressed-air-motor": [["TYPE","AIR ENGINE"],    ["MAT","AL + BRASS"],     ["PROC","LATHE + MILL"], ["TOL","±0.005 IN"]],
    "traverse":             [["TYPE","RAIL CAMERA"],   ["MCU","ARDUINO"],        ["DRIVE","MOTORIZED"],   ["OUT","WIRELESS VID"]],
    "eagle-scout":          [["TYPE","BALANCE BEAMS"], ["QTY","3 BUILT"],        ["TEAM","25 VOLUNTEERS"],["BUDGET","< $1,000"]],
    "desk-setup":           [["TYPE","PERSONAL BUILDS"],["ITEMS","3 STANDS"]],
    "sonic":                [["TYPE","15-IN VEX U"],   ["DRIVE","4-WHEEL TANK"], ["INTAKE","3-STG 4-MTR"],["GEAR","3:4 RATIO"]]
  };

  /* ═══════════════════════════════════════════════════════════════
     PROJECT GRID — render cards (image fallback, skill tags, status badge)
  ═══════════════════════════════════════════════════════════════ */
  var grid = document.getElementById("projectGrid");
  var frag = document.createDocumentFragment();

  function markMissing(img) {
    var thumb = img.closest(".project-thumb");
    if (thumb) thumb.classList.add("no-img");
    img.remove();
  }

  PROJECTS.forEach(function (proj) {
    var card = document.createElement("button");
    card.type = "button";
    card.className = "project-card";
    card.setAttribute("data-slug", proj.slug);
    card.setAttribute("data-cats", proj.categories.join(" "));

    var rows = (ANNOTS[proj.slug] || []).map(function (row) {
      return '<span class="proj-ann-row"><span class="proj-ann-k">' + row[0] + '</span>' + row[1] + '</span>';
    }).join("");
    var annHTML = rows ? '<div class="proj-ann"><div class="proj-ann-box">' + rows + '</div></div>' : "";
    var badge = proj.status ? '<span class="project-badge">' + esc(proj.status) + '</span>' : "";
    if (proj.videos && proj.videos.length) badge += '<span class="project-badge project-badge--video">▶ Video</span>';
    var tags = proj.skills.slice(0, 3).map(function (s) { return "<li>" + esc(s) + "</li>"; }).join("");

    card.innerHTML =
      '<div class="project-thumb">' +
        '<img src="' + esc(proj.heroImage) + '" alt="' + esc(proj.title) + '" loading="lazy"/>' +
        '<span class="thumb-fallback" aria-hidden="true">Images coming soon</span>' +
        badge + annHTML +
      '</div>' +
      '<div class="project-body">' +
        '<h3>' + esc(proj.title) + '</h3>' +
        '<p class="project-subtitle">' + esc(proj.subtitle) + '</p>' +
        '<p class="project-desc">' + esc(proj.description) + '</p>' +
        '<ul class="tag-list project-tags">' + tags + '</ul>' +
        '<span class="project-cta">View project →</span>' +
      '</div>';

    var img = card.querySelector(".project-thumb img");
    img.addEventListener("error", function () { markMissing(img); });

    card.addEventListener("click", function () { openModal(proj.slug); });
    frag.appendChild(card);
  });
  grid.appendChild(frag);

  /* ═══════════════════════════════════════════════════════════════
     MODAL
  ═══════════════════════════════════════════════════════════════ */
  var overlay   = document.getElementById("modalOverlay");
  var mgallery  = document.getElementById("modalGallery");
  var msubtitle = document.getElementById("modalSubtitle");
  var mtitle    = document.getElementById("modalTitle");
  var mdesc     = document.getElementById("modalDesc");
  var mresult   = document.getElementById("modalResult");
  var mskills   = document.getElementById("modalSkills");
  var mlinks    = document.getElementById("modalLinks");
  var mclose    = document.getElementById("modalClose");
  var mvideos   = document.getElementById("modalVideos");
  var lastFocus = null;

  /* YouTube links become embeds; anything else is treated as a video file */
  function youtubeId(url) {
    var m = String(url).match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/);
    return m ? m[1] : null;
  }
  function renderVideos(list) {
    return (list || []).map(function (v) {
      var id = youtubeId(v.src);
      var cap = v.title ? '<figcaption>' + esc(v.title) + '</figcaption>' : "";
      var media = id
        ? '<iframe src="https://www.youtube-nocookie.com/embed/' + id + '" title="' + esc(v.title || "Project video") + '" loading="lazy" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen" allowfullscreen></iframe>'
        : '<video controls playsinline preload="metadata"' + (v.poster ? ' poster="' + esc(v.poster) + '"' : "") + '><source src="' + esc(v.src) + '"></video>';
      return '<figure class="modal-video">' + media + cap + '</figure>';
    }).join("");
  }

  function openModal(slug) {
    var p = PROJECTS.find(function (x) { return x.slug === slug; });
    if (!p) return;

    mvideos.innerHTML = renderVideos(p.videos);
    mvideos.hidden = !(p.videos && p.videos.length);

    mgallery.innerHTML = p.gallery.map(function (s) {
      return '<img src="' + esc(s) + '" alt="' + esc(p.title) + '" loading="lazy">';
    }).join("");
    mgallery.hidden = false;
    mgallery.querySelectorAll("img").forEach(function (im) {
      im.addEventListener("error", function () {
        im.remove();
        if (!mgallery.querySelector("img")) {                         // no images yet
          var hasVideo = p.videos && p.videos.length;
          if (hasVideo) { mgallery.hidden = true; }
          else { mgallery.innerHTML = '<div class="modal-gallery-empty">Images coming soon</div>'; }
        }
      });
    });

    msubtitle.textContent = p.subtitle;
    mtitle.textContent    = p.title;
    mdesc.textContent     = p.description;
    mresult.textContent   = p.result || "";
    mresult.hidden        = !p.result;
    mskills.innerHTML     = p.skills.map(function (s) { return "<li>" + esc(s) + "</li>"; }).join("");
    mlinks.innerHTML      = (p.links || []).map(function (l) {
      return '<a class="btn btn-ghost" href="' + esc(l.url) + '" target="_blank" rel="noopener noreferrer">' + esc(l.label) + '</a>';
    }).join("");

    lastFocus = document.activeElement;
    overlay.classList.add("open");
    document.body.style.overflow = "hidden";
    mclose.focus();
  }

  function closeModal() {
    mvideos.innerHTML = "";   // stops any playing video
    overlay.classList.remove("open");
    document.body.style.overflow = "";
    if (lastFocus) lastFocus.focus();
  }

  mclose.addEventListener("click", closeModal);
  overlay.addEventListener("click", function (e) { if (e.target === overlay) closeModal(); });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && overlay.classList.contains("open")) closeModal();
  });

})();
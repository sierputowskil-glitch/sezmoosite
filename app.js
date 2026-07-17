/* ============================================================
   SEZMOO — interactions
   ============================================================ */
(function () {
  "use strict";
  const root = document.documentElement;
  root.classList.add("js");

  /* ---------- Brand logo theme swap ----------
     The logo file depends only on theme: dark → white+yellow (-wy),
     light → black+yellow (-by). Done in JS (not CSS content:url) because a
     replaced-element content url resolves relative to the DOCUMENT, so a fixed
     path 404s on subpages ("../assets" vs "assets"). Swapping the filename in
     the existing src keeps whatever relative prefix each page already uses. */
  (function brandLogoSwap() {
    var img = document.querySelector(".brand__logo");
    if (!img) return;
    var nav = document.querySelector(".nav");
    var hasVideoHero = !!document.querySelector(".hero"); // home only
    function apply() {
      var light = (root.getAttribute("data-theme") || "dark") === "light";
      // white+yellow only when the logo sits over the dark home video hero
      // (dark theme everywhere, or home hero at top before the bar sticks).
      var overVideoHero = hasVideoHero && nav && !nav.classList.contains("is-stuck");
      var white = !light || overVideoHero;
      var want = white ? "sezmoo-logo-wy.svg" : "sezmoo-logo-by.svg";
      var src = img.getAttribute("src") || "";
      var next = src.replace(/sezmoo-logo-(wy|by)\.svg/, want);
      if (next !== src) img.setAttribute("src", next);
    }
    apply();
    new MutationObserver(apply).observe(root, { attributes: true, attributeFilter: ["data-theme"] });
    if (nav) new MutationObserver(apply).observe(nav, { attributes: true, attributeFilter: ["class"] });
  })();

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* ---------- Smooth momentum scrolling (Lenis) ---------- */
  (function smoothScroll() {
    if (reduce || !fine) return; // native scroll on touch / reduced-motion
    const s = document.createElement("script");
    var appTag = document.querySelector('script[src$="app.js"]');
    var base = appTag ? appTag.getAttribute("src").replace(/app\.js(\?.*)?$/, "") : "";
    s.src = base + "lenis.min.js";
    s.onload = function () {
      const L = window.Lenis || (window.lenis && window.lenis.Lenis);
      if (!L) return;
      const lenis = new L({
        duration: 1.05,
        easing: (t) => 1 - Math.pow(1 - t, 3),
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1.4
      });
      window.__lenis = lenis;
      root.style.scrollBehavior = "auto";
      function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
      requestAnimationFrame(raf);
      document.addEventListener("click", function (e) {
        const a = e.target.closest && e.target.closest('a[href^="#"]');
        if (!a) return;
        const id = a.getAttribute("href");
        if (!id || id.length < 2) return;
        let target = null;
        try { target = document.querySelector(id); } catch (_) { return; }
        if (!target) return;
        e.preventDefault();
        lenis.scrollTo(target, { offset: -12 });
      });
    };
    s.onerror = function () { /* keep native scroll */ };
    document.head.appendChild(s);
  })();

  /* ---------- TIMECODE (nav + hero) ---------- */
  function tc(frames) {
    const fps = 24;
    const f = frames % fps;
    const totalSec = Math.floor(frames / fps);
    const s = totalSec % 60;
    const m = Math.floor(totalSec / 60) % 60;
    const h = Math.floor(totalSec / 3600);
    const p = (n) => String(n).padStart(2, "0");
    return `${p(h)}:${p(m)}:${p(s)}:${p(f)}`;
  }
  let frame = 12 * 24 + 8; // start at 00:00:12:08
  const tcEls = document.querySelectorAll("[data-tc]");
  if (!reduce) {
    setInterval(() => {
      frame++;
      const str = tc(frame);
      tcEls.forEach((el) => (el.textContent = str));
    }, 1000 / 24);
  } else {
    tcEls.forEach((el) => (el.textContent = tc(frame)));
  }

  /* ---------- HERO background video: force muted autoplay + reveal on play ---------- */
  (function heroVideo() {
    const wrap = document.querySelector(".hero__video");
    const video = document.getElementById("hero-video");
    if (!wrap || !video) return;

    const reveal = () => wrap.classList.add("is-playing");
    const tryPlay = () => {
      video.muted = true;
      video.playsInline = true;
      const play = video.play();
      if (play && play.catch) play.catch(() => {});
    }

    video.addEventListener("playing", reveal);
    video.addEventListener("canplay", tryPlay, { once: true });
    video.addEventListener("loadeddata", () => {
      if (video.readyState >= 2) reveal();
    }, { once: true });
    tryPlay();
  })();

  /* ---------- NAV stuck state ---------- */
  const nav = document.querySelector(".nav");
  const onScrollNav = () => nav.classList.toggle("is-stuck", window.scrollY > 40);
  onScrollNav();
  window.addEventListener("scroll", onScrollNav, { passive: true });

  /* ---------- Mobile nav ---------- */
  (function mobileNav() {
    const btn = document.querySelector(".nav__burger");
    const menu = document.querySelector(".nav__menu");
    if (!btn || !menu) return;

    const setOpen = (open) => {
      btn.classList.toggle("is-open", open);
      menu.classList.toggle("is-open", open);
      btn.setAttribute("aria-expanded", String(open));
      btn.setAttribute("aria-label", open ? "Zamknij menu" : "Otwórz menu");
    };

    btn.addEventListener("click", () => setOpen(!menu.classList.contains("is-open")));
    menu.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => setOpen(false)));
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") setOpen(false);
    });
    window.addEventListener("resize", () => {
      if (window.innerWidth > 860) setOpen(false);
    });
  })();

  /* ---------- MOBILE BOTTOM BAR (Onet-style quick dock) ---------- */
  (function mobileBottomBar() {
    if (document.querySelector(".mbar")) return;

    var isEN = (document.documentElement.getAttribute("lang") || "").toLowerCase().indexOf("en") === 0;
    var T = isEN
      ? { phone: "Call", mail: "E-mail", top: "Top", dark: "Dark", light: "Light", menu: "Menu", lang: "Język",
          aphone: "Call us", amail: "Write an e-mail", atop: "Scroll to top", atheme: "Toggle theme", alang: "Change language", amenu: "Open menu", abar: "Quick access" }
      : { phone: "Telefon", mail: "E-mail", top: "Góra", dark: "Ciemny", light: "Jasny", menu: "Menu", lang: "Language",
          aphone: "Zadzwoń", amail: "Napisz e-mail", atop: "Przewiń do góry", atheme: "Przełącz motyw", alang: "Zmień język", amenu: "Otwórz menu", abar: "Szybki dostęp" };

    var ICO = {
      phone: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4h3l2 5-2.5 1.5a11 11 0 0 0 5 5L14 13l5 2v3a2 2 0 0 1-2 2A15 15 0 0 1 3 6a2 2 0 0 1 2-2z"/></svg>',
      mail: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3.5 7l8.5 6 8.5-6"/></svg>',
      up: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 19V6"/><path d="M6 12l6-6 6 6"/></svg>',
      theme: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8"/><path d="M12 4a8 8 0 0 1 0 16z" fill="currentColor" stroke="none"/></svg>',
      globe: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8"/><path d="M4 12h16"/><path d="M12 4a12 12 0 0 1 0 16 12 12 0 0 1 0-16"/></svg>',
      menu: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16"/><path d="M4 12h16"/><path d="M4 17h16"/></svg>'
    };

    function makeItem(o) {
      var el = document.createElement(o.href ? "a" : "button");
      if (o.href) { el.href = o.href; } else { el.type = "button"; }
      el.className = "mbar__item" + (o.cls ? " " + o.cls : "");
      if (o.aria) el.setAttribute("aria-label", o.aria);
      el.innerHTML = '<span class="mbar__ico">' + o.svg + "</span><span class=\"mbar__lbl\">" + o.label + "</span>";
      if (o.on) el.addEventListener("click", o.on);
      return el;
    }

    var bar = document.createElement("nav");
    bar.className = "mbar";
    bar.setAttribute("aria-label", T.abar);

    // 1 · Phone
    bar.appendChild(makeItem({ href: "tel:+48502260450", svg: ICO.phone, label: T.phone, aria: T.aphone }));

    // 2 · E-mail
    bar.appendChild(makeItem({ href: "mailto:hello@sezmoo.com", svg: ICO.mail, label: T.mail, aria: T.amail }));

    // 3 · CENTER — scroll to top (raised yellow puck)
    bar.appendChild(makeItem({
      svg: ICO.up, label: T.top, cls: "mbar__top", aria: T.atop,
      on: function () {
        if (window.__lenis && window.__lenis.scrollTo) window.__lenis.scrollTo(0, { duration: 1 });
        else window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }));

    // 4 · Theme toggle (reuses the page's own switcher so state persists everywhere)
    var themeItem = makeItem({
      svg: ICO.theme, label: T.dark, cls: "mbar__theme", aria: T.atheme,
      on: function () {
        var next = (root.getAttribute("data-theme") || "dark") === "dark" ? "light" : "dark";
        var opt = document.querySelector('[data-theme-set="' + next + '"]');
        if (opt) { opt.click(); }
        else {
          root.setAttribute("data-theme", next);
          try { localStorage.setItem("sezmoo-theme", next); } catch (e) {}
        }
      }
    });
    var themeLbl = themeItem.querySelector(".mbar__lbl");
    function syncTheme() { themeLbl.textContent = (root.getAttribute("data-theme") || "dark") === "dark" ? T.light : T.dark; }
    syncTheme();
    new MutationObserver(syncTheme).observe(root, { attributes: true, attributeFilter: ["data-theme"] });
    bar.appendChild(themeItem);

    // 5 · Language switch (falls back to Menu where a page has no lang switcher)
    var otherLang = document.querySelector(".nav__lang .nav__lang-opt:not(.is-active)");
    if (otherLang && otherLang.getAttribute("href")) {
      bar.appendChild(makeItem({
        href: otherLang.getAttribute("href"), svg: ICO.globe,
        label: (otherLang.textContent || "").trim() || T.lang, aria: T.alang
      }));
    } else {
      bar.appendChild(makeItem({
        svg: ICO.menu, label: T.menu, aria: T.amenu,
        on: function () { var b = document.querySelector(".nav__burger"); if (b) b.click(); }
      }));
    }

    document.body.appendChild(bar);
  })();

  /* ---------- SCRUBBER (page progress) ---------- */
  const fill = document.querySelector(".scrubber__fill");
  const head = document.querySelector(".scrubber__head");
  function updateScrub() {
    const h = document.documentElement.scrollHeight - window.innerHeight;
    const p = h > 0 ? (window.scrollY / h) * 100 : 0;
    fill.style.width = p + "%";
    head.style.left = p + "%";
  }
  updateScrub();
  window.addEventListener("scroll", updateScrub, { passive: true });
  window.addEventListener("resize", updateScrub);

  /* ---------- REVEAL on scroll (position-based; robust where IO is unreliable) ---------- */
  function revealCheck() {
    const vh = innerHeight || document.documentElement.clientHeight;
    document.querySelectorAll(".reveal:not(.in)").forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.top < vh * 0.92 && r.bottom > -40) el.classList.add("in");
    });
  }
  revealCheck();
  requestAnimationFrame(revealCheck);
  window.addEventListener("scroll", revealCheck, { passive: true });
  window.addEventListener("resize", revealCheck);
  setTimeout(() => document.querySelectorAll(".reveal").forEach((e) => e.classList.add("in")), 3000);

  // Safety: on some pages CSS transitions can hang in a pending state, leaving
  // revealed (.in) elements stuck at opacity 0. Force-show only elements that are
  // in view, already .in, and still invisible — so scroll-in animations elsewhere stay intact.
  function forceStuckReveals() {
    const vh = innerHeight || document.documentElement.clientHeight;
    document.querySelectorAll(".reveal.in").forEach((el) => {
      const r = el.getBoundingClientRect();
      const inView = r.top < vh * 0.95 && r.bottom > 0;
      if (inView && parseFloat(getComputedStyle(el).opacity) < 0.9) {
        el.style.transition = "none";
        el.style.opacity = "1";
        el.style.transform = "none";
      }
    });
  }
  setTimeout(forceStuckReveals, 900);
  setTimeout(forceStuckReveals, 2200);
  window.addEventListener("scroll", forceStuckReveals, { passive: true });

  // hero entrance
  const hero = document.querySelector(".hero");
  if (hero) requestAnimationFrame(() => hero.classList.add("is-in"));

  /* ---------- MAGNETIC BUTTONS ---------- */
  if (fine && !reduce) {
    document.querySelectorAll("[data-magnetic]").forEach((el) => {
      const strength = 0.34;
      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        const mx = e.clientX - (r.left + r.width / 2);
        const my = e.clientY - (r.top + r.height / 2);
        el.style.transform = `translate(${mx * strength}px, ${my * strength}px)`;
      });
      el.addEventListener("mouseleave", () => (el.style.transform = ""));
    });
  }

  /* ---------- PARALLAX thumbnails (desktop only — per-frame reads jitter touch scroll) ---------- */
  if (fine && !reduce) {
    const px = [...document.querySelectorAll("[data-parallax]")];
    function parallax() {
      const vh = innerHeight;
      px.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.bottom < -200 || r.top > vh + 200) return;
        const prog = (r.top + r.height / 2 - vh / 2) / vh; // -.5..+.5-ish
        const amt = parseFloat(el.dataset.parallax) || 18;
        const media = el.querySelector(".frame-media") || el;
        media.style.setProperty("--py", (-prog * amt).toFixed(1) + "px");
      });
      requestAnimationFrame(parallax);
    }
    parallax();
  }

  /* ---------- SERVICES: shutter / export scroll scene ---------- */
  (function contentPackScene() {
    const pack = document.querySelector(".content-pack--scroll");
    const scene = document.querySelector(".services-scene");
    const services = document.querySelector(".services");
    if (!pack || !services) return;
    const frames = [...pack.querySelectorAll(".pack-frame")];
    const stage = pack.querySelector("[data-pack-stage]");
    const clamp = (v, min = 0, max = 1) => Math.max(min, Math.min(max, v));
    const map = (v, start, end) => clamp((v - start) / (end - start));
    const smooth = (v) => {
      v = clamp(v);
      return v * v * (3 - 2 * v);
    };

    function updateScene() {
      const r = pack.getBoundingClientRect();
      const vh = innerHeight || document.documentElement.clientHeight;
      const sr = services.getBoundingClientRect();
      const stickyMode = window.matchMedia("(min-width: 1101px)").matches;
      const sceneRect = scene ? scene.getBoundingClientRect() : r;
      const stickyHeight = scene ? (scene.querySelector(".services-scene__sticky")?.getBoundingClientRect().height || r.height) : r.height;
      const pinTravel = Math.max(1, sceneRect.height - stickyHeight);
      const centerTop = Math.max(24, (vh - stickyHeight) / 2);
      if (stickyMode) {
        const stickyEl = scene && scene.querySelector(".services-scene__sticky");
        if (stickyEl) stickyEl.style.top = centerTop + "px";
      }
      const pinProgress = clamp((centerTop - sceneRect.top) / pinTravel);
      const p = stickyMode ? clamp(pinProgress / 0.78) : clamp((vh * 0.72 - sr.top) / (vh * 1.08));
      const packExit = stickyMode ? smooth(map(pinProgress, 0.78, 1)) : 0;
      const open = smooth(map(p, 0.06, 0.36));
      const split = smooth(map(p, 0.34, 0.92));

      pack.style.setProperty("--pack-progress", p.toFixed(3));
      pack.style.setProperty("--pack-open", open.toFixed(3));
      pack.style.setProperty("--pack-split", split.toFixed(3));
      pack.style.setProperty("--pack-glow", (Math.sin(p * Math.PI) * 0.9).toFixed(3));
      pack.style.setProperty("--pack-exit", packExit.toFixed(3));
      if (scene) scene.style.setProperty("--pack-exit", packExit.toFixed(3));

      frames.forEach((frameEl, index) => {
        if (index === 0) return;
        const frameIn = smooth(map(p, 0.16 + index * 0.08, 0.40 + index * 0.08));
        frameEl.style.setProperty("--frame-in", frameIn.toFixed(3));
      });

      if (stage) {
        if (p < 0.32) stage.textContent = "Open gate";
        else if (p < 0.66) stage.textContent = "Split formats";
        else stage.textContent = "Campaign export";
      }
    }

    if (reduce) {
      pack.style.setProperty("--pack-progress", "1");
      pack.style.setProperty("--pack-open", "1");
      pack.style.setProperty("--pack-split", "1");
      frames.forEach((frameEl) => frameEl.style.setProperty("--frame-in", "1"));
      if (stage) stage.textContent = "Campaign export";
      return;
    }

    let ticking = false;
    const requestUpdate = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        updateScene();
        ticking = false;
      });
    };

    updateScene();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
  })();

  /* ---------- CONTENT SYSTEM (mobile): scroll-driven format timeline ---------- */
  (function packMobileTimeline() {
    const seq = document.querySelector(".pack-seq");
    if (!seq) return;
    const items = [...seq.querySelectorAll(".pseq")];
    const fill = seq.querySelector(".pack-seq__fill");
    if (!items.length) return;
    if (reduce) { items.forEach((i) => i.classList.add("is-done", "is-active")); if (fill) fill.style.height = "100%"; return; }
    function upd() {
      const vh = innerHeight || document.documentElement.clientHeight;
      let done = 0;
      items.forEach((it) => {
        const r = it.getBoundingClientRect();
        const mid = r.top + r.height / 2;
        const isDone = mid < vh * 0.48;
        const isActive = !isDone && mid < vh * 0.72 && r.bottom > vh * 0.18;
        it.classList.toggle("is-done", isDone);
        it.classList.toggle("is-active", isActive);
        if (isDone) done++;
      });
      if (fill) fill.style.height = ((done / items.length) * 100).toFixed(1) + "%";
    }
    let ticking = false;
    const req = () => { if (ticking) return; ticking = true; requestAnimationFrame(() => { upd(); ticking = false; }); };
    upd();
    window.addEventListener("scroll", req, { passive: true });
    window.addEventListener("resize", req);
  })();

  /* ---------- TEAM: compact contact-sheet scroll settle ---------- */
  (function teamContactSheet() {
    const team = document.querySelector(".team");
    if (!team) return;
    const clamp = (v, min = 0, max = 1) => Math.max(min, Math.min(max, v));
    const smooth = (v) => {
      v = clamp(v);
      return v * v * (3 - 2 * v);
    };

    function updateTeam() {
      const r = team.getBoundingClientRect();
      const vh = innerHeight || document.documentElement.clientHeight;
      const p = smooth(clamp((vh * 0.86 - r.top) / (vh * 0.54 + r.height * 0.35)));
      team.style.setProperty("--team-progress", p.toFixed(3));
    }

    if (reduce) {
      team.style.setProperty("--team-progress", "1");
      return;
    }

    let ticking = false;
    const requestUpdate = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        updateTeam();
        ticking = false;
      });
    };

    updateTeam();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
  })();

  /* ---------- PORTFOLIO: hover-play real videos (incl. blurred bg copy) ---------- */
  document.querySelectorAll(".card").forEach((card) => {
    const media = card.querySelector(".card__media");
    const primary = card.querySelector("video.card__video:not([aria-hidden='true'])");
    const vids = card.querySelectorAll("video.card__video, video.card__video-bg");
    if (!vids.length) return;
    card.classList.add("has-video");

    if (media && !media.querySelector(".card__play")) {
      const play = document.createElement("span");
      play.className = "card__play";
      play.textContent = "PLAY";
      media.appendChild(play);
    }

    const progress = card.querySelector(".card__bar i");
    const setProgress = (value) => {
      if (!progress) return;
      progress.style.setProperty("--video-progress", String(Math.max(0, Math.min(1, value))));
    };
    const updateProgress = () => {
      const duration = primary && Number.isFinite(primary.duration) ? primary.duration : 0;
      const current = primary ? primary.currentTime : 0;
      setProgress(duration > 0 ? current / duration : 0);
    };

    if (primary) {
      primary.addEventListener("timeupdate", updateProgress);
      primary.addEventListener("loadedmetadata", updateProgress);
      primary.addEventListener("ended", () => {
        setProgress(1);
        card.classList.remove("is-playing");
      });
    }

    card.addEventListener("mouseenter", () => {
      setProgress(0);
      card.classList.add("is-playing");
      vids.forEach((v) => {
        try {
          v.currentTime = 0;
          const p = v.play();
          if (p && p.catch) p.catch(() => {});
        } catch (_) {}
      });
    });
    card.addEventListener("mouseleave", () => {
      card.classList.remove("is-playing");
      vids.forEach((v) => {
        try {
          v.pause();
          v.currentTime = 0;
        } catch (_) {}
      });
      setProgress(0);
    });
  });

  /* ---------- STUDIO: autoplay BTS video while in view ---------- */
  (function studioVideo() {
    const v = document.querySelector(".studio__video");
    if (!v) return;
    const tryPlay = () => { const p = v.play(); if (p && p.catch) p.catch(() => {}); };
    v.addEventListener("canplay", tryPlay);
    tryPlay();
    if ("IntersectionObserver" in window) {
      new IntersectionObserver((es) => {
        es.forEach((e) => { if (e.isIntersecting) tryPlay(); else v.pause(); });
      }, { threshold: 0.2 }).observe(v);
    }
  })();

  /* ---------- PORTFOLIO reel (pinned, batches of 5) ---------- */
  (function workSlider() {
    const reel = document.querySelector(".work-reel");
    if (!reel) return;
    const chips = [...document.querySelectorAll(".work__filters .chip")];
    const allCards = [...reel.querySelectorAll(".card")];
    const prevBtn = document.querySelector("[data-reel-prev]");
    const nextBtn = document.querySelector("[data-reel-next]");
    const dotsWrap = document.querySelector("[data-reel-dots]");
    const countEl = document.querySelector("[data-reel-count]");
    const PER = 5;
    let filter = "all";
    let batches = [];
    let curBatch = -1;

    const desktopMode = () => window.matchMedia("(min-width: 1101px)").matches;
    const chunk = (arr, n) => { const o = []; for (let i = 0; i < arr.length; i += n) o.push(arr.slice(i, i + n)); return o; };

    let places = new Map();
    const isPortrait = (c) => c.getAttribute("data-short") === "1";
    // Orientation-aware packer: 4 bands (3 cols each) x 2 rows.
    // Portrait/short = full-height vertical tile (2 rows); others = square/rect (1 row).
    function packBatches(cards) {
      const out = [];
      const pl = new Map();
      let bands, batch;
      const fresh = () => { bands = [0, 0, 0, 0]; batch = []; out.push(batch); };
      const col = (b) => (b * 3 + 1) + " / " + (b * 3 + 4);
      fresh();
      cards.forEach((c) => {
        if (isPortrait(c)) {
          let b = bands.indexOf(0);
          if (b === -1) { fresh(); b = 0; }
          pl.set(c, [col(b), "1 / 3"]);
          bands[b] = 2; batch.push(c);
        } else {
          let b = bands.findIndex((v) => v < 2);
          if (b === -1) { fresh(); b = 0; }
          const row = bands[b];
          pl.set(c, [col(b), (row + 1) + " / " + (row + 2)]);
          bands[b] = row + 1; batch.push(c);
        }
      });
      if (out.length && out[out.length - 1].length === 0) out.pop();
      return { batches: out, places: pl };
    }

    function syncHud() {
      if (countEl) countEl.innerHTML = "<b>" + String(curBatch + 1).padStart(2, "0") + "</b> / " + String(batches.length).padStart(2, "0");
      if (dotsWrap) [...dotsWrap.children].forEach((d, i) => d.classList.toggle("is-on", i === curBatch));
    }

    function applyBatch(batch, lay, desktop, animate) {
      allCards.forEach((c) => {
        if (batch.indexOf(c) === -1) {
          c.classList.add("is-hidden");
          c.classList.remove("is-live", "is-exit");
          c.style.transitionDelay = "";
          c.style.gridColumn = "";
          c.style.gridRow = "";
        }
      });
      batch.forEach((c, i) => {
        c.classList.remove("is-hidden", "is-exit");
        if (desktop) { const L = lay[i]; if (L) { c.style.gridColumn = L[0]; c.style.gridRow = L[1]; } }
        c.style.transitionDelay = (animate ? i * 0.06 : 0) + "s";
        void c.offsetWidth;
        c.classList.add("is-live");
      });
      syncHud();
    }
    function showBatch(idx, animate) {
      const n = batches.length;
      idx = ((idx % n) + n) % n; // loop
      if (idx === curBatch) return;
      const prev = curBatch;
      curBatch = idx;
      const desktop = desktopMode();
      const batch = batches[idx] || [];
      const lay = batch.map((c) => places.get(c));
      clearTimeout(showBatch._t);
      if (animate && prev >= 0 && desktop) {
        allCards.forEach((c) => {
          if (c.classList.contains("is-live") && batch.indexOf(c) === -1) {
            c.classList.remove("is-live");
            c.classList.add("is-exit");
          }
        });
        showBatch._t = setTimeout(() => applyBatch(batch, lay, desktop, true), 300);
      } else {
        applyBatch(batch, lay, desktop, animate);
      }
    }

    function buildDots() {
      if (!dotsWrap) return;
      dotsWrap.innerHTML = "";
      batches.forEach((_, i) => {
        const b = document.createElement("button");
        b.type = "button";
        b.setAttribute("aria-label", "Realizacje — grupa " + (i + 1));
        b.addEventListener("click", () => showBatch(i, true));
        dotsWrap.appendChild(b);
      });
    }

    function rebuild() {
      const filtered = allCards.filter((c) => filter === "all" || (c.dataset.cats || "").split(/[\s,]+/).filter(Boolean).includes(filter));
      if (desktopMode()) {
        const packed = packBatches(filtered);
        batches = packed.batches;
        places = packed.places;
      } else {
        // mobile: simple pages of 4 tiles, same switcher/slider
        batches = chunk(filtered, 4);
        places = new Map();
      }
      if (batches.length === 0) batches = [[]];
      buildDots();
      curBatch = -1;
      showBatch(0, false);
    }

    if (reduce) {
      reel.style.gridTemplateColumns = "repeat(3, 1fr)";
      reel.style.gridTemplateRows = "auto";
      reel.style.height = "auto";
      allCards.forEach((c) => { c.classList.add("is-live"); c.style.minHeight = "240px"; });
      return;
    }

    chips.forEach((chip) => chip.addEventListener("click", () => {
      chips.forEach((c) => c.classList.remove("is-on"));
      chip.classList.add("is-on");
      filter = chip.dataset.filter || "all";
      rebuild();
    }));

    if (prevBtn) prevBtn.addEventListener("click", () => showBatch(curBatch - 1, true));
    if (nextBtn) nextBtn.addEventListener("click", () => showBatch(curBatch + 1, true));

    // keyboard when section in view
    document.addEventListener("keydown", (e) => {
      if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
      if (!desktopMode()) return;
      const r = reel.getBoundingClientRect();
      if (r.bottom < 80 || r.top > innerHeight - 80) return;
      if (e.key === "ArrowLeft") showBatch(curBatch - 1, true);
      else showBatch(curBatch + 1, true);
    });

    // touch swipe (mobile shows all, but keep for tablet)
    let sx = 0;
    reel.addEventListener("touchstart", (e) => { sx = e.touches[0].clientX; }, { passive: true });
    reel.addEventListener("touchend", (e) => {
      const dx = e.changedTouches[0].clientX - sx;
      if (Math.abs(dx) > 50) showBatch(curBatch + (dx < 0 ? 1 : -1), true);
    }, { passive: true });

    let wasDesktop = desktopMode();
    window.addEventListener("resize", () => {
      const now = desktopMode();
      if (now !== wasDesktop) { wasDesktop = now; rebuild(); }
    });

    rebuild();
    const params = new URLSearchParams(window.location.search);
    const rc = params.get("cat");
    if (rc) { const t = chips.find((c) => c.dataset.filter === rc); if (t) { chips.forEach((c) => c.classList.remove("is-on")); t.classList.add("is-on"); filter = rc; rebuild(); } }
  })();

  /* ---------- PROCESS timeline (scroll-driven playhead) ---------- */
  const track = document.querySelector(".tl__track");
  const playhead = document.querySelector(".tl__playhead");
  const clips = [...document.querySelectorAll(".tl__clips .clip")];
  const ptc = document.querySelector(".tl__playhead .ptc");
  if (track && playhead && clips.length) {
    let lastP = -1;
    function timeline() {
      const r = track.getBoundingClientRect();
      const vh = innerHeight;
      // off-screen: skip all work (no layout writes while it's not visible)
      if (r.bottom < -120 || r.top > vh + 120) { requestAnimationFrame(timeline); return; }
      // progress as the track scrolls through the middle band of viewport
      const start = vh * 0.85;
      const end = vh * 0.2;
      let p = (start - r.top) / (start - end + r.height);
      p = Math.max(0, Math.min(1, p));
      if (Math.abs(p - lastP) > 0.0005) {
        lastP = p;
        playhead.style.left = (p * 100) + "%";
        if (ptc) ptc.textContent = tc(Math.round(p * (clips.length * 48)));
        const activeIdx = Math.min(clips.length - 1, Math.floor(p * clips.length + 0.0001));
        clips.forEach((c, i) => {
          c.classList.toggle("is-done", i < activeIdx || (p >= 1 && i <= activeIdx));
          c.classList.toggle("is-active", i === activeIdx && p < 1);
          if (p >= 1) c.classList.add("is-done");
        });
      }
      requestAnimationFrame(timeline);
    }
    if (!reduce) timeline();
    else clips.forEach((c) => c.classList.add("is-done"));
  }

  /* ---------- Scroll word-fill (kudos-style) ---------- */
  (function wordFill() {
    const selector = ".sec-title, .studio__title, .studio__copy, .sub-hero h1, .sub-head h2, .service-hub h1";
    const targets = [...document.querySelectorAll(selector)].filter((el) => !el.matches(".sub-hero h1"));
    if (!targets.length) return;
    const DIM = 0.12;
    const EDGE = 1; // per-letter reveal (each letter flips at its own threshold)

    function wrap(node, bag) {
      [...node.childNodes].forEach((child) => {
        if (child.nodeType === 3) {
          const parts = child.nodeValue.split(/(\s+)/);
          if (!parts.length) return;
          const frag = document.createDocumentFragment();
          parts.forEach((tok) => {
            if (tok === "") return;
            if (/^\s+$/.test(tok)) { frag.appendChild(document.createTextNode(tok)); return; }
            const word = document.createElement("span");
            word.className = "wf-word";
            word.style.display = "inline-block";
            word.style.whiteSpace = "pre";
            for (const ch of tok) {
              const s = document.createElement("span");
              s.className = "wf-w";
              s.textContent = ch;
              bag.push(s);
              word.appendChild(s);
            }
            frag.appendChild(word);
          });
          node.replaceChild(frag, child);
        } else if (child.nodeType === 1 && child.tagName !== "BR") {
          if (child.hasAttribute && child.hasAttribute("data-no-wf")) return;
          wrap(child, bag);
        }
      });
    }

    const items = targets.map((el) => {
      el.classList.remove("reveal");
      el.style.opacity = "1";
      el.style.transform = "none";
      const words = [];
      wrap(el, words);
      words.forEach((w) => { w.style.opacity = DIM; w.style.transition = "opacity .3s ease"; });
      return { el, words };
    });

    if (reduce) { items.forEach((it) => it.words.forEach((w) => (w.style.opacity = "1"))); return; }

    function update() {
      const vh = innerHeight || document.documentElement.clientHeight;
      items.forEach(({ el, words }) => {
        const r = el.getBoundingClientRect();
        const N = words.length;
        const f = Math.max(0, Math.min(1, (vh * 0.86 - r.top) / (r.height + vh * 0.34)));
        for (let i = 0; i < N; i++) {
          const lit = Math.max(0, Math.min(1, (f * (N + EDGE) - i) / EDGE));
          words[i].style.opacity = (DIM + (1 - DIM) * lit).toFixed(3);
        }
      });
    }
    let lastY = -1, lastH = -1;
    function loop() {
      const y = window.scrollY || window.pageYOffset || 0;
      const h = innerHeight;
      if (y !== lastY || h !== lastH) { lastY = y; lastH = h; update(); }
      requestAnimationFrame(loop);
    }
    update();
    requestAnimationFrame(loop);
  })();

  /* ---------- Sub-hero heading intro (above-the-fold, staggered per-letter on load) ---------- */
  (function heroIntro() {
    const els = [...document.querySelectorAll(".sub-hero h1")];
    if (!els.length) return;
    els.forEach((el) => {
      el.classList.remove("reveal");
      el.style.opacity = "1";
      el.style.transform = "none";
      if (reduce) return;
      const letters = [];
      (function walk(node) {
        [...node.childNodes].forEach((c) => {
          if (c.nodeType === 3) {
            const frag = document.createDocumentFragment();
            // split into words; wrap each word so lines only break at spaces
            c.textContent.split(/(\s+)/).forEach((tok) => {
              if (tok === "") return;
              if (/^\s+$/.test(tok)) { frag.appendChild(document.createTextNode(" ")); return; }
              const word = document.createElement("span");
              word.style.display = "inline-block";
              word.style.whiteSpace = "nowrap";
              [...tok].forEach((ch) => {
                const s = document.createElement("span");
                s.textContent = ch;
                s.style.display = "inline-block";
                s.style.opacity = "0.08";
                s.style.transform = "translateY(0.18em)";
                s.style.transition = "opacity .55s ease, transform .55s cubic-bezier(.2,.7,.2,1)";
                word.appendChild(s);
                letters.push(s);
              });
              frag.appendChild(word);
            });
            node.replaceChild(frag, c);
          } else if (c.nodeType === 1 && c.tagName !== "BR" && !c.hasAttribute("data-no-wf")) {
            walk(c);
          }
        });
      })(el);
      letters.forEach((s, i) => {
        setTimeout(() => { s.style.opacity = "1"; s.style.transform = "none"; }, 140 + i * 20);
      });
    });
  })();

  /* ---------- Smooth anchor nav ---------- */
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      if (id.length < 2) return;
      const t = document.querySelector(id);
      if (t) {
        e.preventDefault();
        const y = t.getBoundingClientRect().top + window.scrollY - 12;
        window.scrollTo({ top: y, behavior: reduce ? "auto" : "smooth" });
      }
    });
  });
})();

/* ============================================================
   COOKIE CONSENT — lang-aware, persistent, shown on all pages
   ============================================================ */
(function cookieConsent() {
  var KEY = "sezmoo-cookie-consent";
  try { if (localStorage.getItem(KEY)) return; } catch (e) {}

  var en = (document.documentElement.lang || "pl").toLowerCase().indexOf("en") === 0;

  // relative path to site root, derived from a known asset (styles.css / app.js)
  function rootPrefix() {
    var el = document.querySelector('link[href$="styles.css"]') || document.querySelector('script[src$="app.js"]');
    var u = el ? (el.getAttribute("href") || el.getAttribute("src") || "") : "";
    return u.replace(/(styles\.css|app\.js)(\?.*)?$/, "");
  }
  var up = rootPrefix();
  var privacyHref = up + (en ? "en/privacy-policy/index.html" : "polityka-prywatnosci/index.html");

  var t = en ? {
    text: "We use cookies to make the site work, remember preferences and — with your consent — for statistics and marketing.",
    more: "Privacy policy", accept: "Accept all", nec: "Only necessary"
  } : {
    text: "Używamy plików cookies, aby strona działała poprawnie, zapamiętywała preferencje oraz — za Twoją zgodą — w celach statystycznych i marketingowych.",
    more: "Polityka prywatności", accept: "Akceptuję", nec: "Tylko niezbędne"
  };

  function save(v) {
    try { localStorage.setItem(KEY, v + "|" + Date.now()); } catch (e) {}
    banner.setAttribute("data-hide", "");
    setTimeout(function () { if (banner.parentNode) banner.parentNode.removeChild(banner); }, 420);
  }

  var banner = document.createElement("div");
  banner.className = "cookie-bar";
  banner.setAttribute("role", "dialog");
  banner.setAttribute("aria-label", en ? "Cookie consent" : "Zgoda na cookies");
  banner.innerHTML =
    '<div class="cookie-bar__inner">' +
      '<div class="cookie-bar__tag">● COOKIES</div>' +
      '<p class="cookie-bar__text">' + t.text + ' <a href="' + privacyHref + '">' + t.more + ' →</a></p>' +
      '<div class="cookie-bar__actions">' +
        '<button type="button" class="cookie-bar__btn" data-nec>' + t.nec + '</button>' +
        '<button type="button" class="cookie-bar__btn cookie-bar__btn--primary" data-accept>' + t.accept + '</button>' +
      '</div>' +
    '</div>';

  function mount() {
    document.body.appendChild(banner);
    requestAnimationFrame(function () { banner.setAttribute("data-show", ""); });
    banner.querySelector("[data-accept]").addEventListener("click", function () { save("all"); });
    banner.querySelector("[data-nec]").addEventListener("click", function () { save("necessary"); });
  }
  if (document.body) mount();
  else document.addEventListener("DOMContentLoaded", mount);
})();

/* ---------- Category chips on cards (derived from data-cats) ---------- */
(function cardCategoryChips() {
  var isEN = (document.documentElement.getAttribute("lang") || "").toLowerCase().indexOf("en") === 0;
  var LABELS = isEN
    ? { video: "Video", social: "Social", animacje: "3D/2D", eventy: "Event" }
    : { video: "Wideo", social: "Social", animacje: "3D/2D", eventy: "Event" };
  function build() {
    var cards = document.querySelectorAll(".card[data-cats]");
    cards.forEach(function (card) {
      var info = card.querySelector(".card__info");
      if (!info || info.querySelector(".card__cats")) return;
      var cats = (card.getAttribute("data-cats") || "").split(/[\s,]+/).filter(Boolean);
      if (!cats.length) return;
      var row = document.createElement("div");
      row.className = "card__cats";
      cats.forEach(function (c) {
        if (!LABELS[c]) return;
        var chip = document.createElement("span");
        chip.className = "card__cchip";
        chip.textContent = LABELS[c];
        row.appendChild(chip);
      });
      info.appendChild(row);
    });
  }
  if (document.readyState !== "loading") build();
  else document.addEventListener("DOMContentLoaded", build);
})();

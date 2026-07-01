/* ============================================================
   SEZMOO — interactions
   ============================================================ */
(function () {
  "use strict";
  const root = document.documentElement;
  root.classList.add("js");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* ---------- Smooth momentum scrolling (Lenis) ---------- */
  (function smoothScroll() {
    if (reduce || !fine) return; // native scroll on touch / reduced-motion
    const s = document.createElement("script");
    s.src = "https://unpkg.com/lenis@1.1.14/dist/lenis.min.js";
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

  /* ---------- PARALLAX thumbnails ---------- */
  if (!reduce) {
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

    function layoutFor(size) {
      if (size >= 5) return [[1,7,1,3],[7,10,1,2],[10,13,1,2],[7,10,2,3],[10,13,2,3]];
      if (size === 4) return [[1,7,1,3],[7,13,1,2],[7,10,2,3],[10,13,2,3]];
      if (size === 3) return [[1,7,1,3],[7,13,1,2],[7,13,2,3]];
      if (size === 2) return [[1,7,1,3],[7,13,1,3]];
      return [[1,13,1,3]];
    }

    function syncHud() {
      if (countEl) countEl.textContent = String(curBatch + 1).padStart(2, "0") + " / " + String(batches.length).padStart(2, "0");
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
        if (desktop) { const L = lay[i]; c.style.gridColumn = L[0] + " / " + L[1]; c.style.gridRow = L[2] + " / " + L[3]; }
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
      const lay = layoutFor(batch.length);
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
      const filtered = allCards.filter((c) => filter === "all" || (c.dataset.cats || "").split(",").includes(filter));
      batches = chunk(filtered, PER);
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
      if (Math.abs(dx) > 60 && desktopMode()) showBatch(curBatch + (dx < 0 ? 1 : -1), true);
    }, { passive: true });

    let wasDesktop = desktopMode();
    window.addEventListener("resize", () => {
      const now = desktopMode();
      if (now !== wasDesktop) { wasDesktop = now; const keep = curBatch; curBatch = -1; showBatch(Math.max(0, keep), false); }
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
    function timeline() {
      const r = track.getBoundingClientRect();
      const vh = innerHeight;
      // progress as the track scrolls through the middle band of viewport
      const start = vh * 0.85;
      const end = vh * 0.2;
      let p = (start - r.top) / (start - end + r.height);
      p = Math.max(0, Math.min(1, p));
      playhead.style.left = (p * 100) + "%";
      if (ptc) ptc.textContent = tc(Math.round(p * (clips.length * 48)));
      const activeIdx = Math.min(clips.length - 1, Math.floor(p * clips.length + 0.0001));
      clips.forEach((c, i) => {
        c.classList.toggle("is-done", i < activeIdx || (p >= 1 && i <= activeIdx));
        c.classList.toggle("is-active", i === activeIdx && p < 1);
        if (p >= 1) c.classList.add("is-done");
      });
      requestAnimationFrame(timeline);
    }
    if (!reduce) timeline();
    else clips.forEach((c) => c.classList.add("is-done"));
  }

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

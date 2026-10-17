/**
 * Global chrome: logo, Lenis, nav, reveal, anchors, sub-hero intro.
 * Loaded from BaseLayout on every page.
 */
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
      // mobile menu logo clone: light panel → black+yellow (by), dark panel → white+yellow (wy)
      var mimg = document.querySelector(".nav__menu-logo img");
      if (mimg) {
        var mwant = light ? "sezmoo-logo-by.svg" : "sezmoo-logo-wy.svg";
        var msrc = mimg.getAttribute("src") || "";
        var mnext = msrc.replace(/sezmoo-logo-(wy|by)\.svg/, mwant);
        if (mnext !== msrc) mimg.setAttribute("src", mnext);
      }
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
    function loadLenis() {
      if (document.getElementById("sez-lenis")) return;
      const s = document.createElement("script");
      s.id = "sez-lenis";
      // Public vendor copy (synced to /assets/js/); app itself is Vite-bundled.
      s.src = "/assets/js/lenis.min.js";
      s.onload = function () {
        const L = window.Lenis || (window.lenis && window.lenis.Lenis);
        if (!L) return;
        const lenis = new L({
          duration: 1.05,
          easing: (t) => 1 - Math.pow(1 - t, 3),
          smoothWheel: true,
          wheelMultiplier: 1,
          touchMultiplier: 1.4,
          // CookieYes preference modal scrolls its own pane — don't chain to the page.
          prevent: (node) =>
            !!(
              node &&
              node.closest &&
              node.closest(
                '.cky-preference-body-wrapper, .cky-modal, .cky-preference-center, #cky-consent-container, [data-lenis-prevent]'
              )
            ),
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
          e.stopImmediatePropagation();
          lenis.scrollTo(target, { offset: -anchorOffset() });
        });
      };
      s.onerror = function () { /* keep native scroll */ };
      document.head.appendChild(s);
    }
    // Native scroll first; Lenis after idle so it doesn't compete with LCP.
    const schedule = () => {
      if ("requestIdleCallback" in window) requestIdleCallback(loadLenis, { timeout: 2000 });
      else setTimeout(loadLenis, 800);
    };
    if (document.readyState === "complete") schedule();
    else window.addEventListener("load", schedule, { once: true });
  })();

  function anchorOffset() {
    const nav = document.querySelector(".nav");
    const h = nav ? Math.ceil(nav.getBoundingClientRect().height) : 72;
    return h + 24;
  }

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

    // Enhance mobile menu: brand logo (top) + social icons (bottom). Hidden on desktop via CSS.
    if (!menu.querySelector(".nav__menu-logo")) {
      var srcBrand = document.querySelector(".brand");
      var srcLogo = document.querySelector(".brand__logo");
      var logo = document.createElement("a");
      logo.className = "nav__menu-logo";
      logo.setAttribute("aria-label", "SEZMOO");
      if (srcBrand) logo.href = srcBrand.getAttribute("href") || "#top";
      var baseLogoSrc = srcLogo ? srcLogo.getAttribute("src") : "";
      var menuLight = (document.documentElement.getAttribute("data-theme") || "dark") === "light";
      var menuLogoSrc = baseLogoSrc.replace(/sezmoo-logo-(wy|by)\.svg/, menuLight ? "sezmoo-logo-by.svg" : "sezmoo-logo-wy.svg");
      logo.innerHTML = '<img src="' + menuLogoSrc + '" alt="SEZMOO" />';
      var social = document.createElement("div");
      social.className = "nav__social";
      social.innerHTML =
        '<a href="https://www.instagram.com/sezmoo/" target="_blank" rel="noopener" aria-label="Instagram"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.3" cy="6.7" r="1" fill="currentColor" stroke="none"/></svg></a>' +
        '<a href="https://www.facebook.com/sezmooagencja" target="_blank" rel="noopener" aria-label="Facebook"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M14 9V7.2c0-.8.2-1.2 1.3-1.2H17V3.1C16.6 3 15.5 3 14.3 3 11.8 3 10.2 4.5 10.2 7v2H7.7v3h2.5v9h3.3v-9h2.5l.4-3H14z"/></svg></a>' +
        '<a href="https://www.youtube.com/@sezmooagency" target="_blank" rel="noopener" aria-label="YouTube"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M22 8.2a3 3 0 0 0-2.1-2.1C18 5.6 12 5.6 12 5.6s-6 0-7.9.5A3 3 0 0 0 2 8.2 31 31 0 0 0 1.6 12 31 31 0 0 0 2 15.8a3 3 0 0 0 2.1 2.1c1.9.5 7.9.5 7.9.5s6 0 7.9-.5a3 3 0 0 0 2.1-2.1c.3-1.2.4-2.5.4-3.8s-.1-2.6-.4-3.8zM10 15V9l5.2 3L10 15z"/></svg></a>' +
        '<a href="https://www.linkedin.com/company/sezmoo/" target="_blank" rel="noopener" aria-label="LinkedIn"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M6.9 8.6H3.7V21h3.2V8.6zM5.3 3.2A1.9 1.9 0 1 0 5.3 7a1.9 1.9 0 0 0 0-3.8zM21 21h-3.2v-6.1c0-1.5 0-3.3-2-3.3s-2.3 1.6-2.3 3.2V21H10.3V8.6h3v1.7h.1c.4-.8 1.5-1.7 3-1.7 3.3 0 3.9 2.1 3.9 4.9V21z"/></svg></a>';
      menu.insertBefore(logo, menu.firstChild);
      menu.appendChild(social);
    }

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
      if (window.innerWidth > 1100) setOpen(false);
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
    bar.appendChild(makeItem({ href: "tel:+48739260450", svg: ICO.phone, label: T.phone, aria: T.aphone }));

    // 2 · E-mail
    bar.appendChild(makeItem({ href: "mailto:biuro@sezmoo.com", svg: ICO.mail, label: T.mail, aria: T.amail }));

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

  /* ---------- SCRUBBER (page progress) — desktop only ---------- */
  const fill = document.querySelector(".scrubber__fill");
  const head = document.querySelector(".scrubber__head");
  function updateScrub() {
    if (!fill || !head) return;
    const h = document.documentElement.scrollHeight - window.innerHeight;
    const p = h > 0 ? (window.scrollY / h) * 100 : 0;
    fill.style.width = p + "%";
    head.style.left = p + "%";
  }
  if (fill && head && fine && !reduce) {
    updateScrub();
    window.addEventListener("scroll", updateScrub, { passive: true });
    window.addEventListener("resize", updateScrub);
  }

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


  /* ---------- Scroll word-fill (kudos-style) ---------- */
  (function wordFill() {
    const selector = ".sec-title, .studio__title, .sub-hero h1, .sub-head h2, .service-hub h1";
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
      if (e.defaultPrevented) return;
      const id = a.getAttribute("href");
      if (id.length < 2) return;
      const t = document.querySelector(id);
      if (t) {
        e.preventDefault();
        e.stopImmediatePropagation();
        if (window.__lenis && window.__lenis.scrollTo) {
          window.__lenis.scrollTo(t, { offset: -anchorOffset() });
          return;
        }
        const y = t.getBoundingClientRect().top + window.scrollY - anchorOffset();
        window.scrollTo({ top: y, behavior: reduce ? "auto" : "smooth" });
      }
    });
  });
})();

/* ============================================================
   COOKIE CONSENT — disabled; CookieYes CMP loads via GTM
   (GTM-KJFG8DZL → CookieYes | CMP). Do not re-enable a local banner.
   ============================================================ */
(function cookieConsent() {
  return;
})();

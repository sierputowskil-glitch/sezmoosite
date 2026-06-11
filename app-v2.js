/* ============================================================
   SEZMOO · v2 — interactions
   ============================================================ */
(function () {
  "use strict";
  document.documentElement.classList.add("js");
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* ---- reveal (scroll-position based; robust where IO is unreliable) ---- */
  function revealCheck() {
    const vh = innerHeight || document.documentElement.clientHeight;
    document.querySelectorAll(".rv:not(.in), .lines:not(.in)").forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.top < vh * 0.92 && r.bottom > -40) el.classList.add("in");
    });
  }
  revealCheck();
  requestAnimationFrame(revealCheck);
  addEventListener("scroll", revealCheck, { passive: true });
  addEventListener("resize", revealCheck);
  // failsafe: never leave content hidden
  setTimeout(() => document.querySelectorAll(".rv,.lines").forEach((e) => e.classList.add("in")), 3000);

  /* ---- custom cursor ---- */
  if (fine) {
    const cur = document.querySelector(".cur");
    let tx = innerWidth / 2, ty = innerHeight / 2, x = tx, y = ty;
    addEventListener("mousemove", (e) => { tx = e.clientX; ty = e.clientY; });
    (function loop() {
      x += (tx - x) * 0.22; y += (ty - y) * 0.22;
      cur.style.transform = `translate(${x}px,${y}px)`;
      requestAnimationFrame(loop);
    })();
    document.querySelectorAll("a,button,[data-cur='big']").forEach((el) => {
      el.addEventListener("mouseenter", () => cur.classList.add("is-big"));
      el.addEventListener("mouseleave", () => cur.classList.remove("is-big"));
    });
  }

  /* ---- magnetic ---- */
  if (fine && !reduce) {
    document.querySelectorAll("[data-mag]").forEach((el) => {
      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        el.style.transform = `translate(${(e.clientX - (r.left + r.width / 2)) * 0.3}px,${(e.clientY - (r.top + r.height / 2)) * 0.3}px)`;
      });
      el.addEventListener("mouseleave", () => (el.style.transform = ""));
    });
  }

  /* ---- WORK: floating preview follows cursor ---- */
  const floatEl = document.querySelector(".float");
  if (floatEl && fine) {
    const media = floatEl.querySelector(".media");
    const ph = floatEl.querySelector(".ph");
    let fx = innerWidth / 2, fy = innerHeight / 2, cx = fx, cy = fy, active = false;
    addEventListener("mousemove", (e) => { fx = e.clientX; fy = e.clientY; });
    (function floatLoop() {
      cx += (fx - cx) * 0.14; cy += (fy - cy) * 0.14;
      const rot = Math.max(-8, Math.min(8, (fx - cx) * 0.4));
      floatEl.style.transform = `translate(${cx}px,${cy}px) translate(-50%,-50%) rotate(${rot}deg) scale(${active ? 1 : 0.85})`;
      requestAnimationFrame(floatLoop);
    })();
    document.querySelectorAll(".wrow").forEach((row) => {
      row.addEventListener("mouseenter", () => {
        active = true; floatEl.classList.add("show");
        if (row.dataset.tint) media.style.setProperty("--tint", row.dataset.tint);
        media.style.filter = `hue-rotate(${row.dataset.hue || 0}deg)`;
        if (ph) ph.textContent = "[ " + (row.dataset.label || "preview") + " ]";
        document.querySelector(".cur") && document.querySelector(".cur").classList.add("is-view");
      });
      row.addEventListener("mouseleave", () => {
        active = false; floatEl.classList.remove("show");
        document.querySelector(".cur") && document.querySelector(".cur").classList.remove("is-view");
      });
    });
  }

  /* ---- PROCESS: scroll-driven progress + step activation ---- */
  const track = document.querySelector(".proc__track");
  const lineFill = document.querySelector(".proc__line i");
  const steps = [...document.querySelectorAll(".pstep")];
  if (track && lineFill && steps.length) {
    const vertical = () => matchMedia("(max-width: 760px)").matches;
    function tick() {
      const r = track.getBoundingClientRect();
      const start = innerHeight * 0.8, end = innerHeight * 0.35;
      let p = (start - r.top) / (start - end + r.height * 0.5);
      p = Math.max(0, Math.min(1, p));
      if (vertical()) lineFill.style.height = (p * 100) + "%";
      else lineFill.style.width = (p * 100) + "%";
      const act = Math.round(p * steps.length);
      steps.forEach((s, i) => s.classList.toggle("on", i < act));
      requestAnimationFrame(tick);
    }
    if (!reduce) tick(); else steps.forEach((s) => s.classList.add("on"));
  }

  /* ---- nav anchor smooth ---- */
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href"); if (id.length < 2) return;
      const t = document.querySelector(id);
      if (t) { e.preventDefault(); scrollTo({ top: t.getBoundingClientRect().top + scrollY - 8, behavior: reduce ? "auto" : "smooth" }); }
    });
  });
})();

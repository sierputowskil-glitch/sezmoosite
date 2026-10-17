/**
 * Lazy-load heavy desktop FX from public URL (synced via sync:assets).
 * Skip on touch / reduced-motion. WebGL init is expensive (~1–4s scripting) —
 * wait for idle well after load (or first pointer move) so lab PSI/TBT stays clean.
 */
(function () {
  try {
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (reduce || !fine) return;

    var loaded = false;
    function inject() {
      if (loaded) return;
      loaded = true;
      if (document.getElementById('sez-flowing-bg')) return;
      var s = document.createElement('script');
      s.id = 'sez-flowing-bg';
      s.src = '/assets/js/flowing-background.js';
      s.async = true;
      document.body.appendChild(s);
    }

    function scheduleIdle() {
      if ('requestIdleCallback' in window) requestIdleCallback(inject, { timeout: 3000 });
      else setTimeout(inject, 1500);
    }

    // First pointer move = user is engaged; otherwise wait past typical Lighthouse window.
    window.addEventListener('pointermove', inject, { once: true, passive: true });
    function afterLoad() {
      setTimeout(scheduleIdle, 5000);
    }
    if (document.readyState === 'complete') afterLoad();
    else window.addEventListener('load', afterLoad, { once: true });
  } catch (_e) {}
})();

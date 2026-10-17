/**
 * Lazy-load heavy desktop FX from public URL (synced via sync:assets).
 * Skip on touch / reduced-motion.
 */
(function () {
  try {
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (reduce || !fine) return;
    var s = document.createElement('script');
    s.src = '/assets/js/flowing-background.js';
    s.async = true;
    document.body.appendChild(s);
  } catch (_e) {}
})();

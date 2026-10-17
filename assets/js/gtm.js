/**
 * Idle-load GTM when BaseLayout sets window.__SEZMOO__.gtmId (prod CI only).
 * Wait until after LCP so CookieYes (loaded via GTM) is not the LCP element —
 * that alone was collapsing desktop PSI (CMP text @ ~8s).
 */
(function () {
  var cfg = window.__SEZMOO__ || {};
  var GTM_ID = cfg.gtmId;
  if (!GTM_ID) return;

  var loaded = false;

  function loadGtm() {
    if (loaded) return;
    loaded = true;
    window.__SEZMOO_GTM__ = true;
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });
    var f = document.getElementsByTagName('script')[0];
    var j = document.createElement('script');
    j.async = true;
    j.src = 'https://www.googletagmanager.com/gtm.js?id=' + GTM_ID;
    f.parentNode.insertBefore(j, f);
  }

  function afterQuiet(cb) {
    if ('requestIdleCallback' in window) requestIdleCallback(cb, { timeout: 2500 });
    else setTimeout(cb, 1800);
  }

  function scheduleAfterLcp() {
    var settled = false;
    var finish = function () {
      if (settled) return;
      settled = true;
      // One more frame so the real LCP candidate can paint before CMP mounts.
      requestAnimationFrame(function () {
        afterQuiet(loadGtm);
      });
    };

    try {
      var po = new PerformanceObserver(function (list) {
        if (list.getEntries().length) {
          try {
            po.disconnect();
          } catch (_e) {}
          finish();
        }
      });
      po.observe({ type: 'largest-contentful-paint', buffered: true });
    } catch (_e) {
      finish();
      return;
    }

    // Consent must still appear; never wait forever if LCP never fires.
    window.addEventListener(
      'load',
      function () {
        setTimeout(finish, 3500);
      },
      { once: true }
    );
    setTimeout(finish, 6000);
  }

  if (document.readyState === 'complete') scheduleAfterLcp();
  else window.addEventListener('load', scheduleAfterLcp, { once: true });
})();

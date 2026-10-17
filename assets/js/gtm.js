/**
 * Idle-load GTM when BaseLayout sets window.__SEZMOO__.gtmId (prod CI only).
 *
 * CookieYes | CMP fires on Consent Initialization as soon as gtm.js boots.
 * LCP keeps updating until the first user input — so loading GTM on the *first*
 * LCP entry still lets the CMP banner become the final LCP (lab ~6s).
 *
 * Wait until LCP has been stable, then boot GTM. Consent still appears within
 * a hard cap so the banner is not deferred indefinitely.
 */
(function () {
  var cfg = window.__SEZMOO__ || {};
  var GTM_ID = cfg.gtmId;
  if (!GTM_ID) return;

  var loaded = false;
  var SETTLE_MS = 2000;
  var MIN_MS = 2500;
  var MAX_MS = 7000;

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

  function elapsed() {
    var start = performance.timing ? performance.timing.navigationStart : Date.now();
    return Date.now() - start;
  }

  function scheduleLoad() {
    var waitMin = Math.max(0, MIN_MS - elapsed());
    var run = function () {
      if ('requestIdleCallback' in window) {
        requestIdleCallback(loadGtm, { timeout: 2000 });
      } else {
        setTimeout(loadGtm, 400);
      }
    };
    if (waitMin > 0) setTimeout(run, waitMin);
    else run();
  }

  function arm() {
    var settled = false;
    var settleTimer = null;
    var finish = function () {
      if (settled) return;
      settled = true;
      if (settleTimer) clearTimeout(settleTimer);
      try {
        if (po) po.disconnect();
      } catch (_e) {}
      scheduleLoad();
    };

    var bump = function () {
      if (settled) return;
      if (settleTimer) clearTimeout(settleTimer);
      settleTimer = setTimeout(finish, SETTLE_MS);
    };

    var po = null;
    try {
      po = new PerformanceObserver(function (list) {
        if (list.getEntries().length) bump();
      });
      po.observe({ type: 'largest-contentful-paint', buffered: true });
      // Buffered entries may already exist — start settle clock.
      bump();
    } catch (_e) {
      finish();
      return;
    }

    // Hard cap: CMP must still show for consent UX / compliance.
    setTimeout(finish, MAX_MS);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', arm, { once: true });
  } else {
    arm();
  }
})();

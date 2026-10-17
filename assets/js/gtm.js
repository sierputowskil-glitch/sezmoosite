/**
 * Idle-load GTM when BaseLayout sets window.__SEZMOO__.gtmId (prod CI only).
 */
(function () {
  var cfg = window.__SEZMOO__ || {};
  var GTM_ID = cfg.gtmId;
  if (!GTM_ID) return;

  function loadGtm() {
    if (window.__SEZMOO_GTM__) return;
    window.__SEZMOO_GTM__ = true;
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });
    var f = document.getElementsByTagName('script')[0];
    var j = document.createElement('script');
    j.async = true;
    j.src = 'https://www.googletagmanager.com/gtm.js?id=' + GTM_ID;
    f.parentNode.insertBefore(j, f);
  }

  function schedule() {
    if ('requestIdleCallback' in window) requestIdleCallback(loadGtm, { timeout: 3000 });
    else setTimeout(loadGtm, 1);
  }

  if (document.readyState === 'complete') schedule();
  else window.addEventListener('load', schedule);
})();

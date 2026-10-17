/**
 * CookieYes Free paints blue via element style= — re-apply SEZMOO theme
 * after the CMP mounts (CSS alone loses to their inline styles).
 */
(function () {
  var Y = '#FFD200';
  var map = [
    ['.cky-consent-bar', 'border-color:#f4f4f4;background-color:#FFFFFF'],
    ['.cky-title', 'color:#212121'],
    ['.cky-notice-des', 'color:#212121'],
    ['.cky-policy', 'color:' + Y + ';border-color:transparent;background-color:transparent'],
    ['.cky-btn-accept', 'color:#000000;border-color:' + Y + ';background-color:#ffd200'],
    ['.cky-btn-reject', 'color:' + Y + ';border-color:' + Y + ';background-color:transparent'],
    ['.cky-btn-customize', 'color:' + Y + ';border-color:' + Y + ';background-color:transparent'],
    ['.cky-btn-preferences', 'color:' + Y + ';border-color:' + Y + ';background-color:transparent'],
    ['.cky-preference-center', 'color:#212121;border-color:#F4F4F4;background-color:#FFFFFF'],
    ['.cky-preference-title', 'color:#212121'],
    ['.cky-btn-revisit-wrapper', 'background-color:' + Y],
  ];

  function paint(root) {
    var scope = root && root.querySelectorAll ? root : document;
    for (var i = 0; i < map.length; i++) {
      var nodes = scope.querySelectorAll(map[i][0]);
      for (var j = 0; j < nodes.length; j++) {
        nodes[j].setAttribute('style', map[i][1]);
      }
    }
    var toggles = scope.querySelectorAll('.cky-switch input[type="checkbox"]');
    for (var k = 0; k < toggles.length; k++) {
      toggles[k].style.backgroundColor = toggles[k].checked ? Y : '#d0d5d2';
    }
    // Let Lenis ignore nested CookieYes scroll (attribute + closest() prevent)
    var scrollers = scope.querySelectorAll(
      '.cky-preference-body-wrapper, .cky-modal, .cky-preference-center',
    );
    for (var s = 0; s < scrollers.length; s++) {
      scrollers[s].setAttribute('data-lenis-prevent', '');
    }
  }

  function boot() {
    paint(document);
    if (!window.MutationObserver) return;
    var obs = new MutationObserver(function (muts) {
      for (var i = 0; i < muts.length; i++) {
        var nodes = muts[i].addedNodes;
        for (var j = 0; j < nodes.length; j++) {
          var n = nodes[j];
          if (n.nodeType !== 1) continue;
          if (
            n.classList &&
            (n.classList.contains('cky-consent-container') ||
              n.classList.contains('cky-modal') ||
              n.id === 'cky-consent-container')
          ) {
            paint(n);
          } else if (
            n.querySelector &&
            n.querySelector('.cky-consent-bar,.cky-btn-accept,.cky-preference-center')
          ) {
            paint(n);
          }
        }
      }
    });
    obs.observe(document.documentElement, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();

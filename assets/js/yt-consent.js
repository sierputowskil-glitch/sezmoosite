/**
 * Gate YouTube embeds behind CookieYes marketing consent (advertisement).
 * Exposes: window.__SEZMOO__.hasYtConsent / whenYtConsent
 *
 * - With GTM/CookieYes (expectCmp): wait for advertisement (or analytics) accept.
 * - Without CMP (local, GTM off): allow immediately so DX isn't broken.
 */
(function () {
  var sez = (window.__SEZMOO__ = window.__SEZMOO__ || {});
  var waiters = [];
  var lastAllowed = null;

  function fromCategories(cats) {
    if (!cats) return null;
    return !!(cats.advertisement || cats.analytics);
  }

  function fromAcceptedList(accepted) {
    if (!accepted || !accepted.length) return false;
    return (
      accepted.indexOf('advertisement') > -1 ||
      accepted.indexOf('analytics') > -1
    );
  }

  function readConsent() {
    try {
      if (typeof window.getCkyConsent === 'function') {
        var c = window.getCkyConsent();
        if (c && c.categories) return fromCategories(c.categories);
      }
    } catch (_e) {}
    return null;
  }

  function hasYtConsent() {
    var v = readConsent();
    if (v !== null) return v;
    if (lastAllowed !== null) return lastAllowed;
    // No CookieYes on page → only allow when we are not expecting a CMP
    return !sez.expectCmp;
  }

  function flushAllow() {
    lastAllowed = true;
    var q = waiters.splice(0, waiters.length);
    for (var i = 0; i < q.length; i++) {
      try {
        q[i]();
      } catch (_e) {}
    }
  }

  function revokeYt() {
    lastAllowed = false;
    waiters.length = 0;
    var iframes = document.querySelectorAll(
      'iframe[src*="youtube.com"],iframe[src*="youtube-nocookie.com"]'
    );
    for (var i = 0; i < iframes.length; i++) {
      var ifr = iframes[i];
      var parent = ifr.parentNode;
      ifr.remove();
      if (parent && parent.getAttribute && parent.getAttribute('data-yt-bg') != null) {
        delete parent.dataset.ytMounted;
      }
    }
    document.dispatchEvent(
      new CustomEvent('sezmoo:yt-consent', { detail: { allowed: false } })
    );
  }

  function applyDetail(detail) {
    if (!detail) return;
    var ok = null;
    if (detail.categories) ok = fromCategories(detail.categories);
    else if (detail.accepted) ok = fromAcceptedList(detail.accepted);
    if (ok === null) return;
    if (ok) {
      flushAllow();
      document.dispatchEvent(
        new CustomEvent('sezmoo:yt-consent', { detail: { allowed: true } })
      );
    } else {
      revokeYt();
    }
  }

  function whenYtConsent(fn) {
    if (typeof fn !== 'function') return;
    if (hasYtConsent()) {
      fn();
      return;
    }
    waiters.push(fn);
  }

  document.addEventListener('cookieyes_banner_load', function (e) {
    applyDetail(e.detail);
  });
  document.addEventListener('cookieyes_consent_update', function (e) {
    applyDetail(e.detail);
  });

  // Late CMP: poll briefly until getCkyConsent appears (GTM loads after idle)
  if (sez.expectCmp) {
    var tries = 0;
    var t = setInterval(function () {
      tries++;
      var v = readConsent();
      if (v === true) {
        clearInterval(t);
        flushAllow();
      } else if (v === false || tries > 40) {
        // false = user already rejected; null after ~10s = still waiting for banner
        if (v === false) clearInterval(t);
        if (tries > 40) clearInterval(t);
      }
    }, 250);
  }

  sez.hasYtConsent = hasYtConsent;
  sez.whenYtConsent = whenYtConsent;

  /**
   * Case-study / facade helper.
   * Prefer first-party CDN MP4 (no consent). Fall back to YouTube after CookieYes.
   */
  sez.mountYtEmbed = function (container, id, query) {
    if (!container || !id) return;
    if (container.querySelector('video.cdn-video, iframe')) return;
    if (typeof sez.mountCdnVideo === 'function' && sez.cdnVideoUrl && sez.cdnVideoUrl(id)) {
      sez.mountCdnVideo(container, id, {
        controls: true,
        autoplay: true,
      });
      return;
    }
    whenYtConsent(function () {
      if (container.querySelector('iframe, video.cdn-video')) return;
      var ifr = document.createElement('iframe');
      ifr.src =
        'https://www.youtube-nocookie.com/embed/' +
        id +
        '?' +
        (query ||
          'autoplay=1&rel=0&modestbranding=1&playsinline=1');
      ifr.allow = 'autoplay; fullscreen; picture-in-picture; encrypted-media';
      ifr.setAttribute('allowfullscreen', '');
      container.appendChild(ifr);
    });
  };
})();

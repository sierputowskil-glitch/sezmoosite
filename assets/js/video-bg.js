/**
 * Background video: local poster first, then first-party CDN MP4 (no YouTube iframe).
 * Desktop + mobile: mount when near viewport (muted autoplay).
 * Save-Data / 2g / reduced-motion: poster + HTML [data-video-play] control.
 * Offscreen on touch: detach buffer so lazy images keep the pipe.
 * Depends on window.__SEZMOO__ from cdn-video-map.
 */
(function () {
  var finePointer = false;
  var reduceMotion = false;
  try {
    finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch (_e) {}

  var conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  var saveData = !!(conn && conn.saveData);
  var slowNet = !!(
    conn &&
    (conn.effectiveType === '2g' ||
      conn.effectiveType === 'slow-2g' ||
      (typeof conn.downlink === 'number' && conn.downlink > 0 && conn.downlink < 0.7))
  );
  var posterOnly = reduceMotion || saveData || slowNet;

  function applyPoster(el) {
    var poster = el.getAttribute('data-video-poster');
    if (poster && !el.style.backgroundImage) {
      el.style.backgroundImage = 'url("' + poster + '")';
    }
  }

  function mediaHost(el) {
    return el.closest('.studio__media') || el;
  }

  function markPlaying(el) {
    el.classList.add('is-playing');
    var host = mediaHost(el);
    host.classList.add('is-playing');
    host.classList.remove('is-poster-only');
  }

  function mountCdnBg(el, id) {
    var s = window.__SEZMOO__;
    if (!s || !s.mountCdnVideo || !s.cdnVideoUrl || !s.cdnVideoUrl(id)) return false;
    if (el.dataset.videoMounted === '1' && el.querySelector('video')) return true;
    el.dataset.videoMounted = '1';
    s.mountCdnVideo(el, id, {
      muted: true,
      loop: true,
      autoplay: true,
      preload: finePointer ? 'auto' : 'metadata',
      className: 'video-bg__video',
      title: el.getAttribute('data-video-title') || '',
    });
    markPlaying(el);
    return true;
  }

  function mount(el) {
    if (!el) return;
    applyPoster(el);
    var forced = el.dataset.forcePlay === '1';
    if (posterOnly && !forced) {
      el.dataset.videoMounted = '1';
      mediaHost(el).classList.add('is-poster-only');
      return;
    }
    if (el.dataset.videoMounted === '1' && el.querySelector('video')) return;
    var id = el.getAttribute('data-video-id');
    if (!id) return;
    if (mountCdnBg(el, id)) return;
    if (!window.__SEZMOO__ || !window.__SEZMOO__.cdnVideoMap) {
      var tries = 0;
      var t = setInterval(function () {
        tries++;
        if (mountCdnBg(el, id) || tries > 40) {
          clearInterval(t);
          if (!el.dataset.videoMounted) el.dataset.videoMounted = '1';
        }
      }, 50);
      return;
    }
    el.dataset.videoMounted = '1';
  }

  function playBgMedia(el) {
    var v = el.querySelector('video');
    if (!v) return;
    v.muted = true;
    v.playsInline = true;
    var p = v.play();
    if (p && typeof p.catch === 'function') p.catch(function () {});
  }

  function pauseBgMedia(el) {
    var v = el.querySelector('video');
    if (v && !v.paused) v.pause();
  }

  function detachBgMedia(el) {
    var v = el.querySelector('video');
    if (!v) return;
    try {
      v.pause();
    } catch (_e) {}
    v.removeAttribute('src');
    while (v.firstChild) v.removeChild(v.firstChild);
    try {
      v.load();
    } catch (_e2) {}
    if (v.parentNode) v.parentNode.removeChild(v);
    delete el.dataset.videoMounted;
    el.classList.remove('is-playing');
    mediaHost(el).classList.remove('is-playing');
  }

  function forcePlayFromControl(btn) {
    var host = btn.closest('.studio__media') || btn.parentElement;
    if (!host) return;
    var el = host.querySelector('[data-video-bg]');
    if (!el) return;
    el.dataset.forcePlay = '1';
    delete el.dataset.videoMounted;
    mount(el);
    markPlaying(el);
  }

  function bindPlayControls() {
    document.querySelectorAll('[data-video-play]').forEach(function (btn) {
      if (btn.dataset.boundPlay) return;
      btn.dataset.boundPlay = '1';
      btn.addEventListener(
        'click',
        function (e) {
          e.preventDefault();
          e.stopPropagation();
          forcePlayFromControl(btn);
        },
        { passive: false },
      );
      // Some mobile WebViews swallow click on transformed ancestors — mirror on touchend.
      btn.addEventListener(
        'touchend',
        function (e) {
          e.preventDefault();
          e.stopPropagation();
          forcePlayFromControl(btn);
        },
        { passive: false },
      );
    });
  }

  function whenIdle(fn) {
    if ('requestIdleCallback' in window) requestIdleCallback(fn, { timeout: 2200 });
    else if (document.readyState === 'complete') setTimeout(fn, 1);
    else
      window.addEventListener('load', function () {
        setTimeout(fn, 1);
      });
  }

  function whenNear(el) {
    if (!('IntersectionObserver' in window)) {
      whenIdle(function () {
        mount(el);
      });
      return;
    }
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          var target = e.target;
          if (e.isIntersecting) {
            applyPoster(target);
            if (posterOnly && target.dataset.forcePlay !== '1') {
              mediaHost(target).classList.add('is-poster-only');
              return;
            }
            if (!target.querySelector('video')) mount(target);
            else playBgMedia(target);
          } else {
            pauseBgMedia(target);
            if (!finePointer && target.dataset.forcePlay !== '1') detachBgMedia(target);
          }
        });
      },
      { rootMargin: '160px 0px', threshold: 0.12 },
    );
    io.observe(el);
  }

  bindPlayControls();

  document.querySelectorAll('[data-video-bg]').forEach(function (el) {
    applyPoster(el);
    if (posterOnly) {
      mediaHost(el).classList.add('is-poster-only');
      el.dataset.videoMounted = '1';
      return;
    }
    if (el.getAttribute('data-video-priority') === 'hero') {
      whenIdle(function () {
        mount(el);
      });
    } else {
      whenNear(el);
    }
  });
})();

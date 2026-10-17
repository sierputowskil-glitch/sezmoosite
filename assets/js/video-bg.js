/**
 * Background video: local poster first, then first-party CDN MP4 (no YouTube iframe).
 * Touch / coarse pointer: poster only. Depends on window.__SEZMOO__ from cdn-video-map.
 */
(function () {
  var finePointer = false;
  try {
    finePointer =
      window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch (_e) {}

  function applyPoster(el) {
    var poster = el.getAttribute('data-video-poster');
    if (poster && !el.style.backgroundImage) {
      el.style.backgroundImage = 'url("' + poster + '")';
    }
  }

  function mountCdnBg(el, id) {
    var s = window.__SEZMOO__;
    if (!s || !s.mountCdnVideo || !s.cdnVideoUrl || !s.cdnVideoUrl(id)) return false;
    if (el.dataset.videoMounted) return true;
    el.dataset.videoMounted = '1';
    s.mountCdnVideo(el, id, {
      muted: true,
      loop: true,
      autoplay: true,
      preload: 'metadata',
      className: 'video-bg__video',
      title: el.getAttribute('data-video-title') || '',
    });
    return true;
  }

  function mount(el) {
    if (!el || el.dataset.videoMounted) return;
    applyPoster(el);
    if (!finePointer) {
      el.dataset.videoMounted = '1';
      return;
    }
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
    var p = v.play();
    if (p && typeof p.catch === 'function') p.catch(function () {});
  }

  function pauseBgMedia(el) {
    var v = el.querySelector('video');
    if (v && !v.paused) v.pause();
  }

  function whenIdle(fn) {
    if ('requestIdleCallback' in window) requestIdleCallback(fn, { timeout: 2200 });
    else if (document.readyState === 'complete') setTimeout(fn, 1);
    else window.addEventListener('load', function () { setTimeout(fn, 1); });
  }

  function whenNear(el) {
    if (!('IntersectionObserver' in window)) {
      whenIdle(function () { mount(el); });
      return;
    }
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          var target = e.target;
          if (e.isIntersecting) {
            applyPoster(target);
            if (!target.dataset.videoMounted) mount(target);
            else playBgMedia(target);
          } else {
            pauseBgMedia(target);
          }
        });
      },
      { rootMargin: '120px 0px', threshold: 0.15 },
    );
    io.observe(el);
  }

  document.querySelectorAll('[data-video-bg]').forEach(function (el) {
    applyPoster(el);
    if (!finePointer) {
      el.dataset.videoMounted = '1';
      return;
    }
    if (el.getAttribute('data-video-priority') === 'hero') whenIdle(function () { mount(el); });
    else whenNear(el);
  });
})();

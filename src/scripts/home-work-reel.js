/**
 * Work-reel cards: hover-preview + real duration via YouTube IFrame API.
 * Only activates for `.work-reel .card[data-yt]` (legacy lightbox cards).
 */
(function homeWorkReel() {
  const cards = [].slice.call(document.querySelectorAll('.work-reel .card[data-yt]'));
  if (!cards.length) return;

  cards.forEach(function (card) {
    const id = card.getAttribute('data-yt');
    function go() {
      if (id) location.href = '/realizacja/' + id + '/';
    }
    card.addEventListener('click', go);
    card.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        go();
      }
    });
  });

  const canHover = window.matchMedia('(hover:hover) and (pointer:fine)').matches;
  if (canHover) {
    cards.forEach(function (card) {
      const media = card.querySelector('.card__media');
      const id = card.getAttribute('data-yt');
      if (!media || !id) return;
      let timer = null;
      card.addEventListener('mouseenter', function () {
        timer = setTimeout(function () {
          var s = window.__SEZMOO__;
          var run = function () {
            if (media.querySelector('iframe.card__prev')) return;
            const ifr = document.createElement('iframe');
            ifr.className = 'card__prev';
            ifr.src =
              'https://www.youtube-nocookie.com/embed/' +
              id +
              '?autoplay=1&mute=1&controls=0&rel=0&modestbranding=1&playsinline=1&loop=1&playlist=' +
              id +
              '&origin=https://sezmoo.com';
            ifr.allow = 'autoplay; encrypted-media; picture-in-picture';
            ifr.setAttribute('tabindex', '-1');
            ifr.style.cssText =
              'position:absolute;inset:0;width:100%;height:100%;border:0;z-index:3;pointer-events:none;';
            media.appendChild(ifr);
          };
          if (s && typeof s.whenYtConsent === 'function') s.whenYtConsent(run);
          else if (!s || !s.expectCmp) run();
        }, 240);
      });
      card.addEventListener('mouseleave', function () {
        clearTimeout(timer);
        const ifr = media.querySelector('iframe.card__prev');
        if (ifr) ifr.remove();
      });
    });
  }

  function fmt(s) {
    s = Math.round(s);
    const m = Math.floor(s / 60);
    const r = s % 60;
    return 'TC ' + (m < 10 ? '0' + m : m) + ':' + (r < 10 ? '0' + r : r);
  }

  function initDurations() {
    const YT = window.YT;
    if (!YT || !YT.Player) return;

    const host = document.createElement('div');
    host.style.cssText =
      'position:absolute;width:1px;height:1px;left:-9999px;top:-9999px;overflow:hidden;';
    document.body.appendChild(host);
    const el = document.createElement('div');
    host.appendChild(el);
    const queue = cards
      .map(function (c) {
        return { id: c.getAttribute('data-yt'), tc: c.querySelector('.card__tc') };
      })
      .filter(function (q) {
        return q.id && q.tc;
      });
    if (!queue.length) {
      host.remove();
      return;
    }
    let i = 0;
    let player;
    let guard;

    function writeDur() {
      let d = 0;
      try {
        d = player.getDuration();
      } catch (_e) {
        /* ignore */
      }
      if (d && d > 0) {
        const q = queue[i];
        const rd = q.tc.querySelector('.rd');
        q.tc.textContent = fmt(d);
        if (rd) q.tc.insertBefore(rd, q.tc.firstChild);
        clearTimeout(guard);
        i++;
        next();
      }
    }

    function next() {
      if (i >= queue.length) {
        host.remove();
        return;
      }
      guard = setTimeout(function () {
        i++;
        next();
      }, 4000);
      player.cueVideoById(queue[i].id);
    }

    YT.ready(function () {
      player = new YT.Player(el, {
        height: '1',
        width: '1',
        videoId: queue[0].id,
        playerVars: { autoplay: 0, controls: 0 },
        events: {
          onReady: function () {
            next();
          },
          onStateChange: function (e) {
            if (e.data === YT.PlayerState.CUED) writeDur();
          },
        },
      });
    });
  }

  if (window.YT && window.YT.Player) {
    initDurations();
  } else {
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = function () {
      if (prev) prev();
      initDurations();
    };
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    document.head.appendChild(tag);
  }
})();

/**
 * Auto-generated from assets/video/yt/manifest.json — YT id → CDN MP4 URL.
 * Regenerate after download-ytultra / CDN upload.
 */
(function () {
  var sez = (window.__SEZMOO__ = window.__SEZMOO__ || {});
  sez.cdnVideoMap = {
  "DFj4rZzxHXA": "https://cdn.sezmoo.com/video/yt/DFj4rZzxHXA__vts-group.mp4",
  "E-eVE7zqBSU": "https://cdn.sezmoo.com/video/yt/E-eVE7zqBSU__primespot-jastarnia.mp4",
  "EYep01WK7G0": "https://cdn.sezmoo.com/video/yt/EYep01WK7G0__byd-swiateczny.mp4",
  "Hdnf6zcn3bA": "https://cdn.sezmoo.com/video/yt/Hdnf6zcn3bA__jaecoo-8.mp4",
  "HiDdlydRXWU": "https://cdn.sezmoo.com/video/yt/HiDdlydRXWU__nfm-event.mp4",
  "IH3xK5yzSGI": "https://cdn.sezmoo.com/video/yt/IH3xK5yzSGI__byd-dolphin-a.mp4",
  "JZCqtWY_cGc": "https://cdn.sezmoo.com/video/yt/JZCqtWY_cGc__port-gdynia.mp4",
  "NHEIfdgr9mI": "https://cdn.sezmoo.com/video/yt/NHEIfdgr9mI__izipak.mp4",
  "OJnUGJdFk9w": "https://cdn.sezmoo.com/video/yt/OJnUGJdFk9w__denza-premiera.mp4",
  "PvHXbj1xNdA": "https://cdn.sezmoo.com/video/yt/PvHXbj1xNdA__land-rover.mp4",
  "WG5ufZMfjQ8": "https://cdn.sezmoo.com/video/yt/WG5ufZMfjQ8__audi-rs5-trailer.mp4",
  "WszuntCE51c": "https://cdn.sezmoo.com/video/yt/WszuntCE51c__baltic-3d.mp4",
  "X8-hf_cyZxE": "https://cdn.sezmoo.com/video/yt/X8-hf_cyZxE__byd-dolphin-b.mp4",
  "YkWCkew6OGg": "https://cdn.sezmoo.com/video/yt/YkWCkew6OGg__showreel.mp4",
  "Z-KB8adO_Wk": "https://cdn.sezmoo.com/video/yt/Z-KB8adO_Wk__baltic-towers.mp4",
  "bCxvqDc8HYs": "https://cdn.sezmoo.com/video/yt/bCxvqDc8HYs__doraco-dron.mp4",
  "b_MB9qpw6jE": "/assets/video/yt/b_MB9qpw6jE__zespol.mp4",
  "c_5toy1IhIs": "https://cdn.sezmoo.com/video/yt/c_5toy1IhIs__baltic-towers-load.mp4",
  "eBcPwtZ0eOk": "https://cdn.sezmoo.com/video/yt/eBcPwtZ0eOk__baltic-towers-rekrutacja.mp4",
  "foNjF4rmI6A": "https://cdn.sezmoo.com/video/yt/foNjF4rmI6A__gaja-park.mp4",
  "iknT-xURZag": "https://cdn.sezmoo.com/video/yt/iknT-xURZag__gdansk-miasto-kultury.mp4",
  "jco18tIaCT0": "https://cdn.sezmoo.com/video/yt/jco18tIaCT0__crt.mp4",
  "kCAxex9-oN4": "https://cdn.sezmoo.com/video/yt/kCAxex9-oN4__jaecoo-mundial.mp4",
  "lD11UTII6Ko": "https://cdn.sezmoo.com/video/yt/lD11UTII6Ko__omoda-jaecoo-dzien-mamy.mp4",
  "oWiVSRYtLoU": "https://cdn.sezmoo.com/video/yt/oWiVSRYtLoU__exlantix-aftermovie.mp4",
  "oeoytfRRqy4": "https://cdn.sezmoo.com/video/yt/oeoytfRRqy4__k2-dron.mp4",
  "pDQ8vGDMLDM": "https://cdn.sezmoo.com/video/yt/pDQ8vGDMLDM__porto-mare.mp4",
  "phXKtUNlDuM": "https://cdn.sezmoo.com/video/yt/phXKtUNlDuM__doraco-hala-tvp.mp4",
  "tPSlDvHGSH0": "https://cdn.sezmoo.com/video/yt/tPSlDvHGSH0__audi-plichta.mp4",
  "tgcCHgkOM4I": "https://cdn.sezmoo.com/video/yt/tgcCHgkOM4I__exlantix-short.mp4",
  "tvTuMX3mxG4": "https://cdn.sezmoo.com/video/yt/tvTuMX3mxG4__service-drone-reel.mp4",
  "uEQx8bXv1uM": "https://cdn.sezmoo.com/video/yt/uEQx8bXv1uM__rydzowka-resort.mp4",
  "wVy04YYnbRM": "https://cdn.sezmoo.com/video/yt/wVy04YYnbRM__pisf.mp4"
  };

  sez.cdnVideoUrl = function (id) {
    if (!id) return null;
    return sez.cdnVideoMap[id] || null;
  };

  /**
   * Mount first-party CDN <video> (no CookieYes / YouTube).
   * opts: muted, loop, controls, autoplay, preload, className, title, poster
   */
  sez.mountCdnVideo = function (container, id, opts) {
    opts = opts || {};
    var url = sez.cdnVideoUrl(id);
    if (!container || !url) return null;
    var existing = container.querySelector('video.cdn-video');
    if (existing) return existing;
    var v = document.createElement('video');
    v.className = 'cdn-video' + (opts.className ? ' ' + opts.className : '');
    v.src = url;
    v.setAttribute('playsinline', '');
    v.playsInline = true;
    v.preload = opts.preload || (opts.autoplay ? 'auto' : 'metadata');
    // Hide native “Download” in Chromium / Safari control menus
    v.setAttribute('controlsList', 'nodownload');
    v.setAttribute('disablePictureInPicture', '');
    if (opts.muted) {
      v.muted = true;
      v.setAttribute('muted', '');
    }
    if (opts.loop) v.loop = true;
    if (opts.controls) v.controls = true;
    if (opts.autoplay) v.autoplay = true;
    if (opts.poster) v.poster = opts.poster;
    if (opts.title) v.setAttribute('aria-label', opts.title);
    v.addEventListener('contextmenu', function (e) {
      e.preventDefault();
    });
    container.appendChild(v);
    if (opts.autoplay) {
      var p = v.play();
      if (p && typeof p.catch === 'function') p.catch(function () {});
    }
    return v;
  };

  /**
   * Play a video id in a container — CDN MP4 only (no YouTube iframe).
   * Kept as mountVideoEmbed for call-site compatibility (ids still use YT keys).
   */
  sez.mountVideoEmbed = function (container, id, _query) {
    if (!container || !id) return null;
    if (container.querySelector('video.cdn-video')) return null;
    if (!sez.cdnVideoUrl(id)) return null;
    return sez.mountCdnVideo(container, id, {
      controls: true,
      autoplay: true,
    });
  };
})();

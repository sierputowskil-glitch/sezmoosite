/**
 * Portfolio listing: category filters, CDN video lightbox, hover MP4 preview.
 * Loaded on /portfolio/ and /en/portfolio-en/ (and lista-b).
 * First-party CDN only — no YouTube iframe.
 */
(function () {
  var tiles = [].slice.call(document.querySelectorAll(".pt-tile"));
  if (!tiles.length) return;

  var en = (document.documentElement.lang || "").toLowerCase().indexOf("en") === 0;

  /* filters */
  var chips = [].slice.call(document.querySelectorAll(".pt-navlink"));
  chips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      var f = chip.dataset.filter || "all";
      chips.forEach(function (c) {
        c.classList.toggle("is-on", c === chip);
      });
      tiles.forEach(function (t) {
        var list = (t.getAttribute("data-cats") || "").split(/[\s,]+/);
        // accept both "video" and legacy "wideo"
        var match =
          f === "all" ||
          list.indexOf(f) > -1 ||
          (f === "video" && list.indexOf("wideo") > -1);
        t.classList.toggle("is-hide", !match);
      });
    });
  });

  /* deep link: ?cat=video */
  (function () {
    var m = /[?&]cat=([a-z]+)/.exec(location.search);
    if (!m) return;
    var chip = document.querySelector('.pt-navlink[data-filter="' + m[1] + '"]');
    if (chip) chip.click();
  })();

  function sez() {
    return window.__SEZMOO__ || {};
  }
  function cdnUrl(id) {
    var s = sez();
    return s.cdnVideoUrl ? s.cdnVideoUrl(id) : null;
  }
  function mountCdn(container, id, opts) {
    var s = sez();
    if (s.mountCdnVideo) return s.mountCdnVideo(container, id, opts);
    return null;
  }
  /** Wait briefly for defer cdn-video-map.js if click/hover fires early */
  function withCdn(id, fn) {
    if (cdnUrl(id)) {
      fn();
      return;
    }
    if (sez().cdnVideoMap) return;
    var n = 0;
    var t = setInterval(function () {
      n++;
      if (cdnUrl(id)) {
        clearInterval(t);
        fn();
      } else if (sez().cdnVideoMap || n > 40) {
        clearInterval(t);
      }
    }, 50);
  }

  /* video modal */
  var vlb = null;
  function openVideo(id, short) {
    if (!vlb) {
      vlb = document.createElement("div");
      vlb.className = "pt-vlb";
      vlb.hidden = true;
      vlb.innerHTML =
        '<button class="pt-vlb__close" type="button" aria-label="Zamknij">\u2715</button><div class="pt-vlb__frame"></div>';
      document.body.appendChild(vlb);
      vlb.addEventListener("click", function (e) {
        if (e.target === vlb || e.target.classList.contains("pt-vlb__close")) closeVideo();
      });
      document.addEventListener("keydown", function (e) {
        if (!vlb.hidden && e.key === "Escape") closeVideo();
      });
    }
    var frame = vlb.querySelector(".pt-vlb__frame");
    frame.className = "pt-vlb__frame" + (short ? " is-short" : "");
    frame.innerHTML = "";
    vlb.hidden = false;
    document.body.style.overflow = "hidden";
    withCdn(id, function () {
      if (!vlb || vlb.hidden) return;
      mountCdn(frame, id, { controls: true, autoplay: true });
    });
  }
  function closeVideo() {
    if (!vlb) return;
    vlb.hidden = true;
    vlb.querySelector(".pt-vlb__frame").innerHTML = "";
    document.body.style.overflow = "";
  }

  /* image gallery modal */
  var glb = null,
    gList = [],
    gIdx = 0,
    gAlt = "";
  function renderGallery() {
    var stage = glb.querySelector(".pt-glb__stage");
    var item = gList[gIdx],
      img = stage.querySelector("img"),
      yt = stage.querySelector(".pt-glb__video");
    if (item.indexOf("vid:") === 0 || item.indexOf("yt:") === 0) {
      img.hidden = true;
      img.removeAttribute("src");
      yt.hidden = false;
      yt.innerHTML = "";
      var gid = item.slice(item.indexOf(":") + 1);
      withCdn(gid, function () {
        if (!glb || glb.hidden) return;
        mountCdn(yt, gid, { controls: true, autoplay: true });
      });
    } else {
      yt.hidden = true;
      yt.innerHTML = "";
      img.hidden = false;
      img.src = item;
      img.alt =
        gAlt +
        (gList.length > 1
          ? en
            ? " – image " + (gIdx + 1) + " of " + gList.length
            : " – zdjęcie " + (gIdx + 1) + " z " + gList.length
          : "");
    }
    stage.querySelector(".pt-glb__count").textContent =
      String(gIdx + 1).padStart(2, "0") + " / " + String(gList.length).padStart(2, "0");
    var multi = gList.length > 1;
    stage.querySelector(".pt-glb__nav--prev").hidden = !multi;
    stage.querySelector(".pt-glb__nav--next").hidden = !multi;
    stage.querySelector(".pt-glb__count").hidden = !multi;
  }
  function stepGallery(d) {
    gIdx = (gIdx + d + gList.length) % gList.length;
    renderGallery();
  }
  function closeGallery() {
    if (!glb) return;
    glb.hidden = true;
    glb.querySelector(".pt-glb__video").innerHTML = "";
    document.body.style.overflow = "";
  }
  function openGallery(list, alt) {
    gList = list;
    gIdx = 0;
    if (!glb) {
      glb = document.createElement("div");
      glb.className = "pt-vlb";
      glb.hidden = true;
      glb.innerHTML =
        '<button class="pt-vlb__close" type="button" aria-label="Zamknij">\u2715</button>' +
        '<div class="pt-glb__stage">' +
        '<button class="pt-glb__nav pt-glb__nav--prev" type="button" aria-label="Poprzednie">\u2039</button>' +
        '<img alt="" />' +
        '<div class="pt-glb__video" hidden></div>' +
        '<button class="pt-glb__nav pt-glb__nav--next" type="button" aria-label="Nast\u0119pne">\u203a</button>' +
        '<span class="pt-glb__count"></span></div>';
      document.body.appendChild(glb);
      glb.addEventListener("click", function (e) {
        if (e.target === glb || e.target.classList.contains("pt-vlb__close")) {
          closeGallery();
          return;
        }
        if (e.target.classList.contains("pt-glb__nav--prev")) stepGallery(-1);
        if (e.target.classList.contains("pt-glb__nav--next")) stepGallery(1);
      });
      document.addEventListener("keydown", function (e) {
        if (glb.hidden) return;
        if (e.key === "Escape") closeGallery();
        if (e.key === "ArrowLeft") stepGallery(-1);
        if (e.key === "ArrowRight") stepGallery(1);
      });
    }
    gAlt = alt || "";
    renderGallery();
    glb.hidden = false;
    document.body.style.overflow = "hidden";
  }

  /* click routing — data-case → /realizacja/{id}/; other video → CDN modal; hrefs navigate */
  tiles.forEach(function (t) {
    t.addEventListener("click", function (e) {
      var id = t.getAttribute("data-id");
      var isVideo = t.getAttribute("data-media") === "video" && id;
      // Video case-study tiles (legacy data-case) → static Astro routes
      if (isVideo && t.getAttribute("data-case") === "1") {
        if (!t.getAttribute("href")) {
          e.preventDefault();
          location.href = (en ? "/en/realizacja/" : "/realizacja/") + id + "/";
        }
        return;
      }
      // Pure video tile (no case-study URL): always open CDN/lightbox modal
      if (isVideo && !t.getAttribute("href")) {
        e.preventDefault();
        openVideo(id, t.getAttribute("data-short") === "1");
        return;
      }
      if (t.getAttribute("href")) return;
      e.preventDefault();
      var gal = t.getAttribute("data-gallery");
      if (gal) {
        var img = t.querySelector("img");
        openGallery(gal.split("|"), img ? img.alt : "");
        return;
      }
      if (id) openVideo(id, t.getAttribute("data-short") === "1");
    });
  });

  /* in-tile hover — muted looping CDN MP4 */
  var canHover = window.matchMedia("(hover:hover) and (pointer:fine)").matches;
  if (canHover) {
    tiles.forEach(function (t) {
      if (t.getAttribute("data-media") !== "video") return;
      var media = t.querySelector(".pt-media"),
        id = t.getAttribute("data-id"),
        timer = null;
      if (!media || !id) return;
      t.addEventListener("mouseenter", function () {
        timer = setTimeout(function () {
          if (!media || media.querySelector("video.cdn-video")) return;
          withCdn(id, function () {
            if (!media || media.querySelector("video.cdn-video")) return;
            mountCdn(media, id, {
              muted: true,
              loop: true,
              autoplay: true,
              preload: "auto",
            });
          });
        }, 180);
      });
      t.addEventListener("mouseleave", function () {
        clearTimeout(timer);
        var node = media.querySelector("video.cdn-video");
        if (node) node.remove();
      });
    });
  }

  /* scroll depth tilt — desktop only */
  if (
    window.matchMedia("(min-width:900px)").matches &&
    !window.matchMedia("(prefers-reduced-motion:reduce)").matches
  ) {
    var ticking = false;
    function depthFrame() {
      var vh = window.innerHeight;
      tiles.forEach(function (t) {
        if (t.classList.contains("is-hide")) return;
        var r = t.getBoundingClientRect();
        if (r.bottom < -240 || r.top > vh + 240) return;
        var d = (r.top + r.height / 2 - vh / 2) / vh;
        d = Math.max(-1, Math.min(1, d));
        var rx = d * 3;
        t.style.transform =
          "perspective(1200px) rotateX(" + rx + "deg) scale(1)";
      });
      ticking = false;
    }
    function reqDepth() {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(depthFrame);
      }
    }
    window.addEventListener("scroll", reqDepth, { passive: true });
    window.addEventListener("resize", reqDepth);
    reqDepth();
  }
})();

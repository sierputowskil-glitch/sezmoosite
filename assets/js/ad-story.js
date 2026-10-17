/**
 * Instagram-style story player for .ad-story figures.
 * Frames come from a nested script.ad-story__data JSON array.
 */
(function () {
  function initStory(st) {
    var dataEl = st.querySelector('.ad-story__data');
    var data;
    try {
      data = JSON.parse(dataEl && dataEl.textContent);
    } catch (_e) {
      return;
    }
    if (!data || !data.length) return;
    var img = st.querySelector('.ad-story__img');
    var wrap = st.querySelector('.ad-story__bars');
    var cap = st.querySelector('.ad-story__cap');
    var DUR = 4200;
    var idx = 0;
    var timer = null;
    data.forEach(function () {
      var i = document.createElement('i');
      i.appendChild(document.createElement('b'));
      wrap.appendChild(i);
    });
    var bars = [].slice.call(wrap.querySelectorAll('b'));
    data.forEach(function (d) {
      var p = new Image();
      p.src = d.src;
    });
    function show(n) {
      idx = (n + data.length) % data.length;
      img.src = data[idx].src;
      img.alt = data[idx].alt || '';
      if (cap && data[idx].cap) cap.textContent = data[idx].cap;
      bars.forEach(function (b, i) {
        b.style.transition = 'none';
        b.style.width = i < idx ? '100%' : '0%';
      });
      void wrap.offsetWidth;
      var b = bars[idx];
      if (b) {
        b.style.transition = 'width ' + DUR + 'ms linear';
        b.style.width = '100%';
      }
      clearTimeout(timer);
      timer = setTimeout(function () {
        show(idx + 1);
      }, DUR);
    }
    var nx = st.querySelector('.ad-story__next');
    var pv = st.querySelector('.ad-story__prev');
    nx && nx.addEventListener('click', function () {
      show(idx + 1);
    });
    pv && pv.addEventListener('click', function () {
      show(idx - 1);
    });
    show(0);
  }
  function boot() {
    document.querySelectorAll('.ad-story').forEach(initStory);
  }
  if (document.readyState !== 'loading') boot();
  else document.addEventListener('DOMContentLoaded', boot);
})();

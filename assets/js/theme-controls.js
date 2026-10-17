/**
 * Desktop theme toggle ([data-theme-set]). FOUC-safe initial theme stays inline in BaseLayout.
 * Mobile bar theme lives in core.js and shares the same data-theme / localStorage key.
 */
(function () {
  var root = document.documentElement;
  var opts = [].slice.call(document.querySelectorAll('[data-theme-set]'));

  function apply(t) {
    root.setAttribute('data-theme', t);
    try {
      localStorage.setItem('sezmoo-theme', t);
    } catch (_e) {}
    opts.forEach(function (b) {
      var on = b.getAttribute('data-theme-set') === t;
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
  }

  opts.forEach(function (b) {
    b.addEventListener('click', function () {
      apply(b.getAttribute('data-theme-set'));
    });
  });
  apply(root.getAttribute('data-theme') || 'dark');
})();

/**
 * Contact / retainer forms → /api/contact + Turnstile.
 * Loaded globally from BaseLayout (home + abonamenty/retainers).
 */
/* ---------- Contact / retainer forms → send.php + Turnstile (invisible) ---------- */
(function phpForms() {
  var forms = [].slice.call(document.querySelectorAll("form.cform, #contact-form, #abonament-form, #retainer-form"));
  if (!forms.length) return;

  var turnstileReady = null;
  var siteKeyPromise = null;

  /** GTM / GA4 — bez PII (bez email, telefonu, imienia, treści). */
  function dlPush(payload) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(payload);
  }

  function formMeta(f) {
    var langInput = f.querySelector('input[name="lang"]');
    var originInput = f.querySelector('input[name="form-name"]');
    var needEl = f.querySelector('[name="need"]');
    var formName = (originInput && originInput.value === "abonament")
      ? "abonament"
      : (f.getAttribute("name") || f.id || "kontakt");
    if (formName === "contact") formName = "kontakt";
    return {
      form_id: f.id || "",
      form_name: formName,
      form_lang: (langInput && langInput.value === "en") ? "en" : "pl",
      form_need: needEl && needEl.value ? String(needEl.value) : ""
    };
  }

  function loadTurnstileApi() {
    if (window.turnstile) return Promise.resolve();
    if (turnstileReady) return turnstileReady;
    turnstileReady = new Promise(function (resolve, reject) {
      var s = document.createElement("script");
      s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      s.async = true;
      s.onload = function () { resolve(); };
      s.onerror = function () { reject(new Error("turnstile")); };
      document.head.appendChild(s);
    });
    return turnstileReady;
  }

  function getSiteKey() {
    if (siteKeyPromise) return siteKeyPromise;
    siteKeyPromise = Promise.resolve().then(function () {
      var fromEnv = (window.__SEZMOO__ && window.__SEZMOO__.turnstileSiteKey)
        ? String(window.__SEZMOO__.turnstileSiteKey)
        : "";
      if (fromEnv && fromEnv !== "0x4AAAAA..." && fromEnv.indexOf("...") === -1) {
        return fromEnv;
      }
      throw new Error("no-sitekey");
    });
    return siteKeyPromise;
  }

  function bindForm(f) {
    var note = f.querySelector(".cform__note");
    var btn = f.querySelector('button[type="submit"]');
    var lbl = btn ? btn.querySelector(".lbl") : null;
    var lblText = lbl ? lbl.textContent : "";
    var en = ((f.querySelector('input[name="lang"]') || {}).value === "en");
    var widgetId = null;
    var tokenResolve = null;
    var started = false;
    var host = document.createElement("div");
    host.setAttribute("aria-hidden", "true");
    host.style.cssText = "position:absolute;width:0;height:0;overflow:hidden;clip:rect(0,0,0,0);";
    f.appendChild(host);

    var noteIdle = note ? note.textContent : "";

    function say(t, kind) {
      if (!note) return;
      note.textContent = t;
      note.style.color = kind === "idle" ? "" : "var(--rec)";
      note.setAttribute("data-state", kind || "alert");
    }

    function setSending(on) {
      f.classList.toggle("is-sending", on);
      f.setAttribute("aria-busy", on ? "true" : "false");
      if (btn) {
        btn.disabled = !!on;
        btn.classList.toggle("is-sending", on);
        btn.setAttribute("aria-busy", on ? "true" : "false");
      }
      if (lbl) lbl.textContent = on ? (en ? "Sending\u2026" : "Wysy\u0142anie\u2026") : lblText;
      if (on) {
        say(en ? "\u25cf Sending\u2026" : "\u25cf Wysy\u0142anie\u2026", "idle");
      } else if (note && note.getAttribute("data-state") === "idle") {
        say(noteIdle, "idle");
      }
    }

    var NAME_RE = /^[A-Za-zĄąĆćĘęŁłŃńÓóŚśŹźŻżÀ-ÖØ-öø-ÿ][A-Za-zĄąĆćĘęŁłŃńÓóŚśŹźŻżÀ-ÖØ-öø-ÿ'’\-]*(?:\s+[A-Za-zĄąĆćĘęŁłŃńÓóŚśŹźŻżÀ-ÖØ-öø-ÿ][A-Za-zĄąĆćĘęŁłŃńÓóŚśŹźŻżÀ-ÖØ-öø-ÿ'’\-]*)+$/;
    // Keep phone validation in JS only — HTML pattern uses unicodeSets (v) where ()/- break.
    var PHONE_RE = /^\+?[0-9][0-9\s\-()]{6,18}[0-9]$/;
    var nameInput = f.querySelector('input[name="name"]');
    var phoneInput = f.querySelector('input[name="phone"]');

    if (nameInput) {
      nameInput.setAttribute("minlength", "3");
      nameInput.setAttribute("maxlength", "120");
      nameInput.setAttribute("autocomplete", "name");
      nameInput.setAttribute(
        "pattern",
        "[A-Za-zĄąĆćĘęŁłŃńÓóŚśŹźŻżÀ-ÖØ-öø-ÿ][A-Za-zĄąĆćĘęŁłŃńÓóŚśŹźŻżÀ-ÖØ-öø-ÿ'’\\-]*(?:\\s+[A-Za-zĄąĆćĘęŁłŃńÓóŚśŹźŻżÀ-ÖØ-öø-ÿ][A-Za-zĄąĆćĘęŁłŃńÓóŚśŹźŻżÀ-ÖØ-öø-ÿ'’\\-]*)+"
      );
      nameInput.setAttribute(
        "title",
        en ? "First and last name (letters only)" : "Imię i nazwisko (same litery)"
      );
    }
    if (phoneInput) {
      phoneInput.setAttribute("maxlength", "40");
      phoneInput.setAttribute("autocomplete", "tel");
      phoneInput.setAttribute("inputmode", "tel");
      phoneInput.removeAttribute("pattern");
      phoneInput.setAttribute(
        "title",
        en ? "Phone number, e.g. +48 500 000 000" : "Numer telefonu, np. +48 500 000 000"
      );
    }

    function validateNamePhone() {
      if (nameInput) {
        var n = (nameInput.value || "").trim().replace(/\s+/g, " ");
        nameInput.value = n;
        if (!n) {
          nameInput.setCustomValidity(en ? "Enter your name." : "Podaj imię i nazwisko.");
        } else if (!NAME_RE.test(n)) {
          nameInput.setCustomValidity(
            en
              ? "Enter your first and last name (letters only)."
              : "Podaj imię i nazwisko (same litery)."
          );
        } else {
          nameInput.setCustomValidity("");
        }
      }
      if (phoneInput) {
        var p = (phoneInput.value || "").trim();
        phoneInput.value = p;
        if (p === "") {
          phoneInput.setCustomValidity("");
        } else {
          var digits = p.replace(/\D+/g, "");
          if (!PHONE_RE.test(p) || digits.length < 9 || digits.length > 15) {
            phoneInput.setCustomValidity(
              en
                ? "Enter a valid phone number (e.g. +48 500 000 000)."
                : "Podaj prawidłowy numer telefonu (np. +48 500 000 000)."
            );
          } else {
            phoneInput.setCustomValidity("");
          }
        }
      }
    }

    if (nameInput) {
      nameInput.addEventListener("input", function () { nameInput.setCustomValidity(""); });
      nameInput.addEventListener("blur", validateNamePhone);
    }
    if (phoneInput) {
      phoneInput.addEventListener("input", function () { phoneInput.setCustomValidity(""); });
      phoneInput.addEventListener("blur", validateNamePhone);
    }

    function resetWidget() {
      if (widgetId !== null && window.turnstile) {
        try { window.turnstile.reset(widgetId); } catch (e) {}
      }
    }

    function ensureWidget() {
      if (widgetId !== null) return Promise.resolve();
      return Promise.all([getSiteKey(), loadTurnstileApi()]).then(function (pair) {
        var key = pair[0];
        widgetId = window.turnstile.render(host, {
          sitekey: key,
          size: "invisible",
          execution: "execute",
          appearance: "execute",
          callback: function () {
            if (tokenResolve) {
              var r = tokenResolve;
              tokenResolve = null;
              r();
            }
          },
          "error-callback": function () {
            if (tokenResolve) {
              var r = tokenResolve;
              tokenResolve = null;
              r(new Error("turnstile-error"));
            }
          }
        });
      });
    }

    function runChallenge() {
      return ensureWidget().then(function () {
        return new Promise(function (resolve, reject) {
          tokenResolve = function (err) {
            if (err) reject(err);
            else resolve();
          };
          try {
            window.turnstile.execute(widgetId);
          } catch (e) {
            tokenResolve = null;
            reject(e);
          }
        });
      });
    }

    function warmWidget() {
      ensureWidget().catch(function () {
        say(en
          ? "\u25cf Form protection failed to load \u2014 email biuro@sezmoo.com"
          : "\u25cf Nie uda\u0142o si\u0119 za\u0142adowa\u0107 ochrony formularza \u2014 napisz na biuro@sezmoo.com");
      });
    }

    f.addEventListener("focusin", function () {
      warmWidget();
      if (started) return;
      started = true;
      var meta = formMeta(f);
      dlPush({
        event: "form_start",
        form_id: meta.form_id,
        form_name: meta.form_name,
        form_lang: meta.form_lang
      });
    });
    /* Turnstile only on interaction — LH scroll would trip IntersectionObserver */

    f.addEventListener("submit", function (e) {
      e.preventDefault();
      validateNamePhone();
      if (!f.checkValidity()) {
        f.reportValidity();
        return;
      }
      setSending(true);

      var meta = formMeta(f);

      runChallenge()
        .then(function () {
          var endpoint = (window.__SEZMOO__ && window.__SEZMOO__.contactApiUrl);
          if (endpoint === undefined || endpoint === null) {
            endpoint = f.getAttribute("action") || "/api/contact";
          }
          // Empty string = staging / intentionally disabled (no CF Functions on GH Pages).
          if (!endpoint) {
            return Promise.reject(new Error(en
              ? "Contact form is disabled on this staging preview. Use production or wrangler pages dev."
              : "Formularz wyłączony na stagingu GH Pages. Użyj produkcji lub wrangler pages dev."));
          }
          return fetch(endpoint, {
            method: "POST",
            body: new FormData(f)
          });
        })
        .then(function (r) {
          return r.json().then(function (d) {
            return { httpOk: r.ok, data: d };
          }).catch(function () {
            return { httpOk: false, data: { ok: false, error: en ? "Invalid server response" : "Nieprawid\u0142owa odpowied\u017a serwera" } };
          });
        })
        .then(function (res) {
          var d = res.data || {};
          if (d && d.ok) {
            dlPush({
              event: "generate_lead",
              form_id: meta.form_id,
              form_name: meta.form_name,
              form_lang: meta.form_lang,
              form_need: meta.form_need
            });
            say(en
              ? "\u25cf Thank you \u2014 we\u2019ll get back to you within 24h."
              : "\u25cf Dzi\u0119kujemy \u2014 odezwiemy si\u0119 w ci\u0105gu 24h.");
            f.reset();
            started = false;
            resetWidget();
          } else {
            var err = d.error ? String(d.error) : "";
            dlPush({
              event: "form_submit_error",
              form_id: meta.form_id,
              form_name: meta.form_name,
              form_lang: meta.form_lang,
              form_need: meta.form_need,
              error_type: err ? "server" : "unknown"
            });
            if (en) {
              say("\u25cf " + (err || "Something went wrong") + " \u2014 email biuro@sezmoo.com");
            } else {
              say("\u25cf " + (err || "Co\u015b posz\u0142o nie tak") + " \u2014 napisz na biuro@sezmoo.com");
            }
            resetWidget();
          }
        })
        .catch(function (err) {
          dlPush({
            event: "form_submit_error",
            form_id: meta.form_id,
            form_name: meta.form_name,
            form_lang: meta.form_lang,
            form_need: meta.form_need,
            error_type: "network"
          });
          var detail = err && err.message ? String(err.message) : "";
          if (detail && /staging|wyłączony|disabled/i.test(detail)) {
            say("\u25cf " + detail);
          } else {
            say(en
              ? "\u25cf Something went wrong \u2014 email biuro@sezmoo.com"
              : "\u25cf Co\u015b posz\u0142o nie tak \u2014 napisz na biuro@sezmoo.com");
          }
          resetWidget();
        })
        .finally(function () {
          setSending(false);
        });
    });
  }

  forms.forEach(bindForm);
})();

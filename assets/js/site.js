/* 1Sources — progressive enhancement. No dependencies. */
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Sticky header shadow ---------- */
  var header = document.querySelector('.site-header');
  if (header) {
    var onScroll = function () {
      header.classList.toggle('is-stuck', window.scrollY > 8);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- Desktop mega menu ---------- */
  var navItems = Array.prototype.slice.call(document.querySelectorAll('.nav-item[data-mega]'));
  navItems.forEach(function (item) {
    var btn = item.querySelector('.nav-link');
    var panel = item.querySelector('.mega');
    if (!btn || !panel) return;
    var closeTimer;
    var open = function (state) {
      item.classList.toggle('is-open', state);
      btn.setAttribute('aria-expanded', state ? 'true' : 'false');
    };
    item.addEventListener('mouseenter', function () { clearTimeout(closeTimer); open(true); });
    item.addEventListener('mouseleave', function () { closeTimer = setTimeout(function () { open(false); }, 140); });
    btn.addEventListener('click', function (e) { e.preventDefault(); open(!item.classList.contains('is-open')); });
    item.addEventListener('keydown', function (e) { if (e.key === 'Escape') { open(false); btn.focus(); } });
    document.addEventListener('click', function (e) { if (!item.contains(e.target)) open(false); });
  });

  /* ---------- Mobile drawer ---------- */
  var burger = document.querySelector('.burger');
  var drawer = document.getElementById('mobile-drawer');
  if (burger && drawer) {
    var setDrawer = function (state) {
      drawer.classList.toggle('is-open', state);
      burger.setAttribute('aria-expanded', state ? 'true' : 'false');
      document.body.classList.toggle('no-scroll', state);
      drawer.setAttribute('aria-hidden', state ? 'false' : 'true');
    };
    burger.addEventListener('click', function () { setDrawer(!drawer.classList.contains('is-open')); });
    drawer.addEventListener('click', function (e) { if (e.target.closest('a')) setDrawer(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && drawer.classList.contains('is-open')) { setDrawer(false); burger.focus(); } });
    window.addEventListener('resize', function () { if (window.innerWidth >= 1040 && drawer.classList.contains('is-open')) setDrawer(false); });

    Array.prototype.forEach.call(drawer.querySelectorAll('.drawer__group[data-collapsible] > .drawer__link'), function (t) {
      t.addEventListener('click', function (e) {
        e.preventDefault();
        var g = t.parentNode;
        var isOpen = g.classList.toggle('is-open');
        t.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      });
    });
  }

  /* ---------- Accordion (FAQ) ---------- */
  // Collapse from the measured height to 0. rAF gives the browser a frame to
  // register the start value so the transition runs; the timeout guarantees the
  // panel reaches the closed state even if that frame never arrives (throttled
  // or backgrounded tab), so the visual state can never contradict aria-expanded.
  var collapse = function (panel) {
    panel.style.height = panel.scrollHeight + 'px';
    var shut = function () { panel.style.height = '0px'; };
    requestAnimationFrame(function () { requestAnimationFrame(shut); });
    setTimeout(shut, 60);
  };
  Array.prototype.forEach.call(document.querySelectorAll('.faq'), function (faq) {
    var btns = Array.prototype.slice.call(faq.querySelectorAll('.faq__btn'));
    btns.forEach(function (btn) {
      var panel = document.getElementById(btn.getAttribute('aria-controls'));
      if (!panel) return;
      btn.addEventListener('click', function () {
        var isOpen = btn.getAttribute('aria-expanded') === 'true';
        // close siblings
        btns.forEach(function (o) {
          if (o === btn) return;
          var op = document.getElementById(o.getAttribute('aria-controls'));
          if (op && o.getAttribute('aria-expanded') === 'true') {
            o.setAttribute('aria-expanded', 'false');
            collapse(op);
          }
        });
        if (isOpen) {
          btn.setAttribute('aria-expanded', 'false');
          collapse(panel);
        } else {
          btn.setAttribute('aria-expanded', 'true');
          panel.style.height = panel.scrollHeight + 'px';
          var settled = false;
          var toAuto = function () {
            if (settled) return;
            settled = true;
            if (btn.getAttribute('aria-expanded') === 'true') panel.style.height = 'auto';
            panel.removeEventListener('transitionend', onEnd);
          };
          var onEnd = function (e) { if (e.propertyName === 'height') toAuto(); };
          panel.addEventListener('transitionend', onEnd);
          // Guard: if the transition never fires (throttled rendering, reduced
          // motion, interrupted animation) release the fixed height anyway so
          // the panel can never clip its own content.
          setTimeout(toAuto, 500);
        }
      });
    });
  });

  /* ---------- Scroll reveal ---------- */
  var revealables = document.querySelectorAll('[data-reveal]');
  if (revealables.length) {
    if (reduce || !('IntersectionObserver' in window)) {
      Array.prototype.forEach.call(revealables, function (el) { el.classList.add('is-in'); });
    } else {
      var ro = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { en.target.classList.add('is-in'); ro.unobserve(en.target); }
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
      Array.prototype.forEach.call(revealables, function (el) { ro.observe(el); });
      // Safety net: if the observer never fires (hidden tab, odd viewport,
      // throttled rendering) show everything rather than leaving it invisible.
      setTimeout(function () {
        Array.prototype.forEach.call(revealables, function (el) { el.classList.add('is-in'); });
      }, 2500);
    }
  }

  /* ---------- Count-up stats ----------
     The final value is already in the markup, so the number is correct with JS
     disabled, with rAF throttled (background tab), or if the animation is
     interrupted. The animation only ever counts *up to* that value. */
  var counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    var fmt = function (v, el) {
      var dec = parseInt(el.getAttribute('data-decimals') || '0', 10);
      return Number(v.toFixed(dec)).toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec });
    };
    var settle = function (el, target) {
      el.textContent = fmt(target, el);
      el.setAttribute('data-done', '');
    };
    var run = function (el) {
      var target = parseFloat(el.getAttribute('data-count'));
      if (isNaN(target) || el.hasAttribute('data-done')) return;
      if (reduce || document.hidden) { settle(el, target); return; }
      var dur = 1150, t0 = null, done = false;
      // Safety net: whatever happens to rAF, the true number is shown.
      var guard = setTimeout(function () { if (!done) { done = true; settle(el, target); } }, dur + 400);
      var step = function (ts) {
        if (done) return;
        if (t0 === null) t0 = ts;
        var p = Math.min((ts - t0) / dur, 1);
        el.textContent = fmt(target * (1 - Math.pow(1 - p, 3)), el);
        if (p < 1) { requestAnimationFrame(step); }
        else { done = true; clearTimeout(guard); settle(el, target); }
      };
      requestAnimationFrame(step);
    };
    if (!('IntersectionObserver' in window)) {
      Array.prototype.forEach.call(counters, function (el) { settle(el, parseFloat(el.getAttribute('data-count'))); });
    } else {
      var co = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { if (en.isIntersecting) { run(en.target); co.unobserve(en.target); } });
      }, { threshold: 0.5 });
      Array.prototype.forEach.call(counters, function (el) {
        el.setAttribute('data-final', el.textContent);
        co.observe(el);
      });
    }
  }

  /* ---------- Marquee: duplicate track for seamless loop ---------- */
  var track = document.querySelector('.brands__track');
  if (track && !reduce && !track.hasAttribute('data-cloned')) {
    track.setAttribute('data-cloned', '');
    var clone = track.innerHTML;
    track.innerHTML = clone + clone;
    Array.prototype.forEach.call(track.querySelectorAll('img'), function (img, i) {
      if (i >= track.children.length / 2) img.setAttribute('aria-hidden', 'true');
    });
  }

  /* ---------- Form validation + submit ---------- */
  Array.prototype.forEach.call(document.querySelectorAll('form[data-validate]'), function (form) {
    var status = form.querySelector('.form__status');
    var setErr = function (field, msg) {
      var wrap = field.closest('.field');
      if (!wrap) return;
      wrap.classList.add('is-invalid');
      var e = wrap.querySelector('.field__err');
      if (e && msg) e.textContent = msg;
      field.setAttribute('aria-invalid', 'true');
    };
    var clearErr = function (field) {
      var wrap = field.closest('.field');
      if (wrap) wrap.classList.remove('is-invalid');
      field.removeAttribute('aria-invalid');
    };
    Array.prototype.forEach.call(form.querySelectorAll('input,select,textarea'), function (f) {
      f.addEventListener('input', function () { clearErr(f); });
      f.addEventListener('blur', function () { if (f.value.trim() && !f.checkValidity()) setErr(f, f.validationMessage); });
    });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var firstBad = null;
      Array.prototype.forEach.call(form.querySelectorAll('input,select,textarea'), function (f) {
        clearErr(f);
        if (!f.checkValidity()) { setErr(f, f.validationMessage); if (!firstBad) firstBad = f; }
      });
      if (firstBad) { firstBad.focus(); return; }
      if (status) {
        status.className = 'form__status is-ok';
        status.textContent = 'Thank you — your enquiry has been received. A member of our team will respond within one business day.';
        status.setAttribute('role', 'status');
      }
      form.reset();
    });
  });

  /* ---------- Mark current year ---------- */
  Array.prototype.forEach.call(document.querySelectorAll('[data-year]'), function (el) {
    el.textContent = new Date().getFullYear();
  });
})();

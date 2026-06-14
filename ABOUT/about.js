/* ============================================================
   THE Ceylon Crumbs – about.js 
   ============================================================ */
(function () {
  "use strict";

  /* ── Sticky Header ── */
  function initStickyHeader() {
    var header = document.getElementById("header");
    if (!header) return;
    window.addEventListener("scroll", function () {
      header.classList.toggle("stuck", window.scrollY > 90);
    });
  }


  /* ── Animated Number Counters ── */
  function animateCounter(el, target, duration) {
    var start     = 0;
    var startTime = null;
    var suffix    = el.dataset.suffix || "";

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var eased    = progress < 0.5 ? 2 * progress * progress : -1 + (4 - 2 * progress) * progress;
      el.textContent = Math.floor(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  function initCounters() {
    var counters = document.querySelectorAll(".stat-number[data-target]");
    if (!counters.length) return;

    var observed = false;
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !observed) {
          observed = true;
          counters.forEach(function (el) {
            var target = parseInt(el.dataset.target, 10);
            animateCounter(el, target, 1800);
          });
        }
      });
    }, { threshold: 0.3 });

    counters.forEach(function (c) { observer.observe(c); });
  }

  /* ── Fade-in sections on scroll ── */
  function initScrollReveal() {
    var targets = document.querySelectorAll(".about-story, .values-section, .stats-strip, .about-cta");
    targets.forEach(function (el) {
      el.style.opacity    = "0";
      el.style.transform  = "translateY(24px)";
      el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    });

    function check() {
      targets.forEach(function (el) {
        if (el.getBoundingClientRect().top < window.innerHeight - 80) {
          el.style.opacity   = "1";
          el.style.transform = "translateY(0)";
        }
      });
    }
    window.addEventListener("scroll", check);
    check();
  }

  /* ── Init ── */
  document.addEventListener("DOMContentLoaded", function () {
    initStickyHeader();
    initMobileMenu();
    initCounters();
    initScrollReveal();
  });
})();

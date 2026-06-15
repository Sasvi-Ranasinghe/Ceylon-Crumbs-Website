/* ============================================================
   THE Ceylon Crumbs – outlets.js  (Outlets Page)
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

  /* ── Hero Slider ── */
function initSlider() {
  var wrapper = document.getElementById('outlets-hero');
  if (!wrapper) return;

  var track   = wrapper.querySelector('.hero-slides');
  if (!track) return;

  var dots    = wrapper.querySelectorAll('.slider-dot');
  var slides  = track.querySelectorAll('.hero-slide');
  var total   = slides.length;
  var current = 0;
  var autoplay;

  function goTo(n) {
    current = (n + total) % total;
    track.style.transform = 'translateX(-' + (current * 100) + '%)';
    dots.forEach(function(d, i) { d.classList.toggle('active', i === current); });
  }

  function resetAuto() {
    clearInterval(autoplay);
    autoplay = setInterval(function() { goTo(current + 1); }, 5000);
  }

  var prevBtn = wrapper.querySelector('.slider-arrow.prev');
  var nextBtn = wrapper.querySelector('.slider-arrow.next');
  if (prevBtn) prevBtn.addEventListener('click', function() { goTo(current - 1); resetAuto(); });
  if (nextBtn) nextBtn.addEventListener('click', function() { goTo(current + 1); resetAuto(); });

  dots.forEach(function(dot, i) {
    dot.addEventListener('click', function() { goTo(i); resetAuto(); });
  });

    document.querySelectorAll(".outlet-card:not(.coming-soon)").forEach(function (card) {
      var h3 = card.querySelector("h3");
      if (!h3) return;
      var name = h3.textContent.replace(/[^a-zA-Z ]/g, "").trim();

      // Find matching key
      var query = null;
      Object.keys(outlets).forEach(function (key) {
        if (name.toLowerCase().indexOf(key.toLowerCase().split(" ")[0]) > -1) {
          query = outlets[key];
        }
      });

      if (query) {
        var link = document.createElement("a");
        link.href   = "https://www.google.com/maps/search/?api=1&query=" + query;
        link.target = "_blank";
        link.rel    = "noopener";
        link.textContent = "📍 Get Directions";
        link.style.cssText = "display:inline-block;margin-top:12px;font-size:13px;color:#d7a06c;font-weight:600;";
        card.appendChild(link);
      }
    });
  }

  /* ── Highlight open outlets by current time ── */
  function initOpenNow() {
    var now  = new Date();
    var day  = now.getDay();  // 0=Sun,6=Sat
    var hour = now.getHours();

    document.querySelectorAll(".outlet-card:not(.coming-soon)").forEach(function (card) {
      var isOpen = false;
      if (day >= 1 && day <= 6 && hour >= 8 && hour < 20) isOpen = true;  // Mon-Sat
      if (day === 0 && hour >= 9 && hour < 18) isOpen = true;              // Sunday (some outlets)

      var badge = document.createElement("span");
      badge.textContent = isOpen ? "● Open Now" : "● Closed";
      badge.style.cssText = "font-size:12px; font-weight:700; color:" + (isOpen ? "#627D47" : "#b20000") + "; float:right; margin-top:2px;";
      var h3 = card.querySelector("h3");
      if (h3) h3.appendChild(badge);
    });
  }

  /* ── Init ── */  
  document.addEventListener("DOMContentLoaded", function () {

    initStickyHeader();

    if (typeof initMobileMenu === "function") {
        initMobileMenu();
    }

    if (typeof initDirectionLinks === "function") {
        initDirectionLinks();
    }

    initOpenNow();
    initSlider();

  });

})();
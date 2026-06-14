/* ============================================================
   Ceylon Crumbs – contact.js (Optimized to match CSS)
============================================================ */
(function () {
  "use strict";

  /* ── Sticky Header ── */
  function initStickyHeader() {
    var header = document.getElementById("header");
    if (!header) return;

    window.addEventListener("scroll", function () {
      header.classList.toggle("stuck", window.scrollY > 80);
    });
  }

  /* ── Form Validation helpers ── */
  function showError(field, msg) {
    field.classList.add("error");

    var existing = field.parentElement.querySelector(".field-error");
    if (!existing) {
      var span = document.createElement("span");
      span.className = "field-error";
      span.textContent = msg;
      field.parentElement.appendChild(span);
    }
  }

  function clearError(field) {
    field.classList.remove("error");

    var err = field.parentElement.querySelector(".field-error");
    if (err) err.remove();
  }

  function validateEmail(val) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  }

  /* ── Contact Form ── */
  function initContactForm() {
    var form = document.getElementById("contactForm");
    var success = document.getElementById("formSuccess");
    if (!form) return;

    var btn = form.querySelector(".submit-btn");

    /* Live validation */
    form.querySelectorAll("input, select, textarea").forEach(function (field) {
      field.addEventListener("blur", function () {
        validateField(field);
      });

      field.addEventListener("input", function () {
        if (field.classList.contains("error")) {
          clearError(field);
        }
      });
    });

    function validateField(field) {
      clearError(field);

      if (field.required && !field.value.trim()) {
        showError(field, "This field is required");
        return false;
      }

      if (field.type === "email" && field.value && !validateEmail(field.value)) {
        showError(field, "Enter a valid email");
        return false;
      }

      return true;
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var valid = true;

      form.querySelectorAll("[required]").forEach(function (field) {
        if (!validateField(field)) valid = false;
      });

      if (!valid) return;

      /* Button loading state (matches your CSS style) */
      btn.innerHTML = "Sending...";
      btn.disabled = true;
      btn.style.opacity = "0.6";

      /* Fake submit */
      setTimeout(function () {
        form.reset();
        form.style.display = "none";
        success.style.display = "block";

        success.scrollIntoView({
          behavior: "smooth",
          block: "center"
        });

        /* Restore button */
        btn.innerHTML = "Send Message";
        btn.disabled = false;
        btn.style.opacity = "1";
      }, 1000);
    });
  }

  /* ── Character Counter (Styled to match CSS) ── */
  function initCharCounter() {
    var textarea = document.getElementById("message");
    if (!textarea) return;

    var counter = document.createElement("span");
    counter.className = "char-counter"; // cleaner (can style in CSS)
    counter.style.cssText =
      "font-size:12px;color:var(--warm-grey);display:block;text-align:right;margin-top:4px;";

    counter.textContent = "0 / 1000";

    textarea.parentElement.appendChild(counter);

    textarea.addEventListener("input", function () {
      var len = textarea.value.length;

      counter.textContent = len + " / 1000";

      counter.style.color = len > 900 ? "#b20000" : "var(--warm-grey)";

      if (len > 1000) {
        textarea.value = textarea.value.substring(0, 1000);
      }
    });
  }

  /* ── SAFE Init (fix missing function error) ── */
  document.addEventListener("DOMContentLoaded", function () {
    initStickyHeader();

    if (typeof initMobileMenu === "function") {
      initMobileMenu(); // prevents JS crash if missing
    }

    initContactForm();
    initCharCounter();
  });
})();
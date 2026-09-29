/*
 * theme.js
 * Small, dependency-free script covering:
 *   1. Dark/light theme toggle, persisted in localStorage
 *   2. Smooth scrolling for in-page nav links
 *   3. Mobile nav (hamburger) open/close
 *   4. Scroll-reveal animation for sections (IntersectionObserver)
 *   5. Active nav-link highlighting as sections come into view
 *   6. Subtle 3D tilt-on-hover for project cards
 */

(function () {
  "use strict";

  var STORAGE_KEY = "theme"; // localStorage key; value is "dark" or "light"
  var root = document.documentElement;

  /* ------------------------------------------------------------------ *
   * 1. Theme toggle + persistence
   *    Dark is the default: if nothing is stored yet, we stay on the
   *    "dark" markup already set on <html> rather than reading OS
   *    preference, per "make dark mode the default".
   * ------------------------------------------------------------------ */

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    var toggle = document.getElementById("themeToggle");
    if (toggle) {
      toggle.setAttribute(
        "aria-label",
        theme === "dark" ? "Switch to light theme" : "Switch to dark theme"
      );
    }
  }

  function initTheme() {
    var stored = null;
    try {
      stored = localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      // localStorage can throw in private-browsing/sandboxed contexts; fall
      // back to the dark default already on the page.
    }
    applyTheme(stored === "light" ? "light" : "dark");
  }

  function toggleTheme() {
    var current = root.getAttribute("data-theme") === "light" ? "light" : "dark";
    var next = current === "dark" ? "light" : "dark";
    applyTheme(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch (e) {
      // Ignore write failures (e.g. storage disabled) — theme still applies
      // for the current page view, it just won't persist.
    }
  }

  /* ------------------------------------------------------------------ *
   * 2. Smooth scrolling for nav links
   *    CSS already sets scroll-behavior: smooth, but we handle clicks
   *    ourselves so we can close the mobile menu at the same time.
   * ------------------------------------------------------------------ */

  function initSmoothScroll() {
    var links = document.querySelectorAll('a[href^="#"]');
    links.forEach(function (link) {
      link.addEventListener("click", function (event) {
        var id = link.getAttribute("href").slice(1);
        var target = document.getElementById(id);
        if (!target) return;
        event.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        closeMobileNav();
        history.pushState(null, "", "#" + id);
      });
    });
  }

  /* ------------------------------------------------------------------ *
   * 3. Mobile nav toggle
   * ------------------------------------------------------------------ */

  var navLinks = null;
  var navToggle = null;

  function closeMobileNav() {
    if (!navLinks || !navToggle) return;
    navLinks.classList.remove("open");
    navToggle.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  }

  function initMobileNav() {
    navLinks = document.getElementById("navLinks");
    navToggle = document.getElementById("navToggle");
    if (!navLinks || !navToggle) return;

    navToggle.addEventListener("click", function () {
      var isOpen = navLinks.classList.toggle("open");
      navToggle.classList.toggle("open", isOpen);
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });
  }

  /* ------------------------------------------------------------------ *
   * 4 & 5. Scroll-reveal + active nav-link tracking
   *    One IntersectionObserver drives both: revealing .reveal elements
   *    as they enter the viewport, and marking the matching nav link
   *    active while its section is the one in view.
   * ------------------------------------------------------------------ */

  function initScrollEffects() {
    var revealEls = document.querySelectorAll(".reveal");
    var navAnchors = document.querySelectorAll(".nav-link");

    if (!("IntersectionObserver" in window)) {
      // No observer support: just show everything, skip the animation.
      revealEls.forEach(function (el) { el.classList.add("in-view"); });
      return;
    }

    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealEls.forEach(function (el) { revealObserver.observe(el); });

    var sectionObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var id = entry.target.id;
          navAnchors.forEach(function (a) {
            a.classList.toggle("active", a.getAttribute("href") === "#" + id);
          });
        });
      },
      { rootMargin: "-50% 0px -50% 0px" } // fires when a section crosses the viewport's vertical center
    );
    document.querySelectorAll("main section[id]").forEach(function (section) {
      sectionObserver.observe(section);
    });
  }

  /* ------------------------------------------------------------------ *
   * 6. Project card hover tilt
   *    Rotates each card slightly toward the cursor for a subtle
   *    "engineering HUD" feel. Resets smoothly on mouse leave.
   * ------------------------------------------------------------------ */

  function initCardTilt() {
    var cards = document.querySelectorAll(".project-card");
    var MAX_TILT = 6; // degrees

    cards.forEach(function (card) {
      card.addEventListener("mousemove", function (event) {
        var rect = card.getBoundingClientRect();
        var x = (event.clientX - rect.left) / rect.width;  // 0..1
        var y = (event.clientY - rect.top) / rect.height;  // 0..1
        var rotateY = (x - 0.5) * MAX_TILT * 2;
        var rotateX = (0.5 - y) * MAX_TILT * 2;
        card.style.transform =
          "perspective(600px) rotateX(" + rotateX + "deg) rotateY(" + rotateY + "deg) translateY(-4px)";
      });

      card.addEventListener("mouseleave", function () {
        card.style.transform = "";
      });
    });
  }

  /* ------------------------------------------------------------------ *
   * Init
   * ------------------------------------------------------------------ */

  document.addEventListener("DOMContentLoaded", function () {
    initTheme();
    initSmoothScroll();
    initMobileNav();
    initScrollEffects();
    initCardTilt();

    var themeToggle = document.getElementById("themeToggle");
    if (themeToggle) themeToggle.addEventListener("click", toggleTheme);

    var yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());
  });
})();

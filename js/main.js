/* ==========================================================================
   Vectra Studios — main.js
   Navbar, parallax, scroll reveal, toasts, page loader, Discord injection.
   Loaded on every page. Depends on js/config.js (window.VECTRA_CONFIG).
   ========================================================================== */
(function () {
  "use strict";
  const CFG = window.VECTRA_CONFIG || {};

  /* ---------- Page loader ---------- */
  window.addEventListener("load", function () {
    const loader = document.querySelector(".page-loader");
    if (loader) {
      setTimeout(() => loader.classList.add("gone"), 250);
      setTimeout(() => loader && loader.remove(), 900);
    }
  });

  /* ---------- Discord link injection ---------- */
  function injectDiscord() {
    if (!CFG.discord || !CFG.discord.url) return;
    document.querySelectorAll("[data-discord]").forEach((el) => {
      el.setAttribute("href", CFG.discord.url);
      el.setAttribute("target", "_blank");
      el.setAttribute("rel", "noopener noreferrer");
    });
    document.querySelectorAll("[data-discord-code]").forEach((el) => {
      el.textContent = CFG.discord.inviteCode || "";
    });

    // Live Discord widget — replaces the placeholder body with an iframe
    // pointing at Discord's public widget endpoint for the configured server.
    // NOTE: the widget only renders if "Enable Server Widget" is turned on in
    // Discord Server Settings → Widget. If disabled, the iframe stays blank,
    // so we probe the widget.json API and fall back to a join prompt.
    const widgetId = CFG.discord.widgetId;
    const widgetBody = document.getElementById("discord-widget-body");
    if (widgetId && widgetBody) {
      // Probe the public widget API to see if the widget is enabled.
      fetch(
        "https://discord.com/api/guilds/" +
          encodeURIComponent(widgetId) +
          "/widget.json"
      )
        .then(function (r) {
          if (!r.ok) throw new Error("widget disabled");
          return r.json();
        })
        .then(function (data) {
          // Widget is enabled — embed the live iframe.
          const iframe = document.createElement("iframe");
          iframe.src =
            "https://discord.com/widget?id=" +
            encodeURIComponent(widgetId) +
            "&theme=dark";
          iframe.title = "Vectra Studios Discord";
          iframe.setAttribute("loading", "lazy");
          iframe.setAttribute("allowtransparency", "true");
          iframe.setAttribute(
            "sandbox",
            "allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
          );
          iframe.style.width = "100%";
          iframe.style.height = "320px";
          iframe.style.border = "0";
          iframe.style.borderRadius = "0 0 14px 14px";
          iframe.style.display = "block";
          widgetBody.replaceChildren(iframe);
        })
        .catch(function () {
          // Widget disabled or unreachable — show a friendly fallback.
          const name = (CFG.name || "Vectra Studios");
          const fallback = document.createElement("div");
          fallback.style.padding = "8px 4px";
          fallback.innerHTML =
            '<p class="mb-4">The Discord widget needs to be enabled in server settings. ' +
            "In the meantime, you're welcome to join directly.</p>" +
            '<a class="btn btn-primary btn-sm" href="' +
            CFG.discord.url +
            '" target="_blank" rel="noopener noreferrer">Join ' +
            name +
            " on Discord</a>";
          widgetBody.replaceChildren(fallback);
        });
    }
  }

  /* ---------- Navbar behaviour ---------- */
  function initNavbar() {
    const nav = document.querySelector(".navbar");
    const toggle = document.querySelector(".nav-toggle");
    const collapsible = document.querySelector(".nav-collapsible");

    if (nav) {
      const onScroll = () =>
        nav.classList.toggle("scrolled", window.scrollY > 12);
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
    }

    if (toggle && collapsible) {
      toggle.addEventListener("click", () => {
        const open = collapsible.classList.toggle("open");
        toggle.classList.toggle("open", open);
        toggle.setAttribute("aria-expanded", String(open));
      });
      // close on link/action click (mobile)
      collapsible.querySelectorAll("a, button").forEach((a) =>
        a.addEventListener("click", () => {
          collapsible.classList.remove("open");
          toggle.classList.remove("open");
          toggle.setAttribute("aria-expanded", "false");
        })
      );
    }

    // active link
    const here = location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".nav-links a").forEach((a) => {
      const href = a.getAttribute("href");
      if (href === here) a.classList.add("active");
    });
  }

  /* ---------- Hero parallax ---------- */
  function initParallax() {
    const bg = document.querySelector(".hero-bg");
    if (!bg) return;
    const hero = document.querySelector(".hero");
    let ticking = false;
    const update = () => {
      const rect = hero.getBoundingClientRect();
      const progress = Math.min(Math.max(-rect.top / (rect.height || 1), 0), 1);
      bg.style.transform = `translate3d(0, ${progress * 80}px, 0) scale(${
        1 + progress * 0.06
      })`;
      ticking = false;
    };
    window.addEventListener(
      "scroll",
      () => {
        if (!ticking) {
          window.requestAnimationFrame(update);
          ticking = true;
        }
      },
      { passive: true }
    );
    update();
  }

  /* ---------- Scroll reveal ---------- */
  let revealObserver = null;
  function makeRevealObserver() {
    if (!("IntersectionObserver" in window)) return null;
    return new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const delay = entry.target.getAttribute("data-reveal-delay");
            if (delay) entry.target.style.setProperty("--reveal-delay", delay);
            entry.target.classList.add("in");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
  }
  function initReveal() {
    const els = document.querySelectorAll("[data-reveal]");
    if (!els.length) return;
    if (!("IntersectionObserver" in window)) {
      els.forEach((e) => e.classList.add("in"));
      return;
    }
    if (!revealObserver) revealObserver = makeRevealObserver();
    els.forEach((el) => revealObserver.observe(el));
  }
  // Expose so other scripts (staff.js, projects.js) can observe elements
  // they render after DOMContentLoaded.
  window.VectraReveal = function (el) {
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      el.classList.add("in");
      return;
    }
    if (!revealObserver) revealObserver = makeRevealObserver();
    revealObserver.observe(el);
  };
  window.VectraRevealInit = initReveal;

  /* ---------- Footer year ---------- */
  function initYear() {
    document.querySelectorAll("[data-year]").forEach((el) => {
      el.textContent = new Date().getFullYear();
    });
  }

  /* ---------- Toast system ---------- */
  function ensureToastWrap() {
    let wrap = document.querySelector(".toast-wrap");
    if (!wrap) {
      wrap = document.createElement("div");
      wrap.className = "toast-wrap";
      document.body.appendChild(wrap);
    }
    return wrap;
  }
  const ICONS = {
    success:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
    error:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
    info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>',
  };
  window.showToast = function (message, type = "info", duration = 3600) {
    const wrap = ensureToastWrap();
    const t = document.createElement("div");
    t.className = `toast ${type}`;
    t.innerHTML = `${ICONS[type] || ICONS.info}<span>${message}</span>`;
    wrap.appendChild(t);
    const remove = () => {
      t.classList.add("leaving");
      setTimeout(() => t.remove(), 320);
    };
    t.addEventListener("click", remove);
    setTimeout(remove, duration);
  };

  /* ---------- Smooth anchor scrolling (in-page) ---------- */
  function initAnchors() {
    document.querySelectorAll('a[href^="#"]').forEach((a) => {
      a.addEventListener("click", (e) => {
        const id = a.getAttribute("href");
        if (id.length < 2) return;
        const target = document.querySelector(id);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
    });
  }

  function escapeHtml(s) {
    return String(s).replace(
      /[&<>"']/g,
      (c) =>
        ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[
          c
        ])
    );
  }

  /* ---------- Init ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    injectDiscord();
    initNavbar();
    initParallax();
    initReveal();
    initYear();
    initAnchors();
  });

  // expose for other scripts
  window.VectraUI = { escapeHtml };
})();

/* ==========================================================================
   Vectra Studios — projects.js
   Project showcase: data, rendering, category filtering, search.
   Renders into #proj-grid (if present) on projects.html.
   ========================================================================== */
(function () {
  "use strict";

  const CATEGORIES = [
    { id: "all", label: "All" },
    { id: "plugins", label: "Plugins" },
    { id: "opensource", label: "Open Source" },
  ];

  const STATUS = {
    development: { label: "In Development", cls: "badge-warn" },
    active: { label: "Active", cls: "badge-success" },
    maintenance: { label: "Maintenance", cls: "badge-warn" },
  };

  const PROJECTS = [
    {
      id: "cpvpwars",
      name: "CPvPWars",
      category: "plugins",
      categoryLabel: "Paper Plugin",
      status: "development",
      edition: "Java",
      description:
        "A Paper plugin that brings CPvP and Bedwars together into a single minigame. Built for Paper servers looking for a compact competitive mode without running two separate setups.",
      features: ["CPvP combat", "Bedwars mechanics", "Single minigame", "Paper 1.21+"],
      github: "https://github.com/vectrastudios",
    },
    {
      id: "vectracore",
      name: "VectraCore",
      category: "opensource",
      categoryLabel: "Open Source · Bedrock",
      status: "development",
      edition: "Bedrock",
      image: "assets/projects/vectracore.png",
      description:
        "An open-source Minecraft Bedrock PVP practice core for PocketMine-MP. Aiming to be the closest practice experience to Zeqa s9, built to be readable and extendable.",
      features: ["PocketMine-MP", "Open source", "PVP practice", "Zeqa s9 inspired"],
      github: "https://github.com/vectrastudios",
    },
    {
      id: "aeriscore",
      name: "AerisCore",
      category: "plugins",
      categoryLabel: "Paper Plugin",
      status: "development",
      edition: "Java",
      description:
        "A Minecraft Java Edition PVP practice core for Paper. Provides the practice gamemodes and match flow a competitive PVP server needs, written to stay maintainable as it grows.",
      features: ["Paper / Spigot", "PVP practice", "Match flow", "Java Edition"],
      github: "https://github.com/vectrastudios",
    },
  ];

  /* ---------- icons ---------- */
  const ICONS = {
    github:
      '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .5A11.5 11.5 0 0 0 .5 12 11.5 11.5 0 0 0 8.4 23c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.3-1.7-1.3-1.7-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-6 0-1.3.5-2.4 1.2-3.2 0-.4-.5-1.6.2-3.2 0 0 1-.3 3.3 1.2a11 11 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.7 1.6.2 2.8.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 6 .4.3.8 1 .8 2.1v3.1c0 .3.2.7.8.6A11.5 11.5 0 0 0 23.5 12 11.5 11.5 0 0 0 12 .5Z"/></svg>',
    arrow:
      '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>',
    code:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>',
    empty:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
  };

  function escapeHtml(s) {
    return String(s).replace(
      /[&<>"']/g,
      (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
    );
  }

  function recordView(p) {
    // No-op now that the auth system has been removed. Kept as a hook so the
    // rest of the render code doesn't need to change if tracking is added
    // back later.
  }

  /* ---------- render ---------- */
  let state = { filter: "all", query: "" };

  function render() {
    const grid = document.getElementById("proj-grid");
    if (!grid) return;
    const q = state.query.trim().toLowerCase();
    const list = PROJECTS.filter((p) => {
      if (state.filter !== "all" && p.category !== state.filter) return false;
      if (q) {
        const hay = (p.name + " " + p.description + " " + p.categoryLabel).toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    grid.innerHTML = "";
    if (!list.length) {
      const empty = document.createElement("div");
      empty.className = "no-results";
      empty.innerHTML = `${ICONS.empty}<h3>No projects found</h3><p>Try a different filter or search term.</p>`;
      grid.appendChild(empty);
      return;
    }
    list.forEach((p, i) => {
      const st = STATUS[p.status] || STATUS.development;
      const card = document.createElement("article");
      card.className = "card proj-card card-glow";
      card.setAttribute("data-reveal", "scale");
      card.setAttribute("data-reveal-delay", (i * 0.05) + "s");
      const thumb = p.image
        ? `<div class="proj-thumb"><img src="${p.image}" alt="${escapeHtml(p.name)} screenshot" loading="lazy"></div>`
        : `<div class="proj-thumb proj-placeholder">
            <div class="ph-inner">
              ${ICONS.code}
              <span class="ph-name mono">${escapeHtml(p.name)}</span>
              <span class="ph-edition mono">${escapeHtml(p.edition || "")}</span>
            </div>
          </div>`;
      card.innerHTML = `
        ${thumb}
        <div class="proj-body">
          <div class="cat-row">
            <span class="badge">${escapeHtml(p.categoryLabel)}</span>
            <span class="badge ${st.cls} badge-dot">${escapeHtml(st.label)}</span>
          </div>
          <h3>${escapeHtml(p.name)}</h3>
          <p>${escapeHtml(p.description)}</p>
          <div class="proj-links">
            <a class="btn btn-ghost btn-sm" href="${p.github}" target="_blank" rel="noopener noreferrer">${ICONS.github} GitHub</a>
            <button class="btn btn-outline btn-sm learn-more">${ICONS.arrow} Learn More</button>
          </div>
        </div>`;
      card.querySelector(".learn-more").addEventListener("click", () => {
        recordView(p);
        openProjectModal(p);
      });
      grid.appendChild(card);
    });

    if (window.IntersectionObserver) {
      grid.querySelectorAll("[data-reveal]").forEach((el) => {
        // register with the shared reveal observer if available, otherwise
        // reveal immediately
        if (window.VectraReveal) window.VectraReveal(el);
        else requestAnimationFrame(() => el.classList.add("in"));
      });
    }
  }

  function openProjectModal(p) {
    let backdrop = document.getElementById("proj-modal");
    if (!backdrop) {
      backdrop = document.createElement("div");
      backdrop.className = "modal-backdrop";
      backdrop.id = "proj-modal";
      backdrop.innerHTML = `
        <div class="modal" role="dialog" aria-modal="true" style="max-width:620px">
          <div class="modal-banner" style="height:0;background:none;border:0">
            <button class="modal-close" aria-label="Close"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
          </div>
          <div class="modal-body" id="proj-modal-body"></div>
        </div>`;
      document.body.appendChild(backdrop);
      backdrop.addEventListener("click", (e) => {
        if (e.target === backdrop) closeProjModal(backdrop);
      });
      backdrop.querySelector(".modal-close").addEventListener("click", () => closeProjModal(backdrop));
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") closeProjModal(backdrop);
      });
    }
    const st = STATUS[p.status] || STATUS.development;
    const body = backdrop.querySelector("#proj-modal-body");
    const headThumb = p.image
      ? `<img src="${p.image}" alt="${escapeHtml(p.name)}" style="width:64px;height:64px;border-radius:12px;flex:none;object-fit:cover">`
      : `<div class="proj-thumb proj-placeholder" style="width:64px;height:64px;border-radius:12px;flex:none">
          <div class="ph-inner">${ICONS.code}<span class="ph-name mono" style="font-size:.7rem">${escapeHtml(p.name)}</span></div>
        </div>`;
    body.innerHTML = `
      <div class="proj-modal-head" style="display:flex;align-items:center;gap:14px;margin-bottom:18px">
        ${headThumb}
        <div>
          <div class="flex gap-2" style="align-items:center;gap:8px;margin-bottom:4px">
            <h3 style="margin:0">${escapeHtml(p.name)}</h3>
            <span class="badge ${st.cls} badge-dot">${escapeHtml(st.label)}</span>
          </div>
          <div class="text-dim mono" style="font-size:.82rem">${escapeHtml(p.categoryLabel)} · ${escapeHtml(p.edition || "")} Edition</div>
        </div>
      </div>
      <p class="mb-6">${escapeHtml(p.description)}</p>
      <h4 class="mb-4" style="font-size:.95rem">Details</h4>
      <div class="svc-features" style="margin-bottom:22px">
        ${p.features.map((f) => `<li><span>${escapeHtml(f)}</span></li>`).join("")}
      </div>
      <div class="flex gap-3">
        <a class="btn btn-primary btn-sm" href="${p.github}" target="_blank" rel="noopener noreferrer">${ICONS.github} View on GitHub</a>
        <a class="btn btn-ghost btn-sm" data-discord href="#">Discuss on Discord</a>
      </div>`;
    if (window.VECTRA_CONFIG && window.VECTRA_CONFIG.discord) {
      const dl = body.querySelector("[data-discord]");
      dl.href = window.VECTRA_CONFIG.discord.url;
      dl.target = "_blank";
    }
    requestAnimationFrame(() => backdrop.classList.add("open"));
    document.body.style.overflow = "hidden";
  }
  function closeProjModal(backdrop) {
    backdrop.classList.remove("open");
    document.body.style.overflow = "";
  }

  /* ---------- init ---------- */
  function init() {
    render();
    const filterBar = document.getElementById("proj-filters");
    if (filterBar) {
      CATEGORIES.forEach((c) => {
        const b = document.createElement("button");
        b.className = "filter-btn" + (c.id === "all" ? " active" : "");
        b.textContent = c.label;
        b.dataset.cat = c.id;
        b.addEventListener("click", () => {
          state.filter = c.id;
          filterBar.querySelectorAll(".filter-btn").forEach((x) => x.classList.remove("active"));
          b.classList.add("active");
          render();
        });
        filterBar.appendChild(b);
      });
    }
    const search = document.getElementById("proj-search");
    if (search) {
      search.addEventListener("input", (e) => {
        state.query = e.target.value;
        render();
      });
    }
  }

  window.VectraProjects = { PROJECTS, render };
  document.addEventListener("DOMContentLoaded", init);
})();

/* ==========================================================================
   Vectra Studios — staff.js
   Minecraft skin renderer + staff cards + staff detail modal.

   SKIN RENDERER
   - Loads a raw Minecraft skin PNG (64x64 modern or 64x32 classic).
   - Crops the face region  UV (8,8) -> (16,16)  (8x8 pixels).
   - Scales it up with nearest-neighbour (pixelated) and draws to a canvas.
   - No manual avatar creation required.

   Adding staff: drop a <id>.png into assets/staff/ and add an entry below.
   ========================================================================== */
(function () {
  "use strict";

  /* ----------------------------------------------------------------------
     Staff data — edit freely.
       `skin`  : filename of the Minecraft skin in assets/staff/
       `id`    : stable identifier used for keys/refs
     The face is cropped automatically from each skin file.
     ---------------------------------------------------------------------- */
  const STAFF = [
    {
      id: "g0ewq",
      name: "g0ewq",
      role: "Founder",
      skin: "g0ewq.png",
      bio: "g0ewq founded Vectra Studios in January 2026. Works on the Java-side cores and plugins, with a focus on Paper development and PVP practice systems.",
      joinDate: "January 6, 2026",
      skills: ["Java", "Paper / Spigot", "Plugin Architecture", "PVP Systems"],
      socials: [
        { label: "GitHub", icon: "github", url: "https://github.com/vectrastudios" },
        { label: "Discord", icon: "discord", url: "https://discord.com/users/1324343200533577731" },
      ],
      contact: "Direct message via Discord",
    },
    {
      id: "RealNosi",
      name: "RealNosi",
      role: "Director",
      skin: "RealNosi.webp",
      bio: "RealNosi co-founded Vectra Studios alongside g0ewq. Handles project direction, community and the Bedrock-side development.",
      joinDate: "January 6, 2026",
      skills: ["PocketMine-MP", "Bedrock Development", "Community", "Project Direction"],
      socials: [
        { label: "GitHub", icon: "github", url: "https://github.com/vectrastudios" },
        { label: "Discord", icon: "discord", url: "https://discord.com/users/1436912943169273906" },
      ],
      contact: "Direct message via Discord",
    },
    {
      id: "ABGxmer",
      name: "ABGxmer",
      role: "Support Team",
      skin: "ABGxmer.png",
      bio: "ABGxmer is part of the Vectra Studios support team. Helps community members with questions, troubleshooting and day-to-day issues in the Discord server.",
      joinDate: "January 6, 2026",
      skills: ["Community Support", "Troubleshooting", "Discord"],
      socials: [
        { label: "Discord", icon: "discord", url: "https://discord.com/users/1241802851601092761" },
      ],
      contact: "Direct message via Discord",
    },
    {
      id: "limit_xenn",
      name: "limit_xenn",
      role: "Support Team",
      skin: "limit_xenn.png",
      bio: "limit_xenn is part of the Vectra Studios support team. Assists community members and helps keep things running smoothly day to day.",
      joinDate: "January 6, 2026",
      skills: ["Community Support", "Troubleshooting", "Discord"],
      socials: [
        { label: "Discord", icon: "discord", url: "https://discord.com/users/1297478279137329152" },
      ],
      contact: "Direct message via Discord",
    },
  ];

  /* ----------------------------------------------------------------------
     Skin renderer
     ---------------------------------------------------------------------- */
  const FACE = { x: 8, y: 8, w: 8, h: 8 }; // head front UV
  const HAT = { x: 40, y: 8, w: 8, h: 8 }; // hat overlay UV

  /**
   * Render the face of a Minecraft skin into a target <canvas> or <img>.
   * @param {string} skinUrl  path to the skin PNG
   * @param {HTMLCanvasElement|HTMLImageElement} target
   * @param {number} size     output size in px (square)
   */
  function renderFace(skinUrl, target, size) {
    size = size || 128;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = function () {
      // Decide whether to draw the hat overlay (only if it has visible pixels)
      const w = img.naturalWidth || img.width;
      const h = img.naturalHeight || img.height;
      const isModern = h >= 64;

      // Create a working canvas at native skin resolution (8x8 face)
      const tmp = document.createElement("canvas");
      tmp.width = FACE.w;
      tmp.height = FACE.h;
      const tctx = tmp.getContext("2d");
      tctx.imageSmoothingEnabled = false;
      tctx.drawImage(img, FACE.x, FACE.y, FACE.w, FACE.h, 0, 0, FACE.w, FACE.h);

      // Hat overlay — sample to check for non-transparent pixels
      if (isModern) {
        const hatCanvas = document.createElement("canvas");
        hatCanvas.width = HAT.w;
        hatCanvas.height = HAT.h;
        const hctx = hatCanvas.getContext("2d");
        hctx.imageSmoothingEnabled = false;
        hctx.drawImage(img, HAT.x, HAT.y, HAT.w, HAT.h, 0, 0, HAT.w, HAT.h);
        const hatData = hctx.getImageData(0, 0, HAT.w, HAT.h).data;
        let hasHat = false;
        for (let i = 3; i < hatData.length; i += 4) {
          if (hatData[i] > 0) { hasHat = true; break; }
        }
        if (hasHat) tctx.drawImage(hatCanvas, 0, 0);
      }

      // Scale up to target
      let canvas;
      if (target.tagName === "CANVAS") {
        canvas = target;
        canvas.width = size;
        canvas.height = size;
      } else {
        // replace <img> with a canvas
        canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;
        canvas.className = target.className;
        canvas.style.imageRendering = "pixelated";
        target.parentNode.replaceChild(canvas, target);
      }
      const ctx = canvas.getContext("2d");
      ctx.imageSmoothingEnabled = false;
      ctx.clearRect(0, 0, size, size);
      ctx.drawImage(tmp, 0, 0, FACE.w, FACE.h, 0, 0, size, size);
      canvas.classList.add("skin-rendered");
    };
    img.onerror = function () {
      // Fallback: draw a gradient + initial letter so the avatar slot never
      // looks broken (e.g. registered users without a skin file).
      const name = decodeURIComponent(skinUrl.split("/").pop() || "?")
        .replace(/\.png$/i, "")
        .replace(/[^\w]/g, "");
      const initial = (name[0] || "?").toUpperCase();
      if (target.tagName === "CANVAS") {
        const ctx = target.getContext("2d");
        const s = target.width || size;
        const grad = ctx.createLinearGradient(0, 0, s, s);
        grad.addColorStop(0, "#38bdf8");
        grad.addColorStop(1, "#22d3ee");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, s, s);
        ctx.fillStyle = "#031018";
        ctx.font = "600 " + Math.round(s * 0.5) + "px Inter, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(initial, s / 2, s / 2 + s * 0.04);
        target.classList.add("skin-rendered");
      } else {
        target.style.background =
          "linear-gradient(135deg, var(--accent), var(--accent-2))";
        target.style.display = "grid";
        target.style.placeItems = "center";
        target.style.color = "#031018";
        target.style.fontWeight = "700";
        target.style.fontSize = "1.6rem";
        target.textContent = initial;
      }
    };
    img.src = skinUrl;
  }

  /* ----------------------------------------------------------------------
     Icons
     ---------------------------------------------------------------------- */
  const ICONS = {
    github: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 .5A11.5 11.5 0 0 0 .5 12 11.5 11.5 0 0 0 8.4 23c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.3-1.7-1.3-1.7-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-6 0-1.3.5-2.4 1.2-3.2 0-.4-.5-1.6.2-3.2 0 0 1-.3 3.3 1.2a11 11 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.7 1.6.2 2.8.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 6 .4.3.8 1 .8 2.1v3.1c0 .3.2.7.8.6A11.5 11.5 0 0 0 23.5 12 11.5 11.5 0 0 0 12 .5Z"/></svg>',
    discord: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.3 4.4A19.8 19.8 0 0 0 15.4 3l-.3.5c1.6.4 2.9 1 4.1 1.8a13.6 13.6 0 0 0-11.3 0c1.2-.8 2.6-1.4 4.1-1.8L11.7 3a19.8 19.8 0 0 0-4.9 1.4C3.5 8.9 2.7 13.3 3 17.6a19.9 19.9 0 0 0 6 3l.5-.8c-1-.4-2-.9-2.9-1.5l.7-.5a14.2 14.2 0 0 0 12 0l.7.5c-.9.6-1.9 1.1-2.9 1.5l.5.8a19.9 19.9 0 0 0 6-3c.4-5-.9-9.4-3.3-13.2ZM9.3 15c-1 0-1.8-.9-1.8-2s.8-2 1.8-2 1.8.9 1.8 2-.8 2-1.8 2Zm5.4 0c-1 0-1.8-.9-1.8-2s.8-2 1.8-2 1.8.9 1.8 2-.8 2-1.8 2Z"/></svg>',
    mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
    calendar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
    code: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>',
    arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>',
  };

  /* ----------------------------------------------------------------------
     Render staff grid
     ---------------------------------------------------------------------- */
  function renderStaffGrid() {
    const grid = document.getElementById("staff-grid");
    if (!grid) return;
    grid.innerHTML = "";
    STAFF.forEach((s, i) => {
      const card = document.createElement("article");
      card.className = "card staff-card card-glow";
      card.setAttribute("data-reveal", "scale");
      card.setAttribute("data-reveal-delay", (i * 0.08) + "s");
      card.setAttribute("role", "button");
      card.setAttribute("tabindex", "0");
      card.setAttribute("aria-label", `View profile for ${s.name}`);
      card.innerHTML = `
        <canvas class="staff-avatar" width="88" height="88" aria-hidden="true"></canvas>
        <h3>${escapeHtml(s.name)}</h3>
        <div class="role">${escapeHtml(s.role)}</div>
        <div class="hint">click to view profile</div>
      `;
      card.addEventListener("click", () => openModal(s));
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openModal(s);
        }
      });
      grid.appendChild(card);
      // register the card with the scroll-reveal observer (it was added
      // after initReveal() ran on DOMContentLoaded)
      if (window.VectraReveal) window.VectraReveal(card);
      // render face into the avatar canvas
      const av = card.querySelector(".staff-avatar");
      renderFace(`assets/staff/${s.skin || s.id + ".png"}`, av, 88);
    });
  }

  /* ----------------------------------------------------------------------
     Modal
     ---------------------------------------------------------------------- */
  function openModal(s) {
    let backdrop = document.getElementById("staff-modal");
    if (!backdrop) {
      backdrop = document.createElement("div");
      backdrop.className = "modal-backdrop";
      backdrop.id = "staff-modal";
      backdrop.innerHTML = `
        <div class="modal" role="dialog" aria-modal="true" aria-labelledby="staff-modal-name">
          <div class="modal-banner">
            <button class="modal-close" aria-label="Close">${ICONS.close}</button>
          </div>
          <div class="modal-body">
            <div class="modal-head">
              <canvas class="modal-avatar" width="84" height="84" aria-hidden="true"></canvas>
              <div class="meta">
                <h3 id="staff-modal-name"></h3>
                <div class="role"></div>
              </div>
            </div>
            <p class="modal-bio"></p>
            <div class="modal-grid">
              <div class="field"><div class="k">Join Date</div><div class="v join"></div></div>
              <div class="field"><div class="k">Position</div><div class="v pos"></div></div>
            </div>
            <div class="skill-tags"></div>
            <div class="modal-socials"></div>
          </div>
        </div>`;
      document.body.appendChild(backdrop);
      backdrop.addEventListener("click", (e) => {
        if (e.target === backdrop) closeModal(backdrop);
      });
      backdrop.querySelector(".modal-close").addEventListener("click", () =>
        closeModal(backdrop)
      );
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") closeModal(backdrop);
      });
    }
    backdrop.querySelector("#staff-modal-name").textContent = s.name;
    backdrop.querySelector(".modal-head .role").textContent = s.role;
    backdrop.querySelector(".modal-bio").textContent = s.bio;
    backdrop.querySelector(".join").textContent = s.joinDate;
    backdrop.querySelector(".pos").textContent = s.role;

    const tags = backdrop.querySelector(".skill-tags");
    tags.innerHTML = "";
    s.skills.forEach((sk) => {
      const t = document.createElement("span");
      t.className = "badge badge-accent";
      t.textContent = sk;
      tags.appendChild(t);
    });

    const soc = backdrop.querySelector(".modal-socials");
    soc.innerHTML = "";
    s.socials.forEach((link) => {
      const a = document.createElement("a");
      a.href = link.url;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.innerHTML = `${ICONS[link.icon] || ""}<span>${escapeHtml(link.label)}</span>`;
      soc.appendChild(a);
    });
    const contact = document.createElement("a");
    contact.href = "#";
    contact.className = "btn btn-ghost btn-sm";
    contact.innerHTML = `${ICONS.mail}<span>${escapeHtml(s.contact)}</span>`;
    contact.addEventListener("click", (e) => {
      e.preventDefault();
      window.showToast("Contact requests are handled through our Discord server.", "info");
    });
    soc.appendChild(contact);

    // render face
    const av = backdrop.querySelector(".modal-avatar");
    // clear previous (force re-render by replacing)
    const fresh = document.createElement("canvas");
    fresh.className = av.className;
    fresh.width = 84; fresh.height = 84;
    av.parentNode.replaceChild(fresh, av);
    renderFace(`assets/staff/${s.skin || s.id + ".png"}`, fresh, 84);

    // open
    requestAnimationFrame(() => backdrop.classList.add("open"));
    document.body.style.overflow = "hidden";
  }
  function closeModal(backdrop) {
    backdrop.classList.remove("open");
    document.body.style.overflow = "";
  }

  function escapeHtml(s) {
    return String(s).replace(
      /[&<>"']/g,
      (c) =>
        ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
    );
  }

  /* ----------------------------------------------------------------------
     Expose for reuse (e.g. dashboard avatar)
     ---------------------------------------------------------------------- */
  window.VectraStaff = { renderFace, STAFF };

  document.addEventListener("DOMContentLoaded", renderStaffGrid);
})();

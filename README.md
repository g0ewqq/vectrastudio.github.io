# Vectra Studios — Static Website

A complete static website for Vectra Studios, a Minecraft development studio.
Pure HTML, CSS and JavaScript — no build step, no backend, no dependencies.
Deploys directly to GitHub Pages.

## Quick start

1. Unzip this folder.
2. Open `vectra/index.html` in your browser to preview locally.

## Deploy to GitHub Pages

1. Create a new GitHub repository (e.g. `vectrastudios.github.io`).
2. Copy the **contents** of the `vectra/` folder into the repository root.
   Your repo should look like:
   ```
   index.html
   about.html
   services.html
   ...
   css/
   js/
   assets/
   ```
3. Commit and push to GitHub.
4. In the repo: **Settings → Pages → Source: Deploy from a branch → main /(root)**.
5. Your site goes live at `https://<username>.github.io/`.

> If your repo is named `<username>.github.io` it serves from the root.
> For a project repo (`<username>/<repo>`), set Pages to serve from the
> `/ (root)` folder and it will live at `https://<username>.github.io/<repo>/`.
> All paths in this site are relative, so it works from either location.

## Project structure

```
vectra/
├── index.html          # Home (hero, services preview, current projects, Discord widget)
├── about.html          # About the studio
├── services.html       # Services + pricing + contact form
├── projects.html       # Project showcase with filtering + search
├── staff.html          # Team cards with Minecraft skin avatars
├── perks.html          # Discord booster perks
├── css/
│   └── style.css       # Full design system (dark, blue/cyan, glassmorphism)
├── js/
│   ├── config.js       # ⚙️  EDIT THIS — Discord URL, server ID, site config
│   ├── main.js         # Navbar, parallax, scroll reveal, toasts, widget
│   ├── staff.js        # Staff data + Minecraft skin renderer
│   └── projects.js     # Project data + filtering/search
└── assets/
    ├── backgrounds/
    │   └── hero-bg.png     # Hero background image
    ├── staff/
    │   ├── g0ewq.png       # Minecraft skin (founder)
    │   ├── RealNosi.webp   # Minecraft skin (director)
    │   ├── ABGxmer.png     # Minecraft skin (support)
    │   └── limit_xenn.png  # Minecraft skin (support)
    ├── projects/
    │   └── vectracore.png  # VectraCore screenshot
    └── icons/
        └── favicon.svg
```

## Common edits

| Want to change... | Edit this |
|---|---|
| Discord invite URL / server ID | `js/config.js` → `discord.url`, `discord.widgetId` |
| Staff members / bios / skins | `js/staff.js` → `STAFF` array (+ drop skin in `assets/staff/`) |
| Projects | `js/projects.js` → `PROJECTS` array |
| Pricing tiers | `services.html` → pricing section |
| Hero background | Replace `assets/backgrounds/hero-bg.png` |
| Favicon | Replace `assets/icons/favicon.svg` |

## Discord widget

The home page shows a live Discord widget using the server ID in `config.js`.
To display online members, enable the widget in Discord:

**Server Settings → Widget → Enable Server Widget: ON**

If the widget is disabled, the site automatically shows a fallback
"Join Vectra Studios on Discord" button.

## Browser support

Modern browsers (Chrome, Firefox, Safari, Edge). The site is responsive,
accessible, and respects `prefers-reduced-motion`.

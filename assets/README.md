# Vectra Studios — Asset System

This folder contains all image assets for the Vectra Studios website.
Everything is loaded **client-side** with **relative paths** so the site
deploys directly to GitHub Pages with no build step.

## Structure

```
assets/
├── backgrounds/
│   └── hero-bg.png        # Full-screen hero background (auto-loaded)
├── staff/
│   ├── g0ewq.png          # Minecraft skin file (64x32, classic)
│   └── RealNosi.webp      # Minecraft skin file (64x64, modern)
└── icons/
    └── favicon.svg
```

## Staff Avatars — Minecraft Skin System

Staff avatars are **not** regular profile pictures. They are raw Minecraft
skin files. The JavaScript skin renderer in `js/staff.js` loads each
skin and crops the **face region** automatically:

```
Face UV:  X = 8, Y = 8, Width = 8, Height = 8
```

### Adding a new staff member

1. Drop a Minecraft skin file into `assets/staff/` (PNG or WebP, 64x32
   classic or 64x64 modern).
2. Add the staff entry to the `STAFF` array in `js/staff.js`, setting the
   `skin` field to the filename (e.g. `skin: "newperson.png"`).
3. The face avatar is generated automatically — no manual cropping needed.

## Backgrounds

`hero-bg.png` is loaded automatically by the hero section. Replace the file
to change the background — no code changes required.

## Editing Notes

- All paths in the HTML are **relative** (e.g. `css/style.css`,
  `assets/staff/g0ewq.png`), so the site works from any subfolder.
- Discord URL and global links are centralised in `js/config.js`.

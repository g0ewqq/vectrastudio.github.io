/**
 * Vectra Studios — Global Configuration
 * ---------------------------------------
 * Central place for site-wide settings. Edit values here to update them
 * across every page. No other file needs to change for common edits.
 *
 * This file is loaded as a normal <script> (not a module) so that
 * `window.VECTRA_CONFIG` is available everywhere.
 */
window.VECTRA_CONFIG = {
  // Studio identity
  name: "Vectra Studios",
  tagline: "Building Minecraft Servers That Last",
  description:
    "Vectra Studios is a Minecraft development studio focused on custom plugins, server setups, optimization, technical support, and community-driven projects.",

  // When the studio was founded (used on About + Staff pages)
  founded: "January 6, 2026",

  // Discord (single source of truth — referenced by every "Join Discord" button)
  discord: {
    url: "https://discord.gg/g9WxvtFgFj",
    inviteCode: "g9WxvtFgFj",
    // Discord server ID — powers the live widget on the home page.
    widgetId: "1515327795075747981",
  },

  // Contact placeholders
  contact: {
    email: "contact@vectrastudios.dev",
    github: "https://github.com/vectrastudios",
    commissionsOpen: true,
  },

  // Navigation (used to build the navbar/footer consistently)
  nav: [
    { label: "Home", href: "index.html" },
    { label: "About", href: "about.html" },
    { label: "Services", href: "services.html" },
    { label: "Projects", href: "projects.html" },
    { label: "Staff", href: "staff.html" },
    { label: "Perks", href: "perks.html" },
  ],
};

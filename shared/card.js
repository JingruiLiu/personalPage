/* =============================================================================
   SHARED RENDERER — single source of truth for behavior + icons + link types.
   Maintained by the site owner. Colleagues never touch this file.

   It reads the per-page `window.PROFILE` (defined in that page's profile.js) and
   builds the contact card into <main id="card-root">. To support a new link type
   for everyone, add one entry to LINK_TYPES below.
   ============================================================================= */
(function () {
  "use strict";

  /* ------------------------------------------------------------------ icons */
  // Inline SVGs. Stroke uses currentColor so the accent color is applied via CSS.
  var CHEVRON =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">' +
    '<path d="M9 18l6-6-6-6" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  var AVATAR_PLACEHOLDER =
    '<svg width="44" height="44" viewBox="0 0 24 24" fill="none" ' +
    'stroke="var(--avatar-icon)" stroke-width="1.5">' +
    '<circle cx="12" cy="8" r="4"/>' +
    '<path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke-linecap="round"/></svg>';

  function svg(inner) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
      'stroke-width="1.6">' + inner + '</svg>';
  }

  var ICON = {
    email: svg('<rect x="3" y="5" width="18" height="14" rx="2.5"/>' +
      '<path d="M4 7l8 6 8-6" stroke-linecap="round" stroke-linejoin="round"/>'),
    phone: svg('<path d="M5 4h3l2 5-2.5 1.5a11 11 0 0 0 5 5L16 13l5 2v3a2 2 0 0 1-2 2' +
      'A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" stroke-linecap="round" stroke-linejoin="round"/>'),
    website: svg('<circle cx="12" cy="12" r="9"/>' +
      '<path d="M3 12h18M12 3c2.6 2.6 2.6 15.4 0 18M12 3c-2.6 2.6-2.6 15.4 0 18" ' +
      'stroke-linecap="round" stroke-linejoin="round"/>'),
    linkedin: svg('<rect x="3" y="3" width="18" height="18" rx="3"/>' +
      '<path d="M8 10v6M8 7.5v.01M12 16v-3.5c0-1.4 1-2.5 2.5-2.5S17 11.1 17 12.5V16" ' +
      'stroke-linecap="round" stroke-linejoin="round"/>'),
    github: svg('<path d="M12 3a9 9 0 0 0-2.85 17.54c.45.08.62-.2.62-.43v-1.7c-2.5.27-3.15-.6' +
      '-3.35-1.15-.11-.29-.6-1.15-1.02-1.39-.35-.19-.85-.65-.01-.66.79-.01 1.35.72 1.54 1.02' +
      '.9 1.5 2.34 1.08 2.91.82.09-.64.35-1.08.64-1.33-2.23-.25-4.56-1.11-4.56-4.94 0-1.09' +
      '.39-1.99 1.03-2.69-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02a9.4 9.4 0 0 1 5 0' +
      'c1.91-1.3 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.69 0 3.84' +
      '-2.34 4.69-4.58 4.94.37.32.68.93.68 1.88v2.04c0 .23.17.5.62.43A9 9 0 0 0 12 3z" ' +
      'stroke-linecap="round" stroke-linejoin="round"/>'),
    scholar: svg('<path d="M12 4L2 9l10 5 8-4.3V15" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<path d="M6 11.5V16c0 1.5 2.7 3 6 3s6-1.5 6-3v-4.5" stroke-linecap="round" stroke-linejoin="round"/>'),
    orcid: svg('<circle cx="12" cy="12" r="9"/>' +
      '<path d="M9 9.5v6M9 7.4v.01M12.5 9.5h1.3c1.7 0 2.7 1.1 2.7 2.7s-1 2.8-2.7 2.8h-1.3z" ' +
      'stroke-linecap="round" stroke-linejoin="round"/>'),
    researchgate: svg('<rect x="3" y="3" width="18" height="18" rx="4"/>' +
      '<path d="M9 16V8.5h2.4c1.4 0 2.3.8 2.3 2.1 0 1.1-.7 1.8-1.8 2L15 16M10 6.7v.01" ' +
      'stroke-linecap="round" stroke-linejoin="round"/>'),
    twitter: svg('<path d="M5 5l14 14M19 5L5 19" stroke-linecap="round"/>'),
    link: svg('<path d="M10 13.5a4 4 0 0 0 5.7.2l2.3-2.3a4 4 0 0 0-5.7-5.7L11 6.9" ' +
      'stroke-linecap="round" stroke-linejoin="round"/>' +
      '<path d="M14 10.5a4 4 0 0 0-5.7-.2L6 12.6a4 4 0 0 0 5.7 5.7L13 17" ' +
      'stroke-linecap="round" stroke-linejoin="round"/>'),
  };

  /* --------------------------------------------------------------- helpers */
  function sanitizeUrl(u) {
    if (!u) return "";
    var s = String(u).trim();
    if (/^(https?:|mailto:|tel:)/i.test(s)) return s;          // already safe scheme
    if (/^[a-z0-9.-]+\.[a-z]{2,}([\/?#].*)?$/i.test(s)) return "https://" + s; // bare domain
    return "";                                                  // block javascript:, data:, etc.
  }

  function host(u) {
    try { return new URL(sanitizeUrl(u)).hostname.replace(/^www\./, ""); }
    catch (e) { return String(u); }
  }

  function lastSeg(u) {
    try {
      var parts = new URL(sanitizeUrl(u)).pathname.split("/").filter(Boolean);
      return parts.length ? parts[parts.length - 1] : host(u);
    } catch (e) { return String(u); }
  }

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  /* ------------------------------------------------- supported link types
     Each type: icon + default label + how to build the href + how to build
     the small grey subtitle. Add a line here to support a new type everywhere. */
  var LINK_TYPES = {
    email:        { label: "Email",          icon: ICON.email,        href: function (v) { return "mailto:" + v; }, sub: function (v) { return v; } },
    phone:        { label: "Phone",          icon: ICON.phone,        href: function (v) { return "tel:" + v.replace(/\s+/g, ""); }, sub: function (v) { return v; } },
    website:      { label: "Website",        icon: ICON.website,      href: function (v) { return v; }, sub: function (v) { return host(v); } },
    linkedin:     { label: "LinkedIn",       icon: ICON.linkedin,     href: function (v) { return v; }, sub: function (v) { return "/in/" + lastSeg(v); } },
    github:       { label: "GitHub",         icon: ICON.github,       href: function (v) { return v; }, sub: function (v) { return "@" + lastSeg(v); } },
    scholar:      { label: "Google Scholar", icon: ICON.scholar,      href: function (v) { return v; }, sub: function ()  { return "Publications & citations"; } },
    orcid:        { label: "ORCID",          icon: ICON.orcid,        href: function (v) { return v; }, sub: function (v) { return lastSeg(v); } },
    researchgate: { label: "ResearchGate",   icon: ICON.researchgate, href: function (v) { return v; }, sub: function ()  { return "Profile"; } },
    twitter:      { label: "X / Twitter",    icon: ICON.twitter,      href: function (v) { return v; }, sub: function (v) { return "@" + lastSeg(v); } },
    // Generic fallback — colleagues use this for anything not listed above.
    link:         { label: "Link",           icon: ICON.link,         href: function (v) { return v; }, sub: function (v) { return host(v); } },
  };

  // Friendly aliases so common guesses just work.
  var ALIASES = { x: "twitter", google_scholar: "scholar", googlescholar: "scholar",
    site: "website", homepage: "website", web: "website", mail: "email", tel: "phone" };

  function resolveType(t) {
    t = String(t == null ? "" : t).toLowerCase().trim();
    if (ALIASES[t]) t = ALIASES[t];
    return LINK_TYPES[t] || LINK_TYPES.link;   // unknown type -> generic, never throws
  }

  /* ----------------------------------------------------------- avatar error
     If a photo is missing/misnamed, swap to the placeholder instead of a
     broken-image icon. Referenced inline from the <img> built below. */
  window.__cardAvatarError = function (img) {
    var wrap = img.parentNode;
    if (wrap) wrap.innerHTML = AVATAR_PLACEHOLDER;
  };

  /* ----------------------------------------------------------------- render */
  function buildRow(def, link, value) {
    var href = sanitizeUrl(def.href(value));
    if (!href) return "";                       // unsafe/empty -> skip the row
    var label = esc(link.label || def.label);
    var subRaw = (link.sub != null) ? link.sub : (def.sub ? def.sub(value) : "");
    var sub = subRaw ? '<span class="contact-row__sub">' + esc(subRaw) + "</span>" : "";
    var external = /^https?:/i.test(href);
    var attrs = external ? ' target="_blank" rel="noopener"' : "";
    return '<a class="contact-row" href="' + esc(href) + '"' + attrs + ">" +
      '<span class="contact-row__icon" aria-hidden="true">' + def.icon + "</span>" +
      '<span class="contact-row__label">' + label + sub + "</span>" +
      '<span class="contact-row__chevron" aria-hidden="true">' + CHEVRON + "</span>" +
      "</a>";
  }

  function friendlyMessage(root) {
    root.innerHTML =
      '<div class="card"><div class="card-message">' +
      "This card couldn't load right now.<br>" +
      'You can reach out at <a href="mailto:jingruiliu09@gmail.com">jingruiliu09@gmail.com</a>.' +
      "</div></div>";
  }

  function renderProfile() {
    var root = document.getElementById("card-root");
    if (!root) return;                          // not a person page

    var p = window.PROFILE;
    if (!p || typeof p !== "object" || !p.name) { friendlyMessage(root); return; }

    try {
      var avatarSrc = sanitizeAvatar(p.avatar);
      var avatarInner = avatarSrc
        ? '<img src="' + esc(avatarSrc) + '" alt="" onerror="__cardAvatarError(this)">'
        : AVATAR_PLACEHOLDER;

      var header =
        '<div class="header">' +
        '<div class="avatar">' + avatarInner + "</div>" +
        '<h1 class="name">' + esc(p.name) + "</h1>" +
        (p.tagline ? '<p class="tagline">' + esc(p.tagline) + "</p>" : "") +
        "</div>";

      var rows = "";
      var links = Array.isArray(p.links) ? p.links : [];
      for (var i = 0; i < links.length; i++) {
        var link = links[i];
        if (!link || typeof link !== "object") continue;
        var value = (link.value == null ? "" : String(link.value)).trim();
        if (!value) continue;                   // skip empty values -> clean templates
        rows += buildRow(resolveType(link.type), link, value);
      }

      var list = rows ? '<nav class="contact-list">' + rows + "</nav>" : "";
      root.innerHTML = '<div class="card">' + header + list + "</div>";
    } catch (e) {
      friendlyMessage(root);                    // any unexpected error -> graceful
    }
  }

  // Avatar paths are relative file paths, not links — allow them as-is, but
  // block anything with a scheme (javascript:/data:) for safety.
  function sanitizeAvatar(a) {
    if (!a) return "";
    var s = String(a).trim();
    if (/^[a-z][a-z0-9+.-]*:/i.test(s) && !/^https?:/i.test(s)) return "";
    return s;
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", renderProfile);
  } else {
    renderProfile();
  }
})();

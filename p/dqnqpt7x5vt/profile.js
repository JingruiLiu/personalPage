/* =============================================================================
   YOUR PROFILE — this is the ONLY file you need to edit.
   You are just filling in the text between the quotation marks. You do NOT need
   to understand the code. Keep the punctuation (quotes, commas, braces) as it is.

   ---------------------------------------------------------------------------
   HOW TO ADD a contact:    Copy a whole line like   { type: "...", value: "..." },
                            paste it on its own line, then change the values.
   HOW TO REMOVE a contact: Delete that whole line.
   HOW TO REORDER:          Move a line up or down. The order here is the order
                            shown on your page, top to bottom.
   LEAVE SOMETHING BLANK:   If a "value" is empty ("") that row is simply hidden,
                            so it is safe to keep blank lines as reminders.
   ---------------------------------------------------------------------------
   FIELD TYPES you can use (the "type" picks the icon and label automatically):

     email        ->  "you@example.com"
     phone        ->  "+1 734 555 0123"
     website      ->  a full address, e.g. "https://your-site.com"
     linkedin     ->  your full LinkedIn URL
     github       ->  your full GitHub URL
     scholar      ->  your full Google Scholar URL
     orcid        ->  your full ORCID URL
     researchgate ->  your full ResearchGate URL
     twitter      ->  your full X / Twitter URL
     link         ->  ANYTHING ELSE. This one needs a label, for example:
                      { type: "link", label: "My Lab", value: "https://lab.example.com" },

   OPTIONAL: add  label: "Custom Name"  to any line to override the default label,
   e.g.  { type: "email", label: "Work Email", value: "you@work.com" },
   ============================================================================= */

window.PROFILE = {

  // Your name, shown large under your photo.
  name: "Sample Person",

  // One short line under your name (a role, field, or anything you like).
  tagline: "Your one-line tagline",

  // Your photo. Put a square image at  assets/avatar.jpg  in this same folder.
  // (Leave this line as-is; just replace the image file. If there is no photo,
  //  a neutral placeholder is shown automatically.)
  avatar: "assets/avatar.jpg",

  // ---- Your contacts, in the order you want them shown. ----
  links: [
    { type: "email",    value: "you@example.com" },
    { type: "website",  value: "" },                                      // hidden until filled in
    { type: "linkedin", value: "https://www.linkedin.com/in/your-handle/" },
    { type: "github",   value: "https://github.com/your-handle" },
    { type: "scholar",  value: "" },                                      // hidden until filled in
    // { type: "link", label: "My Lab", value: "https://lab.example.com" },  // example of a custom link
  ],

};

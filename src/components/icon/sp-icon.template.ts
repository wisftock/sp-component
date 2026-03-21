import { html, nothing, svg, type TemplateResult } from "lit";
import type { SpIconComponent } from "./sp-icon.js";

const iconPaths: Record<string, TemplateResult> = {
  check: svg`<path d="M20 6L9 17l-5-5"/>`,
  close: svg`<path d="M18 6L6 18M6 6l12 12"/>`,
  "arrow-right": svg`<path d="M5 12h14M12 5l7 7-7 7"/>`,
  "arrow-left": svg`<path d="M19 12H5M12 19l-7-7 7-7"/>`,
  "arrow-down": svg`<path d="M12 5v14M5 12l7 7 7-7"/>`,
  "arrow-up": svg`<path d="M12 19V5M5 12l7-7 7 7"/>`,
  info: svg`<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>`,
  warning: svg`<path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4M12 17h.01"/>`,
  error: svg`<circle cx="12" cy="12" r="10"/><path d="M15 9l-6 6M9 9l6 6"/>`,
  search: svg`<circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>`,
  user: svg`<path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>`,
  home: svg`<path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>`,
  settings: svg`<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>`,
  bell: svg`<path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"/>`,
  heart: svg`<path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>`,
  star: svg`<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>`,
  trash: svg`<polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/>`,
  edit: svg`<path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>`,
};

export function iconTemplate(this: SpIconComponent): TemplateResult {
  const paths = iconPaths[this.name];
  const style = this.color ? `color: ${this.color};` : nothing;

  return html`
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      aria-label=${this.label || nothing}
      aria-hidden=${this.label ? nothing : "true"}
      role=${this.label ? "img" : nothing}
      style=${style}
    >
      ${paths ?? nothing}
    </svg>
  `;
}

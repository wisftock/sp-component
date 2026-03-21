import { html, nothing, type TemplateResult } from "lit";
import type { SpAvatarComponent } from "./sp-avatar.js";

/**
 * HTML template for sp-avatar.
 *
 * Call as: avatarTemplate.call(this) inside render()
 */
export function avatarTemplate(this: SpAvatarComponent): TemplateResult {
  return html`
    <div class="sp-avatar">
      ${this.src && !this._imageError
        ? html`<img src=${this.src} alt=${this.alt || nothing} @error=${this._handleImageError} />`
        : this.initials
          ? html`<span class="sp-avatar-initials">${this._getInitials()}</span>`
          : html`<span class="sp-avatar-placeholder" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
              </svg>
            </span>`}
    </div>
  `;
}

import { html, nothing, type TemplateResult } from "lit";
import type { SpKbdComponent } from "./sp-kbd.js";

/**
 * HTML template for sp-kbd.
 * Call as: kbdTemplate.call(this) inside render()
 */
export function kbdTemplate(this: SpKbdComponent): TemplateResult {
  if (this.keys.length > 1) {
    return html`
      <span class="sp-kbd-sequence">
        ${this.keys.map((k, i) => html`
          <kbd part="key">${this._resolveKey(k)}</kbd>${i < this.keys.length - 1 ? html`<span class="sp-kbd-sep">+</span>` : nothing}
        `)}
      </span>
    `;
  }
  if (this.keys.length === 1) {
    return html`<kbd part="key">${this._resolveKey(this.keys[0]!)}</kbd>`;
  }
  return html`<kbd part="key"><slot></slot></kbd>`;
}

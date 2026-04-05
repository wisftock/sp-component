import { html, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import { SpBaseElement } from "../../base/SpBaseElement.js";

const styles = `
  :host { display: block; }
  button {
    display: flex; align-items: center; gap: 8px;
    width: 100%; padding: 8px 12px;
    border: none; background: none;
    font-size: 14px; font-family: inherit;
    color: var(--sp-text, #111827);
    cursor: pointer; text-align: start;
  }
  button:hover:not([disabled]) { background: var(--sp-bg-muted, #f3f4f6); }
  :host([danger]) button { color: var(--sp-error, #FF4D4F); }
  :host([danger]) button:hover:not([disabled]) { background: var(--sp-error-bg, #FFF2F0); }
  :host([disabled]) button { opacity: 0.4; cursor: not-allowed; }
  .sp-mi-icon { flex-shrink: 0; }
`;

/**
 * Individual item inside a compound menu.
 *
 * @element sp-menu-option
 * @fires sp-menu-option-click
 */
@customElement("sp-menu-option")
export class SpMenuOptionElement extends SpBaseElement {
  static override styles = unsafeCSS(styles);

  @property({ type: String })
  value = "";

  @property({ type: Boolean, reflect: true })
  disabled = false;

  @property({ type: Boolean, reflect: true })
  danger = false;

  override render() {
    return html`
      <button
        role="menuitem"
        ?disabled=${this.disabled}
        @click=${this._handleClick}
      >
        <slot name="icon" class="sp-mi-icon"></slot>
        <slot></slot>
      </button>
    `;
  }

  private _handleClick() {
    if (this.disabled) return;
    this.dispatchEvent(
      new CustomEvent("sp-menu-option-click", {
        detail: { value: this.value },
        bubbles: true,
        composed: true,
      }),
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "sp-menu-option": SpMenuOptionElement;
  }
}

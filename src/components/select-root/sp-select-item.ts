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
  :host([selected]) button { color: var(--sp-primary, #3b82f6); background: var(--sp-primary-bg, #eff6ff); font-weight: 500; }
  :host([disabled]) button { opacity: 0.4; cursor: not-allowed; }
  .sp-si-check { font-size: 11px; color: var(--sp-primary, #3b82f6); width: 14px; flex-shrink: 0; }
`;

/**
 * Individual option inside a compound select.
 * Should be placed inside `<sp-select-content>`.
 *
 * @element sp-select-item
 * @fires sp-select-item-click
 */
@customElement("sp-select-item")
export class SpSelectItemElement extends SpBaseElement {
  static override styles = unsafeCSS(styles);

  @property({ type: String })
  value = "";

  @property({ type: Boolean, reflect: true })
  selected = false;

  @property({ type: Boolean, reflect: true })
  disabled = false;

  override render() {
    return html`
      <button
        role="option"
        aria-selected=${this.selected ? "true" : "false"}
        ?disabled=${this.disabled}
        @click=${this._handleClick}
      >
        <span class="sp-si-check" aria-hidden="true">${this.selected ? "✓" : ""}</span>
        <slot></slot>
      </button>
    `;
  }

  private _handleClick() {
    if (this.disabled) return;
    const label = this.textContent?.trim() ?? this.value;
    this.dispatchEvent(
      new CustomEvent("sp-select-item-click", {
        detail: { value: this.value, label },
        bubbles: true,
        composed: true,
      }),
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "sp-select-item": SpSelectItemElement;
  }
}

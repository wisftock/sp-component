import { html, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import { SpBaseElement } from "../../base/SpBaseElement.js";

const styles = `
  :host { display: inline-block; }
  button {
    display: inline-flex; align-items: center; justify-content: space-between;
    gap: 8px; width: 100%; min-width: 120px;
    padding: 8px 12px;
    border: 1px solid var(--sp-border, #d1d5db);
    border-radius: 4px;
    background: var(--sp-bg, white);
    color: var(--sp-text, #111827);
    font-size: 14px; font-family: inherit;
    cursor: pointer;
    transition: border-color 0.2s;
  }
  button:hover { border-color: var(--sp-primary, #3b82f6); }
  button:focus-visible {
    outline: 2px solid var(--sp-primary-focus, rgba(59,130,246,0.2));
    outline-offset: -1px;
    border-color: var(--sp-primary, #3b82f6);
  }
  button[aria-expanded="true"] { border-color: var(--sp-primary, #3b82f6); }
  :host([disabled]) button { opacity: 0.5; cursor: not-allowed; }
  .sp-st-arrow { font-size: 10px; color: var(--sp-text-muted, #6b7280); }
  .sp-st-placeholder { color: var(--sp-text-placeholder, #9ca3af); }
`;

/**
 * Trigger button for the compound select.
 * Should be placed inside `<sp-select-root>`.
 *
 * @element sp-select-trigger
 * @fires sp-trigger-click
 */
@customElement("sp-select-trigger")
export class SpSelectTriggerElement extends SpBaseElement {
  static override styles = unsafeCSS(styles);

  @property({ type: String })
  placeholder = "Select…";

  @property({ attribute: "current-value" })
  currentValue = "";

  @property({ attribute: "aria-expanded", reflect: true })
  ariaExpanded = "false";

  @property({ type: Boolean, reflect: true })
  disabled = false;

  override render() {
    return html`
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded=${this.ariaExpanded}
        ?disabled=${this.disabled}
        @click=${this._handleClick}
      >
        ${this.currentValue
          ? html`<slot name="selected-label">${this.currentValue}</slot>`
          : html`<span class="sp-st-placeholder">${this.placeholder}</span>`}
        <span class="sp-st-arrow" aria-hidden="true">▼</span>
      </button>
    `;
  }

  private _handleClick() {
    this.dispatchEvent(new CustomEvent("sp-trigger-click", { bubbles: true, composed: true }));
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "sp-select-trigger": SpSelectTriggerElement;
  }
}

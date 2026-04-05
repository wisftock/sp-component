import { html, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import { SpBaseElement } from "../../base/SpBaseElement.js";

const styles = `
  :host { display: block; position: relative; }
  .sp-sc-panel {
    display: none;
    position: absolute;
    inset-inline-start: 0;
    top: calc(100% + 4px);
    min-width: 100%;
    background: var(--sp-bg, white);
    border: 1px solid var(--sp-border-subtle, #e5e7eb);
    border-radius: 6px;
    box-shadow: 0 8px 24px rgba(0,0,0,0.12);
    z-index: var(--sp-z-overlay, 9999);
    max-height: var(--sp-select-max-height, 280px);
    overflow-y: auto;
    padding: 4px 0;
  }
  :host([open]) .sp-sc-panel { display: block; }
`;

/**
 * Dropdown panel for the compound select.
 * Should be placed inside `<sp-select-root>`.
 *
 * @element sp-select-content
 */
@customElement("sp-select-content")
export class SpSelectContentElement extends SpBaseElement {
  static override styles = unsafeCSS(styles);

  @property({ type: Boolean, reflect: true })
  open = false;

  @property({ attribute: "selected-value" })
  selectedValue = "";

  override render() {
    return html`
      <div class="sp-sc-panel" role="listbox">
        <slot></slot>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "sp-select-content": SpSelectContentElement;
  }
}

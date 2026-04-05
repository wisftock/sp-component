import { html, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import { SpBaseElement } from "../../base/SpBaseElement.js";

const styles = `
  :host { display: block; position: relative; }
  .sp-mc-panel {
    display: none;
    position: absolute;
    inset-inline-start: 0;
    top: calc(100% + 4px);
    min-width: 160px;
    background: var(--sp-bg, white);
    border: 1px solid var(--sp-border-subtle, #e5e7eb);
    border-radius: 6px;
    box-shadow: 0 8px 24px rgba(0,0,0,0.12);
    z-index: var(--sp-z-overlay, 9999);
    padding: 4px 0;
  }
  :host([open]) .sp-mc-panel { display: block; }
`;

/**
 * Dropdown panel for compound menu.
 *
 * @element sp-menu-content
 */
@customElement("sp-menu-content")
export class SpMenuContentElement extends SpBaseElement {
  static override styles = unsafeCSS(styles);

  @property({ type: Boolean, reflect: true })
  open = false;

  override render() {
    return html`
      <div class="sp-mc-panel" role="menu">
        <slot></slot>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "sp-menu-content": SpMenuContentElement;
  }
}

import { html, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import { SpBaseElement } from "../../base/SpBaseElement.js";

const styles = `
  :host { display: block; }
  .sp-sg-label {
    padding: 6px 12px 2px;
    font-size: 11px; font-weight: 600;
    letter-spacing: 0.06em; text-transform: uppercase;
    color: var(--sp-text-muted, #6b7280);
  }
`;

/**
 * Group label for compound select items.
 * Should be placed inside `<sp-select-content>`.
 *
 * @element sp-select-group
 */
@customElement("sp-select-group")
export class SpSelectGroupElement extends SpBaseElement {
  static override styles = unsafeCSS(styles);

  @property({ type: String })
  label = "";

  override render() {
    return html`
      <div class="sp-sg-label" role="group" aria-label=${this.label}>${this.label}</div>
      <slot></slot>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "sp-select-group": SpSelectGroupElement;
  }
}

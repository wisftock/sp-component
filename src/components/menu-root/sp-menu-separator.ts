import { html, unsafeCSS } from "lit";
import { customElement } from "lit/decorators.js";
import { SpBaseElement } from "../../base/SpBaseElement.js";

const styles = `
  :host { display: block; }
  hr { border: none; border-top: 1px solid var(--sp-border-subtle, #e5e7eb); margin: 4px 0; }
`;

/**
 * Horizontal separator inside a compound menu.
 *
 * @element sp-menu-separator
 */
@customElement("sp-menu-separator")
export class SpMenuSeparatorElement extends SpBaseElement {
  static override styles = unsafeCSS(styles);

  override render() {
    return html`<hr role="separator" />`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "sp-menu-separator": SpMenuSeparatorElement;
  }
}

import { html, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import { SpBaseElement } from "../../base/SpBaseElement.js";

const styles = `
  :host { display: inline-block; cursor: pointer; }
  ::slotted(*) { cursor: pointer; }
`;

/**
 * Trigger for compound menu. Any slotted content becomes the clickable trigger.
 *
 * @element sp-menu-trigger
 * @fires sp-menu-trigger-click
 */
@customElement("sp-menu-trigger")
export class SpMenuTriggerElement extends SpBaseElement {
  static override styles = unsafeCSS(styles);

  @property({ type: Boolean, reflect: true })
  disabled = false;

  override render() {
    return html`<slot @click=${this._handleClick}></slot>`;
  }

  private _handleClick(e: Event) {
    if (this.disabled) return;
    e.stopPropagation();
    this.dispatchEvent(new CustomEvent("sp-menu-trigger-click", { bubbles: true, composed: true }));
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "sp-menu-trigger": SpMenuTriggerElement;
  }
}

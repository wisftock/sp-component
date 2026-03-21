import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";

/**
 * Tab panel component. Visibility is controlled by sp-tabs via the hidden attribute.
 *
 * @element sp-tab-panel
 *
 * @prop {string} name - The panel name, matched against sp-tabs active prop
 *
 * @slot - Panel content
 */
@customElement("sp-tab-panel")
export class SpTabPanelComponent extends LitElement {
  @property({ type: String, reflect: true })
  name = "";

  override render() {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "sp-tab-panel": SpTabPanelComponent;
  }
}

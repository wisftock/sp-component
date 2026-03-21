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

  override connectedCallback(): void {
    super.connectedCallback();
    if (!this.hasAttribute("role")) {
      this.setAttribute("role", "tabpanel");
    }
  }

  override updated(changed: Map<string, unknown>): void {
    if (changed.has("name")) {
      this.setAttribute("id", `panel-${this.name}`);
      this.setAttribute("aria-labelledby", `tab-${this.name}`);
    }
  }

  override render() {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "sp-tab-panel": SpTabPanelComponent;
  }
}

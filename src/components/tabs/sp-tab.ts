import { LitElement, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import styles from "./sp-tab.css?inline";
import { tabTemplate } from "./sp-tab.template.js";

/**
 * Tab button component. Must be used inside sp-tabs.
 *
 * @element sp-tab
 *
 * @prop {string}  panel    - ID of the panel this tab activates
 * @prop {boolean} disabled - Disables the tab
 * @prop {boolean} active   - Whether this tab is currently active (set by sp-tabs)
 *
 * @fires {CustomEvent<{ panel: string }>} sp-tab-click - Emitted when the tab is clicked
 *
 * @slot - Tab label content
 */
@customElement("sp-tab")
export class SpTabComponent extends LitElement {
  static override styles = unsafeCSS(styles);

  @property({ type: String })
  panel = "";

  @property({ type: Boolean, reflect: true })
  disabled = false;

  @property({ type: Boolean, reflect: true })
  active = false;

  override render() {
    return tabTemplate.call(this);
  }

  readonly _handleClick = () => {
    if (!this.disabled) {
      this.dispatchEvent(
        new CustomEvent("sp-tab-click", {
          detail: { panel: this.panel },
          bubbles: true,
          composed: true,
        }),
      );
    }
  };
}

declare global {
  interface HTMLElementTagNameMap {
    "sp-tab": SpTabComponent;
  }
}

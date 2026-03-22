import { LitElement, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import styles from "./sp-tab.css?inline";
import { tabTemplate } from "./sp-tab.template.js";

/**
 * Tab button component. Must be used inside sp-tabs.
 *
 * @element sp-tab
 *
 * @prop {string}         panel    - ID of the panel this tab activates
 * @prop {boolean}        disabled - Disables the tab
 * @prop {boolean}        active   - Whether this tab is currently active (set by sp-tabs)
 * @prop {string}         icon     - Optional icon text/emoji rendered before the label
 * @prop {string|number}  badge    - Optional badge count/label shown next to the label
 * @prop {boolean}        closable - Shows a close button; emits sp-tab-close when clicked
 *
 * @fires {CustomEvent<{ panel: string }>} sp-tab-click  - Emitted when the tab is clicked
 * @fires {CustomEvent<{ key: string }>}   sp-tab-close  - Emitted when the close button is clicked
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

  @property({ type: String })
  icon = "";

  @property()
  badge: string | number | undefined = undefined;

  @property({ type: Boolean, reflect: true })
  closable = false;

  override connectedCallback(): void {
    super.connectedCallback();
    if (!this.hasAttribute("tabindex")) {
      this.setAttribute("tabindex", this.active ? "0" : "-1");
    }
    if (this.panel && !this.id) {
      this.id = `tab-${this.panel}`;
    }
  }

  override updated(changed: Map<string, unknown>): void {
    if (changed.has("active")) {
      this.setAttribute("tabindex", this.active ? "0" : "-1");
    }
    if (changed.has("panel") && this.panel && !this.id) {
      this.id = `tab-${this.panel}`;
    }
  }

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

  readonly _handleClose = (e: Event) => {
    e.stopPropagation();
    this.dispatchEvent(
      new CustomEvent("sp-tab-close", {
        detail: { key: this.panel },
        bubbles: true,
        composed: true,
      }),
    );
  };
}

declare global {
  interface HTMLElementTagNameMap {
    "sp-tab": SpTabComponent;
  }
}

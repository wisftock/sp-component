import { LitElement, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import styles from "./sp-tabs.css?inline";
import { tabsTemplate } from "./sp-tabs.template.js";
import type { SpTabsPlacement } from "./sp-tabs.types.js";

/**
 * Tabs container component. Manages active tab and panel visibility.
 *
 * @element sp-tabs
 *
 * @prop {string}          active    - The panel name of the active tab
 * @prop {SpTabsPlacement} placement - Tab bar placement: top | bottom | left | right
 *
 * @fires {CustomEvent<{ panel: string }>} sp-tab-show - Emitted when the active tab changes
 *
 * @slot nav - Slot for sp-tab elements (tab buttons)
 * @slot     - Default slot for sp-tab-panel elements
 */
@customElement("sp-tabs")
export class SpTabsComponent extends LitElement {
  static override styles = unsafeCSS(styles);

  @property({ type: String, reflect: true })
  active = "";

  @property({ type: String, reflect: true })
  placement: SpTabsPlacement = "top";

  override render() {
    return tabsTemplate.call(this);
  }

  private _syncTabs() {
    const tabs = [...this.querySelectorAll("sp-tab")] as any[];
    const panels = [...this.querySelectorAll("sp-tab-panel")] as any[];
    tabs.forEach((tab) => {
      tab.active = tab.panel === this.active;
    });
    panels.forEach((panel) => {
      panel.hidden = panel.name !== this.active;
    });
  }

  override updated(changed: Map<string, unknown>) {
    if (changed.has("active")) this._syncTabs();
  }

  override connectedCallback() {
    super.connectedCallback();
    this.addEventListener("sp-tab-click", this._handleTabClick as EventListener);
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener("sp-tab-click", this._handleTabClick as EventListener);
  }

  private readonly _handleTabClick = (e: CustomEvent<{ panel: string }>) => {
    this.active = e.detail.panel;
    this.dispatchEvent(
      new CustomEvent("sp-tab-show", {
        detail: { panel: this.active },
        bubbles: true,
        composed: true,
      }),
    );
  };
}

declare global {
  interface HTMLElementTagNameMap {
    "sp-tabs": SpTabsComponent;
  }
}

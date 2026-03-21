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
    this.addEventListener("keydown", this._handleKeydown);
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener("sp-tab-click", this._handleTabClick as EventListener);
    this.removeEventListener("keydown", this._handleKeydown);
  }

  private readonly _handleKeydown = (e: KeyboardEvent): void => {
    const tabs = Array.from(this.querySelectorAll<HTMLElement>("sp-tab:not([disabled])"));
    if (tabs.length === 0) return;
    const focused = tabs.findIndex(t => t === document.activeElement);
    if (focused === -1) return;

    let next = focused;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      next = focused < tabs.length - 1 ? focused + 1 : 0;
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      next = focused > 0 ? focused - 1 : tabs.length - 1;
    } else if (e.key === "Home") {
      e.preventDefault();
      next = 0;
    } else if (e.key === "End") {
      e.preventDefault();
      next = tabs.length - 1;
    } else {
      return;
    }
    tabs[next]?.focus();
    const panel = tabs[next]?.getAttribute("panel") ?? "";
    if (panel) this._activateTab(panel);
  };

  private _activateTab(panel: string): void {
    this.active = panel;
    this.dispatchEvent(
      new CustomEvent("sp-tab-show", {
        detail: { panel: this.active },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private readonly _handleTabClick = (e: CustomEvent<{ panel: string }>) => {
    this._activateTab(e.detail.panel);
  };
}

declare global {
  interface HTMLElementTagNameMap {
    "sp-tabs": SpTabsComponent;
  }
}

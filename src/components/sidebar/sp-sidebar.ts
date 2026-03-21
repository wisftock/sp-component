import { LitElement, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import styles from "./sp-sidebar.css?inline";
import { sidebarTemplate } from "./sp-sidebar.template.js";
import type { SpSidebarPlacement } from "./sp-sidebar.types.js";

/**
 * Sidebar layout component with header, default, and footer slots.
 *
 * @element sp-sidebar
 *
 * @prop {boolean}            open        - Whether the sidebar is visible
 * @prop {SpSidebarPlacement} placement   - Side the sidebar appears on: left | right
 * @prop {string}             width       - CSS width of the sidebar (e.g. "240px")
 * @prop {boolean}            collapsible - Shows a toggle button to collapse/expand
 * @prop {boolean}            collapsed   - Whether the sidebar is collapsed to minimal width
 * @prop {boolean}            bordered    - Adds a border on the inner edge
 *
 * @fires {CustomEvent<{ open: boolean }>}      sp-toggle   - Emitted when open state changes
 * @fires {CustomEvent<{ collapsed: boolean }>} sp-collapse - Emitted when collapsed state changes
 *
 * @slot header  - Content at the top of the sidebar
 * @slot         - Main sidebar content
 * @slot footer  - Content pinned to the bottom
 */
@customElement("sp-sidebar")
export class SpSidebarComponent extends LitElement {
  static override styles = unsafeCSS(styles);

  @property({ type: Boolean, reflect: true })
  open = true;

  @property({ type: String, reflect: true })
  placement: SpSidebarPlacement = "left";

  @property({ type: String })
  width = "240px";

  @property({ type: Boolean, reflect: true })
  collapsible = false;

  @property({ type: Boolean, reflect: true })
  collapsed = false;

  @property({ type: Boolean, reflect: true })
  bordered = false;

  override render() {
    return sidebarTemplate.call(this);
  }

  _getSidebarStyle(): string {
    return `width: ${this.collapsed ? "60px" : this.width};`;
  }

  readonly _handleCollapse = (): void => {
    this.collapsed = !this.collapsed;
    this.dispatchEvent(
      new CustomEvent("sp-collapse", {
        detail: { collapsed: this.collapsed },
        bubbles: true,
        composed: true,
      }),
    );
  };
}

declare global {
  interface HTMLElementTagNameMap {
    "sp-sidebar": SpSidebarComponent;
  }
}

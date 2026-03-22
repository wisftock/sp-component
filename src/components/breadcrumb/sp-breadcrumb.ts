import { LitElement, unsafeCSS } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import styles from "./sp-breadcrumb.css?inline";
import { breadcrumbTemplate } from "./sp-breadcrumb.template.js";

/**
 * Breadcrumb navigation component.
 *
 * @element sp-breadcrumb
 *
 * @prop {string} separator - The separator shown between items (default "/")
 * @prop {number} maxItems  - Maximum items to show; when exceeded shows first + "..." + last items. 0 = no limit.
 *
 * @slot - Default slot for sp-breadcrumb-item elements
 */
@customElement("sp-breadcrumb")
export class SpBreadcrumbComponent extends LitElement {
  static override styles = unsafeCSS(styles);

  @property({ type: String })
  separator = "/";

  @property({ type: Number })
  maxItems = 0;

  @state()
  _expanded = false;

  override render() {
    return breadcrumbTemplate.call(this);
  }

  readonly _handleSlotChange = () => {
    const items = [...this.querySelectorAll("sp-breadcrumb-item")] as any[];
    items.forEach((item, index) => {
      item.separator = this.separator;
      item.active = index === items.length - 1;
    });
    this._applyOverflow();
  };

  _applyOverflow(): void {
    const items = [...this.querySelectorAll("sp-breadcrumb-item")] as HTMLElement[];
    if (this.maxItems <= 0 || this._expanded || items.length <= this.maxItems) {
      items.forEach((item) => item.removeAttribute("hidden"));
      return;
    }
    // Always show first item and last N items (maxItems - 1 + first)
    const keepCount = this.maxItems - 1; // how many from the end to keep (excluding first)
    const cutoffIndex = items.length - keepCount;
    items.forEach((item, index) => {
      if (index === 0 || index >= cutoffIndex) {
        item.removeAttribute("hidden");
      } else {
        item.setAttribute("hidden", "");
      }
    });
  }

  readonly _handleExpandClick = () => {
    this._expanded = true;
    this._applyOverflow();
  };

  override updated(changed: Map<string, unknown>) {
    if (changed.has("separator") || changed.has("maxItems") || changed.has("_expanded")) {
      this._handleSlotChange();
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "sp-breadcrumb": SpBreadcrumbComponent;
  }
}

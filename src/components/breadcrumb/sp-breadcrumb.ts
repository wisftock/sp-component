import { LitElement, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import styles from "./sp-breadcrumb.css?inline";
import { breadcrumbTemplate } from "./sp-breadcrumb.template.js";

/**
 * Breadcrumb navigation component.
 *
 * @element sp-breadcrumb
 *
 * @prop {string} separator - The separator shown between items (default "/")
 *
 * @slot - Default slot for sp-breadcrumb-item elements
 */
@customElement("sp-breadcrumb")
export class SpBreadcrumbComponent extends LitElement {
  static override styles = unsafeCSS(styles);

  @property({ type: String })
  separator = "/";

  override render() {
    return breadcrumbTemplate.call(this);
  }

  readonly _handleSlotChange = () => {
    const items = [...this.querySelectorAll("sp-breadcrumb-item")] as any[];
    items.forEach((item, index) => {
      item.separator = this.separator;
      item.active = index === items.length - 1;
    });
  };

  override updated(changed: Map<string, unknown>) {
    if (changed.has("separator")) this._handleSlotChange();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "sp-breadcrumb": SpBreadcrumbComponent;
  }
}

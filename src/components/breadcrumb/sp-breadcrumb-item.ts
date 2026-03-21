import { LitElement, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import styles from "./sp-breadcrumb-item.css?inline";
import { breadcrumbItemTemplate } from "./sp-breadcrumb-item.template.js";

/**
 * Breadcrumb item component. Must be used inside sp-breadcrumb.
 *
 * @element sp-breadcrumb-item
 *
 * @prop {string}  href      - Link URL (renders as anchor when set)
 * @prop {string}  target    - Link target (_blank, _self, etc.)
 * @prop {string}  rel       - Link rel attribute
 * @prop {boolean} active    - Whether this is the current/active item (set by sp-breadcrumb)
 * @prop {string}  separator - Separator character (set by sp-breadcrumb)
 *
 * @slot - Item label content
 */
@customElement("sp-breadcrumb-item")
export class SpBreadcrumbItemComponent extends LitElement {
  static override styles = unsafeCSS(styles);

  @property({ type: String })
  href = "";

  @property({ type: String })
  target = "";

  @property({ type: String })
  rel = "";

  @property({ type: Boolean, reflect: true })
  active = false;

  @property({ type: String })
  separator = "/";

  override render() {
    return breadcrumbItemTemplate.call(this);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "sp-breadcrumb-item": SpBreadcrumbItemComponent;
  }
}

import { LitElement, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import styles from "./sp-icon.css?inline";
import { iconTemplate } from "./sp-icon.template.js";
import type { SpIconSize } from "./sp-icon.types.js";

/**
 * Inline SVG icon component with built-in icon set.
 *
 * @element sp-icon
 *
 * @prop {string}      name   - Icon name (check, close, arrow-right, etc.)
 * @prop {SpIconSize}  size   - Size: xs | sm | md | lg | xl
 * @prop {string}      label  - Accessible aria-label (when empty, aria-hidden="true")
 * @prop {string}      color  - CSS color value for the icon stroke
 *
 * @cssprop [--sp-icon-color=currentColor] - Icon stroke color
 */
@customElement("sp-icon")
export class SpIconComponent extends LitElement {
  static override styles = unsafeCSS(styles);

  @property({ type: String })
  name: string = "";

  @property({ type: String, reflect: true })
  size: SpIconSize = "md";

  @property({ type: String })
  label: string = "";

  @property({ type: String })
  color: string = "";

  override render() {
    return iconTemplate.call(this);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "sp-icon": SpIconComponent;
  }
}

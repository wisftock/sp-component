import { LitElement, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import styles from "./sp-card.css?inline";
import { cardTemplate } from "./sp-card.template.js";
import type { SpCardShadow } from "./sp-card.types.js";

/**
 * A flexible card container component.
 *
 * @element sp-card
 *
 * @prop {SpCardShadow} shadow   - Shadow depth: none | sm | md | lg
 * @prop {boolean}      bordered - Adds a border around the card
 * @prop {string}       padding  - Inner padding (CSS value)
 *
 * @slot         - Default content area
 * @slot image   - Image placed at the top of the card
 * @slot header  - Card header content
 * @slot footer  - Card footer content
 */
@customElement("sp-card")
export class SpCardComponent extends LitElement {
  static override styles = unsafeCSS(styles);

  @property({ type: String, reflect: true })
  shadow: SpCardShadow = "sm";

  @property({ type: Boolean, reflect: true })
  bordered = false;

  @property({ type: String })
  padding = "16px";

  override render() {
    return cardTemplate.call(this);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "sp-card": SpCardComponent;
  }
}

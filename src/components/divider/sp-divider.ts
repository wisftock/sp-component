import { LitElement, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import styles from "./sp-divider.css?inline";
import { dividerTemplate } from "./sp-divider.template.js";
import type { SpDividerOrientation, SpDividerVariant } from "./sp-divider.types.js";

/**
 * A visual divider component that separates content horizontally or vertically.
 *
 * @element sp-divider
 *
 * @prop {SpDividerOrientation} orientation - Direction: horizontal | vertical
 * @prop {SpDividerVariant}     variant     - Line style: solid | dashed | dotted
 * @prop {string}               label       - Optional text label shown in the center of the divider
 */
@customElement("sp-divider")
export class SpDividerComponent extends LitElement {
  static override styles = unsafeCSS(styles);

  @property({ type: String, reflect: true })
  orientation: SpDividerOrientation = "horizontal";

  @property({ type: String, reflect: true })
  variant: SpDividerVariant = "solid";

  @property({ type: String })
  label = "";

  override render() {
    return dividerTemplate.call(this);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "sp-divider": SpDividerComponent;
  }
}

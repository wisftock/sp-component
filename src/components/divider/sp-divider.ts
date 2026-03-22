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

  /** Top/bottom margin in px for horizontal, left/right for vertical */
  @property({ type: Number })
  spacing: number | undefined = undefined;

  _getDividerStyle(): string {
    if (!this.spacing) return "";
    return this.orientation === "vertical"
      ? `margin-left: ${this.spacing}px; margin-right: ${this.spacing}px;`
      : `margin-top: ${this.spacing}px; margin-bottom: ${this.spacing}px;`;
  }

  override render() {
    return dividerTemplate.call(this);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "sp-divider": SpDividerComponent;
  }
}

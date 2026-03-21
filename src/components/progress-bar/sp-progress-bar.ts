import { LitElement, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import styles from "./sp-progress-bar.css?inline";
import { progressBarTemplate } from "./sp-progress-bar.template.js";
import type { SpProgressBarVariant } from "./sp-progress-bar.types.js";

/**
 * Progress bar component.
 *
 * @element sp-progress-bar
 *
 * @prop {number}                value         - Current value (0..max)
 * @prop {number}                max           - Maximum value (default 100)
 * @prop {SpProgressBarVariant}  variant       - Visual style: primary | success | warning | danger
 * @prop {boolean}               indeterminate - Shows an animated indeterminate state
 * @prop {string}                label         - Label displayed above the bar
 * @prop {boolean}               showValue     - Shows the percentage above the bar
 */
@customElement("sp-progress-bar")
export class SpProgressBarComponent extends LitElement {
  static override styles = unsafeCSS(styles);

  @property({ type: Number })
  value = 0;

  @property({ type: Number })
  max = 100;

  @property({ type: String, reflect: true })
  variant: SpProgressBarVariant = "primary";

  @property({ type: Boolean, reflect: true })
  indeterminate = false;

  @property({ type: String })
  label = "";

  @property({ type: Boolean, attribute: "show-value" })
  showValue = false;

  override render() {
    return progressBarTemplate.call(this);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "sp-progress-bar": SpProgressBarComponent;
  }
}

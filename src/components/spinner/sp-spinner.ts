import { LitElement, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import styles from "./sp-spinner.css?inline";
import { spinnerTemplate } from "./sp-spinner.template.js";
import type { SpSpinnerSize } from "./sp-spinner.types.js";

/**
 * Spinner component for indicating loading state.
 *
 * @element sp-spinner
 *
 * @prop {SpSpinnerSize} size  - Size: sm | md | lg | xl
 * @prop {string}        label - Accessible label (aria-label and sr-only text)
 */
@customElement("sp-spinner")
export class SpSpinnerComponent extends LitElement {
  static override styles = unsafeCSS(styles);

  @property({ type: String, reflect: true })
  size: SpSpinnerSize = "md";

  @property({ type: String })
  label = "Loading...";

  override render() {
    return spinnerTemplate.call(this);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "sp-spinner": SpSpinnerComponent;
  }
}

import { LitElement, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import styles from "./sp-visually-hidden.css?inline";
import { visuallyHiddenTemplate } from "./sp-visually-hidden.template.js";

/**
 * Visually hides content while keeping it accessible to screen readers.
 *
 * @element sp-visually-hidden
 *
 * @prop {boolean} focusable - When true, content becomes visible on focus (skip-link pattern)
 *
 * @slot - Content to be visually hidden
 */
@customElement("sp-visually-hidden")
export class SpVisuallyHiddenComponent extends LitElement {
  static override styles = unsafeCSS(styles);

  @property({ type: Boolean, reflect: true })
  focusable = false;

  override render() {
    return visuallyHiddenTemplate();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "sp-visually-hidden": SpVisuallyHiddenComponent;
  }
}

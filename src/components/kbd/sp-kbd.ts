import { LitElement, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import styles from "./sp-kbd.css?inline";
import { kbdTemplate } from "./sp-kbd.template.js";
import type { SpKbdSize } from "./sp-kbd.types.js";

/**
 * Keyboard key display component.
 *
 * @element sp-kbd
 *
 * @prop {SpKbdSize} size - Size: sm | md | lg
 *
 * @slot - The key label / content
 *
 * @csspart key - The inner <kbd> element
 */
@customElement("sp-kbd")
export class SpKbdComponent extends LitElement {
  static override styles = unsafeCSS(styles);

  @property({ type: String, reflect: true })
  size: SpKbdSize = "md";

  override render() {
    return kbdTemplate.call(this);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "sp-kbd": SpKbdComponent;
  }
}

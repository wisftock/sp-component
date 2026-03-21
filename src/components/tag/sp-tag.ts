import { LitElement, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import styles from "./sp-tag.css?inline";
import { tagTemplate } from "./sp-tag.template.js";
import type { SpTagVariant, SpTagSize } from "./sp-tag.types.js";

/**
 * A tag / chip component for labelling and categorisation.
 *
 * @element sp-tag
 *
 * @prop {SpTagVariant} variant   - Color variant: primary | secondary | success | warning | danger | neutral
 * @prop {SpTagSize}    size      - Size: sm | md | lg
 * @prop {boolean}      removable - Shows a remove (×) button
 * @prop {boolean}      disabled  - Disables the tag and hides the remove button
 *
 * @fires {CustomEvent} sp-remove - Emitted when the remove button is clicked
 *
 * @slot - Tag label content
 */
@customElement("sp-tag")
export class SpTagComponent extends LitElement {
  static override styles = unsafeCSS(styles);

  @property({ type: String, reflect: true })
  variant: SpTagVariant = "primary";

  @property({ type: String, reflect: true })
  size: SpTagSize = "md";

  @property({ type: Boolean, reflect: true })
  removable = false;

  @property({ type: Boolean, reflect: true })
  disabled = false;

  readonly _handleRemove = (e: Event): void => {
    e.stopPropagation();
    this.dispatchEvent(new CustomEvent("sp-remove", { bubbles: true, composed: true }));
  };

  override render() {
    return tagTemplate.call(this);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "sp-tag": SpTagComponent;
  }
}

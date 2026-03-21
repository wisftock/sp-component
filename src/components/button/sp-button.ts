import { LitElement, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import styles from "./sp-button.css?inline";
import { buttonTemplate } from "./sp-button.template.js";
import type { SpButtonVariant, SpButtonSize, SpButtonType } from "./sp-button.types.js";

/**
 * Reusable button component compatible with any web framework.
 *
 * @element sp-button
 *
 * @prop {SpButtonVariant} variant - Visual style: primary | secondary | ghost | destructive
 * @prop {SpButtonSize}    size    - Size: sm | md | lg
 * @prop {boolean}         disabled - Disables the button
 * @prop {string}          label   - Accessible aria-label (optional if slot text is descriptive)
 * @prop {SpButtonType}    type    - Native button type: button | submit | reset
 *
 * @fires {CustomEvent<{ source: string }>} sp-click - Emitted on click when not disabled
 *
 * @slot - Button label / content
 *
 * @csspart button - The inner <button> element (for ::part() styling)
 *
 * @cssprop [--sp-button-radius=4px]     - Border radius
 * @cssprop [--sp-button-font-size=14px] - Base font size (overridden per size variant)
 * @cssprop [--sp-button-transition=opacity .2s] - Hover/focus transition
 */
@customElement("sp-button")
export class SpButtonComponent extends LitElement {
  static override styles = unsafeCSS(styles);

  @property({ type: String, reflect: true })
  variant: SpButtonVariant = "primary";

  @property({ type: String, reflect: true })
  size: SpButtonSize = "md";

  @property({ type: Boolean, reflect: true })
  disabled = false;

  @property({ type: String })
  label = "";

  @property({ type: String })
  type: SpButtonType = "button";

  override render() {
    return buttonTemplate.call(this);
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.addEventListener("click", this._handleClick);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener("click", this._handleClick);
  }

  private readonly _handleClick = (e: Event): void => {
    if (this.disabled) {
      e.stopImmediatePropagation();
      return;
    }

    this.dispatchEvent(
      new CustomEvent("sp-click", {
        bubbles: true,
        composed: true,
        detail: { source: "sp-button" },
      }),
    );
  };
}

declare global {
  interface HTMLElementTagNameMap {
    "sp-button": SpButtonComponent;
  }
}

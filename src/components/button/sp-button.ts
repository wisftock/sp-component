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
 * @prop {SpButtonVariant} variant   - Visual style: primary | secondary | ghost | destructive
 * @prop {SpButtonSize}    size      - Size: sm | md | lg
 * @prop {boolean}         disabled  - Disables the button
 * @prop {boolean}         loading   - Shows a spinner and disables interaction
 * @prop {boolean}         fullWidth - Stretches the button to 100% of its container
 * @prop {string}          label     - Accessible aria-label
 * @prop {SpButtonType}    type      - Native button type: button | submit | reset
 * @prop {string}          href      - Renders as <a> when provided
 * @prop {string}          target    - Link target (_blank, _self, etc.) — used with href
 * @prop {string}          name      - Native button name for form submission
 * @prop {string}          value     - Native button value for form submission
 *
 * @fires {CustomEvent<{ source: string }>} sp-click - Emitted on click when not disabled/loading
 *
 * @slot          - Button label / content
 * @slot prefix   - Content before the label (e.g. icon)
 * @slot suffix   - Content after the label (e.g. icon)
 *
 * @csspart button - The inner <button> or <a> element
 *
 * @cssprop [--sp-button-radius=4px]               - Border radius
 * @cssprop [--sp-button-font-size=14px]            - Base font size
 * @cssprop [--sp-button-transition=opacity .2s]    - Hover/focus transition
 * @cssprop [--sp-button-spinner-size=1em]          - Loading spinner size
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

  @property({ type: Boolean, reflect: true })
  loading = false;

  @property({ type: Boolean, reflect: true, attribute: "full-width" })
  fullWidth = false;

  @property({ type: String })
  label = "";

  @property({ type: String })
  type: SpButtonType = "button";

  @property({ type: String })
  href = "";

  @property({ type: String })
  target = "";

  @property({ type: String })
  name = "";

  @property({ type: String })
  value = "";

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
    if (this.disabled || this.loading) {
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

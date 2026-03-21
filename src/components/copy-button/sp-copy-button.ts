import { LitElement, unsafeCSS } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import styles from "./sp-copy-button.css?inline";
import { copyButtonTemplate } from "./sp-copy-button.template.js";
import type { SpCopyButtonProps } from "./sp-copy-button.types.js";

/**
 * A button that copies text to the clipboard with visual feedback.
 *
 * @element sp-copy-button
 *
 * @prop {string}  text             - Text to copy to the clipboard
 * @prop {number}  successDuration  - Duration in ms to show success state (default 2000)
 * @prop {string}  label            - Default button label
 * @prop {string}  successLabel     - Label shown after successful copy
 * @prop {string}  size             - Size: sm | md | lg
 * @prop {string}  variant          - Variant: primary | secondary | ghost
 * @prop {boolean} disabled         - Disables the button
 *
 * @fires {CustomEvent<{ text: string }>} sp-copy - Emitted after text is copied
 *
 * @cssprop [--sp-copy-button-radius=4px] - Border radius
 */
@customElement("sp-copy-button")
export class SpCopyButtonComponent extends LitElement implements SpCopyButtonProps {
  static override styles = unsafeCSS(styles);

  @property({ type: String })
  text: string = "";

  @property({ type: Number, attribute: "success-duration" })
  successDuration: number = 2000;

  @property({ type: String })
  label: string = "Copy";

  @property({ type: String, attribute: "success-label" })
  successLabel: string = "Copied!";

  @property({ type: String, reflect: true })
  size: SpCopyButtonProps["size"] = "md";

  @property({ type: String, reflect: true })
  variant: SpCopyButtonProps["variant"] = "ghost";

  @property({ type: Boolean, reflect: true })
  disabled: boolean = false;

  @state()
  _copied: boolean = false;

  private _timeoutId: ReturnType<typeof setTimeout> | null = null;

  readonly _handleClick = async (): Promise<void> => {
    if (this.disabled) return;

    try {
      await navigator.clipboard.writeText(this.text);
    } catch {
      return;
    }

    if (this._timeoutId !== null) {
      clearTimeout(this._timeoutId);
    }

    this._copied = true;

    this.dispatchEvent(
      new CustomEvent("sp-copy", {
        bubbles: true,
        composed: true,
        detail: { text: this.text },
      }),
    );

    this._timeoutId = setTimeout(() => {
      this._copied = false;
      this._timeoutId = null;
    }, this.successDuration);
  };

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    if (this._timeoutId !== null) {
      clearTimeout(this._timeoutId);
    }
  }

  override render() {
    return copyButtonTemplate.call(this);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "sp-copy-button": SpCopyButtonComponent;
  }
}

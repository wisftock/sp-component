import { LitElement, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import styles from "./sp-alert.css?inline";
import { alertTemplate } from "./sp-alert.template.js";
import type { SpAlertVariant } from "./sp-alert.types.js";

/**
 * Alert component for displaying contextual feedback messages.
 *
 * @element sp-alert
 *
 * @prop {SpAlertVariant} variant     - Visual style: info | success | warning | error
 * @prop {string}         title       - Optional bold title above the message
 * @prop {boolean}        dismissible - Shows a close button when true
 * @prop {boolean}        open        - Controls visibility of the alert
 *
 * @fires {CustomEvent} sp-close - Emitted when the dismiss button is clicked
 *
 * @slot - Alert message content
 */
@customElement("sp-alert")
export class SpAlertComponent extends LitElement {
  static override styles = unsafeCSS(styles);

  @property({ type: String, reflect: true })
  variant: SpAlertVariant = "info";

  @property({ type: String })
  title = "";

  @property({ type: Boolean, reflect: true })
  dismissible = false;

  @property({ type: Boolean, reflect: true })
  open = true;

  override render() {
    return alertTemplate.call(this);
  }

  /** Returns aria role based on variant urgency */
  _getRole(): string {
    return this.variant === "error" || this.variant === "warning" ? "alert" : "status";
  }

  readonly _handleClose = () => {
    this.open = false;
    this.dispatchEvent(new CustomEvent("sp-close", { bubbles: true, composed: true }));
  };
}

declare global {
  interface HTMLElementTagNameMap {
    "sp-alert": SpAlertComponent;
  }
}

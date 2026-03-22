import { LitElement, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import styles from "./sp-toast.css?inline";
import { toastTemplate } from "./sp-toast.template.js";
import type { SpToastVariant, SpToastPosition } from "./sp-toast.types.js";

/**
 * Toast notification component.
 *
 * @element sp-toast
 *
 * @prop {SpToastVariant}  variant      - Visual style: neutral | info | success | warning | error
 * @prop {string}          message      - Toast message text
 * @prop {number}          duration     - Auto-close delay in ms (0 = no auto close)
 * @prop {SpToastPosition} position     - Position hint for a toast container
 * @prop {boolean}         open         - Controls visibility
 * @prop {boolean}         closable     - Shows a close button when true
 * @prop {string}          action       - Label for action button/link at end of toast
 * @prop {string}          actionHref   - When set, renders action as an anchor instead of a button
 * @prop {boolean}         pauseOnHover - Pause auto-dismiss timer and progress bar on mouse hover
 *
 * @fires {CustomEvent} sp-show       - Emitted when toast opens
 * @fires {CustomEvent} sp-hide       - Emitted when toast closes
 * @fires {CustomEvent} sp-after-hide - Emitted 300ms after toast closes
 * @fires {CustomEvent} sp-action     - Emitted when action button/link is clicked
 *
 * @slot - Additional message content
 */
@customElement("sp-toast")
export class SpToastComponent extends LitElement {
  static override styles = unsafeCSS(styles);

  @property({ type: String, reflect: true })
  variant: SpToastVariant = "neutral";

  @property({ type: String })
  message = "";

  @property({ type: Number })
  duration = 4000;

  @property({ type: String, reflect: true })
  position: SpToastPosition = "top-right";

  @property({ type: Boolean, reflect: true })
  open = false;

  @property({ type: Boolean, reflect: true })
  closable = true;

  @property({ type: String })
  action = "";

  @property({ type: String })
  actionHref = "";

  @property({ type: Boolean })
  pauseOnHover = false;

  private _timer: ReturnType<typeof setTimeout> | null = null;
  private _pausedAt: number | null = null;
  private _remainingTime = 0;
  private _startTime = 0;

  override updated(changed: Map<string, unknown>) {
    if (changed.has("open")) {
      if (this.open) {
        this.dispatchEvent(new CustomEvent("sp-show", { bubbles: true, composed: true }));
        if (this.duration > 0) {
          this._remainingTime = this.duration;
          this._startTimer();
        }
      } else {
        this._clearTimer();
      }
    }
  }

  private _startTimer(): void {
    this._clearTimer();
    this._startTime = Date.now();
    this._timer = setTimeout(() => this._close(), this._remainingTime);
  }

  private _clearTimer(): void {
    if (this._timer) {
      clearTimeout(this._timer);
      this._timer = null;
    }
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this._clearTimer();
  }

  private _close() {
    this.open = false;
    this.dispatchEvent(new CustomEvent("sp-hide", { bubbles: true, composed: true }));
    setTimeout(
      () => this.dispatchEvent(new CustomEvent("sp-after-hide", { bubbles: true, composed: true })),
      300,
    );
  }

  readonly _handleClose = () => this._close();

  readonly _handleActionClick = (e: Event) => {
    e.preventDefault();
    this.dispatchEvent(new CustomEvent("sp-action", { bubbles: true, composed: true }));
  };

  readonly _handleMouseEnter = () => {
    if (!this.pauseOnHover || !this.open || this.duration <= 0) return;
    if (this._timer) {
      const elapsed = Date.now() - this._startTime;
      this._remainingTime = Math.max(0, this._remainingTime - elapsed);
      this._clearTimer();
    }
  };

  readonly _handleMouseLeave = () => {
    if (!this.pauseOnHover || !this.open || this.duration <= 0) return;
    if (!this._timer && this._remainingTime > 0) {
      this._startTimer();
    }
  };

  /** Returns the unicode icon character for the current variant. */
  _getIcon(): string {
    const icons: Record<SpToastVariant, string> = {
      neutral: "\u2022",
      info: "\u2139",
      success: "\u2713",
      warning: "\u26A0",
      error: "\u2715",
    };
    return icons[this.variant];
  }

  override render() {
    return toastTemplate.call(this);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "sp-toast": SpToastComponent;
  }
}

import { LitElement, unsafeCSS } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import styles from "./sp-badge.css?inline";
import { badgeTemplate } from "./sp-badge.template.js";
import type { SpBadgeVariant } from "./sp-badge.types.js";

/**
 * A small status badge component.
 *
 * @element sp-badge
 *
 * @prop {SpBadgeVariant} variant   - Color variant: primary | secondary | success | warning | danger | neutral
 * @prop {boolean}        pill      - Renders with fully rounded corners
 * @prop {boolean}        pulsing   - Applies a pulsing opacity animation
 * @prop {number}         max       - Max numeric value before showing "99+" (default 99)
 * @prop {boolean}        removable - Show × remove button, emits sp-remove
 *
 * @fires {CustomEvent} sp-remove - Emitted when the remove button is clicked
 *
 * @slot - Badge label content
 */
@customElement("sp-badge")
export class SpBadgeComponent extends LitElement {
  static override styles = unsafeCSS(styles);

  @property({ type: String, reflect: true })
  variant: SpBadgeVariant = "primary";

  @property({ type: Boolean, reflect: true })
  pill = false;

  @property({ type: Boolean, reflect: true })
  pulsing = false;

  @property({ type: Number })
  max = 99;

  @property({ type: Boolean, reflect: true })
  removable = false;

  @state()
  _prevContent = "";

  @state()
  _animating = false;

  /** Returns the capped display label when the slotted text is a number exceeding `max`. */
  _getDisplayContent(rawText: string): string {
    const num = Number(rawText.trim());
    if (!Number.isNaN(num) && num > this.max) {
      return `${this.max}+`;
    }
    return rawText;
  }

  readonly _handleRemove = (e: Event): void => {
    e.stopPropagation();
    this.dispatchEvent(new CustomEvent("sp-remove", { bubbles: true, composed: true }));
  };

  readonly _handleSlotChange = (e: Event): void => {
    const slot = e.target as HTMLSlotElement;
    const text = slot.assignedNodes().map((n) => n.textContent ?? "").join("").trim();
    if (text !== this._prevContent) {
      this._animating = true;
      this._prevContent = text;
      setTimeout(() => { this._animating = false; this.requestUpdate(); }, 200);
    }
  };

  override render() {
    return badgeTemplate.call(this);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "sp-badge": SpBadgeComponent;
  }
}

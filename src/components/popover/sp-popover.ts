import { LitElement, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import styles from "./sp-popover.css?inline";
import { popoverTemplate } from "./sp-popover.template.js";
import type { SpPopoverPlacement } from "./sp-popover.types.js";

/**
 * Popover component that shows rich content anchored to a trigger element.
 *
 * @element sp-popover
 *
 * @prop {boolean}             open      - Whether the popover is open
 * @prop {SpPopoverPlacement}  placement - Position: top | bottom | left | right
 * @prop {number}              distance  - Gap in px between trigger and popover
 * @prop {boolean}             arrow     - Shows a directional arrow when true
 *
 * @fires {CustomEvent} sp-show - Emitted when the popover opens
 * @fires {CustomEvent} sp-hide - Emitted when the popover closes
 *
 * @slot trigger - The element that triggers the popover
 * @slot         - The popover body content
 */
@customElement("sp-popover")
export class SpPopoverComponent extends LitElement {
  static override styles = unsafeCSS(styles);

  @property({ type: Boolean, reflect: true })
  open = false;

  @property({ type: String, reflect: true })
  placement: SpPopoverPlacement = "bottom";

  @property({ type: Number })
  distance = 8;

  @property({ type: Boolean })
  arrow = true;

  override render() {
    return popoverTemplate.call(this);
  }

  override connectedCallback() {
    super.connectedCallback();
    document.addEventListener("click", this._handleDocumentClick);
    document.addEventListener("keydown", this._handleKeydown);
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener("click", this._handleDocumentClick);
    document.removeEventListener("keydown", this._handleKeydown);
  }

  _getPopoverStyle(): string {
    const d = `${this.distance + (this.arrow ? 6 : 0)}px`;
    const positions: Record<SpPopoverPlacement, string> = {
      top: `bottom: calc(100% + ${d}); left: 50%; transform: translateX(-50%);`,
      bottom: `top: calc(100% + ${d}); left: 50%; transform: translateX(-50%);`,
      left: `right: calc(100% + ${d}); top: 50%; transform: translateY(-50%);`,
      right: `left: calc(100% + ${d}); top: 50%; transform: translateY(-50%);`,
    };
    return positions[this.placement];
  }

  readonly _handleTriggerClick = () => {
    this.open = !this.open;
    this.dispatchEvent(
      new CustomEvent(this.open ? "sp-show" : "sp-hide", {
        bubbles: true,
        composed: true,
      }),
    );
  };

  private readonly _handleKeydown = (e: KeyboardEvent): void => {
    if (e.key === "Escape" && this.open) {
      e.stopPropagation();
      this.open = false;
      this.dispatchEvent(new CustomEvent("sp-hide", { bubbles: true, composed: true }));
    }
  };

  readonly _handleDocumentClick = (e: MouseEvent) => {
    if (!e.composedPath().includes(this) && this.open) {
      this.open = false;
      this.dispatchEvent(
        new CustomEvent("sp-hide", { bubbles: true, composed: true }),
      );
    }
  };
}

declare global {
  interface HTMLElementTagNameMap {
    "sp-popover": SpPopoverComponent;
  }
}

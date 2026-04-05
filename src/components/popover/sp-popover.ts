import { LitElement, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import styles from "./sp-popover.css?inline";
import { popoverTemplate } from "./sp-popover.template.js";
import type { SpPopoverPlacement } from "./sp-popover.types.js";
import { setupFloating } from "../../utils/floating.js";

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

  #cleanupFloating?: () => void;

  override render() {
    return popoverTemplate.call(this);
  }

  override connectedCallback() {
    super.connectedCallback();
    document.addEventListener("click", this._handleDocumentClick);
    document.addEventListener("keydown", this._handleKeydown);
    void this.updateComplete.then(() => this.#initFloating());
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.#cleanupFloating?.();
    document.removeEventListener("click", this._handleDocumentClick);
    document.removeEventListener("keydown", this._handleKeydown);
  }

  #initFloating() {
    this.#cleanupFloating?.();
    const floating = this.shadowRoot?.querySelector<HTMLElement>(".sp-popover");
    const trigger = this.shadowRoot?.querySelector<HTMLElement>(".sp-popover-trigger");
    if (!floating || !trigger) return;
    const arrowEl = this.arrow ? this.shadowRoot?.querySelector<HTMLElement>(".sp-popover-arrow") ?? null : null;
    this.#cleanupFloating = setupFloating({
      reference: trigger,
      floating,
      placement: this.placement,
      distance: this.distance + (this.arrow ? 6 : 0),
      arrowEl,
    });
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

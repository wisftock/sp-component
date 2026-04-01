import { LitElement, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import styles from "./sp-modal.css?inline";
import { modalTemplate } from "./sp-modal.template.js";
import type { SpModalSize } from "./sp-modal.types.js";

/**
 * Modal dialog component built on the native <dialog> element.
 *
 * @element sp-modal
 *
 * @prop {boolean}      open           - Whether the modal is open
 * @prop {string}       label          - Accessible aria-label for the dialog
 * @prop {SpModalSize}  size           - Size: sm | md | lg | xl | full
 * @prop {boolean}      closable       - Shows a close button when true
 * @prop {boolean}      closeOnOverlay - Closes when clicking the backdrop
 *
 * @fires {CustomEvent} sp-show       - Emitted when the modal opens
 * @fires {CustomEvent} sp-hide       - Emitted when the modal closes
 * @fires {CustomEvent} sp-after-hide - Emitted 300ms after the modal closes
 *
 * @slot          - Main body content
 * @slot header   - Header content
 * @slot footer   - Footer content (e.g. action buttons)
 */
@customElement("sp-modal")
export class SpModalComponent extends LitElement {
  static override styles = unsafeCSS(styles);

  @property({ type: Boolean, reflect: true })
  open = false;

  @property({ type: String })
  label = "";

  @property({ type: String, reflect: true })
  size: SpModalSize = "md";

  @property({ type: Boolean, reflect: true })
  closable = true;

  @property({ type: Boolean, attribute: "close-on-overlay" })
  closeOnOverlay = true;

  private _previousFocus: Element | null = null;
  private _afterHideTimer: ReturnType<typeof setTimeout> | null = null;

  private _getFocusableElements(): HTMLElement[] {
    const dialog = this.shadowRoot?.querySelector("dialog");
    if (!dialog) return [];
    const selector =
      'a[href], button:not([disabled]), input:not([disabled]), ' +
      'select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

    // Elements inside the shadow DOM (e.g. close button)
    const shadowEls = Array.from(
      dialog.querySelectorAll<HTMLElement>(selector)
    ).filter(el => !el.closest("[hidden]"));

    // Elements from light DOM slots (e.g. footer buttons)
    const slottedEls: HTMLElement[] = [];
    dialog.querySelectorAll("slot").forEach(slotEl => {
      (slotEl as HTMLSlotElement).assignedElements({ flatten: true }).forEach(assigned => {
        if ((assigned as HTMLElement).matches?.(selector) && !assigned.closest("[hidden]")) {
          slottedEls.push(assigned as HTMLElement);
        }
        assigned.querySelectorAll<HTMLElement>(selector).forEach(child => {
          if (!child.closest("[hidden]")) slottedEls.push(child);
        });
      });
    });

    return [...shadowEls, ...slottedEls];
  }

  private _closeReason: "escape" | "overlay" | "button" = "button";

  private _handleKeydown = (e: KeyboardEvent): void => {
    if (!this.open) return;
    if (e.key === "Escape") {
      e.preventDefault();
      this._closeReason = "escape";
      this.open = false;
      return;
    }
    if (e.key === "Tab") {
      const focusable = this._getFocusableElements();
      if (focusable.length === 0) { e.preventDefault(); return; }
      const first = focusable[0]!;
      const last = focusable[focusable.length - 1]!;
      // Active element is in shadow DOM for shadow elements, in document for slotted ones
      const active = (this.shadowRoot?.activeElement ?? document.activeElement) as HTMLElement;
      if (e.shiftKey) {
        if (active === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (active === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
  };

  override connectedCallback() {
    super.connectedCallback();
    document.addEventListener("keydown", this._handleKeydown);
    window.addEventListener("pagehide", this._handlePageHide);
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener("keydown", this._handleKeydown);
    window.removeEventListener("pagehide", this._handlePageHide);
    document.body.style.overflow = "";
    if (this._afterHideTimer !== null) {
      clearTimeout(this._afterHideTimer);
      this._afterHideTimer = null;
    }
  }

  // Reset when navigating away so bfcache doesn't restore an open modal
  private readonly _handlePageHide = () => {
    if (this.open) {
      this.open = false;
      document.body.style.overflow = "";
    }
  };

  override render() {
    return modalTemplate.call(this);
  }

  override updated(changed: Map<string, unknown>) {
    if (changed.has("open")) {
      // Skip on first render when transitioning undefined → false
      if (!this.open && changed.get("open") === undefined) return;

      const dialog = this.shadowRoot?.querySelector("dialog");
      if (!dialog) return;
      if (this.open) {
        // Cancel any pending sp-after-hide from a previous close
        if (this._afterHideTimer !== null) {
          clearTimeout(this._afterHideTimer);
          this._afterHideTimer = null;
        }
        document.body.style.overflow = "hidden";
        this._previousFocus = document.activeElement;
        dialog.showModal();
        this.dispatchEvent(
          new CustomEvent("sp-show", { bubbles: true, composed: true }),
        );
        this.updateComplete.then(() => {
          const els = this._getFocusableElements();
          els[0]?.focus();
        });
      } else {
        document.body.style.overflow = "";
        if (dialog.open) dialog.close();
        this.dispatchEvent(
          new CustomEvent("sp-hide", {
            detail: { reason: this._closeReason },
            bubbles: true,
            composed: true,
          }),
        );
        this._closeReason = "button";
        (this._previousFocus as HTMLElement)?.focus?.();
        this._previousFocus = null;
        this._afterHideTimer = setTimeout(() => {
          this._afterHideTimer = null;
          this.dispatchEvent(
            new CustomEvent("sp-after-hide", { bubbles: true, composed: true }),
          );
        }, 300);
      }
    }
  }

  readonly _handleClose = () => {
    this._closeReason = "button";
    this.open = false;
  };

  readonly _handleOverlayClick = (e: MouseEvent) => {
    if (this.closeOnOverlay && e.target === e.currentTarget) {
      this._closeReason = "overlay";
      this.open = false;
    }
  };
}

declare global {
  interface HTMLElementTagNameMap {
    "sp-modal": SpModalComponent;
  }
}

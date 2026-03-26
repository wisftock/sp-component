import { LitElement, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import styles from "./sp-drawer.css?inline";
import { drawerTemplate } from "./sp-drawer.template.js";
import type { SpDrawerPlacement } from "./sp-drawer.types.js";

/**
 * Drawer (slide-in panel) component built on the native <dialog> element.
 *
 * @element sp-drawer
 *
 * @prop {boolean}            open           - Whether the drawer is open
 * @prop {string}             label          - Accessible aria-label for the dialog
 * @prop {SpDrawerPlacement}  placement      - Slide-in direction: left | right | top | bottom
 * @prop {string}             size           - Width (left/right) or height (top/bottom) of the panel
 * @prop {boolean}            closable       - Shows a close button when true
 * @prop {boolean}            closeOnOverlay - Closes when clicking the backdrop
 *
 * @fires {CustomEvent} sp-show       - Emitted when the drawer opens
 * @fires {CustomEvent} sp-hide       - Emitted when the drawer closes
 * @fires {CustomEvent} sp-after-hide - Emitted 300ms after the drawer closes
 *
 * @slot          - Main body content
 * @slot header   - Header content
 * @slot footer   - Footer content
 */
@customElement("sp-drawer")
export class SpDrawerComponent extends LitElement {
  static override styles = unsafeCSS(styles);

  @property({ type: Boolean, reflect: true })
  open = false;

  @property({ type: String })
  label = "";

  @property({ type: String, reflect: true })
  placement: SpDrawerPlacement = "right";

  @property({ type: String })
  size = "320px";

  @property({ type: Boolean, reflect: true })
  closable = true;

  @property({ type: Boolean, attribute: "close-on-overlay" })
  closeOnOverlay = true;

  private _previousFocus: Element | null = null;
  private _touchStartX = 0;
  private _touchStartY = 0;
  private _afterHideTimer: ReturnType<typeof setTimeout> | null = null;
  private _closeTimer: ReturnType<typeof setTimeout> | null = null;
  private static readonly ANIM_DURATION = 250;

  private _getFocusableElements(): HTMLElement[] {
    const dialog = this.shadowRoot?.querySelector("dialog");
    if (!dialog) return [];
    return Array.from(
      dialog.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
    ).filter(el => !el.closest('[hidden]'));
  }

  private _handleKeydown = (e: KeyboardEvent): void => {
    if (!this.open) return;
    if (e.key === "Escape") {
      e.preventDefault();
      this.open = false;
      return;
    }
    if (e.key === "Tab") {
      const focusable = this._getFocusableElements();
      if (focusable.length === 0) { e.preventDefault(); return; }
      const first = focusable[0]!;
      const last = focusable[focusable.length - 1]!;
      if (e.shiftKey) {
        if (document.activeElement === first || this.shadowRoot?.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last || this.shadowRoot?.activeElement === last) {
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
    const dialog = this.shadowRoot?.querySelector("dialog");
    if (dialog) {
      dialog.removeEventListener("touchstart", this._handleTouchStart);
      dialog.removeEventListener("touchend", this._handleTouchEnd);
    }
    if (this._closeTimer !== null) { clearTimeout(this._closeTimer); this._closeTimer = null; }
    if (this._afterHideTimer !== null) { clearTimeout(this._afterHideTimer); this._afterHideTimer = null; }
  }

  private readonly _handlePageHide = () => {
    if (this.open) {
      this.open = false;
      document.body.style.overflow = "";
    }
  };

  override render() {
    return drawerTemplate.call(this);
  }

  override updated(changed: Map<string, unknown>) {
    if (changed.has("open")) {
      // Skip on first render when transitioning undefined → false
      if (!this.open && changed.get("open") === undefined) return;

      const dialog = this.shadowRoot?.querySelector("dialog");
      if (!dialog) return;
      if (this.open) {
        document.body.style.overflow = "hidden";
        this._previousFocus = document.activeElement;
        dialog.showModal();
        dialog.addEventListener("touchstart", this._handleTouchStart, { passive: true });
        dialog.addEventListener("touchend", this._handleTouchEnd, { passive: true });
        this.dispatchEvent(
          new CustomEvent("sp-show", { bubbles: true, composed: true }),
        );
        this.updateComplete.then(() => {
          const els = this._getFocusableElements();
          els[0]?.focus();
        });
      } else {
        // Cancel pending close if somehow retriggered
        if (this._closeTimer !== null) { clearTimeout(this._closeTimer); this._closeTimer = null; }

        // Play close animation, then actually close
        this.setAttribute("closing", "");
        const prev = this._previousFocus;
        this._previousFocus = null;
        dialog.removeEventListener("touchstart", this._handleTouchStart);
        dialog.removeEventListener("touchend", this._handleTouchEnd);

        this._closeTimer = setTimeout(() => {
          this._closeTimer = null;
          this.removeAttribute("closing");
          document.body.style.overflow = "";
          if (dialog.open) dialog.close();
          this.dispatchEvent(
            new CustomEvent("sp-hide", { bubbles: true, composed: true }),
          );
          (prev as HTMLElement)?.focus?.();

          if (this._afterHideTimer !== null) { clearTimeout(this._afterHideTimer); this._afterHideTimer = null; }
          this._afterHideTimer = setTimeout(() => {
            this._afterHideTimer = null;
            this.dispatchEvent(
              new CustomEvent("sp-after-hide", { bubbles: true, composed: true }),
            );
          }, 50);
        }, SpDrawerComponent.ANIM_DURATION);
      }
    }
  }

  private readonly _handleTouchStart = (e: TouchEvent): void => {
    const touch = e.touches[0];
    if (!touch) return;
    this._touchStartX = touch.clientX;
    this._touchStartY = touch.clientY;
  };

  private readonly _handleTouchEnd = (e: TouchEvent): void => {
    const touch = e.changedTouches[0];
    if (!touch) return;
    const dx = touch.clientX - this._touchStartX;
    const dy = touch.clientY - this._touchStartY;
    const THRESHOLD = 80;

    let shouldClose = false;
    if (this.placement === "right" && dx > THRESHOLD && Math.abs(dy) < Math.abs(dx)) {
      shouldClose = true;
    } else if (this.placement === "left" && dx < -THRESHOLD && Math.abs(dy) < Math.abs(dx)) {
      shouldClose = true;
    } else if (this.placement === "bottom" && dy > THRESHOLD && Math.abs(dx) < Math.abs(dy)) {
      shouldClose = true;
    } else if (this.placement === "top" && dy < -THRESHOLD && Math.abs(dx) < Math.abs(dy)) {
      shouldClose = true;
    }

    if (shouldClose) {
      this.open = false;
    }
  };

  _getPanelStyle(): string {
    if (this.placement === "left" || this.placement === "right") {
      return `width: ${this.size}; max-width: 100vw;`;
    }
    return `height: ${this.size}; max-height: 100vh; width: 100%;`;
  }

  readonly _handleClose = () => {
    this.open = false;
  };

  readonly _handleOverlayClick = (e: MouseEvent) => {
    if (this.closeOnOverlay && e.target === e.currentTarget) this.open = false;
  };
}

declare global {
  interface HTMLElementTagNameMap {
    "sp-drawer": SpDrawerComponent;
  }
}

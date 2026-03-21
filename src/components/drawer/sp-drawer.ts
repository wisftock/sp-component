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
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener("keydown", this._handleKeydown);
  }

  override render() {
    return drawerTemplate.call(this);
  }

  override updated(changed: Map<string, unknown>) {
    if (changed.has("open")) {
      const dialog = this.shadowRoot?.querySelector("dialog");
      if (!dialog) return;
      if (this.open) {
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
        dialog.close();
        this.dispatchEvent(
          new CustomEvent("sp-hide", { bubbles: true, composed: true }),
        );
        (this._previousFocus as HTMLElement)?.focus?.();
        this._previousFocus = null;
        setTimeout(
          () =>
            this.dispatchEvent(
              new CustomEvent("sp-after-hide", { bubbles: true, composed: true }),
            ),
          300,
        );
      }
    }
  }

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

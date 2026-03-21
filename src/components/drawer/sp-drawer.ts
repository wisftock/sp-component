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

  override render() {
    return drawerTemplate.call(this);
  }

  override updated(changed: Map<string, unknown>) {
    if (changed.has("open")) {
      const dialog = this.shadowRoot?.querySelector("dialog");
      if (!dialog) return;
      if (this.open) {
        dialog.showModal();
        this.dispatchEvent(
          new CustomEvent("sp-show", { bubbles: true, composed: true }),
        );
      } else {
        dialog.close();
        this.dispatchEvent(
          new CustomEvent("sp-hide", { bubbles: true, composed: true }),
        );
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

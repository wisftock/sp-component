import { LitElement, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import styles from "./sp-confirm-dialog.css?inline";
import { confirmDialogTemplate } from "./sp-confirm-dialog.template.js";
import { SpConfig } from "../../config.js";
import type { SpConfirmDialogVariant } from "./sp-confirm-dialog.types.js";

/**
 * Confirm dialog component built on the native <dialog> element.
 *
 * @element sp-confirm-dialog
 *
 * @prop {boolean}                  open          - Whether the dialog is open
 * @prop {string}                   title         - Dialog title
 * @prop {string}                   message       - Dialog message
 * @prop {string}                   confirmLabel  - Confirm button label
 * @prop {string}                   cancelLabel   - Cancel button label
 * @prop {SpConfirmDialogVariant}   variant       - "default" | "destructive"
 * @prop {boolean}                  hideCancel    - Hide the cancel button
 *
 * @fires {CustomEvent} sp-confirm - Emitted when confirmed
 * @fires {CustomEvent} sp-cancel  - Emitted when cancelled
 */
@customElement("sp-confirm-dialog")
export class SpConfirmDialogComponent extends LitElement {
  static override styles = unsafeCSS(styles);

  @property({ type: Boolean, reflect: true })
  open = false;

  @property({ type: String })
  title = "Confirm";

  @property({ type: String })
  message = "";

  @property({ type: String, attribute: "confirm-label" })
  confirmLabel = "";

  @property({ type: String, attribute: "cancel-label" })
  cancelLabel = "";

  @property({ type: String, reflect: true })
  variant: SpConfirmDialogVariant = "default";

  @property({ type: Boolean, attribute: "hide-cancel" })
  hideCancel = false;

  private _resolvePromise: ((value: boolean) => void) | null = null;

  override render() {
    return confirmDialogTemplate.call(this);
  }

  override updated(changed: Map<string, unknown>) {
    if (changed.has("open")) {
      const dialog = this.shadowRoot?.querySelector("dialog") as HTMLDialogElement | null;
      if (!dialog) return;
      if (this.open) {
        dialog.showModal();
        this.updateComplete.then(() => {
          const confirmBtn = this.shadowRoot?.querySelector<HTMLButtonElement>(".sp-confirm-ok");
          confirmBtn?.focus();
        });
      } else {
        if (dialog.open) {
          dialog.close();
        }
      }
    }
  }

  readonly _confirm = () => {
    this.open = false;
    this.dispatchEvent(
      new CustomEvent("sp-confirm", { bubbles: true, composed: true }),
    );
    this._resolvePromise?.(true);
    this._resolvePromise = null;
  };

  readonly _cancel = () => {
    this.open = false;
    this.dispatchEvent(
      new CustomEvent("sp-cancel", { bubbles: true, composed: true }),
    );
    this._resolvePromise?.(false);
    this._resolvePromise = null;
  };

  readonly _handleBackdropClick = (e: MouseEvent) => {
    // If click target is the <dialog> itself (not the panel), it's a backdrop click
    if (e.target === e.currentTarget) {
      this._cancel();
    }
  };

  readonly _handleNativeCancel = (e: Event) => {
    // Intercept native ESC cancel event to emit our own sp-cancel
    e.preventDefault();
    this._cancel();
  };

  /**
   * Programmatic confirm dialog.
   * Creates a temporary element, appends to body, returns a Promise<boolean>.
   */
  static confirm(options: {
    title?: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    variant?: SpConfirmDialogVariant;
  }): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      const dialog = document.createElement("sp-confirm-dialog") as SpConfirmDialogComponent;
      dialog.title = options.title ?? "Confirm";
      dialog.message = options.message;
      if (options.confirmLabel) dialog.confirmLabel = options.confirmLabel;
      if (options.cancelLabel) dialog.cancelLabel = options.cancelLabel;
      if (options.variant) dialog.variant = options.variant;

      dialog._resolvePromise = resolve;

      document.body.appendChild(dialog);

      // Open after append so updated() can call showModal()
      requestAnimationFrame(() => {
        dialog.open = true;
      });

      const cleanup = (result: boolean) => {
        resolve(result);
        dialog.removeEventListener("sp-confirm", onConfirm);
        dialog.removeEventListener("sp-cancel", onCancel);
        dialog.remove();
      };

      const onConfirm = () => cleanup(true);
      const onCancel = () => cleanup(false);

      dialog.addEventListener("sp-confirm", onConfirm);
      dialog.addEventListener("sp-cancel", onCancel);
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "sp-confirm-dialog": SpConfirmDialogComponent;
  }
}

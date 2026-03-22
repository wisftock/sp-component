import { LitElement, unsafeCSS } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import styles from "./sp-toast-stack.css?inline";
import { toastStackTemplate } from "./sp-toast-stack.template.js";
import type { SpToastVariant, SpToastPosition, ToastItem } from "./sp-toast-stack.types.js";

/**
 * Toast stack manager component — renders a stack of toast notifications.
 *
 * @element sp-toast-stack
 *
 * @prop {SpToastPosition} position - Stack position on screen (default "bottom-right")
 * @prop {number}          max      - Max visible toasts at once (default 5)
 *
 * @fires {CustomEvent<{ id: string }>} sp-show    - Emitted when a toast is shown
 * @fires {CustomEvent<{ id: string }>} sp-dismiss - Emitted when a toast is dismissed
 */
@customElement("sp-toast-stack")
export class SpToastStackComponent extends LitElement {
  static override styles = unsafeCSS(styles);

  @property({ type: String, reflect: true })
  position: SpToastPosition = "bottom-right";

  @property({ type: Number })
  max = 5;

  @state()
  _toasts: ToastItem[] = [];

  private _timers = new Map<string, ReturnType<typeof setTimeout>>();

  override render() {
    return toastStackTemplate.call(this);
  }

  /**
   * Show a toast notification.
   * @returns The toast id
   */
  show(options: {
    message: string;
    variant?: SpToastVariant;
    duration?: number;
    title?: string;
    closable?: boolean;
  }): string {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const toast: ToastItem = {
      id,
      message: options.message,
      variant: options.variant ?? "info",
      duration: options.duration ?? 4000,
      ...(options.title !== undefined ? { title: options.title } : {}),
      closable: options.closable ?? true,
    };

    this._toasts = [...this._toasts, toast];

    this.dispatchEvent(
      new CustomEvent("sp-show", {
        detail: { id },
        bubbles: true,
        composed: true,
      }),
    );

    if (toast.duration > 0) {
      const timer = setTimeout(() => this.dismiss(id), toast.duration);
      this._timers.set(id, timer);
    }

    return id;
  }

  /**
   * Dismiss a specific toast by id.
   */
  dismiss(id: string): void {
    const timer = this._timers.get(id);
    if (timer !== undefined) {
      clearTimeout(timer);
      this._timers.delete(id);
    }

    const exists = this._toasts.some((t) => t.id === id);
    if (!exists) return;

    this._toasts = this._toasts.filter((t) => t.id !== id);

    this.dispatchEvent(
      new CustomEvent("sp-dismiss", {
        detail: { id },
        bubbles: true,
        composed: true,
      }),
    );
  }

  /**
   * Dismiss all toasts.
   */
  dismissAll(): void {
    for (const timer of this._timers.values()) {
      clearTimeout(timer);
    }
    this._timers.clear();
    this._toasts = [];
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.dismissAll();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "sp-toast-stack": SpToastStackComponent;
  }
}

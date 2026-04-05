import { LitElement } from "lit";
import { SpConfig } from "../config.js";

/**
 * Base class for all SP components.
 * Provides shared utilities: RTL detection, typed event emission, and i18n.
 *
 * @example
 * ```ts
 * import { SpBaseElement } from "../../base/SpBaseElement.js";
 *
 * export class MyComponent extends SpBaseElement {
 *   handleAction() {
 *     const cancelled = !this.emit("my-action", { value: 42 });
 *   }
 * }
 * ```
 */
export class SpBaseElement extends LitElement {
  /** True when the component is rendered in an RTL context. */
  get isRTL(): boolean {
    return getComputedStyle(this).direction === "rtl";
  }

  /**
   * Dispatches a bubbling, composed CustomEvent.
   * Returns false if the event was cancelled (preventDefault called).
   */
  emit<T = undefined>(name: string, detail?: T): boolean {
    return this.dispatchEvent(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      new CustomEvent<T>(name, {
        detail: detail as T,
        bubbles: true,
        composed: true,
        cancelable: true,
      }),
    );
  }

  /** Returns a locale string by dot-path key (e.g. "modal.closeLabel"). */
  t(path: string): string {
    const parts = path.split(".");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let node: any = SpConfig.locale;
    for (const part of parts) {
      if (node == null || typeof node !== "object") return path;
      node = node[part];
    }
    return typeof node === "string" ? node : path;
  }
}

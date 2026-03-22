import { LitElement, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import styles from "./sp-kbd.css?inline";
import { kbdTemplate } from "./sp-kbd.template.js";
import type { SpKbdSize } from "./sp-kbd.types.js";

/**
 * Keyboard key display component.
 *
 * @element sp-kbd
 *
 * @prop {SpKbdSize} size - Size: sm | md | lg
 *
 * @slot - The key label / content
 *
 * @csspart key - The inner <kbd> element
 */
@customElement("sp-kbd")
export class SpKbdComponent extends LitElement {
  static override styles = unsafeCSS(styles);

  @property({ type: String, reflect: true })
  size: SpKbdSize = "md";

  /** Array of keys for multi-key shortcuts e.g. ["Ctrl","Shift","K"] */
  @property({ type: Array })
  keys: string[] = [];

  /** Platform for symbol mapping: "auto" | "mac" | "win" */
  @property({ type: String })
  platform: "auto" | "mac" | "win" = "auto";

  _isMac(): boolean {
    if (this.platform === "mac") return true;
    if (this.platform === "win") return false;
    return typeof navigator !== "undefined" && /mac/i.test(navigator.platform);
  }

  _resolveKey(key: string): string {
    if (!this._isMac()) return key;
    const map: Record<string, string> = {
      Ctrl: "⌘", Control: "⌘",
      Alt: "⌥", Option: "⌥",
      Shift: "⇧",
      Meta: "⌘",
    };
    return map[key] ?? key;
  }

  override render() {
    return kbdTemplate.call(this);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "sp-kbd": SpKbdComponent;
  }
}

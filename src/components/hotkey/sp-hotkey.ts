import { LitElement, html, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import styles from "./sp-hotkey.css?inline";

/**
 * Displays a keyboard shortcut visually as styled key badges.
 *
 * @element sp-hotkey
 *
 * @prop {string[]} keys - Array of key names, e.g. ["Ctrl", "K"] or ["⌘", "Shift", "P"]
 * @prop {string}   size - "sm" | "md" (default: "md")
 *
 * @example
 * <sp-hotkey .keys=${["Ctrl", "K"]}></sp-hotkey>
 * <sp-hotkey .keys=${["⌘", "Shift", "P"]}></sp-hotkey>
 */
@customElement("sp-hotkey")
export class SpHotkeyComponent extends LitElement {
  static override styles = unsafeCSS(styles);

  @property({ type: Array }) keys: string[] = [];
  @property({ type: String }) size: "sm" | "md" = "md";

  /** Parse a shortcut string like "Ctrl+K" or "Cmd+Shift+P" into an array */
  static parse(shortcut: string): string[] {
    return shortcut.split(/[+\s]+/).filter(Boolean);
  }

  override render() {
    if (!this.keys.length) return html``;
    return html`
      <span class="sp-hotkey sp-hotkey--${this.size}" role="group" aria-label="Keyboard shortcut: ${this.keys.join(" + ")}">
        ${this.keys.map((key, i) => html`
          ${i > 0 ? html`<span class="sp-hotkey-sep">+</span>` : ""}
          <kbd class="sp-hotkey-key">${key}</kbd>
        `)}
      </span>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap { "sp-hotkey": SpHotkeyComponent; }
}

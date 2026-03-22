import { html, type TemplateResult } from "lit";
import type { SpKbdComponent } from "./sp-kbd.js";

/**
 * HTML template for sp-kbd.
 * Call as: kbdTemplate.call(this) inside render()
 */
export function kbdTemplate(this: SpKbdComponent): TemplateResult {
  return html`<kbd part="key"><slot></slot></kbd>`;
}

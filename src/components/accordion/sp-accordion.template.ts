import { html, type TemplateResult } from "lit";
import type { SpAccordionComponent } from "./sp-accordion.js";

export function accordionTemplate(this: SpAccordionComponent): TemplateResult {
  return html`<div class="sp-accordion"><slot></slot></div>`;
}

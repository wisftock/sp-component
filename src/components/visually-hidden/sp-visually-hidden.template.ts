import { html, type TemplateResult } from "lit";

export function visuallyHiddenTemplate(): TemplateResult {
  return html`<slot></slot>`;
}

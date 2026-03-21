import { html, type TemplateResult } from "lit";
import type { SpNavbarComponent } from "./sp-navbar.js";

export function navbarTemplate(this: SpNavbarComponent): TemplateResult {
  return html`
    <header class="sp-navbar">
      <div class="sp-navbar-start"><slot name="start"></slot></div>
      <div class="sp-navbar-center"><slot name="center"></slot></div>
      <div class="sp-navbar-end"><slot name="end"></slot></div>
    </header>
  `;
}

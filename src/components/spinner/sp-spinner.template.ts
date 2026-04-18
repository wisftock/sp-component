import { html, type TemplateResult } from "lit";
import type { SpSpinnerComponent } from "./sp-spinner.js";

function arcTemplate(label: string): TemplateResult {
  return html`
    <div class="sp-spinner sp-spinner--arc" role="status" aria-label=${label}>
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2.5"
          stroke-linecap="round" stroke-dasharray="31.416" stroke-dashoffset="10" opacity="0.25"/>
        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2.5"
          stroke-linecap="round" stroke-dasharray="20" stroke-dashoffset="0"/>
      </svg>
    </div>
  `;
}

function ringTemplate(label: string): TemplateResult {
  return html`
    <div class="sp-spinner sp-spinner--ring" role="status" aria-label=${label}>
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" opacity="0.15"/>
        <path d="M12 2a10 10 0 0110 10" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
      </svg>
    </div>
  `;
}

function dotsTemplate(label: string): TemplateResult {
  return html`
    <div class="sp-spinner sp-spinner--dots" role="status" aria-label=${label}>
      <span class="sp-dot sp-dot--1"></span>
      <span class="sp-dot sp-dot--2"></span>
      <span class="sp-dot sp-dot--3"></span>
    </div>
  `;
}

function barsTemplate(label: string): TemplateResult {
  return html`
    <div class="sp-spinner sp-spinner--bars" role="status" aria-label=${label}>
      <span class="sp-bar sp-bar--1"></span>
      <span class="sp-bar sp-bar--2"></span>
      <span class="sp-bar sp-bar--3"></span>
      <span class="sp-bar sp-bar--4"></span>
    </div>
  `;
}

function pulseTemplate(label: string): TemplateResult {
  return html`
    <div class="sp-spinner sp-spinner--pulse" role="status" aria-label=${label}>
      <span class="sp-pulse-ring"></span>
      <span class="sp-pulse-dot"></span>
    </div>
  `;
}

export function spinnerTemplate(this: SpSpinnerComponent): TemplateResult {
  const label = this.label;
  let inner: TemplateResult;
  switch (this.variant) {
    case "ring":  inner = ringTemplate(label);  break;
    case "dots":  inner = dotsTemplate(label);  break;
    case "bars":  inner = barsTemplate(label);  break;
    case "pulse": inner = pulseTemplate(label); break;
    default:      inner = arcTemplate(label);   break;
  }

  return html`
    ${inner}
    <span class="sp-sr-only">${label}</span>
  `;
}

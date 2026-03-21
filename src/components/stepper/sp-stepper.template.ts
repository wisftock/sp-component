import { html, nothing, type TemplateResult } from "lit";
import { classMap } from "lit/directives/class-map.js";
import type { SpStepperComponent } from "./sp-stepper.js";

export function stepperTemplate(this: SpStepperComponent): TemplateResult {
  return html`
    <div class="sp-stepper">
      ${this.steps.map((step, index) => {
        const status = this._getStepStatus(index);
        const isClickable = !this.linear || index <= this.activeStep;
        return html`
          <div
            class=${classMap({
              "sp-step": true,
              [`sp-step--${status}`]: true,
            })}
            @click=${() => this._handleStepClick(index)}
            style=${isClickable ? "cursor: pointer" : "cursor: default"}
          >
            <div class="sp-step-indicator">
              ${status === "complete"
                ? html`<svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path
                      d="M2 7l4 4 6-7"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>`
                : status === "error"
                  ? html`<span>!</span>`
                  : html`<span>${index + 1}</span>`}
            </div>
            ${index < this.steps.length - 1
              ? html`<div class="sp-step-connector"></div>`
              : nothing}
            <div class="sp-step-content">
              <span class="sp-step-label">${step.label}</span>
              ${step.description
                ? html`<span class="sp-step-description">${step.description}</span>`
                : nothing}
            </div>
          </div>
        `;
      })}
    </div>
  `;
}

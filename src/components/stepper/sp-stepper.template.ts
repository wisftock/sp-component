import { html, nothing, type TemplateResult } from "lit";
import { classMap } from "lit/directives/class-map.js";
import type { SpStepperComponent } from "./sp-stepper.js";

export function stepperTemplate(this: SpStepperComponent): TemplateResult {
  return html`
    <div class="sp-stepper">
      ${this.showProgress ? html`
        <div class="sp-stepper-progress" aria-live="polite">
          Step ${this.activeStep + 1} of ${this.steps.length}
        </div>
      ` : nothing}
      <div class="sp-stepper-steps">
      ${this.steps.map((step, index) => {
        const status = this._getStepStatus(index);
        const isClickable = this._isStepClickable(index);
        const isCurrent = index === this.activeStep;
        return html`
          <div
            class=${classMap({
              "sp-step": true,
              [`sp-step--${status}`]: true,
              "sp-step--clickable": isClickable,
            })}
            role="button"
            tabindex=${isClickable ? "0" : "-1"}
            aria-current=${isCurrent ? "step" : nothing}
            aria-disabled=${!isClickable && !isCurrent ? "true" : nothing}
            @click=${() => this._handleStepClick(index)}
            @keydown=${(e: KeyboardEvent) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); this._handleStepClick(index); }}}
          >
            <div class="sp-step-indicator">
              ${status === "complete"
                ? html`<svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M2 7l4 4 6-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>`
                : status === "error"
                  ? html`<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 2v6M7 10v1.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`
                  : html`<span>${index + 1}</span>`}
            </div>
            ${index < this.steps.length - 1
              ? html`<div class="sp-step-connector"></div>`
              : nothing}
            <div class="sp-step-content">
              <span class="sp-step-label">${step.label}</span>
              ${step.optional ? html`<span class="sp-step-optional">(Optional)</span>` : nothing}
              ${step.description ? html`<span class="sp-step-description">${step.description}</span>` : nothing}
            </div>
          </div>
        `;
      })}
      </div>
    </div>
  `;
}

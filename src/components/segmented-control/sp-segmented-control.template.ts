import { html, type TemplateResult } from "lit";
import type { SpSegmentedControlComponent } from "./sp-segmented-control.js";

export function segmentedControlTemplate(
  this: SpSegmentedControlComponent,
): TemplateResult {
  return html`
    <div
      class="sp-segmented"
      role="group"
      aria-label=${this.name || "Segmented control"}
    >
      ${this.options.map(
        (opt) => html`
          <button
            type="button"
            class=${[
              "sp-segmented-option",
              opt.value === this.value ? "sp-segmented-option--selected" : "",
              opt.disabled ? "sp-segmented-option--disabled" : "",
            ]
              .filter(Boolean)
              .join(" ")}
            ?disabled=${this.disabled || opt.disabled}
            aria-pressed=${opt.value === this.value ? "true" : "false"}
            @click=${() => this._handleSelect(opt.value)}
          >
            ${opt.icon
              ? html`<span class="sp-segmented-icon" aria-hidden="true">${opt.icon}</span>`
              : null}
            ${opt.label}
          </button>
        `,
      )}
    </div>
  `;
}

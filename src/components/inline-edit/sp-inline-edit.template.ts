import { html, nothing, type TemplateResult } from "lit";
import type { SpInlineEditComponent } from "./sp-inline-edit.js";

export function inlineEditTemplate(
  this: SpInlineEditComponent,
): TemplateResult {
  if (this.editing) {
    return html`
      <span class="sp-inline-edit-form">
        <input
          class="sp-inline-edit-input"
          type=${this.type}
          .value=${this._draft}
          placeholder=${this.placeholder || nothing}
          maxlength=${this.maxlength > 0 ? this.maxlength : nothing}
          aria-label=${this.name || "Inline edit"}
          @input=${this._handleInput}
          @keydown=${this._handleKeydown}
        />
        <span class="sp-inline-edit-actions">
          <button
            class="sp-inline-edit-btn sp-inline-edit-btn--confirm"
            type="button"
            aria-label="Confirm"
            @click=${this._handleConfirm}
          >✓</button>
          <button
            class="sp-inline-edit-btn sp-inline-edit-btn--cancel"
            type="button"
            aria-label="Cancel"
            @click=${this._handleCancel}
          >✕</button>
        </span>
      </span>
    `;
  }

  const isEmpty = !this.value;
  return html`
    <span
      class=${[
        "sp-inline-edit-display",
        isEmpty ? "sp-inline-edit-display--empty" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      tabindex=${this.disabled || this.readonly ? "-1" : "0"}
      role="button"
      aria-label=${`Edit: ${this.value || this.emptyText}`}
      @click=${this._handleActivate}
      @keydown=${this._handleDisplayKeydown}
    >
      ${isEmpty ? this.emptyText : this.value}
      ${!this.readonly
        ? html`<span class="sp-inline-edit-display-icon" aria-hidden="true">✏</span>`
        : nothing}
    </span>
  `;
}

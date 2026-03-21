import { html, nothing, type TemplateResult } from "lit";
import { classMap } from "lit/directives/class-map.js";
import type { SpFileUploadComponent } from "./sp-file-upload.js";

export function fileUploadTemplate(this: SpFileUploadComponent): TemplateResult {
  return html`
    <div class="sp-file-upload-wrapper">
      <div
        class=${classMap({ "sp-file-dropzone": true, "sp-file-dropzone--dragging": this._dragging, "sp-file-dropzone--disabled": this.disabled })}
        @dragover=${this._handleDragOver}
        @dragleave=${this._handleDragLeave}
        @drop=${this._handleDrop}
        @click=${this._handleZoneClick}
      >
        <input
          type="file"
          class="sp-file-input"
          accept=${this.accept || nothing}
          ?multiple=${this.multiple}
          ?disabled=${this.disabled}
          @change=${this._handleInputChange}
        />
        <svg class="sp-file-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
        </svg>
        <span class="sp-file-label">${this.label}</span>
        ${this.hint ? html`<span class="sp-file-hint">${this.hint}</span>` : nothing}
      </div>
      ${this._validationError || this.error ? html`<span class="sp-file-error">${this._validationError || this.error}</span>` : nothing}
      ${this._files.length > 0 ? html`
        <ul class="sp-file-list">
          ${this._files.map((file, i) => html`
            <li class="sp-file-item">
              <span class="sp-file-name">${file.name}</span>
              <span class="sp-file-size">${this._formatSize(file.size)}</span>
              <button class="sp-file-remove" type="button" @click=${() => this._removeFile(i)} aria-label="Remove file">✕</button>
            </li>
          `)}
        </ul>
      ` : nothing}
    </div>
  `;
}

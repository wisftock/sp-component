import { html, nothing, type TemplateResult } from "lit";
import { classMap } from "lit/directives/class-map.js";
import { SpConfig } from "../../config.js";
import type { SpFileUploadComponent } from "./sp-file-upload.js";

const FILE_ICONS: Record<string, TemplateResult> = {
  image: html`<svg class="sp-file-type-icon sp-file-type-icon--image" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>`,
  pdf:   html`<svg class="sp-file-type-icon sp-file-type-icon--pdf"   viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="15" y2="17"/></svg>`,
  video: html`<svg class="sp-file-type-icon sp-file-type-icon--video" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>`,
  audio: html`<svg class="sp-file-type-icon sp-file-type-icon--audio" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>`,
  code:  html`<svg class="sp-file-type-icon sp-file-type-icon--code"  viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`,
  zip:   html`<svg class="sp-file-type-icon sp-file-type-icon--zip"   viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9z"/><polyline points="13 2 13 9 20 9"/><line x1="12" y1="13" x2="12" y2="13"/><line x1="12" y1="17" x2="12" y2="17"/></svg>`,
  file:  html`<svg class="sp-file-type-icon sp-file-type-icon--default" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9z"/><polyline points="13 2 13 9 20 9"/></svg>`,
};

function getFileType(file: File): keyof typeof FILE_ICONS {
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  if (/^(jpg|jpeg|png|gif|webp|svg|avif|bmp|ico)$/.test(ext)) return "image";
  if (ext === "pdf") return "pdf";
  if (/^(mp4|mov|avi|mkv|webm|flv)$/.test(ext)) return "video";
  if (/^(mp3|wav|ogg|flac|aac|m4a)$/.test(ext)) return "audio";
  if (/^(js|ts|jsx|tsx|html|css|json|py|rs|go|java|c|cpp|cs|php|rb|sh)$/.test(ext)) return "code";
  if (/^(zip|rar|tar|gz|7z)$/.test(ext)) return "zip";
  return "file";
}

function isImage(file: File): boolean {
  return file.type.startsWith("image/");
}

function createObjectURL(file: File): string {
  return URL.createObjectURL(file);
}

export function fileUploadTemplate(this: SpFileUploadComponent): TemplateResult {
  return html`
    <div class="sp-file-upload-wrapper">
      <div
        class=${classMap({
          "sp-file-dropzone": true,
          "sp-file-dropzone--dragging": this._dragging,
          "sp-file-dropzone--disabled": this.disabled,
          "sp-file-dropzone--has-files": this._files.length > 0 && this.variant !== "compact",
        })}
        @dragover=${this._handleDragOver}
        @dragleave=${this._handleDragLeave}
        @drop=${this._handleDrop}
        @click=${this._handleZoneClick}
        tabindex=${this.disabled ? nothing : "0"}
        role="button"
        aria-disabled=${this.disabled ? "true" : nothing}
      >
        <input
          type="file"
          class="sp-file-input"
          accept=${this.accept || nothing}
          ?multiple=${this.multiple}
          ?disabled=${this.disabled}
          @change=${this._handleInputChange}
        />

        ${this._dragging
          ? html`
            <div class="sp-file-drop-indicator">
              <svg class="sp-file-drop-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M12 19V5M5 12l7-7 7 7"/>
              </svg>
              <span class="sp-file-drop-text">Suelta los archivos aquí</span>
            </div>`
          : html`
            <div class="sp-file-zone-inner">
              <div class="sp-file-icon-wrap">
                <svg class="sp-file-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
                </svg>
              </div>
              <div class="sp-file-zone-text">
                <span class="sp-file-label">${this.label}</span>
                ${this.hint ? html`<span class="sp-file-hint">${this.hint}</span>` : nothing}
              </div>
            </div>`}
      </div>

      ${this._validationError || this.error
        ? html`<span class="sp-file-error" role="alert">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="sp-file-error-icon">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            ${this._validationError || this.error}
          </span>`
        : nothing}

      ${this.showFileList && this._files.length > 0 ? html`
        <ul class="sp-file-list">
          ${this._files.map((file, i) => {
            const fileProgress = this.progress?.[file.name];
            const hasProgress = typeof fileProgress === "number";
            const fileType = getFileType(file);
            const showPreview = isImage(file);
            const previewUrl = showPreview ? createObjectURL(file) : null;

            return html`
              <li class="sp-file-item ${showPreview ? "sp-file-item--has-preview" : ""}">
                ${showPreview && previewUrl
                  ? html`<img class="sp-file-preview" src=${previewUrl} alt=${file.name} @load=${(e: Event) => URL.revokeObjectURL((e.target as HTMLImageElement).src)}/>`
                  : FILE_ICONS[fileType]}
                <div class="sp-file-info">
                  <span class="sp-file-name" title=${file.name}>${file.name}</span>
                  <span class="sp-file-size">${this._formatSize(file.size)}</span>
                  ${hasProgress ? html`
                    <div class="sp-file-progress" role="progressbar" aria-valuenow=${fileProgress} aria-valuemin="0" aria-valuemax="100">
                      <div class="sp-file-progress-bar" style="width: ${fileProgress}%"></div>
                      <span class="sp-file-progress-pct">${fileProgress}%</span>
                    </div>` : nothing}
                </div>
                <button
                  class="sp-file-remove"
                  type="button"
                  @click=${() => this._removeFile(i)}
                  aria-label=${SpConfig.locale.fileUpload.removeFileLabel}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </li>
            `;
          })}
        </ul>
      ` : nothing}
    </div>
  `;
}

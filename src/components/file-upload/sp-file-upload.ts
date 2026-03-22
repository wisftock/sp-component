import { LitElement, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import styles from "./sp-file-upload.css?inline";
import { fileUploadTemplate } from "./sp-file-upload.template.js";
import type { SpFileUploadVariant } from "./sp-file-upload.types.js";

/**
 * Reusable file upload component with drag-and-drop support.
 *
 * @element sp-file-upload
 *
 * @prop {string}               accept   - Accepted file types (e.g. "image/*,.pdf")
 * @prop {boolean}              multiple - Allows multiple file selection
 * @prop {boolean}              disabled - Disables the component
 * @prop {number}               maxSize  - Maximum file size in bytes (0 = no limit)
 * @prop {string}               label    - Dropzone label text
 * @prop {string}               hint     - Hint text inside the dropzone
 * @prop {string}               error    - External error message
 * @prop {SpFileUploadVariant}  variant  - Visual variant: default | compact
 *
 * @fires {CustomEvent<{ files: File[] }>}     sp-change - Emitted when files change
 * @fires {CustomEvent<{ message: string }>}   sp-error  - Emitted when validation fails
 */
@customElement("sp-file-upload")
export class SpFileUploadComponent extends LitElement {
  static override styles = unsafeCSS(styles);

  @property({ type: String })
  accept = "";

  @property({ type: Boolean })
  multiple = false;

  @property({ type: Boolean, reflect: true })
  disabled = false;

  @property({ type: Number, attribute: "max-size" })
  maxSize = 0;

  @property({ type: String })
  label = "Drop files here or click to upload";

  @property({ type: String })
  hint = "";

  @property({ type: String })
  error = "";

  @property({ type: String, reflect: true })
  variant: SpFileUploadVariant = "default";

  @property({ type: Boolean, attribute: "show-file-list" })
  showFileList = true;

  /**
   * Map of file name -> upload progress (0-100).
   * Consumer sets this after receiving sp-change event.
   */
  @property({ type: Object })
  progress: Record<string, number> = {};

  _dragging = false;
  _files: File[] = [];
  _validationError = "";

  readonly _handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    if (!this.disabled) {
      this._dragging = true;
      this.requestUpdate();
    }
  };

  readonly _handleDragLeave = () => {
    this._dragging = false;
    this.requestUpdate();
  };

  readonly _handleDrop = (e: DragEvent) => {
    e.preventDefault();
    this._dragging = false;
    if (this.disabled) return;
    const files = Array.from(e.dataTransfer?.files ?? []);
    this._processFiles(files);
  };

  readonly _handleInputChange = (e: Event) => {
    const input = e.target as HTMLInputElement;
    const files = Array.from(input.files ?? []);
    this._processFiles(files);
    input.value = "";
  };

  _processFiles(files: File[]) {
    if (this.maxSize > 0) {
      const oversized = files.filter(f => f.size > this.maxSize);
      if (oversized.length > 0) {
        this._validationError = `File exceeds max size of ${this._formatSize(this.maxSize)}`;
        this.requestUpdate();
        this.dispatchEvent(new CustomEvent("sp-error", { detail: { message: this._validationError }, bubbles: true, composed: true }));
        return;
      }
    }
    this._validationError = "";
    this._files = this.multiple ? [...this._files, ...files] : files;
    this.requestUpdate();
    this.dispatchEvent(new CustomEvent("sp-change", { detail: { files: this._files }, bubbles: true, composed: true }));
  }

  _formatSize(bytes: number): string {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  }

  readonly _removeFile = (index: number) => {
    this._files = this._files.filter((_, i) => i !== index);
    this.requestUpdate();
    this.dispatchEvent(new CustomEvent("sp-change", { detail: { files: this._files }, bubbles: true, composed: true }));
  };

  readonly _handleZoneClick = () => {
    if (!this.disabled) this.shadowRoot?.querySelector<HTMLInputElement>(".sp-file-input")?.click();
  };

  override render() {
    return fileUploadTemplate.call(this);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "sp-file-upload": SpFileUploadComponent;
  }
}

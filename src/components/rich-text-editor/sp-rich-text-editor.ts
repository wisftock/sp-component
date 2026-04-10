import { LitElement, html, unsafeCSS, nothing } from "lit";
import { customElement, property, state, query } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import styles from "./sp-rich-text-editor.css?inline";

/**
 * Rich text editor with toolbar: headings, bold/italic/underline/strike,
 * lists, blockquote, code, links, undo/redo and optional character counter.
 *
 * @element sp-rich-text-editor
 *
 * @prop {string}  label       - Label shown above the toolbar
 * @prop {string}  value       - HTML content
 * @prop {string}  placeholder - Placeholder text when empty
 * @prop {boolean} disabled    - Disables the editor
 * @prop {boolean} readonly    - Read-only mode (no editing, no toolbar)
 * @prop {number}  minHeight   - Editor min-height in px (default 160)
 * @prop {number}  maxlength   - Show char counter (0 = no limit)
 *
 * @fires {CustomEvent<{ value: string; html: string }>} sp-change
 * @fires {CustomEvent<{ value: string; html: string }>} sp-input
 */
@customElement("sp-rich-text-editor")
export class SpRichTextEditorComponent extends LitElement {
  static override styles = unsafeCSS(styles);
  static formAssociated = true;

  readonly #internals: ElementInternals;
  constructor() {
    super();
    this.#internals = this.attachInternals();
  }

  @property({ type: String }) label = "";
  @property({ type: String }) value = "";
  @property({ type: String }) placeholder = "Write something…";
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Boolean, reflect: true }) readonly = false;
  @property({ type: Number, attribute: "min-height" }) minHeight = 160;
  @property({ type: Number }) maxlength = 0;

  @state() private _charCount = 0;
  @state() private _activeFormats = new Set<string>();
  @state() private _showLinkInput = false;
  @state() private _linkUrl = "";
  @state() private _showImageInput = false;
  @state() private _imageUrl = "";
  @state() private _showTablePicker = false;
  @state() private _tableRows = 3;
  @state() private _tableCols = 3;

  @query(".sp-rte__editor") private _editor!: HTMLElement;

  override firstUpdated() {
    if (this._editor && this.value) {
      this._editor.innerHTML = this.value;
      this._charCount = this._editor.textContent?.length ?? 0;
    }
    document.addEventListener("selectionchange", this.#onSelectionChange);
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener("selectionchange", this.#onSelectionChange);
  }

  readonly #onSelectionChange = () => {
    if (!this._editor) return;
    const formats = new Set<string>();
    for (const cmd of ["bold", "italic", "underline", "strikeThrough", "insertOrderedList", "insertUnorderedList"]) {
      try { if (document.queryCommandState(cmd)) formats.add(cmd); } catch { /* ignore */ }
    }
    this._activeFormats = formats;
  };

  #exec(cmd: string, value?: string) {
    this._editor?.focus();
    document.execCommand(cmd, false, value);
    this.#notifyChange();
    this.#onSelectionChange();
  }

  #notifyChange() {
    const content = this._editor?.innerHTML ?? "";
    this.value = content;
    this._charCount = this._editor?.textContent?.length ?? 0;
    this.#internals.setFormValue(content);
    const detail = { value: content, html: content };
    this.dispatchEvent(new CustomEvent("sp-input",  { detail, bubbles: true, composed: true }));
    this.dispatchEvent(new CustomEvent("sp-change", { detail, bubbles: true, composed: true }));
  }

  #insertHeading(tag: string) {
    this._editor?.focus();
    document.execCommand("formatBlock", false, tag);
    this.#notifyChange();
  }

  #insertLink() {
    if (!this._linkUrl.trim()) return;
    this.#exec("createLink", this._linkUrl.trim());
    this._showLinkInput = false;
    this._linkUrl = "";
  }

  #insertImage() {
    const url = this._imageUrl.trim();
    if (!url) return;
    this._editor?.focus();
    document.execCommand("insertHTML", false, `<img src="${url}" alt="" style="max-width:100%;height:auto;border-radius:4px;">`);
    this.#notifyChange();
    this._showImageInput = false;
    this._imageUrl = "";
  }

  #handleImageFile(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      this._editor?.focus();
      document.execCommand("insertHTML", false, `<img src="${dataUrl}" alt="${file.name}" style="max-width:100%;height:auto;border-radius:4px;">`);
      this.#notifyChange();
      this._showImageInput = false;
    };
    reader.readAsDataURL(file);
  }

  #insertTable(rows: number, cols: number) {
    const colWidth = Math.floor(100 / cols);
    let html = `<table class="sp-rte-table"><tbody>`;
    html += `<tr>${Array.from({ length: cols }, () => `<th style="width:${colWidth}%"></th>`).join("")}</tr>`;
    for (let r = 1; r < rows; r++) {
      html += `<tr>${Array.from({ length: cols }, () => `<td></td>`).join("")}</tr>`;
    }
    html += `</tbody></table><p><br></p>`;
    this._editor?.focus();
    document.execCommand("insertHTML", false, html);
    this.#notifyChange();
    this._showTablePicker = false;
  }

  override render() {
    const af = this._activeFormats;
    const overLimit = this.maxlength > 0 && this._charCount > this.maxlength;

    return html`
      <div class="sp-rte">
        ${this.label ? html`<label class="sp-rte__label">${this.label}</label>` : nothing}

        <div class=${classMap({ "sp-rte__wrap": true, "sp-rte__wrap--focus": false })}>
          ${!this.readonly ? html`
            <!-- Toolbar -->
            <div class="sp-rte__toolbar" @mousedown=${(e: Event) => e.preventDefault()}>

              <select class="sp-rte__select"
                @change=${(e: Event) => {
                  this.#insertHeading((e.target as HTMLSelectElement).value);
                  (e.target as HTMLSelectElement).value = "p";
                }}>
                <option value="p">Paragraph</option>
                <option value="h1">Heading 1</option>
                <option value="h2">Heading 2</option>
                <option value="h3">Heading 3</option>
              </select>

              <span class="sp-rte__sep"></span>

              <button class=${classMap({"sp-rte__btn":true,"sp-rte__btn--on":af.has("bold")})}
                title="Bold (Ctrl+B)" @click=${() => this.#exec("bold")}><b>B</b></button>
              <button class=${classMap({"sp-rte__btn":true,"sp-rte__btn--on":af.has("italic")})}
                title="Italic (Ctrl+I)" @click=${() => this.#exec("italic")}><i>I</i></button>
              <button class=${classMap({"sp-rte__btn":true,"sp-rte__btn--on":af.has("underline")})}
                title="Underline (Ctrl+U)" @click=${() => this.#exec("underline")}><u>U</u></button>
              <button class=${classMap({"sp-rte__btn":true,"sp-rte__btn--on":af.has("strikeThrough")})}
                title="Strikethrough" @click=${() => this.#exec("strikeThrough")}><s>S</s></button>

              <span class="sp-rte__sep"></span>

              <button class=${classMap({"sp-rte__btn":true,"sp-rte__btn--on":af.has("insertUnorderedList")})}
                title="Bullet list" @click=${() => this.#exec("insertUnorderedList")}>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                  <circle cx="2" cy="4" r="1.5"/><rect x="5" y="3" width="10" height="2" rx="1"/>
                  <circle cx="2" cy="8" r="1.5"/><rect x="5" y="7" width="10" height="2" rx="1"/>
                  <circle cx="2" cy="12" r="1.5"/><rect x="5" y="11" width="10" height="2" rx="1"/>
                </svg>
              </button>
              <button class=${classMap({"sp-rte__btn":true,"sp-rte__btn--on":af.has("insertOrderedList")})}
                title="Numbered list" @click=${() => this.#exec("insertOrderedList")}>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                  <text x="0" y="5" font-size="5" font-family="monospace">1.</text>
                  <rect x="5" y="3" width="10" height="2" rx="1"/>
                  <text x="0" y="9" font-size="5" font-family="monospace">2.</text>
                  <rect x="5" y="7" width="10" height="2" rx="1"/>
                  <text x="0" y="13" font-size="5" font-family="monospace">3.</text>
                  <rect x="5" y="11" width="10" height="2" rx="1"/>
                </svg>
              </button>

              <span class="sp-rte__sep"></span>

              <button class="sp-rte__btn" title="Blockquote" @click=${() => this.#exec("formatBlock", "blockquote")}>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M2 4h3v3H3a1 1 0 000 2 1 1 0 000-2H2V4zM8 4h3v3H9a1 1 0 000 2 1 1 0 000-2H8V4z" opacity=".7"/>
                </svg>
              </button>
              <button class="sp-rte__btn" title="Code block" @click=${() => this.#exec("formatBlock", "pre")}>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M5.5 3L2 8l3.5 5M10.5 3L14 8l-3.5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" fill="none"/>
                </svg>
              </button>

              <span class="sp-rte__sep"></span>

              <!-- Link insert inline -->
              <button class=${classMap({"sp-rte__btn":true,"sp-rte__btn--on":this._showLinkInput})}
                title="Insert link"
                @click=${() => { this._showLinkInput = !this._showLinkInput; this._linkUrl = ""; }}>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
                  <path d="M6 10l4-4M4 9l-1 1a3 3 0 004 4l1-1M12 7l1-1a3 3 0 00-4-4l-1 1"/>
                </svg>
              </button>
              <button class="sp-rte__btn" title="Remove link" @click=${() => this.#exec("unlink")}>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
                  <path d="M4 9l-1 1a3 3 0 004 4l1-1M12 7l1-1a3 3 0 00-4-4l-1 1M3 13l10-10"/>
                </svg>
              </button>

              <span class="sp-rte__sep"></span>

              <button class="sp-rte__btn" title="Undo (Ctrl+Z)" @click=${() => this.#exec("undo")}>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
                  <path d="M3 7H10a4 4 0 010 8H7M3 7l3-3M3 7l3 3"/>
                </svg>
              </button>
              <button class="sp-rte__btn" title="Redo (Ctrl+Y)" @click=${() => this.#exec("redo")}>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
                  <path d="M13 7H6a4 4 0 000 8h3M13 7l-3-3M13 7l-3 3"/>
                </svg>
              </button>

              <span class="sp-rte__sep"></span>

              <!-- Image insert -->
              <button class=${classMap({"sp-rte__btn":true,"sp-rte__btn--on":this._showImageInput})}
                title="Insert image"
                @click=${() => { this._showImageInput = !this._showImageInput; this._showTablePicker = false; this._showLinkInput = false; this._imageUrl = ""; }}>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="1" y="2" width="14" height="12" rx="2"/>
                  <circle cx="5.5" cy="6" r="1.5"/>
                  <path d="M1 12l4-4 3 3 2-2 5 5"/>
                </svg>
              </button>

              <!-- Table insert -->
              <button class=${classMap({"sp-rte__btn":true,"sp-rte__btn--on":this._showTablePicker})}
                title="Insert table"
                @click=${() => { this._showTablePicker = !this._showTablePicker; this._showImageInput = false; this._showLinkInput = false; }}>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
                  <rect x="1" y="1" width="14" height="14" rx="1.5"/>
                  <line x1="1" y1="5" x2="15" y2="5"/>
                  <line x1="6" y1="1" x2="6" y2="15"/>
                  <line x1="11" y1="1" x2="11" y2="15"/>
                </svg>
              </button>
            </div>

            <!-- Link input row -->
            ${this._showLinkInput ? html`
              <div class="sp-rte__link-row" @mousedown=${(e: Event) => e.preventDefault()}>
                <input
                  class="sp-rte__link-input"
                  type="url"
                  placeholder="https://example.com"
                  .value=${this._linkUrl}
                  @input=${(e: Event) => { this._linkUrl = (e.target as HTMLInputElement).value; }}
                  @keydown=${(e: KeyboardEvent) => {
                    if (e.key === "Enter") { e.preventDefault(); this.#insertLink(); }
                    if (e.key === "Escape") { this._showLinkInput = false; }
                  }}
                  autofocus
                />
                <button class="sp-rte__btn sp-rte__btn--primary" @click=${() => this.#insertLink()}>Insert</button>
                <button class="sp-rte__btn" @click=${() => { this._showLinkInput = false; }}>Cancel</button>
              </div>
            ` : nothing}

            <!-- Image input row -->
            ${this._showImageInput ? html`
              <div class="sp-rte__link-row" @mousedown=${(e: Event) => e.preventDefault()}>
                <input
                  class="sp-rte__link-input"
                  type="url"
                  placeholder="Image URL (https://…)"
                  .value=${this._imageUrl}
                  @input=${(e: Event) => { this._imageUrl = (e.target as HTMLInputElement).value; }}
                  @keydown=${(e: KeyboardEvent) => {
                    if (e.key === "Enter") { e.preventDefault(); this.#insertImage(); }
                    if (e.key === "Escape") { this._showImageInput = false; }
                  }}
                  autofocus
                />
                <button class="sp-rte__btn sp-rte__btn--primary" @click=${() => this.#insertImage()}>Insert</button>
                <label class="sp-rte__btn sp-rte__btn--upload" title="Upload from device">
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
                    <path d="M8 2v9M5 5l3-3 3 3"/><path d="M2 13h12"/>
                  </svg>
                  <input type="file" accept="image/*" style="display:none" @change=${(e: Event) => this.#handleImageFile(e)}>
                </label>
                <button class="sp-rte__btn" @click=${() => { this._showImageInput = false; }}>Cancel</button>
              </div>
            ` : nothing}

            <!-- Table picker row -->
            ${this._showTablePicker ? html`
              <div class="sp-rte__link-row sp-rte__table-row" @mousedown=${(e: Event) => e.preventDefault()}>
                <label class="sp-rte__table-label">Rows</label>
                <input class="sp-rte__table-input" type="number" min="1" max="20" .value=${String(this._tableRows)}
                  @input=${(e: Event) => { this._tableRows = Math.max(1, Number((e.target as HTMLInputElement).value)); }} />
                <label class="sp-rte__table-label">Cols</label>
                <input class="sp-rte__table-input" type="number" min="1" max="10" .value=${String(this._tableCols)}
                  @input=${(e: Event) => { this._tableCols = Math.max(1, Number((e.target as HTMLInputElement).value)); }} />
                <button class="sp-rte__btn sp-rte__btn--primary" @click=${() => this.#insertTable(this._tableRows, this._tableCols)}>Insert</button>
                <button class="sp-rte__btn" @click=${() => { this._showTablePicker = false; }}>Cancel</button>
              </div>
            ` : nothing}
          ` : nothing}

          <!-- Editor -->
          <div
            class="sp-rte__editor"
            role="textbox"
            aria-multiline="true"
            aria-label=${this.label || this.placeholder}
            aria-readonly=${this.readonly ? "true" : "false"}
            aria-disabled=${this.disabled ? "true" : "false"}
            ?contenteditable=${!this.disabled && !this.readonly}
            data-placeholder=${this.placeholder}
            style="min-height:${this.minHeight}px"
            @input=${() => this.#notifyChange()}
            @keydown=${(e: KeyboardEvent) => {
              if (e.key === "Tab") { e.preventDefault(); this.#exec("insertHTML", "\u00a0\u00a0"); }
            }}
          ></div>

          ${this.maxlength > 0 ? html`
            <div class="sp-rte__footer">
              <span class=${overLimit ? "sp-rte__count--over" : ""}>
                ${this._charCount} / ${this.maxlength}
              </span>
            </div>
          ` : nothing}
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "sp-rich-text-editor": SpRichTextEditorComponent;
  }
}

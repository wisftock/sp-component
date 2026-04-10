import { LitElement, html, unsafeCSS, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import styles from "./sp-pdf-viewer.css?inline";

/**
 * PDF viewer.
 * Uses a direct <iframe> by default — all modern browsers (Chrome, Firefox,
 * Edge, Safari) render PDFs natively inside iframes without extra libraries.
 *
 * @element sp-pdf-viewer
 *
 * @prop {string}  src      - URL of the PDF file (same-origin or CORS-enabled)
 * @prop {number}  height   - Viewer height in px (default 600)
 * @prop {boolean} toolbar  - Show download toolbar
 * @prop {string}  label    - Accessible title
 *
 * @fires {CustomEvent} sp-load  - iframe finished loading
 * @fires {CustomEvent} sp-error - iframe failed to load
 */
@customElement("sp-pdf-viewer")
export class SpPdfViewerComponent extends LitElement {
  static override styles = unsafeCSS(styles);

  @property({ type: String }) src = "";
  @property({ type: Number }) height = 600;
  @property({ type: Boolean }) toolbar = true;
  @property({ type: String }) label = "PDF document";

  @state() private _loading = true;
  @state() private _error = false;

  #onLoad() {
    this._loading = false;
    this._error = false;
    this.dispatchEvent(new CustomEvent("sp-load", { bubbles: true, composed: true }));
  }

  #onError() {
    this._loading = false;
    this._error = true;
    this.dispatchEvent(new CustomEvent("sp-error", { bubbles: true, composed: true }));
  }

  override render() {
    if (!this.src) {
      return html`
        <div class="sp-pdf sp-pdf--empty" style="height:${this.height}px">
          <span>No PDF source provided.</span>
        </div>
      `;
    }

    return html`
      <div class="sp-pdf">
        ${this.toolbar ? html`
          <div class="sp-pdf__toolbar">
            <span class="sp-pdf__title">${this.label}</span>
            <a class="sp-pdf__btn" href=${this.src} target="_blank" rel="noopener" title="Open in new tab">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
                <path d="M6 3H3a1 1 0 00-1 1v9a1 1 0 001 1h9a1 1 0 001-1v-3M10 2h4m0 0v4m0-4L7 9"/>
              </svg>
              Open
            </a>
            <a class="sp-pdf__btn" href=${this.src} download title="Download">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
                <path d="M8 2v8m0 0l-3-3m3 3l3-3M3 13h10"/>
              </svg>
              Download
            </a>
          </div>
        ` : nothing}

        <div class="sp-pdf__body" style="height:${this.height}px">
          ${this._loading ? html`
            <div class="sp-pdf__loading">
              <div class="sp-pdf__spinner"></div>
              <span>Loading PDF…</span>
            </div>
          ` : nothing}

          ${this._error ? html`
            <div class="sp-pdf__error-msg">
              <p>Could not display the PDF inline.</p>
              <a class="sp-pdf__btn sp-pdf__btn--primary" href=${this.src} target="_blank" rel="noopener">
                Open PDF in new tab
              </a>
            </div>
          ` : nothing}

          <iframe
            src=${this.src}
            class="sp-pdf__frame"
            style="opacity:${this._loading || this._error ? "0" : "1"}"
            title=${this.label}
            @load=${() => this.#onLoad()}
            @error=${() => this.#onError()}
          ></iframe>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "sp-pdf-viewer": SpPdfViewerComponent;
  }
}

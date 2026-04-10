import { LitElement, html, unsafeCSS, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import styles from "./sp-phone-input.css?inline";
import { PHONE_COUNTRIES } from "./sp-phone-countries.js";
import type { SpPhoneCountry } from "./sp-phone-input.types.js";

/**
 * Phone number input with country code selector.
 *
 * @element sp-phone-input
 *
 * @prop {string}  value       - The phone number (without dial code)
 * @prop {string}  country     - ISO 3166-1 alpha-2 country code (e.g. "US")
 * @prop {string}  label       - Label text
 * @prop {string}  placeholder - Input placeholder
 * @prop {string}  error       - Error message
 * @prop {string}  hint        - Hint text
 * @prop {boolean} disabled    - Disables the input
 * @prop {boolean} required    - Marks the field as required
 * @prop {string}  name        - Name for FormData
 *
 * @fires {CustomEvent<{ value: string, dialCode: string, country: string, full: string }>} sp-change
 * @fires {CustomEvent<{ value: string }>} sp-input
 */
@customElement("sp-phone-input")
export class SpPhoneInputComponent extends LitElement {
  static override styles = unsafeCSS(styles);
  static formAssociated = true;

  readonly #internals: ElementInternals;

  constructor() {
    super();
    this.#internals = this.attachInternals();
  }

  @property({ type: String })
  value = "";

  @property({ type: String })
  country = "US";

  @property({ type: String })
  label = "";

  @property({ type: String })
  placeholder = "";

  @property({ type: String })
  error = "";

  @property({ type: String })
  hint = "";

  @property({ type: Boolean, reflect: true })
  disabled = false;

  @property({ type: Boolean, reflect: true })
  required = false;

  @property({ type: String })
  name = "";

  @state() private _open = false;
  @state() private _search = "";

  get #selected(): SpPhoneCountry {
    return PHONE_COUNTRIES.find(c => c.code === this.country)
      ?? PHONE_COUNTRIES.find(c => c.code === "US")!;
  }

  get #filtered(): SpPhoneCountry[] {
    const q = this._search.toLowerCase();
    if (!q) return PHONE_COUNTRIES;
    return PHONE_COUNTRIES.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.dial.includes(q) ||
      c.code.toLowerCase().includes(q)
    );
  }

  get #fullValue(): string {
    return this.#selected.dial + this.value;
  }

  override updated(changed: Map<string, unknown>) {
    if (changed.has("value") || changed.has("country")) {
      this.#internals.setFormValue(this.#fullValue);
      if (this.required && !this.value) {
        this.#internals.setValidity({ valueMissing: true }, "This field is required");
      } else {
        this.#internals.setValidity({});
      }
    }
  }

  formResetCallback() {
    this.value = "";
    this.#internals.setFormValue("");
  }

  private _selectCountry(c: SpPhoneCountry) {
    this.country = c.code;
    this._open = false;
    this._search = "";
    this.dispatchEvent(new CustomEvent("sp-change", {
      detail: { value: this.value, dialCode: c.dial, country: c.code, full: c.dial + this.value },
      bubbles: true, composed: true,
    }));
  }

  private _handleInput(e: Event) {
    const input = e.target as HTMLInputElement;
    // Strip everything except digits, spaces, dashes, parentheses and dots
    const filtered = input.value.replace(/[^\d\s\-().]/g, "");
    if (filtered !== input.value) {
      const pos = input.selectionStart ?? filtered.length;
      input.value = filtered;
      input.setSelectionRange(pos, pos);
    }
    this.value = filtered;
    this.dispatchEvent(new CustomEvent("sp-input", {
      detail: { value: this.value },
      bubbles: true, composed: true,
    }));
    this.dispatchEvent(new CustomEvent("sp-change", {
      detail: { value: this.value, dialCode: this.#selected.dial, country: this.country, full: this.#fullValue },
      bubbles: true, composed: true,
    }));
  }

  private _handleKeydown(e: KeyboardEvent) {
    // Allow: control keys, arrows, backspace, delete, tab
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if (["Backspace","Delete","ArrowLeft","ArrowRight","ArrowUp","ArrowDown","Tab","Enter","Home","End"].includes(e.key)) return;
    // Allow digits and common phone separators
    if (/^[\d\s\-().]$/.test(e.key)) return;
    e.preventDefault();
  }

  private _handleDocClick = (e: MouseEvent) => {
    if (!this.shadowRoot?.contains(e.target as Node)) {
      this._open = false;
    }
  };

  override connectedCallback() {
    super.connectedCallback();
    document.addEventListener("click", this._handleDocClick);
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener("click", this._handleDocClick);
  }

  override render() {
    const sel = this.#selected;
    const filtered = this.#filtered;

    return html`
      ${this.label ? html`
        <label class="sp-phone-label">
          ${this.label}
          ${this.required ? html`<span class="sp-required"> *</span>` : nothing}
        </label>
      ` : nothing}

      <div class=${classMap({
        "sp-phone-container": true,
        "sp-phone-container--error": !!this.error,
      })}>
        <!-- Country selector -->
        <div class="sp-phone-country">
          <button
            type="button"
            class="sp-phone-country-btn"
            ?disabled=${this.disabled}
            aria-haspopup="listbox"
            aria-expanded=${this._open}
            @click=${(e: Event) => { e.stopPropagation(); this._open = !this._open; this._search = ""; }}
          >
            <span class="sp-phone-flag" aria-hidden="true">${sel.flag}</span>
            <span class="sp-phone-dial">${sel.dial}</span>
            <span class="sp-phone-chevron">▾</span>
          </button>

          ${this._open ? html`
            <div class="sp-phone-dropdown" role="listbox">
              <div class="sp-phone-search">
                <input
                  type="text"
                  placeholder="Search country..."
                  .value=${this._search}
                  @input=${(e: Event) => { this._search = (e.target as HTMLInputElement).value; }}
                  @click=${(e: Event) => e.stopPropagation()}
                  autofocus
                />
              </div>
              <div class="sp-phone-list">
                ${filtered.length === 0
                  ? html`<div class="sp-phone-option" style="color: var(--sp-text-muted, #6b7280);">No results</div>`
                  : filtered.map(c => html`
                    <div
                      class=${classMap({
                        "sp-phone-option": true,
                        "sp-phone-option--selected": c.code === this.country,
                      })}
                      role="option"
                      aria-selected=${c.code === this.country}
                      @click=${() => this._selectCountry(c)}
                    >
                      <span aria-hidden="true">${c.flag}</span>
                      <span class="sp-phone-option-name">${c.name}</span>
                      <span class="sp-phone-option-dial">${c.dial}</span>
                    </div>
                  `)
                }
              </div>
            </div>
          ` : nothing}
        </div>

        <!-- Number input -->
        <input
          class="sp-phone-input"
          type="tel"
          .value=${this.value}
          placeholder=${this.placeholder || nothing}
          ?disabled=${this.disabled}
          ?required=${this.required}
          name=${this.name || nothing}
          aria-label=${this.label ? `${this.label} number` : "Phone number"}
          aria-invalid=${this.error ? "true" : nothing}
          inputmode="numeric"
          @input=${this._handleInput}
          @keydown=${this._handleKeydown}
        />
      </div>

      <div class="sp-phone-footer">
        ${this.error
          ? html`<span class="sp-phone-error" role="alert">${this.error}</span>`
          : this.hint
          ? html`<span class="sp-phone-hint">${this.hint}</span>`
          : nothing}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "sp-phone-input": SpPhoneInputComponent;
  }
}

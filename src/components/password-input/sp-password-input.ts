import { LitElement, html, unsafeCSS, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import styles from "./sp-password-input.css?inline";
import { SpConfig } from "../../config.js";

function calcStrength(pw: string): 0 | 1 | 2 | 3 | 4 {
  if (!pw) return 0;
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return Math.min(4, score) as 0 | 1 | 2 | 3 | 4;
}

const LABELS = ["", "Muy débil", "Débil", "Buena", "Fuerte"];

/**
 * Password Input — campo de contraseña con toggle visibilidad y medidor de fortaleza.
 *
 * @element sp-password-input
 *
 * @prop {string}  value          - Valor actual
 * @prop {string}  placeholder    - Texto de ayuda
 * @prop {boolean} show-strength  - Muestra la barra de fortaleza
 * @prop {boolean} disabled       - Deshabilita
 * @prop {boolean} invalid        - Estado de error
 * @prop {string}  name           - Nombre del campo para formularios
 * @prop {string}  autocomplete   - Valor del atributo autocomplete (default "current-password")
 *
 * @fires {CustomEvent<{value:string,strength:number}>} sp-input  - En cada tecla
 * @fires {CustomEvent<{value:string,strength:number}>} sp-change - Al perder foco
 */
@customElement("sp-password-input")
export class SpPasswordInputComponent extends LitElement {
  static override styles = unsafeCSS(styles);

  @property({ type: String }) value = "";
  @property({ type: String }) placeholder = "Contraseña";
  @property({ type: Boolean, attribute: "show-strength" }) showStrength = false;
  @property({ type: Boolean }) disabled = false;
  @property({ type: Boolean, reflect: true }) invalid = false;
  @property({ type: String }) name = "";
  @property({ type: String }) autocomplete = "current-password";

  @state() private _visible = false;
  @state() private _strength: 0 | 1 | 2 | 3 | 4 = 0;

  #onInput(e: Event) {
    this.value = (e.target as HTMLInputElement).value;
    this._strength = calcStrength(this.value);
    this.dispatchEvent(new CustomEvent("sp-input", {
      detail: { value: this.value, strength: this._strength },
      bubbles: true, composed: true,
    }));
  }

  #onChange() {
    this.dispatchEvent(new CustomEvent("sp-change", {
      detail: { value: this.value, strength: this._strength },
      bubbles: true, composed: true,
    }));
  }

  override render() {
    const s = this._strength;

    return html`
      <div>
        <div class="sp-pw-wrapper">
          <input
            class="sp-pw-input"
            type=${this._visible ? "text" : "password"}
            .value=${this.value}
            placeholder=${this.placeholder}
            ?disabled=${this.disabled}
            name=${this.name}
            autocomplete=${this.autocomplete}
            @input=${(e: Event) => this.#onInput(e)}
            @change=${() => this.#onChange()}
          />
          <button
            class="sp-pw-toggle"
            type="button"
            aria-label=${this._visible ? SpConfig.locale.passwordInput.hideLabel : SpConfig.locale.passwordInput.showLabel}
            @click=${() => { this._visible = !this._visible; }}
          >
            ${this._visible
              ? html`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`
              : html`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`
            }
          </button>
        </div>

        ${this.showStrength && this.value ? html`
          <div class="sp-pw-strength">
            <div class="sp-pw-strength-bars">
              ${[1,2,3,4].map(i => html`
                <div class=${classMap({
                  "sp-pw-strength-bar": true,
                  [`sp-pw-strength-bar--active-${s}`]: i <= s,
                })}></div>
              `)}
            </div>
            <span class="sp-pw-strength-label sp-pw-strength-label--${s}">${LABELS[s]}</span>
          </div>
        ` : nothing}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap { "sp-password-input": SpPasswordInputComponent; }
}

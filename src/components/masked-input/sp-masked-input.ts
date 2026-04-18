import { LitElement, html, unsafeCSS, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import styles from "./sp-masked-input.css?inline";

/**
 * Token map: `9` = dígito, `a` = letra, `*` = cualquier carácter.
 * Cualquier otro carácter en la máscara se trata como literal.
 *
 * Ejemplos de máscaras:
 *   Teléfono:        "(999) 999-9999"
 *   Fecha:           "99/99/9999"
 *   Tarjeta:         "9999 9999 9999 9999"
 *   IBAN:            "aa99 9999 9999 9999 9999 99"
 *   Código postal:   "99999"
 */

function applyMask(raw: string, mask: string): string {
  let ri = 0;
  let result = "";
  for (let mi = 0; mi < mask.length && ri < raw.length; mi++) {
    const mc = mask[mi]!;
    const rc = raw[ri]!;
    if (mc === "9") {
      if (/\d/.test(rc)) { result += rc; ri++; }
      else ri++;
    } else if (mc === "a") {
      if (/[a-zA-Z]/.test(rc)) { result += rc; ri++; }
      else ri++;
    } else if (mc === "*") {
      result += rc; ri++;
    } else {
      result += mc;
      if (rc === mc) ri++;
    }
  }
  return result;
}

function stripLiterals(masked: string, mask: string): string {
  return masked.split("").filter((_, i) => {
    const mc = mask[i];
    return mc === "9" || mc === "a" || mc === "*";
  }).join("");
}

/**
 * Masked Input — input con máscara de formato.
 *
 * @element sp-masked-input
 *
 * @prop {string}  mask        - Máscara de formato. Tokens: 9=dígito, a=letra, *=cualquier
 * @prop {string}  value       - Valor sin máscara (solo los caracteres ingresados)
 * @prop {string}  placeholder - Texto de ayuda
 * @prop {boolean} show-mask   - Muestra la máscara como hint debajo del input
 * @prop {boolean} disabled    - Deshabilita
 * @prop {boolean} invalid     - Estado de error
 * @prop {string}  error       - Mensaje de error
 *
 * @fires {CustomEvent<{value:string,masked:string}>} sp-input  - En cada cambio
 * @fires {CustomEvent<{value:string,masked:string}>} sp-change - Al perder foco
 */
@customElement("sp-masked-input")
export class SpMaskedInputComponent extends LitElement {
  static override styles = unsafeCSS(styles);

  @property({ type: String }) mask = "";
  @property({ type: String }) value = "";
  @property({ type: String }) placeholder = "";
  @property({ type: Boolean, attribute: "show-mask" }) showMask = false;
  @property({ type: Boolean }) disabled = false;
  @property({ type: Boolean, reflect: true }) invalid = false;
  @property({ type: String }) error = "";
  @property({ type: String }) name = "";

  @state() private _displayValue = "";

  override updated(changed: Map<string, unknown>) {
    if (changed.has("value") && this.mask) {
      this._displayValue = applyMask(this.value, this.mask);
    }
  }

  #onInput(e: Event) {
    const input = e.target as HTMLInputElement;
    const raw = stripLiterals(input.value, this.mask);
    const masked = applyMask(raw, this.mask);
    this._displayValue = masked;
    input.value = masked;
    this.value = raw;
    this.dispatchEvent(new CustomEvent("sp-input", {
      detail: { value: raw, masked },
      bubbles: true, composed: true,
    }));
  }

  #onChange() {
    const raw = this.value;
    const masked = applyMask(raw, this.mask);
    this.dispatchEvent(new CustomEvent("sp-change", {
      detail: { value: raw, masked },
      bubbles: true, composed: true,
    }));
  }

  #onKeydown(e: KeyboardEvent) {
    if (!this.mask) return;
    const input = e.target as HTMLInputElement;
    const pos = input.selectionStart ?? 0;
    // Skip over literals on delete
    if (e.key === "Backspace" && pos > 0) {
      const prevChar = this._displayValue[pos - 1];
      const maskChar = this.mask[pos - 1];
      if (maskChar && maskChar !== "9" && maskChar !== "a" && maskChar !== "*" && prevChar === maskChar) {
        e.preventDefault();
        input.selectionStart = pos - 1;
        input.selectionEnd = pos - 1;
      }
    }
  }

  override render() {
    return html`
      <div>
        <div class="sp-mi-wrapper">
          <input
            class=${classMap({ "sp-mi-input": true, "sp-mi-input--error": this.invalid })}
            type="text"
            .value=${this._displayValue || (this.mask ? applyMask(this.value, this.mask) : this.value)}
            placeholder=${this.placeholder || this.mask.replace(/[9a*]/g, "_")}
            ?disabled=${this.disabled}
            name=${this.name}
            inputmode=${this.mask && /^[9]+[\s\-9]*$/.test(this.mask) ? "numeric" : "text"}
            autocomplete="off"
            @input=${(e: Event) => this.#onInput(e)}
            @change=${() => this.#onChange()}
            @keydown=${(e: KeyboardEvent) => this.#onKeydown(e)}
          />
        </div>
        ${this.showMask && this.mask ? html`
          <div class="sp-mi-hint">${this.mask}</div>
        ` : nothing}
        ${this.error ? html`<div class="sp-mi-error">${this.error}</div>` : nothing}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap { "sp-masked-input": SpMaskedInputComponent; }
}

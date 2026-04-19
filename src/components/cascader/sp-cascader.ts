import { LitElement, html, unsafeCSS, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import styles from "./sp-cascader.css?inline";

export interface SpCascaderOption {
  value: string;
  label: string;
  disabled?: boolean;
  children?: SpCascaderOption[];
}

/**
 * Cascader — selector en cascada para datos jerárquicos (país → estado → ciudad).
 *
 * @element sp-cascader
 *
 * @prop {SpCascaderOption[]} options     - Árbol de opciones
 * @prop {string[]}           value       - Valor seleccionado como path de values
 * @prop {string}             placeholder - Texto cuando no hay selección
 * @prop {boolean}            clearable   - Muestra botón para limpiar selección
 * @prop {boolean}            disabled    - Deshabilita el componente
 * @prop {string}             separator   - Separador entre niveles en el display (default " / ")
 *
 * @fires {CustomEvent<{value:string[],labels:string[]}>} sp-change - Al seleccionar una opción hoja
 * @fires {CustomEvent} sp-clear - Al limpiar
 */
@customElement("sp-cascader")
export class SpCascaderComponent extends LitElement {
  static override styles = unsafeCSS(styles);

  @property({ type: Array }) options: SpCascaderOption[] = [];
  @property({ type: Array }) value: string[] = [];
  @property({ type: String }) placeholder = "Seleccionar";
  @property({ type: Boolean }) clearable = true;
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Boolean, reflect: true }) open = false;
  @property({ type: String }) separator = " / ";

  @state() private _activePath: string[] = [];

  readonly #onOutside = (e: MouseEvent) => {
    if (!this.shadowRoot?.contains(e.target as Node) && !this.contains(e.target as Node)) {
      this.open = false;
    }
  };

  override connectedCallback() {
    super.connectedCallback();
    document.addEventListener("click", this.#onOutside);
    document.addEventListener("keydown", this.#onKeydown);
  }
  override disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener("click", this.#onOutside);
    document.removeEventListener("keydown", this.#onKeydown);
  }

  readonly #onKeydown = (e: KeyboardEvent) => {
    if (e.key === "Escape") this.open = false;
  };

  #toggle() {
    if (this.disabled) return;
    this.open = !this.open;
    if (this.open) {
      this._activePath = [...this.value].slice(0, -1);
    }
  }

  #getColumns(): SpCascaderOption[][] {
    const cols: SpCascaderOption[][] = [this.options];
    let current = this.options;
    for (const val of this._activePath) {
      const found = current.find(o => o.value === val);
      if (found?.children?.length) {
        cols.push(found.children);
        current = found.children;
      } else break;
    }
    return cols;
  }

  #selectOption(option: SpCascaderOption, level: number) {
    if (option.disabled) return;
    const newPath = [...this._activePath.slice(0, level), option.value];
    this._activePath = newPath;

    if (!option.children?.length) {
      this.value = newPath;
      this.open = false;
      const labels = this.#getLabels(newPath);
      this.dispatchEvent(new CustomEvent("sp-change", {
        detail: { value: newPath, labels },
        bubbles: true, composed: true,
      }));
    }
  }

  #getLabels(path: string[]): string[] {
    const labels: string[] = [];
    let opts = this.options;
    for (const val of path) {
      const found = opts.find(o => o.value === val);
      if (!found) break;
      labels.push(found.label);
      opts = found.children ?? [];
    }
    return labels;
  }

  #clear(e: Event) {
    e.stopPropagation();
    this.value = [];
    this._activePath = [];
    this.dispatchEvent(new CustomEvent("sp-clear", { bubbles: true, composed: true }));
  }

  #getDisplayLabel() {
    if (!this.value.length) return "";
    return this.#getLabels(this.value).join(this.separator);
  }

  override render() {
    const label = this.#getDisplayLabel();
    const columns = this.open ? this.#getColumns() : [];

    return html`
      <div style="position:relative;display:block">
        <div class="sp-casc-trigger" @click=${() => this.#toggle()} role="combobox" tabindex="0"
          aria-expanded=${this.open} aria-haspopup="listbox"
          @keydown=${(e: KeyboardEvent) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); this.#toggle(); }}}
        >
          <span class="sp-casc-trigger-text ${!label ? "sp-casc-trigger-text--placeholder" : ""}">
            ${label || this.placeholder}
          </span>
          ${this.clearable && label ? html`
            <span class="sp-casc-clear" @click=${(e: Event) => this.#clear(e)} aria-label="Limpiar">✕</span>
          ` : nothing}
          <span class="sp-casc-trigger-arrow">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6l4 4 4-4"/></svg>
          </span>
        </div>

        ${this.open ? html`
          <div class="sp-casc-panel" role="listbox">
            ${columns.map((col, level) => html`
              <div class="sp-casc-column" role="group">
                ${col.map(option => html`
                  <div
                    class=${classMap({
                      "sp-casc-item": true,
                      "sp-casc-item--active": this._activePath[level] === option.value || this.value[level] === option.value,
                      "sp-casc-item--disabled": !!option.disabled,
                    })}
                    role="option"
                    aria-selected=${this._activePath[level] === option.value}
                    @click=${() => this.#selectOption(option, level)}
                  >
                    <span>${option.label}</span>
                    ${option.children?.length ? html`
                      <span class="sp-casc-item-arrow">
                        <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3l5 5-5 5"/></svg>
                      </span>
                    ` : nothing}
                  </div>
                `)}
              </div>
            `)}
          </div>
        ` : nothing}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap { "sp-cascader": SpCascaderComponent; }
}

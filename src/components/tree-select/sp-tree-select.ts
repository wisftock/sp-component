import { LitElement, html, unsafeCSS, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import styles from "./sp-tree-select.css?inline";

export interface SpTreeSelectNode {
  value: string;
  label: string;
  disabled?: boolean;
  children?: SpTreeSelectNode[];
}

/**
 * Tree Select — dropdown con árbol jerárquico seleccionable.
 *
 * @element sp-tree-select
 *
 * @prop {SpTreeSelectNode[]} options     - Árbol de datos
 * @prop {string|string[]}    value       - Valor seleccionado (string en single, string[] en multiple)
 * @prop {boolean}            multiple    - Permite selección múltiple con checkboxes
 * @prop {boolean}            searchable  - Muestra campo de búsqueda (default true)
 * @prop {string}             placeholder - Texto sin selección
 * @prop {boolean}            disabled    - Deshabilita
 *
 * @fires {CustomEvent<{value:string|string[]}>} sp-change
 */
@customElement("sp-tree-select")
export class SpTreeSelectComponent extends LitElement {
  static override styles = unsafeCSS(styles);

  @property({ type: Array }) options: SpTreeSelectNode[] = [];
  @property() value: string | string[] = "";
  @property({ type: Boolean }) multiple = false;
  @property({ type: Boolean }) searchable = true;
  @property({ type: String }) placeholder = "Seleccionar";
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Boolean, reflect: true }) open = false;

  @state() private _expanded = new Set<string>();
  @state() private _search = "";

  readonly #onOutside = (e: MouseEvent) => {
    if (!this.shadowRoot?.contains(e.target as Node) && !this.contains(e.target as Node)) {
      this.open = false;
    }
  };

  override connectedCallback() {
    super.connectedCallback();
    document.addEventListener("click", this.#onOutside);
  }
  override disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener("click", this.#onOutside);
  }

  #toggle() {
    if (this.disabled) return;
    this.open = !this.open;
    if (this.open) this._search = "";
  }

  #toggleExpand(value: string, e: Event) {
    e.stopPropagation();
    const next = new Set(this._expanded);
    if (next.has(value)) next.delete(value); else next.add(value);
    this._expanded = next;
  }

  #selectNode(node: SpTreeSelectNode) {
    if (node.disabled) return;
    if (this.multiple) {
      const current = Array.isArray(this.value) ? this.value : (this.value ? [this.value] : []);
      const idx = current.indexOf(node.value);
      const next = idx >= 0 ? current.filter(v => v !== node.value) : [...current, node.value];
      this.value = next;
      this.dispatchEvent(new CustomEvent("sp-change", { detail: { value: next }, bubbles: true, composed: true }));
    } else {
      this.value = node.value;
      this.open = false;
      this.dispatchEvent(new CustomEvent("sp-change", { detail: { value: node.value }, bubbles: true, composed: true }));
    }
  }

  #removeTag(val: string, e: Event) {
    e.stopPropagation();
    const current = Array.isArray(this.value) ? this.value : [];
    this.value = current.filter(v => v !== val);
    this.dispatchEvent(new CustomEvent("sp-change", { detail: { value: this.value }, bubbles: true, composed: true }));
  }

  #isSelected(val: string): boolean {
    if (this.multiple) {
      return Array.isArray(this.value) && this.value.includes(val);
    }
    return this.value === val;
  }

  #getLabel(val: string): string {
    const find = (nodes: SpTreeSelectNode[]): string => {
      for (const n of nodes) {
        if (n.value === val) return n.label;
        if (n.children) { const r = find(n.children); if (r) return r; }
      }
      return val;
    };
    return find(this.options);
  }

  #filterNodes(nodes: SpTreeSelectNode[], q: string): SpTreeSelectNode[] {
    if (!q) return nodes;
    const lower = q.toLowerCase();
    return nodes.reduce<SpTreeSelectNode[]>((acc, node) => {
      const match = node.label.toLowerCase().includes(lower);
      const children = node.children ? this.#filterNodes(node.children, q) : [];
      if (match || children.length) {
        const merged: SpTreeSelectNode = { ...node };
        if (children.length) merged.children = children;
        else if (node.children) merged.children = node.children;
        acc.push(merged);
      }
      return acc;
    }, []);
  }

  #renderNodes(nodes: SpTreeSelectNode[]): unknown {
    return nodes.map(node => {
      const hasChildren = !!node.children?.length;
      const expanded = this._expanded.has(node.value);
      const selected = this.#isSelected(node.value);

      return html`
        <div>
          <div
            class=${classMap({
              "sp-trs-node": true,
              "sp-trs-node--selected": selected,
              "sp-trs-node--disabled": !!node.disabled,
            })}
            @click=${() => this.#selectNode(node)}
            role="option"
            aria-selected=${selected}
          >
            <button
              class=${classMap({ "sp-trs-expand": true, "sp-trs-expand--open": expanded, "sp-trs-expand--leaf": !hasChildren })}
              @click=${(e: Event) => hasChildren && this.#toggleExpand(node.value, e)}
              tabindex="-1"
            >
              <svg width="10" height="10" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3l5 5-5 5"/></svg>
            </button>
            ${this.multiple ? html`
              <span class="sp-trs-checkbox">
                ${selected ? html`<svg width="10" height="10" viewBox="0 0 16 16" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8l4 4 6-7"/></svg>` : nothing}
              </span>
            ` : nothing}
            <span>${node.label}</span>
          </div>
          ${hasChildren && expanded ? html`
            <div class="sp-trs-children">${this.#renderNodes(node.children!)}</div>
          ` : nothing}
        </div>
      `;
    });
  }

  override render() {
    const selectedVals = this.multiple
      ? (Array.isArray(this.value) ? this.value : [])
      : [];
    const singleLabel = !this.multiple && this.value ? this.#getLabel(this.value as string) : "";
    const filteredNodes = this.#filterNodes(this.options, this._search);

    return html`
      <div style="position:relative;display:inline-block">
        <div class="sp-trs-trigger" @click=${() => this.#toggle()} role="combobox" tabindex="0"
          aria-expanded=${this.open}
          @keydown=${(e: KeyboardEvent) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); this.#toggle(); }}}
        >
          ${this.multiple
            ? selectedVals.length
              ? selectedVals.map(v => html`
                <span class="sp-trs-tag">
                  ${this.#getLabel(v)}
                  <button class="sp-trs-tag-remove" @click=${(e: Event) => this.#removeTag(v, e)} aria-label="Eliminar">✕</button>
                </span>
              `)
              : html`<span class="sp-trs-placeholder">${this.placeholder}</span>`
            : singleLabel
              ? html`<span>${singleLabel}</span>`
              : html`<span class="sp-trs-placeholder">${this.placeholder}</span>`
          }
          <span class="sp-trs-arrow">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6l4 4 4-4"/></svg>
          </span>
        </div>

        ${this.open ? html`
          <div class="sp-trs-panel" role="listbox" aria-multiselectable=${this.multiple}>
            ${this.searchable ? html`
              <div class="sp-trs-search">
                <input
                  type="text"
                  placeholder="Buscar..."
                  .value=${this._search}
                  @input=${(e: Event) => { this._search = (e.target as HTMLInputElement).value; }}
                  @click=${(e: Event) => e.stopPropagation()}
                  autofocus
                />
              </div>
            ` : nothing}
            <div class="sp-trs-tree">
              ${this.#renderNodes(filteredNodes)}
            </div>
          </div>
        ` : nothing}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap { "sp-tree-select": SpTreeSelectComponent; }
}

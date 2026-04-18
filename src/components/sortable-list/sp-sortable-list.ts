import { LitElement, html, unsafeCSS, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import styles from "./sp-sortable-list.css?inline";

export interface SortableItem {
  id: string;
  label: string;
  description?: string;
  icon?: string;
  disabled?: boolean;
}

/**
 * Sortable List — lista reordenable por drag & drop.
 *
 * @element sp-sortable-list
 *
 * @prop {SortableItem[]} items    - Array de ítems
 * @prop {boolean}        disabled - Deshabilita el drag
 * @prop {boolean}        handles  - Muestra handle explícito en lugar de toda la fila
 *
 * @fires {CustomEvent<{ items: SortableItem[] }>} sp-change - Al reordenar
 */
@customElement("sp-sortable-list")
export class SpSortableListComponent extends LitElement {
  static override styles = unsafeCSS(styles);

  @property({ type: Array }) items: SortableItem[] = [];
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Boolean, reflect: true }) handles = false;

  @state() private _dragging: string | null = null;
  @state() private _dragOver: string | null = null;

  #dragId: string | null = null;

  #onDragStart(e: DragEvent, id: string) {
    if (this.disabled) return;
    this.#dragId = id;
    this._dragging = id;
    e.dataTransfer!.effectAllowed = "move";
    e.dataTransfer!.setData("text/plain", id);
  }

  #onDragOver(e: DragEvent, id: string) {
    e.preventDefault();
    e.dataTransfer!.dropEffect = "move";
    if (id !== this._dragOver) this._dragOver = id;
  }

  #onDrop(e: DragEvent, targetId: string) {
    e.preventDefault();
    const fromId = this.#dragId;
    if (!fromId || fromId === targetId) {
      this._dragging = null;
      this._dragOver = null;
      return;
    }

    const list = [...this.items];
    const fromIdx = list.findIndex(i => i.id === fromId);
    const toIdx   = list.findIndex(i => i.id === targetId);
    const [moved] = list.splice(fromIdx, 1);
    list.splice(toIdx, 0, moved!);

    this.items = list;
    this._dragging = null;
    this._dragOver = null;
    this.#dragId   = null;

    this.dispatchEvent(new CustomEvent("sp-change", {
      detail: { items: this.items },
      bubbles: true,
      composed: true,
    }));
  }

  #onDragEnd() {
    this._dragging = null;
    this._dragOver = null;
    this.#dragId   = null;
  }

  override render() {
    return html`
      <ul class="sp-sl" role="listbox" aria-label="Sortable list">
        ${this.items.map(item => {
          const isDragging = this._dragging === item.id;
          const isDragOver = this._dragOver === item.id && this._dragging !== item.id;
          const classes = [
            "sp-sl-item",
            isDragging  ? "sp-sl-item--dragging"  : "",
            isDragOver  ? "sp-sl-item--dragover"  : "",
            item.disabled ? "sp-sl-item--disabled" : "",
          ].filter(Boolean).join(" ");

          return html`
            <li
              class=${classes}
              draggable=${item.disabled || this.disabled ? "false" : "true"}
              @dragstart=${(e: DragEvent) => this.#onDragStart(e, item.id)}
              @dragover=${(e: DragEvent)  => this.#onDragOver(e, item.id)}
              @drop=${(e: DragEvent)      => this.#onDrop(e, item.id)}
              @dragend=${() => this.#onDragEnd()}
              aria-grabbed=${isDragging ? "true" : "false"}
            >
              ${this.handles ? html`
                <span class="sp-sl-handle" aria-hidden="true">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="9"  cy="6"  r="1.5"/>
                    <circle cx="15" cy="6"  r="1.5"/>
                    <circle cx="9"  cy="12" r="1.5"/>
                    <circle cx="15" cy="12" r="1.5"/>
                    <circle cx="9"  cy="18" r="1.5"/>
                    <circle cx="15" cy="18" r="1.5"/>
                  </svg>
                </span>
              ` : nothing}

              ${item.icon ? html`<span class="sp-sl-icon">${item.icon}</span>` : nothing}

              <div class="sp-sl-content">
                <span class="sp-sl-label">${item.label}</span>
                ${item.description ? html`<span class="sp-sl-desc">${item.description}</span>` : nothing}
              </div>

              ${!this.handles ? html`
                <span class="sp-sl-grip" aria-hidden="true">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="9"  cy="6"  r="1.5"/>
                    <circle cx="15" cy="6"  r="1.5"/>
                    <circle cx="9"  cy="12" r="1.5"/>
                    <circle cx="15" cy="12" r="1.5"/>
                    <circle cx="9"  cy="18" r="1.5"/>
                    <circle cx="15" cy="18" r="1.5"/>
                  </svg>
                </span>
              ` : nothing}
            </li>
          `;
        })}
      </ul>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap { "sp-sortable-list": SpSortableListComponent; }
}

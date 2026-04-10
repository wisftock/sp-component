import { LitElement, html, unsafeCSS, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import styles from "./sp-kanban.css?inline";
import { SpConfig } from "../../config.js";

export interface SpKanbanCard {
  id: string;
  title: string;
  description?: string;
  tags?: Array<{ label: string; color?: string; bg?: string }>;
  priority?: "low" | "medium" | "high";
  [key: string]: unknown;
}

export interface SpKanbanColumn {
  id: string;
  title: string;
  color?: string;        // Dot color
  cards: SpKanbanCard[];
  wip?: number;          // Max cards allowed (0 = unlimited)
}

/**
 * Kanban board with drag & drop using the HTML5 DnD API.
 *
 * @element sp-kanban
 *
 * @prop {SpKanbanColumn[]} columns    - Column and card data
 * @prop {boolean}          addable    - Show "Add card" button per column
 * @prop {boolean}          disabled   - Disable drag & drop
 *
 * @fires {CustomEvent<{ columns: SpKanbanColumn[] }>}                                  sp-change         - Any data mutation
 * @fires {CustomEvent<{ card: SpKanbanCard, fromCol: string, toCol: string, toIndex: number }>} sp-card-move
 * @fires {CustomEvent<{ column: SpKanbanColumn }>}                                     sp-add-card       - Add card button clicked
 */
@customElement("sp-kanban")
export class SpKanbanComponent extends LitElement {
  static override styles = unsafeCSS(styles);

  @property({ type: Array })
  columns: SpKanbanColumn[] = [];

  @property({ type: Boolean })
  addable = true;

  @property({ type: Boolean, reflect: true })
  disabled = false;

  @state() private _draggingCard: { card: SpKanbanCard; colId: string } | null = null;
  @state() private _overCol: string | null = null;
  @state() private _overCard: string | null = null;
  @state() private _addingToCol: string | null = null;
  @state() private _newTitle = "";
  @state() private _newDesc = "";

  #emit() {
    this.dispatchEvent(new CustomEvent("sp-change", {
      detail: { columns: this.columns },
      bubbles: true, composed: true,
    }));
  }

  #onDragStart(card: SpKanbanCard, colId: string, e: DragEvent) {
    if (this.disabled) return;
    this._draggingCard = { card, colId };
    e.dataTransfer!.effectAllowed = "move";
    e.dataTransfer!.setData("text/plain", card.id);
  }

  #onDragOver(e: DragEvent) {
    e.preventDefault();
    e.dataTransfer!.dropEffect = "move";
  }

  #onDropOnCol(toColId: string, e: DragEvent) {
    e.preventDefault();
    if (!this._draggingCard) return;
    const { card, colId: fromColId } = this._draggingCard;
    if (fromColId === toColId) { this.#reset(); return; }

    const cols = this.columns.map(c => ({ ...c, cards: [...c.cards] }));
    const fromCol = cols.find(c => c.id === fromColId)!;
    const toCol   = cols.find(c => c.id === toColId)!;
    fromCol.cards = fromCol.cards.filter(c => c.id !== card.id);
    toCol.cards.push(card);
    this.columns = cols;

    this.dispatchEvent(new CustomEvent("sp-card-move", {
      detail: { card, fromCol: fromColId, toCol: toColId, toIndex: toCol.cards.length - 1 },
      bubbles: true, composed: true,
    }));
    this.#emit();
    this.#reset();
  }

  #onDropOnCard(toColId: string, toCard: SpKanbanCard, e: DragEvent) {
    e.preventDefault();
    if (!this._draggingCard) return;
    const { card, colId: fromColId } = this._draggingCard;
    if (card.id === toCard.id) { this.#reset(); return; }

    const cols = this.columns.map(c => ({ ...c, cards: [...c.cards] }));
    const fromCol = cols.find(c => c.id === fromColId)!;
    const toCol   = cols.find(c => c.id === toColId)!;
    fromCol.cards = fromCol.cards.filter(c => c.id !== card.id);
    const toIndex = toCol.cards.findIndex(c => c.id === toCard.id);
    toCol.cards.splice(toIndex, 0, card);
    this.columns = cols;

    this.dispatchEvent(new CustomEvent("sp-card-move", {
      detail: { card, fromCol: fromColId, toCol: toColId, toIndex },
      bubbles: true, composed: true,
    }));
    this.#emit();
    this.#reset();
  }

  #reset() {
    this._draggingCard = null;
    this._overCol = null;
    this._overCard = null;
  }

  #openAddCard(colId: string) {
    this._addingToCol = colId;
    this._newTitle = "";
    this._newDesc = "";
    // Focus the textarea on next tick
    this.updateComplete.then(() => {
      (this.shadowRoot?.querySelector(".sp-kanban-add-input") as HTMLElement)?.focus();
    });
  }

  #confirmAdd(col: SpKanbanColumn) {
    if (!this._newTitle.trim()) { this._addingToCol = null; return; }
    const newCard: SpKanbanCard = {
      id: `card-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      title: this._newTitle.trim(),
      ...(this._newDesc.trim() ? { description: this._newDesc.trim() } : {}),
    };
    this.columns = this.columns.map(c =>
      c.id === col.id ? { ...c, cards: [...c.cards, newCard] } : c
    );
    this._addingToCol = null;
    this._newTitle = "";
    this._newDesc = "";
    this.dispatchEvent(new CustomEvent("sp-card-add", {
      detail: { card: newCard, column: col },
      bubbles: true, composed: true,
    }));
    this.#emit();
  }

  #cancelAdd() {
    this._addingToCol = null;
    this._newTitle = "";
    this._newDesc = "";
  }

  #priorityColor(p: string) {
    return p === "high" ? "#ef4444" : p === "medium" ? "#f59e0b" : "#22c55e";
  }

  override render() {
    return html`
      <div class="sp-kanban">
        ${this.columns.map(col => html`
          <div
            class=${classMap({
              "sp-kanban-col": true,
              "sp-kanban-col--over": this._overCol === col.id && this._draggingCard?.colId !== col.id,
            })}
            @dragover=${(e: DragEvent) => { this._overCol = col.id; this.#onDragOver(e); }}
            @dragleave=${() => { if (this._overCol === col.id) this._overCol = null; }}
            @drop=${(e: DragEvent) => this.#onDropOnCol(col.id, e)}
          >
            <div class="sp-kanban-col-header">
              ${col.color ? html`<span class="sp-kanban-col-dot" style="background:${col.color}"></span>` : nothing}
              <span class="sp-kanban-col-title">${col.title}</span>
              <span class=${`sp-kanban-col-count${col.wip && col.cards.length >= col.wip ? " sp-kanban-col-count--over" : ""}`}>
                ${col.cards.length}${col.wip ? `/${col.wip}` : ""}
              </span>
            </div>

            <div class="sp-kanban-cards">
              ${col.cards.map(card => html`
                <div
                  class=${classMap({
                    "sp-kanban-card": true,
                    "sp-kanban-card--dragging": this._draggingCard?.card.id === card.id,
                    "sp-kanban-card--over": this._overCard === card.id,
                  })}
                  draggable=${!this.disabled}
                  @dragstart=${(e: DragEvent) => this.#onDragStart(card, col.id, e)}
                  @dragend=${() => this.#reset()}
                  @dragover=${(e: DragEvent) => { e.preventDefault(); this._overCard = card.id; }}
                  @dragleave=${() => { if (this._overCard === card.id) this._overCard = null; }}
                  @drop=${(e: DragEvent) => this.#onDropOnCard(col.id, card, e)}
                >
                  <div class="sp-kanban-card-title">${card.title}</div>
                  ${card.description ? html`<div class="sp-kanban-card-desc">${card.description}</div>` : nothing}
                  ${(card.tags?.length || card.priority) ? html`
                    <div class="sp-kanban-card-meta">
                      ${card.priority ? html`
                        <span class="sp-kanban-card-priority" style="color:${this.#priorityColor(card.priority)}">
                          ● ${card.priority}
                        </span>
                      ` : nothing}
                      ${card.tags?.map(t => html`
                        <span class="sp-kanban-card-tag"
                          style="background:${t.bg ?? "#f3f4f6"};color:${t.color ?? "#374151"}">
                          ${t.label}
                        </span>
                      `)}
                    </div>
                  ` : nothing}
                </div>
              `)}
            </div>

            ${this.addable ? html`
              ${this._addingToCol === col.id ? html`
                <div class="sp-kanban-add-form">
                  <textarea
                    class="sp-kanban-add-input"
                    rows="2"
                    placeholder=${SpConfig.locale.kanban.addPlaceholder}
                    .value=${this._newTitle}
                    @input=${(e: Event) => { this._newTitle = (e.target as HTMLTextAreaElement).value; }}
                    @keydown=${(e: KeyboardEvent) => {
                      if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); this.#confirmAdd(col); }
                      if (e.key === "Escape") this.#cancelAdd();
                    }}
                  ></textarea>
                  <input
                    class="sp-kanban-add-desc"
                    type="text"
                    placeholder="Description (optional)"
                    .value=${this._newDesc}
                    @input=${(e: Event) => { this._newDesc = (e.target as HTMLInputElement).value; }}
                  />
                  <div class="sp-kanban-add-actions">
                    <button class="sp-kanban-add-confirm" @click=${() => this.#confirmAdd(col)}>${SpConfig.locale.kanban.addConfirmLabel}</button>
                    <button class="sp-kanban-add-cancel" aria-label=${SpConfig.locale.kanban.addCancelLabel} @click=${() => this.#cancelAdd()}>✕</button>
                  </div>
                </div>
              ` : html`
                <button
                  class="sp-kanban-add-btn"
                  ?disabled=${!!(col.wip && col.cards.length >= col.wip)}
                  @click=${() => this.#openAddCard(col.id)}
                >+ ${SpConfig.locale.kanban.addCardLabel}</button>
              `}
            ` : nothing}
          </div>
        `)}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "sp-kanban": SpKanbanComponent;
  }
}

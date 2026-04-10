import { LitElement, html, unsafeCSS, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import styles from "./sp-transfer.css?inline";
import { SpConfig } from "../../config.js";

export interface SpTransferItem {
  value: string;
  label: string;
  disabled?: boolean;
}

/**
 * Transfer component — two panels with items movable between them.
 *
 * @element sp-transfer
 *
 * @prop {SpTransferItem[]} source      - All available items
 * @prop {string[]}         value       - Values in the target (right) panel
 * @prop {string}           sourceTitle - Left panel title
 * @prop {string}           targetTitle - Right panel title
 * @prop {boolean}          searchable  - Show search inputs
 * @prop {boolean}          disabled    - Disable all interactions
 *
 * @fires {CustomEvent<{ value: string[] }>} sp-change - Fired when items are moved
 */
@customElement("sp-transfer")
export class SpTransferComponent extends LitElement {
  static override styles = unsafeCSS(styles);

  @property({ type: Array })
  source: SpTransferItem[] = [];

  @property({ type: Array })
  value: string[] = [];

  @property({ type: String, attribute: "source-title" })
  sourceTitle = "";

  @property({ type: String, attribute: "target-title" })
  targetTitle = "";

  @property({ type: Boolean })
  searchable = true;

  @property({ type: Boolean, reflect: true })
  disabled = false;

  @state() private _leftSelected = new Set<string>();
  @state() private _rightSelected = new Set<string>();
  @state() private _leftSearch = "";
  @state() private _rightSearch = "";
  @state() private _dragItem: { value: string; from: "left" | "right" } | null = null;
  @state() private _dragOverPanel: "left" | "right" | null = null;

  get #leftItems(): SpTransferItem[] {
    const targetSet = new Set(this.value);
    return this.source.filter(i => !targetSet.has(i.value));
  }

  get #rightItems(): SpTransferItem[] {
    const targetSet = new Set(this.value);
    return this.source.filter(i => targetSet.has(i.value));
  }

  #filter(items: SpTransferItem[], q: string) {
    if (!q.trim()) return items;
    return items.filter(i => i.label.toLowerCase().includes(q.toLowerCase()));
  }

  #emit() {
    this.dispatchEvent(new CustomEvent("sp-change", {
      detail: { value: [...this.value] },
      bubbles: true, composed: true,
    }));
  }

  #moveRight() {
    const toMove = [...this._leftSelected].filter(v => !this.value.includes(v));
    this.value = [...this.value, ...toMove];
    this._leftSelected = new Set();
    this.#emit();
  }

  #moveLeft() {
    const toRemove = this._rightSelected;
    this.value = this.value.filter(v => !toRemove.has(v));
    this._rightSelected = new Set();
    this.#emit();
  }

  #moveAllRight() {
    const leftKeys = this.#leftItems.filter(i => !i.disabled).map(i => i.value);
    this.value = [...this.value, ...leftKeys];
    this._leftSelected = new Set();
    this.#emit();
  }

  #moveAllLeft() {
    const rightKeys = this.#rightItems.filter(i => !i.disabled).map(i => i.value);
    const toRemove = new Set(rightKeys);
    this.value = this.value.filter(v => !toRemove.has(v));
    this._rightSelected = new Set();
    this.#emit();
  }

  #toggleLeft(value: string, checked: boolean) {
    const next = new Set(this._leftSelected);
    checked ? next.add(value) : next.delete(value);
    this._leftSelected = next;
  }

  #toggleRight(value: string, checked: boolean) {
    const next = new Set(this._rightSelected);
    checked ? next.add(value) : next.delete(value);
    this._rightSelected = next;
  }

  #toggleAllLeft(checked: boolean) {
    this._leftSelected = checked
      ? new Set(this.#leftItems.filter(i => !i.disabled).map(i => i.value))
      : new Set();
  }

  #toggleAllRight(checked: boolean) {
    this._rightSelected = checked
      ? new Set(this.#rightItems.filter(i => !i.disabled).map(i => i.value))
      : new Set();
  }

  #onDragStart(item: SpTransferItem, from: "left" | "right") {
    if (this.disabled || item.disabled) return;
    this._dragItem = { value: item.value, from };
  }

  #onDragOver(e: DragEvent, panel: "left" | "right") {
    e.preventDefault();
    this._dragOverPanel = panel;
  }

  #onDrop(e: DragEvent, to: "left" | "right") {
    e.preventDefault();
    this._dragOverPanel = null;
    if (!this._dragItem || this._dragItem.from === to) { this._dragItem = null; return; }
    if (to === "right") {
      this.value = [...this.value, this._dragItem.value];
    } else {
      this.value = this.value.filter(v => v !== this._dragItem!.value);
    }
    this._dragItem = null;
    this.#emit();
  }

  #renderPanel(
    title: string,
    items: SpTransferItem[],
    selected: Set<string>,
    search: string,
    panel: "left" | "right",
    onSearch: (q: string) => void,
    onToggle: (v: string, c: boolean) => void,
    onToggleAll: (c: boolean) => void,
  ) {
    const filtered = this.#filter(items, search);
    const selectableItems = items.filter(i => !i.disabled);
    const allChecked = selectableItems.length > 0 && selectableItems.every(i => selected.has(i.value));
    const someChecked = selectableItems.some(i => selected.has(i.value));
    const isDragTarget = this._dragOverPanel === panel && this._dragItem?.from !== panel;

    return html`
      <div
        class=${classMap({ "sp-transfer-panel": true, "sp-transfer-panel--drag-over": isDragTarget })}
        @dragover=${(e: DragEvent) => this.#onDragOver(e, panel)}
        @dragleave=${() => { if (this._dragOverPanel === panel) this._dragOverPanel = null; }}
        @drop=${(e: DragEvent) => this.#onDrop(e, panel)}
      >
        <div class="sp-transfer-panel-header">
          <input
            type="checkbox"
            class="sp-transfer-panel-check"
            .checked=${allChecked}
            .indeterminate=${someChecked && !allChecked}
            ?disabled=${this.disabled || selectableItems.length === 0}
            @change=${(e: Event) => onToggleAll((e.target as HTMLInputElement).checked)}
          />
          <span class="sp-transfer-panel-title">${title}</span>
          <span class="sp-transfer-panel-count">${selected.size > 0 ? `${selected.size}/` : ""}${items.length}</span>
        </div>

        ${this.searchable ? html`
          <div class="sp-transfer-search">
            <input
              type="text"
              placeholder=${SpConfig.locale.transfer.searchPlaceholder}
              .value=${search}
              ?disabled=${this.disabled}
              @input=${(e: Event) => onSearch((e.target as HTMLInputElement).value)}
            />
          </div>
        ` : nothing}

        <div class="sp-transfer-list">
          ${filtered.length === 0
            ? html`<div class="sp-transfer-empty">No items</div>`
            : filtered.map(item => html`
              <label
                class=${classMap({
                  "sp-transfer-item": true,
                  "sp-transfer-item--selected": selected.has(item.value),
                  "sp-transfer-item--disabled": !!item.disabled,
                  "sp-transfer-item--dragging": this._dragItem?.value === item.value,
                })}
                draggable=${!this.disabled && !item.disabled ? "true" : "false"}
                @dragstart=${() => this.#onDragStart(item, panel)}
                @dragend=${() => { this._dragItem = null; this._dragOverPanel = null; }}
              >
                <input
                  type="checkbox"
                  .checked=${selected.has(item.value)}
                  ?disabled=${this.disabled || !!item.disabled}
                  @change=${(e: Event) => onToggle(item.value, (e.target as HTMLInputElement).checked)}
                />
                <svg class="sp-transfer-drag-icon" width="10" height="14" viewBox="0 0 10 14" fill="currentColor">
                  <circle cx="3" cy="3" r="1.5"/><circle cx="7" cy="3" r="1.5"/>
                  <circle cx="3" cy="7" r="1.5"/><circle cx="7" cy="7" r="1.5"/>
                  <circle cx="3" cy="11" r="1.5"/><circle cx="7" cy="11" r="1.5"/>
                </svg>
                ${item.label}
              </label>
            `)
          }
        </div>
      </div>
    `;
  }

  override render() {
    const leftItems = this.#leftItems;
    const rightItems = this.#rightItems;
    const canRight = this._leftSelected.size > 0 && !this.disabled;
    const canLeft = this._rightSelected.size > 0 && !this.disabled;
    const canAllRight = leftItems.filter(i => !i.disabled).length > 0 && !this.disabled;
    const canAllLeft = rightItems.filter(i => !i.disabled).length > 0 && !this.disabled;

    return html`
      <div class="sp-transfer">
        ${this.#renderPanel(
          this.sourceTitle || SpConfig.locale.transfer.sourceTitleLabel, leftItems, this._leftSelected, this._leftSearch, "left",
          q => { this._leftSearch = q; },
          (v, c) => this.#toggleLeft(v, c),
          c => this.#toggleAllLeft(c),
        )}

        <div class="sp-transfer-actions">
          <button class="sp-transfer-btn" title=${SpConfig.locale.transfer.moveAllLabel} ?disabled=${!canAllRight} @click=${() => this.#moveAllRight()}>»</button>
          <button class="sp-transfer-btn" title="›" ?disabled=${!canRight} @click=${() => this.#moveRight()}>›</button>
          <button class="sp-transfer-btn" title="‹" ?disabled=${!canLeft} @click=${() => this.#moveLeft()}>‹</button>
          <button class="sp-transfer-btn" title=${SpConfig.locale.transfer.removeAllLabel} ?disabled=${!canAllLeft} @click=${() => this.#moveAllLeft()}>«</button>
        </div>

        ${this.#renderPanel(
          this.targetTitle || SpConfig.locale.transfer.targetTitleLabel, rightItems, this._rightSelected, this._rightSearch, "right",
          q => { this._rightSearch = q; },
          (v, c) => this.#toggleRight(v, c),
          c => this.#toggleAllRight(c),
        )}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "sp-transfer": SpTransferComponent;
  }
}

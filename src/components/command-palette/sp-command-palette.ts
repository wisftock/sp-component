import { LitElement, unsafeCSS, html, nothing, type TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import styles from "./sp-command-palette.css?inline";
import { commandPaletteTemplate } from "./sp-command-palette.template.js";
import type { CommandItem } from "./sp-command-palette.types.js";

/**
 * Command palette component — a modal search/action launcher.
 *
 * @element sp-command-palette
 *
 * @prop {boolean} open          - Whether the palette is open
 * @prop {string}  placeholder   - Input placeholder text
 * @prop {string}  emptyMessage  - Message shown when no results
 * @prop {boolean} loading       - Show loading state
 *
 * @fires {CustomEvent} sp-open           - Emitted when palette opens
 * @fires {CustomEvent} sp-close          - Emitted when palette closes
 * @fires {CustomEvent<{item:CommandItem}>} sp-select - Emitted when an item is selected
 */
@customElement("sp-command-palette")
export class SpCommandPaletteComponent extends LitElement {
  static override styles = unsafeCSS(styles);

  @property({ type: Boolean, reflect: true })
  open = false;

  @property({ type: String })
  placeholder = "Search commands...";

  @property({ type: String, attribute: "empty-message" })
  emptyMessage = "No results found";

  @property({ type: Boolean })
  loading = false;

  @state()
  _query = "";

  @state()
  _activeIndex = -1;

  @state()
  _items: CommandItem[] = [];

  private _previousFocus: Element | null = null;

  setItems(items: CommandItem[]): void {
    this._items = items;
  }

  _getFilteredItems(): CommandItem[] {
    if (!this._query.trim()) return this._items;
    const q = this._query.toLowerCase();
    return this._items.filter((item) => {
      if (item.label.toLowerCase().includes(q)) return true;
      if (item.description?.toLowerCase().includes(q)) return true;
      if (item.keywords?.some((k) => k.toLowerCase().includes(q))) return true;
      return false;
    });
  }

  _renderGroups(items: CommandItem[]): TemplateResult {
    const grouped = new Map<string, CommandItem[]>();
    const ungrouped: CommandItem[] = [];

    for (const item of items) {
      if (item.group) {
        const arr = grouped.get(item.group) ?? [];
        arr.push(item);
        grouped.set(item.group, arr);
      } else {
        ungrouped.push(item);
      }
    }

    // Build a flat ordered list to compute global indices
    const orderedItems: CommandItem[] = [];
    if (ungrouped.length > 0) {
      for (const i of ungrouped) orderedItems.push(i);
    }
    for (const groupItems of grouped.values()) {
      for (const i of groupItems) orderedItems.push(i);
    }

    const results: TemplateResult[] = [];

    // Ungrouped first
    for (const item of ungrouped) {
      const idx = orderedItems.indexOf(item);
      results.push(this._renderItem(item, idx));
    }

    // Grouped
    for (const [groupName, groupItems] of grouped.entries()) {
      results.push(
        html`<div class="sp-command-group-header">${groupName}</div>`,
      );
      for (const item of groupItems) {
        const idx = orderedItems.indexOf(item);
        results.push(this._renderItem(item, idx));
      }
    }

    return html`${results}`;
  }

  private _renderItem(item: CommandItem, index: number): TemplateResult {
    const isActive = this._activeIndex === index;
    return html`
      <button
        class="sp-command-item ${isActive ? "sp-command-item--active" : ""} ${item.disabled ? "sp-command-item--disabled" : ""}"
        role="option"
        aria-selected=${isActive}
        aria-disabled=${item.disabled ?? false}
        @click=${() => this._executeItem(item)}
        @mouseenter=${() => this._setActiveIndex(index)}
      >
        ${item.icon
          ? html`<span class="sp-command-item-icon">${item.icon}</span>`
          : nothing}
        <div class="sp-command-item-body">
          <div class="sp-command-item-label">${item.label}</div>
          ${item.description
            ? html`<div class="sp-command-item-description">${item.description}</div>`
            : nothing}
        </div>
      </button>
    `;
  }

  _setActiveIndex(index: number): void {
    this._activeIndex = index;
  }

  _handleInput(e: Event): void {
    this._query = (e.target as HTMLInputElement).value;
    this._activeIndex = 0;
  }

  _handleKeydown = (e: KeyboardEvent): void => {
    const filtered = this._getFilteredItems();
    const len = filtered.length;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      this._activeIndex = len === 0 ? -1 : (this._activeIndex + 1) % len;
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      this._activeIndex =
        len === 0
          ? -1
          : this._activeIndex <= 0
            ? len - 1
            : this._activeIndex - 1;
    } else if (e.key === "Enter") {
      e.preventDefault();
      const item = filtered[this._activeIndex];
      if (item) this._executeItem(item);
    } else if (e.key === "Escape") {
      e.preventDefault();
      this._close();
    }
  };

  _executeItem(item: CommandItem): void {
    if (item.disabled) return;
    item.action?.();
    this.dispatchEvent(
      new CustomEvent("sp-select", {
        detail: { item },
        bubbles: true,
        composed: true,
      }),
    );
    this._close();
  }

  _close(): void {
    this.open = false;
    this._query = "";
    this._activeIndex = -1;
    this.dispatchEvent(
      new CustomEvent("sp-close", { bubbles: true, composed: true }),
    );
  }

  override updated(changed: Map<string, unknown>): void {
    if (changed.has("open")) {
      if (this.open) {
        this._previousFocus = document.activeElement;
        this.dispatchEvent(
          new CustomEvent("sp-open", { bubbles: true, composed: true }),
        );
        this.updateComplete.then(() => {
          const input = this.shadowRoot?.querySelector<HTMLInputElement>(
            ".sp-command-palette-input",
          );
          input?.focus();
        });
      } else {
        (this._previousFocus as HTMLElement)?.focus?.();
        this._previousFocus = null;
      }
    }
  }

  override render() {
    return commandPaletteTemplate.call(this);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "sp-command-palette": SpCommandPaletteComponent;
  }
}

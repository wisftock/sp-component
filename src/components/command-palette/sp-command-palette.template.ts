import { html, nothing, type TemplateResult } from "lit";
import type { SpCommandPaletteComponent } from "./sp-command-palette.js";

export function commandPaletteTemplate(
  this: SpCommandPaletteComponent,
): TemplateResult {
  if (!this.open) return html`${nothing}`;

  const filteredItems = this._getFilteredItems();

  return html`
    <div class="sp-command-palette-backdrop" @click=${this._close}></div>
    <div
      class="sp-command-palette"
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
      @click=${(e: Event) => e.stopPropagation()}
    >
      <div class="sp-command-palette-search">
        <svg
          class="sp-command-search-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <input
          class="sp-command-palette-input"
          type="text"
          placeholder=${this.placeholder}
          .value=${this._query}
          @input=${this._handleInput}
          @keydown=${this._handleKeydown}
          role="combobox"
          aria-expanded="true"
          aria-autocomplete="list"
          aria-controls="sp-command-list"
          autocomplete="off"
        />
        <kbd class="sp-command-esc-hint">Esc</kbd>
      </div>

      <div
        class="sp-command-palette-results"
        id="sp-command-list"
        role="listbox"
      >
        ${this.loading
          ? html`<div class="sp-command-loading">Loading...</div>`
          : nothing}
        ${filteredItems.length === 0 && !this.loading
          ? html`<div class="sp-command-empty">${this.emptyMessage}</div>`
          : nothing}
        ${this._renderGroups(filteredItems)}
      </div>

      <div class="sp-command-palette-footer">
        <span><kbd>↑</kbd><kbd>↓</kbd> navigate</span>
        <span><kbd>↵</kbd> select</span>
        <span><kbd>Esc</kbd> close</span>
      </div>
    </div>
  `;
}

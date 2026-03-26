import { html, nothing, type TemplateResult } from "lit";
import { classMap } from "lit/directives/class-map.js";
import type { SpTableComponent } from "./sp-table.js";
import { SpConfig } from "../../config.js";

export function tableTemplate(this: SpTableComponent): TemplateResult {
  const visible = this._visibleColumns;
  const paged = this._pagedData;
  const allSelected = paged.length > 0 && this.selectedRows.size === paged.length;
  const someSelected = this.selectedRows.size > 0 && this.selectedRows.size < paged.length;
  const totalCols = visible.length + (this.selectable ? 1 : 0) + (this.actions.length ? 1 : 0);
  const filtered = this._filteredData;
  const hasFilters = this._hasActiveFilters;
  const vr = this.virtual ? this._virtualSlice : null;

  return html`
    <!-- ── Toolbar ── -->
    ${this.searchable || this.columns.length > 0
      ? html`
        <div class="sp-table-toolbar">
          ${this.searchable
            ? html`
              <div class="sp-table-search">
                <span class="sp-table-search-icon">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                  </svg>
                </span>
                <input
                  class="sp-table-search-input"
                  type="search"
                  placeholder=${SpConfig.locale.table.searchPlaceholder}
                  .value=${this._globalSearch}
                  @input=${(e: Event) => this._handleGlobalSearch((e.target as HTMLInputElement).value)}
                />
                ${this._globalSearch
                  ? html`<button class="sp-table-search-clear" @click=${this._clearFilters} title="Clear search">✕</button>`
                  : nothing}
              </div>
            `
            : nothing}

          <div class="sp-table-toolbar-end">
            ${hasFilters
              ? html`
                <button class="sp-table-chip-clear" @click=${this._clearFilters}>
                  ${SpConfig.locale.table.clearFilters}
                </button>
              `
              : nothing}

            <!-- Column visibility picker -->
            <div class="sp-table-col-picker-wrap">
              <button
                class="sp-table-icon-btn"
                title="Show/hide columns"
                @click=${() => { this._showColPicker = !this._showColPicker; }}
                aria-expanded=${this._showColPicker}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                  <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
                </svg>
                ${SpConfig.locale.table.columnsLabel}
              </button>
              ${this._showColPicker
                ? html`
                  <div class="sp-table-col-picker" @click=${(e: Event) => e.stopPropagation()}>
                    <div class="sp-table-col-picker-title">Toggle columns</div>
                    ${this._orderedColumns.map((col) => html`
                      <label class="sp-table-col-picker-item">
                        <input
                          type="checkbox"
                          .checked=${!this._hiddenCols.has(col.key)}
                          @change=${() => this._toggleColumn(col.key)}
                        />
                        ${col.label}
                      </label>
                    `)}
                  </div>
                `
                : nothing}
            </div>

            ${filtered.length !== this.data.length
              ? html`<span class="sp-table-count">${filtered.length} / ${this.data.length} rows</span>`
              : html`<span class="sp-table-count">${this.data.length} rows</span>`}

            ${this.pageSize && this.pageSizeOptions.length > 1
              ? html`
                <div class="sp-table-page-size">
                  <label class="sp-table-page-size-label">${SpConfig.locale.table.rowsLabel}</label>
                  <select
                    class="sp-table-page-size-select"
                    .value=${String(this.pageSize)}
                    @change=${(e: Event) => this._handlePageSizeChange(Number((e.target as HTMLSelectElement).value))}
                    aria-label="Rows per page"
                  >
                    ${this.pageSizeOptions.map(opt => html`
                      <option value=${opt} ?selected=${this.pageSize === opt}>${opt}</option>
                    `)}
                  </select>
                </div>
              `
              : nothing}
          </div>
        </div>
      `
      : nothing}

    <!-- ── Table ── -->
    <div
      class="sp-table-wrapper"
      style=${this.virtual ? `max-height: ${this.maxHeight}; overflow-y: auto;` : nothing}
      @scroll=${this.virtual ? this._onVirtualScroll : nothing}
      @click=${() => { this._showColPicker = false; this._openFilterCol = null; }}
    >
      <table class="sp-table">
        ${this.caption ? html`<caption class="sp-table-caption">${this.caption}</caption>` : nothing}

        <thead>
          <!-- Column header row -->
          <tr>
            ${this.selectable
              ? html`<th class="sp-table-th sp-table-th--checkbox" scope="col">
                  <input
                    type="checkbox"
                    .checked=${allSelected}
                    .indeterminate=${someSelected}
                    @change=${(e: Event) => this._handleSelectAll((e.target as HTMLInputElement).checked)}
                    aria-label="Select all rows"
                  />
                </th>`
              : nothing}

            ${visible.map((col, idx) => html`
              <th
                class=${classMap({
                  "sp-table-th": true,
                  "sp-table-th--sortable": !!col.sortable,
                  "sp-table-th--sorted": this.sortKey === col.key,
                  "sp-table-th--sticky": this.stickyHeader,
                  "sp-table-th--dragging": this._dragFromIndex === idx,
                  "sp-table-th--dragover": this._dragOverIndex === idx,
                  "sp-table-th--reorderable": this.reorderable,
                })}
                scope="col"
                style=${col.width ? `width: ${col.width}` : nothing}
                draggable=${this.reorderable ? "true" : "false"}
                aria-sort=${col.sortable
                  ? this.sortKey === col.key
                    ? this.sortDirection === "asc" ? "ascending" : this.sortDirection === "desc" ? "descending" : "none"
                    : "none"
                  : nothing}
                @click=${() => this._handleSort(col)}
                @dragstart=${(e: DragEvent) => this._handleDragStart(e, idx)}
                @dragover=${(e: DragEvent) => this._handleDragOver(e, idx)}
                @dragleave=${this._handleDragLeave}
                @drop=${(e: DragEvent) => this._handleDrop(e, idx)}
                @dragend=${this._handleDragEnd}
              >
                <span
                  class="sp-table-th-content"
                  style=${col.align
                    ? `justify-content: ${col.align === "right" ? "flex-end" : col.align === "center" ? "center" : "flex-start"}`
                    : nothing}
                >
                  ${this.reorderable
                    ? html`<span class="sp-table-drag-handle" title="Drag to reorder">⋮⋮</span>`
                    : nothing}
                  ${col.label}
                  ${col.sortable
                    ? html`<span class="sp-table-sort-icon">
                        ${this.sortKey === col.key
                          ? this.sortDirection === "asc" ? "↑" : this.sortDirection === "desc" ? "↓" : "↕"
                          : "↕"}
                      </span>`
                    : nothing}
                  ${col.filterable
                    ? html`
                      <button
                        class="sp-table-filter-icon-btn ${this._filters[col.key] ? "sp-table-filter-icon-btn--active" : ""}"
                        title="Filter by ${col.label}"
                        aria-label="Filter by ${col.label}"
                        @click=${(e: Event) => { e.stopPropagation(); this._toggleFilterCol(col.key); }}
                      >
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                          <path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z"/>
                        </svg>
                      </button>
                    `
                    : nothing}
                </span>

                ${col.filterable && this._openFilterCol === col.key
                  ? html`
                    <div class="sp-table-col-filter-pop" @click=${(e: Event) => e.stopPropagation()}>
                      <div class="sp-table-col-filter-pop-label">${SpConfig.locale.table.filterLabel.replace("{col}", col.label)}</div>
                      <div class="sp-table-col-filter-pop-row">
                        <input
                          class="sp-table-col-filter-pop-input"
                          type="search"
                          placeholder="Type to filter…"
                          .value=${this._filters[col.key] ?? ""}
                          @input=${(e: Event) => this._handleFilter(col.key, (e.target as HTMLInputElement).value)}
                          aria-label="Filter by ${col.label}"
                        />
                        ${this._filters[col.key]
                          ? html`
                            <button
                              class="sp-table-col-filter-pop-clear"
                              title="Clear filter"
                              @click=${() => { this._handleFilter(col.key, ""); this._openFilterCol = null; }}
                            >✕</button>
                          `
                          : nothing}
                      </div>
                    </div>
                  `
                  : nothing}
              </th>
            `)}

            ${this.actions.length
              ? html`<th class="sp-table-th sp-table-th--actions" scope="col">${SpConfig.locale.table.actionsLabel}</th>`
              : nothing}
          </tr>
        </thead>

        <tbody>
          ${this.loading
            ? html`
              <tr>
                <td colspan=${totalCols} class="sp-table-empty">
                  <div class="sp-table-loading">
                    <svg class="sp-table-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                      <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                    </svg>
                    ${SpConfig.locale.table.loading}
                  </div>
                </td>
              </tr>
            `
            : paged.length === 0
              ? html`
                <tr>
                  <td colspan=${totalCols} class="sp-table-empty">
                    <div class="sp-table-empty-inner">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="color:var(--sp-border-strong,#9ca3af)">
                        <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                      </svg>
                      <span>${hasFilters ? "No results match the current filters." : this.emptyText}</span>
                      ${hasFilters ? html`<button class="sp-table-chip-clear" @click=${this._clearFilters}>${SpConfig.locale.table.clearFilters}</button>` : nothing}
                    </div>
                  </td>
                </tr>
              `
              : this.virtual && vr
                ? html`
                  <tr style="height: ${vr.topPad}px; border: none;"><td colspan="${totalCols}" style="padding:0;border:0;"></td></tr>
                  ${vr.rows.map((row, i) => {
                    const pageRowIdx = vr.startIndex + i;
                    const globalIdx = pageRowIdx;
                    return html`
                      <tr class=${classMap({
                        "sp-table-row": true,
                        "sp-table-row--striped": this.striped && pageRowIdx % 2 === 1,
                        "sp-table-row--selected": this.selectedRows.has(pageRowIdx),
                      })}>
                        ${this.selectable
                          ? html`
                            <td class="sp-table-td sp-table-td--checkbox">
                              <input
                                type="checkbox"
                                .checked=${this.selectedRows.has(pageRowIdx)}
                                @change=${(e: Event) => this._handleRowSelect(pageRowIdx, (e.target as HTMLInputElement).checked)}
                                aria-label="Select row ${pageRowIdx + 1}"
                              />
                            </td>
                          `
                          : nothing}

                        ${visible.map((col) => html`
                          <td
                            class="sp-table-td"
                            style=${col.align ? `text-align: ${col.align}` : nothing}
                          >
                            ${col.render
                              ? html`${col.render(row[col.key], row)}`
                              : row[col.key] ?? ""}
                          </td>
                        `)}

                        ${this.actions.length
                          ? html`
                            <td class="sp-table-td sp-table-td--actions">
                              <div class="sp-table-actions">
                                ${this.actions.map((action) => html`
                                  <button
                                    class="sp-table-action-btn sp-table-action-btn--${action.variant ?? "ghost"}"
                                    title=${action.label}
                                    @click=${(e: Event) => { e.stopPropagation(); this._handleAction(action, row, globalIdx); }}
                                  >
                                    ${action.icon ? html`<span>${action.icon}</span>` : nothing}
                                    ${action.label}
                                  </button>
                                `)}
                              </div>
                            </td>
                          `
                          : nothing}
                      </tr>
                    `;
                  })}
                  <tr style="height: ${vr.bottomPad}px; border: none;"><td colspan="${totalCols}" style="padding:0;border:0;"></td></tr>
                `
                : paged.map((row, pageRowIdx) => {
                    const globalIdx = this.pageSize
                      ? (this._page - 1) * this.pageSize + pageRowIdx
                      : pageRowIdx;
                    return html`
                      <tr class=${classMap({
                        "sp-table-row": true,
                        "sp-table-row--striped": this.striped && pageRowIdx % 2 === 1,
                        "sp-table-row--selected": this.selectedRows.has(pageRowIdx),
                      })}>
                        ${this.selectable
                          ? html`
                            <td class="sp-table-td sp-table-td--checkbox">
                              <input
                                type="checkbox"
                                .checked=${this.selectedRows.has(pageRowIdx)}
                                @change=${(e: Event) => this._handleRowSelect(pageRowIdx, (e.target as HTMLInputElement).checked)}
                                aria-label="Select row ${pageRowIdx + 1}"
                              />
                            </td>
                          `
                          : nothing}

                        ${visible.map((col) => html`
                          <td
                            class="sp-table-td"
                            style=${col.align ? `text-align: ${col.align}` : nothing}
                          >
                            ${col.render
                              ? html`${col.render(row[col.key], row)}`
                              : row[col.key] ?? ""}
                          </td>
                        `)}

                        ${this.actions.length
                          ? html`
                            <td class="sp-table-td sp-table-td--actions">
                              <div class="sp-table-actions">
                                ${this.actions.map((action) => html`
                                  <button
                                    class="sp-table-action-btn sp-table-action-btn--${action.variant ?? "ghost"}"
                                    title=${action.label}
                                    @click=${(e: Event) => { e.stopPropagation(); this._handleAction(action, row, globalIdx); }}
                                  >
                                    ${action.icon ? html`<span>${action.icon}</span>` : nothing}
                                    ${action.label}
                                  </button>
                                `)}
                              </div>
                            </td>
                          `
                          : nothing}
                      </tr>
                    `;
                  })}
        </tbody>
      </table>
    </div>

    <!-- ── Pagination footer ── -->
    ${this.pageSize && this._totalPages > 1 && !this.virtual
      ? html`
        <div class="sp-table-pagination">
          <span class="sp-table-page-info">
            ${(this._page - 1) * this.pageSize + 1}–${Math.min(this._page * this.pageSize, filtered.length)}
            ${SpConfig.locale.table.ofTotal.replace("{total}", String(filtered.length))}
          </span>
          <div class="sp-table-page-btns">
            <button
              class="sp-table-page-btn"
              ?disabled=${this._page === 1}
              @click=${() => this._goToPage(1)}
              title="First page"
            >«</button>
            <button
              class="sp-table-page-btn"
              ?disabled=${this._page === 1}
              @click=${() => this._goToPage(this._page - 1)}
              title="Previous page"
            >‹</button>

            ${Array.from({ length: this._totalPages }, (_, i) => i + 1)
              .filter((p) => Math.abs(p - this._page) <= 2 || p === 1 || p === this._totalPages)
              .reduce<Array<number | "...">>(
                (acc, p, i, arr) => {
                  if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push("...");
                  acc.push(p);
                  return acc;
                },
                [],
              )
              .map((p) =>
                p === "..."
                  ? html`<span class="sp-table-page-ellipsis">…</span>`
                  : html`
                    <button
                      class="sp-table-page-btn ${p === this._page ? "sp-table-page-btn--active" : ""}"
                      @click=${() => this._goToPage(p as number)}
                    >${p}</button>
                  `,
              )}

            <button
              class="sp-table-page-btn"
              ?disabled=${this._page === this._totalPages}
              @click=${() => this._goToPage(this._page + 1)}
              title="Next page"
            >›</button>
            <button
              class="sp-table-page-btn"
              ?disabled=${this._page === this._totalPages}
              @click=${() => this._goToPage(this._totalPages)}
              title="Last page"
            >»</button>
          </div>
        </div>
      `
      : nothing}
  `;
}

import { html, nothing, type TemplateResult } from "lit";
import { classMap } from "lit/directives/class-map.js";
import type { SpTableComponent } from "./sp-table.js";

export function tableTemplate(this: SpTableComponent): TemplateResult {
  const allSelected =
    this.data.length > 0 && this.selectedRows.size === this.data.length;
  const someSelected =
    this.selectedRows.size > 0 && this.selectedRows.size < this.data.length;
  const totalCols = this.columns.length + (this.selectable ? 1 : 0);

  return html`
    <div class="sp-table-wrapper">
      <table class="sp-table">
        ${this.caption ? html`<caption class="sp-table-caption">${this.caption}</caption>` : nothing}
        <thead>
          <tr>
            ${this.selectable
              ? html`
                  <th class="sp-table-th sp-table-th--checkbox" scope="col">
                    <input
                      type="checkbox"
                      .checked=${allSelected}
                      .indeterminate=${someSelected}
                      @change=${(e: Event) =>
                        this._handleSelectAll(
                          (e.target as HTMLInputElement).checked,
                        )}
                      aria-label="Select all rows"
                    />
                  </th>
                `
              : nothing}
            ${this.columns.map(
              (col) => html`
                <th
                  class=${classMap({
                    "sp-table-th": true,
                    "sp-table-th--sortable": !!col.sortable,
                    "sp-table-th--sorted": this.sortKey === col.key,
                    "sp-table-th--sticky": this.stickyHeader,
                  })}
                  scope="col"
                  style=${col.width ? `width: ${col.width}` : nothing}
                  aria-sort=${col.sortable
                    ? this.sortKey === col.key
                      ? this.sortDirection === "asc"
                        ? "ascending"
                        : this.sortDirection === "desc"
                          ? "descending"
                          : "none"
                      : "none"
                    : nothing}
                  @click=${() => this._handleSort(col)}
                >
                  <span
                    class="sp-table-th-content"
                    style=${col.align
                      ? `justify-content: ${col.align === "right" ? "flex-end" : col.align === "center" ? "center" : "flex-start"}`
                      : nothing}
                  >
                    ${col.label}
                    ${col.sortable
                      ? html`<span class="sp-table-sort-icon">${this.sortKey === col.key ? (this.sortDirection === "asc" ? "↑" : this.sortDirection === "desc" ? "↓" : "↕") : "↕"}</span>`
                      : nothing}
                  </span>
                </th>
              `,
            )}
          </tr>
        </thead>
        <tbody>
          ${this.loading
            ? html`
                <tr>
                  <td colspan=${totalCols} class="sp-table-empty">
                    <div class="sp-table-loading">Loading...</div>
                  </td>
                </tr>
              `
            : this.data.length === 0
              ? html`
                  <tr>
                    <td colspan=${totalCols} class="sp-table-empty">${this.emptyText}</td>
                  </tr>
                `
              : this.data.map(
                  (row, rowIndex) => html`
                    <tr
                      class=${classMap({
                        "sp-table-row": true,
                        "sp-table-row--striped": this.striped && rowIndex % 2 === 1,
                        "sp-table-row--selected": this.selectedRows.has(rowIndex),
                      })}
                    >
                      ${this.selectable
                        ? html`
                            <td class="sp-table-td sp-table-td--checkbox">
                              <input
                                type="checkbox"
                                .checked=${this.selectedRows.has(rowIndex)}
                                @change=${(e: Event) =>
                                  this._handleRowSelect(
                                    rowIndex,
                                    (e.target as HTMLInputElement).checked,
                                  )}
                                aria-label="Select row ${rowIndex + 1}"
                              />
                            </td>
                          `
                        : nothing}
                      ${this.columns.map(
                        (col) => html`
                          <td
                            class="sp-table-td"
                            style=${col.align ? `text-align: ${col.align}` : nothing}
                          >
                            ${row[col.key] ?? ""}
                          </td>
                        `,
                      )}
                    </tr>
                  `,
                )}
        </tbody>
      </table>
    </div>
  `;
}

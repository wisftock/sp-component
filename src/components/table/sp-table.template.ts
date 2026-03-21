import { html, nothing, type TemplateResult } from "lit";
import { classMap } from "lit/directives/class-map.js";
import type { SpTableComponent } from "./sp-table.js";

export function tableTemplate(this: SpTableComponent): TemplateResult {
  return html`
    <div class="sp-table-wrapper">
      <table class="sp-table">
        <thead>
          <tr>
            ${this.columns.map(
              (col) => html`
                <th
                  class=${classMap({
                    "sp-table-th": true,
                    "sp-table-th--sortable": !!col.sortable,
                    "sp-table-th--sorted": this.sortKey === col.key,
                  })}
                  style=${col.width ? `width: ${col.width}` : nothing}
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
                  <td colspan=${this.columns.length} class="sp-table-empty">
                    <div class="sp-table-loading">Loading...</div>
                  </td>
                </tr>
              `
            : this.data.length === 0
              ? html`
                  <tr>
                    <td colspan=${this.columns.length} class="sp-table-empty">${this.emptyText}</td>
                  </tr>
                `
              : this.data.map(
                  (row, rowIndex) => html`
                    <tr
                      class=${classMap({
                        "sp-table-row": true,
                        "sp-table-row--striped": this.striped && rowIndex % 2 === 1,
                      })}
                    >
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

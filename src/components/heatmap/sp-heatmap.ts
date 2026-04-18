import { LitElement, html, unsafeCSS, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { styleMap } from "lit/directives/style-map.js";
import styles from "./sp-heatmap.css?inline";

export interface SpHeatmapData {
  date: string;   // "YYYY-MM-DD"
  value: number;
}

const DAYS_LABEL = ["", "Lun", "", "Mié", "", "Vie", ""];
const MONTH_NAMES = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];

/**
 * Heatmap — mapa de calor tipo contribuciones de GitHub.
 *
 * @element sp-heatmap
 *
 * @prop {SpHeatmapData[]} data   - Array de {date, value}
 * @prop {number}          weeks  - Semanas a mostrar (default 52)
 * @prop {string}          color  - Tema de color: green | blue | purple | orange
 * @prop {boolean}         legend - Muestra leyenda (default true)
 * @prop {string}          size   - Tamaño de celda: sm | md | lg
 *
 * @fires {CustomEvent<{date:string,value:number}>} sp-click - Al click en una celda
 */
@customElement("sp-heatmap")
export class SpHeatmapComponent extends LitElement {
  static override styles = unsafeCSS(styles);

  @property({ type: Array }) data: SpHeatmapData[] = [];
  @property({ type: Number }) weeks = 52;
  @property({ type: String }) color: "green" | "blue" | "purple" | "orange" = "green";
  @property({ type: Boolean }) legend = true;
  @property({ type: String }) size: "sm" | "md" | "lg" = "md";

  @state() private _tooltip = { visible: false, text: "", x: 0, y: 0 };

  #colorMap: Record<string, Record<string, string>> = {
    green:  { l1: "#9be9a8", l2: "#40c463", l3: "#30a14e", l4: "#216e39" },
    blue:   { l1: "#bfdbfe", l2: "#60a5fa", l3: "#3b82f6", l4: "#1d4ed8" },
    purple: { l1: "#ddd6fe", l2: "#a78bfa", l3: "#7c3aed", l4: "#5b21b6" },
    orange: { l1: "#fed7aa", l2: "#fb923c", l3: "#ea580c", l4: "#9a3412" },
  };

  #sizeMap: Record<string, string> = { sm: "10px", md: "12px", lg: "16px" };

  #buildGrid(): ({ date: string; value: number; level: 0|1|2|3|4; }|null)[][] {
    const map = new Map(this.data.map(d => [d.date, d.value]));
    const maxVal = Math.max(1, ...this.data.map(d => d.value));

    // Start from (weeks) weeks ago, aligned to Sunday
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - (this.weeks * 7 - 1));
    // Align to Sunday
    startDate.setDate(startDate.getDate() - startDate.getDay());

    const grid: ({ date: string; value: number; level: 0|1|2|3|4; }|null)[][] = [];

    for (let w = 0; w < this.weeks; w++) {
      const week: typeof grid[0] = [];
      for (let d = 0; d < 7; d++) {
        const cur = new Date(startDate);
        cur.setDate(startDate.getDate() + w * 7 + d);
        if (cur > today) { week.push(null); continue; }
        const iso = `${cur.getFullYear()}-${String(cur.getMonth()+1).padStart(2,"0")}-${String(cur.getDate()).padStart(2,"0")}`;
        const val = map.get(iso) ?? 0;
        const level = val === 0 ? 0 : val <= maxVal * 0.25 ? 1 : val <= maxVal * 0.5 ? 2 : val <= maxVal * 0.75 ? 3 : 4;
        week.push({ date: iso, value: val, level: level as 0|1|2|3|4 });
      }
      grid.push(week);
    }
    return grid;
  }

  #getMonthLabels(grid: ({ date: string; value: number; level: 0|1|2|3|4; }|null)[][]): string[] {
    const labels: string[] = [];
    let lastMonth = -1;
    for (const week of grid) {
      const firstDay = week.find(d => d !== null);
      if (!firstDay) { labels.push(""); continue; }
      const month = parseInt(firstDay.date.split("-")[1]!) - 1;
      if (month !== lastMonth) { labels.push(MONTH_NAMES[month] ?? ""); lastMonth = month; }
      else labels.push("");
    }
    return labels;
  }

  #showTooltip(e: MouseEvent, cell: { date: string; value: number }) {
    this._tooltip = { visible: true, text: `${cell.date}: ${cell.value} contribuciones`, x: e.clientX, y: e.clientY };
  }
  #hideTooltip() { this._tooltip = { ...this._tooltip, visible: false }; }

  override render() {
    const grid = this.#buildGrid();
    const monthLabels = this.#getMonthLabels(grid);
    const colors = this.#colorMap[this.color]!;
    const cellSize = this.#sizeMap[this.size] ?? "12px";

    return html`
      <div class="sp-hm" style=${styleMap({
        "--sp-hm-l1": colors.l1, "--sp-hm-l2": colors.l2,
        "--sp-hm-l3": colors.l3, "--sp-hm-l4": colors.l4,
        "--sp-hm-size": cellSize,
      })}>
        <!-- Month labels -->
        <div class="sp-hm-months">
          ${monthLabels.map(label => html`
            <div style="width:${cellSize}">${label}</div>
          `)}
        </div>

        <div class="sp-hm-body">
          <!-- Day labels -->
          <div class="sp-hm-days">
            ${DAYS_LABEL.map(d => html`<span>${d}</span>`)}
          </div>

          <!-- Grid -->
          <div class="sp-hm-grid">
            ${grid.map(week => html`
              <div class="sp-hm-week">
                ${week.map(cell => cell === null
                  ? html`<div class="sp-hm-cell sp-hm-cell--empty"></div>`
                  : html`
                    <div
                      class=${classMap({ "sp-hm-cell": true })}
                      data-level=${cell.level}
                      aria-label="${cell.date}: ${cell.value}"
                      @mouseenter=${(e: MouseEvent) => this.#showTooltip(e, cell)}
                      @mouseleave=${() => this.#hideTooltip()}
                      @click=${() => this.dispatchEvent(new CustomEvent("sp-click", { detail: { date: cell.date, value: cell.value }, bubbles: true, composed: true }))}
                    ></div>
                  `
                )}
              </div>
            `)}
          </div>
        </div>

        ${this.legend ? html`
          <div class="sp-hm-legend">
            <span>Menos</span>
            ${[0,1,2,3,4].map(l => html`
              <div class="sp-hm-legend-cell" style="background:${l === 0 ? "var(--sp-hm-empty,#ebedf0)" : `var(--sp-hm-l${l})`}"></div>
            `)}
            <span>Más</span>
          </div>
        ` : nothing}

        ${this._tooltip.visible ? html`
          <div class="sp-hm-tooltip" style="left:${this._tooltip.x}px;top:${this._tooltip.y}px">
            ${this._tooltip.text}
          </div>
        ` : nothing}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap { "sp-heatmap": SpHeatmapComponent; }
}

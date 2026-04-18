import { LitElement, html, unsafeCSS, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import styles from "./sp-gantt.css?inline";

type ZoomLevel = "day" | "week" | "month";

export interface GanttTask {
  id: string;
  name: string;
  start: string; // ISO date
  end: string;   // ISO date
  color?: string;
  progress?: number; // 0-100
}

const COLORS = ["#6366f1","#22c55e","#f59e0b","#ef4444","#14b8a6","#8b5cf6","#ec4899","#0ea5e9"];

function dateOnly(iso: string): Date {
  const d = new Date(iso);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function addDays(d: Date, n: number): Date {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}

function diffDays(a: Date, b: Date): number {
  return Math.round((b.getTime() - a.getTime()) / 86400000);
}

/**
 * Gantt — diagrama de Gantt con zoom por día/semana/mes.
 *
 * @element sp-gantt
 *
 * @prop {GanttTask[]} tasks   - Array de tareas
 * @prop {string}      zoom    - "day" | "week" | "month" (default: "week")
 * @prop {string}      title   - Título del encabezado
 */
@customElement("sp-gantt")
export class SpGanttComponent extends LitElement {
  static override styles = unsafeCSS(styles);

  @property({ type: Array }) tasks: GanttTask[] = [];
  @property({ type: String }) zoom: ZoomLevel = "week";
  @property({ type: String }) title = "";

  @state() private _zoom: ZoomLevel = "week";

  override connectedCallback() {
    super.connectedCallback();
    this._zoom = this.zoom;
  }

  #cellWidth(): number {
    return this._zoom === "day" ? 40 : this._zoom === "week" ? 100 : 120;
  }

  #getRange(): { start: Date; end: Date; cells: Date[] } {
    if (!this.tasks.length) {
      const start = new Date();
      start.setDate(1);
      const end = addDays(start, 30);
      return { start, end, cells: [] };
    }
    const starts = this.tasks.map(t => dateOnly(t.start).getTime());
    const ends = this.tasks.map(t => dateOnly(t.end).getTime());
    let start = new Date(Math.min(...starts));
    let end = new Date(Math.max(...ends));

    // Padding
    start = addDays(start, -3);
    end = addDays(end, 3);

    // Align to week/month boundaries
    if (this._zoom === "week") {
      // align start to Monday
      const day = start.getDay();
      start = addDays(start, day === 0 ? -6 : -(day - 1));
    } else if (this._zoom === "month") {
      start = new Date(start.getFullYear(), start.getMonth(), 1);
      end = new Date(end.getFullYear(), end.getMonth() + 1, 1);
    }

    const cells: Date[] = [];
    let cur = new Date(start);
    while (cur <= end) {
      cells.push(new Date(cur));
      if (this._zoom === "day") cur = addDays(cur, 1);
      else if (this._zoom === "week") cur = addDays(cur, 7);
      else cur = new Date(cur.getFullYear(), cur.getMonth() + 1, 1);
    }

    return { start, end, cells };
  }

  #formatCell(d: Date): string {
    if (this._zoom === "day") {
      return d.toLocaleDateString("es", { day: "numeric", month: "short" });
    } else if (this._zoom === "week") {
      const end = addDays(d, 6);
      return `${d.getDate()} ${d.toLocaleDateString("es", { month: "short" })} – ${end.getDate()}`;
    } else {
      return d.toLocaleDateString("es", { month: "short", year: "numeric" });
    }
  }

  #cellDays(): number {
    return this._zoom === "day" ? 1 : this._zoom === "week" ? 7 : 30;
  }

  override render() {
    const { start, cells } = this.#getRange();
    const cellW = this.#cellWidth();
    const cellDays = this.#cellDays();
    const totalW = cells.length * cellW;
    const today = dateOnly(new Date().toISOString());
    const todayOffset = diffDays(start, today);
    const pxPerDay = cellW / cellDays;

    return html`
      <div class="sp-gantt">
        <div class="sp-gantt-toolbar">
          <span style="font-weight:600;color:var(--sp-text,#111827)">${this.title || "Gantt"}</span>
          <div class="sp-gantt-zoom">
            ${(["day","week","month"] as ZoomLevel[]).map(z => html`
              <button
                class=${this._zoom === z ? "active" : ""}
                @click=${() => { this._zoom = z; }}
              >${z === "day" ? "Día" : z === "week" ? "Semana" : "Mes"}</button>
            `)}
          </div>
        </div>

        <div class="sp-gantt-layout">
          <!-- Task list -->
          <div class="sp-gantt-tasks">
            <div class="sp-gantt-tasks-header">Tarea</div>
            ${this.tasks.map((t, i) => html`
              <div class="sp-gantt-task-row">
                <div class="sp-gantt-task-color"
                  style="background:${t.color ?? COLORS[i % COLORS.length]}"></div>
                <span class="sp-gantt-task-name" title=${t.name}>${t.name}</span>
              </div>
            `)}
          </div>

          <!-- Chart -->
          <div class="sp-gantt-chart">
            <div class="sp-gantt-chart-inner" style="width:${totalW}px">
              <!-- Timeline -->
              <div class="sp-gantt-timeline" style="width:${totalW}px">
                ${cells.map(c => html`
                  <div class="sp-gantt-timeline-cell" style="width:${cellW}px;min-width:${cellW}px">
                    ${this.#formatCell(c)}
                  </div>
                `)}
              </div>

              <!-- Today line -->
              ${todayOffset >= 0 ? html`
                <div class="sp-gantt-today"
                  style="left:${todayOffset * pxPerDay}px"></div>
              ` : nothing}

              <!-- Rows + bars -->
              ${this.tasks.map((t, i) => {
                const tStart = dateOnly(t.start);
                const tEnd = dateOnly(t.end);
                const left = diffDays(start, tStart) * pxPerDay;
                const width = Math.max(cellW * 0.5, (diffDays(tStart, tEnd) + 1) * pxPerDay);
                const color = t.color ?? COLORS[i % COLORS.length];
                return html`
                  <div class="sp-gantt-row" style="width:${totalW}px">
                    <!-- grid lines -->
                    ${cells.map((_, ci) => html`
                      <div class="sp-gantt-grid-line" style="left:${ci * cellW}px"></div>
                    `)}
                    <div class="sp-gantt-bar"
                      style="left:${left}px;width:${width}px;background:${color}"
                      title="${t.name}: ${t.start} → ${t.end}${t.progress != null ? ` (${t.progress}%)` : ""}"
                    >
                      ${t.name}
                      ${t.progress != null ? html`
                        <div style="
                          position:absolute;left:0;top:0;bottom:0;
                          width:${t.progress}%;
                          background:rgba(0,0,0,0.2);
                          border-radius:4px;
                        "></div>
                      ` : nothing}
                    </div>
                  </div>
                `;
              })}
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap { "sp-gantt": SpGanttComponent; }
}

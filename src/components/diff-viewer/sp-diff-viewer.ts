import { LitElement, html, unsafeCSS, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import styles from "./sp-diff-viewer.css?inline";

type DiffMode = "unified" | "split";

interface DiffLine {
  type: "add" | "del" | "ctx" | "hunk";
  oldNum?: number;
  newNum?: number;
  content: string;
}

function parseDiff(oldText: string, newText: string): DiffLine[] {
  const oldLines = oldText.split("\n");
  const newLines = newText.split("\n");

  // Simple LCS-based diff
  const m = oldLines.length;
  const n = newLines.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

  for (let i = m - 1; i >= 0; i--) {
    for (let j = n - 1; j >= 0; j--) {
      if (oldLines[i] === newLines[j]) dp[i]![j]! = dp[i + 1]![j + 1]! + 1;
      else dp[i]![j]! = Math.max(dp[i + 1]![j]!, dp[i]![j + 1]!);
    }
  }

  const result: DiffLine[] = [];
  let i = 0, j = 0;
  let oldNum = 1, newNum = 1;

  while (i < m || j < n) {
    if (i < m && j < n && oldLines[i] === newLines[j]) {
      result.push({ type: "ctx", oldNum: oldNum++, newNum: newNum++, content: oldLines[i]! });
      i++; j++;
    } else if (j < n && (i >= m || dp[i + 1]![j]! <= dp[i]![j + 1]!)) {
      result.push({ type: "add", newNum: newNum++, content: newLines[j]! });
      j++;
    } else {
      result.push({ type: "del", oldNum: oldNum++, content: oldLines[i]! });
      i++;
    }
  }

  return result;
}

function esc(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/**
 * Diff Viewer — visualizador de diferencias estilo GitHub.
 *
 * @element sp-diff-viewer
 *
 * @prop {string}  old-text   - Texto original
 * @prop {string}  new-text   - Texto nuevo
 * @prop {string}  filename   - Nombre del archivo
 * @prop {string}  mode       - "unified" | "split" (default: "unified")
 * @prop {number}  context    - Líneas de contexto alrededor de cambios (default: 3)
 */
@customElement("sp-diff-viewer")
export class SpDiffViewerComponent extends LitElement {
  static override styles = unsafeCSS(styles);

  @property({ type: String, attribute: "old-text" }) oldText = "";
  @property({ type: String, attribute: "new-text" }) newText = "";
  @property({ type: String }) filename = "";
  @property({ type: String }) mode: DiffMode = "unified";
  @property({ type: Number }) context = 3;

  @state() private _mode: DiffMode = "unified";

  override connectedCallback() {
    super.connectedCallback();
    this._mode = this.mode;
  }

  #getLines(): DiffLine[] {
    return parseDiff(this.oldText, this.newText);
  }

  #filterContext(lines: DiffLine[]): DiffLine[] {
    const changed = new Set<number>();
    lines.forEach((l, i) => { if (l.type !== "ctx") changed.add(i); });

    const visible = new Set<number>();
    changed.forEach(i => {
      for (let k = Math.max(0, i - this.context); k <= Math.min(lines.length - 1, i + this.context); k++) {
        visible.add(k);
      }
    });

    const result: DiffLine[] = [];
    let lastVisible = -1;
    [...visible].sort((a, b) => a - b).forEach(i => {
      if (lastVisible !== -1 && i > lastVisible + 1) {
        result.push({ type: "hunk", content: `@@ -${lines[i]!.oldNum ?? "?"} +${lines[i]!.newNum ?? "?"} @@` });
      }
      result.push(lines[i]!);
      lastVisible = i;
    });

    return result;
  }

  #renderUnified(lines: DiffLine[]) {
    return html`
      <div class="sp-diff-body">
        <table class="sp-diff-table">
          <tbody>
            ${lines.map(l => {
              if (l.type === "hunk") return html`
                <tr class="sp-diff-hunk">
                  <td colspan="4">${l.content}</td>
                </tr>
              `;
              return html`
                <tr class="sp-diff-${l.type}">
                  <td class="sp-diff-ln">${l.type !== "add" ? l.oldNum ?? "" : ""}</td>
                  <td class="sp-diff-ln">${l.type !== "del" ? l.newNum ?? "" : ""}</td>
                  <td class="sp-diff-sign">${l.type === "add" ? "+" : l.type === "del" ? "-" : " "}</td>
                  <td class="sp-diff-code">${unsafeHTML(esc(l.content))}</td>
                </tr>
              `;
            })}
          </tbody>
        </table>
      </div>
    `;
  }

  #renderSplit(lines: DiffLine[]) {
    const leftLines: DiffLine[] = [];
    const rightLines: DiffLine[] = [];

    for (const l of lines) {
      if (l.type === "add") {
        leftLines.push({ type: "ctx", content: "" });
        rightLines.push(l);
      } else if (l.type === "del") {
        leftLines.push(l);
        rightLines.push({ type: "ctx", content: "" });
      } else {
        leftLines.push(l);
        rightLines.push(l);
      }
    }

    const renderSide = (sideLines: DiffLine[], side: "old" | "new") => html`
      <div class="sp-diff-split-side">
        <table class="sp-diff-table">
          <tbody>
            ${sideLines.map(l => html`
              <tr class="sp-diff-${l.type}">
                <td class="sp-diff-ln">${side === "old" ? l.oldNum ?? "" : l.newNum ?? ""}</td>
                <td class="sp-diff-sign">${l.type === "add" ? "+" : l.type === "del" ? "-" : " "}</td>
                <td class="sp-diff-code">${unsafeHTML(esc(l.content))}</td>
              </tr>
            `)}
          </tbody>
        </table>
      </div>
    `;

    return html`
      <div class="sp-diff-body">
        <div class="sp-diff-split">
          ${renderSide(leftLines, "old")}
          ${renderSide(rightLines, "new")}
        </div>
      </div>
    `;
  }

  override render() {
    const lines = this.#getLines();
    const filtered = this.#filterContext(lines);
    const adds = lines.filter(l => l.type === "add").length;
    const dels = lines.filter(l => l.type === "del").length;

    return html`
      <div class="sp-diff">
        <div class="sp-diff-header">
          <span class="sp-diff-filename">${this.filename || "diff"}</span>
          <span class="sp-diff-stats">
            <span class="sp-diff-add-count">+${adds}</span>
            <span class="sp-diff-del-count">-${dels}</span>
          </span>
          <div class="sp-diff-toggle">
            <button
              class=${this._mode === "unified" ? "active" : ""}
              @click=${() => { this._mode = "unified"; }}
            >Unified</button>
            <button
              class=${this._mode === "split" ? "active" : ""}
              @click=${() => { this._mode = "split"; }}
            >Split</button>
          </div>
        </div>
        ${this._mode === "split" ? this.#renderSplit(filtered) : this.#renderUnified(filtered)}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap { "sp-diff-viewer": SpDiffViewerComponent; }
}

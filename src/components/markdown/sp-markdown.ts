import { LitElement, html, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import styles from "./sp-markdown.css?inline";

// Minimal but solid Markdown parser (no dependencies)
function parseMarkdown(md: string): string {
  const esc = (s: string) => s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");

  // Process line by line
  const lines = md.split("\n");
  const out: string[] = [];
  let inCode = false, codeLang = "", codeLines: string[] = [];
  let inList = false, listType = "";
  let inBlockquote = false, bqLines: string[] = [];
  let tableLines: string[] = [];
  let inTable = false;

  const flushList = () => {
    if (!inList) return;
    out.push(`<${listType}>${codeLines.join("")}</${listType}>`);
    inList = false; codeLines = [];
  };

  const flushBq = () => {
    if (!inBlockquote) return;
    out.push(`<blockquote>${parseInline(bqLines.join(" "))}</blockquote>`);
    inBlockquote = false; bqLines = [];
  };

  const flushTable = () => {
    if (!inTable) return;
    if (tableLines.length < 2) { out.push(...tableLines.map(l => `<p>${parseInline(l)}</p>`)); tableLines = []; inTable = false; return; }
    const [header, , ...body] = tableLines;
    const heads = header!.split("|").map(c => c.trim()).filter(Boolean);
    const rows  = body.map(r => r.split("|").map(c => c.trim()).filter(Boolean));
    const thead = `<tr>${heads.map(h => `<th>${parseInline(h)}</th>`).join("")}</tr>`;
    const tbody = rows.map(r => `<tr>${r.map(c => `<td>${parseInline(c)}</td>`).join("")}</tr>`).join("");
    out.push(`<table><thead>${thead}</thead><tbody>${tbody}</tbody></table>`);
    tableLines = []; inTable = false;
  };

  for (const rawLine of lines) {
    const line = rawLine;

    // Fenced code block
    if (/^```/.test(line)) {
      if (inCode) {
        out.push(`<pre><code${codeLang ? ` class="language-${codeLang}"` : ""}>${esc(codeLines.join("\n"))}</code></pre>`);
        inCode = false; codeLang = ""; codeLines = [];
      } else {
        flushList(); flushBq(); flushTable();
        inCode = true;
        codeLang = line.slice(3).trim();
      }
      continue;
    }
    if (inCode) { codeLines.push(rawLine); continue; }

    // Blockquote
    if (/^>/.test(line)) {
      flushList(); flushTable();
      inBlockquote = true;
      bqLines.push(line.replace(/^>\s?/, ""));
      continue;
    } else if (inBlockquote) {
      flushBq();
    }

    // HR
    if (/^---+$|^\*\*\*+$/.test(line.trim())) { flushList(); flushTable(); out.push("<hr>"); continue; }

    // Heading
    const hm = line.match(/^(#{1,6})\s+(.*)/);
    if (hm) {
      flushList(); flushTable();
      const level = hm[1]!.length;
      out.push(`<h${level}>${parseInline(hm[2]!)}</h${level}>`);
      continue;
    }

    // Table detection
    if (line.includes("|")) {
      flushList();
      inTable = true;
      tableLines.push(line);
      continue;
    } else if (inTable) {
      flushTable();
    }

    // Unordered list
    const ulm = line.match(/^(\s*)[*\-+]\s+(.*)/);
    if (ulm) {
      if (!inList || listType !== "ul") { flushList(); inList = true; listType = "ul"; }
      codeLines.push(`<li>${parseInline(ulm[2]!)}</li>`);
      continue;
    }

    // Ordered list
    const olm = line.match(/^\d+\.\s+(.*)/);
    if (olm) {
      if (!inList || listType !== "ol") { flushList(); inList = true; listType = "ol"; }
      codeLines.push(`<li>${parseInline(olm[1]!)}</li>`);
      continue;
    }
    flushList();

    // Empty line
    if (!line.trim()) { out.push(""); continue; }

    // Paragraph
    out.push(`<p>${parseInline(line)}</p>`);
  }

  flushList(); flushBq(); flushTable();
  if (inCode) out.push(`<pre><code>${esc(codeLines.join("\n"))}</code></pre>`);

  // Merge consecutive <p> into paragraphs (simple pass)
  return out.filter(l => l !== undefined).join("\n");
}

function parseInline(text: string): string {
  const esc = (s: string) => s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
  return esc(text)
    // Bold+italic
    .replace(/\*\*\*(.*?)\*\*\*/g, "<strong><em>$1</em></strong>")
    // Bold
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/__(.*?)__/g, "<strong>$1</strong>")
    // Italic
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/_(.*?)_/g, "<em>$1</em>")
    // Strikethrough
    .replace(/~~(.*?)~~/g, "<del>$1</del>")
    // Code
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    // Link
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
    // Image
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1">')
    // Auto-link
    .replace(/(?<!["\(])(https?:\/\/[^\s<]+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>');
}

/**
 * Markdown — renderiza texto Markdown a HTML seguro sin dependencias.
 *
 * @element sp-markdown
 *
 * @prop {string} content - Texto Markdown a renderizar
 *
 * @slot - Alternativa: poner el Markdown como texto del slot
 */
@customElement("sp-markdown")
export class SpMarkdownComponent extends LitElement {
  static override styles = unsafeCSS(styles);

  @property({ type: String }) content = "";

  override render() {
    const md = this.content || (this.textContent ?? "");
    const html_content = parseMarkdown(md);

    return html`
      <div class="sp-md">${unsafeHTML(html_content)}</div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap { "sp-markdown": SpMarkdownComponent; }
}

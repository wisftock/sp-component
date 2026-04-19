import { LitElement, html, unsafeCSS, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import styles from "./sp-code-block.css?inline";
import { SpConfig } from "../../config.js";

// Minimal tokenizer for common languages
function highlight(code: string, lang: string): string {
  const esc = (s: string) => s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");

  if (!lang || lang === "text" || lang === "plain") return esc(code);

  let result = esc(code);

  if (["html","xml","svg"].includes(lang)) {
    result = result
      .replace(/(&lt;\/?)([\w-]+)/g, '$1<span class="sp-tag">$2</span>')
      .replace(/([\w-]+)(=)/g, '<span class="sp-attr">$1</span>$2')
      .replace(/(&quot;|&#39;)(.*?)\1/g, '<span class="sp-str">$1$2$1</span>')
      .replace(/(&lt;!--[\s\S]*?--&gt;)/g, '<span class="sp-cmt">$1</span>');
    return result;
  }

  if (["css","scss"].includes(lang)) {
    result = result
      .replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="sp-cmt">$1</span>')
      .replace(/(&quot;.*?&quot;|&#39;.*?&#39;)/g, '<span class="sp-str">$1</span>')
      .replace(/(#[0-9a-fA-F]{3,8}|\d+\.?\d*(px|em|rem|%|vh|vw|s|ms)?\b)/g, '<span class="sp-num">$1</span>')
      .replace(/([\w-]+)\s*(?=\s*\{)/g, '<span class="sp-fn">$1</span>')
      .replace(/([\w-]+)\s*(?=:)/g, '<span class="sp-attr">$1</span>');
    return result;
  }

  // JS/TS/JSX/Python/Go/Rust/etc.
  const KW = /\b(const|let|var|function|class|return|if|else|for|while|do|switch|case|break|continue|import|export|default|from|async|await|try|catch|finally|throw|new|this|super|extends|implements|interface|type|enum|of|in|typeof|instanceof|void|null|undefined|true|false|and|or|not|def|pass|yield|lambda|with|as|assert|del|elif|except|global|nonlocal|raise|is|None|True|False|fn|let|mut|pub|use|mod|struct|impl|trait|where|match|loop|self|Self|pub|crate|super|dyn|ref|move|static|const|unsafe|extern|package|import|func|defer|go|chan|map|range|select|var|make|new|cap|len|append|copy|close|panic|recover|print|println)\b/g;
  const STR = /(&quot;(?:\\.|[^&])*?&quot;|&#39;(?:\\.|[^&#])*?&#39;|`(?:\\.|[^`])*?`)/g;
  const CMT = /(\/\/.*$|\/\*[\s\S]*?\*\/|#.*$)/gm;
  const NUM = /\b(\d+\.?\d*)\b/g;
  const FN  = /\b([a-zA-Z_$][\w$]*)\s*(?=\()/g;
  const CLS = /\b([A-Z][a-zA-Z0-9_]*)\b/g;

  // Order matters — comments first to avoid highlighting inside them
  const tokens: [RegExp, string][] = [
    [CMT, "sp-cmt"],
    [STR, "sp-str"],
    [KW,  "sp-kw"],
    [NUM, "sp-num"],
    [FN,  "sp-fn"],
    [CLS, "sp-cls"],
  ];

  // We need to process without replacing inside already-replaced spans
  // Simple approach: tag segments
  type Seg = { text: string; cls?: string };
  const segments: Seg[] = [{ text: result }];

  for (const [pattern, cls] of tokens) {
    const next: Seg[] = [];
    for (const seg of segments) {
      if (seg.cls) { next.push(seg); continue; }
      let last = 0;
      const re = new RegExp(pattern.source, pattern.flags);
      let m: RegExpExecArray | null;
      while ((m = re.exec(seg.text)) !== null) {
        if (m.index > last) next.push({ text: seg.text.slice(last, m.index) });
        next.push({ text: m[0], cls });
        last = m.index + m[0].length;
      }
      if (last < seg.text.length) next.push({ text: seg.text.slice(last) });
    }
    segments.length = 0;
    segments.push(...next);
  }

  return segments.map(s => s.cls ? `<span class="${s.cls}">${s.text}</span>` : s.text).join("");
}

/**
 * Code Block — display de código con syntax highlighting, líneas numeradas y copia.
 *
 * @element sp-code-block
 *
 * @prop {string}  code        - Código a mostrar
 * @prop {string}  language    - Lenguaje: js | ts | html | css | python | go | rust, etc.
 * @prop {string}  filename    - Nombre de archivo mostrado en la cabecera
 * @prop {boolean} line-numbers - Muestra números de línea (default true)
 * @prop {boolean} copyable    - Muestra botón de copiar (default true)
 * @prop {string}  max-height  - Altura máxima con scroll
 */
@customElement("sp-code-block")
export class SpCodeBlockComponent extends LitElement {
  static override styles = unsafeCSS(styles);

  @property({ type: String }) code = "";
  @property({ type: String }) language = "js";
  @property({ type: String }) filename = "";
  @property({ type: Boolean, attribute: "line-numbers" }) lineNumbers = true;
  @property({ type: Boolean }) copyable = true;
  @property({ type: String, attribute: "max-height" }) maxHeight = "";

  @state() private _copied = false;

  async #copy() {
    try {
      await navigator.clipboard.writeText(this.code);
      this._copied = true;
      setTimeout(() => { this._copied = false; }, 2000);
    } catch {}
  }

  override render() {
    const lines = this.code.split("\n");
    const highlighted = highlight(this.code, this.language);
    const highlightedLines = highlighted.split("\n");

    const hasHeader = this.filename || this.language || this.copyable;

    return html`
      <div class="sp-cb">
        ${hasHeader ? html`
          <div class="sp-cb-header">
            ${this.filename ? html`<span class="sp-cb-filename">${this.filename}</span>` : html`<span class="sp-cb-lang">${this.language}</span>`}
            ${this.filename && this.language ? html`<span class="sp-cb-lang">${this.language}</span>` : nothing}
            ${this.copyable ? html`
              <button
                class=${classMap({ "sp-cb-copy": true, "sp-cb-copy--copied": this._copied })}
                @click=${() => this.#copy()}
                aria-label=${this._copied ? SpConfig.locale.codeBlock.copiedLabel : SpConfig.locale.codeBlock.copyLabel}
              >
                ${this._copied
                  ? html`<svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8l4 4 6-7"/></svg> ${SpConfig.locale.codeBlock.copiedLabel}`
                  : html`<svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="6" height="6" rx="1"/><path d="M5 9H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1"/></svg> ${SpConfig.locale.codeBlock.copyLabel}`
                }
              </button>
            ` : nothing}
          </div>
        ` : nothing}

        <div class="sp-cb-scroll" style=${this.maxHeight ? `max-height:${this.maxHeight};overflow-y:auto` : ""}>
          <pre class="sp-cb-pre">
            ${this.lineNumbers ? html`
              <span class="sp-cb-gutter">
                ${lines.map((_, i) => html`${i + 1}\n`)}
              </span>
            ` : nothing}
            <code class="sp-cb-code">${unsafeHTML(highlightedLines.join("\n"))}</code>
          </pre>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap { "sp-code-block": SpCodeBlockComponent; }
}

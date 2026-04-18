import { LitElement, html, unsafeCSS, nothing } from "lit";
import { customElement, property, state, query } from "lit/decorators.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import styles from "./sp-code-editor.css?inline";

// Reuse same highlight logic as sp-code-block
function esc(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function highlight(code: string, lang: string): string {
  if (!lang || lang === "text" || lang === "plain") return esc(code);

  let result = esc(code);

  if (["html", "xml", "svg"].includes(lang)) {
    result = result
      .replace(/(&lt;\/?)([\w-]+)/g, '$1<span class="sp-tag">$2</span>')
      .replace(/([\w-]+)(=)/g, '<span class="sp-attr">$1</span>$2')
      .replace(/(&quot;|&#39;)(.*?)\1/g, '<span class="sp-str">$1$2$1</span>')
      .replace(/(&lt;!--[\s\S]*?--&gt;)/g, '<span class="sp-cmt">$1</span>');
    return result;
  }

  if (["css", "scss"].includes(lang)) {
    result = result
      .replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="sp-cmt">$1</span>')
      .replace(/(&quot;.*?&quot;|&#39;.*?&#39;)/g, '<span class="sp-str">$1</span>')
      .replace(/(#[0-9a-fA-F]{3,8}|\d+\.?\d*(px|em|rem|%|vh|vw|s|ms)?\b)/g, '<span class="sp-num">$1</span>')
      .replace(/([\w-]+)\s*(?=\s*\{)/g, '<span class="sp-fn">$1</span>')
      .replace(/([\w-]+)\s*(?=:)/g, '<span class="sp-attr">$1</span>');
    return result;
  }

  const KW = /\b(const|let|var|function|class|return|if|else|for|while|do|switch|case|break|continue|import|export|default|from|async|await|try|catch|finally|throw|new|this|super|extends|implements|interface|type|enum|of|in|typeof|instanceof|void|null|undefined|true|false|def|pass|yield|lambda|with|as|assert|raise|fn|mut|pub|use|mod|struct|impl|trait|where|match|loop|self|pub|crate|package|func|defer|go|chan|map|range|select|make|cap|len|append|copy)\b/g;
  const STR = /(&quot;(?:\\.|[^&])*?&quot;|&#39;(?:\\.|[^&#])*?&#39;|`(?:\\.|[^`])*?`)/g;
  const CMT = /(\/\/.*$|\/\*[\s\S]*?\*\/|#.*$)/gm;
  const NUM = /\b(\d+\.?\d*)\b/g;
  const FN  = /\b([a-zA-Z_$][\w$]*)\s*(?=\()/g;
  const CLS = /\b([A-Z][a-zA-Z0-9_]*)\b/g;

  type Seg = { text: string; cls?: string };
  const tokens: [RegExp, string][] = [
    [CMT, "sp-cmt"], [STR, "sp-str"], [KW, "sp-kw"],
    [NUM, "sp-num"], [FN, "sp-fn"], [CLS, "sp-cls"],
  ];
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
 * Code Editor — editor de código liviano sin dependencias externas.
 *
 * @element sp-code-editor
 *
 * @prop {string}  value       - Código actual
 * @prop {string}  language    - Lenguaje de syntax highlighting
 * @prop {string}  filename    - Nombre mostrado en el header
 * @prop {boolean} readonly    - Solo lectura
 * @prop {number}  tab-size    - Tamaño del tab (default: 2)
 *
 * @fires sp-change  - { value: string }
 */
@customElement("sp-code-editor")
export class SpCodeEditorComponent extends LitElement {
  static override styles = unsafeCSS(styles);

  @property({ type: String }) value = "";
  @property({ type: String }) language = "js";
  @property({ type: String }) filename = "";
  @property({ type: Boolean }) readonly = false;
  @property({ type: Number, attribute: "tab-size" }) tabSize = 2;

  @state() private _value = "";

  @query("textarea") private _textarea!: HTMLTextAreaElement;

  override connectedCallback() {
    super.connectedCallback();
    this._value = this.value;
  }

  override updated(changed: Map<string, unknown>) {
    if (changed.has("value") && this.value !== this._value) {
      this._value = this.value;
    }
  }

  #onInput(e: Event) {
    this._value = (e.target as HTMLTextAreaElement).value;
    this.dispatchEvent(new CustomEvent("sp-change", {
      detail: { value: this._value },
      bubbles: true, composed: true,
    }));
  }

  #onKeyDown(e: KeyboardEvent) {
    if (this.readonly) return;
    const ta = this._textarea;

    if (e.key === "Tab") {
      e.preventDefault();
      const start = ta.selectionStart;
      const end = ta.selectionEnd;
      const spaces = " ".repeat(this.tabSize);
      this._value = this._value.slice(0, start) + spaces + this._value.slice(end);
      // restore cursor
      requestAnimationFrame(() => {
        ta.selectionStart = ta.selectionEnd = start + this.tabSize;
      });
    }

    // Auto-close brackets/quotes
    const pairs: Record<string, string> = { "(": ")", "[": "]", "{": "}", '"': '"', "'": "'" };
    if (pairs[e.key]) {
      const start = ta.selectionStart;
      const end = ta.selectionEnd;
      if (start === end) {
        e.preventDefault();
        const open = e.key;
        const close = pairs[open];
        this._value = this._value.slice(0, start) + open + close + this._value.slice(end);
        requestAnimationFrame(() => {
          ta.selectionStart = ta.selectionEnd = start + 1;
        });
      }
    }
  }

  override render() {
    const lines = this._value.split("\n");
    const highlighted = highlight(this._value, this.language);

    return html`
      <div class="sp-ce">
        <div class="sp-ce-header">
          <div class="sp-ce-dots">
            <div class="sp-ce-dot sp-ce-dot--red"></div>
            <div class="sp-ce-dot sp-ce-dot--yellow"></div>
            <div class="sp-ce-dot sp-ce-dot--green"></div>
          </div>
          <span class="sp-ce-filename">${this.filename || nothing}</span>
          <span class="sp-ce-lang-badge">${this.language}</span>
        </div>

        <div class="sp-ce-body">
          <div class="sp-ce-gutter" aria-hidden="true">
            ${lines.map((_, i) => html`<span class="sp-ce-gutter-line">${i + 1}</span>`)}
          </div>
          <div class="sp-ce-editor-wrap">
            <div class="sp-ce-highlight" aria-hidden="true">
              ${unsafeHTML(highlighted)}
            </div>
            <textarea
              class="sp-ce-textarea"
              .value=${this._value}
              spellcheck="false"
              autocorrect="off"
              autocapitalize="off"
              ?readonly=${this.readonly}
              @input=${(e: Event) => this.#onInput(e)}
              @keydown=${(e: KeyboardEvent) => this.#onKeyDown(e)}
              @scroll=${(e: Event) => {
                const ta = e.target as HTMLElement;
                const hl = this.shadowRoot?.querySelector(".sp-ce-highlight") as HTMLElement;
                if (hl) { hl.scrollTop = ta.scrollTop; hl.scrollLeft = ta.scrollLeft; }
              }}
            ></textarea>
          </div>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap { "sp-code-editor": SpCodeEditorComponent; }
}

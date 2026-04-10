import { LitElement, html, unsafeCSS, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import styles from "./sp-mention.css?inline";

export interface SpMentionItem {
  id: string;
  label: string;
  avatar?: string;
  description?: string;
}

/**
 * Text input with @mention support and a suggestion dropdown.
 *
 * @element sp-mention
 *
 * @prop {SpMentionItem[]} items       - All mentionable items
 * @prop {string}          value       - Current text value
 * @prop {string}          placeholder - Input placeholder
 * @prop {string}          label       - Label text
 * @prop {boolean}         disabled    - Disable input
 * @prop {number}          maxResults  - Max suggestions shown (default 6)
 *
 * @fires {CustomEvent<{ value: string }>} sp-change   - Input value changed
 * @fires {CustomEvent<SpMentionItem>}     sp-mention  - A mention was selected
 */
@customElement("sp-mention")
export class SpMentionComponent extends LitElement {
  static override styles = unsafeCSS(styles);

  @property({ type: Array }) items: SpMentionItem[] = [];
  @property({ type: String }) value = "";
  @property({ type: String }) placeholder = "Type @ to mention...";
  @property({ type: String }) label = "";
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Number, attribute: "max-results" }) maxResults = 6;

  @state() private _open = false;
  @state() private _query = "";
  @state() private _activeIndex = 0;

  get #suggestions(): SpMentionItem[] {
    if (!this._query && !this._open) return [];
    const q = this._query.toLowerCase();
    return this.items
      .filter(i => i.label.toLowerCase().includes(q) || i.id.toLowerCase().includes(q))
      .slice(0, this.maxResults);
  }

  #handleInput(e: Event) {
    const input = e.target as HTMLInputElement;
    this.value = input.value;

    const cursor = input.selectionStart ?? this.value.length;
    const textBefore = this.value.slice(0, cursor);
    const mentionMatch = textBefore.match(/@(\w*)$/);

    if (mentionMatch) {
      this._query = mentionMatch[1] ?? "";
      this._open = true;
      this._activeIndex = 0;
    } else {
      this._open = false;
      this._query = "";
    }

    this.dispatchEvent(new CustomEvent("sp-change", {
      detail: { value: this.value }, bubbles: true, composed: true,
    }));
  }

  #handleKeydown(e: KeyboardEvent) {
    if (!this._open) return;
    const sug = this.#suggestions;
    if (e.key === "ArrowDown") { e.preventDefault(); this._activeIndex = (this._activeIndex + 1) % sug.length; }
    else if (e.key === "ArrowUp") { e.preventDefault(); this._activeIndex = (this._activeIndex - 1 + sug.length) % sug.length; }
    else if (e.key === "Enter" && sug[this._activeIndex]) { e.preventDefault(); this.#select(sug[this._activeIndex]!); }
    else if (e.key === "Escape") { this._open = false; }
  }

  #select(item: SpMentionItem) {
    // Replace the @query with @label
    const cursor = (this.shadowRoot?.querySelector("input") as HTMLInputElement)?.selectionStart ?? this.value.length;
    const textBefore = this.value.slice(0, cursor);
    const textAfter = this.value.slice(cursor);
    const replaced = textBefore.replace(/@(\w*)$/, `@${item.label} `);
    this.value = replaced + textAfter;
    this._open = false;
    this._query = "";

    this.dispatchEvent(new CustomEvent<SpMentionItem>("sp-mention", {
      detail: item, bubbles: true, composed: true,
    }));
    this.dispatchEvent(new CustomEvent("sp-change", {
      detail: { value: this.value }, bubbles: true, composed: true,
    }));
  }

  override render() {
    const suggestions = this.#suggestions;
    return html`
      <div class="sp-mention">
        ${this.label ? html`<label class="sp-mention__label">${this.label}</label>` : nothing}
        <div class="sp-mention__wrap">
          <input
            type="text"
            class="sp-mention__input"
            .value=${this.value}
            placeholder=${this.placeholder}
            ?disabled=${this.disabled}
            autocomplete="off"
            @input=${this.#handleInput}
            @keydown=${this.#handleKeydown}
            @blur=${() => setTimeout(() => { this._open = false; }, 150)}
          />
          ${this._open && suggestions.length ? html`
            <ul class="sp-mention__dropdown" role="listbox">
              ${suggestions.map((item, i) => html`
                <li
                  class=${classMap({
                    "sp-mention__option": true,
                    "sp-mention__option--active": i === this._activeIndex,
                  })}
                  role="option"
                  aria-selected=${i === this._activeIndex}
                  @mousedown=${() => this.#select(item)}
                >
                  ${item.avatar ? html`<img class="sp-mention__avatar" src=${item.avatar} alt="" />` : nothing}
                  <span class="sp-mention__name">${item.label}</span>
                  ${item.description ? html`<span class="sp-mention__desc">${item.description}</span>` : nothing}
                </li>
              `)}
            </ul>
          ` : nothing}
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "sp-mention": SpMentionComponent;
  }
}

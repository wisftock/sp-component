import { LitElement, html, unsafeCSS } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import styles from "./sp-anchor.css?inline";

export interface SpAnchorItem {
  id: string;
  title: string;
  children?: SpAnchorItem[];
}

/**
 * Anchor — navegación interna tipo tabla de contenidos.
 * Resalta el ítem activo según el scroll de la página.
 *
 * @element sp-anchor
 *
 * @prop {SpAnchorItem[]} items     - Lista de anclas
 * @prop {number}         offset    - Offset en px del scroll (útil con navbar fijo, default 80)
 * @prop {string}         container - Selector del contenedor de scroll (default window)
 *
 * @fires {CustomEvent<{id:string}>} sp-click
 */
@customElement("sp-anchor")
export class SpAnchorComponent extends LitElement {
  static override styles = unsafeCSS(styles);

  @property({ type: Array }) items: SpAnchorItem[] = [];
  @property({ type: Number }) offset = 80;
  @property({ type: String }) container = "";

  @state() private _activeId = "";

  #observer: IntersectionObserver | null = null;

  override connectedCallback() {
    super.connectedCallback();
    void this.updateComplete.then(() => this.#setupObserver());
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.#observer?.disconnect();
  }

  override updated(changed: Map<string, unknown>) {
    if (changed.has("items")) {
      this.#observer?.disconnect();
      void this.updateComplete.then(() => this.#setupObserver());
    }
  }

  #allIds(): string[] {
    const collect = (items: SpAnchorItem[]): string[] =>
      items.flatMap(i => [i.id, ...(i.children ? collect(i.children) : [])]);
    return collect(this.items);
  }

  #setupObserver() {
    this.#observer?.disconnect();
    const ids = this.#allIds();
    const els = ids.map(id => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    if (!els.length) return;

    const visible = new Map<string, number>();

    this.#observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = entry.target.id;
          if (entry.isIntersecting) {
            visible.set(id, entry.intersectionRatio);
          } else {
            visible.delete(id);
          }
        }
        if (visible.size > 0) {
          // Pick the topmost visible section
          const topId = [...visible.entries()].sort((a, b) => {
            const elA = document.getElementById(a[0]);
            const elB = document.getElementById(b[0]);
            return (elA?.getBoundingClientRect().top ?? 0) - (elB?.getBoundingClientRect().top ?? 0);
          })[0]?.[0] ?? "";
          if (topId) this._activeId = topId;
        }
      },
      { rootMargin: `-${this.offset}px 0px -40% 0px`, threshold: [0, 0.1, 0.5, 1] }
    );

    for (const el of els) this.#observer.observe(el);
  }

  #navigate(id: string, e: Event) {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - this.offset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
    this._activeId = id;
    this.dispatchEvent(new CustomEvent("sp-click", { detail: { id }, bubbles: true, composed: true }));
  }

  #renderItems(items: SpAnchorItem[], nested = false): unknown {
    return items.map(item => html`
      <li>
        <a
          class=${classMap({
            "sp-anchor-link": true,
            "sp-anchor-link--active": this._activeId === item.id,
          })}
          href=${`#${item.id}`}
          @click=${(e: Event) => this.#navigate(item.id, e)}
        >${item.title}</a>
        ${item.children?.length ? html`
          <ul class="sp-anchor-children">${this.#renderItems(item.children, true)}</ul>
        ` : ""}
      </li>
    `);
  }

  override render() {
    return html`
      <ul class="sp-anchor" role="navigation" aria-label="Tabla de contenidos">
        ${this.#renderItems(this.items)}
      </ul>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap { "sp-anchor": SpAnchorComponent; }
}

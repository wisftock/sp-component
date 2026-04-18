import { LitElement, html, unsafeCSS, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import styles from "./sp-hover-card.css?inline";

export type SpHoverCardPlacement = "top" | "bottom" | "left" | "right";

/**
 * Hover Card — card flotante que aparece al hacer hover sobre el trigger.
 * Ideal para previews de usuario, links, imágenes, etc.
 *
 * @element sp-hover-card
 *
 * @prop {SpHoverCardPlacement} placement  - Posición: top | bottom | left | right (default bottom)
 * @prop {number}               open-delay - Delay en ms antes de mostrar (default 300)
 * @prop {number}               close-delay - Delay en ms antes de ocultar (default 150)
 *
 * @slot         - Elemento que dispara el hover
 * @slot content - Contenido de la card
 */
@customElement("sp-hover-card")
export class SpHoverCardComponent extends LitElement {
  static override styles = unsafeCSS(styles);

  @property({ type: String, reflect: true }) placement: SpHoverCardPlacement = "bottom";
  @property({ type: Number, attribute: "open-delay" }) openDelay = 300;
  @property({ type: Number, attribute: "close-delay" }) closeDelay = 150;

  @state() private _open = false;

  #showTimer: ReturnType<typeof setTimeout> | undefined;
  #hideTimer: ReturnType<typeof setTimeout> | undefined;

  #show() {
    clearTimeout(this.#hideTimer);
    this.#showTimer = setTimeout(() => { this._open = true; }, this.openDelay);
  }

  #hide() {
    clearTimeout(this.#showTimer);
    this.#hideTimer = setTimeout(() => { this._open = false; }, this.closeDelay);
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    clearTimeout(this.#showTimer);
    clearTimeout(this.#hideTimer);
  }

  override render() {
    return html`
      <div
        class="sp-hc-wrapper"
        @mouseenter=${() => this.#show()}
        @mouseleave=${() => this.#hide()}
        @focusin=${() => this.#show()}
        @focusout=${() => this.#hide()}
      >
        <slot></slot>
        ${this._open ? html`
          <div class=${classMap({
            "sp-hc-card": true,
            [`sp-hc-card--${this.placement}`]: true,
          })} role="tooltip">
            <slot name="content"></slot>
          </div>
        ` : nothing}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap { "sp-hover-card": SpHoverCardComponent; }
}

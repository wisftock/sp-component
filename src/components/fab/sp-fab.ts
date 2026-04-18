import { LitElement, html, unsafeCSS, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { styleMap } from "lit/directives/style-map.js";
import styles from "./sp-fab.css?inline";

export type SpFabPosition = "bottom-right" | "bottom-left" | "top-right" | "top-left";
export type SpFabSize     = "sm" | "md" | "lg";

export interface SpFabAction {
  icon: string;
  label?: string;
  onClick?: () => void;
  disabled?: boolean;
}

/**
 * FAB — Floating Action Button con soporte para Speed Dial.
 *
 * @element sp-fab
 *
 * @prop {string}         icon     - Icono/emoji del botón principal
 * @prop {SpFabPosition}  position - Posición fija en pantalla (default bottom-right)
 * @prop {SpFabSize}      size     - sm | md | lg (default md)
 * @prop {SpFabAction[]}  actions  - Acciones del speed dial
 * @prop {string}         color    - Color de fondo CSS (reemplaza el color primario)
 * @prop {string}         label    - Aria-label
 *
 * @fires {CustomEvent} sp-click - Al hacer click en el botón principal (sin actions)
 */
@customElement("sp-fab")
export class SpFabComponent extends LitElement {
  static override styles = unsafeCSS(styles);

  @property({ type: String }) icon = "+";
  @property({ type: String, reflect: true }) position: SpFabPosition = "bottom-right";
  @property({ type: String, reflect: true }) size: SpFabSize = "md";
  @property({ type: Array }) actions: SpFabAction[] = [];
  @property({ type: String }) color = "";
  @property({ type: String }) label = "Acción flotante";

  @state() private _open = false;

  #handleMain() {
    if (this.actions.length) {
      this._open = !this._open;
    } else {
      this.dispatchEvent(new CustomEvent("sp-click", { bubbles: true, composed: true }));
    }
  }

  #selectAction(action: SpFabAction) {
    if (action.disabled) return;
    this._open = false;
    action.onClick?.();
  }

  override render() {
    const isLeft = this.position === "bottom-left" || this.position === "top-left";

    return html`
      ${this._open ? html`<div class="sp-fab-overlay" @click=${() => { this._open = false; }}></div>` : nothing}

      <div class="sp-fab-root">
        <button
          class=${classMap({
            "sp-fab-btn": true,
            "sp-fab-btn--open": this._open && this.actions.length > 0,
          })}
          style=${this.color ? styleMap({ background: this.color }) : ""}
          aria-label=${this.label}
          aria-expanded=${this._open}
          @click=${() => this.#handleMain()}
        >
          <span class="sp-fab-icon">${this.icon}</span>
        </button>

        ${this._open && this.actions.length ? html`
          <div class="sp-fab-actions">
            ${this.actions.map((action, i) => html`
              <div class="sp-fab-action" style="animation-delay:${i * 40}ms">
                ${!isLeft && action.label ? html`<span class="sp-fab-action-label">${action.label}</span>` : nothing}
                <button
                  class="sp-fab-action-btn"
                  aria-label=${action.label || `Acción ${i + 1}`}
                  ?disabled=${action.disabled}
                  @click=${() => this.#selectAction(action)}
                >${action.icon}</button>
                ${isLeft && action.label ? html`<span class="sp-fab-action-label">${action.label}</span>` : nothing}
              </div>
            `)}
          </div>
        ` : nothing}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap { "sp-fab": SpFabComponent; }
}

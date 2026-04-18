import { LitElement, html, unsafeCSS, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import styles from "./sp-chat-bubble.css?inline";

export type SpChatStatus = "sent" | "delivered" | "read";

/**
 * Chat Bubble — burbuja de mensaje con avatar, timestamp y estado.
 *
 * @element sp-chat-bubble
 *
 * @prop {string}        message   - Texto del mensaje
 * @prop {string}        avatar    - URL del avatar
 * @prop {string}        name      - Nombre del remitente
 * @prop {string}        time      - Hora/fecha de envío
 * @prop {boolean}       mine      - Si el mensaje es del usuario actual (derecha)
 * @prop {SpChatStatus}  status    - sent | delivered | read (solo si mine=true)
 * @prop {boolean}       typing    - Muestra indicador de escribiendo...
 * @prop {boolean}       show-avatar - Muestra el avatar (default true)
 *
 * @slot - Reemplaza el contenido del bubble
 */
@customElement("sp-chat-bubble")
export class SpChatBubbleComponent extends LitElement {
  static override styles = unsafeCSS(styles);

  @property({ type: String }) message = "";
  @property({ type: String }) avatar = "";
  @property({ type: String }) name = "";
  @property({ type: String }) time = "";
  @property({ type: Boolean, reflect: true }) mine = false;
  @property({ type: String }) status: SpChatStatus = "sent";
  @property({ type: Boolean, reflect: true }) typing = false;
  @property({ type: Boolean, attribute: "show-avatar" }) showAvatar = true;

  #initials(name: string) {
    return name.split(" ").map(w => w[0] ?? "").slice(0, 2).join("").toUpperCase() || "?";
  }

  #statusIcon() {
    if (this.status === "read") {
      return html`<svg width="14" height="10" viewBox="0 0 18 12" fill="none" stroke="#3b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 6l4 4 6-9M7 10l4-4 4-4"/></svg>`;
    }
    if (this.status === "delivered") {
      return html`<svg width="14" height="10" viewBox="0 0 18 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 6l4 4 6-9M7 10l4-4 4-4"/></svg>`;
    }
    return html`<svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 6l4 4 6-7"/></svg>`;
  }

  override render() {
    return html`
      <div class="sp-cb-row">
        ${this.showAvatar ? html`
          <div class="sp-cb-avatar">
            ${this.avatar
              ? html`<img src=${this.avatar} alt=${this.name || "Avatar"} />`
              : html`${this.#initials(this.name)}`
            }
          </div>
        ` : nothing}

        <div class="sp-cb-content">
          ${!this.mine && this.name ? html`<span class="sp-cb-name">${this.name}</span>` : nothing}

          <div class="sp-cb-bubble">
            ${this.typing
              ? html`<span class="sp-cb-dot"></span><span class="sp-cb-dot"></span><span class="sp-cb-dot"></span>`
              : html`<slot>${this.message}</slot>`
            }
          </div>

          <div class="sp-cb-meta">
            ${this.time ? html`<span class="sp-cb-time">${this.time}</span>` : nothing}
            ${this.mine && !this.typing ? html`
              <span class="sp-cb-status sp-cb-status--${this.status}">${this.#statusIcon()}</span>
            ` : nothing}
          </div>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap { "sp-chat-bubble": SpChatBubbleComponent; }
}

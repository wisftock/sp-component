import { LitElement, html, unsafeCSS, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import styles from "./sp-notification-center.css?inline";
import { SpConfig } from "../../config.js";

export interface SpNotification {
  id: string;
  title: string;
  body?: string;
  time?: string;
  read?: boolean;
  type?: "info" | "success" | "warning" | "error";
  icon?: string;
}

/**
 * Notification center — bell icon button with a dropdown list.
 *
 * @element sp-notification-center
 *
 * @prop {SpNotification[]} notifications
 * @prop {string}           emptyText
 * @prop {string}           title
 *
 * @fires {CustomEvent<{ notification: SpNotification }>} sp-notification-click
 * @fires {CustomEvent} sp-mark-all-read
 * @fires {CustomEvent<{ id: string }>} sp-dismiss
 */
@customElement("sp-notification-center")
export class SpNotificationCenterComponent extends LitElement {
  static override styles = unsafeCSS(styles);

  @property({ type: Array }) notifications: SpNotification[] = [];
  @property({ type: String }) emptyText = "You're all caught up!";
  @property({ type: String }) title = "Notifications";

  @state() private _open = false;

  get #unread() { return this.notifications.filter(n => !n.read).length; }

  readonly #onOutside = (e: MouseEvent) => {
    if (!this.shadowRoot?.contains(e.target as Node)) this._open = false;
  };

  override connectedCallback() {
    super.connectedCallback();
    document.addEventListener("click", this.#onOutside);
  }
  override disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener("click", this.#onOutside);
  }

  #markAllRead() {
    this.notifications = this.notifications.map(n => ({ ...n, read: true }));
    this.dispatchEvent(new CustomEvent("sp-mark-all-read", { bubbles: true, composed: true }));
  }

  #dismiss(id: string, e: Event) {
    e.stopPropagation();
    this.notifications = this.notifications.filter(n => n.id !== id);
    this.dispatchEvent(new CustomEvent("sp-dismiss", { detail: { id }, bubbles: true, composed: true }));
  }

  #click(n: SpNotification) {
    this.notifications = this.notifications.map(item =>
      item.id === n.id ? { ...item, read: true } : item
    );
    this.dispatchEvent(new CustomEvent("sp-notification-click", { detail: { notification: n }, bubbles: true, composed: true }));
  }

  #typeIcon(type?: string) {
    if (type === "success") return html`<span class="sp-nc-type-icon sp-nc-type-icon--success">✓</span>`;
    if (type === "warning") return html`<span class="sp-nc-type-icon sp-nc-type-icon--warning">!</span>`;
    if (type === "error")   return html`<span class="sp-nc-type-icon sp-nc-type-icon--error">✕</span>`;
    return html`<span class="sp-nc-type-icon sp-nc-type-icon--info">i</span>`;
  }

  override render() {
    const unread = this.#unread;
    return html`
      <div class="sp-nc">
        <button
          class="sp-nc-trigger"
          aria-label="Notifications${unread ? ` (${unread} unread)` : ""}"
          aria-haspopup="true"
          aria-expanded=${this._open}
          @click=${(e: Event) => { e.stopPropagation(); this._open = !this._open; }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
          ${unread > 0 ? html`<span class="sp-nc-badge">${unread > 99 ? "99+" : unread}</span>` : nothing}
        </button>

        ${this._open ? html`
          <div class="sp-nc-dropdown" role="dialog" aria-label=${this.title}>
            <div class="sp-nc-header">
              <span class="sp-nc-header-title">${this.title}</span>
              ${unread > 0 ? html`
                <button class="sp-nc-mark-all" @click=${() => this.#markAllRead()}>${SpConfig.locale.notificationCenter.markAllReadLabel}</button>
              ` : nothing}
            </div>

            <div class="sp-nc-list" role="log" aria-live="polite" aria-label=${SpConfig.locale.notificationCenter.notificationsLabel}>
              ${this.notifications.length === 0 ? html`
                <div class="sp-nc-empty">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="color:#d1d5db">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                  </svg>
                  <span>${this.emptyText}</span>
                </div>
              ` : this.notifications.map(n => html`
                <div
                  class=${classMap({ "sp-nc-item": true, "sp-nc-item--unread": !n.read })}
                  @click=${() => this.#click(n)}
                >
                  <div class="sp-nc-item-icon">
                    ${n.icon ? html`<span>${n.icon}</span>` : this.#typeIcon(n.type)}
                  </div>
                  <div class="sp-nc-item-body">
                    <div class="sp-nc-item-title">${n.title}</div>
                    ${n.body ? html`<div class="sp-nc-item-text">${n.body}</div>` : nothing}
                    ${n.time ? html`<div class="sp-nc-item-time">${n.time}</div>` : nothing}
                  </div>
                  ${!n.read ? html`<span class="sp-nc-dot" aria-label="Unread"></span>` : nothing}
                  <button class="sp-nc-dismiss" title=${SpConfig.locale.notificationCenter.dismissLabel} @click=${(e: Event) => this.#dismiss(n.id, e)}>✕</button>
                </div>
              `)}
            </div>
          </div>
        ` : nothing}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap { "sp-notification-center": SpNotificationCenterComponent; }
}

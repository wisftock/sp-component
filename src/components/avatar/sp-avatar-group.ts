import { LitElement, html, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import styles from "./sp-avatar-group.css?inline";
import type { SpAvatarSize } from "./sp-avatar.types.js";

/**
 * Displays a group of avatars stacked with overlap and an overflow badge.
 *
 * @element sp-avatar-group
 *
 * @prop {number}       max    - Maximum avatars to show before the +N badge
 * @prop {SpAvatarSize} size   - Size applied to all avatars and the overflow badge
 * @prop {number}       total  - Total number of members (overrides counting slotted avatars)
 *
 * @slot - sp-avatar elements
 *
 * @example
 * <sp-avatar-group max="4">
 *   <sp-avatar initials="AA" src="..."></sp-avatar>
 *   <sp-avatar initials="BB"></sp-avatar>
 *   <sp-avatar initials="CC"></sp-avatar>
 *   <sp-avatar initials="DD"></sp-avatar>
 *   <sp-avatar initials="EE"></sp-avatar>
 * </sp-avatar-group>
 */
@customElement("sp-avatar-group")
export class SpAvatarGroupComponent extends LitElement {
  static override styles = unsafeCSS(styles);

  @property({ type: Number })
  max = 5;

  @property({ type: String, reflect: true })
  size: SpAvatarSize = "md";

  @property({ type: Number })
  total = 0;

  override render() {
    const slotted = this.querySelectorAll("sp-avatar");
    const count = slotted.length;
    const visible = this.max;
    const overflow = this.total > 0
      ? this.total - visible
      : count - visible;

    // Sync size attribute to all slotted avatars
    slotted.forEach((av, i) => {
      av.setAttribute("size", this.size);
      (av as HTMLElement).style.display = i < visible ? "" : "none";
    });

    return html`
      <div class="sp-avatar-group" role="group" aria-label="Avatar group">
        <slot></slot>
        ${overflow > 0 ? html`
          <div
            class="sp-avatar-group__overflow"
            aria-label="${overflow} more"
            title="${overflow} more"
          >+${overflow}</div>
        ` : ""}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "sp-avatar-group": SpAvatarGroupComponent;
  }
}

import { LitElement, unsafeCSS } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import styles from "./sp-avatar.css?inline";
import { avatarTemplate } from "./sp-avatar.template.js";
import type { SpAvatarShape, SpAvatarSize } from "./sp-avatar.types.js";

/**
 * An avatar component that displays an image, initials, or a placeholder icon.
 *
 * @element sp-avatar
 *
 * @prop {string}        src       - Image URL
 * @prop {string}        alt       - Image alt text
 * @prop {string}        initials  - Text initials shown when no image is available
 * @prop {SpAvatarShape} shape     - Shape: circle | square
 * @prop {SpAvatarSize}  size      - Size: sm | md | lg | xl
 */
@customElement("sp-avatar")
export class SpAvatarComponent extends LitElement {
  static override styles = unsafeCSS(styles);

  @property({ type: String })
  src = "";

  @property({ type: String })
  alt = "";

  @property({ type: String })
  initials = "";

  @property({ type: String, reflect: true })
  shape: SpAvatarShape = "circle";

  @property({ type: String, reflect: true })
  size: SpAvatarSize = "md";

  @state()
  _imageError = false;

  override updated(changedProperties: Map<string, unknown>): void {
    if (changedProperties.has("src")) {
      this._imageError = false;
    }
  }

  _getInitials(): string {
    return this.initials
      .split(" ")
      .map((w) => w[0] ?? "")
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }

  readonly _handleImageError = () => {
    this._imageError = true;
    this.requestUpdate();
  };

  override render() {
    return avatarTemplate.call(this);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "sp-avatar": SpAvatarComponent;
  }
}

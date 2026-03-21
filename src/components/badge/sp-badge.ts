import { LitElement, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import styles from "./sp-badge.css?inline";
import { badgeTemplate } from "./sp-badge.template.js";
import type { SpBadgeVariant } from "./sp-badge.types.js";

/**
 * A small status badge component.
 *
 * @element sp-badge
 *
 * @prop {SpBadgeVariant} variant  - Color variant: primary | secondary | success | warning | danger | neutral
 * @prop {boolean}        pill     - Renders with fully rounded corners
 * @prop {boolean}        pulsing  - Applies a pulsing opacity animation
 *
 * @slot - Badge label content
 */
@customElement("sp-badge")
export class SpBadgeComponent extends LitElement {
  static override styles = unsafeCSS(styles);

  @property({ type: String, reflect: true })
  variant: SpBadgeVariant = "primary";

  @property({ type: Boolean, reflect: true })
  pill = false;

  @property({ type: Boolean, reflect: true })
  pulsing = false;

  override render() {
    return badgeTemplate.call(this);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "sp-badge": SpBadgeComponent;
  }
}

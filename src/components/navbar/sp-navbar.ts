import { LitElement, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import styles from "./sp-navbar.css?inline";
import { navbarTemplate } from "./sp-navbar.template.js";

/**
 * Navigation bar component with start, center, and end slots.
 *
 * @element sp-navbar
 *
 * @prop {boolean} fixed            - Fixes the navbar to the top of the viewport
 * @prop {boolean} sticky           - Sticky positioning (scrolls with page then sticks)
 * @prop {boolean} bordered         - Adds a bottom border to the navbar
 * @prop {boolean} transparent      - Makes the navbar background transparent
 * @prop {"none"|"sm"|"md"}  elevation - Box shadow level
 * @prop {string}  navLabel         - aria-label for the <nav> landmark
 *
 * @slot start  - Content aligned to the left (e.g. logo)
 * @slot center - Content centered (e.g. navigation links)
 * @slot end    - Content aligned to the right (e.g. actions)
 */
@customElement("sp-navbar")
export class SpNavbarComponent extends LitElement {
  static override styles = unsafeCSS(styles);

  @property({ type: Boolean, reflect: true })
  fixed = false;

  @property({ type: Boolean, reflect: true })
  sticky = false;

  @property({ type: Boolean, reflect: true })
  bordered = false;

  @property({ type: Boolean, reflect: true })
  transparent = false;

  @property({ type: String, reflect: true })
  elevation: "none" | "sm" | "md" = "none";

  @property({ type: String, attribute: "nav-label" })
  navLabel = "Main navigation";

  override render() {
    return navbarTemplate.call(this);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "sp-navbar": SpNavbarComponent;
  }
}

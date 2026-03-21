import { LitElement, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import styles from "./sp-empty-state.css?inline";
import { emptyStateTemplate } from "./sp-empty-state.template.js";

/**
 * Empty state component for zero-data views.
 *
 * @element sp-empty-state
 *
 * @prop {string} title       - Main heading text
 * @prop {string} description - Supporting description text
 * @prop {string} icon        - URL of a custom icon image; if empty, a default SVG is shown
 *
 * @slot - Action buttons or links shown below the description
 */
@customElement("sp-empty-state")
export class SpEmptyStateComponent extends LitElement {
  static override styles = unsafeCSS(styles);

  @property({ type: String })
  title = "No data found";

  @property({ type: String })
  description = "";

  @property({ type: String })
  icon = "";

  override render() {
    return emptyStateTemplate.call(this);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "sp-empty-state": SpEmptyStateComponent;
  }
}

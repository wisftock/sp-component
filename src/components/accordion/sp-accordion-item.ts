import { LitElement, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import styles from "./sp-accordion-item.css?inline";
import { accordionItemTemplate } from "./sp-accordion-item.template.js";

/**
 * Accordion item component — must be used inside sp-accordion.
 *
 * @element sp-accordion-item
 *
 * @prop {string}  label    - Header label text
 * @prop {boolean} open     - Whether the item is expanded
 * @prop {boolean} disabled - Prevents toggle interaction
 * @prop {string}  value    - Unique identifier for this item
 *
 * @fires {CustomEvent<{ open: boolean, value: string }>} sp-toggle - Emitted when item is toggled
 *
 * @slot       - Body content when expanded
 * @slot label - Custom label content (overrides label prop)
 */
@customElement("sp-accordion-item")
export class SpAccordionItemComponent extends LitElement {
  static override styles = unsafeCSS(styles);

  @property({ type: String })
  label = "";

  @property({ type: Boolean, reflect: true })
  open = false;

  @property({ type: Boolean, reflect: true })
  disabled = false;

  @property({ type: String })
  value = "";

  readonly _handleClick = () => {
    if (!this.disabled) {
      this.open = !this.open;
      this.dispatchEvent(
        new CustomEvent("sp-toggle", {
          detail: { open: this.open, value: this.value },
          bubbles: true,
          composed: true,
        }),
      );
    }
  };

  override render() {
    return accordionItemTemplate.call(this);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "sp-accordion-item": SpAccordionItemComponent;
  }
}

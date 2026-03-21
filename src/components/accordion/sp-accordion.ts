import { LitElement, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import styles from "./sp-accordion.css?inline";
import { accordionTemplate } from "./sp-accordion.template.js";
import type { SpAccordionVariant } from "./sp-accordion.types.js";

/**
 * Accordion container component.
 *
 * @element sp-accordion
 *
 * @prop {boolean}            multiple - Allows multiple items open at once
 * @prop {SpAccordionVariant} variant  - Visual style: default | bordered | ghost
 *
 * @slot - sp-accordion-item elements
 */
@customElement("sp-accordion")
export class SpAccordionComponent extends LitElement {
  static override styles = unsafeCSS(styles);

  @property({ type: Boolean })
  multiple = false;

  @property({ type: String, reflect: true })
  variant: SpAccordionVariant = "default";

  override connectedCallback() {
    super.connectedCallback();
    this.addEventListener("sp-toggle", this._handleItemToggle as EventListener);
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener("sp-toggle", this._handleItemToggle as EventListener);
  }

  private readonly _handleItemToggle = (e: CustomEvent<{ open: boolean; value: string }>) => {
    if (!this.multiple && e.detail.open) {
      const items = [...this.querySelectorAll("sp-accordion-item")] as any[];
      items.forEach((item) => {
        if (item.value !== e.detail.value) item.open = false;
      });
    }
  };

  override render() {
    return accordionTemplate.call(this);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "sp-accordion": SpAccordionComponent;
  }
}

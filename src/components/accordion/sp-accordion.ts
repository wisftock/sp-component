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
    this.addEventListener("keydown", this._handleKeydown as EventListener);
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener("sp-toggle", this._handleItemToggle as EventListener);
    this.removeEventListener("keydown", this._handleKeydown as EventListener);
  }

  private readonly _handleKeydown = (e: KeyboardEvent) => {
    const items = [...this.querySelectorAll<HTMLElement>("sp-accordion-item:not([disabled])")];
    if (!items.length) return;

    // Find which item's trigger button is currently focused
    const focused = items.findIndex(item => {
      const trigger = (item as any).shadowRoot?.querySelector(".sp-accordion-trigger");
      return trigger && (document.activeElement === item || trigger === (item.shadowRoot?.activeElement));
    });

    let next = focused;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      next = focused < items.length - 1 ? focused + 1 : 0;
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      next = focused > 0 ? focused - 1 : items.length - 1;
    } else if (e.key === "Home") {
      e.preventDefault();
      next = 0;
    } else if (e.key === "End") {
      e.preventDefault();
      next = items.length - 1;
    } else {
      return;
    }

    const target = items[next];
    const trigger = (target as any).shadowRoot?.querySelector<HTMLElement>(".sp-accordion-trigger");
    trigger?.focus();
  };

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

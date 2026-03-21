import { LitElement, unsafeCSS } from "lit";
import { customElement } from "lit/decorators.js";
import { html } from "lit";
import styles from "./sp-carousel-slide.css?inline";

/**
 * A single slide inside sp-carousel.
 *
 * @element sp-carousel-slide
 *
 * @slot - Slide content
 */
@customElement("sp-carousel-slide")
export class SpCarouselSlideComponent extends LitElement {
  static override styles = unsafeCSS(styles);

  override render() {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "sp-carousel-slide": SpCarouselSlideComponent;
  }
}

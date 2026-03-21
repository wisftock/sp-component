import { html, nothing, type TemplateResult } from "lit";
import { repeat } from "lit/directives/repeat.js";
import type { SpCarouselComponent } from "./sp-carousel.js";

export function carouselTemplate(this: SpCarouselComponent): TemplateResult {
  const slides = this._getSlides();
  const total = slides.length;

  return html`
    <div
      class="sp-carousel"
      aria-roledescription="carousel"
      aria-label=${this.label || "carousel"}
      @mouseenter=${this._onMouseEnter}
      @mouseleave=${this._onMouseLeave}
    >
      <div
        class="sp-carousel-track-wrapper ${this._isDragging ? "sp-carousel-track-wrapper--dragging" : ""}"
        @touchstart=${this._onTouchStart}
        @touchend=${this._onTouchEnd}
        @mousedown=${this._onMouseDown}
      >
        <div
          class="sp-carousel-track"
          aria-live=${this.autoplay ? "off" : "polite"}
        >
          <slot @slotchange=${this._onSlotChange}></slot>
        </div>

        ${this.showArrows
          ? html`
              <button
                class="sp-carousel-arrow sp-carousel-arrow--prev"
                aria-label="Previous slide"
                ?disabled=${!this.loop && this.currentIndex === 0}
                @click=${(e: Event) => { if (this._isDragging) { e.stopImmediatePropagation(); return; } this._prev(); }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                  ${this.orientation === "vertical"
                    ? html`<polyline points="18 15 12 9 6 15"></polyline>`
                    : html`<polyline points="15 18 9 12 15 6"></polyline>`}
                </svg>
              </button>
              <button
                class="sp-carousel-arrow sp-carousel-arrow--next"
                aria-label="Next slide"
                ?disabled=${!this.loop && this.currentIndex === total - 1}
                @click=${(e: Event) => { if (this._isDragging) { e.stopImmediatePropagation(); return; } this._next(); }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                  ${this.orientation === "vertical"
                    ? html`<polyline points="6 9 12 15 18 9"></polyline>`
                    : html`<polyline points="9 18 15 12 9 6"></polyline>`}
                </svg>
              </button>
            `
          : nothing}
      </div>

      ${this.showDots && total > 1
        ? html`
            <div class="sp-carousel-dots" role="tablist" aria-label="Slide navigation">
              ${repeat(
                slides,
                (_, i) => i,
                (_, i) => html`
                  <button
                    class="sp-carousel-dot ${i === this.currentIndex ? "sp-carousel-dot--active" : ""}"
                    role="tab"
                    aria-label="Slide ${i + 1} of ${total}"
                    aria-selected=${i === this.currentIndex ? "true" : "false"}
                    tabindex=${i === this.currentIndex ? "0" : "-1"}
                    @click=${() => this._goTo(i)}
                  ></button>
                `,
              )}
            </div>
          `
        : nothing}
    </div>
  `;
}

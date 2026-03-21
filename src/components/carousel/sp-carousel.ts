import { LitElement, unsafeCSS } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import styles from "./sp-carousel.css?inline";
import { carouselTemplate } from "./sp-carousel.template.js";
import type { SpCarouselOrientation } from "./sp-carousel.types.js";

/**
 * Carousel/slider component for cycling through a set of slides.
 *
 * @element sp-carousel
 *
 * @prop {number}                currentIndex  - Index of the currently visible slide (default 0)
 * @prop {boolean}               loop          - Whether to wrap around at the ends
 * @prop {boolean}               autoplay      - Automatically advances slides
 * @prop {number}                interval      - Autoplay interval in ms (default 4000)
 * @prop {SpCarouselOrientation} orientation   - Slide direction: horizontal | vertical
 * @prop {boolean}               showDots      - Show dot indicators
 * @prop {boolean}               showArrows    - Show prev/next arrow buttons
 * @prop {number}                slidesPerView - How many slides are visible at once (default 1)
 * @prop {string}                label         - Accessible label for the carousel region
 *
 * @fires {CustomEvent<{ index: number }>} sp-slide-change - Emitted when the active slide changes
 *
 * @slot - sp-carousel-slide elements
 */
@customElement("sp-carousel")
export class SpCarouselComponent extends LitElement {
  static override styles = unsafeCSS(styles);

  @property({ type: Number, attribute: "current-index", reflect: true })
  currentIndex = 0;

  @property({ type: Boolean, reflect: true })
  loop = false;

  @property({ type: Boolean, reflect: true })
  autoplay = false;

  @property({ type: Number })
  interval = 4000;

  @property({ type: String, reflect: true })
  orientation: SpCarouselOrientation = "horizontal";

  @property({ type: Boolean, attribute: "show-dots", reflect: true })
  showDots = true;

  @property({ type: Boolean, attribute: "show-arrows", reflect: true })
  showArrows = true;

  @property({ type: Number, attribute: "slides-per-view" })
  slidesPerView = 1;

  @property({ type: String })
  label = "";

  @state()
  private _slideCount = 0;

  private _autoplayTimer: ReturnType<typeof setInterval> | null = null;
  private _touchStartX = 0;
  private _touchStartY = 0;

  override render() {
    return carouselTemplate.call(this);
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.addEventListener("keydown", this._handleKeydown);
    if (this.autoplay) this._startAutoplay();
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener("keydown", this._handleKeydown);
    this._stopAutoplay();
  }

  override updated(changed: Map<string, unknown>): void {
    if (changed.has("autoplay")) {
      this.autoplay ? this._startAutoplay() : this._stopAutoplay();
    }
    if (changed.has("currentIndex") || changed.has("slidesPerView")) {
      this._syncSlides();
    }
  }

  _getSlides(): Element[] {
    return Array.from(this.querySelectorAll("sp-carousel-slide"));
  }

  _onSlotChange(): void {
    this._slideCount = this._getSlides().length;
    this._syncSlides();
  }

  private _syncSlides(): void {
    const slides = this._getSlides();
    slides.forEach((slide, i) => {
      const isActive = i === this.currentIndex;
      const isVisible =
        i >= this.currentIndex && i < this.currentIndex + this.slidesPerView;

      slide.setAttribute("aria-hidden", isVisible ? "false" : "true");
      if (isActive) {
        slide.setAttribute("active", "");
      } else {
        slide.removeAttribute("active");
      }

      const offset =
        this.orientation === "horizontal"
          ? `translateX(${(i - this.currentIndex) * (100 / this.slidesPerView)}%)`
          : `translateY(${(i - this.currentIndex) * (100 / this.slidesPerView)}%)`;

      (slide as HTMLElement).style.transform = offset;
    });
  }

  _goTo(index: number): void {
    const slides = this._getSlides();
    const total = slides.length;
    if (total === 0) return;

    let next = index;
    if (this.loop) {
      next = ((index % total) + total) % total;
    } else {
      next = Math.max(0, Math.min(index, total - this.slidesPerView));
    }

    if (next === this.currentIndex) return;
    this.currentIndex = next;
    this.dispatchEvent(
      new CustomEvent("sp-slide-change", {
        detail: { index: this.currentIndex },
        bubbles: true,
        composed: true,
      }),
    );
  }

  _next(): void {
    this._goTo(this.currentIndex + 1);
  }

  _prev(): void {
    this._goTo(this.currentIndex - 1);
  }

  private _startAutoplay(): void {
    this._stopAutoplay();
    this._autoplayTimer = setInterval(() => this._next(), this.interval);
  }

  private _stopAutoplay(): void {
    if (this._autoplayTimer !== null) {
      clearInterval(this._autoplayTimer);
      this._autoplayTimer = null;
    }
  }

  private readonly _handleKeydown = (e: KeyboardEvent): void => {
    if (this.orientation === "horizontal") {
      if (e.key === "ArrowRight") { e.preventDefault(); this._next(); }
      else if (e.key === "ArrowLeft") { e.preventDefault(); this._prev(); }
    } else {
      if (e.key === "ArrowDown") { e.preventDefault(); this._next(); }
      else if (e.key === "ArrowUp") { e.preventDefault(); this._prev(); }
    }
    if (e.key === "Home") { e.preventDefault(); this._goTo(0); }
    if (e.key === "End") { e.preventDefault(); this._goTo(this._getSlides().length - 1); }
  };

  readonly _onTouchStart = (e: TouchEvent): void => {
    this._touchStartX = e.touches[0]?.clientX ?? 0;
    this._touchStartY = e.touches[0]?.clientY ?? 0;
  };

  readonly _onTouchEnd = (e: TouchEvent): void => {
    const dx = (e.changedTouches[0]?.clientX ?? 0) - this._touchStartX;
    const dy = (e.changedTouches[0]?.clientY ?? 0) - this._touchStartY;
    const threshold = 40;

    if (this.orientation === "horizontal" && Math.abs(dx) > threshold) {
      dx < 0 ? this._next() : this._prev();
    } else if (this.orientation === "vertical" && Math.abs(dy) > threshold) {
      dy < 0 ? this._next() : this._prev();
    }
  };
}

declare global {
  interface HTMLElementTagNameMap {
    "sp-carousel": SpCarouselComponent;
  }
}

import { LitElement, unsafeCSS } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import styles from "./sp-scroll-area.css?inline";
import { scrollAreaTemplate } from "./sp-scroll-area.template.js";
import type {
  SpScrollAreaOrientation,
  SpScrollAreaScrollbar,
} from "./sp-scroll-area.types.js";

/**
 * Custom scroll area with styled scrollbars.
 *
 * @element sp-scroll-area
 *
 * @prop {SpScrollAreaOrientation} orientation   - "vertical" | "horizontal" | "both"
 * @prop {SpScrollAreaScrollbar}   scrollbar     - "auto" | "always" | "never"
 * @prop {string}                  maxHeight     - CSS max-height value
 * @prop {string}                  maxWidth      - CSS max-width value
 * @prop {number}                  hideDelay     - Delay in ms before auto-hiding scrollbar (default 1000)
 * @prop {boolean}                 smoothScroll  - Enable smooth scroll behaviour
 *
 * @fires {CustomEvent<{ scrollTop: number; scrollLeft: number }>} sp-scroll - Emitted on scroll
 *
 * @slot - Scrollable content
 */
@customElement("sp-scroll-area")
export class SpScrollAreaComponent extends LitElement {
  static override styles = unsafeCSS(styles);

  @property({ type: String, reflect: true })
  orientation: SpScrollAreaOrientation = "vertical";

  @property({ type: String, reflect: true })
  scrollbar: SpScrollAreaScrollbar = "auto";

  @property({ type: String, attribute: "max-height" })
  maxHeight = "";

  @property({ type: String, attribute: "max-width" })
  maxWidth = "";

  @property({ type: Number, attribute: "hide-delay" })
  hideDelay = 1000;

  @property({ type: Boolean, attribute: "smooth-scroll" })
  smoothScroll = false;

  @state()
  _thumbHeight = 100;

  @state()
  _thumbTop = 0;

  @state()
  _thumbWidth = 100;

  @state()
  _thumbLeft = 0;

  @state()
  _scrolling = false;

  private _scrollTimeout: ReturnType<typeof setTimeout> | null = null;
  private _resizeObserver: ResizeObserver | null = null;
  private _dragStartY = 0;
  private _dragStartScrollTop = 0;
  private _dragStartX = 0;
  private _dragStartScrollLeft = 0;
  private _dragAxis: "vertical" | "horizontal" = "vertical";
  private _activeDragThumb: HTMLElement | null = null;

  private _getViewport(): HTMLElement | null {
    return (
      this.shadowRoot?.querySelector<HTMLElement>(
        ".sp-scroll-area-viewport",
      ) ?? null
    );
  }

  _onScroll = (): void => {
    this._updateThumbs();
    this._scrolling = true;
    if (this._scrollTimeout !== null) {
      clearTimeout(this._scrollTimeout);
    }
    this._scrollTimeout = setTimeout(() => {
      this._scrolling = false;
    }, this.hideDelay);

    const viewport = this._getViewport();
    if (viewport) {
      this.dispatchEvent(
        new CustomEvent("sp-scroll", {
          detail: {
            scrollTop: viewport.scrollTop,
            scrollLeft: viewport.scrollLeft,
          },
          bubbles: true,
          composed: true,
        }),
      );
    }
  };

  private _updateThumbs(): void {
    const viewport = this._getViewport();
    if (!viewport) return;

    // Vertical
    const { scrollTop, scrollHeight, clientHeight, scrollLeft, scrollWidth, clientWidth } = viewport;

    if (scrollHeight > 0) {
      this._thumbHeight = Math.max(
        10,
        (clientHeight / scrollHeight) * 100,
      );
      this._thumbTop =
        scrollHeight > clientHeight
          ? (scrollTop / (scrollHeight - clientHeight)) *
            (100 - this._thumbHeight)
          : 0;
    }

    if (scrollWidth > 0) {
      this._thumbWidth = Math.max(10, (clientWidth / scrollWidth) * 100);
      this._thumbLeft =
        scrollWidth > clientWidth
          ? (scrollLeft / (scrollWidth - clientWidth)) *
            (100 - this._thumbWidth)
          : 0;
    }
  }

  _startThumbDrag = (e: PointerEvent): void => {
    e.preventDefault();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);

    const isVertical = (e.target as HTMLElement).classList.contains(
      "sp-scroll-area-thumb--vertical",
    );
    this._dragAxis = isVertical ? "vertical" : "horizontal";

    const viewport = this._getViewport();
    if (!viewport) return;

    this._dragStartY = e.clientY;
    this._dragStartScrollTop = viewport.scrollTop;
    this._dragStartX = e.clientX;
    this._dragStartScrollLeft = viewport.scrollLeft;

    const thumb = e.target as HTMLElement;
    this._activeDragThumb = thumb;
    thumb.addEventListener("pointermove", this._onThumbMove);
    thumb.addEventListener("pointerup", this._onThumbUp, { once: true });
  };

  private _onThumbMove = (e: PointerEvent): void => {
    const viewport = this._getViewport();
    if (!viewport) return;

    if (this._dragAxis === "vertical") {
      const deltaY = e.clientY - this._dragStartY;
      const { scrollHeight, clientHeight } = viewport;
      const scrollRatio = deltaY / (clientHeight * (this._thumbHeight / 100));
      viewport.scrollTop =
        this._dragStartScrollTop + scrollRatio * (scrollHeight - clientHeight);
    } else {
      const deltaX = e.clientX - this._dragStartX;
      const { scrollWidth, clientWidth } = viewport;
      const scrollRatio = deltaX / (clientWidth * (this._thumbWidth / 100));
      viewport.scrollLeft =
        this._dragStartScrollLeft + scrollRatio * (scrollWidth - clientWidth);
    }
  };

  private _onThumbUp = (e: PointerEvent): void => {
    (e.target as HTMLElement).removeEventListener("pointermove", this._onThumbMove);
    this._activeDragThumb = null;
  };

  override firstUpdated() {
    const viewport = this._getViewport();
    if (!viewport) return;

    if (typeof ResizeObserver !== "undefined") {
      this._resizeObserver = new ResizeObserver(() => {
        this._updateThumbs();
      });
      this._resizeObserver.observe(viewport);
    }
    this._updateThumbs();
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this._resizeObserver?.disconnect();
    if (this._scrollTimeout !== null) clearTimeout(this._scrollTimeout);
    if (this._activeDragThumb) {
      this._activeDragThumb.removeEventListener("pointermove", this._onThumbMove);
      this._activeDragThumb = null;
    }
  }

  override render() {
    return scrollAreaTemplate.call(this);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "sp-scroll-area": SpScrollAreaComponent;
  }
}

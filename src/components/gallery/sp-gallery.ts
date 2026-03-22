import { LitElement, unsafeCSS } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import styles from "./sp-gallery.css?inline";
import { galleryTemplate } from "./sp-gallery.template.js";
import type { SpGalleryFit, SpGalleryItem, SpGalleryLayout } from "./sp-gallery.types.js";

/**
 * Gallery component with grid/masonry layout and built-in lightbox.
 *
 * @element sp-gallery
 *
 * @prop {SpGalleryItem[]}  items           - Array of image items
 * @prop {number}           columns         - Number of grid columns (default 3)
 * @prop {number}           gap             - Gap between items in px (default 8)
 * @prop {SpGalleryLayout}  layout          - "grid" | "masonry"
 * @prop {SpGalleryFit}     fit             - "cover" | "contain"
 * @prop {string}           aspectRatio     - Thumbnail aspect ratio e.g. "4/3" (grid only)
 * @prop {boolean}          lightbox        - Enable lightbox on click
 * @prop {boolean}          selectable      - Enable multi-selection mode
 * @prop {number[]}         selectedIndices - Currently selected indices
 * @prop {boolean}          loading         - Show skeleton placeholders
 * @prop {number}           skeletonCount   - Number of skeleton tiles when loading
 *
 * @fires {CustomEvent<{ index: number; item: SpGalleryItem }>}   sp-item-click  - Fired when an item is clicked
 * @fires {CustomEvent<{ indices: number[] }>}                    sp-selection-change - Fired when selection changes
 * @fires {CustomEvent<{ index: number }>}                        sp-lightbox-open  - Lightbox opened
 * @fires {CustomEvent<{ index: number }>}                        sp-lightbox-close - Lightbox closed
 */
@customElement("sp-gallery")
export class SpGalleryComponent extends LitElement {
  static override styles = unsafeCSS(styles);

  @property({ type: Array })
  items: SpGalleryItem[] = [];

  @property({ type: Number })
  columns = 3;

  @property({ type: Number })
  gap = 8;

  @property({ type: String })
  layout: SpGalleryLayout = "grid";

  @property({ type: String })
  fit: SpGalleryFit = "cover";

  @property({ type: String, attribute: "aspect-ratio" })
  aspectRatio = "4/3";

  @property({ type: Boolean })
  lightbox = true;

  @property({ type: Boolean })
  selectable = false;

  @property({ type: Array, attribute: "selected-indices" })
  selectedIndices: number[] = [];

  @property({ type: Boolean })
  loading = false;

  @property({ type: Number, attribute: "skeleton-count" })
  skeletonCount = 9;

  // ---- Lightbox state ----

  @state()
  _lightboxOpen = false;

  @state()
  _lightboxIndex = 0;

  @state()
  _lightboxLoaded = false;

  // ---- Bound handlers ----

  private _boundKeydown = (e: KeyboardEvent) => this._onLightboxKey(e);

  override render() {
    return galleryTemplate.call(this);
  }

  // ---- Item click ----

  _onItemClick(index: number): void {
    const item = this.items[index];
    if (!item) return;

    this.dispatchEvent(new CustomEvent("sp-item-click", {
      detail: { index, item },
      bubbles: true,
      composed: true,
    }));

    if (this.selectable) {
      this._toggleSelection(index);
      return;
    }

    if (this.lightbox) {
      this._openLightbox(index);
    }
  }

  // ---- Selection ----

  _toggleSelection(index: number): void {
    const next = this.selectedIndices.includes(index)
      ? this.selectedIndices.filter((i) => i !== index)
      : [...this.selectedIndices, index];

    this.selectedIndices = next;
    this.dispatchEvent(new CustomEvent("sp-selection-change", {
      detail: { indices: next },
      bubbles: true,
      composed: true,
    }));
  }

  clearSelection(): void {
    this.selectedIndices = [];
    this.dispatchEvent(new CustomEvent("sp-selection-change", {
      detail: { indices: [] },
      bubbles: true,
      composed: true,
    }));
  }

  selectAll(): void {
    const indices = this.items.map((_, i) => i);
    this.selectedIndices = indices;
    this.dispatchEvent(new CustomEvent("sp-selection-change", {
      detail: { indices },
      bubbles: true,
      composed: true,
    }));
  }

  // ---- Lightbox ----

  _openLightbox(index: number): void {
    this._lightboxIndex = index;
    this._lightboxLoaded = false;
    this._lightboxOpen = true;
    window.addEventListener("keydown", this._boundKeydown);
    this.dispatchEvent(new CustomEvent("sp-lightbox-open", {
      detail: { index },
      bubbles: true,
      composed: true,
    }));
  }

  _closeLightbox(): void {
    this._lightboxOpen = false;
    window.removeEventListener("keydown", this._boundKeydown);
    this.dispatchEvent(new CustomEvent("sp-lightbox-close", {
      detail: { index: this._lightboxIndex },
      bubbles: true,
      composed: true,
    }));
  }

  _lightboxPrev(): void {
    if (this.items.length === 0) return;
    this._lightboxLoaded = false;
    this._lightboxIndex = (this._lightboxIndex - 1 + this.items.length) % this.items.length;
  }

  _lightboxNext(): void {
    if (this.items.length === 0) return;
    this._lightboxLoaded = false;
    this._lightboxIndex = (this._lightboxIndex + 1) % this.items.length;
  }

  private _onLightboxKey(e: KeyboardEvent): void {
    if (!this._lightboxOpen) return;
    if (e.key === "Escape") { e.preventDefault(); this._closeLightbox(); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); this._lightboxPrev(); }
    else if (e.key === "ArrowRight") { e.preventDefault(); this._lightboxNext(); }
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    window.removeEventListener("keydown", this._boundKeydown);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "sp-gallery": SpGalleryComponent;
  }
}

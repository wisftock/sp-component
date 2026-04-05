import { html, nothing } from "lit";
import { repeat } from "lit/directives/repeat.js";
import { styleMap } from "lit/directives/style-map.js";
import { SpConfig } from "../../config.js";
import type { SpGalleryComponent } from "./sp-gallery.js";

function iconClose() {
  return html`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true" width="20" height="20">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>`;
}

function iconChevronLeft() {
  return html`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true" width="28" height="28">
    <polyline points="15 18 9 12 15 6"></polyline>
  </svg>`;
}

function iconChevronRight() {
  return html`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true" width="28" height="28">
    <polyline points="9 18 15 12 9 6"></polyline>
  </svg>`;
}

function iconCheck() {
  return html`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" aria-hidden="true" width="14" height="14">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>`;
}

function renderSkeleton(host: SpGalleryComponent) {
  const gridStyle = styleMap({
    "--sp-gallery-cols": String(host.columns),
    "--sp-gallery-gap": `${host.gap}px`,
  });

  return html`
    <div class="sp-gallery sp-gallery--grid" style=${gridStyle}>
      ${Array.from({ length: host.skeletonCount }, (_, i) => html`
        <div
          class="sp-gallery-item sp-gallery-item--skeleton"
          style=${styleMap({ "--sp-gallery-ratio": host.aspectRatio })}
          aria-hidden="true"
          key=${i}
        ></div>
      `)}
    </div>
  `;
}

function renderLightbox(host: SpGalleryComponent) {
  if (!host._lightboxOpen) return nothing;

  const item = host.items[host._lightboxIndex];
  if (!item) return nothing;

  const total = host.items.length;
  const current = host._lightboxIndex + 1;

  return html`
    <div
      class="sp-gallery-lightbox"
      role="dialog"
      aria-modal="true"
      aria-label=${SpConfig.locale.gallery.imageViewerLabel}
      @click=${(e: MouseEvent) => { if (e.target === e.currentTarget) host._closeLightbox(); }}
    >
      <!-- Close -->
      <button
        class="sp-gallery-lightbox-close"
        aria-label=${SpConfig.locale.gallery.closeLightboxLabel}
        @click=${() => host._closeLightbox()}
      >${iconClose()}</button>

      <!-- Counter -->
      <div class="sp-gallery-lightbox-counter" aria-live="polite">
        ${current} / ${total}
      </div>

      <!-- Prev -->
      ${total > 1 ? html`
        <button
          class="sp-gallery-lightbox-nav sp-gallery-lightbox-nav--prev"
          aria-label=${SpConfig.locale.gallery.prevImageLabel}
          @click=${() => host._lightboxPrev()}
        >${iconChevronLeft()}</button>
      ` : nothing}

      <!-- Image -->
      <div class="sp-gallery-lightbox-stage">
        ${!host._lightboxLoaded ? html`<div class="sp-gallery-lightbox-spinner" aria-hidden="true"></div>` : nothing}
        <img
          class="sp-gallery-lightbox-img ${host._lightboxLoaded ? "sp-gallery-lightbox-img--loaded" : ""}"
          src=${item.src}
          alt=${item.alt ?? ""}
          @load=${() => { host._lightboxLoaded = true; }}
        />
        ${item.caption ? html`<p class="sp-gallery-lightbox-caption">${item.caption}</p>` : nothing}
      </div>

      <!-- Next -->
      ${total > 1 ? html`
        <button
          class="sp-gallery-lightbox-nav sp-gallery-lightbox-nav--next"
          aria-label=${SpConfig.locale.gallery.nextImageLabel}
          @click=${() => host._lightboxNext()}
        >${iconChevronRight()}</button>
      ` : nothing}

      <!-- Dot strip -->
      ${total > 1 && total <= 20 ? html`
        <div class="sp-gallery-lightbox-dots" role="tablist" aria-label=${SpConfig.locale.gallery.imageNavLabel}>
          ${host.items.map((_, i) => html`
            <button
              class="sp-gallery-lightbox-dot ${i === host._lightboxIndex ? "sp-gallery-lightbox-dot--active" : ""}"
              role="tab"
              aria-selected=${i === host._lightboxIndex ? "true" : "false"}
              aria-label=${`Image ${i + 1}`}
              @click=${() => { host._lightboxLoaded = false; host._lightboxIndex = i; }}
            ></button>
          `)}
        </div>
      ` : nothing}
    </div>
  `;
}

function renderGrid(host: SpGalleryComponent) {
  const gridStyle = styleMap({
    "--sp-gallery-cols": String(host.columns),
    "--sp-gallery-gap": `${host.gap}px`,
  });

  return html`
    <div
      class="sp-gallery sp-gallery--${host.layout}"
      style=${gridStyle}
      role="list"
      aria-label=${SpConfig.locale.gallery.galleryLabel}
    >
      ${repeat(
        host.items,
        (item, i) => `${i}-${item.src}`,
        (item, i) => {
          const isSelected = host.selectedIndices.includes(i);
          const thumb = item.thumb ?? item.src;

          const itemStyle = styleMap({
            "--sp-gallery-ratio": host.layout === "grid" ? host.aspectRatio : undefined,
          });

          return html`
            <div
              class="sp-gallery-item
                ${isSelected ? "sp-gallery-item--selected" : ""}
                ${host.selectable ? "sp-gallery-item--selectable" : ""}
                ${host.lightbox && !host.selectable ? "sp-gallery-item--zoomable" : ""}"
              role="listitem"
              style=${itemStyle}
              tabindex="0"
              aria-label=${item.alt ?? `Image ${i + 1}`}
              aria-pressed=${host.selectable ? (isSelected ? "true" : "false") : nothing}
              @click=${() => host._onItemClick(i)}
              @keydown=${(e: KeyboardEvent) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); host._onItemClick(i); } }}
            >
              <img
                class="sp-gallery-img"
                src=${thumb}
                alt=${item.alt ?? ""}
                loading="lazy"
                style=${styleMap({ objectFit: host.fit })}
              />
              ${host.selectable ? html`
                <div class="sp-gallery-item-checkbox" aria-hidden="true">
                  ${isSelected ? iconCheck() : nothing}
                </div>
              ` : nothing}
              ${item.caption ? html`
                <div class="sp-gallery-item-caption">${item.caption}</div>
              ` : nothing}
              ${host.lightbox && !host.selectable ? html`
                <div class="sp-gallery-item-overlay" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="24" height="24">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    <line x1="11" y1="8" x2="11" y2="14"></line>
                    <line x1="8" y1="11" x2="14" y2="11"></line>
                  </svg>
                </div>
              ` : nothing}
            </div>
          `;
        },
      )}
    </div>
  `;
}

export function galleryTemplate(this: SpGalleryComponent) {
  if (this.loading) return renderSkeleton(this);
  if (this.items.length === 0) {
    return html`
      <div class="sp-gallery-empty" role="status">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="40" height="40" aria-hidden="true">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          <circle cx="8.5" cy="8.5" r="1.5"></circle>
          <polyline points="21 15 16 10 5 21"></polyline>
        </svg>
        <span>No images</span>
      </div>
    `;
  }

  return html`
    ${renderGrid(this)}
    ${renderLightbox(this)}
  `;
}

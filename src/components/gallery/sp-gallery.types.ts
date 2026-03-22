export interface SpGalleryItem {
  src: string;
  thumb?: string;       // thumbnail URL (falls back to src)
  alt?: string;
  caption?: string;
}

export type SpGalleryLayout = "grid" | "masonry";
export type SpGalleryFit = "cover" | "contain";

export interface SpGalleryProps {
  items: SpGalleryItem[];
  columns: number;
  gap: number;
  layout: SpGalleryLayout;
  fit: SpGalleryFit;
  aspectRatio: string;
  lightbox: boolean;
  selectable: boolean;
  selectedIndices: number[];
  loading: boolean;
  skeletonCount: number;
}

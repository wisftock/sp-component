export type SpImageFit = "cover" | "contain" | "fill" | "none";

export interface SpImageProps {
  src: string;
  alt: string;
  width: string;
  height: string;
  fit: SpImageFit;
  ratio: string;
  lazy: boolean;
  fallback: string;
  rounded: boolean;
}

export type SpAvatarShape = "circle" | "square";

export type SpAvatarSize = "sm" | "md" | "lg" | "xl";

export interface SpAvatarProps {
  src: string;
  alt: string;
  initials: string;
  shape: SpAvatarShape;
  size: SpAvatarSize;
}

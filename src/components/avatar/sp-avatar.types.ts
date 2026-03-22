export type SpAvatarShape = "circle" | "square";

export type SpAvatarSize = "sm" | "md" | "lg" | "xl";

export type SpAvatarStatus = "online" | "offline" | "away" | "busy";

export interface SpAvatarProps {
  src: string;
  alt: string;
  initials: string;
  shape: SpAvatarShape;
  size: SpAvatarSize;
  status: SpAvatarStatus | undefined;
  loading: boolean;
}

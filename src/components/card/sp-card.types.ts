export type SpCardShadow = "none" | "sm" | "md" | "lg";

export interface SpCardProps {
  shadow: SpCardShadow;
  bordered: boolean;
  padding: string;
  clickable: boolean;
  loading: boolean;
  href: string;
}

export type SpBadgeVariant = "primary" | "secondary" | "success" | "warning" | "danger" | "neutral";

export interface SpBadgeProps {
  variant: SpBadgeVariant;
  pill: boolean;
  pulsing: boolean;
}

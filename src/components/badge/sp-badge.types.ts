export type SpBadgeVariant = "primary" | "secondary" | "success" | "warning" | "danger" | "neutral" | "purple" | "teal" | "orange" | "cyan";

export interface SpBadgeProps {
  variant: SpBadgeVariant;
  pill: boolean;
  pulsing: boolean;
  max: number;
  removable: boolean;
}

export type SpTagVariant = "primary" | "secondary" | "success" | "warning" | "danger" | "neutral";

export type SpTagSize = "sm" | "md" | "lg";

export interface SpTagProps {
  variant: SpTagVariant;
  size: SpTagSize;
  removable: boolean;
  disabled: boolean;
}

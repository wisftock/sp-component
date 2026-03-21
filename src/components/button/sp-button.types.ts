export type SpButtonVariant = "primary" | "secondary" | "ghost" | "destructive";

export type SpButtonSize = "sm" | "md" | "lg";

export type SpButtonType = "button" | "submit" | "reset";

export interface SpButtonProps {
  variant: SpButtonVariant;
  size: SpButtonSize;
  disabled: boolean;
  label: string;
  type: SpButtonType;
}

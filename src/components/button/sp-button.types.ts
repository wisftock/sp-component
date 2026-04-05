export type SpButtonVariant = "primary" | "secondary" | "ghost" | "destructive" | "outline" | "soft" | "link";

export type SpButtonSize = "sm" | "md" | "lg";

export type SpButtonType = "button" | "submit" | "reset";

export interface SpButtonProps {
  variant: SpButtonVariant;
  size: SpButtonSize;
  disabled: boolean;
  loading: boolean;
  fullWidth: boolean;
  label: string;
  type: SpButtonType;
  href: string;
  target: string;
  name: string;
  value: string;
}

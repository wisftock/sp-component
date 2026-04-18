export type SpSpinnerSize = "sm" | "md" | "lg" | "xl";
export type SpSpinnerVariant = "arc" | "dots" | "bars" | "pulse" | "ring";

export interface SpSpinnerProps {
  size: SpSpinnerSize;
  variant: SpSpinnerVariant;
  label: string;
}

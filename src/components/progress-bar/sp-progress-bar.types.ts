export type SpProgressBarVariant = "primary" | "success" | "warning" | "danger";

export interface SpProgressBarProps {
  value: number;
  max: number;
  variant: SpProgressBarVariant;
  indeterminate: boolean;
  label: string;
  showValue: boolean;
  striped: boolean;
  animated: boolean;
  height?: number;
}

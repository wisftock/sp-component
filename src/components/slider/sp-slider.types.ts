export type SpSliderSize = "sm" | "md" | "lg";

export interface SpSliderProps {
  value: number;
  min: number;
  max: number;
  step: number;
  disabled: boolean;
  size: SpSliderSize;
  label: string;
  showValue: boolean;
  error: string;
  hint: string;
}

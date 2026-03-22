export type SpSliderSize = "sm" | "md" | "lg";

export interface SpSliderMark {
  value: number;
  label?: string;
}

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
  range: boolean;
  marks: SpSliderMark[];
}

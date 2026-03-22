export type SpTimePickerFormat = "12" | "24";
export type SpTimePickerPeriod = "AM" | "PM";
export type SpTimePickerSize = "sm" | "md" | "lg";

export interface SpTimePickerProps {
  value: string;
  format: SpTimePickerFormat;
  step: number;
  showSeconds: boolean;
  min: string;
  max: string;
  disabled: boolean;
  readonly: boolean;
  required: boolean;
  name: string;
  placeholder: string;
  label: string;
  hint: string;
  error: string;
  size: SpTimePickerSize;
}

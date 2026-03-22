export type SpColorPickerFormat = "hex" | "rgb" | "hsl";

export interface SpColorPickerProps {
  value: string;
  format: SpColorPickerFormat;
  disabled: boolean;
  readonly: boolean;
  name: string;
  label: string;
  hint: string;
  error: string;
  showAlpha: boolean;
  swatches: string;
}

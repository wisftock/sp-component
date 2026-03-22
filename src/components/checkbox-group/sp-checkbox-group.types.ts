export type SpCheckboxGroupOrientation = "horizontal" | "vertical";

export interface SpCheckboxGroupProps {
  values: string;
  name: string;
  disabled: boolean;
  required: boolean;
  orientation: SpCheckboxGroupOrientation;
  label: string;
  hint: string;
  error: string;
  min: number;
  max: number;
}

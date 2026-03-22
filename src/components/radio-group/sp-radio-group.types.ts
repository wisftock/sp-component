export type SpRadioGroupOrientation = "horizontal" | "vertical";

export interface SpRadioGroupProps {
  value: string;
  name: string;
  disabled: boolean;
  required: boolean;
  orientation: SpRadioGroupOrientation;
  label: string;
  hint: string;
  error: string;
}

export type SpRadioGroupOrientation = "horizontal" | "vertical";

export interface SpRadioGroupProps {
  name: string;
  value: string;
  disabled: boolean;
  required: boolean;
  orientation: SpRadioGroupOrientation;
  label: string;
  error: string;
  hint: string;
}

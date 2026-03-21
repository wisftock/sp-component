export type SpRadioGroupOrientation = "horizontal" | "vertical";

export interface SpRadioGroupProps {
  name: string;
  value: string;
  disabled: boolean;
  orientation: SpRadioGroupOrientation;
  label: string;
  error: string;
  hint: string;
}

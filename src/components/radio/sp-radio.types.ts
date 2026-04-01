export type SpRadioSize = "sm" | "md" | "lg";

export interface SpRadioProps {
  value: string;
  checked: boolean;
  disabled: boolean;
  required: boolean;
  size: SpRadioSize;
  label: string;
}

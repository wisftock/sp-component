export type SpCheckboxSize = "sm" | "md" | "lg";

export interface SpCheckboxProps {
  checked: boolean;
  indeterminate: boolean;
  disabled: boolean;
  required: boolean;
  name: string;
  value: string;
  size: SpCheckboxSize;
  label: string;
  error: string;
  hint: string;
}

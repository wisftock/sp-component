export type SpSwitchSize = "sm" | "md" | "lg";

export interface SpSwitchProps {
  checked: boolean;
  disabled: boolean;
  required: boolean;
  name: string;
  value: string;
  size: SpSwitchSize;
  label: string;
  hint: string;
}

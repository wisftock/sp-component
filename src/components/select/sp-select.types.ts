export type SpSelectSize = "sm" | "md" | "lg";

export interface SpSelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SpSelectProps {
  value: string;
  placeholder: string;
  disabled: boolean;
  required: boolean;
  name: string;
  size: SpSelectSize;
  multiple: boolean;
  options: SpSelectOption[];
  error: string;
  hint: string;
  label: string;
}

export type SpComboboxSize = "sm" | "md" | "lg";

export interface SpComboboxOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SpComboboxProps {
  value: string;
  options: SpComboboxOption[];
  placeholder: string;
  disabled: boolean;
  required: boolean;
  name: string;
  size: SpComboboxSize;
  clearable: boolean;
  error: string;
  hint: string;
  label: string;
  noResultsText: string;
}

export type SpAutocompleteSize = "sm" | "md" | "lg";
export type SpAutocompleteFilterMode = "contains" | "startsWith" | "none";

export interface SpAutocompleteOption {
  value: string;
  label: string;
  description?: string;
  group?: string;
  disabled?: boolean;
}

export interface SpAutocompleteProps {
  value: string;
  values: string[];
  options: SpAutocompleteOption[];
  placeholder: string;
  disabled: boolean;
  required: boolean;
  name: string;
  size: SpAutocompleteSize;
  clearable: boolean;
  multiple: boolean;
  maxSelections: number;
  filterMode: SpAutocompleteFilterMode;
  loading: boolean;
  creatable: boolean;
  createText: string;
  debounce: number;
  error: string;
  hint: string;
  label: string;
  noResultsText: string;
}

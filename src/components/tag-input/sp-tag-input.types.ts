export type SpTagInputSize = "sm" | "md" | "lg";

export interface SpTagInputProps {
  values: string;
  placeholder: string;
  disabled: boolean;
  readonly: boolean;
  required: boolean;
  name: string;
  max: number;
  allowDuplicates: boolean;
  delimiter: string;
  label: string;
  hint: string;
  error: string;
  size: SpTagInputSize;
}

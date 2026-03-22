export type SpInputType = "text" | "email" | "password" | "number" | "search" | "tel" | "url";

export type SpInputSize = "sm" | "md" | "lg";

export type SpInputMode = "text" | "numeric" | "decimal" | "email" | "tel" | "url" | "search";

export interface SpInputProps {
  type: SpInputType;
  value: string;
  placeholder: string;
  disabled: boolean;
  readonly: boolean;
  required: boolean;
  name: string;
  size: SpInputSize;
  clearable: boolean;
  maxlength: number;
  minlength: number;
  error: string;
  hint: string;
  label: string;
}

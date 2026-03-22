export type SpNumberInputSize = "sm" | "md" | "lg";

export interface SpNumberInputProps {
  value: number;
  min: number;
  max: number;
  step: number;
  disabled: boolean;
  readonly: boolean;
  required: boolean;
  name: string;
  size: SpNumberInputSize;
  label: string;
  hint: string;
  error: string;
  placeholder: string;
  prefix: string;
  suffix: string;
  fullWidth: boolean;
  formatter: ((value: number) => string) | null;
}

export interface SpNumberInputEventDetail {
  value: number;
}

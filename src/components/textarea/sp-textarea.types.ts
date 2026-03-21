export type SpTextareaResize = "none" | "vertical" | "horizontal" | "both";

export interface SpTextareaProps {
  value: string;
  placeholder: string;
  disabled: boolean;
  readonly: boolean;
  required: boolean;
  name: string;
  rows: number;
  maxlength: number;
  resize: SpTextareaResize;
  error: string;
  hint: string;
  label: string;
}

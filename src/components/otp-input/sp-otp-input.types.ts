export type SpOtpInputType = "text" | "number" | "password";

export interface SpOtpInputProps {
  length: number;
  value: string;
  disabled: boolean;
  invalid: boolean;
  required: boolean;
  inputType: SpOtpInputType;
  placeholder: string;
  label: string;
  size: "sm" | "md" | "lg";
}

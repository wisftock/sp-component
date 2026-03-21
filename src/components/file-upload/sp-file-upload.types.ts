export type SpFileUploadVariant = "default" | "compact";

export interface SpFileUploadProps {
  accept: string;
  multiple: boolean;
  disabled: boolean;
  maxSize: number;
  label: string;
  hint: string;
  error: string;
  variant: SpFileUploadVariant;
}

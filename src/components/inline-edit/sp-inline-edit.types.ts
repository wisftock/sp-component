export type SpInlineEditType = "text" | "number" | "email" | "url";

export interface SpInlineEditProps {
  value: string;
  placeholder: string;
  type: SpInlineEditType;
  disabled: boolean;
  readonly: boolean;
  required: boolean;
  name: string;
  maxlength: number;
  editing: boolean;
  emptyText: string;
}

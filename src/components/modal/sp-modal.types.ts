export type SpModalSize = "sm" | "md" | "lg" | "xl" | "full";

export interface SpModalProps {
  open: boolean;
  label: string;
  size: SpModalSize;
  closable: boolean;
  closeOnOverlay: boolean;
}

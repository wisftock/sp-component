export type SpToastVariant = "info" | "success" | "warning" | "error";

export type SpToastPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

export interface ToastItem {
  id: string;
  message: string;
  variant: SpToastVariant;
  duration: number; // ms, 0 = persistent
  title?: string;
  closable: boolean;
}

export interface SpToastStackProps {
  position: SpToastPosition;
  max: number;
}

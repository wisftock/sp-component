export type SpToastVariant = "info" | "success" | "warning" | "error" | "neutral";

export type SpToastPosition =
  | "top-right"
  | "top-left"
  | "bottom-right"
  | "bottom-left"
  | "top-center"
  | "bottom-center";

export interface SpToastProps {
  variant: SpToastVariant;
  message: string;
  duration: number;
  position: SpToastPosition;
  open: boolean;
  closable: boolean;
  action: string;
  actionHref: string;
  pauseOnHover: boolean;
}

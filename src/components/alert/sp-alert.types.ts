export type SpAlertVariant = "info" | "success" | "warning" | "error";

export interface SpAlertProps {
  variant: SpAlertVariant;
  title: string;
  dismissible: boolean;
  open: boolean;
}

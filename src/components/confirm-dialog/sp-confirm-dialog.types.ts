export type SpConfirmDialogVariant = "default" | "destructive";

export interface SpConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel: string;
  variant: SpConfirmDialogVariant;
  hideCancel: boolean;
}

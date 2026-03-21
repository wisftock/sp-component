export type SpDrawerPlacement = "left" | "right" | "top" | "bottom";

export interface SpDrawerProps {
  open: boolean;
  label: string;
  placement: SpDrawerPlacement;
  size: string;
  closable: boolean;
  closeOnOverlay: boolean;
}

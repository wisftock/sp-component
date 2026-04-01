export type SpDrawerPlacement = "left" | "right" | "top" | "bottom";
export type SpDrawerCloseReason = "escape" | "overlay" | "button" | "swipe";

export interface SpDrawerProps {
  open: boolean;
  label: string;
  placement: SpDrawerPlacement;
  size: string;
  closable: boolean;
  closeOnOverlay: boolean;
}

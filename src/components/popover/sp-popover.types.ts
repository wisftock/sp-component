export type SpPopoverPlacement = "top" | "bottom" | "left" | "right";

export interface SpPopoverProps {
  open: boolean;
  placement: SpPopoverPlacement;
  distance: number;
  arrow: boolean;
}

export type SpTooltipPlacement = "top" | "bottom" | "left" | "right";

export type SpTooltipTrigger = "hover" | "focus" | "click" | "manual";

export interface SpTooltipProps {
  content: string;
  placement: SpTooltipPlacement;
  trigger: SpTooltipTrigger;
  disabled: boolean;
  open: boolean;
  distance: number;
}

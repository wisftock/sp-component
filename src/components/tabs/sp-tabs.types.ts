export type SpTabsPlacement = "top" | "bottom" | "left" | "right";

export interface SpTabsProps {
  active: string;
  placement: SpTabsPlacement;
}

export interface SpTabProps {
  panel: string;
  disabled: boolean;
  active: boolean;
  icon?: string;
  badge?: string | number;
  closable?: boolean;
}

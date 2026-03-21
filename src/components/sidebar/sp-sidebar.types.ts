export type SpSidebarPlacement = "left" | "right";

export interface SpSidebarProps {
  open: boolean;
  placement: SpSidebarPlacement;
  width: string;
  collapsible: boolean;
  collapsed: boolean;
  bordered: boolean;
}

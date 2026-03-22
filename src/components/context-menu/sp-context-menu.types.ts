export type SpContextMenuTrigger = "contextmenu" | "click";

export interface SpContextMenuProps {
  disabled: boolean;
  trigger: SpContextMenuTrigger;
}

export type SpMenuPlacement = "bottom-start" | "bottom-end" | "top-start" | "top-end" | "right" | "left";

export interface SpMenuProps {
  placement: SpMenuPlacement;
  open: boolean;
}

export interface SpMenuItemProps {
  value: string;
  disabled: boolean;
  danger: boolean;
  divider: boolean;
  checked: boolean;
}

export interface SpMenuItem {
  label: string;
  value?: string;
  disabled?: boolean;
  danger?: boolean;
  divider?: boolean;
  checked?: boolean;
  children?: SpMenuItem[];
}

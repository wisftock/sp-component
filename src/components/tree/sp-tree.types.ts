export type SpTreeSelectionMode = "none" | "single" | "multiple";

export interface SpTreeProps {
  selectionMode: SpTreeSelectionMode;
  selectedValues: string;
}

export interface SpTreeItemProps {
  value: string;
  label: string;
  expanded: boolean;
  selected: boolean;
  disabled: boolean;
  icon: string;
  loading: boolean;
}

export type SpSegmentedControlSize = "sm" | "md" | "lg";

export interface SpSegmentedControlOption {
  value: string;
  label: string;
  disabled?: boolean;
  icon?: string;
}

export interface SpSegmentedControlProps {
  value: string;
  options: SpSegmentedControlOption[];
  disabled: boolean;
  required: boolean;
  name: string;
  size: SpSegmentedControlSize;
  fullWidth: boolean;
}

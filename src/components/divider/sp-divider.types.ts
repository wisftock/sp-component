export type SpDividerOrientation = "horizontal" | "vertical";

export type SpDividerVariant = "solid" | "dashed" | "dotted";

export interface SpDividerProps {
  orientation: SpDividerOrientation;
  variant: SpDividerVariant;
  label: string;
}

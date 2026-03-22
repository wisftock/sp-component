export type SpSplitPanelOrientation = "horizontal" | "vertical";

export interface SpSplitPanelProps {
  position: number;
  orientation: SpSplitPanelOrientation;
  min: number;
  max: number;
  snap: number;
  disabled: boolean;
}

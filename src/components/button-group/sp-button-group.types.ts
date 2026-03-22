export type SpButtonGroupOrientation = "horizontal" | "vertical";
export type SpButtonGroupSize = "sm" | "md" | "lg";

export interface SpButtonGroupProps {
  orientation: SpButtonGroupOrientation;
  size: SpButtonGroupSize;
  variant: string;
  attached: boolean;
}

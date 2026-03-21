export type SpSkeletonVariant = "text" | "circle" | "rect";

export interface SpSkeletonProps {
  variant: SpSkeletonVariant;
  width: string;
  height: string;
  animated: boolean;
}

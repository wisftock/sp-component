export type SpSkeletonVariant = "text" | "circle" | "rect" | "title";

export interface SpSkeletonProps {
  variant: SpSkeletonVariant;
  width: string;
  height: string;
  animated: boolean;
  shimmer: boolean;
  lines: number;
}

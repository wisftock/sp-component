export type SpRatingSize = "sm" | "md" | "lg";

export interface SpRatingProps {
  value: number;
  max: number;
  precision: number;
  disabled: boolean;
  readonly: boolean;
  size: SpRatingSize;
  label: string;
}

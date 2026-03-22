export type SpStatTrend = "up" | "down" | "neutral";

export interface SpStatProps {
  label: string;
  value: string;
  prefix: string;
  suffix: string;
  trend: SpStatTrend;
  trendValue: string;
  description: string;
  loading: boolean;
  icon: string;
}

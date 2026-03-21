export type SpTimelineItemVariant = "default" | "success" | "warning" | "error" | "info";

export interface SpTimelineItem {
  label: string;
  description?: string;
  time?: string;
  variant?: SpTimelineItemVariant;
}

export interface SpTimelineProps {
  items: SpTimelineItem[];
  reverse: boolean;
}

export type SpScrollAreaOrientation = "vertical" | "horizontal" | "both";
export type SpScrollAreaScrollbar = "auto" | "always" | "never";

export interface SpScrollAreaProps {
  orientation: SpScrollAreaOrientation;
  scrollbar: SpScrollAreaScrollbar;
  maxHeight: string;
  maxWidth: string;
}

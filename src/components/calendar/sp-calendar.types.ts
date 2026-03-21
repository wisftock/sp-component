export type SpCalendarMode = "single" | "range" | "multiple";
export type SpCalendarView = "days" | "months" | "years";
export type SpCalendarSlideDir = "left" | "right" | "";

export interface SpCalendarProps {
  value: string;
  valueStart: string;
  valueEnd: string;
  values: string;
  min: string;
  max: string;
  locale: string;
  firstDayOfWeek: number;
  disabled: boolean;
  readonly: boolean;
  mode: SpCalendarMode;
  events: string;
  disabledDates: string;
  disabledDaysOfWeek: string;
  months: number;
  showPresets: boolean;
}

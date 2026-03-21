export type SpCalendarView = "days" | "months" | "years";

export interface SpCalendarProps {
  value: string;
  min: string;
  max: string;
  locale: string;
  firstDayOfWeek: number;
  disabled: boolean;
  readonly: boolean;
}

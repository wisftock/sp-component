export type SpAccordionVariant = "default" | "bordered" | "ghost";

export interface SpAccordionItemProps {
  label: string;
  open: boolean;
  disabled: boolean;
  value: string;
}

export interface SpAccordionProps {
  multiple: boolean;
  variant: SpAccordionVariant;
}

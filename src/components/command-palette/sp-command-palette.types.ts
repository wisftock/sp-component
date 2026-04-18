export interface CommandItem {
  id: string;
  label: string;
  description?: string;
  icon?: string;
  group?: string;
  keywords?: string[];
  action?: () => void;
  disabled?: boolean;
}

export interface SpCommandPaletteProps {
  open: boolean;
  placeholder: string;
  emptyMessage: string;
  loading: boolean;
  items: CommandItem[];
}

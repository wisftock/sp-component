export interface SpBreadcrumbProps {
  separator: string;
  maxItems: number;
}

export interface SpBreadcrumbItemProps {
  href: string;
  target: string;
  rel: string;
  active: boolean;
}

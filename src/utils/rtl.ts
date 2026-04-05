/**
 * RTL utility — detects the text direction of an element.
 * Components can use this when they need direction-aware logic
 * that cannot be handled with CSS logical properties alone.
 */
export function isRTL(el: HTMLElement): boolean {
  return getComputedStyle(el).direction === "rtl";
}

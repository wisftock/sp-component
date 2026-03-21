export type SpCarouselOrientation = "horizontal" | "vertical";

export interface SpCarouselProps {
  currentIndex: number;
  loop: boolean;
  autoplay: boolean;
  interval: number;
  orientation: SpCarouselOrientation;
  showDots: boolean;
  showArrows: boolean;
  slidesPerView: number;
}

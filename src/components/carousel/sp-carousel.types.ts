export type SpCarouselOrientation = "horizontal" | "vertical";
export type SpCarouselEffect = "slide" | "fade";

export interface SpCarouselProps {
  currentIndex: number;
  loop: boolean;
  autoplay: boolean;
  interval: number;
  orientation: SpCarouselOrientation;
  showDots: boolean;
  showArrows: boolean;
  slidesPerView: number;
  effect: SpCarouselEffect;
  gap: number;
  pauseOnHover: boolean;
}

import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import type { SpCarouselProps } from "../../components/carousel/sp-carousel.types.js";
import "../../components/carousel/sp-carousel.js";
import "../../components/carousel/sp-carousel-slide.js";

const slideStyle = (bg: string) =>
  `display:flex;align-items:center;justify-content:center;height:220px;border-radius:8px;font-size:1.5rem;font-weight:600;color:#fff;background:${bg}`;

const meta: Meta<SpCarouselProps> = {
  title: "Components/Carousel",
  component: "sp-carousel",
  tags: ["autodocs"],
  argTypes: {
    currentIndex: {
      control: "number",
      description: "Index of the currently visible slide",
    },
    loop: {
      control: "boolean",
      description: "Wrap around at the ends",
    },
    autoplay: {
      control: "boolean",
      description: "Automatically advance slides",
    },
    interval: {
      control: "number",
      description: "Autoplay interval in milliseconds",
    },
    orientation: {
      control: "select",
      options: ["horizontal", "vertical"],
      description: "Slide direction",
    },
    showDots: {
      control: "boolean",
      description: "Show dot indicators",
    },
    showArrows: {
      control: "boolean",
      description: "Show prev/next arrow buttons",
    },
    slidesPerView: {
      control: "number",
      description: "Number of slides visible at once",
    },
  },
  args: {
    currentIndex: 0,
    loop: false,
    autoplay: false,
    interval: 4000,
    orientation: "horizontal",
    showDots: true,
    showArrows: true,
    slidesPerView: 1,
  },
  render: ({ loop, autoplay, interval, orientation, showDots, showArrows, slidesPerView }) => html`
    <div style="max-width:600px;padding:32px 40px;">
      <sp-carousel
        ?loop=${loop}
        ?autoplay=${autoplay}
        interval=${interval}
        orientation=${orientation}
        ?show-dots=${showDots}
        ?show-arrows=${showArrows}
        slides-per-view=${slidesPerView}
      >
        <sp-carousel-slide>
          <div style=${slideStyle("#6366f1")}>Slide 1</div>
        </sp-carousel-slide>
        <sp-carousel-slide>
          <div style=${slideStyle("#8b5cf6")}>Slide 2</div>
        </sp-carousel-slide>
        <sp-carousel-slide>
          <div style=${slideStyle("#ec4899")}>Slide 3</div>
        </sp-carousel-slide>
        <sp-carousel-slide>
          <div style=${slideStyle("#f59e0b")}>Slide 4</div>
        </sp-carousel-slide>
      </sp-carousel>
    </div>
  `,
};

export default meta;
type Story = StoryObj<SpCarouselProps>;

export const Default: Story = {};

export const WithLoop: Story = {
  args: { loop: true },
};

export const Autoplay: Story = {
  args: { autoplay: true, loop: true, interval: 2500 },
};

export const NoArrows: Story = {
  args: { showArrows: false },
};

export const NoDots: Story = {
  args: { showDots: false },
};

export const SlidesPerView: Story = {
  name: "Multiple Slides (slidesPerView=2)",
  args: { slidesPerView: 2, loop: true },
  render: ({ loop, slidesPerView }) => html`
    <div style="max-width:700px;padding:32px 40px;">
      <sp-carousel ?loop=${loop} slides-per-view=${slidesPerView} show-dots show-arrows>
        <sp-carousel-slide>
          <div style=${slideStyle("#6366f1")}>Slide 1</div>
        </sp-carousel-slide>
        <sp-carousel-slide>
          <div style=${slideStyle("#8b5cf6")}>Slide 2</div>
        </sp-carousel-slide>
        <sp-carousel-slide>
          <div style=${slideStyle("#ec4899")}>Slide 3</div>
        </sp-carousel-slide>
        <sp-carousel-slide>
          <div style=${slideStyle("#f59e0b")}>Slide 4</div>
        </sp-carousel-slide>
      </sp-carousel>
    </div>
  `,
};

export const WithImages: Story = {
  name: "Image Gallery",
  render: () => html`
    <div style="max-width:600px;padding:32px 40px;">
      <sp-carousel loop show-dots show-arrows>
        <sp-carousel-slide>
          <img
            src="https://picsum.photos/seed/sp1/600/300"
            alt="Photo 1"
            style="width:100%;height:220px;object-fit:cover;border-radius:8px;"
          />
        </sp-carousel-slide>
        <sp-carousel-slide>
          <img
            src="https://picsum.photos/seed/sp2/600/300"
            alt="Photo 2"
            style="width:100%;height:220px;object-fit:cover;border-radius:8px;"
          />
        </sp-carousel-slide>
        <sp-carousel-slide>
          <img
            src="https://picsum.photos/seed/sp3/600/300"
            alt="Photo 3"
            style="width:100%;height:220px;object-fit:cover;border-radius:8px;"
          />
        </sp-carousel-slide>
      </sp-carousel>
    </div>
  `,
};

export const Vertical: Story = {
  name: "Vertical Orientation",
  args: { orientation: "vertical", loop: true },
  render: ({ loop }) => html`
    <div style="max-width:400px;padding:32px 40px;">
      <sp-carousel orientation="vertical" ?loop=${loop} show-dots show-arrows style="height:280px;">
        <sp-carousel-slide>
          <div style=${slideStyle("#6366f1")}>Slide 1</div>
        </sp-carousel-slide>
        <sp-carousel-slide>
          <div style=${slideStyle("#8b5cf6")}>Slide 2</div>
        </sp-carousel-slide>
        <sp-carousel-slide>
          <div style=${slideStyle("#ec4899")}>Slide 3</div>
        </sp-carousel-slide>
      </sp-carousel>
    </div>
  `,
};

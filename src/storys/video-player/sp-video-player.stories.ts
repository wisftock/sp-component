import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "../../components/video-player/sp-video-player.js";

const SAMPLE_VIDEO = "https://www.w3schools.com/html/mov_bbb.mp4";

const meta: Meta = {
  title: "Components/VideoPlayer",
  component: "sp-video-player",
  tags: ["autodocs"],
  argTypes: {
    src: { control: "text", description: "URL del video" },
    poster: { control: "text", description: "Imagen de previsualización" },
    autoplay: { control: "boolean" },
    loop: { control: "boolean" },
    muted: { control: "boolean" },
  },
  args: {
    src: SAMPLE_VIDEO,
    poster: "",
    autoplay: false,
    loop: false,
    muted: false,
  },
  render: ({ src, poster, autoplay, loop, muted }) => html`
    <sp-video-player
      src=${src}
      poster=${poster}
      ?autoplay=${autoplay}
      ?loop=${loop}
      ?muted=${muted}
      style="max-width:640px;display:block;"
    ></sp-video-player>
  `,
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const WithPoster: Story = {
  args: {
    poster: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=640&q=80",
  },
};

export const Muted: Story = {
  args: { muted: true },
};

export const Looping: Story = {
  args: { loop: true },
};

export const NarrowWidth: Story = {
  render: () => html`
    <sp-video-player
      src=${SAMPLE_VIDEO}
      style="max-width:320px;display:block;"
    ></sp-video-player>
  `,
};

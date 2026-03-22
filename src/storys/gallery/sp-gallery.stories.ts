import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "../../components/gallery/sp-gallery.js";
import type { SpGalleryComponent } from "../../components/gallery/sp-gallery.js";

const UNSPLASH: { src: string; alt: string; caption?: string }[] = [
  { src: "https://picsum.photos/seed/a1/800/600", alt: "Mountain landscape", caption: "Mountain at dawn" },
  { src: "https://picsum.photos/seed/b2/800/1000", alt: "Forest path", caption: "Through the forest" },
  { src: "https://picsum.photos/seed/c3/800/600", alt: "Ocean waves" },
  { src: "https://picsum.photos/seed/d4/800/500", alt: "Desert dunes", caption: "Sahara desert" },
  { src: "https://picsum.photos/seed/e5/800/900", alt: "City skyline" },
  { src: "https://picsum.photos/seed/f6/800/600", alt: "Autumn leaves", caption: "Fall colors" },
  { src: "https://picsum.photos/seed/g7/800/700", alt: "Snowy peaks" },
  { src: "https://picsum.photos/seed/h8/800/600", alt: "Tropical beach" },
  { src: "https://picsum.photos/seed/i9/800/800", alt: "Waterfall" },
];

const meta: Meta<SpGalleryComponent> = {
  title: "Components/Gallery",
  component: "sp-gallery",
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<SpGalleryComponent>;

export const Default: Story = {
  render: () => html`
    <sp-gallery
      .items=${UNSPLASH}
      columns="3"
      gap="8"
      aspect-ratio="4/3"
    ></sp-gallery>
  `,
};

export const TwoColumns: Story = {
  render: () => html`
    <sp-gallery
      .items=${UNSPLASH.slice(0, 6)}
      columns="2"
      gap="12"
      aspect-ratio="16/9"
    ></sp-gallery>
  `,
};

export const FourColumns: Story = {
  render: () => html`
    <sp-gallery
      .items=${UNSPLASH}
      columns="4"
      gap="6"
      aspect-ratio="1/1"
    ></sp-gallery>
  `,
};

export const MasonryLayout: Story = {
  render: () => html`
    <sp-gallery
      .items=${UNSPLASH}
      layout="masonry"
      columns="3"
      gap="10"
    ></sp-gallery>
  `,
};

export const Selectable: Story = {
  render: () => html`
    <sp-gallery
      .items=${UNSPLASH}
      columns="3"
      gap="8"
      aspect-ratio="4/3"
      ?selectable=${true}
    ></sp-gallery>
  `,
};

export const Loading: Story = {
  render: () => html`
    <sp-gallery
      ?loading=${true}
      skeleton-count="9"
      columns="3"
      gap="8"
      aspect-ratio="4/3"
    ></sp-gallery>
  `,
};

export const Empty: Story = {
  render: () => html`
    <sp-gallery .items=${[]}></sp-gallery>
  `,
};

export const NoLightbox: Story = {
  render: () => html`
    <sp-gallery
      .items=${UNSPLASH}
      columns="3"
      gap="8"
      aspect-ratio="4/3"
      ?lightbox=${false}
    ></sp-gallery>
  `,
};

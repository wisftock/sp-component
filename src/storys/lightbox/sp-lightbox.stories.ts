import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "../../components/lightbox/sp-lightbox.js";

const IMAGES = [
  { src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80", thumb: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&q=60", alt: "Montaña nevada" },
  { src: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&q=80", thumb: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=200&q=60", alt: "Bosque verde" },
  { src: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1200&q=80", thumb: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=200&q=60", alt: "Camino al atardecer" },
  { src: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=1200&q=80", thumb: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=200&q=60", alt: "Flores silvestres" },
];

const meta: Meta = {
  title: "Components/Lightbox",
  component: "sp-lightbox",
  tags: ["autodocs"],
  argTypes: {
    open: { control: "boolean" },
    index: { control: "number" },
    "show-thumbs": { control: "boolean" },
  },
  args: { open: true, index: 0, "show-thumbs": true },
  render: ({ open, index }) => html`
    <sp-lightbox
      .images=${IMAGES}
      ?open=${open}
      index=${index}
      show-thumbs
    ></sp-lightbox>
    ${!open ? html`<p style="color:#6b7280;font-size:14px;">Activa "open" en los controles para ver el lightbox.</p>` : ""}
  `,
};

export default meta;
type Story = StoryObj;

export const Default: Story = { args: { open: true } };
export const NoThumbs: Story = { args: { open: true, "show-thumbs": false } };
export const SecondImage: Story = { args: { open: true, index: 1 } };

export const WithGalleryTrigger: Story = {
  render: () => {
    return html`
      <div>
        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;max-width:600px;" id="gallery">
          ${IMAGES.map((img, i) => html`
            <img
              src=${img.thumb}
              alt=${img.alt}
              style="width:100%;height:100px;object-fit:cover;border-radius:6px;cursor:pointer;"
              @click=${() => {
                const lb = document.querySelector('sp-lightbox') as any;
                if (lb) { lb.index = i; lb.open = true; }
              }}
            />
          `)}
        </div>
        <sp-lightbox .images=${IMAGES} ?open=${false} show-thumbs></sp-lightbox>
      </div>
    `;
  },
};

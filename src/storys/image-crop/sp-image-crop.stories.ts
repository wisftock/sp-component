import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "../../components/image-crop/sp-image-crop.js";

const SAMPLE_IMAGE = "https://picsum.photos/seed/crop/800/600";

const meta: Meta = {
  title: "Components/ImageCrop",
  component: "sp-image-crop",
  tags: ["autodocs"],
  argTypes: {
    src:         { control: "text",    description: "URL of the image to crop" },
    aspectRatio: { control: "number",  description: "Fixed crop aspect ratio — e.g. 1 for square, 1.777 for 16:9, 0 for free-form" },
    label:       { control: "text",    description: "Label shown above the crop area" },
    outputWidth: { control: "number",  description: "Output canvas width in pixels (0 = natural image width)" },
    outputHeight:{ control: "number",  description: "Output canvas height in pixels (0 = natural image height)" },
  },
  args: {
    src: SAMPLE_IMAGE,
    aspectRatio: 1,
    label: "Crop photo",
  },
  render: ({ src, aspectRatio, label }) => html`
    <div style="max-width:600px;">
      <sp-image-crop
        src=${src || ""}
        aspect-ratio=${aspectRatio || 1}
        label=${label || ""}
      ></sp-image-crop>
    </div>
  `,
};
export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const Landscape: Story = {
  name: "Landscape 16:9",
  args: { aspectRatio: 16 / 9 },
};

export const Portrait: Story = {
  name: "Portrait 3:4",
  args: { aspectRatio: 3 / 4 },
};

export const Free: Story = {
  name: "Free aspect ratio",
  args: { aspectRatio: 0 },
};

export const EventLog: Story = {
  name: "Event Log (sp-crop)",
  render: () => html`
    <div style="max-width:600px;display:flex;flex-direction:column;gap:12px;">
      <sp-image-crop
        src=${SAMPLE_IMAGE}
        aspect-ratio="1"
        label="Profile photo"
        @sp-crop=${(e: CustomEvent) => {
          const out = document.getElementById("crop-log");
          if (out) out.textContent = `Cropped: ${JSON.stringify(e.detail)}`;
          const preview = document.getElementById("crop-preview") as HTMLImageElement;
          if (preview && e.detail?.dataUrl) preview.src = e.detail.dataUrl;
        }}
      ></sp-image-crop>
      <code id="crop-log" style="font-size:0.75rem;color:#6366f1;">— crop to see event —</code>
      <img id="crop-preview" style="max-width:200px;border-radius:8px;display:none;" />
    </div>
  `,
};

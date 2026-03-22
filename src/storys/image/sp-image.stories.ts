import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import type { SpImageProps } from "../../components/image/sp-image.types.js";
import "../../components/image/sp-image.js";

const meta: Meta<SpImageProps> = {
  title: "Components/Image",
  component: "sp-image",
  tags: ["autodocs"],
  argTypes: {
    src: {
      control: "text",
      description: "Image source URL",
    },
    alt: {
      control: "text",
      description: "Alternative text",
    },
    width: {
      control: "text",
      description: "CSS width value (e.g. '300px' or '100%')",
    },
    height: {
      control: "text",
      description: "CSS height value",
    },
    fit: {
      control: "select",
      options: ["cover", "contain", "fill", "none"],
      description: "Object-fit value",
    },
    ratio: {
      control: "text",
      description: "Aspect ratio (e.g. '16/9', '1/1')",
    },
    lazy: {
      control: "boolean",
      description: "Use loading='lazy'",
    },
    fallback: {
      control: "text",
      description: "Fallback src on load error",
    },
    rounded: {
      control: "boolean",
      description: "Apply 50% border-radius (for avatars)",
    },
  },
  args: {
    src: "https://picsum.photos/400/300",
    alt: "Sample image",
    width: "400px",
    height: "300px",
    fit: "cover",
    ratio: "",
    lazy: true,
    fallback: "",
    rounded: false,
  },
  render: ({ src, alt, width, height, fit, ratio, lazy, fallback, rounded }) => html`
    <sp-image
      src=${src}
      alt=${alt}
      width=${width || ""}
      height=${height || ""}
      fit=${fit}
      ratio=${ratio || ""}
      ?lazy=${lazy}
      fallback=${fallback || ""}
      ?rounded=${rounded}
      style="display: inline-block;"
    ></sp-image>
  `,
};

export default meta;
type Story = StoryObj<SpImageProps>;

// ---- Stories ----

export const Default: Story = {
  args: {
    src: "https://picsum.photos/400/300",
    alt: "A sample image",
    width: "400px",
    height: "300px",
  },
};

export const WithRatio: Story = {
  render: () => html`
    <div style="width: 400px;">
      <sp-image
        src="https://picsum.photos/800/450"
        alt="16:9 image"
        ratio="16/9"
        style="display: block; width: 100%;"
      ></sp-image>
    </div>
  `,
};

export const Fallback: Story = {
  render: () => html`
    <sp-image
      src="https://example.com/broken-image.jpg"
      alt="Broken image"
      width="300px"
      height="200px"
      style="display: inline-block;"
    >
      <div slot="fallback" style="display:flex;align-items:center;justify-content:center;width:300px;height:200px;background:#fee2e2;color:#ef4444;font-size:14px;">
        Image not found
      </div>
    </sp-image>
  `,
};

export const Rounded: Story = {
  render: () => html`
    <sp-image
      src="https://picsum.photos/150/150"
      alt="Avatar"
      width="150px"
      height="150px"
      rounded
      style="display: inline-block;"
    ></sp-image>
  `,
};

export const ObjectFitVariants: Story = {
  render: () => html`
    <div style="display: flex; gap: 16px; flex-wrap: wrap; align-items: flex-start;">
      ${(["cover", "contain", "fill", "none"] as const).map(
        (fit) => html`
          <div style="text-align: center;">
            <sp-image
              src="https://picsum.photos/200/300"
              alt="${fit}"
              width="150px"
              height="150px"
              fit=${fit}
              style="display: inline-block; border: 1px solid #e5e7eb;"
            ></sp-image>
            <p style="margin: 4px 0 0; font-size: 12px; font-family: sans-serif; color: #6b7280;">${fit}</p>
          </div>
        `,
      )}
    </div>
  `,
};

export const LazyGrid: Story = {
  render: () => html`
    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; max-width: 600px;">
      ${Array.from({ length: 6 }, (_, i) => html`
        <sp-image
          src="https://picsum.photos/200/200?random=${i + 1}"
          alt="Image ${i + 1}"
          width="100%"
          height="180px"
          lazy
          style="display: block;"
        ></sp-image>
      `)}
    </div>
  `,
};

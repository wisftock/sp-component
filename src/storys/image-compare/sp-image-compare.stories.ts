import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "../../components/image-compare/sp-image-compare.js";

const meta: Meta = {
  title: "Components/ImageCompare",
  component: "sp-image-compare",
  tags: ["autodocs"],
  argTypes: {
    "before-label": { control: "text" },
    "after-label": { control: "text" },
    initial: { control: "number", description: "Posición inicial del slider (0-100)" },
    height: { control: "text" },
  },
  args: {
    "before-label": "Antes",
    "after-label": "Después",
    initial: 50,
    height: "360px",
  },
  render: (args) => html`
    <sp-image-compare
      before="https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800&q=80"
      after="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80"
      before-label=${args["before-label"]}
      after-label=${args["after-label"]}
      initial=${args.initial}
      height=${args.height}
    ></sp-image-compare>
  `,
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const StartLeft: Story = { args: { initial: 20 } };
export const StartRight: Story = { args: { initial: 80 } };

export const PhotoEdit: Story = {
  render: () => html`
    <sp-image-compare
      before="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=20"
      after="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80"
      before-label="Baja calidad"
      after-label="Alta calidad"
      height="320px"
      initial=${40}
    ></sp-image-compare>
  `,
};

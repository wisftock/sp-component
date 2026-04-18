import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "../../components/color-swatch/sp-color-swatch.js";

const PALETTE = [
  { value: "#ef4444", label: "Rojo" },
  { value: "#f97316", label: "Naranja" },
  { value: "#eab308", label: "Amarillo" },
  { value: "#22c55e", label: "Verde" },
  { value: "#3b82f6", label: "Azul" },
  { value: "#8b5cf6", label: "Violeta" },
  { value: "#ec4899", label: "Rosa" },
  { value: "#6b7280", label: "Gris" },
];

const meta: Meta = {
  title: "Components/ColorSwatch",
  component: "sp-color-swatch",
  tags: ["autodocs"],
  argTypes: {
    shape: { control: "select", options: ["circle","square","rounded"], description: "Forma de los swatches" },
    size: { control: "select", options: ["sm","md","lg"] },
    "show-label": { control: "boolean" },
    copyable: { control: "boolean" },
    multiple: { control: "boolean" },
  },
  args: { shape: "circle", size: "md", "show-label": false, copyable: true, multiple: false },
  render: ({ shape, size, copyable, multiple }) => html`
    <sp-color-swatch
      .colors=${PALETTE}
      shape=${shape}
      size=${size}
      ?copyable=${copyable}
      ?multiple=${multiple}
    ></sp-color-swatch>
  `,
};

export default meta;
type Story = StoryObj;

export const Circles: Story = { args: { shape: "circle" } };
export const Squares: Story = { args: { shape: "square" } };
export const Rounded: Story = { args: { shape: "rounded" } };

export const WithLabels: Story = {
  render: () => html`
    <sp-color-swatch .colors=${PALETTE} show-label copyable></sp-color-swatch>
  `,
};

export const Multiple: Story = {
  render: () => html`
    <sp-color-swatch .colors=${PALETTE} multiple></sp-color-swatch>
  `,
};

export const AllSizes: Story = {
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:16px;">
      ${(["sm","md","lg"] as const).map(size => html`
        <div>
          <p style="font-size:12px;color:#6b7280;margin:0 0 6px;">${size}</p>
          <sp-color-swatch .colors=${PALETTE.slice(0,5)} size=${size}></sp-color-swatch>
        </div>
      `)}
    </div>
  `,
};

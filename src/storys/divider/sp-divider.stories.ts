import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import type { SpDividerProps } from "../../components/divider/sp-divider.types.js";
import "../../components/divider/sp-divider.js";

const meta: Meta<SpDividerProps> = {
  title: "Components/Divider",
  component: "sp-divider",
  tags: ["autodocs"],
  argTypes: {
    orientation: {
      control: "select",
      options: ["horizontal", "vertical"],
      description: "Direction of the divider",
    },
    variant: {
      control: "select",
      options: ["solid", "dashed", "dotted"],
      description: "Line style",
    },
    label: {
      control: "text",
      description: "Optional label shown in the center",
    },
  },
  args: {
    orientation: "horizontal",
    variant: "solid",
    label: "",
  },
  render: ({ orientation, variant, label }) => html`
    <div style="padding: 16px; width: 400px;">
      <sp-divider orientation=${orientation} variant=${variant} label=${label || ""}></sp-divider>
    </div>
  `,
};

export default meta;
type Story = StoryObj<SpDividerProps>;

export const Horizontal: Story = {
  render: () => html`
    <div style="padding: 16px; width: 400px;">
      <p>Content above</p>
      <sp-divider></sp-divider>
      <p>Content below</p>
    </div>
  `,
};

export const Vertical: Story = {
  render: () => html`
    <div style="display: flex; align-items: center; height: 60px; gap: 16px; padding: 16px;">
      <span>Left</span>
      <sp-divider orientation="vertical"></sp-divider>
      <span>Right</span>
    </div>
  `,
};

export const WithLabel: Story = {
  render: () => html`
    <div style="padding: 16px; width: 400px;">
      <p>Section one</p>
      <sp-divider label="OR"></sp-divider>
      <p>Section two</p>
    </div>
  `,
};

export const Dashed: Story = {
  render: () => html`
    <div style="padding: 16px; width: 400px;">
      <p>Above</p>
      <sp-divider variant="dashed"></sp-divider>
      <p>Below</p>
    </div>
  `,
};

export const Dotted: Story = {
  render: () => html`
    <div style="padding: 16px; width: 400px;">
      <p>Above</p>
      <sp-divider variant="dotted"></sp-divider>
      <p>Below</p>
    </div>
  `,
};

export const AllVariants: Story = {
  render: () => html`
    <div style="padding: 16px; width: 400px; display: flex; flex-direction: column; gap: 8px;">
      <p style="margin: 0; font-size: 12px; color: #6b7280;">Solid</p>
      <sp-divider variant="solid"></sp-divider>
      <p style="margin: 0; font-size: 12px; color: #6b7280;">Dashed</p>
      <sp-divider variant="dashed"></sp-divider>
      <p style="margin: 0; font-size: 12px; color: #6b7280;">Dotted</p>
      <sp-divider variant="dotted"></sp-divider>
      <p style="margin: 0; font-size: 12px; color: #6b7280;">With label</p>
      <sp-divider label="Section"></sp-divider>
      <p style="margin: 0; font-size: 12px; color: #6b7280;">Dashed with label</p>
      <sp-divider variant="dashed" label="OR"></sp-divider>
    </div>
  `,
};

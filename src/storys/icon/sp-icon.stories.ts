import type { Meta, StoryObj } from "@storybook/web-components";
import { html, nothing } from "lit";
import type { SpIconProps } from "../../components/icon/sp-icon.types.js";
import "../../components/icon/sp-icon.js";

const allIconNames = [
  "check",
  "close",
  "arrow-right",
  "arrow-left",
  "arrow-down",
  "arrow-up",
  "info",
  "warning",
  "error",
  "search",
  "user",
  "home",
  "settings",
  "bell",
  "heart",
  "star",
  "trash",
  "edit",
];

const meta: Meta<SpIconProps> = {
  title: "Components/Icon",
  component: "sp-icon",
  tags: ["autodocs"],
  argTypes: {
    name: {
      control: "text",
      description: "Icon name",
    },
    size: {
      control: "select",
      options: ["xs", "sm", "md", "lg", "xl"],
      description: "Size of the icon",
    },
    label: {
      control: "text",
      description: "Accessible aria-label",
    },
    color: {
      control: "text",
      description: "CSS color value for the icon stroke",
    },
  },
  args: {
    name: "check",
    size: "md",
    label: "",
    color: "",
  },
  render: ({ name, size, label, color }) => html`
    <sp-icon
      name=${name}
      size=${size}
      label=${label || nothing}
      color=${color || nothing}
    ></sp-icon>
  `,
};

export default meta;
type Story = StoryObj<SpIconProps>;

export const Default: Story = {
  args: {
    name: "check",
    size: "md",
  },
};

export const AllSizes: Story = {
  render: () => html`
    <div style="display: flex; gap: 16px; align-items: center;">
      <sp-icon name="star" size="xs"></sp-icon>
      <sp-icon name="star" size="sm"></sp-icon>
      <sp-icon name="star" size="md"></sp-icon>
      <sp-icon name="star" size="lg"></sp-icon>
      <sp-icon name="star" size="xl"></sp-icon>
    </div>
  `,
};

export const AllIcons: Story = {
  render: () => html`
    <div style="display: flex; gap: 16px; flex-wrap: wrap; align-items: center;">
      ${allIconNames.map(
        (name) => html`
          <div style="display: flex; flex-direction: column; align-items: center; gap: 4px;">
            <sp-icon name=${name} size="md"></sp-icon>
            <span style="font-size: 11px; color: #6b7280;">${name}</span>
          </div>
        `,
      )}
    </div>
  `,
};

export const ColoredIcon: Story = {
  render: () => html`
    <div style="display: flex; gap: 16px; align-items: center;">
      <sp-icon name="heart" size="lg" color="#ef4444"></sp-icon>
      <sp-icon name="star" size="lg" color="#f59e0b"></sp-icon>
      <sp-icon name="check" size="lg" color="#10b981"></sp-icon>
      <sp-icon name="info" size="lg" color="#3b82f6"></sp-icon>
      <sp-icon name="warning" size="lg" color="#f97316"></sp-icon>
    </div>
  `,
};

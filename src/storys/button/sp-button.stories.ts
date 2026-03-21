import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import type { SpButtonProps } from "../../components/button/sp-button.types.js";
import "../../components/button/sp-button.js";

const meta: Meta<SpButtonProps> = {
  title: "Components/Button",
  component: "sp-button",
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "ghost", "destructive"],
      description: "Visual style of the button",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Size of the button",
    },
    disabled: {
      control: "boolean",
      description: "Disables the button",
    },
    label: {
      control: "text",
      description: "Accessible aria-label",
    },
    type: {
      control: "select",
      options: ["button", "submit", "reset"],
      description: "Native button type",
    },
  },
  args: {
    variant: "primary",
    size: "md",
    disabled: false,
    label: "Button",
    type: "button",
  },
  render: ({ variant, size, disabled, label, type }) => html`
    <sp-button
      variant=${variant}
      size=${size}
      ?disabled=${disabled}
      label=${label}
      type=${type}
    >
      ${label}
    </sp-button>
  `,
};

export default meta;
type Story = StoryObj<SpButtonProps>;

export const Primary: Story = {
  args: { variant: "primary", label: "Primary" },
};

export const Secondary: Story = {
  args: { variant: "secondary", label: "Secondary" },
};

export const Ghost: Story = {
  args: { variant: "ghost", label: "Ghost" },
};

export const Destructive: Story = {
  args: { variant: "destructive", label: "Delete" },
};

export const Disabled: Story = {
  args: { disabled: true, label: "Disabled" },
};

export const SmallSize: Story = {
  args: { size: "sm", label: "Small" },
};

export const LargeSize: Story = {
  args: { size: "lg", label: "Large" },
};

export const AllVariants: Story = {
  render: () => html`
    <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center;">
      <sp-button variant="primary">Primary</sp-button>
      <sp-button variant="secondary">Secondary</sp-button>
      <sp-button variant="ghost">Ghost</sp-button>
      <sp-button variant="destructive">Destructive</sp-button>
      <sp-button variant="primary" disabled>Disabled</sp-button>
    </div>
  `,
};

export const AllSizes: Story = {
  render: () => html`
    <div style="display: flex; gap: 12px; align-items: center;">
      <sp-button size="sm">Small</sp-button>
      <sp-button size="md">Medium</sp-button>
      <sp-button size="lg">Large</sp-button>
    </div>
  `,
};

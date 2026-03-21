import type { Meta, StoryObj } from "@storybook/web-components";
import { html, nothing } from "lit";
import type { SpCopyButtonProps } from "../../components/copy-button/sp-copy-button.types.js";
import "../../components/copy-button/sp-copy-button.js";

const meta: Meta<SpCopyButtonProps> = {
  title: "Components/CopyButton",
  component: "sp-copy-button",
  tags: ["autodocs"],
  argTypes: {
    text: {
      control: "text",
      description: "Text to copy to the clipboard",
    },
    label: {
      control: "text",
      description: "Default button label",
    },
    successLabel: {
      control: "text",
      description: "Label shown after successful copy",
    },
    successDuration: {
      control: "number",
      description: "Duration in ms to show success state",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Size of the button",
    },
    variant: {
      control: "select",
      options: ["primary", "secondary", "ghost"],
      description: "Visual variant",
    },
    disabled: {
      control: "boolean",
      description: "Disables the button",
    },
  },
  args: {
    text: "npm install @libreria/components",
    label: "Copy",
    successLabel: "Copied!",
    successDuration: 2000,
    size: "md",
    variant: "ghost",
    disabled: false,
  },
  render: ({ text, label, successLabel, successDuration, size, variant, disabled }) => html`
    <sp-copy-button
      text=${text}
      label=${label}
      success-label=${successLabel}
      success-duration=${successDuration}
      size=${size}
      variant=${variant}
      ?disabled=${disabled || nothing}
    ></sp-copy-button>
  `,
};

export default meta;
type Story = StoryObj<SpCopyButtonProps>;

export const Default: Story = {
  args: {
    text: "npm install @libreria/components",
  },
};

export const AllVariants: Story = {
  render: () => html`
    <div style="display: flex; gap: 12px; align-items: center; flex-wrap: wrap;">
      <sp-copy-button variant="primary" text="Copy primary" label="Copy primary"></sp-copy-button>
      <sp-copy-button variant="secondary" text="Copy secondary" label="Copy secondary"></sp-copy-button>
      <sp-copy-button variant="ghost" text="Copy ghost" label="Copy ghost"></sp-copy-button>
    </div>
  `,
};

export const AllSizes: Story = {
  render: () => html`
    <div style="display: flex; gap: 12px; align-items: center;">
      <sp-copy-button size="sm" text="small" label="Copy sm"></sp-copy-button>
      <sp-copy-button size="md" text="medium" label="Copy md"></sp-copy-button>
      <sp-copy-button size="lg" text="large" label="Copy lg"></sp-copy-button>
    </div>
  `,
};

export const Disabled: Story = {
  args: {
    disabled: true,
    text: "disabled text",
  },
};

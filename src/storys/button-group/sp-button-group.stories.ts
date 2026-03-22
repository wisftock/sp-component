import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import type { SpButtonGroupProps } from "../../components/button-group/sp-button-group.types.js";
import "../../components/button/sp-button.js";
import "../../components/button-group/sp-button-group.js";

const meta: Meta<SpButtonGroupProps> = {
  title: "Components/ButtonGroup",
  component: "sp-button-group",
  tags: ["autodocs"],
  argTypes: {
    orientation: {
      control: "select",
      options: ["horizontal", "vertical"],
      description: "Layout direction",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Size propagated to child buttons",
    },
    variant: {
      control: "select",
      options: ["primary", "secondary", "ghost", "destructive"],
      description: "Variant propagated to child buttons",
    },
    attached: {
      control: "boolean",
      description: "Buttons share borders when true",
    },
  },
  args: {
    orientation: "horizontal",
    size: "md",
    variant: "primary",
    attached: false,
  },
  render: ({ orientation, size, variant, attached }) => html`
    <sp-button-group
      orientation=${orientation}
      size=${size}
      variant=${variant}
      ?attached=${attached}
    >
      <sp-button>First</sp-button>
      <sp-button>Second</sp-button>
      <sp-button>Third</sp-button>
    </sp-button-group>
  `,
};

export default meta;
type Story = StoryObj<SpButtonGroupProps>;

export const Default: Story = {
  args: {
    orientation: "horizontal",
    size: "md",
    variant: "primary",
    attached: false,
  },
};

export const Attached: Story = {
  args: {
    orientation: "horizontal",
    size: "md",
    variant: "ghost",
    attached: true,
  },
};

export const Vertical: Story = {
  args: {
    orientation: "vertical",
    size: "md",
    variant: "primary",
    attached: false,
  },
};

export const IconButtons: Story = {
  render: () => html`
    <sp-button-group orientation="horizontal" size="md">
      <sp-button variant="ghost" label="Bold">B</sp-button>
      <sp-button variant="ghost" label="Italic">I</sp-button>
      <sp-button variant="ghost" label="Underline">U</sp-button>
    </sp-button-group>
  `,
};

export const SplitButton: Story = {
  render: () => html`
    <sp-button-group orientation="horizontal" attached>
      <sp-button variant="primary">Save</sp-button>
      <sp-button variant="primary" label="More options">▾</sp-button>
    </sp-button-group>
  `,
};

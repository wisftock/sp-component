import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import type { SpCheckboxGroupProps } from "../../components/checkbox-group/sp-checkbox-group.types.js";
import "../../components/checkbox/sp-checkbox.js";
import "../../components/checkbox-group/sp-checkbox-group.js";

const meta: Meta<SpCheckboxGroupProps> = {
  title: "Components/CheckboxGroup",
  component: "sp-checkbox-group",
  tags: ["autodocs"],
  argTypes: {
    values: {
      control: "text",
      description: "Comma-separated checked values",
    },
    name: {
      control: "text",
      description: "Base name shared across child checkboxes",
    },
    disabled: {
      control: "boolean",
      description: "Disables all child checkboxes",
    },
    required: {
      control: "boolean",
      description: "Requires at least one selection",
    },
    orientation: {
      control: "select",
      options: ["vertical", "horizontal"],
      description: "Layout direction",
    },
    label: {
      control: "text",
      description: "Group label (legend)",
    },
    hint: {
      control: "text",
      description: "Hint text",
    },
    error: {
      control: "text",
      description: "Error message",
    },
    min: {
      control: "number",
      description: "Minimum required selections",
    },
    max: {
      control: "number",
      description: "Maximum allowed selections (0 = unlimited)",
    },
  },
  args: {
    values: "",
    name: "interests",
    disabled: false,
    required: false,
    orientation: "vertical",
    label: "Select your interests",
    hint: "",
    error: "",
    min: 0,
    max: 0,
  },
  render: ({ values, name, disabled, required, orientation, label, hint, error, min, max }) => html`
    <sp-checkbox-group
      values=${values}
      name=${name}
      ?disabled=${disabled}
      ?required=${required}
      orientation=${orientation}
      label=${label}
      hint=${hint}
      error=${error}
      min=${min}
      max=${max}
    >
      <sp-checkbox value="technology" label="Technology"></sp-checkbox>
      <sp-checkbox value="design" label="Design"></sp-checkbox>
      <sp-checkbox value="business" label="Business"></sp-checkbox>
    </sp-checkbox-group>
  `,
};

export default meta;
type Story = StoryObj<SpCheckboxGroupProps>;

export const Default: Story = {
  args: {
    name: "default-group",
    label: "Select your interests",
  },
};

export const Horizontal: Story = {
  args: {
    name: "horizontal-group",
    label: "Select your interests",
    orientation: "horizontal",
  },
};

export const WithMinMax: Story = {
  args: {
    name: "minmax-group",
    label: "Select 1 to 2 options",
    min: 1,
    max: 2,
    hint: "You can select up to 2 options",
  },
};

export const PreSelected: Story = {
  args: {
    name: "preselected-group",
    label: "Select your interests",
    values: "technology,design",
  },
};

export const Disabled: Story = {
  args: {
    name: "disabled-group",
    label: "Select your interests (disabled)",
    disabled: true,
  },
};

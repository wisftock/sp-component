import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import type { SpRadioGroupProps } from "../../components/radio-group/sp-radio-group.types.js";
import "../../components/radio/sp-radio.js";
import "../../components/radio-group/sp-radio-group.js";

const meta: Meta<SpRadioGroupProps> = {
  title: "Components/RadioGroup",
  component: "sp-radio-group",
  tags: ["autodocs"],
  argTypes: {
    value: {
      control: "text",
      description: "Currently selected value",
    },
    name: {
      control: "text",
      description: "Name shared across child radios",
    },
    disabled: {
      control: "boolean",
      description: "Disables all child radios",
    },
    required: {
      control: "boolean",
      description: "Marks the group as required",
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
  },
  args: {
    value: "",
    name: "group",
    disabled: false,
    required: false,
    orientation: "vertical",
    label: "Choose an option",
    hint: "",
    error: "",
  },
  render: ({ value, name, disabled, required, orientation, label, hint, error }) => html`
    <sp-radio-group
      value=${value}
      name=${name}
      ?disabled=${disabled}
      ?required=${required}
      orientation=${orientation}
      label=${label}
      hint=${hint}
      error=${error}
    >
      <sp-radio value="option-1" label="Option 1"></sp-radio>
      <sp-radio value="option-2" label="Option 2"></sp-radio>
      <sp-radio value="option-3" label="Option 3"></sp-radio>
    </sp-radio-group>
  `,
};

export default meta;
type Story = StoryObj<SpRadioGroupProps>;

export const Default: Story = {
  args: {
    name: "default-group",
    label: "Select one",
  },
};

export const Horizontal: Story = {
  args: {
    name: "horizontal-group",
    label: "Select one",
    orientation: "horizontal",
  },
};

export const WithError: Story = {
  args: {
    name: "error-group",
    label: "Select one",
    error: "You must select an option",
  },
};

export const Disabled: Story = {
  args: {
    name: "disabled-group",
    label: "Select one (disabled)",
    disabled: true,
  },
};

export const PreSelected: Story = {
  args: {
    name: "preselected-group",
    label: "Select one",
    value: "option-2",
  },
};

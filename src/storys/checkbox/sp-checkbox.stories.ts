import type { Meta, StoryObj } from "@storybook/web-components";
import { html, nothing } from "lit";
import type { SpCheckboxProps } from "../../components/checkbox/sp-checkbox.types.js";
import "../../components/checkbox/sp-checkbox.js";

const meta: Meta<SpCheckboxProps> = {
  title: "Components/Checkbox",
  component: "sp-checkbox",
  tags: ["autodocs"],
  argTypes: {
    checked: {
      control: "boolean",
      description: "Whether the checkbox is checked",
    },
    indeterminate: {
      control: "boolean",
      description: "Whether the checkbox is in indeterminate state",
    },
    disabled: {
      control: "boolean",
      description: "Disables the checkbox",
    },
    required: {
      control: "boolean",
      description: "Marks the checkbox as required",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Size of the checkbox",
    },
    label: {
      control: "text",
      description: "Label text",
    },
    error: {
      control: "text",
      description: "Error message",
    },
    hint: {
      control: "text",
      description: "Hint text",
    },
    name: {
      control: "text",
      description: "Native input name",
    },
    value: {
      control: "text",
      description: "Native input value",
    },
  },
  args: {
    checked: false,
    indeterminate: false,
    disabled: false,
    required: false,
    size: "md",
    label: "Accept terms and conditions",
    error: "",
    hint: "",
    name: "",
    value: "",
  },
  render: ({ checked, indeterminate, disabled, required, size, label, error, hint, name, value }) => html`
    <sp-checkbox
      ?checked=${checked}
      ?indeterminate=${indeterminate}
      ?disabled=${disabled}
      ?required=${required}
      size=${size}
      label=${label || nothing}
      error=${error || nothing}
      hint=${hint || nothing}
      name=${name || nothing}
      value=${value || nothing}
    ></sp-checkbox>
  `,
};

export default meta;
type Story = StoryObj<SpCheckboxProps>;

export const Default: Story = {
  args: { label: "Accept terms and conditions" },
};

export const Checked: Story = {
  args: { checked: true, label: "Already checked" },
};

export const Indeterminate: Story = {
  args: { indeterminate: true, label: "Select all" },
};

export const Disabled: Story = {
  args: { disabled: true, label: "Disabled option" },
};

export const DisabledChecked: Story = {
  args: { disabled: true, checked: true, label: "Disabled and checked" },
};

export const WithError: Story = {
  args: {
    label: "Accept terms",
    error: "You must accept the terms to continue",
  },
};

export const WithHint: Story = {
  args: {
    label: "Subscribe to newsletter",
    hint: "We will send you weekly updates",
  },
};

export const Sizes: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 12px;">
      <sp-checkbox size="sm" label="Small checkbox"></sp-checkbox>
      <sp-checkbox size="md" label="Medium checkbox (default)"></sp-checkbox>
      <sp-checkbox size="lg" label="Large checkbox"></sp-checkbox>
    </div>
  `,
};

export const Group: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 8px;">
      <p style="margin: 0 0 8px; font-size: 14px; font-weight: 500; color: #374151;">Select your interests</p>
      <sp-checkbox label="Technology" checked></sp-checkbox>
      <sp-checkbox label="Design"></sp-checkbox>
      <sp-checkbox label="Business"></sp-checkbox>
      <sp-checkbox label="Science" disabled></sp-checkbox>
    </div>
  `,
};

export const WithSlotContent: Story = {
  render: () => html`
    <sp-checkbox>
      I agree to the <a href="#" style="color: #3b82f6;">Terms of Service</a>
    </sp-checkbox>
  `,
};

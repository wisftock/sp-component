import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import type { SpNumberInputProps } from "../../components/number-input/sp-number-input.types.js";
import "../../components/number-input/sp-number-input.js";

const meta: Meta<SpNumberInputProps> = {
  title: "Components/NumberInput",
  component: "sp-number-input",
  tags: ["autodocs"],
  argTypes: {
    value: {
      control: "number",
      description: "Current numeric value",
    },
    min: {
      control: "number",
      description: "Minimum allowed value",
    },
    max: {
      control: "number",
      description: "Maximum allowed value",
    },
    step: {
      control: "number",
      description: "Step increment",
    },
    disabled: {
      control: "boolean",
      description: "Disables the component",
    },
    readonly: {
      control: "boolean",
      description: "Makes the input read-only",
    },
    required: {
      control: "boolean",
      description: "Marks as required",
    },
    name: {
      control: "text",
      description: "Native input name for form submission",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Size of the component",
    },
    label: {
      control: "text",
      description: "Label text",
    },
    hint: {
      control: "text",
      description: "Hint text (shown when no error)",
    },
    error: {
      control: "text",
      description: "Error message",
    },
    placeholder: {
      control: "text",
      description: "Placeholder text",
    },
  },
  args: {
    value: 0,
    step: 1,
    disabled: false,
    readonly: false,
    required: false,
    name: "",
    size: "md",
    label: "",
    hint: "",
    error: "",
    placeholder: "",
  },
  render: ({ value, min, max, step, disabled, readonly, required, name, size, label, hint, error, placeholder }) => html`
    <sp-number-input
      .value=${value}
      .min=${min ?? -Infinity}
      .max=${max ?? Infinity}
      .step=${step}
      ?disabled=${disabled}
      ?readonly=${readonly}
      ?required=${required}
      name=${name || ""}
      size=${size}
      label=${label || ""}
      hint=${hint || ""}
      error=${error || ""}
      placeholder=${placeholder || ""}
    ></sp-number-input>
  `,
};

export default meta;
type Story = StoryObj<SpNumberInputProps>;

// ---- Stories ----

export const Default: Story = {
  args: { value: 0 },
};

export const WithMinMax: Story = {
  args: {
    value: 5,
    min: 0,
    max: 10,
    label: "Quantity (0–10)",
    hint: "Value must be between 0 and 10",
  },
};

export const Disabled: Story = {
  args: {
    value: 3,
    disabled: true,
    label: "Disabled input",
  },
};

export const Sizes: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 16px; max-width: 280px;">
      <sp-number-input size="sm" label="Small" value="1"></sp-number-input>
      <sp-number-input size="md" label="Medium" value="2"></sp-number-input>
      <sp-number-input size="lg" label="Large" value="3"></sp-number-input>
    </div>
  `,
};

export const WithLabel: Story = {
  args: {
    value: 5,
    label: "Number of items",
    hint: "Enter the quantity you need",
  },
};

export const WithError: Story = {
  args: {
    value: 15,
    max: 10,
    label: "Quantity",
    error: "Value exceeds the maximum of 10",
  },
};

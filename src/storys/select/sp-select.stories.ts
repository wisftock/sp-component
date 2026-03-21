import type { Meta, StoryObj } from "@storybook/web-components";
import { html, nothing } from "lit";
import type { SpSelectProps } from "../../components/select/sp-select.types.js";
import "../../components/select/sp-select.js";

const DEFAULT_OPTIONS = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "cherry", label: "Cherry" },
  { value: "date", label: "Date", disabled: true },
  { value: "elderberry", label: "Elderberry" },
];

const meta: Meta<SpSelectProps> = {
  title: "Components/Select",
  component: "sp-select",
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Size of the select",
    },
    disabled: {
      control: "boolean",
      description: "Disables the select",
    },
    required: {
      control: "boolean",
      description: "Marks the select as required",
    },
    multiple: {
      control: "boolean",
      description: "Allows multiple selections",
    },
    placeholder: {
      control: "text",
      description: "Placeholder option text",
    },
    label: {
      control: "text",
      description: "Label text shown above the select",
    },
    error: {
      control: "text",
      description: "Error message shown below the select",
    },
    hint: {
      control: "text",
      description: "Hint text shown below the select",
    },
    value: {
      control: "text",
      description: "Currently selected value",
    },
    name: {
      control: "text",
      description: "Native select name",
    },
  },
  args: {
    value: "",
    placeholder: "",
    disabled: false,
    required: false,
    name: "",
    size: "md",
    multiple: false,
    options: DEFAULT_OPTIONS,
    error: "",
    hint: "",
    label: "",
  },
  render: ({ value, placeholder, disabled, required, name, size, multiple, options, error, hint, label }) => html`
    <sp-select
      .value=${value}
      placeholder=${placeholder || nothing}
      ?disabled=${disabled}
      ?required=${required}
      name=${name || nothing}
      size=${size}
      ?multiple=${multiple}
      .options=${options}
      error=${error || nothing}
      hint=${hint || nothing}
      label=${label || nothing}
    ></sp-select>
  `,
};

export default meta;
type Story = StoryObj<SpSelectProps>;

// ---- Default ----

export const Default: Story = {
  args: {
    options: DEFAULT_OPTIONS,
  },
};

// ---- With Label ----

export const WithLabel: Story = {
  args: {
    label: "Favourite fruit",
    options: DEFAULT_OPTIONS,
  },
};

// ---- With Placeholder ----

export const WithPlaceholder: Story = {
  args: {
    label: "Favourite fruit",
    placeholder: "Select a fruit...",
    options: DEFAULT_OPTIONS,
  },
};

// ---- With Error ----

export const WithError: Story = {
  args: {
    label: "Favourite fruit",
    placeholder: "Select a fruit...",
    options: DEFAULT_OPTIONS,
    error: "Please select a fruit",
  },
};

// ---- Disabled ----

export const Disabled: Story = {
  args: {
    label: "Disabled select",
    value: "banana",
    options: DEFAULT_OPTIONS,
    disabled: true,
  },
};

// ---- Multiple ----

export const Multiple: Story = {
  args: {
    label: "Select fruits",
    options: DEFAULT_OPTIONS,
    multiple: true,
  },
};

// ---- Sizes ----

export const Sizes: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 16px; max-width: 400px;">
      <sp-select
        size="sm"
        label="Small (sm)"
        placeholder="Select..."
        .options=${DEFAULT_OPTIONS}
      ></sp-select>
      <sp-select
        size="md"
        label="Medium (md)"
        placeholder="Select..."
        .options=${DEFAULT_OPTIONS}
      ></sp-select>
      <sp-select
        size="lg"
        label="Large (lg)"
        placeholder="Select..."
        .options=${DEFAULT_OPTIONS}
      ></sp-select>
    </div>
  `,
};

import type { Meta, StoryObj } from "@storybook/web-components";
import { html, nothing } from "lit";
import type { SpInputProps } from "../../components/input/sp-input.types.js";
import "../../components/input/sp-input.js";

const meta: Meta<SpInputProps> = {
  title: "Components/Input",
  component: "sp-input",
  tags: ["autodocs"],
  argTypes: {
    type: {
      control: "select",
      options: ["text", "email", "password", "number", "search", "tel", "url"],
      description: "Input type",
    },
    variant: {
      control: "select",
      options: ["outline", "filled"],
      description: "Visual style — outline (default border) or filled (muted background)",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Size of the input",
    },
    disabled: {
      control: "boolean",
      description: "Disables the input",
    },
    readonly: {
      control: "boolean",
      description: "Makes the input read-only",
    },
    required: {
      control: "boolean",
      description: "Marks the input as required",
    },
    clearable: {
      control: "boolean",
      description: "Shows a clear button when value is set",
    },
    placeholder: {
      control: "text",
      description: "Placeholder text",
    },
    label: {
      control: "text",
      description: "Label text shown above the input",
    },
    error: {
      control: "text",
      description: "Error message shown below the input",
    },
    hint: {
      control: "text",
      description: "Hint text shown below the input",
    },
    value: {
      control: "text",
      description: "Current value",
    },
    name: {
      control: "text",
      description: "Native input name",
    },
    maxlength: {
      control: "number",
      description: "Maximum character length (0 = no limit)",
    },
    minlength: {
      control: "number",
      description: "Minimum character length (0 = no limit)",
    },
  },
  args: {
    type: "text",
    value: "",
    placeholder: "Type something...",
    disabled: false,
    readonly: false,
    required: false,
    name: "",
    size: "md",
    clearable: false,
    maxlength: 0,
    minlength: 0,
    error: "",
    hint: "",
    label: "",
  },
  render: ({ type, value, placeholder, disabled, readonly, required, name, size, clearable, maxlength, minlength, error, hint, label }) => html`
    <sp-input
      type=${type}
      .value=${value}
      placeholder=${placeholder || nothing}
      ?disabled=${disabled}
      ?readonly=${readonly}
      ?required=${required}
      name=${name || nothing}
      size=${size}
      ?clearable=${clearable}
      maxlength=${maxlength || nothing}
      minlength=${minlength || nothing}
      error=${error || nothing}
      hint=${hint || nothing}
      label=${label || nothing}
    ></sp-input>
  `,
};

export default meta;
type Story = StoryObj<SpInputProps>;

// ---- Default ----

export const Default: Story = {
  args: { placeholder: "Type something..." },
};

// ---- With Label ----

export const WithLabel: Story = {
  args: { label: "Email address", placeholder: "you@example.com", type: "email" },
};

// ---- With Error ----

export const WithError: Story = {
  args: {
    label: "Username",
    value: "ab",
    error: "Username must be at least 3 characters",
  },
};

// ---- With Hint ----

export const WithHint: Story = {
  args: {
    label: "Password",
    type: "password",
    hint: "Must be at least 8 characters",
  },
};

// ---- With Clearable ----

export const WithClearable: Story = {
  args: { clearable: true, value: "Clear me!", placeholder: "Type to set a value" },
};

// ---- Password type ----

export const PasswordType: Story = {
  args: { type: "password", label: "Password", placeholder: "Enter your password" },
};

// ---- Disabled ----

export const Disabled: Story = {
  args: { value: "Disabled value", disabled: true, label: "Disabled input" },
};

// ---- Readonly ----

export const Readonly: Story = {
  args: { value: "Read-only value", readonly: true, label: "Read-only input" },
};

// ---- Sizes ----

export const Sizes: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 16px; max-width: 400px;">
      <sp-input size="sm" placeholder="Small input" label="Small (sm)"></sp-input>
      <sp-input size="md" placeholder="Medium input" label="Medium (md)"></sp-input>
      <sp-input size="lg" placeholder="Large input" label="Large (lg)"></sp-input>
    </div>
  `,
};

// ---- With Icons (prefix/suffix slots) ----

export const WithIcons: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 16px; max-width: 400px;">
      <sp-input placeholder="Search..." label="With prefix icon">
        <svg slot="prefix" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
      </sp-input>
      <sp-input placeholder="Enter amount" label="With suffix icon">
        <svg slot="suffix" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b7280" stroke-width="2">
          <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
        </svg>
      </sp-input>
      <sp-input placeholder="Search users..." label="With both icons">
        <svg slot="prefix" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
        <svg slot="suffix" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b7280" stroke-width="2">
          <circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/>
        </svg>
      </sp-input>
    </div>
  `,
};

// ---- Filled Variant ----

export const FilledVariant: Story = {
  name: "Filled Variant",
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 16px; max-width: 400px;">
      <sp-input variant="filled" label="Filled input" placeholder="Type something..."></sp-input>
      <sp-input variant="filled" label="Filled with error" placeholder="Enter email" error="Invalid email address"></sp-input>
      <sp-input variant="outline" label="Outline (default)" placeholder="Type something..."></sp-input>
    </div>
  `,
};

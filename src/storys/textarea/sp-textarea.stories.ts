import type { Meta, StoryObj } from "@storybook/web-components";
import { html, nothing } from "lit";
import type { SpTextareaProps } from "../../components/textarea/sp-textarea.types.js";
import "../../components/textarea/sp-textarea.js";

const meta: Meta<SpTextareaProps> = {
  title: "Components/Textarea",
  component: "sp-textarea",
  tags: ["autodocs"],
  argTypes: {
    resize: {
      control: "select",
      options: ["none", "vertical", "horizontal", "both"],
      description: "Resize behavior",
    },
    disabled: {
      control: "boolean",
      description: "Disables the textarea",
    },
    readonly: {
      control: "boolean",
      description: "Makes the textarea read-only",
    },
    required: {
      control: "boolean",
      description: "Marks the textarea as required",
    },
    rows: {
      control: "number",
      description: "Number of visible rows",
    },
    maxlength: {
      control: "number",
      description: "Maximum character length (0 = no limit)",
    },
    placeholder: {
      control: "text",
      description: "Placeholder text",
    },
    label: {
      control: "text",
      description: "Label text shown above the textarea",
    },
    error: {
      control: "text",
      description: "Error message shown below the textarea",
    },
    hint: {
      control: "text",
      description: "Hint text shown below the textarea",
    },
    value: {
      control: "text",
      description: "Current value",
    },
    name: {
      control: "text",
      description: "Native textarea name",
    },
  },
  args: {
    value: "",
    placeholder: "Type something...",
    disabled: false,
    readonly: false,
    required: false,
    name: "",
    rows: 3,
    maxlength: 0,
    resize: "vertical",
    error: "",
    hint: "",
    label: "",
  },
  render: ({ value, placeholder, disabled, readonly, required, name, rows, maxlength, resize, error, hint, label }) => html`
    <sp-textarea
      .value=${value}
      placeholder=${placeholder || nothing}
      ?disabled=${disabled}
      ?readonly=${readonly}
      ?required=${required}
      name=${name || nothing}
      rows=${rows}
      maxlength=${maxlength || nothing}
      resize=${resize}
      error=${error || nothing}
      hint=${hint || nothing}
      label=${label || nothing}
    ></sp-textarea>
  `,
};

export default meta;
type Story = StoryObj<SpTextareaProps>;

// ---- Default ----

export const Default: Story = {
  args: { placeholder: "Enter your message..." },
};

// ---- With Label ----

export const WithLabel: Story = {
  args: { label: "Message", placeholder: "Enter your message..." },
};

// ---- With Error ----

export const WithError: Story = {
  args: {
    label: "Description",
    value: "Too short",
    error: "Description must be at least 20 characters",
  },
};

// ---- With Max Length ----

export const WithMaxLength: Story = {
  args: {
    label: "Bio",
    placeholder: "Tell us about yourself...",
    maxlength: 280,
    hint: "Keep it short and sweet",
  },
};

// ---- Disabled ----

export const Disabled: Story = {
  args: {
    label: "Disabled textarea",
    value: "This content cannot be changed",
    disabled: true,
  },
};

// ---- Readonly ----

export const Readonly: Story = {
  args: {
    label: "Read-only textarea",
    value: "This content is read-only",
    readonly: true,
  },
};

// ---- Resize options ----

export const ResizeOptions: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 24px; max-width: 500px;">
      <sp-textarea resize="none" label="No resize" placeholder="resize: none"></sp-textarea>
      <sp-textarea resize="vertical" label="Vertical resize (default)" placeholder="resize: vertical"></sp-textarea>
      <sp-textarea resize="horizontal" label="Horizontal resize" placeholder="resize: horizontal"></sp-textarea>
      <sp-textarea resize="both" label="Both directions" placeholder="resize: both"></sp-textarea>
    </div>
  `,
};

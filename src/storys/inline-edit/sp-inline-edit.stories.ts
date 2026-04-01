import type { Meta, StoryObj } from "@storybook/web-components";
import { html, nothing } from "lit";
import type { SpInlineEditProps } from "../../components/inline-edit/sp-inline-edit.types.js";
import "../../components/inline-edit/sp-inline-edit.js";

const meta: Meta<SpInlineEditProps> = {
  title: "Components/Inline Edit",
  component: "sp-inline-edit",
  tags: ["autodocs"],
  argTypes: {
    value: {
      control: "text",
      description: "Current text value",
    },
    placeholder: {
      control: "text",
      description: "Input placeholder text",
    },
    type: {
      control: "select",
      options: ["text", "number", "email", "url"],
      description: "Input type",
    },
    disabled: {
      control: "boolean",
      description: "Disables editing",
    },
    readonly: {
      control: "boolean",
      description: "Shows value without edit capability",
    },
    emptyText: {
      control: "text",
      description: "Text shown when value is empty",
    },
    maxlength: {
      control: "number",
      description: "Maximum character length",
    },
  },
  args: {
    value: "John Doe",
    placeholder: "Enter value...",
    type: "text",
    disabled: false,
    readonly: false,
    emptyText: "Click to edit",
    maxlength: 0,
  },
  render: ({ value, placeholder, type, disabled, readonly, emptyText, maxlength }) => html`
    <sp-inline-edit
      value=${value || nothing}
      placeholder=${placeholder || nothing}
      type=${type ?? "text"}
      ?disabled=${disabled}
      ?readonly=${readonly}
      empty-text=${emptyText || nothing}
      maxlength=${maxlength && maxlength > 0 ? maxlength : nothing}
      @sp-change=${(e: CustomEvent) => console.log("sp-change", e.detail)}
    ></sp-inline-edit>
  `,
};

export default meta;
type Story = StoryObj<SpInlineEditProps>;

export const Default: Story = {};

export const Empty: Story = {
  args: { value: "", emptyText: "Click to add a title..." },
};

export const Readonly: Story = {
  args: { readonly: true, value: "This cannot be edited" },
};

export const Disabled: Story = {
  args: { disabled: true, value: "Editing disabled" },
};

export const InContext: Story = {
  render: () => html`
    <div style="font-family: system-ui; padding: 24px; max-width: 400px;">
      <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
        <span style="font-size: 12px; color: #6b7280; width: 80px;">Name</span>
        <sp-inline-edit value="Acme Corporation" @sp-change=${(e: CustomEvent) => console.log(e.detail)}></sp-inline-edit>
      </div>
      <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
        <span style="font-size: 12px; color: #6b7280; width: 80px;">Email</span>
        <sp-inline-edit type="email" value="hello@acme.com"></sp-inline-edit>
      </div>
      <div style="display: flex; align-items: center; gap: 8px;">
        <span style="font-size: 12px; color: #6b7280; width: 80px;">Budget</span>
        <sp-inline-edit type="number" value="50000" empty-text="Set budget..."></sp-inline-edit>
      </div>
    </div>
  `,
};

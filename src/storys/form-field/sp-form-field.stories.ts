import type { Meta, StoryObj } from "@storybook/web-components";
import { html, nothing } from "lit";
import type { SpFormFieldProps } from "../../components/form-field/sp-form-field.types.js";
import "../../components/form-field/sp-form-field.js";

const meta: Meta<SpFormFieldProps> = {
  title: "Components/FormField",
  component: "sp-form-field",
  tags: ["autodocs"],
  argTypes: {
    label: {
      control: "text",
      description: "Label text displayed above the control",
    },
    error: {
      control: "text",
      description: "Error message displayed below the control",
    },
    hint: {
      control: "text",
      description: "Hint text displayed below the control",
    },
    required: {
      control: "boolean",
      description: "Shows a required asterisk next to the label",
    },
    disabled: {
      control: "boolean",
      description: "Dims the entire field",
    },
    labelFor: {
      control: "text",
      description: "The id of the form control to associate the label with",
    },
  },
  args: {
    label: "Field label",
    error: "",
    hint: "",
    required: false,
    disabled: false,
    labelFor: "",
  },
  render: ({ label, error, hint, required, disabled, labelFor }) => html`
    <sp-form-field
      label=${label || nothing}
      error=${error || nothing}
      hint=${hint || nothing}
      ?required=${required}
      ?disabled=${disabled}
      label-for=${labelFor || nothing}
    >
      <input
        type="text"
        placeholder="Enter a value..."
        style="width: 100%; padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 4px; font-size: 14px; box-sizing: border-box;"
      />
    </sp-form-field>
  `,
};

export default meta;
type Story = StoryObj<SpFormFieldProps>;

export const WithInput: Story = {
  args: {
    label: "Email address",
    hint: "We will never share your email",
    labelFor: "email",
  },
  render: () => html`
    <sp-form-field label="Email address" hint="We will never share your email" label-for="email">
      <input
        id="email"
        type="email"
        placeholder="you@example.com"
        style="width: 100%; padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 4px; font-size: 14px; box-sizing: border-box;"
      />
    </sp-form-field>
  `,
};

export const WithError: Story = {
  args: { label: "Username", error: "Username is already taken" },
  render: () => html`
    <sp-form-field label="Username" error="Username is already taken">
      <input
        type="text"
        value="john_doe"
        style="width: 100%; padding: 8px 12px; border: 1px solid #ef4444; border-radius: 4px; font-size: 14px; box-sizing: border-box;"
      />
    </sp-form-field>
  `,
};

export const WithHint: Story = {
  render: () => html`
    <sp-form-field label="Password" hint="Must be at least 8 characters with a number and symbol">
      <input
        type="password"
        placeholder="Enter password"
        style="width: 100%; padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 4px; font-size: 14px; box-sizing: border-box;"
      />
    </sp-form-field>
  `,
};

export const Required: Story = {
  render: () => html`
    <sp-form-field label="Full name" required label-for="fullname">
      <input
        id="fullname"
        type="text"
        placeholder="John Doe"
        style="width: 100%; padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 4px; font-size: 14px; box-sizing: border-box;"
      />
    </sp-form-field>
  `,
};

export const Disabled: Story = {
  render: () => html`
    <sp-form-field label="Disabled field" hint="This field cannot be edited" disabled>
      <input
        type="text"
        value="Cannot edit this"
        disabled
        style="width: 100%; padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 4px; font-size: 14px; box-sizing: border-box; background: #f9fafb;"
      />
    </sp-form-field>
  `,
};

export const WithMultipleControls: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 16px; max-width: 400px;">
      <sp-form-field label="First name" required label-for="first-name">
        <input
          id="first-name"
          type="text"
          placeholder="John"
          style="width: 100%; padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 4px; font-size: 14px; box-sizing: border-box;"
        />
      </sp-form-field>
      <sp-form-field label="Last name" required label-for="last-name">
        <input
          id="last-name"
          type="text"
          placeholder="Doe"
          style="width: 100%; padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 4px; font-size: 14px; box-sizing: border-box;"
        />
      </sp-form-field>
      <sp-form-field label="Email" error="Invalid email address" label-for="email-form">
        <input
          id="email-form"
          type="email"
          value="not-an-email"
          style="width: 100%; padding: 8px 12px; border: 1px solid #ef4444; border-radius: 4px; font-size: 14px; box-sizing: border-box;"
        />
      </sp-form-field>
      <sp-form-field label="Bio" hint="Tell us a little about yourself" label-for="bio">
        <textarea
          id="bio"
          rows="3"
          placeholder="Write a short bio..."
          style="width: 100%; padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 4px; font-size: 14px; box-sizing: border-box; resize: vertical;"
        ></textarea>
      </sp-form-field>
    </div>
  `,
};

export const NoLabel: Story = {
  render: () => html`
    <sp-form-field hint="Enter something in the field below">
      <input
        type="text"
        placeholder="No label above"
        style="width: 100%; padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 4px; font-size: 14px; box-sizing: border-box;"
      />
    </sp-form-field>
  `,
};

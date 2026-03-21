import type { Meta, StoryObj } from "@storybook/web-components";
import { html, nothing } from "lit";
import type { SpOtpInputProps } from "../../components/otp-input/sp-otp-input.types.js";
import "../../components/otp-input/sp-otp-input.js";

const meta: Meta<SpOtpInputProps> = {
  title: "Components/OtpInput",
  component: "sp-otp-input",
  tags: ["autodocs"],
  argTypes: {
    length: {
      control: "number",
      description: "Number of OTP digit cells",
    },
    disabled: {
      control: "boolean",
      description: "Disables all inputs",
    },
    invalid: {
      control: "boolean",
      description: "Marks inputs as invalid",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Size of each cell",
    },
    inputType: {
      control: "select",
      options: ["text", "number", "password"],
      description: "Input type for each cell",
    },
    placeholder: {
      control: "text",
      description: "Placeholder character for empty cells",
    },
    label: {
      control: "text",
      description: "Accessible label for the group",
    },
    value: {
      control: "text",
      description: "Current OTP value",
    },
  },
  args: {
    length: 6,
    disabled: false,
    invalid: false,
    size: "md",
    inputType: "text",
    placeholder: "·",
    label: "One-time password",
    value: "",
  },
  render: ({ length, disabled, invalid, size, inputType, placeholder, label, value }) => html`
    <sp-otp-input
      length=${length}
      ?disabled=${disabled || nothing}
      ?invalid=${invalid || nothing}
      size=${size}
      input-type=${inputType}
      placeholder=${placeholder}
      label=${label}
      value=${value || nothing}
    ></sp-otp-input>
  `,
};

export default meta;
type Story = StoryObj<SpOtpInputProps>;

export const Default: Story = {
  args: {
    length: 6,
    label: "One-time password",
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    label: "Disabled OTP",
  },
};

export const Invalid: Story = {
  args: {
    invalid: true,
    label: "Invalid OTP",
    value: "12345",
  },
};

export const AllSizes: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 24px;">
      <div>
        <p style="margin: 0 0 8px; font-size: 13px; font-weight: 500; color: #374151;">Small (sm)</p>
        <sp-otp-input size="sm" length="4" label="Small OTP"></sp-otp-input>
      </div>
      <div>
        <p style="margin: 0 0 8px; font-size: 13px; font-weight: 500; color: #374151;">Medium (md)</p>
        <sp-otp-input size="md" length="4" label="Medium OTP"></sp-otp-input>
      </div>
      <div>
        <p style="margin: 0 0 8px; font-size: 13px; font-weight: 500; color: #374151;">Large (lg)</p>
        <sp-otp-input size="lg" length="4" label="Large OTP"></sp-otp-input>
      </div>
    </div>
  `,
};

export const PasswordType: Story = {
  args: {
    inputType: "password",
    length: 6,
    label: "PIN code",
    placeholder: "•",
  },
};

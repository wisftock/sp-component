import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "../../components/phone-input/sp-phone-input.js";

const meta: Meta = {
  title: "Components/PhoneInput",
  component: "sp-phone-input",
  tags: ["autodocs"],
  argTypes: {
    label:       { control: "text", description: "Label text" },
    placeholder: { control: "text", description: "Input placeholder" },
    defaultCountry: { control: "text", description: "Default country code (e.g. US, MX, AR)" },
    disabled:    { control: "boolean" },
    required:    { control: "boolean" },
    error:       { control: "text" },
    hint:        { control: "text" },
  },
  args: {
    label: "Phone number",
    placeholder: "Enter phone number",
    defaultCountry: "US",
    disabled: false,
    required: false,
    error: "",
    hint: "",
  },
  render: ({ label, placeholder, defaultCountry, disabled, required, error, hint }) => html`
    <div style="max-width:360px;">
      <sp-phone-input
        label=${label}
        placeholder=${placeholder}
        default-country=${defaultCountry}
        ?disabled=${disabled}
        ?required=${required}
        error=${error || ""}
        hint=${hint || ""}
      ></sp-phone-input>
    </div>
  `,
};
export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const WithLatamCountry: Story = {
  name: "Latin America (México)",
  args: { defaultCountry: "MX", label: "Número de teléfono" },
};

export const WithError: Story = {
  args: { error: "Please enter a valid phone number" },
};

export const WithHint: Story = {
  args: { hint: "Include your country code" },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const EventLog: Story = {
  name: "Event Log (sp-change)",
  render: () => html`
    <div style="max-width:360px;display:flex;flex-direction:column;gap:16px;">
      <sp-phone-input
        label="Phone"
        default-country="US"
        @sp-change=${(e: CustomEvent) => {
          const out = document.getElementById("phone-log");
          if (out) out.textContent = JSON.stringify(e.detail);
        }}
      ></sp-phone-input>
      <code id="phone-log" style="font-size:0.8rem;color:#6366f1;">— type to see event —</code>
    </div>
  `,
};

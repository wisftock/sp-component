import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "../../components/month-picker/sp-month-picker.js";

const meta: Meta = {
  title: "Components/MonthPicker",
  component: "sp-month-picker",
  tags: ["autodocs"],
  argTypes: {
    value: { control: "text", description: "Valor seleccionado YYYY-MM" },
    placeholder: { control: "text" },
    min: { control: "text" },
    max: { control: "text" },
    disabled: { control: "boolean" },
  },
  args: { value: "", placeholder: "Seleccionar mes", min: "", max: "", disabled: false },
  render: ({ value, placeholder, min, max, disabled }) => html`
    <sp-month-picker
      value=${value}
      placeholder=${placeholder}
      min=${min}
      max=${max}
      ?disabled=${disabled}
    ></sp-month-picker>
  `,
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
export const WithValue: Story = { args: { value: "2025-06" } };
export const Disabled: Story = { args: { disabled: true } };
export const WithRange: Story = { args: { min: "2025-01", max: "2025-12" } };

export const InForm: Story = {
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:12px;max-width:300px;">
      <label style="font-size:14px;font-weight:500;">Mes de facturación</label>
      <sp-month-picker placeholder="Seleccionar mes"></sp-month-picker>
    </div>
  `,
};

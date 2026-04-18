import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "../../components/date-time-picker/sp-date-time-picker.js";

const meta: Meta = {
  title: "Components/DateTimePicker",
  component: "sp-date-time-picker",
  tags: ["autodocs"],
  argTypes: {
    value: { control: "text", description: "ISO datetime YYYY-MM-DDTHH:mm" },
    placeholder: { control: "text" },
    min: { control: "text" },
    max: { control: "text" },
    disabled: { control: "boolean" },
    seconds: { control: "boolean", description: "Incluir selector de segundos" },
  },
  args: { value: "", placeholder: "Fecha y hora", min: "", max: "", disabled: false, seconds: false },
  render: ({ value, placeholder, min, max, disabled, seconds }) => html`
    <sp-date-time-picker
      value=${value}
      placeholder=${placeholder}
      min=${min}
      max=${max}
      ?disabled=${disabled}
      ?seconds=${seconds}
    ></sp-date-time-picker>
  `,
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const WithValue: Story = {
  args: { value: "2025-08-15T14:30" },
};

export const WithSeconds: Story = {
  args: { seconds: true },
};

export const Disabled: Story = {
  args: { disabled: true, value: "2025-06-01T09:00" },
};

export const InForm: Story = {
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:12px;max-width:360px;">
      <label style="font-size:14px;font-weight:500;color:#374151;">Fecha y hora de la reunión</label>
      <sp-date-time-picker placeholder="Seleccionar fecha y hora"></sp-date-time-picker>
      <p style="font-size:12px;color:#6b7280;margin:0;">Zona horaria: América/Bogotá (UTC-5)</p>
    </div>
  `,
};

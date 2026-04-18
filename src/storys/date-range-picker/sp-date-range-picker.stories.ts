import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "../../components/date-range-picker/sp-date-range-picker.js";

const meta: Meta = {
  title: "Components/DateRangePicker",
  component: "sp-date-range-picker",
  tags: ["autodocs"],
  argTypes: {
    start: { control: "text", description: "Fecha inicio ISO (YYYY-MM-DD)" },
    end: { control: "text", description: "Fecha fin ISO (YYYY-MM-DD)" },
    placeholder: { control: "text" },
    min: { control: "text" },
    max: { control: "text" },
    disabled: { control: "boolean" },
  },
  args: { start: "", end: "", placeholder: "Seleccionar rango", min: "", max: "", disabled: false },
  render: ({ start, end, placeholder, min, max, disabled }) => html`
    <sp-date-range-picker
      start=${start}
      end=${end}
      placeholder=${placeholder}
      min=${min}
      max=${max}
      ?disabled=${disabled}
    ></sp-date-range-picker>
  `,
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const WithPreselected: Story = {
  args: { start: "2025-03-01", end: "2025-03-15" },
};

export const WithMinMax: Story = {
  args: { min: "2025-01-01", max: "2025-12-31" },
};

export const Disabled: Story = {
  args: { disabled: true, start: "2025-06-01", end: "2025-06-30" },
};

export const InForm: Story = {
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:12px;max-width:400px;">
      <label style="font-size:14px;font-weight:500;color:#374151;">Rango de fechas del reporte</label>
      <sp-date-range-picker placeholder="Seleccionar periodo"></sp-date-range-picker>
      <p style="font-size:12px;color:#6b7280;margin:0;">Selecciona el inicio y fin del período a analizar.</p>
    </div>
  `,
};

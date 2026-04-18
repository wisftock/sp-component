import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "../../components/sparkline/sp-sparkline.js";

const UP = [4, 6, 5, 8, 7, 9, 11, 10, 13, 12, 15, 14];
const DOWN = [15, 14, 12, 13, 10, 11, 8, 9, 6, 7, 4, 5];
const VOLATILE = [5, 12, 3, 18, 7, 14, 2, 16, 9, 11, 6, 20];
const FLAT = [8, 9, 8, 10, 8, 9, 10, 8, 9, 8, 10, 9];

const meta: Meta = {
  title: "Components/Sparkline",
  component: "sp-sparkline",
  tags: ["autodocs"],
  argTypes: {
    type: { control: "select", options: ["line","bar","area"] },
    width: { control: "number" },
    height: { control: "number" },
    color: { control: "color" },
    fill: { control: "boolean", description: "Rellena el área bajo la línea" },
    "stroke-width": { control: "number" },
  },
  args: { type: "line", width: 120, height: 36, color: "var(--sp-primary,#6366f1)", fill: false, "stroke-width": 1.5 },
  render: ({ type, width, height, color, fill }) => html`
    <sp-sparkline
      .values=${UP}
      type=${type}
      width=${width}
      height=${height}
      color=${color}
      ?fill=${fill}
    ></sp-sparkline>
  `,
};

export default meta;
type Story = StoryObj;

export const Line: Story = { args: { type: "line" } };
export const Area: Story = { args: { type: "area", fill: true } };
export const Bar: Story = { args: { type: "bar" } };

export const Trending: Story = {
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:16px;max-width:300px;">
      ${[
        { label: "Ventas", values: UP, color: "#10b981", trend: "+23%" },
        { label: "Usuarios", values: VOLATILE, color: "#3b82f6", trend: "+8%" },
        { label: "Rebotes", values: DOWN, color: "#ef4444", trend: "-12%" },
      ].map(({ label, values, color, trend }) => html`
        <div style="display:flex;align-items:center;justify-content:space-between;padding:12px;background:#f9fafb;border-radius:8px;border:1px solid #e5e7eb;">
          <div>
            <p style="margin:0;font-size:13px;color:#6b7280;">${label}</p>
            <p style="margin:2px 0 0;font-size:18px;font-weight:700;color:${color};">${trend}</p>
          </div>
          <sp-sparkline .values=${values} type="line" width=${80} height=${32} color=${color}></sp-sparkline>
        </div>
      `)}
    </div>
  `,
};

export const AllTypes: Story = {
  render: () => html`
    <div style="display:flex;gap:24px;align-items:center;flex-wrap:wrap;">
      ${(["line","area","bar"] as const).map(type => html`
        <div style="display:flex;flex-direction:column;align-items:center;gap:6px;">
          <sp-sparkline .values=${UP} type=${type} width=${80} height=${28} color="#6366f1"></sp-sparkline>
          <span style="font-size:12px;color:#6b7280;">${type}</span>
        </div>
      `)}
    </div>
  `,
};

export const InTable: Story = {
  render: () => html`
    <table style="border-collapse:collapse;font-size:14px;width:100%;">
      <thead>
        <tr style="background:#f9fafb;">
          <th style="padding:10px 16px;text-align:left;border-bottom:1px solid #e5e7eb;">Métrica</th>
          <th style="padding:10px 16px;text-align:right;border-bottom:1px solid #e5e7eb;">Valor</th>
          <th style="padding:10px 16px;text-align:right;border-bottom:1px solid #e5e7eb;">Tendencia</th>
        </tr>
      </thead>
      <tbody>
        ${[
          { name: "Ingresos", value: "$12,450", values: UP, color: "#10b981" },
          { name: "Sesiones", value: "8,234", values: VOLATILE, color: "#3b82f6" },
          { name: "Churn", value: "2.1%", values: DOWN, color: "#ef4444" },
          { name: "NPS", value: "72", values: FLAT, color: "#f59e0b" },
        ].map(({ name, value, values, color }) => html`
          <tr style="border-bottom:1px solid #f3f4f6;">
            <td style="padding:10px 16px;">${name}</td>
            <td style="padding:10px 16px;text-align:right;font-weight:600;">${value}</td>
            <td style="padding:10px 16px;text-align:right;">
              <sp-sparkline .values=${values} type="line" width=${60} height=${24} color=${color}></sp-sparkline>
            </td>
          </tr>
        `)}
      </tbody>
    </table>
  `,
};

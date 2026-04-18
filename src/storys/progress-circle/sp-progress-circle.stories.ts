import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "../../components/progress-circle/sp-progress-circle.js";

const meta: Meta = {
  title: "Components/ProgressCircle",
  component: "sp-progress-circle",
  tags: ["autodocs"],
  argTypes: {
    value: { control: { type: "range", min: 0, max: 100 } },
    size: { control: "number" },
    "stroke-width": { control: "number" },
    status: { control: "select", options: ["default","success","warning","danger"] },
    "show-value": { control: "boolean" },
    label: { control: "text" },
    indeterminate: { control: "boolean" },
    color: { control: "color" },
  },
  args: { value: 65, size: 80, "stroke-width": 8, status: "default", "show-value": true, label: "", indeterminate: false, color: "" },
  render: ({ value, size, status, label, indeterminate, color }) => html`
    <sp-progress-circle
      value=${value}
      size=${size}
      status=${status}
      label=${label}
      ?indeterminate=${indeterminate}
      color=${color}
      show-value
    ></sp-progress-circle>
  `,
};

export default meta;
type Story = StoryObj;

export const Default: Story = { args: { value: 65 } };
export const Success: Story = { args: { value: 100, status: "success" } };
export const Warning: Story = { args: { value: 45, status: "warning" } };
export const Danger: Story = { args: { value: 20, status: "danger" } };
export const Indeterminate: Story = { args: { indeterminate: true } };

export const AllValues: Story = {
  render: () => html`
    <div style="display:flex;gap:24px;flex-wrap:wrap;align-items:center;">
      ${[0, 25, 50, 75, 100].map(v => html`
        <sp-progress-circle value=${v} show-value size=${80}></sp-progress-circle>
      `)}
    </div>
  `,
};

export const Sizes: Story = {
  render: () => html`
    <div style="display:flex;gap:24px;align-items:center;">
      ${[48, 64, 80, 100, 128].map(s => html`
        <sp-progress-circle value=${70} size=${s} show-value></sp-progress-circle>
      `)}
    </div>
  `,
};

export const WithLabel: Story = {
  render: () => html`
    <div style="display:flex;gap:24px;">
      <sp-progress-circle value=${82} show-value label="Completado" size=${96}></sp-progress-circle>
      <sp-progress-circle value=${45} show-value label="En progreso" status="warning" size=${96}></sp-progress-circle>
      <sp-progress-circle value=${12} show-value label="Pendiente" status="danger" size=${96}></sp-progress-circle>
    </div>
  `,
};

export const Dashboard: Story = {
  render: () => html`
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:16px;max-width:480px;">
      ${[
        { label: "CPU", value: 67, status: "warning" as const },
        { label: "RAM", value: 42, status: "default" as const },
        { label: "Disco", value: 85, status: "danger" as const },
        { label: "Red", value: 23, status: "success" as const },
      ].map(({ label, value, status }) => html`
        <div style="display:flex;flex-direction:column;align-items:center;gap:8px;padding:16px;background:#f9fafb;border-radius:8px;border:1px solid #e5e7eb;">
          <sp-progress-circle value=${value} status=${status} size=${64} show-value></sp-progress-circle>
          <span style="font-size:13px;color:#374151;font-weight:500;">${label}</span>
        </div>
      `)}
    </div>
  `,
};

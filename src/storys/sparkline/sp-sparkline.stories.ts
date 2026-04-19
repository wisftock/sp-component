import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "../../components/sparkline/sp-sparkline.js";

const UP       = [4, 6, 5, 8, 7, 9, 11, 10, 13, 12, 15, 14];
const DOWN     = [15, 14, 12, 13, 10, 11, 8, 9, 6, 7, 4, 5];
const VOLATILE = [5, 12, 3, 18, 7, 14, 2, 16, 9, 11, 6, 20];
const FLAT     = [8, 9, 8, 10, 8, 9, 10, 8, 9, 8, 10, 9];
const STEPS    = [2, 2, 8, 8, 5, 5, 12, 12, 9, 9, 16, 16];

const meta: Meta = {
  title: "Components/Sparkline",
  component: "sp-sparkline",
  tags: ["autodocs"],
  argTypes: {
    type:          { control: "select", options: ["line","bar","area"] },
    width:         { control: "number" },
    height:        { control: "number" },
    color:         { control: "color" },
    fill:          { control: "boolean" },
    "stroke-width":{ control: "number" },
  },
  args: { type: "line", width: 120, height: 36, color: "#6366f1", fill: false, "stroke-width": 1.5 },
  render: ({ type, width, height, color, fill }: any) => html`
    <sp-sparkline .values=${UP} type=${type} width=${width} height=${height} color=${color} ?fill=${fill}></sp-sparkline>
  `,
};

export default meta;
type Story = StoryObj;

export const Line: Story  = { args: { type: "line" } };
export const Area: Story  = { args: { type: "area", fill: true } };
export const Bar: Story   = { args: { type: "bar" } };

export const AllTypes: Story = {
  name: "Todos los tipos",
  render: () => html`
    <div style="display:flex;gap:32px;align-items:flex-end;flex-wrap:wrap;padding:8px;">
      ${(["line","area","bar"] as const).map(type => html`
        <div style="display:flex;flex-direction:column;align-items:center;gap:8px;">
          <sp-sparkline .values=${UP} type=${type} width=${100} height=${40} color="#6366f1" ?fill=${type==="area"}></sp-sparkline>
          <span style="font-size:12px;color:#6b7280;">${type}</span>
        </div>
      `)}
    </div>
  `,
};

export const Trending: Story = {
  name: "Tarjetas de tendencia",
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:12px;max-width:320px;">
      ${[
        { label: "Ingresos",  value: "$12,450", delta: "+23%", values: UP,       color: "#10b981", type: "area"  },
        { label: "Usuarios",  value: "8,234",   delta: "+8%",  values: VOLATILE,  color: "#3b82f6", type: "line"  },
        { label: "Rebotes",   value: "2.1%",    delta: "-12%", values: DOWN,      color: "#ef4444", type: "bar"   },
        { label: "NPS",       value: "72",      delta: "0%",   values: FLAT,      color: "#f59e0b", type: "line"  },
      ].map(({ label, value, delta, values, color, type }) => html`
        <div style="display:flex;align-items:center;justify-content:space-between;padding:14px 16px;background:#fff;border-radius:10px;border:1px solid #e5e7eb;box-shadow:0 1px 3px rgba(0,0,0,0.05);">
          <div>
            <p style="margin:0;font-size:12px;color:#6b7280;font-weight:500;">${label}</p>
            <p style="margin:4px 0 0;font-size:20px;font-weight:700;color:#111827;">${value}</p>
            <p style="margin:2px 0 0;font-size:12px;color:${color};font-weight:600;">${delta}</p>
          </div>
          <sp-sparkline .values=${values} type=${type as any} width=${80} height=${36} color=${color} ?fill=${type==="area"}></sp-sparkline>
        </div>
      `)}
    </div>
  `,
};

export const Dashboard: Story = {
  name: "Mini dashboard",
  render: () => html`
    <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:12px;max-width:560px;">
      ${[
        { label: "Ventas hoy",      value: "$3,240",  values: UP,       color: "#6366f1", type: "area",  bg: "#f5f3ff" },
        { label: "Visitas",         value: "14,892",  values: VOLATILE,  color: "#0ea5e9", type: "line",  bg: "#f0f9ff" },
        { label: "Conversión",      value: "4.6%",    values: STEPS,    color: "#10b981", type: "bar",   bg: "#f0fdf4" },
        { label: "Tiempo medio",    value: "2m 34s",  values: DOWN,     color: "#f59e0b", type: "line",  bg: "#fffbeb" },
      ].map(({ label, value, values, color, type, bg }) => html`
        <div style="padding:16px;border-radius:12px;background:${bg};border:1px solid ${color}22;">
          <p style="margin:0;font-size:12px;color:#6b7280;font-weight:500;">${label}</p>
          <p style="margin:6px 0 8px;font-size:22px;font-weight:700;color:#111827;">${value}</p>
          <sp-sparkline .values=${values} type=${type as any} width=${150} height=${32} color=${color} ?fill=${type==="area"}></sp-sparkline>
        </div>
      `)}
    </div>
  `,
};

export const InTable: Story = {
  name: "Dentro de tabla",
  render: () => html`
    <table style="border-collapse:collapse;font-size:14px;width:100%;max-width:580px;">
      <thead>
        <tr style="background:#f9fafb;">
          <th style="padding:10px 16px;text-align:left;border-bottom:1px solid #e5e7eb;">Métrica</th>
          <th style="padding:10px 16px;text-align:right;border-bottom:1px solid #e5e7eb;">Valor</th>
          <th style="padding:10px 16px;text-align:right;border-bottom:1px solid #e5e7eb;">7 días</th>
          <th style="padding:10px 16px;text-align:right;border-bottom:1px solid #e5e7eb;">Var.</th>
        </tr>
      </thead>
      <tbody>
        ${[
          { name: "Ingresos",  value: "$12,450", values: UP,      color: "#10b981", delta: "+23%" },
          { name: "Sesiones",  value: "8,234",   values: VOLATILE,color: "#3b82f6", delta: "+8%"  },
          { name: "Churn",     value: "2.1%",    values: DOWN,    color: "#ef4444", delta: "-12%" },
          { name: "NPS",       value: "72",      values: FLAT,    color: "#f59e0b", delta: "0%"   },
        ].map(({ name, value, values, color, delta }) => html`
          <tr style="border-bottom:1px solid #f3f4f6;">
            <td style="padding:10px 16px;">${name}</td>
            <td style="padding:10px 16px;text-align:right;font-weight:600;">${value}</td>
            <td style="padding:10px 16px;text-align:right;">
              <sp-sparkline .values=${values} type="line" width=${64} height=${24} color=${color}></sp-sparkline>
            </td>
            <td style="padding:10px 16px;text-align:right;font-weight:600;color:${color};">${delta}</td>
          </tr>
        `)}
      </tbody>
    </table>
  `,
};

export const PerformanceMetrics: Story = {
  name: "Métricas de sistema",
  render: () => html`
    <div style="background:#0f172a;padding:20px;border-radius:16px;display:flex;flex-direction:column;gap:10px;max-width:440px;">
      <p style="margin:0 0 6px;font-size:13px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:.08em;">Monitor del sistema</p>
      ${[
        { label: "CPU", value: "67%", values: VOLATILE, color: "#f87171", type: "area" },
        { label: "RAM", value: "4.2 GB", values: UP, color: "#60a5fa", type: "area" },
        { label: "Red", value: "12 MB/s", values: STEPS, color: "#34d399", type: "bar" },
        { label: "Disco", value: "23%", values: FLAT, color: "#a78bfa", type: "line" },
      ].map(({ label, value, values, color, type }) => html`
        <div style="display:flex;align-items:center;gap:12px;padding:10px 14px;background:#1e293b;border-radius:8px;">
          <span style="font-size:12px;font-weight:600;color:#94a3b8;width:36px;">${label}</span>
          <sp-sparkline .values=${values} type=${type as any} width=${120} height=${28} color=${color} ?fill=${type==="area"}></sp-sparkline>
          <span style="font-size:13px;font-weight:700;color:${color};margin-left:auto;white-space:nowrap;">${value}</span>
        </div>
      `)}
    </div>
  `,
};

export const SalesComparison: Story = {
  name: "Comparación de productos",
  render: () => html`
    <div style="max-width:480px;padding:20px;border:1px solid #e5e7eb;border-radius:14px;background:#fff;">
      <p style="margin:0 0 16px;font-size:14px;font-weight:700;color:#111827;">Ventas últimas 12 semanas</p>
      <div style="display:flex;flex-direction:column;gap:14px;">
        ${[
          { name: "Producto A", sku: "SKU-001", values: UP, color: "#6366f1", total: "$48,200", trend: "+18%" },
          { name: "Producto B", sku: "SKU-002", values: DOWN, color: "#ef4444", total: "$29,800", trend: "-7%" },
          { name: "Producto C", sku: "SKU-003", values: VOLATILE, color: "#f59e0b", total: "$35,600", trend: "+4%" },
        ].map(({ name, sku, values, color, total, trend }) => html`
          <div style="display:flex;align-items:center;gap:14px;padding:12px;border-radius:8px;border:1px solid #f3f4f6;background:#fafafa;">
            <div style="width:8px;height:40px;border-radius:4px;background:${color};flex-shrink:0;"></div>
            <div style="flex:1;min-width:0;">
              <p style="margin:0;font-size:13px;font-weight:600;color:#111827;">${name}</p>
              <p style="margin:2px 0 0;font-size:11px;color:#9ca3af;">${sku}</p>
            </div>
            <sp-sparkline .values=${values} type="area" width=${90} height=${32} color=${color} fill></sp-sparkline>
            <div style="text-align:right;flex-shrink:0;">
              <p style="margin:0;font-size:14px;font-weight:700;color:#111827;">${total}</p>
              <p style="margin:2px 0 0;font-size:12px;font-weight:600;color:${color};">${trend}</p>
            </div>
          </div>
        `)}
      </div>
    </div>
  `,
};

export const ActivityWeek: Story = {
  name: "Actividad semanal",
  render: () => html`
    <div style="max-width:560px;padding:20px;border:1px solid #e5e7eb;border-radius:14px;background:#fff;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
        <div>
          <p style="margin:0;font-size:15px;font-weight:700;color:#111827;">Actividad del equipo</p>
          <p style="margin:3px 0 0;font-size:13px;color:#6b7280;">Semana del 14 al 19 de abril</p>
        </div>
        <span style="background:#f0fdf4;color:#16a34a;font-size:12px;font-weight:600;padding:4px 10px;border-radius:20px;">+24% esta semana</span>
      </div>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;">
        ${[
          { label: "Commits", value: "142", values: UP, color: "#6366f1", type: "bar" },
          { label: "PRs abiertas", value: "28", values: STEPS, color: "#0ea5e9", type: "bar" },
          { label: "Issues cerradas", value: "67", values: VOLATILE, color: "#10b981", type: "bar" },
          { label: "Code reviews", value: "54", values: DOWN, color: "#f59e0b", type: "bar" },
          { label: "Deployments", value: "9", values: FLAT, color: "#8b5cf6", type: "bar" },
          { label: "Tests passed", value: "98%", values: UP, color: "#ec4899", type: "bar" },
        ].map(({ label, value, values, color, type }) => html`
          <div style="padding:14px;border-radius:10px;background:#f9fafb;border:1px solid #f3f4f6;">
            <p style="margin:0 0 8px;font-size:11px;color:#6b7280;font-weight:500;">${label}</p>
            <sp-sparkline .values=${values} type=${type as any} width=${130} height=${28} color=${color}></sp-sparkline>
            <p style="margin:8px 0 0;font-size:18px;font-weight:700;color:#111827;">${value}</p>
          </div>
        `)}
      </div>
    </div>
  `,
};

export const FinanzasStock: Story = {
  name: "Panel financiero",
  render: () => html`
    <div style="background:#0f172a;padding:24px;border-radius:16px;display:flex;flex-direction:column;gap:12px;max-width:420px;">
      ${[
        { ticker: "AAPL", name: "Apple Inc.",   price: "$187.42", delta: "+1.2%",  values: UP,       color: "#34d399" },
        { ticker: "TSLA", name: "Tesla Inc.",   price: "$242.80", delta: "-2.4%",  values: DOWN,     color: "#f87171" },
        { ticker: "NVDA", name: "NVIDIA Corp.", price: "$875.40", delta: "+3.8%",  values: VOLATILE,  color: "#60a5fa" },
        { ticker: "MSFT", name: "Microsoft",   price: "$415.20", delta: "+0.6%",  values: STEPS,    color: "#a78bfa" },
      ].map(({ ticker, name, price, delta, values, color }) => html`
        <div style="display:flex;align-items:center;justify-content:space-between;padding:12px 16px;background:#1e293b;border-radius:10px;">
          <div style="display:flex;flex-direction:column;gap:2px;">
            <span style="font-size:14px;font-weight:700;color:#f1f5f9;">${ticker}</span>
            <span style="font-size:11px;color:#64748b;">${name}</span>
          </div>
          <sp-sparkline .values=${values} type="line" width=${70} height=${28} color=${color}></sp-sparkline>
          <div style="text-align:right;">
            <p style="margin:0;font-size:14px;font-weight:700;color:#f1f5f9;">${price}</p>
            <p style="margin:0;font-size:12px;font-weight:600;color:${color};">${delta}</p>
          </div>
        </div>
      `)}
    </div>
  `,
};

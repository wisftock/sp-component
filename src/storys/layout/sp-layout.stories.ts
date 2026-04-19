import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "../../components/layout/sp-layout.js";

const BOX = (label: string, color = "#e0e7ff") =>
  `<div style="padding:16px;background:${color};border-radius:6px;text-align:center;font-size:13px;font-weight:500;color:#374151;">${label}</div>`;

const meta: Meta = {
  title: "Components/Layout",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "Primitivos de layout: `sp-stack` (flexbox), `sp-grid` (CSS Grid) y `sp-container` (ancho máximo centrado).",
      },
    },
  },
};

export default meta;
type Story = StoryObj;

// ── sp-stack ────────────────────────────────────────────────────────────────

export const StackVertical: Story = {
  name: "Stack — vertical (column)",
  render: () => html`
    <sp-stack gap="12px" style="max-width:300px;">
      ${[1, 2, 3].map(n => html`<div .innerHTML=${BOX(`Ítem ${n}`)}></div>`)}
    </sp-stack>
  `,
};

export const StackHorizontal: Story = {
  name: "Stack — horizontal (row)",
  render: () => html`
    <sp-stack direction="row" gap="12px" align="center">
      ${["Inicio", "Dashboard", "Reportes", "Configuración"].map(l => html`
        <div .innerHTML=${BOX(l, "#f0fdf4")}></div>
      `)}
    </sp-stack>
  `,
};

export const StackJustify: Story = {
  name: "Stack — justify variants",
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:16px;max-width:600px;">
      ${(["start","center","end","between","around"] as const).map(j => html`
        <div>
          <p style="margin:0 0 6px;font-size:11px;color:#9ca3af;font-weight:600;text-transform:uppercase;">justify="${j}"</p>
          <sp-stack direction="row" justify=${j} gap="8px" full
            style="background:#f9fafb;border-radius:8px;padding:8px;border:1px solid #f3f4f6;">
            ${["A","B","C"].map(l => html`<div .innerHTML=${BOX(l, "#e0e7ff")}></div>`)}
          </sp-stack>
        </div>
      `)}
    </div>
  `,
};

export const StackWrap: Story = {
  name: "Stack — wrap",
  render: () => html`
    <sp-stack direction="row" gap="8px" wrap full style="max-width:380px;">
      ${["Dashboard","Usuarios","Reportes","Pagos","Productos","Inventario","Configuración","Soporte"].map(l => html`
        <div style="padding:8px 16px;background:#f0f9ff;border-radius:20px;font-size:13px;color:#0ea5e9;font-weight:500;border:1px solid #bae6fd;">${l}</div>
      `)}
    </sp-stack>
  `,
};

// ── sp-grid ─────────────────────────────────────────────────────────────────

export const Grid3Cols: Story = {
  name: "Grid — 3 columnas",
  render: () => html`
    <sp-grid cols="3" gap="16px" style="max-width:700px;">
      ${Array.from({ length: 6 }, (_, i) => html`
        <div .innerHTML=${BOX(`Celda ${i + 1}`, i % 2 === 0 ? "#f5f3ff" : "#fef3c7")}></div>
      `)}
    </sp-grid>
  `,
};

export const GridCustomCols: Story = {
  name: "Grid — columnas personalizadas",
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:20px;max-width:700px;">
      <div>
        <p style="margin:0 0 8px;font-size:12px;color:#9ca3af;font-weight:600;">cols="1fr 2fr 1fr"</p>
        <sp-grid cols="1fr 2fr 1fr" gap="12px">
          <div .innerHTML=${BOX("Sidebar")}></div>
          <div .innerHTML=${BOX("Contenido principal", "#dcfce7")}></div>
          <div .innerHTML=${BOX("Panel")}></div>
        </sp-grid>
      </div>
      <div>
        <p style="margin:0 0 8px;font-size:12px;color:#9ca3af;font-weight:600;">cols="repeat(auto-fit, minmax(140px, 1fr))"</p>
        <sp-grid cols="repeat(auto-fit, minmax(140px, 1fr))" gap="12px">
          ${["Ventas","Usuarios","Tráfico","Conversión","NPS","Churn"].map(l => html`
            <div .innerHTML=${BOX(l, "#fef9c3")}></div>
          `)}
        </sp-grid>
      </div>
    </div>
  `,
};

export const GridDashboard: Story = {
  name: "Grid — layout de dashboard",
  render: () => html`
    <sp-grid cols="3" gap="16px" style="max-width:760px;">
      <div style="grid-column:span 2;">
        <div style="height:140px;background:linear-gradient(135deg,#6366f1,#8b5cf6);border-radius:12px;display:flex;align-items:center;padding:24px;">
          <div>
            <p style="margin:0;color:#c7d2fe;font-size:13px;">Ingresos del mes</p>
            <p style="margin:6px 0 0;color:white;font-size:32px;font-weight:800;">$84,250</p>
          </div>
        </div>
      </div>
      <div>
        <div style="height:140px;background:#f0fdf4;border-radius:12px;border:1px solid #bbf7d0;display:flex;align-items:center;padding:20px;">
          <div>
            <p style="margin:0;color:#4ade80;font-size:13px;">Usuarios activos</p>
            <p style="margin:6px 0 0;color:#16a34a;font-size:28px;font-weight:800;">12,847</p>
          </div>
        </div>
      </div>
      ${["Tasa conversión · 4.6%", "NPS Score · 72", "Churn · 2.1%"].map(t => html`
        <div .innerHTML=${BOX(t, "#fafafa")} style="border:1px solid #f3f4f6;border-radius:12px;"></div>
      `)}
    </sp-grid>
  `,
};

// ── sp-container ─────────────────────────────────────────────────────────────

export const ContainerSizes: Story = {
  name: "Container — tamaños",
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:12px;background:#f9fafb;padding:16px;border-radius:12px;">
      ${(["sm","md","lg","xl","2xl"] as const).map(size => html`
        <div style="position:relative;">
          <p style="margin:0 0 4px;font-size:11px;color:#9ca3af;font-weight:600;">size="${size}"</p>
          <sp-container size=${size}>
            <div style="padding:10px 16px;background:#e0e7ff;border-radius:6px;font-size:13px;font-weight:500;color:#4338ca;text-align:center;">
              ${size} — ${{"sm":"640px","md":"768px","lg":"1024px","xl":"1280px","2xl":"1536px"}[size]}
            </div>
          </sp-container>
        </div>
      `)}
    </div>
  `,
};

export const ContainerPage: Story = {
  name: "Container — layout de página",
  render: () => html`
    <div style="background:#f3f4f6;padding:24px 0;border-radius:12px;">
      <sp-container size="lg" padded>
        <sp-stack gap="20px">
          <div style="padding:20px;background:white;border-radius:12px;border:1px solid #e5e7eb;">
            <p style="margin:0 0 4px;font-size:18px;font-weight:700;color:#111827;">Encabezado de página</p>
            <p style="margin:0;font-size:14px;color:#6b7280;">Subtítulo descriptivo con contexto adicional</p>
          </div>
          <sp-grid cols="3" gap="16px">
            ${["Módulo A","Módulo B","Módulo C"].map(l => html`
              <div style="padding:20px;background:white;border-radius:12px;border:1px solid #e5e7eb;">
                <p style="margin:0;font-size:14px;font-weight:600;color:#111827;">${l}</p>
                <p style="margin:8px 0 0;font-size:13px;color:#6b7280;">Contenido del módulo aquí.</p>
              </div>
            `)}
          </sp-grid>
        </sp-stack>
      </sp-container>
    </div>
  `,
};

export const LayoutComposed: Story = {
  name: "Composición completa",
  render: () => html`
    <sp-container size="xl" padded>
      <sp-stack gap="24px">
        <!-- Header -->
        <sp-stack direction="row" justify="between" align="center">
          <div>
            <p style="margin:0;font-size:20px;font-weight:800;color:#111827;">Mi aplicación</p>
            <p style="margin:2px 0 0;font-size:13px;color:#6b7280;">Panel de administración</p>
          </div>
          <sp-stack direction="row" gap="8px">
            <button style="padding:8px 16px;border:1px solid #d1d5db;background:white;border-radius:8px;cursor:pointer;font-size:13px;">Exportar</button>
            <button style="padding:8px 16px;background:#6366f1;color:white;border:none;border-radius:8px;cursor:pointer;font-size:13px;font-weight:600;">+ Nuevo</button>
          </sp-stack>
        </sp-stack>
        <!-- KPIs -->
        <sp-grid cols="4" gap="12px">
          ${[
            { label: "Ingresos", value: "$84,250", color: "#6366f1", bg: "#f5f3ff" },
            { label: "Usuarios", value: "12,847", color: "#0ea5e9", bg: "#f0f9ff" },
            { label: "Pedidos", value: "3,421", color: "#10b981", bg: "#f0fdf4" },
            { label: "NPS", value: "72", color: "#f59e0b", bg: "#fffbeb" },
          ].map(({ label, value, color, bg }) => html`
            <div style="padding:16px;background:${bg};border-radius:10px;border:1px solid ${color}22;">
              <p style="margin:0;font-size:12px;color:#6b7280;">${label}</p>
              <p style="margin:4px 0 0;font-size:22px;font-weight:800;color:${color};">${value}</p>
            </div>
          `)}
        </sp-grid>
        <!-- Content -->
        <sp-stack direction="row" gap="16px" align="start">
          <div style="flex:1;padding:20px;background:white;border-radius:12px;border:1px solid #e5e7eb;">
            <p style="margin:0 0 12px;font-size:15px;font-weight:700;color:#111827;">Actividad reciente</p>
            ${["Pedido #1284 completado","Usuario María registrada","Pago procesado $420"].map(t => html`
              <div style="padding:10px 0;border-bottom:1px solid #f3f4f6;font-size:13px;color:#374151;">${t}</div>
            `)}
          </div>
          <div style="width:240px;padding:20px;background:white;border-radius:12px;border:1px solid #e5e7eb;">
            <p style="margin:0 0 12px;font-size:15px;font-weight:700;color:#111827;">Accesos rápidos</p>
            <sp-stack gap="8px">
              ${["Usuarios","Reportes","Configuración","Soporte"].map(l => html`
                <button style="width:100%;padding:9px 12px;background:#f9fafb;border:1px solid #f3f4f6;border-radius:8px;cursor:pointer;font-size:13px;text-align:left;color:#374151;">${l}</button>
              `)}
            </sp-stack>
          </div>
        </sp-stack>
      </sp-stack>
    </sp-container>
  `,
};

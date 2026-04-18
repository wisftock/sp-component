import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "../../components/layout/sp-stack.js";
import "../../components/layout/sp-grid.js";
import "../../components/layout/sp-container.js";

const BOX = (label: string, color = "#e0e7ff") =>
  `<div style="padding:16px;background:${color};border-radius:6px;text-align:center;font-size:13px;font-weight:500;">${label}</div>`;

export default {
  title: "Components/Layout",
  tags: ["autodocs"],
} as Meta;

type Story = StoryObj;

export const Stack: Story = {
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:24px;">
      <div>
        <p style="font-size:13px;color:#6b7280;margin:0 0 8px;">Dirección: column (default)</p>
        <sp-stack gap="12px">
          ${["Item 1","Item 2","Item 3"].map(l => html`<div style="padding:12px;background:#e0e7ff;border-radius:6px;font-size:13px;">${l}</div>`)}
        </sp-stack>
      </div>
      <div>
        <p style="font-size:13px;color:#6b7280;margin:0 0 8px;">Dirección: row</p>
        <sp-stack direction="row" gap="12px" align="center">
          ${["A","B","C","D"].map(l => html`<div style="padding:12px 20px;background:#dbeafe;border-radius:6px;font-size:13px;">${l}</div>`)}
        </sp-stack>
      </div>
    </div>
  `,
};

export const Grid: Story = {
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:24px;">
      <div>
        <p style="font-size:13px;color:#6b7280;margin:0 0 8px;">3 columnas</p>
        <sp-grid cols=${3} gap="16px">
          ${Array.from({ length: 6 }, (_, i) => html`<div style="padding:20px;background:#e0e7ff;border-radius:6px;text-align:center;font-size:13px;">Col ${i+1}</div>`)}
        </sp-grid>
      </div>
      <div>
        <p style="font-size:13px;color:#6b7280;margin:0 0 8px;">4 columnas</p>
        <sp-grid cols=${4} gap="12px">
          ${Array.from({ length: 8 }, (_, i) => html`<div style="padding:16px;background:#dbeafe;border-radius:6px;text-align:center;font-size:13px;">Item ${i+1}</div>`)}
        </sp-grid>
      </div>
    </div>
  `,
};

export const Container: Story = {
  render: () => html`
    <div style="background:#f1f5f9;padding:16px;border-radius:8px;">
      <sp-container size="md" padded>
        <div style="background:white;border-radius:8px;padding:24px;">
          <h2 style="margin:0 0 12px;font-size:18px;">Contenedor centrado</h2>
          <p style="margin:0;color:#6b7280;font-size:14px;">El componente sp-container limita el ancho máximo y centra el contenido horizontalmente. Útil para páginas con layout de columna central.</p>
        </div>
      </sp-container>
    </div>
  `,
};

export const PageLayout: Story = {
  render: () => html`
    <sp-container size="xl" padded>
      <sp-stack direction="column" gap="24px">
        <div style="padding:16px;background:#1e293b;border-radius:8px;color:white;font-weight:600;">Navbar</div>
        <sp-stack direction="row" gap="24px" align="stretch">
          <div style="width:200px;padding:16px;background:#f1f5f9;border-radius:8px;">
            <p style="margin:0;font-size:13px;font-weight:600;color:#374151;">Sidebar</p>
          </div>
          <sp-stack gap="16px" full>
            <sp-grid cols=${3} gap="16px">
              ${["Métricas","Ventas","Usuarios"].map(t => html`
                <div style="padding:20px;background:#e0e7ff;border-radius:8px;">
                  <p style="margin:0;font-size:13px;color:#6b7280;">${t}</p>
                  <p style="margin:4px 0 0;font-size:24px;font-weight:700;">${Math.floor(Math.random()*1000)}</p>
                </div>
              `)}
            </sp-grid>
            <div style="padding:24px;background:white;border-radius:8px;border:1px solid #e5e7eb;">
              <p style="margin:0;font-size:14px;color:#374151;">Contenido principal de la página.</p>
            </div>
          </sp-stack>
        </sp-stack>
      </sp-stack>
    </sp-container>
  `,
};

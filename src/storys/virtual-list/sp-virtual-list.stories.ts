import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "../../components/virtual-list/sp-virtual-list.js";
import type { SpVirtualListComponent } from "../../components/virtual-list/sp-virtual-list.js";

const USERS = Array.from({ length: 10_000 }, (_, i) => ({
  id: i + 1,
  name: `Usuario #${String(i + 1).padStart(5, "0")}`,
  email: `user${i + 1}@empresa.com`,
  role: ["Admin", "Editor", "Viewer", "Manager"][i % 4],
  status: i % 7 === 0 ? "inactivo" : "activo",
}));

const LOGS = Array.from({ length: 5_000 }, (_, i) => ({
  id: i,
  level: (["INFO", "WARN", "ERROR", "DEBUG"] as const)[i % 4],
  message: `[${new Date(Date.now() - i * 3000).toISOString()}] Evento del sistema #${i}`,
  ts: Date.now() - i * 3000,
}));

const meta: Meta = {
  title: "Components/VirtualList",
  component: "sp-virtual-list",
  tags: ["autodocs"],
  argTypes: {
    "item-height": { control: "number" },
    height:        { control: "text" },
    buffer:        { control: "number" },
  },
  args: { "item-height": 48, height: "400px", buffer: 3 },
  render: ({ "item-height": itemHeight, height, buffer }: any) => {
    const items = USERS.slice(0, 100);
    return html`
      <sp-virtual-list
        .items=${items}
        .renderItem=${(item: any) => html`
          <div style="display:flex;align-items:center;gap:12px;padding:0 16px;height:100%;border-bottom:1px solid #f3f4f6;">
            <div style="width:32px;height:32px;border-radius:50%;background:#e0e7ff;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;color:#6366f1;flex-shrink:0;">
              ${item.id % 100}
            </div>
            <div>
              <p style="margin:0;font-size:13px;font-weight:600;color:#111827;">${item.name}</p>
              <p style="margin:0;font-size:11px;color:#9ca3af;">${item.email}</p>
            </div>
          </div>
        `}
        item-height=${itemHeight}
        height=${height}
        buffer=${buffer}
      ></sp-virtual-list>
    `;
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const TenThousandRows: Story = {
  name: "10,000 filas",
  render: () => html`
    <div style="max-width:600px;">
      <div style="padding:12px 16px;background:#f0fdf4;border-radius:8px;border:1px solid #bbf7d0;margin-bottom:12px;display:flex;align-items:center;gap:8px;">
        <span style="font-size:16px;">⚡</span>
        <p style="margin:0;font-size:13px;color:#16a34a;font-weight:500;">
          Renderizando solo los ítems visibles de una lista de <strong>10,000 usuarios</strong>.
        </p>
      </div>
      <sp-virtual-list
        .items=${USERS}
        .renderItem=${(item: any) => html`
          <div style="display:flex;align-items:center;gap:12px;padding:0 16px;height:100%;border-bottom:1px solid #f3f4f6;background:white;">
            <div style="width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#6366f1,#8b5cf6);display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;color:white;flex-shrink:0;">
              ${String(item.name).slice(-2)}
            </div>
            <div style="flex:1;min-width:0;">
              <p style="margin:0;font-size:13px;font-weight:600;color:#111827;">${item.name}</p>
              <p style="margin:0;font-size:11px;color:#9ca3af;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${item.email}</p>
            </div>
            <span style="padding:3px 8px;border-radius:12px;font-size:11px;font-weight:600;
              background:${item.role === 'Admin' ? '#fef3c7' : item.role === 'Manager' ? '#eff6ff' : '#f9fafb'};
              color:${item.role === 'Admin' ? '#92400e' : item.role === 'Manager' ? '#3b82f6' : '#6b7280'};">
              ${item.role}
            </span>
            <span style="width:8px;height:8px;border-radius:50%;flex-shrink:0;background:${item.status === 'activo' ? '#10b981' : '#d1d5db'};"></span>
          </div>
        `}
        item-height="56"
        height="500px"
      ></sp-virtual-list>
    </div>
  `,
};

export const LogViewer: Story = {
  name: "Visor de logs (5,000 entradas)",
  render: () => html`
    <div style="max-width:700px;">
      <div style="padding:10px 16px;background:#0f172a;border-radius:8px 8px 0 0;display:flex;align-items:center;justify-content:space-between;">
        <span style="font-size:13px;font-weight:600;color:#94a3b8;font-family:monospace;">system.log — 5,000 líneas</span>
        <div style="display:flex;gap:6px;">
          ${["ERROR","WARN","INFO","DEBUG"].map((lvl, i) => html`
            <span style="padding:2px 8px;border-radius:4px;font-size:10px;font-weight:700;font-family:monospace;
              background:${["#7f1d1d","#78350f","#1e3a5f","#064e3b"][i]};
              color:${["#fca5a5","#fcd34d","#93c5fd","#6ee7b7"][i]};">${lvl}</span>
          `)}
        </div>
      </div>
      <sp-virtual-list
        .items=${LOGS}
        .renderItem=${(item: any) => html`
          <div style="display:flex;align-items:center;gap:10px;padding:0 14px;height:100%;font-family:monospace;font-size:12px;
            border-bottom:1px solid #1e293b;
            background:${item.level === 'ERROR' ? '#1c0a0a' : item.level === 'WARN' ? '#1c1407' : '#0f172a'};">
            <span style="flex-shrink:0;padding:1px 6px;border-radius:3px;font-size:10px;font-weight:700;
              background:${item.level==='ERROR'?'#7f1d1d':item.level==='WARN'?'#78350f':item.level==='DEBUG'?'#064e3b':'#1e3a5f'};
              color:${item.level==='ERROR'?'#fca5a5':item.level==='WARN'?'#fcd34d':item.level==='DEBUG'?'#6ee7b7':'#93c5fd'};">
              ${item.level}
            </span>
            <span style="color:#64748b;white-space:nowrap;">#${item.id}</span>
            <span style="color:#94a3b8;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${item.message}</span>
          </div>
        `}
        item-height="36"
        height="480px"
        style="border-radius:0 0 8px 8px;overflow:hidden;"
      ></sp-virtual-list>
    </div>
  `,
};

export const ScrollToIndex: Story = {
  name: "scrollToIndex()",
  render: () => {
    let listRef: SpVirtualListComponent | null = null;
    return html`
      <div style="max-width:500px;">
        <div style="display:flex;gap:8px;margin-bottom:12px;flex-wrap:wrap;">
          ${[0, 999, 2499, 4999, 7500, 9999].map(idx => html`
            <button
              style="padding:7px 14px;background:#6366f1;color:white;border:none;border-radius:6px;cursor:pointer;font-size:13px;font-weight:500;"
              @click=${() => listRef?.scrollToIndex(idx)}
            >
              Ir al #${idx + 1}
            </button>
          `)}
        </div>
        <sp-virtual-list
          .items=${USERS}
          .renderItem=${(item: any) => html`
            <div style="display:flex;align-items:center;gap:12px;padding:0 16px;height:100%;border-bottom:1px solid #f3f4f6;">
              <span style="font-size:12px;color:#9ca3af;font-family:monospace;width:52px;flex-shrink:0;">#${item.id}</span>
              <p style="margin:0;font-size:13px;font-weight:500;color:#111827;">${item.name}</p>
              <span style="margin-left:auto;font-size:11px;color:#6b7280;">${item.role}</span>
            </div>
          `}
          item-height="48"
          height="400px"
          ${(el: SpVirtualListComponent) => { listRef = el; }}
        ></sp-virtual-list>
      </div>
    `;
  },
};

export const ItemClickEvent: Story = {
  name: "Evento sp-item-click",
  render: () => html`
    <div style="display:flex;gap:16px;max-width:700px;align-items:flex-start;">
      <sp-virtual-list
        .items=${USERS.slice(0, 50)}
        .renderItem=${(item: any) => html`
          <div style="display:flex;align-items:center;gap:10px;padding:0 14px;height:100%;border-bottom:1px solid #f3f4f6;cursor:pointer;transition:background .1s;"
            onmouseenter="this.style.background='#f5f3ff'" onmouseleave="this.style.background='transparent'">
            <span style="font-size:11px;color:#9ca3af;width:30px;">#${item.id}</span>
            <p style="margin:0;font-size:13px;font-weight:500;color:#111827;">${item.name}</p>
          </div>
        `}
        item-height="44"
        height="360px"
        style="flex:1;"
        @sp-item-click=${(e: CustomEvent) => {
          const panel = document.getElementById("vl-detail");
          if (!panel) return;
          const { item } = e.detail;
          panel.innerHTML = `
            <p style="margin:0 0 16px;font-size:14px;font-weight:700;color:#111827;">Detalle del usuario</p>
            ${[["ID", item.id],["Nombre", item.name],["Email", item.email],["Rol", item.role],["Estado", item.status]]
              .map(([k,v]) => `<div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #f3f4f6;font-size:13px;">
                <span style="color:#6b7280;">${k}</span>
                <span style="font-weight:600;color:#111827;">${v}</span>
              </div>`).join("")}
          `;
        }}
      ></sp-virtual-list>
      <div id="vl-detail" style="flex:1;padding:16px;background:#f9fafb;border-radius:10px;border:1px solid #e5e7eb;min-height:200px;">
        <p style="margin:0;font-size:13px;color:#9ca3af;text-align:center;margin-top:60px;">Haz click en un usuario</p>
      </div>
    </div>
  `,
};

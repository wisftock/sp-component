import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "../../components/drawer/sp-drawer.js";

const meta: Meta = {
  title: "Components/Drawer",
  component: "sp-drawer",
  tags: ["autodocs"],
  argTypes: {
    open: { control: "boolean" },
    label: { control: "text" },
    placement: { control: "select", options: ["right","left","top","bottom"] },
    size: { control: "select", options: ["sm","md","lg","full"] },
    closable: { control: "boolean" },
    "close-on-overlay": { control: "boolean" },
  },
  args: { open: true, label: "Configuración", placement: "right", size: "md", closable: true, "close-on-overlay": true },
  render: ({ open, label, placement, size, closable }) => html`
    <sp-drawer
      ?open=${open}
      label=${label}
      placement=${placement}
      size=${size}
      ?closable=${closable}
    >
      <div style="padding:16px;">
        <p style="margin:0 0 12px;color:#374151;">Contenido del drawer. Puede contener formularios, listas u otros componentes.</p>
        <p style="margin:0;color:#6b7280;font-size:14px;">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
      </div>
    </sp-drawer>
  `,
};

export default meta;
type Story = StoryObj;

export const Right: Story = { args: { placement: "right" } };
export const Left: Story = { args: { placement: "left" } };
export const Top: Story = { args: { placement: "top" } };
export const Bottom: Story = { args: { placement: "bottom" } };
export const Large: Story = { args: { size: "lg" } };
export const Small: Story = { args: { size: "sm" } };

export const WithFooter: Story = {
  render: () => html`
    <sp-drawer open label="Editar perfil" placement="right" size="md" closable>
      <div style="padding:16px;display:flex;flex-direction:column;gap:12px;">
        <div>
          <label style="font-size:13px;font-weight:500;display:block;margin-bottom:4px;">Nombre</label>
          <input type="text" value="Ana García" style="width:100%;padding:8px;border:1px solid #d1d5db;border-radius:4px;font-size:14px;box-sizing:border-box;" />
        </div>
        <div>
          <label style="font-size:13px;font-weight:500;display:block;margin-bottom:4px;">Email</label>
          <input type="email" value="ana@empresa.com" style="width:100%;padding:8px;border:1px solid #d1d5db;border-radius:4px;font-size:14px;box-sizing:border-box;" />
        </div>
      </div>
      <div slot="footer" style="display:flex;gap:8px;justify-content:flex-end;padding:16px;border-top:1px solid #e5e7eb;">
        <button style="padding:8px 16px;border:1px solid #d1d5db;background:white;border-radius:4px;cursor:pointer;">Cancelar</button>
        <button style="padding:8px 16px;background:#3b82f6;color:white;border:none;border-radius:4px;cursor:pointer;">Guardar</button>
      </div>
    </sp-drawer>
  `,
};

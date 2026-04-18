import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "../../components/menu-root/sp-menu-root.js";
import "../../components/menu-root/sp-menu-trigger.js";
import "../../components/menu-root/sp-menu-content.js";
import "../../components/menu-root/sp-menu-item.js";
import "../../components/menu-root/sp-menu-separator.js";

const meta: Meta = {
  title: "Components/MenuRoot",
  component: "sp-menu-root",
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <sp-menu-root>
      <sp-menu-trigger>
        <button style="padding:8px 16px;border:1px solid #d1d5db;background:white;border-radius:6px;cursor:pointer;font-size:14px;display:flex;align-items:center;gap:6px;">
          Acciones ▼
        </button>
      </sp-menu-trigger>
      <sp-menu-content>
        <sp-menu-option value="edit">✏️ Editar</sp-menu-option>
        <sp-menu-option value="duplicate">📋 Duplicar</sp-menu-option>
        <sp-menu-separator></sp-menu-separator>
        <sp-menu-option value="delete" danger>🗑️ Eliminar</sp-menu-option>
      </sp-menu-content>
    </sp-menu-root>
  `,
};

export const WithIcon: Story = {
  render: () => html`
    <sp-menu-root>
      <sp-menu-trigger>
        <button style="padding:8px;border:1px solid #d1d5db;background:white;border-radius:6px;cursor:pointer;display:flex;align-items:center;justify-content:center;width:36px;height:36px;">
          ⋯
        </button>
      </sp-menu-trigger>
      <sp-menu-content>
        <sp-menu-option value="view">Ver detalles</sp-menu-option>
        <sp-menu-option value="share">Compartir</sp-menu-option>
        <sp-menu-option value="download">Descargar</sp-menu-option>
        <sp-menu-separator></sp-menu-separator>
        <sp-menu-option value="delete" danger>Eliminar</sp-menu-option>
      </sp-menu-content>
    </sp-menu-root>
  `,
};

export const InTable: Story = {
  render: () => html`
    <table style="border-collapse:collapse;width:100%;font-size:14px;">
      <thead>
        <tr style="background:#f9fafb;border-bottom:1px solid #e5e7eb;">
          <th style="padding:10px 16px;text-align:left;">Nombre</th>
          <th style="padding:10px 16px;text-align:left;">Estado</th>
          <th style="padding:10px 16px;text-align:right;">Acciones</th>
        </tr>
      </thead>
      <tbody>
        ${["Ana García","Carlos López","María Torres"].map(name => html`
          <tr style="border-bottom:1px solid #f3f4f6;">
            <td style="padding:10px 16px;">${name}</td>
            <td style="padding:10px 16px;"><span style="background:#d1fae5;color:#065f46;padding:2px 8px;border-radius:12px;font-size:12px;">Activo</span></td>
            <td style="padding:10px 16px;text-align:right;">
              <sp-menu-root>
                <sp-menu-trigger>
                  <button style="padding:4px 8px;border:1px solid #e5e7eb;background:white;border-radius:4px;cursor:pointer;font-size:12px;">⋯</button>
                </sp-menu-trigger>
                <sp-menu-content>
                  <sp-menu-option value="edit">Editar</sp-menu-option>
                  <sp-menu-option value="delete" danger>Eliminar</sp-menu-option>
                </sp-menu-content>
              </sp-menu-root>
            </td>
          </tr>
        `)}
      </tbody>
    </table>
  `,
};

import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "../../components/toolbar/sp-toolbar.js";

const meta: Meta = {
  title: "Components/Toolbar",
  component: "sp-toolbar",
  tags: ["autodocs"],
  argTypes: {
    orientation: { control: "select", options: ["horizontal","vertical"] },
    label: { control: "text" },
    flush: { control: "boolean", description: "Sin bordes ni fondo" },
  },
  args: { orientation: "horizontal", label: "Editor toolbar", flush: false },
};

export default meta;
type Story = StoryObj;

const ToolBtn = (icon: string, title: string) =>
  `<button title="${title}" style="padding:6px 8px;border:none;background:none;cursor:pointer;border-radius:4px;font-size:14px;" aria-label="${title}">${icon}</button>`;

export const TextEditor: Story = {
  render: () => html`
    <sp-toolbar label="Editor de texto">
      ${["B","I","U"].map(f => html`<button title=${f} style="padding:6px 10px;border:none;background:none;cursor:pointer;border-radius:4px;font-size:14px;font-weight:bold;">${f}</button>`)}
      <sp-toolbar-sep></sp-toolbar-sep>
      <button title="Alinear izquierda" style="padding:6px 8px;border:none;background:none;cursor:pointer;border-radius:4px;">⬅</button>
      <button title="Centrar" style="padding:6px 8px;border:none;background:none;cursor:pointer;border-radius:4px;">↔</button>
      <button title="Alinear derecha" style="padding:6px 8px;border:none;background:none;cursor:pointer;border-radius:4px;">➡</button>
      <sp-toolbar-sep></sp-toolbar-sep>
      <button title="Lista" style="padding:6px 8px;border:none;background:none;cursor:pointer;border-radius:4px;">☰</button>
      <button title="Enlace" style="padding:6px 8px;border:none;background:none;cursor:pointer;border-radius:4px;">🔗</button>
      <button title="Imagen" style="padding:6px 8px;border:none;background:none;cursor:pointer;border-radius:4px;">🖼</button>
    </sp-toolbar>
  `,
};

export const Vertical: Story = {
  render: () => html`
    <div style="display:flex;gap:16px;">
      <sp-toolbar label="Herramientas" orientation="vertical">
        <button title="Seleccionar" style="padding:8px;border:none;background:none;cursor:pointer;border-radius:4px;font-size:16px;">↖</button>
        <button title="Mover" style="padding:8px;border:none;background:none;cursor:pointer;border-radius:4px;font-size:16px;">✥</button>
        <sp-toolbar-sep></sp-toolbar-sep>
        <button title="Rectángulo" style="padding:8px;border:none;background:none;cursor:pointer;border-radius:4px;font-size:16px;">⬜</button>
        <button title="Círculo" style="padding:8px;border:none;background:none;cursor:pointer;border-radius:4px;font-size:16px;">⭕</button>
        <button title="Línea" style="padding:8px;border:none;background:none;cursor:pointer;border-radius:4px;font-size:16px;">╱</button>
        <sp-toolbar-sep></sp-toolbar-sep>
        <button title="Texto" style="padding:8px;border:none;background:none;cursor:pointer;border-radius:4px;font-size:16px;">T</button>
      </sp-toolbar>
      <div style="flex:1;height:200px;background:#f1f5f9;border-radius:8px;border:1px dashed #cbd5e1;"></div>
    </div>
  `,
};

export const Flush: Story = {
  render: () => html`
    <sp-toolbar label="Acciones" flush>
      <button style="padding:6px 12px;border:none;background:none;cursor:pointer;border-radius:4px;font-size:13px;color:#374151;">Deshacer</button>
      <button style="padding:6px 12px;border:none;background:none;cursor:pointer;border-radius:4px;font-size:13px;color:#374151;">Rehacer</button>
      <sp-toolbar-sep></sp-toolbar-sep>
      <button style="padding:6px 12px;border:none;background:none;cursor:pointer;border-radius:4px;font-size:13px;color:#3b82f6;">Guardar</button>
    </sp-toolbar>
  `,
};

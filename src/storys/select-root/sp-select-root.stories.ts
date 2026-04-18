import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "../../components/select-root/sp-select-root.js";
import "../../components/select-root/sp-select-trigger.js";
import "../../components/select-root/sp-select-content.js";
import "../../components/select-root/sp-select-item.js";

const meta: Meta = {
  title: "Components/SelectRoot",
  component: "sp-select-root",
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <sp-select-root>
      <sp-select-trigger placeholder="Seleccionar opción..."></sp-select-trigger>
      <sp-select-content>
        <sp-select-item value="option1">Opción 1</sp-select-item>
        <sp-select-item value="option2">Opción 2</sp-select-item>
        <sp-select-item value="option3">Opción 3</sp-select-item>
      </sp-select-content>
    </sp-select-root>
  `,
};

export const Countries: Story = {
  render: () => html`
    <sp-select-root>
      <sp-select-trigger placeholder="Seleccionar país"></sp-select-trigger>
      <sp-select-content>
        <sp-select-item value="co">🇨🇴 Colombia</sp-select-item>
        <sp-select-item value="mx">🇲🇽 México</sp-select-item>
        <sp-select-item value="ar">🇦🇷 Argentina</sp-select-item>
        <sp-select-item value="cl">🇨🇱 Chile</sp-select-item>
        <sp-select-item value="pe">🇵🇪 Perú</sp-select-item>
        <sp-select-item value="es">🇪🇸 España</sp-select-item>
      </sp-select-content>
    </sp-select-root>
  `,
};

export const WithDisabledItem: Story = {
  render: () => html`
    <sp-select-root>
      <sp-select-trigger placeholder="Seleccionar plan"></sp-select-trigger>
      <sp-select-content>
        <sp-select-item value="free">Free — $0/mes</sp-select-item>
        <sp-select-item value="pro">Pro — $29/mes</sp-select-item>
        <sp-select-item value="enterprise" disabled>Enterprise — Contactar ventas</sp-select-item>
      </sp-select-content>
    </sp-select-root>
  `,
};

export const InForm: Story = {
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:16px;max-width:360px;">
      <div>
        <label style="font-size:14px;font-weight:500;display:block;margin-bottom:6px;">Rol del usuario</label>
        <sp-select-root>
          <sp-select-trigger placeholder="Seleccionar rol"></sp-select-trigger>
          <sp-select-content>
            <sp-select-item value="admin">Administrador</sp-select-item>
            <sp-select-item value="editor">Editor</sp-select-item>
            <sp-select-item value="viewer">Lector</sp-select-item>
          </sp-select-content>
        </sp-select-root>
      </div>
      <div>
        <label style="font-size:14px;font-weight:500;display:block;margin-bottom:6px;">Departamento</label>
        <sp-select-root>
          <sp-select-trigger placeholder="Seleccionar departamento"></sp-select-trigger>
          <sp-select-content>
            <sp-select-item value="eng">Ingeniería</sp-select-item>
            <sp-select-item value="design">Diseño</sp-select-item>
            <sp-select-item value="marketing">Marketing</sp-select-item>
            <sp-select-item value="hr">Recursos Humanos</sp-select-item>
          </sp-select-content>
        </sp-select-root>
      </div>
    </div>
  `,
};

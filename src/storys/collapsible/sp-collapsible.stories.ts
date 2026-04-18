import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "../../components/collapsible/sp-collapsible.js";

const meta: Meta = {
  title: "Components/Collapsible",
  component: "sp-collapsible",
  tags: ["autodocs"],
  argTypes: {
    open: { control: "boolean", description: "Estado abierto/cerrado" },
    disabled: { control: "boolean" },
  },
  args: { open: false, disabled: false },
  render: ({ open, disabled }) => html`
    <sp-collapsible ?open=${open} ?disabled=${disabled}>
      <span slot="trigger">Ver detalles</span>
      <div style="padding:16px;background:#f9fafb;border-radius:0 0 8px 8px;border:1px solid #e5e7eb;border-top:none;">
        <p style="margin:0;color:#374151;">Este contenido se muestra u oculta al hacer clic en el trigger. Puede contener cualquier elemento HTML.</p>
      </div>
    </sp-collapsible>
  `,
};

export default meta;
type Story = StoryObj;

export const Closed: Story = { args: { open: false } };
export const Open: Story = { args: { open: true } };
export const Disabled: Story = { args: { disabled: true } };

export const FAQ: Story = {
  render: () => html`
    <div style="max-width:600px;display:flex;flex-direction:column;gap:8px;">
      ${[
        { q: "¿Qué es esta librería?", a: "Es una colección de Web Components reutilizables construidos con Lit." },
        { q: "¿Es compatible con frameworks?", a: "Sí, los Web Components son nativos del navegador y funcionan con React, Vue, Angular y cualquier otro framework." },
        { q: "¿Cómo instalo los componentes?", a: "Ejecuta npm install @spiralix/components y luego importa los componentes que necesites." },
      ].map(({ q, a }) => html`
        <sp-collapsible>
          <span slot="trigger" style="font-weight:500;">${q}</span>
          <div style="padding:12px 16px;background:#f9fafb;border-radius:0 0 6px 6px;border:1px solid #e5e7eb;border-top:none;">
            <p style="margin:0;color:#6b7280;font-size:14px;">${a}</p>
          </div>
        </sp-collapsible>
      `)}
    </div>
  `,
};

import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "../../components/back-top/sp-back-top.js";

const meta: Meta = {
  title: "Components/BackTop",
  component: "sp-back-top",
  tags: ["autodocs"],
  argTypes: {
    "visibility-height": { control: "number", description: "Scroll mínimo para mostrar el botón" },
    position: { control: "select", options: ["bottom-right","bottom-left","bottom-center"], description: "Posición en pantalla" },
    duration: { control: "number", description: "Duración de la animación de scroll en ms" },
  },
  args: { "visibility-height": 400, position: "bottom-right", duration: 300 },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <div style="height:600px;overflow-y:auto;border:1px solid #e5e7eb;border-radius:8px;padding:16px;position:relative;">
      ${Array.from({ length: 30 }, (_, i) => html`
        <p style="margin:0 0 12px;color:#374151;">Línea ${i + 1} — desplázate hacia abajo para ver el botón "volver arriba".</p>
      `)}
      <sp-back-top visibility-height=${50}></sp-back-top>
    </div>
  `,
};

export const BottomLeft: Story = {
  render: () => html`
    <div style="height:400px;overflow-y:auto;border:1px solid #e5e7eb;border-radius:8px;padding:16px;position:relative;">
      ${Array.from({ length: 20 }, (_, i) => html`<p style="margin:0 0 12px;">Línea ${i + 1}</p>`)}
      <sp-back-top visibility-height=${50} position="bottom-left"></sp-back-top>
    </div>
  `,
};

export const CustomIcon: Story = {
  render: () => html`
    <div style="height:400px;overflow-y:auto;border:1px solid #e5e7eb;border-radius:8px;padding:16px;position:relative;">
      ${Array.from({ length: 20 }, (_, i) => html`<p style="margin:0 0 12px;">Línea ${i + 1}</p>`)}
      <sp-back-top visibility-height=${50}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 19V5M5 12l7-7 7 7"/>
        </svg>
      </sp-back-top>
    </div>
  `,
};

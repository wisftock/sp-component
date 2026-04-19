import type { Meta, StoryObj } from "@storybook/web-components";
import { html, nothing } from "lit";
import "../../components/fab/sp-fab.js";

const meta: Meta = {
  title: "Components/FAB",
  component: "sp-fab",
  tags: ["autodocs"],
  argTypes: {
    icon: { control: "text" },
    position: { control: "select", options: ["bottom-right","bottom-left","bottom-center","top-right","top-left"] },
    size: { control: "select", options: ["sm","md","lg"] },
    label: { control: "text" },
    color: { control: "text" },
  },
  args: { icon: "+", position: "bottom-right", size: "md", label: "Crear", color: "" },
  render: (args) => html`
    <div style="position:relative;height:300px;background:#f9fafb;border-radius:8px;border:1px solid #e5e7eb;">
      <p style="padding:16px;color:#6b7280;">Contenido de la página. El FAB se posiciona en la esquina.</p>
      <sp-fab
        icon=${args.icon}
        position=${args.position}
        size=${args.size}
        label=${args.label}
        color=${args.color || nothing}
      ></sp-fab>
    </div>
  `,
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const BottomLeft: Story = {
  render: () => html`
    <div style="position:relative;height:300px;background:#f9fafb;border-radius:8px;border:1px solid #e5e7eb;">
      <sp-fab icon="✉" position="bottom-left" label="Nuevo mensaje"></sp-fab>
    </div>
  `,
};

export const WithActions: Story = {
  render: () => html`
    <div style="position:relative;height:300px;background:#f9fafb;border-radius:8px;border:1px solid #e5e7eb;">
      <p style="padding:16px;color:#6b7280;">Haz clic en el FAB para ver las acciones secundarias.</p>
      <sp-fab
        icon="+"
        position="bottom-right"
        .actions=${[
          { icon: "📄", label: "Nuevo documento" },
          { icon: "📁", label: "Nueva carpeta" },
          { icon: "🔗", label: "Nuevo enlace" },
        ]}
      ></sp-fab>
    </div>
  `,
};

export const Sizes: Story = {
  render: () => html`
    <div style="display:flex;gap:24px;align-items:flex-end;padding:16px;">
      <div style="position:relative;height:80px;width:80px;background:#f9fafb;border-radius:8px;border:1px solid #e5e7eb;">
        <sp-fab icon="+" size="sm" position="bottom-right"></sp-fab>
      </div>
      <div style="position:relative;height:100px;width:100px;background:#f9fafb;border-radius:8px;border:1px solid #e5e7eb;">
        <sp-fab icon="+" size="md" position="bottom-right"></sp-fab>
      </div>
      <div style="position:relative;height:120px;width:120px;background:#f9fafb;border-radius:8px;border:1px solid #e5e7eb;">
        <sp-fab icon="+" size="lg" position="bottom-right"></sp-fab>
      </div>
    </div>
  `,
};

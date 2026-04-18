import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "../../components/anchor/sp-anchor.js";

const meta: Meta = {
  title: "Components/Anchor",
  component: "sp-anchor",
  tags: ["autodocs"],
  argTypes: {
    offset: { control: "number", description: "Offset en px desde el top al detectar sección activa" },
  },
  args: { offset: 80 },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <div style="display:flex;gap:32px;">
      <sp-anchor
        .items=${[
          { id: "intro", label: "Introducción" },
          { id: "usage", label: "Uso" },
          { id: "api", label: "API" },
          { id: "examples", label: "Ejemplos" },
        ]}
        style="position:sticky;top:16px;"
      ></sp-anchor>
      <div style="flex:1;">
        <section id="intro" style="min-height:200px;padding:16px;background:#f9fafb;margin-bottom:16px;border-radius:8px;">
          <h2>Introducción</h2><p>Contenido de la sección introductoria.</p>
        </section>
        <section id="usage" style="min-height:200px;padding:16px;background:#f0f9ff;margin-bottom:16px;border-radius:8px;">
          <h2>Uso</h2><p>Cómo usar el componente.</p>
        </section>
        <section id="api" style="min-height:200px;padding:16px;background:#f0fdf4;margin-bottom:16px;border-radius:8px;">
          <h2>API</h2><p>Referencia de propiedades y eventos.</p>
        </section>
        <section id="examples" style="min-height:200px;padding:16px;background:#fefce8;margin-bottom:16px;border-radius:8px;">
          <h2>Ejemplos</h2><p>Casos de uso prácticos.</p>
        </section>
      </div>
    </div>
  `,
};

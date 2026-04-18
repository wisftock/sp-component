import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "../../components/diff-viewer/sp-diff-viewer.js";

const OLD = `function calcularTotal(items) {
  let total = 0;
  for (let i = 0; i < items.length; i++) {
    total += items[i].precio;
  }
  return total;
}`;

const NEW = `function calcularTotal(items) {
  const total = items.reduce((acc, item) => acc + item.precio, 0);
  const descuento = total > 100 ? total * 0.1 : 0;
  return total - descuento;
}`;

const meta: Meta = {
  title: "Components/DiffViewer",
  component: "sp-diff-viewer",
  tags: ["autodocs"],
  argTypes: {
    mode: { control: "select", options: ["unified","split"], description: "Modo de visualización" },
    filename: { control: "text" },
    context: { control: "number", description: "Líneas de contexto alrededor de cambios" },
  },
  args: { mode: "unified", filename: "calcular.js", context: 3 },
  render: ({ mode, filename, context }) => html`
    <sp-diff-viewer
      old-text=${OLD}
      new-text=${NEW}
      filename=${filename}
      mode=${mode}
      context=${context}
    ></sp-diff-viewer>
  `,
};

export default meta;
type Story = StoryObj;

export const Unified: Story = { args: { mode: "unified" } };
export const Split: Story = { args: { mode: "split" } };

export const JSONDiff: Story = {
  render: () => html`
    <sp-diff-viewer
      old-text=${'{\n  "version": "1.0.0",\n  "name": "mi-app",\n  "port": 3000\n}'}
      new-text=${'{\n  "version": "1.1.0",\n  "name": "mi-app",\n  "port": 8080,\n  "debug": true\n}'}
      filename="config.json"
      mode="split"
    ></sp-diff-viewer>
  `,
};

export const NoChanges: Story = {
  render: () => html`
    <sp-diff-viewer
      old-text=${"const x = 1;\nconst y = 2;"}
      new-text=${"const x = 1;\nconst y = 2;"}
      filename="sin-cambios.js"
    ></sp-diff-viewer>
  `,
};

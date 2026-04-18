import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "../../components/dnd-zone/sp-dnd-zone.js";

const ITEMS = [
  { id: "1", label: "Tarea de diseño" },
  { id: "2", label: "Revisión de código" },
  { id: "3", label: "Pruebas de QA" },
  { id: "4", label: "Despliegue a producción" },
  { id: "5", label: "Documentación" },
];

const meta: Meta = {
  title: "Components/DndZone",
  component: "sp-dnd-zone",
  tags: ["autodocs"],
  argTypes: {
    placeholder: { control: "text" },
    group: { control: "text" },
  },
  args: { placeholder: "Arrastra items aquí", group: "default" },
  render: ({ placeholder, group }) => html`
    <sp-dnd-zone
      .items=${ITEMS}
      placeholder=${placeholder}
      group=${group}
      style="max-width:320px;"
    ></sp-dnd-zone>
  `,
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const Empty: Story = {
  render: () => html`
    <sp-dnd-zone
      .items=${[]}
      placeholder="Sin tareas — arrastra aquí"
      style="max-width:320px;"
    ></sp-dnd-zone>
  `,
};

export const MultipleZones: Story = {
  render: () => html`
    <div style="display:flex;gap:16px;">
      <div>
        <p style="font-size:13px;font-weight:600;margin:0 0 8px;color:#374151;">Por hacer</p>
        <sp-dnd-zone
          .items=${[{ id: "1", label: "Diseñar mockups" }, { id: "2", label: "Escribir specs" }]}
          group="kanban"
          zone-id="todo"
          style="min-width:200px;"
        ></sp-dnd-zone>
      </div>
      <div>
        <p style="font-size:13px;font-weight:600;margin:0 0 8px;color:#374151;">En progreso</p>
        <sp-dnd-zone
          .items=${[{ id: "3", label: "Implementar API" }]}
          group="kanban"
          zone-id="in-progress"
          style="min-width:200px;"
        ></sp-dnd-zone>
      </div>
      <div>
        <p style="font-size:13px;font-weight:600;margin:0 0 8px;color:#374151;">Terminado</p>
        <sp-dnd-zone
          .items=${[{ id: "4", label: "Configurar CI" }]}
          group="kanban"
          zone-id="done"
          style="min-width:200px;"
        ></sp-dnd-zone>
      </div>
    </div>
  `,
};

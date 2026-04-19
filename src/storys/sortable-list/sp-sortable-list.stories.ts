import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "../../components/sortable-list/sp-sortable-list.js";

const TASKS = [
  { id: "1", label: "Diseñar wireframes", description: "Pantallas principales del dashboard", icon: "🎨" },
  { id: "2", label: "Implementar componentes", description: "sp-button, sp-input, sp-table", icon: "⚙️" },
  { id: "3", label: "Escribir tests unitarios", description: "Cobertura mínima del 80%", icon: "🧪" },
  { id: "4", label: "Revisión de código", description: "PR review con el equipo", icon: "👀" },
  { id: "5", label: "Deploy a staging", description: "Verificar en entorno de pruebas", icon: "🚀" },
];

const PRIORITIES = [
  { id: "p1", label: "Crítico", description: "Bloqueante para producción", icon: "🔴" },
  { id: "p2", label: "Alto", description: "Debe resolverse esta semana", icon: "🟠" },
  { id: "p3", label: "Medio", description: "Próximo sprint", icon: "🟡" },
  { id: "p4", label: "Bajo", description: "Backlog general", icon: "🟢" },
];

const TEAM = [
  { id: "m1", label: "Ana García", description: "Lead Designer · Madrid", icon: "👩" },
  { id: "m2", label: "Carlos López", description: "Senior Dev · CDMX", icon: "👨" },
  { id: "m3", label: "María Ruiz", description: "Product Manager · Buenos Aires", icon: "👩" },
  { id: "m4", label: "Pedro Soto", description: "QA Engineer · Bogotá", icon: "👨" },
];

const meta: Meta = {
  title: "Components/SortableList",
  component: "sp-sortable-list",
  tags: ["autodocs"],
  argTypes: {
    disabled: { control: "boolean" },
    handles:  { control: "boolean" },
  },
  args: { disabled: false, handles: false },
  render: ({ disabled, handles }: any) => html`
    <sp-sortable-list
      .items=${TASKS}
      ?disabled=${disabled}
      ?handles=${handles}
      style="max-width:460px;"
    ></sp-sortable-list>
  `,
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const WithHandles: Story = {
  name: "Con handles explícitos",
  render: () => html`
    <div style="max-width:460px;">
      <p style="margin:0 0 10px;font-size:13px;color:#6b7280;">El handle de arrastre está limitado al ícono ⠿ de la izquierda.</p>
      <sp-sortable-list .items=${TASKS} handles></sp-sortable-list>
    </div>
  `,
};

export const Disabled: Story = {
  name: "Deshabilitado",
  render: () => html`
    <div style="max-width:460px;">
      <sp-sortable-list .items=${TASKS} disabled></sp-sortable-list>
    </div>
  `,
};

export const WithIcons: Story = {
  name: "Con íconos y descripciones",
  render: () => html`
    <div style="max-width:460px;">
      <div style="margin-bottom:12px;padding:10px 14px;background:#f0f9ff;border-radius:8px;border:1px solid #bae6fd;">
        <p style="margin:0;font-size:13px;color:#0284c7;">🖱️ Arrastra los ítems para reordenar la lista de tareas.</p>
      </div>
      <sp-sortable-list .items=${TASKS} handles></sp-sortable-list>
    </div>
  `,
};

export const Priorities: Story = {
  name: "Prioridades",
  render: () => html`
    <div style="max-width:400px;">
      <p style="margin:0 0 10px;font-size:14px;font-weight:600;color:#111827;">Ordenar por prioridad</p>
      <p style="margin:0 0 12px;font-size:13px;color:#6b7280;">Arrastra para ajustar el orden de importancia.</p>
      <sp-sortable-list .items=${PRIORITIES}></sp-sortable-list>
    </div>
  `,
};

export const TeamOrder: Story = {
  name: "Orden de equipo",
  render: () => {
    let items = [...TEAM];
    return html`
      <div style="max-width:440px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
          <p style="margin:0;font-size:14px;font-weight:700;color:#111827;">Orden de presentación</p>
          <span style="font-size:12px;color:#9ca3af;">${items.length} miembros</span>
        </div>
        <sp-sortable-list
          .items=${items}
          handles
          @sp-change=${(e: CustomEvent) => { items = e.detail.items; }}
        ></sp-sortable-list>
      </div>
    `;
  },
};

export const WithDisabledItems: Story = {
  name: "Ítems deshabilitados",
  render: () => html`
    <div style="max-width:460px;">
      <sp-sortable-list .items=${[
        { id: "1", label: "Planificación (completado)", description: "No se puede reordenar", icon: "✅", disabled: true },
        { id: "2", label: "Desarrollo en curso", description: "Sprint actual", icon: "⚙️" },
        { id: "3", label: "Testing", description: "Próxima fase", icon: "🧪" },
        { id: "4", label: "Deploy", description: "Fase final", icon: "🚀" },
      ]}></sp-sortable-list>
    </div>
  `,
};

export const EventOutput: Story = {
  name: "Con evento sp-change",
  render: () => {
    return html`
      <div style="display:flex;gap:20px;max-width:760px;align-items:flex-start;">
        <div style="flex:1;">
          <p style="margin:0 0 10px;font-size:13px;font-weight:600;color:#374151;">Lista ordenable</p>
          <sp-sortable-list
            .items=${TASKS}
            @sp-change=${(e: CustomEvent) => {
              const out = document.getElementById("sl-output");
              if (out) out.textContent = e.detail.items.map((i: any) => `${i.icon} ${i.label}`).join("\n");
            }}
          ></sp-sortable-list>
        </div>
        <div style="flex:1;">
          <p style="margin:0 0 10px;font-size:13px;font-weight:600;color:#374151;">Orden actual (evento sp-change)</p>
          <pre id="sl-output" style="margin:0;padding:14px;background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;font-size:12px;color:#374151;line-height:1.8;">${TASKS.map(i => `${i.icon} ${i.label}`).join("\n")}</pre>
        </div>
      </div>
    `;
  },
};

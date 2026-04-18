import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "../../components/gantt/sp-gantt.js";

const TODAY = new Date();
const fmt = (d: Date) => d.toISOString().slice(0, 10);
const addDays = (d: Date, n: number) => { const r = new Date(d); r.setDate(r.getDate() + n); return r; };

const TASKS = [
  { id: "1", label: "Planificación", start: fmt(addDays(TODAY, -14)), end: fmt(addDays(TODAY, -8)), color: "#6366f1", progress: 100 },
  { id: "2", label: "Diseño UI/UX", start: fmt(addDays(TODAY, -10)), end: fmt(addDays(TODAY, -3)), color: "#8b5cf6", progress: 100, deps: ["1"] },
  { id: "3", label: "Desarrollo frontend", start: fmt(addDays(TODAY, -5)), end: fmt(addDays(TODAY, 7)), color: "#3b82f6", progress: 60, deps: ["2"] },
  { id: "4", label: "Desarrollo backend", start: fmt(addDays(TODAY, -4)), end: fmt(addDays(TODAY, 5)), color: "#0ea5e9", progress: 70 },
  { id: "5", label: "Pruebas QA", start: fmt(addDays(TODAY, 6)), end: fmt(addDays(TODAY, 12)), color: "#10b981", progress: 0, deps: ["3","4"] },
  { id: "6", label: "Despliegue", start: fmt(addDays(TODAY, 12)), end: fmt(addDays(TODAY, 14)), color: "#f59e0b", progress: 0, deps: ["5"] },
];

const meta: Meta = {
  title: "Components/Gantt",
  component: "sp-gantt",
  tags: ["autodocs"],
  argTypes: {
    zoom: { control: "select", options: ["day","week","month"], description: "Escala de tiempo" },
    title: { control: "text" },
  },
  args: { zoom: "week", title: "Proyecto Alpha" },
  render: ({ zoom, title }) => html`
    <sp-gantt .tasks=${TASKS} zoom=${zoom} title=${title}></sp-gantt>
  `,
};

export default meta;
type Story = StoryObj;

export const Week: Story = { args: { zoom: "week" } };
export const Day: Story = { args: { zoom: "day" } };
export const Month: Story = { args: { zoom: "month" } };

export const SimpleProject: Story = {
  render: () => html`
    <sp-gantt
      title="Sprint 12"
      zoom="day"
      .tasks=${[
        { id: "a", label: "Análisis de requerimientos", start: fmt(addDays(TODAY, 0)), end: fmt(addDays(TODAY, 2)), color: "#6366f1", progress: 50 },
        { id: "b", label: "Implementación", start: fmt(addDays(TODAY, 2)), end: fmt(addDays(TODAY, 7)), color: "#3b82f6", progress: 0, deps: ["a"] },
        { id: "c", label: "Revisión de código", start: fmt(addDays(TODAY, 7)), end: fmt(addDays(TODAY, 9)), color: "#10b981", progress: 0, deps: ["b"] },
      ]}
    ></sp-gantt>
  `,
};

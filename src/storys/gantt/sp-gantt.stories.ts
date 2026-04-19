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

export const ProductRoadmap: Story = {
  name: "Roadmap de producto",
  render: () => html`
    <sp-gantt
      title="Roadmap Q2 2026"
      zoom="month"
      .tasks=${[
        { id: "r1", label: "🔐 Autenticación SSO", start: fmt(addDays(TODAY, -20)), end: fmt(addDays(TODAY, 10)), color: "#6366f1", progress: 75 },
        { id: "r2", label: "📊 Dashboard Analytics", start: fmt(addDays(TODAY, -10)), end: fmt(addDays(TODAY, 20)), color: "#3b82f6", progress: 40, deps: ["r1"] },
        { id: "r3", label: "🛒 Módulo de pagos", start: fmt(addDays(TODAY, 5)), end: fmt(addDays(TODAY, 35)), color: "#10b981", progress: 10, deps: ["r1"] },
        { id: "r4", label: "🌍 Internacionalización", start: fmt(addDays(TODAY, 15)), end: fmt(addDays(TODAY, 45)), color: "#f59e0b", progress: 0 },
        { id: "r5", label: "📱 App móvil", start: fmt(addDays(TODAY, 20)), end: fmt(addDays(TODAY, 60)), color: "#ec4899", progress: 0, deps: ["r3"] },
        { id: "r6", label: "🚀 Launch v3.0", start: fmt(addDays(TODAY, 58)), end: fmt(addDays(TODAY, 62)), color: "#ef4444", progress: 0, deps: ["r4","r5"] },
      ]}
    ></sp-gantt>
  `,
};

export const MultiTeam: Story = {
  name: "Proyecto multi-equipo",
  render: () => html`
    <sp-gantt
      title="Lanzamiento E-commerce · Semana actual"
      zoom="day"
      .tasks=${[
        { id: "t1", label: "[Design] Wireframes homepage",   start: fmt(addDays(TODAY, -5)), end: fmt(addDays(TODAY, -1)), color: "#8b5cf6", progress: 100 },
        { id: "t2", label: "[Design] Sistema de iconos",     start: fmt(addDays(TODAY, -3)), end: fmt(addDays(TODAY, 1)),  color: "#8b5cf6", progress: 80 },
        { id: "t3", label: "[Front] Navbar y layout",        start: fmt(addDays(TODAY, -2)), end: fmt(addDays(TODAY, 3)),  color: "#3b82f6", progress: 60, deps: ["t1"] },
        { id: "t4", label: "[Front] Carrito de compras",     start: fmt(addDays(TODAY, 2)),  end: fmt(addDays(TODAY, 7)),  color: "#3b82f6", progress: 0,  deps: ["t3"] },
        { id: "t5", label: "[Back] API productos",           start: fmt(addDays(TODAY, -4)), end: fmt(addDays(TODAY, 2)),  color: "#0ea5e9", progress: 70 },
        { id: "t6", label: "[Back] Pasarela de pagos",       start: fmt(addDays(TODAY, 1)),  end: fmt(addDays(TODAY, 8)),  color: "#0ea5e9", progress: 0,  deps: ["t5"] },
        { id: "t7", label: "[QA] Pruebas de integración",    start: fmt(addDays(TODAY, 7)),  end: fmt(addDays(TODAY, 10)), color: "#10b981", progress: 0,  deps: ["t4","t6"] },
        { id: "t8", label: "[DevOps] Deploy staging",        start: fmt(addDays(TODAY, 9)),  end: fmt(addDays(TODAY, 11)), color: "#f59e0b", progress: 0,  deps: ["t7"] },
      ]}
    ></sp-gantt>
  `,
};

export const ConstructionPhases: Story = {
  name: "Fases de construcción",
  render: () => html`
    <sp-gantt
      title="Obra Civil · Edificio Mirador"
      zoom="week"
      .tasks=${[
        { id: "f1", label: "Excavación y cimentación",     start: fmt(addDays(TODAY, -60)), end: fmt(addDays(TODAY, -35)), color: "#92400e", progress: 100 },
        { id: "f2", label: "Estructura de concreto",       start: fmt(addDays(TODAY, -38)), end: fmt(addDays(TODAY, -5)),  color: "#b45309", progress: 100, deps: ["f1"] },
        { id: "f3", label: "Instalaciones eléctricas",     start: fmt(addDays(TODAY, -10)), end: fmt(addDays(TODAY, 15)),  color: "#f59e0b", progress: 55, deps: ["f2"] },
        { id: "f4", label: "Instalaciones hidráulicas",    start: fmt(addDays(TODAY, -8)),  end: fmt(addDays(TODAY, 18)),  color: "#0ea5e9", progress: 40, deps: ["f2"] },
        { id: "f5", label: "Acabados interiores",          start: fmt(addDays(TODAY, 12)),  end: fmt(addDays(TODAY, 45)),  color: "#6366f1", progress: 0,  deps: ["f3","f4"] },
        { id: "f6", label: "Fachada y exteriores",         start: fmt(addDays(TODAY, 20)),  end: fmt(addDays(TODAY, 50)),  color: "#8b5cf6", progress: 0,  deps: ["f2"] },
        { id: "f7", label: "Inspección y entrega",         start: fmt(addDays(TODAY, 50)),  end: fmt(addDays(TODAY, 55)),  color: "#10b981", progress: 0,  deps: ["f5","f6"] },
      ]}
    ></sp-gantt>
  `,
};

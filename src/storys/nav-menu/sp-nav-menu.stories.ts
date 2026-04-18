import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "../../components/nav-menu/sp-nav-menu.js";

const ITEMS = [
  {
    label: "Productos",
    description: "Explora nuestra línea",
    children: [
      { label: "Componentes UI", description: "Librería de componentes web", href: "#" },
      { label: "Plantillas", description: "Layouts listos para usar", href: "#" },
      { label: "Iconos", description: "Pack de 500+ iconos SVG", href: "#" },
    ],
  },
  {
    label: "Recursos",
    children: [
      { label: "Documentación", description: "Guías y referencias API", href: "#" },
      { label: "Blog", description: "Artículos y tutoriales", href: "#" },
      { label: "Ejemplos", description: "Proyectos de ejemplo", href: "#" },
      { label: "Changelog", description: "Novedades de cada versión", href: "#" },
    ],
  },
  { label: "Precios", href: "#" },
  { label: "Empresa", href: "#" },
];

const meta: Meta = {
  title: "Components/NavMenu",
  component: "sp-nav-menu",
  tags: ["autodocs"],
  argTypes: {
    columns: { control: "number", description: "Columnas en el dropdown (0 = auto)" },
  },
  args: { columns: 0 },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <div style="padding:16px;background:#1e293b;border-radius:8px;">
      <sp-nav-menu .items=${ITEMS}></sp-nav-menu>
    </div>
  `,
};

export const Simple: Story = {
  render: () => html`
    <div style="padding:16px;background:#1e293b;border-radius:8px;">
      <sp-nav-menu .items=${[
        { label: "Inicio", href: "#" },
        { label: "Nosotros", href: "#" },
        { label: "Servicios", href: "#" },
        { label: "Contacto", href: "#" },
      ]}></sp-nav-menu>
    </div>
  `,
};

export const TwoColumns: Story = {
  render: () => html`
    <div style="padding:16px;background:#1e293b;border-radius:8px;">
      <sp-nav-menu .items=${ITEMS} columns=${2}></sp-nav-menu>
    </div>
  `,
};

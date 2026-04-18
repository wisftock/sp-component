import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "../../components/descriptions/sp-descriptions.js";

const USER_ITEMS = [
  { label: "Nombre", value: "Ana García" },
  { label: "Email", value: "ana@empresa.com" },
  { label: "Teléfono", value: "+57 300 123 4567" },
  { label: "Ciudad", value: "Bogotá" },
  { label: "Cargo", value: "Diseñadora UX" },
  { label: "Departamento", value: "Producto" },
];

const meta: Meta = {
  title: "Components/Descriptions",
  component: "sp-descriptions",
  tags: ["autodocs"],
  argTypes: {
    title: { control: "text" },
    columns: { control: "number", description: "Columnas en layout de grilla" },
    variant: { control: "select", options: ["default","bordered","striped"] },
    size: { control: "select", options: ["sm","md","lg"] },
    colon: { control: "boolean" },
  },
  args: { title: "Información del usuario", columns: 2, variant: "default", size: "md", colon: true },
  render: ({ title, columns, variant, size, colon }) => html`
    <sp-descriptions
      title=${title}
      columns=${columns}
      variant=${variant}
      size=${size}
      ?colon=${colon}
      .items=${USER_ITEMS}
    ></sp-descriptions>
  `,
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
export const Bordered: Story = { args: { variant: "bordered" } };
export const Striped: Story = { args: { variant: "striped" } };
export const OneColumn: Story = { args: { columns: 1 } };
export const ThreeColumns: Story = { args: { columns: 3 } };
export const Small: Story = { args: { size: "sm" } };

export const ProductInfo: Story = {
  render: () => html`
    <sp-descriptions
      title="Detalles del pedido"
      variant="bordered"
      columns=${2}
      .items=${[
        { label: "N° Pedido", value: "#ORD-2025-001" },
        { label: "Estado", value: "En proceso" },
        { label: "Fecha", value: "15 de abril, 2025" },
        { label: "Método de pago", value: "Tarjeta Visa •••• 4321" },
        { label: "Subtotal", value: "$89.99" },
        { label: "Envío", value: "$5.99" },
        { label: "Total", value: "$95.98" },
        { label: "Dirección", value: "Calle 123 #45-67, Bogotá" },
      ]}
    ></sp-descriptions>
  `,
};

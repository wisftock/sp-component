import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "../../components/cascader/sp-cascader.js";

const OPTIONS = [
  {
    value: "americas", label: "Américas", children: [
      {
        value: "sudamerica", label: "Sudamérica", children: [
          { value: "ar", label: "Argentina" },
          { value: "co", label: "Colombia" },
          { value: "cl", label: "Chile" },
        ],
      },
      {
        value: "norteamerica", label: "Norteamérica", children: [
          { value: "mx", label: "México" },
          { value: "us", label: "Estados Unidos" },
        ],
      },
    ],
  },
  {
    value: "europa", label: "Europa", children: [
      { value: "es", label: "España" },
      { value: "fr", label: "Francia" },
      { value: "de", label: "Alemania" },
    ],
  },
  {
    value: "asia", label: "Asia", children: [
      { value: "jp", label: "Japón" },
      { value: "cn", label: "China" },
      { value: "kr", label: "Corea del Sur" },
    ],
  },
];

const meta: Meta = {
  title: "Components/Cascader",
  component: "sp-cascader",
  tags: ["autodocs"],
  argTypes: {
    placeholder: { control: "text" },
    clearable: { control: "boolean" },
    disabled: { control: "boolean" },
    separator: { control: "text" },
  },
  args: { placeholder: "Seleccionar región", clearable: true, disabled: false, separator: " / " },
  render: ({ placeholder, clearable, disabled, separator }) => html`
    <sp-cascader
      .options=${OPTIONS}
      placeholder=${placeholder}
      ?clearable=${clearable}
      ?disabled=${disabled}
      separator=${separator}
    ></sp-cascader>
  `,
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
export const Disabled: Story = { args: { disabled: true } };
export const NotClearable: Story = { args: { clearable: false } };

export const CategoryTree: Story = {
  render: () => html`
    <sp-cascader
      .options=${[
        {
          value: "electronics", label: "Electrónica", children: [
            { value: "phones", label: "Teléfonos", children: [
              { value: "smartphones", label: "Smartphones" },
              { value: "basic", label: "Teléfonos básicos" },
            ]},
            { value: "computers", label: "Computadoras", children: [
              { value: "laptops", label: "Laptops" },
              { value: "desktops", label: "Escritorios" },
            ]},
          ],
        },
        {
          value: "clothing", label: "Ropa", children: [
            { value: "men", label: "Hombre" },
            { value: "women", label: "Mujer" },
            { value: "kids", label: "Niños" },
          ],
        },
      ]}
      placeholder="Seleccionar categoría"
    ></sp-cascader>
  `,
};

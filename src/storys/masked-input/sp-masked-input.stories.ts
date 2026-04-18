import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "../../components/masked-input/sp-masked-input.js";

const meta: Meta = {
  title: "Components/MaskedInput",
  component: "sp-masked-input",
  tags: ["autodocs"],
  argTypes: {
    mask: { control: "text", description: "Patrón: 9=dígito, A=letra, *=cualquiera" },
    placeholder: { control: "text" },
    "show-mask": { control: "boolean" },
    disabled: { control: "boolean" },
    invalid: { control: "boolean" },
    error: { control: "text" },
  },
  args: {
    mask: "9999-9999-9999-9999",
    placeholder: "Número de tarjeta",
    "show-mask": true,
    disabled: false,
    invalid: false,
    error: "",
  },
  render: ({ mask, placeholder, disabled, invalid, error }) => html`
    <sp-masked-input
      mask=${mask}
      placeholder=${placeholder}
      ?show-mask=${true}
      ?disabled=${disabled}
      ?invalid=${invalid}
      error=${error}
      style="width:280px;"
    ></sp-masked-input>
  `,
};

export default meta;
type Story = StoryObj;

export const CreditCard: Story = {
  args: { mask: "9999 9999 9999 9999", placeholder: "1234 5678 9012 3456" },
};

export const Phone: Story = {
  args: { mask: "(999) 999-9999", placeholder: "(300) 123-4567" },
};

export const Date: Story = {
  args: { mask: "99/99/9999", placeholder: "DD/MM/AAAA" },
};

export const NIT: Story = {
  args: { mask: "999.999.999-9", placeholder: "NIT de empresa" },
};

export const Invalid: Story = {
  args: { mask: "9999-9999-9999-9999", invalid: true, error: "Número de tarjeta inválido" },
};

export const Disabled: Story = {
  args: { mask: "9999 9999 9999 9999", disabled: true, placeholder: "Deshabilitado" },
};

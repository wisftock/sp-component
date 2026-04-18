import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "../../components/password-input/sp-password-input.js";

const meta: Meta = {
  title: "Components/PasswordInput",
  component: "sp-password-input",
  tags: ["autodocs"],
  argTypes: {
    placeholder: { control: "text" },
    "show-strength": { control: "boolean", description: "Muestra indicador de fortaleza" },
    disabled: { control: "boolean" },
    invalid: { control: "boolean" },
  },
  args: { placeholder: "Ingresa tu contraseña", "show-strength": false, disabled: false, invalid: false },
  render: ({ placeholder, disabled, invalid }) => html`
    <sp-password-input
      placeholder=${placeholder}
      ?show-strength=${true}
      ?disabled=${disabled}
      ?invalid=${invalid}
      style="width:280px;"
    ></sp-password-input>
  `,
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const WithStrengthIndicator: Story = {
  args: { "show-strength": true },
};

export const Disabled: Story = {
  args: { disabled: true, placeholder: "Contraseña deshabilitada" },
};

export const Invalid: Story = {
  args: { invalid: true },
};

export const LoginForm: Story = {
  render: () => html`
    <div style="max-width:360px;display:flex;flex-direction:column;gap:16px;">
      <div>
        <label style="font-size:14px;font-weight:500;display:block;margin-bottom:6px;">Email</label>
        <input type="email" placeholder="tu@email.com" style="width:100%;padding:8px 12px;border:1px solid #d1d5db;border-radius:6px;font-size:14px;box-sizing:border-box;"/>
      </div>
      <div>
        <label style="font-size:14px;font-weight:500;display:block;margin-bottom:6px;">Contraseña</label>
        <sp-password-input placeholder="Tu contraseña" style="width:100%;display:block;"></sp-password-input>
      </div>
      <button style="width:100%;padding:10px;background:#3b82f6;color:white;border:none;border-radius:6px;font-size:14px;cursor:pointer;">Iniciar sesión</button>
    </div>
  `,
};

export const RegistrationForm: Story = {
  render: () => html`
    <div style="max-width:360px;display:flex;flex-direction:column;gap:16px;">
      <div>
        <label style="font-size:14px;font-weight:500;display:block;margin-bottom:6px;">Nueva contraseña</label>
        <sp-password-input placeholder="Mínimo 8 caracteres" show-strength style="width:100%;display:block;"></sp-password-input>
      </div>
      <div>
        <label style="font-size:14px;font-weight:500;display:block;margin-bottom:6px;">Confirmar contraseña</label>
        <sp-password-input placeholder="Repite tu contraseña" style="width:100%;display:block;"></sp-password-input>
      </div>
    </div>
  `,
};

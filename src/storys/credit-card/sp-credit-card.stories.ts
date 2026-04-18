import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "../../components/credit-card/sp-credit-card.js";

const meta: Meta = {
  title: "Components/CreditCard",
  component: "sp-credit-card",
  tags: ["autodocs"],
  argTypes: {
    number:   { control: "text",    description: "Número de tarjeta (detecta VISA / MC / AMEX / Discover / UnionPay / Diners / JCB)" },
    holder:   { control: "text",    description: "Nombre del titular" },
    expiry:   { control: "text",    description: "Fecha de expiración MM/YY" },
    cvv:      { control: "text",    description: "Código CVV" },
    flipped:  { control: "boolean", description: "Mostrar el reverso" },
    interactive: { control: "boolean", description: "Permite flip al hacer click o teclado (Space/Enter)" },
    masked:   { control: "boolean", description: "Oculta el CVV con ••• aunque esté definido" },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Tamaño de la tarjeta",
    },
    theme: {
      control: "select",
      options: ["purple", "dark", "blue", "green", "gold", "rose", "custom"],
      description: "Tema de color predefinido",
    },
    gradient: { control: "text", description: "Gradiente CSS personalizado (requiere theme='custom')" },
    label:    { control: "text", description: "aria-label del componente" },
  },
  args: {
    number: "4532 1234 5678 9012",
    holder: "ANA GARCÍA",
    expiry: "12/28",
    cvv: "123",
    flipped: false,
    interactive: false,
    masked: false,
    size: "md",
    theme: "purple",
    gradient: "",
    label: "Credit card",
  },
  render: ({ number, holder, expiry, cvv, flipped, interactive, masked, size, theme, gradient, label }) => html`
    <sp-credit-card
      number=${number}
      holder=${holder}
      expiry=${expiry}
      cvv=${cvv}
      size=${size}
      theme=${theme}
      gradient=${gradient}
      label=${label}
      ?flipped=${flipped}
      ?interactive=${interactive}
      ?masked=${masked}
    ></sp-credit-card>
  `,
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const Reverso: Story = {
  args: { flipped: true },
};

export const Interactivo: Story = {
  name: "Interactivo (click para girar)",
  args: { interactive: true },
  render: () => html`
    <div style="display:flex;flex-direction:column;align-items:center;gap:16px;">
      <sp-credit-card
        number="4532 1234 5678 9012"
        holder="ANA GARCÍA"
        expiry="12/28"
        cvv="123"
        interactive
      ></sp-credit-card>
      <p style="font-size:13px;color:#6b7280;margin:0;">Haz click en la tarjeta o presiona Space/Enter</p>
    </div>
  `,
};

export const CVVMasked: Story = {
  name: "CVV Enmascarado",
  args: { flipped: true, cvv: "456", masked: true },
};

export const Tamaños: Story = {
  name: "Tamaños (sm / md / lg)",
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:24px;align-items:flex-start;padding:16px;">
      ${(["sm", "md", "lg"] as const).map(
        (size) => html`
          <div style="display:flex;flex-direction:column;gap:8px;">
            <sp-credit-card
              number="4532 1234 5678 9012"
              holder="ANA GARCÍA"
              expiry="12/28"
              size=${size}
              theme="blue"
            ></sp-credit-card>
            <span style="font-size:12px;color:#6b7280;font-weight:500;">${size}</span>
          </div>
        `,
      )}
    </div>
  `,
};

export const Temas: Story = {
  name: "Todos los Temas",
  render: () => html`
    <div style="display:flex;flex-wrap:wrap;gap:24px;padding:16px;">
      ${(["purple", "dark", "blue", "green", "gold", "rose"] as const).map(
        (theme) => html`
          <div style="display:flex;flex-direction:column;gap:8px;align-items:center;">
            <sp-credit-card
              number="4532 1234 5678 9012"
              holder="NOMBRE APELLIDO"
              expiry="12/28"
              theme=${theme}
            ></sp-credit-card>
            <span style="font-size:12px;color:#6b7280;font-weight:500;text-transform:capitalize;">${theme}</span>
          </div>
        `,
      )}
    </div>
  `,
};

export const RedesDetectadas: Story = {
  name: "Detección de Red Automática",
  render: () => html`
    <div style="display:flex;flex-wrap:wrap;gap:20px;padding:16px;">
      <div style="display:flex;flex-direction:column;gap:8px;align-items:center;">
        <sp-credit-card number="4111 1111 1111 1111" holder="VISA USER"      expiry="12/28" theme="blue"></sp-credit-card>
        <span style="font-size:12px;color:#6b7280;">VISA</span>
      </div>
      <div style="display:flex;flex-direction:column;gap:8px;align-items:center;">
        <sp-credit-card number="5500 0000 0000 0004" holder="MC USER"        expiry="11/27" theme="dark"></sp-credit-card>
        <span style="font-size:12px;color:#6b7280;">Mastercard</span>
      </div>
      <div style="display:flex;flex-direction:column;gap:8px;align-items:center;">
        <sp-credit-card number="3714 496353 98431"   holder="AMEX USER"      expiry="09/26" theme="gold"></sp-credit-card>
        <span style="font-size:12px;color:#6b7280;">American Express</span>
      </div>
      <div style="display:flex;flex-direction:column;gap:8px;align-items:center;">
        <sp-credit-card number="6011 1111 1111 1117" holder="DISCOVER USER"  expiry="03/29" theme="green"></sp-credit-card>
        <span style="font-size:12px;color:#6b7280;">Discover</span>
      </div>
      <div style="display:flex;flex-direction:column;gap:8px;align-items:center;">
        <sp-credit-card number="6212 3456 7890 1234" holder="UNIONPAY USER"  expiry="06/30" theme="rose"></sp-credit-card>
        <span style="font-size:12px;color:#6b7280;">UnionPay</span>
      </div>
      <div style="display:flex;flex-direction:column;gap:8px;align-items:center;">
        <sp-credit-card number="3056 930902 5904"    holder="DINERS USER"    expiry="08/27" theme="purple"></sp-credit-card>
        <span style="font-size:12px;color:#6b7280;">Diners Club</span>
      </div>
      <div style="display:flex;flex-direction:column;gap:8px;align-items:center;">
        <sp-credit-card number="3530 1113 3330 0000" holder="JCB USER"       expiry="01/28" theme="blue"></sp-credit-card>
        <span style="font-size:12px;color:#6b7280;">JCB</span>
      </div>
    </div>
  `,
};

export const ValidacionNumero: Story = {
  name: "Validación de Longitud",
  render: () => html`
    <div style="display:flex;flex-wrap:wrap;gap:24px;padding:16px;">
      <div style="display:flex;flex-direction:column;gap:8px;align-items:center;">
        <sp-credit-card number="4111 1111 1111 1111" holder="VÁLIDO" expiry="12/28" theme="blue"></sp-credit-card>
        <span style="font-size:12px;color:#10b981;">✓ VISA 16 dígitos (válido)</span>
      </div>
      <div style="display:flex;flex-direction:column;gap:8px;align-items:center;">
        <sp-credit-card number="4111 1111" holder="INVÁLIDO" expiry="12/28" theme="blue"></sp-credit-card>
        <span style="font-size:12px;color:#ef4444;">⚠ VISA 8 dígitos (inválido)</span>
      </div>
    </div>
  `,
};

export const GradientePersonalizado: Story = {
  name: "Gradiente Personalizado",
  args: {
    theme: "custom",
    gradient: "linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)",
    holder: "CARLOS MÉNDEZ",
    number: "4111 1111 1111 1111",
  },
};

export const Vacia: Story = {
  name: "Tarjeta Vacía",
  args: { number: "", holder: "NOMBRE APELLIDO", expiry: "MM/YY", cvv: "" },
};

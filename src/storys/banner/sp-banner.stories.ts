import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "../../components/banner/sp-banner.js";

const meta: Meta = {
  title: "Components/Banner",
  component: "sp-banner",
  tags: ["autodocs"],
  argTypes: {
    variant: { control: "select", options: ["info","success","warning","danger"], description: "Tipo de banner" },
    title: { control: "text" },
    message: { control: "text" },
    dismissable: { control: "boolean" },
    sticky: { control: "boolean" },
    icon: { control: "boolean" },
  },
  args: {
    variant: "info",
    title: "Información",
    message: "Este es un mensaje informativo para el usuario.",
    dismissable: true,
    sticky: false,
    icon: true,
  },
  render: ({ variant, title, message, dismissable, sticky, icon }) => html`
    <sp-banner
      variant=${variant}
      title=${title}
      message=${message}
      ?dismissable=${dismissable}
      ?sticky=${sticky}
      ?icon=${icon}
    ></sp-banner>
  `,
};

export default meta;
type Story = StoryObj;

export const Info: Story = { args: { variant: "info" } };
export const Success: Story = { args: { variant: "success", title: "Operación exitosa", message: "Los cambios se guardaron correctamente." } };
export const Warning: Story = { args: { variant: "warning", title: "Advertencia", message: "Esta acción puede tener consecuencias irreversibles." } };
export const Danger: Story = { args: { variant: "danger", title: "Error crítico", message: "No se pudo completar la operación." } };

export const NotDismissable: Story = {
  args: { dismissable: false, title: "Mantenimiento programado", message: "El sistema estará fuera de servicio el domingo de 2 a 4 AM." },
};

export const AllVariants: Story = {
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:12px;">
      <sp-banner variant="info" title="Info" message="Mensaje informativo." dismissable></sp-banner>
      <sp-banner variant="success" title="Éxito" message="Operación completada con éxito." dismissable></sp-banner>
      <sp-banner variant="warning" title="Advertencia" message="Revisa este punto antes de continuar." dismissable></sp-banner>
      <sp-banner variant="danger" title="Error" message="Ocurrió un error inesperado." dismissable></sp-banner>
    </div>
  `,
};

export const WithActions: Story = {
  render: () => html`
    <sp-banner variant="warning" title="Sesión por expirar" message="Tu sesión expirará en 5 minutos.">
      <div slot="actions" style="display:flex;gap:8px;margin-top:8px;">
        <button style="padding:6px 12px;background:#f59e0b;color:white;border:none;border-radius:4px;cursor:pointer;font-size:13px;">Extender sesión</button>
        <button style="padding:6px 12px;background:transparent;border:1px solid #f59e0b;color:#92400e;border-radius:4px;cursor:pointer;font-size:13px;">Cerrar sesión</button>
      </div>
    </sp-banner>
  `,
};

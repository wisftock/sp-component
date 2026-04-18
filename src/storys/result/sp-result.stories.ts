import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "../../components/result/sp-result.js";

const meta: Meta = {
  title: "Components/Result",
  component: "sp-result",
  tags: ["autodocs"],
  argTypes: {
    status: { control: "select", options: ["success","error","warning","info","404","403","500"] },
    title: { control: "text" },
    subtitle: { control: "text" },
  },
  args: { status: "success", title: "Operación exitosa", subtitle: "Tu solicitud fue procesada correctamente." },
  render: ({ status, title, subtitle }) => html`
    <sp-result status=${status} title=${title} subtitle=${subtitle}></sp-result>
  `,
};

export default meta;
type Story = StoryObj;

export const Success: Story = {
  args: { status: "success", title: "Pago completado", subtitle: "Tu pago de $99.99 fue procesado exitosamente." },
};

export const Error: Story = {
  args: { status: "error", title: "Error al procesar", subtitle: "Hubo un problema con tu solicitud. Por favor intenta nuevamente." },
};

export const Warning: Story = {
  args: { status: "warning", title: "Atención requerida", subtitle: "Tu cuenta tiene pendientes que debes resolver." },
};

export const Info: Story = {
  args: { status: "info", title: "En revisión", subtitle: "Tu solicitud está siendo procesada. Te notificaremos pronto." },
};

export const NotFound: Story = {
  args: { status: "404", title: "Página no encontrada", subtitle: "La página que buscas no existe o fue movida." },
};

export const Forbidden: Story = {
  args: { status: "403", title: "Sin permisos", subtitle: "No tienes acceso a este recurso." },
};

export const ServerError: Story = {
  args: { status: "500", title: "Error del servidor", subtitle: "Algo salió mal en nuestro servidor. Estamos trabajando en ello." },
};

export const WithActions: Story = {
  render: () => html`
    <sp-result status="success" title="¡Registro completado!" subtitle="Tu cuenta ha sido creada exitosamente.">
      <div slot="actions" style="display:flex;gap:12px;justify-content:center;margin-top:8px;">
        <button style="padding:10px 24px;background:#3b82f6;color:white;border:none;border-radius:6px;cursor:pointer;font-size:14px;">Ir al dashboard</button>
        <button style="padding:10px 24px;background:white;color:#374151;border:1px solid #d1d5db;border-radius:6px;cursor:pointer;font-size:14px;">Ver perfil</button>
      </div>
    </sp-result>
  `,
};

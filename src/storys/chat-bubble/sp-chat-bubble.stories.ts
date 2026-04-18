import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "../../components/chat-bubble/sp-chat-bubble.js";

const meta: Meta = {
  title: "Components/ChatBubble",
  component: "sp-chat-bubble",
  tags: ["autodocs"],
  argTypes: {
    message: { control: "text" },
    name: { control: "text" },
    time: { control: "text" },
    mine: { control: "boolean", description: "Burbuja del usuario actual (derecha)" },
    status: { control: "select", options: ["sent","delivered","read","error"] },
    typing: { control: "boolean", description: "Muestra indicador de escritura" },
    "show-avatar": { control: "boolean" },
    avatar: { control: "text" },
  },
  args: {
    message: "Hola, ¿cómo estás?",
    name: "Carlos",
    time: "10:32",
    mine: false,
    status: "read",
    typing: false,
    "show-avatar": true,
    avatar: "",
  },
  render: ({ message, name, time, mine, status, typing, avatar }) => html`
    <sp-chat-bubble
      message=${message}
      name=${name}
      time=${time}
      ?mine=${mine}
      status=${status}
      ?typing=${typing}
      avatar=${avatar}
    ></sp-chat-bubble>
  `,
};

export default meta;
type Story = StoryObj;

export const Received: Story = { args: { mine: false } };
export const Sent: Story = { args: { mine: true, message: "¡Todo bien por acá, gracias!" } };
export const Typing: Story = { args: { typing: true, message: "" } };

export const Conversation: Story = {
  render: () => html`
    <div style="max-width:420px;display:flex;flex-direction:column;gap:8px;padding:16px;background:#f9fafb;border-radius:12px;">
      <sp-chat-bubble name="Ana" time="10:30" message="Hola Carlos, ¿pudiste revisar el reporte?"></sp-chat-bubble>
      <sp-chat-bubble name="Yo" time="10:31" message="Sí, lo revisé esta mañana. Hay algunos puntos a ajustar." mine></sp-chat-bubble>
      <sp-chat-bubble name="Ana" time="10:32" message="¿Cuáles? ¿Me puedes detallar?"></sp-chat-bubble>
      <sp-chat-bubble name="Yo" time="10:33" message="Claro, te lo explico en la reunión de las 3pm." mine status="delivered"></sp-chat-bubble>
      <sp-chat-bubble name="Ana" time="10:33" typing></sp-chat-bubble>
    </div>
  `,
};

export const WithAvatar: Story = {
  render: () => html`
    <sp-chat-bubble
      name="María Torres"
      avatar="https://i.pravatar.cc/40?u=maria"
      time="11:15"
      message="El diseño final está listo para revisión."
    ></sp-chat-bubble>
  `,
};

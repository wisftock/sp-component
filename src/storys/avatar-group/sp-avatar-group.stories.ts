import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "../../components/avatar/sp-avatar.js";
import "../../components/avatar-group/sp-avatar-group.js";

const meta: Meta = {
  title: "Components/AvatarGroup",
  component: "sp-avatar-group",
  tags: ["autodocs"],
  argTypes: {
    max: { control: "number", description: "Máximo de avatares visibles" },
    size: { control: "select", options: ["xs","sm","md","lg","xl"], description: "Tamaño de todos los avatares" },
    total: { control: "number", description: "Total real (para el contador de excedente)" },
  },
  args: { max: 4, size: "md", total: 0 },
  render: ({ max, size, total }) => html`
    <sp-avatar-group max=${max} size=${size} total=${total || 0}>
      <sp-avatar name="Ana García" src="https://i.pravatar.cc/80?u=ana"></sp-avatar>
      <sp-avatar name="Carlos López"></sp-avatar>
      <sp-avatar name="María Torres" src="https://i.pravatar.cc/80?u=maria"></sp-avatar>
      <sp-avatar name="Juan Pérez"></sp-avatar>
      <sp-avatar name="Sofía Ruiz" src="https://i.pravatar.cc/80?u=sofia"></sp-avatar>
      <sp-avatar name="Diego Mora"></sp-avatar>
    </sp-avatar-group>
  `,
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const MaxTwo: Story = { args: { max: 2 } };

export const WithTotal: Story = {
  args: { max: 3, total: 24 },
};

export const AllSizes: Story = {
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:16px;">
      ${(["xs","sm","md","lg","xl"] as const).map(size => html`
        <div style="display:flex;align-items:center;gap:12px;">
          <span style="width:28px;font-size:12px;color:#6b7280;">${size}</span>
          <sp-avatar-group max=${3} size=${size}>
            <sp-avatar name="Ana García"></sp-avatar>
            <sp-avatar name="Carlos López"></sp-avatar>
            <sp-avatar name="María Torres"></sp-avatar>
            <sp-avatar name="Juan Pérez"></sp-avatar>
          </sp-avatar-group>
        </div>
      `)}
    </div>
  `,
};

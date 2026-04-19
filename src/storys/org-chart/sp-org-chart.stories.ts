import type { Meta, StoryObj } from "@storybook/web-components";
import { html, nothing } from "lit";
import "../../components/org-chart/sp-org-chart.js";

const ORG_DATA = {
  id: "ceo",
  name: "María González",
  title: "CEO",
  avatar: "https://i.pravatar.cc/48?u=ceo",
  children: [
    {
      id: "cto",
      name: "Carlos Ríos",
      title: "CTO",
      avatar: "https://i.pravatar.cc/48?u=cto",
      children: [
        { id: "fe-lead", name: "Ana Torres", title: "Frontend Lead", avatar: "https://i.pravatar.cc/48?u=fe" },
        { id: "be-lead", name: "Luis Mora", title: "Backend Lead", avatar: "https://i.pravatar.cc/48?u=be" },
        { id: "devops", name: "Sofia Vargas", title: "DevOps", avatar: "https://i.pravatar.cc/48?u=devops" },
      ],
    },
    {
      id: "cmo",
      name: "Diego Castro",
      title: "CMO",
      avatar: "https://i.pravatar.cc/48?u=cmo",
      children: [
        { id: "design", name: "Laura Peña", title: "Diseño", avatar: "https://i.pravatar.cc/48?u=design" },
        { id: "content", name: "Andrés López", title: "Contenido", avatar: "https://i.pravatar.cc/48?u=content" },
      ],
    },
    {
      id: "cfo",
      name: "Valentina Cruz",
      title: "CFO",
      avatar: "https://i.pravatar.cc/48?u=cfo",
      children: [
        { id: "finance", name: "Ricardo Soto", title: "Finanzas", avatar: "https://i.pravatar.cc/48?u=finance" },
      ],
    },
  ],
};

const meta: Meta = {
  title: "Components/OrgChart",
  component: "sp-org-chart",
  tags: ["autodocs"],
  argTypes: {
    "selected-id": { control: "text" },
  },
  args: { "selected-id": "" },
  render: (args) => html`
    <sp-org-chart
      .data=${ORG_DATA}
      selected-id=${args["selected-id"] || nothing}
    ></sp-org-chart>
  `,
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const WithSelected: Story = {
  render: () => html`<sp-org-chart .data=${ORG_DATA} selected-id="cto"></sp-org-chart>`,
};

export const SmallTeam: Story = {
  render: () => html`
    <sp-org-chart .data=${{
      id: "founder",
      name: "Juan Ramírez",
      title: "Fundador",
      children: [
        { id: "dev", name: "Paula Herrera", title: "Desarrolladora" },
        { id: "ux", name: "Marco Díaz", title: "UX Designer" },
      ],
    }}></sp-org-chart>
  `,
};

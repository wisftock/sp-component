import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "../../components/kanban/sp-kanban.js";

const DEFAULT_COLUMNS = [
  {
    id: "todo", title: "To Do", color: "#9ca3af",
    cards: [
      { id: "c1", title: "Design new landing page", description: "Create wireframes and mockups", priority: "high", tags: [{ label: "Design", bg: "#ede9fe", color: "#7c3aed" }] },
      { id: "c2", title: "Write unit tests", description: "Cover all edge cases", priority: "medium" },
      { id: "c3", title: "Update dependencies", priority: "low" },
    ],
  },
  {
    id: "in-progress", title: "In Progress", color: "#3b82f6",
    cards: [
      { id: "c4", title: "API integration", description: "Connect to the backend REST API", priority: "high", tags: [{ label: "Backend", bg: "#dbeafe", color: "#1d4ed8" }] },
      { id: "c5", title: "Mobile responsiveness", priority: "medium" },
    ],
  },
  {
    id: "review", title: "In Review", color: "#f59e0b",
    cards: [
      { id: "c6", title: "Authentication flow", description: "OAuth + JWT implementation", tags: [{ label: "Security", bg: "#fef3c7", color: "#92400e" }] },
    ],
  },
  {
    id: "done", title: "Done", color: "#22c55e",
    cards: [
      { id: "c7", title: "Project setup", priority: "low" },
      { id: "c8", title: "CI/CD pipeline", tags: [{ label: "DevOps", bg: "#dcfce7", color: "#166534" }] },
    ],
  },
];

const meta: Meta = {
  title: "Components/Kanban",
  component: "sp-kanban",
  tags: ["autodocs"],
  argTypes: {
    addable:  { control: "boolean", description: "Show Add card buttons" },
    disabled: { control: "boolean", description: "Disable drag & drop" },
  },
  args: { addable: true, disabled: false },
  render: ({ addable, disabled }) => html`
    <sp-kanban
      ?addable=${addable}
      ?disabled=${disabled}
      .columns=${JSON.parse(JSON.stringify(DEFAULT_COLUMNS))}
    ></sp-kanban>
  `,
};
export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const Disabled: Story = {
  args: { disabled: true },
  name: "Disabled (no drag)",
};

export const EventLog: Story = {
  name: "Event Log (sp-card-move)",
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:12px;">
      <sp-kanban
        .columns=${JSON.parse(JSON.stringify(DEFAULT_COLUMNS))}
        @sp-card-move=${(e: CustomEvent) => {
          const out = document.getElementById("kanban-log");
          if (out) out.textContent = `"${e.detail.card.title}" moved from "${e.detail.fromCol}" → "${e.detail.toCol}"`;
        }}
      ></sp-kanban>
      <code id="kanban-log" style="font-size:0.8rem;color:#6366f1;">— drag a card to see event —</code>
    </div>
  `,
};

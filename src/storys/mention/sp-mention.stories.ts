import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "../../components/mention/sp-mention.js";

const USERS = [
  { id: "alice",   label: "Alice Johnson",  description: "Product designer",  avatar: "https://i.pravatar.cc/150?img=1" },
  { id: "bob",     label: "Bob Smith",      description: "Frontend developer", avatar: "https://i.pravatar.cc/150?img=2" },
  { id: "carlos",  label: "Carlos López",   description: "Backend developer",  avatar: "https://i.pravatar.cc/150?img=3" },
  { id: "diana",   label: "Diana Chen",     description: "QA engineer",        avatar: "https://i.pravatar.cc/150?img=4" },
  { id: "eva",     label: "Eva Torres",     description: "Tech lead",          avatar: "https://i.pravatar.cc/150?img=5" },
  { id: "frank",   label: "Frank Wilson",   description: "DevOps",             avatar: "https://i.pravatar.cc/150?img=6" },
];

const meta: Meta = {
  title: "Components/Mention",
  component: "sp-mention",
  tags: ["autodocs"],
  argTypes: {
    label:       { control: "text" },
    placeholder: { control: "text" },
    maxResults:  { control: "number" },
    disabled:    { control: "boolean" },
  },
  args: {
    label: "Comment",
    placeholder: "Type @ to mention someone...",
    maxResults: 6,
    disabled: false,
  },
  render: ({ label, placeholder, maxResults, disabled }) => html`
    <div style="max-width:480px;">
      <sp-mention
        label=${label || ""}
        placeholder=${placeholder || ""}
        max-results=${maxResults || 6}
        ?disabled=${disabled}
        .items=${USERS}
      ></sp-mention>
    </div>
  `,
};
export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const Disabled: Story = { args: { disabled: true } };

export const EventLog: Story = {
  name: "Event Log (sp-mention)",
  render: () => html`
    <div style="max-width:480px;display:flex;flex-direction:column;gap:12px;">
      <sp-mention
        label="Post a comment"
        placeholder="Type @ to mention..."
        .items=${USERS}
        @sp-mention=${(e: CustomEvent) => {
          const out = document.getElementById("mention-log");
          if (out) out.textContent = `Mentioned: @${e.detail.label} (${e.detail.id})`;
        }}
      ></sp-mention>
      <code id="mention-log" style="font-size:0.8rem;color:#6366f1;">— type @a to see suggestions —</code>
    </div>
  `,
};

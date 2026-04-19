import type { Meta, StoryObj } from "@storybook/web-components";
import { html, nothing } from "lit";
import type { SpEmptyStateProps } from "../../components/empty-state/sp-empty-state.types.js";
import "../../components/empty-state/sp-empty-state.js";
import "../../components/button/sp-button.js";

const meta: Meta<SpEmptyStateProps> = {
  title: "Components/EmptyState",
  component: "sp-empty-state",
  tags: ["autodocs"],
  argTypes: {
    title: { control: "text", description: "Main heading text" },
    description: { control: "text", description: "Supporting description text" },
    icon: { control: "text", description: "URL of a custom icon image" },
  },
  args: {
    title: "No data found",
    description: "",
    icon: "",
  },
  render: (args) => html`
    <sp-empty-state
      title=${args.title}
      description=${args.description || nothing}
      icon=${args.icon || nothing}
    ></sp-empty-state>
  `,
};

export default meta;
type Story = StoryObj<SpEmptyStateProps>;

export const Default: Story = {};

export const WithDescription: Story = {
  render: () => html`
    <sp-empty-state
      title="No results found"
      description="We couldn't find anything matching your search. Try adjusting your filters or search terms."
    ></sp-empty-state>
  `,
};

export const WithAction: Story = {
  render: () => html`
    <sp-empty-state
      title="No projects yet"
      description="Get started by creating your first project. It only takes a few seconds."
    >
      <sp-button variant="primary">Create project</sp-button>
    </sp-empty-state>
  `,
};

export const WithCustomIcon: Story = {
  render: () => html`
    <sp-empty-state
      title="Inbox is empty"
      description="You have no new messages. Check back later."
      icon="https://api.iconify.design/lucide:inbox.svg"
    ></sp-empty-state>
  `,
};

export const InTable: Story = {
  render: () => html`
    <div style="border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
      <div style="padding: 16px 20px; border-bottom: 1px solid #e5e7eb; background: #f9fafb;">
        <h2 style="margin: 0; font-size: 16px; font-weight: 600; color: #111827;">Users</h2>
      </div>
      <sp-empty-state
        title="No users found"
        description="Invite team members to get started with your workspace."
      >
        <sp-button variant="primary">Invite users</sp-button>
        <sp-button variant="ghost">Learn more</sp-button>
      </sp-empty-state>
    </div>
  `,
};

import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "../../components/notification-center/sp-notification-center.js";

const meta: Meta = {
  title: "Components/NotificationCenter",
  component: "sp-notification-center",
  tags: ["autodocs"],
  argTypes: {
    notifications: { control: "object",  description: "Array of notification objects — each with id, title, body?, time?, type? (info | success | warning | error) and read?" },
    title:         { control: "text",    description: "Dropdown header label" },
    emptyText:     { control: "text",    description: "Message shown when the notification list is empty" },
  },
};
export default meta;
type Story = StoryObj;

const NOTIFS = [
  { id: "1", title: "New comment on your post", body: "Alice left a comment on 'Q4 Report'", time: "2m ago", type: "info" as const, read: false },
  { id: "2", title: "Deployment successful", body: "Production build #247 deployed without errors.", time: "15m ago", type: "success" as const, read: false },
  { id: "3", title: "Storage limit warning", body: "You've used 90% of your 10 GB quota.", time: "1h ago", type: "warning" as const, read: false },
  { id: "4", title: "Build failed", body: "CI pipeline failed on branch feature/auth.", time: "2h ago", type: "error" as const, read: true },
  { id: "5", title: "Weekly digest ready", body: "Your activity summary for this week is ready.", time: "Yesterday", type: "info" as const, read: true },
];

export const Default: Story = {
  render: () => html`
    <div style="padding:40px;display:flex;justify-content:flex-end;">
      <sp-notification-center .notifications=${[...NOTIFS]}></sp-notification-center>
    </div>
  `,
};

export const Empty: Story = {
  render: () => html`
    <div style="padding:40px;display:flex;justify-content:flex-end;">
      <sp-notification-center .notifications=${[]} empty-text="No new notifications"></sp-notification-center>
    </div>
  `,
};

export const AllRead: Story = {
  name: "All read (no badge)",
  render: () => html`
    <div style="padding:40px;display:flex;justify-content:flex-end;">
      <sp-notification-center
        .notifications=${NOTIFS.map(n => ({ ...n, read: true }))}
      ></sp-notification-center>
    </div>
  `,
};

export const WithIcons: Story = {
  name: "Custom icons",
  render: () => html`
    <div style="padding:40px;display:flex;justify-content:flex-end;">
      <sp-notification-center .notifications=${[
        { id: "a", title: "Pull request merged", icon: "🎉", body: "feat/dashboard has been merged to main.", time: "5m ago", read: false },
        { id: "b", title: "New team member", icon: "👋", body: "Bob Smith joined your workspace.", time: "1h ago", read: false },
        { id: "c", title: "Subscription renewed", icon: "✅", body: "Your Pro plan has been renewed.", time: "1d ago", read: true },
      ]}></sp-notification-center>
    </div>
  `,
};

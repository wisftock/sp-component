import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import type { SpSidebarProps } from "../../components/sidebar/sp-sidebar.types.js";
import "../../components/sidebar/sp-sidebar.js";

const meta: Meta<SpSidebarProps> = {
  title: "Components/Sidebar",
  component: "sp-sidebar",
  tags: ["autodocs"],
  argTypes: {
    open: {
      control: "boolean",
      description: "Whether the sidebar is visible",
    },
    placement: {
      control: "select",
      options: ["left", "right"],
      description: "Side the sidebar appears on",
    },
    width: {
      control: "text",
      description: "CSS width of the sidebar",
    },
    collapsible: {
      control: "boolean",
      description: "Shows a toggle button to collapse/expand",
    },
    collapsed: {
      control: "boolean",
      description: "Whether the sidebar is collapsed to minimal width",
    },
    bordered: {
      control: "boolean",
      description: "Adds a border on the inner edge",
    },
  },
  args: {
    open: true,
    placement: "left",
    width: "240px",
    collapsible: false,
    collapsed: false,
    bordered: false,
  },
};

export default meta;
type Story = StoryObj<SpSidebarProps>;

export const Default: Story = {
  render: () => html`
    <div style="display: flex; height: 300px; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
      <sp-sidebar>
        <nav style="padding: 16px; display: flex; flex-direction: column; gap: 4px;">
          <a href="#" style="padding: 8px 12px; text-decoration: none; color: #374151; border-radius: 6px; font-size: 14px;">Dashboard</a>
          <a href="#" style="padding: 8px 12px; text-decoration: none; color: #374151; border-radius: 6px; font-size: 14px;">Projects</a>
          <a href="#" style="padding: 8px 12px; text-decoration: none; color: #374151; border-radius: 6px; font-size: 14px;">Settings</a>
        </nav>
      </sp-sidebar>
      <main style="flex: 1; padding: 24px; background: #f9fafb;">
        <p style="color: #6b7280; font-size: 14px;">Main content area</p>
      </main>
    </div>
  `,
};

export const WithHeader: Story = {
  render: () => html`
    <div style="display: flex; height: 300px; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
      <sp-sidebar bordered>
        <div slot="header" style="display: flex; align-items: center; gap: 8px;">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <rect width="24" height="24" rx="5" fill="#3b82f6"/>
            <path d="M7 12l4 4 6-6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span style="font-weight: 700; font-size: 15px;">Acme</span>
        </div>
        <nav style="padding: 8px; display: flex; flex-direction: column; gap: 4px;">
          <a href="#" style="padding: 8px 12px; text-decoration: none; color: #374151; border-radius: 6px; font-size: 14px;">Dashboard</a>
          <a href="#" style="padding: 8px 12px; text-decoration: none; color: #374151; border-radius: 6px; font-size: 14px;">Projects</a>
        </nav>
      </sp-sidebar>
      <main style="flex: 1; padding: 24px; background: #f9fafb;">
        <p style="color: #6b7280; font-size: 14px;">Main content area</p>
      </main>
    </div>
  `,
};

export const WithFooter: Story = {
  render: () => html`
    <div style="display: flex; height: 320px; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
      <sp-sidebar bordered>
        <nav style="padding: 8px; display: flex; flex-direction: column; gap: 4px;">
          <a href="#" style="padding: 8px 12px; text-decoration: none; color: #374151; border-radius: 6px; font-size: 14px;">Dashboard</a>
          <a href="#" style="padding: 8px 12px; text-decoration: none; color: #374151; border-radius: 6px; font-size: 14px;">Projects</a>
          <a href="#" style="padding: 8px 12px; text-decoration: none; color: #374151; border-radius: 6px; font-size: 14px;">Settings</a>
        </nav>
        <div slot="footer" style="display: flex; align-items: center; gap: 10px;">
          <div style="width: 32px; height: 32px; border-radius: 50%; background: #3b82f6; display: flex; align-items: center; justify-content: center; color: white; font-size: 13px; font-weight: 600;">JD</div>
          <div>
            <div style="font-size: 13px; font-weight: 500;">John Doe</div>
            <div style="font-size: 11px; color: #9ca3af;">john@example.com</div>
          </div>
        </div>
      </sp-sidebar>
      <main style="flex: 1; padding: 24px; background: #f9fafb;">
        <p style="color: #6b7280; font-size: 14px;">Main content area</p>
      </main>
    </div>
  `,
};

export const Collapsible: Story = {
  render: () => html`
    <div style="display: flex; height: 300px; border: 1px solid #e5e7eb; border-radius: 8px; overflow: visible;">
      <sp-sidebar bordered collapsible>
        <nav style="padding: 8px; display: flex; flex-direction: column; gap: 4px;">
          <a href="#" style="padding: 8px 12px; text-decoration: none; color: #374151; border-radius: 6px; font-size: 14px; white-space: nowrap;">Dashboard</a>
          <a href="#" style="padding: 8px 12px; text-decoration: none; color: #374151; border-radius: 6px; font-size: 14px; white-space: nowrap;">Projects</a>
          <a href="#" style="padding: 8px 12px; text-decoration: none; color: #374151; border-radius: 6px; font-size: 14px; white-space: nowrap;">Settings</a>
        </nav>
      </sp-sidebar>
      <main style="flex: 1; padding: 24px; background: #f9fafb;">
        <p style="color: #6b7280; font-size: 14px;">Click the arrow to collapse the sidebar</p>
      </main>
    </div>
  `,
};

export const CollapsedByDefault: Story = {
  render: () => html`
    <div style="display: flex; height: 300px; border: 1px solid #e5e7eb; border-radius: 8px; overflow: visible;">
      <sp-sidebar bordered collapsible collapsed>
        <nav style="padding: 8px; display: flex; flex-direction: column; gap: 4px;">
          <a href="#" style="padding: 8px 12px; text-decoration: none; color: #374151; border-radius: 6px; font-size: 14px; white-space: nowrap;">Dashboard</a>
          <a href="#" style="padding: 8px 12px; text-decoration: none; color: #374151; border-radius: 6px; font-size: 14px; white-space: nowrap;">Projects</a>
        </nav>
      </sp-sidebar>
      <main style="flex: 1; padding: 24px; background: #f9fafb;">
        <p style="color: #6b7280; font-size: 14px;">Sidebar starts collapsed</p>
      </main>
    </div>
  `,
};

export const RightPlacement: Story = {
  render: () => html`
    <div style="display: flex; height: 300px; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
      <main style="flex: 1; padding: 24px; background: #f9fafb;">
        <p style="color: #6b7280; font-size: 14px;">Main content area</p>
      </main>
      <sp-sidebar placement="right" bordered>
        <nav style="padding: 8px; display: flex; flex-direction: column; gap: 4px;">
          <a href="#" style="padding: 8px 12px; text-decoration: none; color: #374151; border-radius: 6px; font-size: 14px;">Filters</a>
          <a href="#" style="padding: 8px 12px; text-decoration: none; color: #374151; border-radius: 6px; font-size: 14px;">Sort</a>
        </nav>
      </sp-sidebar>
    </div>
  `,
};

export const Bordered: Story = {
  render: () => html`
    <div style="display: flex; height: 300px; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
      <sp-sidebar bordered>
        <nav style="padding: 8px; display: flex; flex-direction: column; gap: 4px;">
          <a href="#" style="padding: 8px 12px; text-decoration: none; color: #374151; border-radius: 6px; font-size: 14px;">Home</a>
          <a href="#" style="padding: 8px 12px; text-decoration: none; color: #374151; border-radius: 6px; font-size: 14px;">Profile</a>
          <a href="#" style="padding: 8px 12px; text-decoration: none; color: #374151; border-radius: 6px; font-size: 14px;">Settings</a>
        </nav>
      </sp-sidebar>
      <main style="flex: 1; padding: 24px; background: #f9fafb;">
        <p style="color: #6b7280; font-size: 14px;">Border visible between sidebar and content</p>
      </main>
    </div>
  `,
};

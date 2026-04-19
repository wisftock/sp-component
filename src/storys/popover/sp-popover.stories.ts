import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import type { SpPopoverProps } from "../../components/popover/sp-popover.types.js";
import "../../components/popover/sp-popover.js";
import "../../components/button/sp-button.js";

const meta: Meta<SpPopoverProps> = {
  title: "Components/Popover",
  component: "sp-popover",
  tags: ["autodocs"],
  argTypes: {
    open: { control: "boolean", description: "Whether the popover is open" },
    placement: {
      control: "select",
      options: ["top", "bottom", "left", "right"],
      description: "Position relative to trigger",
    },
    distance: {
      control: "number",
      description: "Gap in px between trigger and popover",
    },
    arrow: {
      control: "boolean",
      description: "Shows a directional arrow",
    },
  },
  args: {
    open: false,
    placement: "bottom",
    distance: 8,
    arrow: true,
  },
  render: (args) => html`
    <div style="padding: 80px; display: inline-block;">
      <sp-popover
        placement=${args.placement}
        distance=${args.distance}
        ?open=${args.open}
        ?arrow=${args.arrow}
      >
        <sp-button slot="trigger">Open Popover</sp-button>
        <p style="margin: 0;">This is the popover content.</p>
      </sp-popover>
    </div>
  `,
};

export default meta;
type Story = StoryObj<SpPopoverProps>;

// ---- Default (bottom) ----

export const Default: Story = {};

// ---- Top ----

export const Top: Story = {
  render: () => html`
    <div style="padding: 80px; display: inline-block;">
      <sp-popover placement="top">
        <sp-button slot="trigger">Top Popover</sp-button>
        <p style="margin: 0;">Content above the trigger.</p>
      </sp-popover>
    </div>
  `,
};

// ---- Left ----

export const Left: Story = {
  render: () => html`
    <div style="padding: 80px; display: inline-block;">
      <sp-popover placement="left">
        <sp-button slot="trigger">Left Popover</sp-button>
        <p style="margin: 0;">Content to the left.</p>
      </sp-popover>
    </div>
  `,
};

// ---- Right ----

export const Right: Story = {
  render: () => html`
    <div style="padding: 80px; display: inline-block;">
      <sp-popover placement="right">
        <sp-button slot="trigger">Right Popover</sp-button>
        <p style="margin: 0;">Content to the right.</p>
      </sp-popover>
    </div>
  `,
};

// ---- WithArrow ----

export const WithArrow: Story = {
  render: () => html`
    <div style="padding: 80px; display: inline-block;">
      <sp-popover placement="bottom" ?arrow=${true}>
        <sp-button slot="trigger">With Arrow</sp-button>
        <p style="margin: 0;">Arrow is visible.</p>
      </sp-popover>
    </div>
  `,
};

// ---- WithoutArrow ----

export const WithoutArrow: Story = {
  render: () => html`
    <div style="padding: 80px; display: inline-block;">
      <sp-popover placement="bottom" ?arrow=${false}>
        <sp-button slot="trigger">Without Arrow</sp-button>
        <p style="margin: 0;">No arrow indicator.</p>
      </sp-popover>
    </div>
  `,
};

// ---- WithRichContent ----

export const WithRichContent: Story = {
  render: () => html`
    <div style="padding: 80px; display: inline-block;">
      <sp-popover placement="bottom">
        <sp-button slot="trigger">Rich Content</sp-button>
        <div style="min-width: 200px;">
          <p style="margin: 0 0 8px; font-weight: 600;">User Profile</p>
          <p style="margin: 0 0 4px; font-size: 14px; color: #6b7280;">john@example.com</p>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 8px 0;" />
          <div style="display: flex; flex-direction: column; gap: 4px;">
            <a href="#" style="font-size: 14px; color: #3b82f6; text-decoration: none;">View profile</a>
            <a href="#" style="font-size: 14px; color: #ef4444; text-decoration: none;">Sign out</a>
          </div>
        </div>
      </sp-popover>
    </div>
  `,
};

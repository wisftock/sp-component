import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import type { SpTooltipProps } from "../../components/tooltip/sp-tooltip.types.js";
import "../../components/tooltip/sp-tooltip.js";
import "../../components/button/sp-button.js";

const meta: Meta<SpTooltipProps> = {
  title: "Components/Tooltip",
  component: "sp-tooltip",
  tags: ["autodocs"],
  argTypes: {
    content: { control: "text", description: "Tooltip text content" },
    placement: {
      control: "select",
      options: ["top", "bottom", "left", "right"],
      description: "Position relative to trigger",
    },
    trigger: {
      control: "select",
      options: ["hover", "focus", "click", "manual"],
      description: "What triggers the tooltip",
    },
    disabled: { control: "boolean", description: "Disables the tooltip" },
    open: { control: "boolean", description: "Controls visibility" },
    distance: { control: "number", description: "Gap in px between trigger and tooltip" },
  },
  args: {
    content: "This is a tooltip",
    placement: "top",
    trigger: "hover",
    disabled: false,
    open: false,
    distance: 8,
  },
};

export default meta;
type Story = StoryObj<SpTooltipProps>;

// ---- Top (default) ----

export const Top: Story = {
  render: () => html`
    <div style="padding: 60px; display: inline-block;">
      <sp-tooltip content="Tooltip on top" placement="top">
        <sp-button>Hover me</sp-button>
      </sp-tooltip>
    </div>
  `,
};

// ---- Bottom ----

export const Bottom: Story = {
  render: () => html`
    <div style="padding: 60px; display: inline-block;">
      <sp-tooltip content="Tooltip on bottom" placement="bottom">
        <sp-button>Hover me</sp-button>
      </sp-tooltip>
    </div>
  `,
};

// ---- Left ----

export const Left: Story = {
  render: () => html`
    <div style="padding: 60px; display: inline-block;">
      <sp-tooltip content="Tooltip on left" placement="left">
        <sp-button>Hover me</sp-button>
      </sp-tooltip>
    </div>
  `,
};

// ---- Right ----

export const Right: Story = {
  render: () => html`
    <div style="padding: 60px; display: inline-block;">
      <sp-tooltip content="Tooltip on right" placement="right">
        <sp-button>Hover me</sp-button>
      </sp-tooltip>
    </div>
  `,
};

// ---- TriggerHover ----

export const TriggerHover: Story = {
  render: () => html`
    <div style="padding: 60px; display: inline-block;">
      <sp-tooltip content="Hover trigger" trigger="hover">
        <sp-button>Hover</sp-button>
      </sp-tooltip>
    </div>
  `,
};

// ---- TriggerFocus ----

export const TriggerFocus: Story = {
  render: () => html`
    <div style="padding: 60px; display: inline-block;">
      <sp-tooltip content="Focus trigger" trigger="focus">
        <sp-button>Focus me (Tab)</sp-button>
      </sp-tooltip>
    </div>
  `,
};

// ---- TriggerClick ----

export const TriggerClick: Story = {
  render: () => html`
    <div style="padding: 60px; display: inline-block;">
      <sp-tooltip content="Click trigger — click again to hide" trigger="click">
        <sp-button>Click me</sp-button>
      </sp-tooltip>
    </div>
  `,
};

// ---- Disabled ----

export const Disabled: Story = {
  render: () => html`
    <div style="padding: 60px; display: inline-block;">
      <sp-tooltip content="You won't see this" disabled>
        <sp-button>Tooltip disabled</sp-button>
      </sp-tooltip>
    </div>
  `,
};

// ---- LongContent ----

export const LongContent: Story = {
  render: () => html`
    <div style="padding: 80px; display: inline-block;">
      <sp-tooltip
        content="This is a much longer tooltip message that wraps across multiple lines to demonstrate the max-width behavior."
        placement="top"
      >
        <sp-button>Long tooltip</sp-button>
      </sp-tooltip>
    </div>
  `,
};

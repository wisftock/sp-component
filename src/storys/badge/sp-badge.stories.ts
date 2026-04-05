import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import type { SpBadgeProps } from "../../components/badge/sp-badge.types.js";
import "../../components/badge/sp-badge.js";

const meta: Meta<SpBadgeProps> = {
  title: "Components/Badge",
  component: "sp-badge",
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "success", "warning", "danger", "neutral", "purple", "teal", "orange", "cyan"],
      description: "Color variant",
    },
    pill: {
      control: "boolean",
      description: "Renders with fully rounded corners",
    },
    pulsing: {
      control: "boolean",
      description: "Applies a pulsing opacity animation",
    },
  },
  args: {
    variant: "primary",
    pill: false,
    pulsing: false,
  },
  render: ({ variant, pill, pulsing }) => html`
    <sp-badge variant=${variant} ?pill=${pill} ?pulsing=${pulsing}>Badge</sp-badge>
  `,
};

export default meta;
type Story = StoryObj<SpBadgeProps>;

export const AllVariants: Story = {
  render: () => html`
    <div style="display: flex; flex-wrap: wrap; gap: 8px; align-items: center;">
      <sp-badge variant="primary">Primary</sp-badge>
      <sp-badge variant="secondary">Secondary</sp-badge>
      <sp-badge variant="success">Success</sp-badge>
      <sp-badge variant="warning">Warning</sp-badge>
      <sp-badge variant="danger">Danger</sp-badge>
      <sp-badge variant="neutral">Neutral</sp-badge>
      <sp-badge variant="purple">Purple</sp-badge>
      <sp-badge variant="teal">Teal</sp-badge>
      <sp-badge variant="orange">Orange</sp-badge>
      <sp-badge variant="cyan">Cyan</sp-badge>
    </div>
  `,
};

export const NewColors: Story = {
  name: "New Colors (purple / teal / orange / cyan)",
  render: () => html`
    <div style="display: flex; flex-wrap: wrap; gap: 8px; align-items: center;">
      <sp-badge variant="purple">Purple</sp-badge>
      <sp-badge variant="teal">Teal</sp-badge>
      <sp-badge variant="orange">Orange</sp-badge>
      <sp-badge variant="cyan">Cyan</sp-badge>
      <sp-badge variant="purple" pill>Purple Pill</sp-badge>
      <sp-badge variant="teal" pill>Teal Pill</sp-badge>
      <sp-badge variant="orange" pill>Orange Pill</sp-badge>
      <sp-badge variant="cyan" pill>Cyan Pill</sp-badge>
    </div>
  `,
};

export const Pill: Story = {
  render: () => html`
    <div style="display: flex; flex-wrap: wrap; gap: 8px; align-items: center;">
      <sp-badge variant="primary" pill>Primary</sp-badge>
      <sp-badge variant="secondary" pill>Secondary</sp-badge>
      <sp-badge variant="success" pill>Success</sp-badge>
      <sp-badge variant="warning" pill>Warning</sp-badge>
      <sp-badge variant="danger" pill>Danger</sp-badge>
      <sp-badge variant="neutral" pill>Neutral</sp-badge>
    </div>
  `,
};

export const Pulsing: Story = {
  render: () => html`
    <div style="display: flex; flex-wrap: wrap; gap: 8px; align-items: center;">
      <sp-badge variant="primary" pulsing>Live</sp-badge>
      <sp-badge variant="danger" pulsing pill>Alert</sp-badge>
    </div>
  `,
};

export const WithNumbers: Story = {
  render: () => html`
    <div style="display: flex; flex-wrap: wrap; gap: 8px; align-items: center;">
      <sp-badge variant="primary">1</sp-badge>
      <sp-badge variant="danger">99+</sp-badge>
      <sp-badge variant="success" pill>42</sp-badge>
    </div>
  `,
};

export const WithText: Story = {
  render: () => html`
    <div style="display: flex; flex-wrap: wrap; gap: 8px; align-items: center;">
      <sp-badge variant="success">Active</sp-badge>
      <sp-badge variant="warning">Pending</sp-badge>
      <sp-badge variant="danger">Rejected</sp-badge>
      <sp-badge variant="neutral">Draft</sp-badge>
    </div>
  `,
};

export const InContext: Story = {
  render: () => html`
    <div style="display: flex; gap: 16px; align-items: center;">
      <div style="position: relative; display: inline-flex;">
        <button
          style="padding: 8px 16px; background: #3b82f6; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 14px;"
        >
          Notifications
        </button>
        <sp-badge
          variant="danger"
          pill
          style="position: absolute; top: -8px; right: -8px;"
        >3</sp-badge>
      </div>
      <div style="display: flex; align-items: center; gap: 6px;">
        <span style="font-size: 14px; font-weight: 500;">User Status</span>
        <sp-badge variant="success">Online</sp-badge>
      </div>
    </div>
  `,
};

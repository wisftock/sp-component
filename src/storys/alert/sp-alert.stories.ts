import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import type { SpAlertProps } from "../../components/alert/sp-alert.types.js";
import "../../components/alert/sp-alert.js";

const meta: Meta<SpAlertProps> = {
  title: "Components/Alert",
  component: "sp-alert",
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["info", "success", "warning", "error"],
      description: "Visual style of the alert",
    },
    title: {
      control: "text",
      description: "Optional bold title above the message",
    },
    dismissible: {
      control: "boolean",
      description: "Shows a close button when true",
    },
    open: {
      control: "boolean",
      description: "Controls visibility of the alert",
    },
  },
  args: {
    variant: "info",
    title: "",
    dismissible: false,
    open: true,
  },
  render: ({ variant, title, dismissible, open }) => html`
    <sp-alert
      variant=${variant}
      title=${title}
      ?dismissible=${dismissible}
      ?open=${open}
    >
      This is an alert message.
    </sp-alert>
  `,
};

export default meta;
type Story = StoryObj<SpAlertProps>;

export const Info: Story = {
  args: { variant: "info" },
  render: () => html`
    <sp-alert variant="info">This is an informational message.</sp-alert>
  `,
};

export const Success: Story = {
  args: { variant: "success" },
  render: () => html`
    <sp-alert variant="success">Your changes have been saved successfully.</sp-alert>
  `,
};

export const Warning: Story = {
  args: { variant: "warning" },
  render: () => html`
    <sp-alert variant="warning">Please review your input before continuing.</sp-alert>
  `,
};

export const Error: Story = {
  args: { variant: "error" },
  render: () => html`
    <sp-alert variant="error">Something went wrong. Please try again.</sp-alert>
  `,
};

export const WithTitle: Story = {
  render: () => html`
    <sp-alert variant="info" title="Heads up!">
      There is a scheduled maintenance window tonight from 2–4 AM UTC.
    </sp-alert>
  `,
};

export const Dismissible: Story = {
  render: () => html`
    <sp-alert variant="success" title="Done!" dismissible>
      Your file has been uploaded.
    </sp-alert>
  `,
};

export const AllVariants: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 12px;">
      <sp-alert variant="info">Info: System update available.</sp-alert>
      <sp-alert variant="success">Success: Profile saved.</sp-alert>
      <sp-alert variant="warning">Warning: Storage is almost full.</sp-alert>
      <sp-alert variant="error">Error: Failed to connect.</sp-alert>
    </div>
  `,
};

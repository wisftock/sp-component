import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import type { SpToastProps } from "../../components/toast/sp-toast.types.js";
import "../../components/toast/sp-toast.js";

const meta: Meta<SpToastProps> = {
  title: "Components/Toast",
  component: "sp-toast",
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["neutral", "info", "success", "warning", "error"],
      description: "Visual style of the toast",
    },
    message: {
      control: "text",
      description: "Toast message text",
    },
    duration: {
      control: "number",
      description: "Auto-close delay in ms (0 = no auto close)",
    },
    position: {
      control: "select",
      options: ["top-right", "top-left", "bottom-right", "bottom-left", "top-center", "bottom-center"],
      description: "Position hint for a toast container",
    },
    open: {
      control: "boolean",
      description: "Controls visibility",
    },
    closable: {
      control: "boolean",
      description: "Shows a close button when true",
    },
  },
  args: {
    variant: "neutral",
    message: "This is a toast notification.",
    duration: 4000,
    position: "top-right",
    open: true,
    closable: true,
  },
  render: ({ variant, message, duration, position, open, closable }) => html`
    <sp-toast
      variant=${variant}
      message=${message}
      duration=${duration}
      position=${position}
      ?open=${open}
      ?closable=${closable}
    ></sp-toast>
  `,
};

export default meta;
type Story = StoryObj<SpToastProps>;

export const Neutral: Story = {
  args: { variant: "neutral", open: true, message: "Changes have been saved." },
};

export const AllVariants: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 12px; align-items: flex-start;">
      <sp-toast variant="neutral" message="Neutral toast" open></sp-toast>
      <sp-toast variant="info" message="Info: New update available." open></sp-toast>
      <sp-toast variant="success" message="Success: File uploaded." open></sp-toast>
      <sp-toast variant="warning" message="Warning: Low disk space." open></sp-toast>
      <sp-toast variant="error" message="Error: Connection failed." open></sp-toast>
    </div>
  `,
};

export const WithDuration: Story = {
  render: () => html`
    <sp-toast
      variant="info"
      message="This toast will close after 3 seconds."
      duration="3000"
      open
    ></sp-toast>
  `,
};

export const Closable: Story = {
  render: () => html`
    <sp-toast
      variant="success"
      message="You can close this toast manually."
      duration="0"
      open
      closable
    ></sp-toast>
  `,
};

export const NotClosable: Story = {
  render: () => html`
    <sp-toast
      variant="warning"
      message="This toast has no close button."
      duration="0"
      open
    ></sp-toast>
  `,
};

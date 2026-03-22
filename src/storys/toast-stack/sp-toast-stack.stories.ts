import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import type { SpToastStackProps } from "../../components/toast-stack/sp-toast-stack.types.js";
import "../../components/toast-stack/sp-toast-stack.js";

const meta: Meta<SpToastStackProps> = {
  title: "Components/ToastStack",
  component: "sp-toast-stack",
  tags: ["autodocs"],
  argTypes: {
    position: {
      control: "select",
      options: [
        "top-left",
        "top-center",
        "top-right",
        "bottom-left",
        "bottom-center",
        "bottom-right",
      ],
      description: "Stack position on screen",
    },
    max: {
      control: "number",
      description: "Max visible toasts",
    },
  },
  args: {
    position: "bottom-right",
    max: 5,
  },
};

export default meta;
type Story = StoryObj<SpToastStackProps>;

export const AllVariants: Story = {
  render: () => html`
    <sp-toast-stack id="stack-variants" position="bottom-right" max="5"></sp-toast-stack>
    <div style="display:flex;gap:8px;flex-wrap:wrap;">
      <button @click=${() => {
        const stack = document.getElementById("stack-variants") as any;
        stack?.show({ message: "This is an info message", variant: "info", title: "Info" });
      }}>Info</button>
      <button @click=${() => {
        const stack = document.getElementById("stack-variants") as any;
        stack?.show({ message: "Operation completed successfully", variant: "success", title: "Success" });
      }}>Success</button>
      <button @click=${() => {
        const stack = document.getElementById("stack-variants") as any;
        stack?.show({ message: "Please review before continuing", variant: "warning", title: "Warning" });
      }}>Warning</button>
      <button @click=${() => {
        const stack = document.getElementById("stack-variants") as any;
        stack?.show({ message: "Something went wrong", variant: "error", title: "Error" });
      }}>Error</button>
    </div>
  `,
};

function showAtPosition(pos: string) {
  const stack = document.getElementById("stack-pos") as any;
  if (stack) {
    stack.position = pos;
    stack.show({ message: "Position: " + pos, variant: "info" });
  }
}

export const Positions: Story = {
  render: () => html`
    <sp-toast-stack id="stack-pos" position="top-right" max="5"></sp-toast-stack>
    <div style="display:flex;gap:8px;flex-wrap:wrap;">
      ${["top-left","top-center","top-right","bottom-left","bottom-center","bottom-right"].map(
        (pos) => html`
          <button @click=${() => showAtPosition(pos)}>${pos}</button>
        `
      )}
    </div>
  `,
};

export const Persistent: Story = {
  render: () => html`
    <sp-toast-stack id="stack-persist" position="bottom-right"></sp-toast-stack>
    <button @click=${() => {
      const stack = document.getElementById("stack-persist") as any;
      stack?.show({ message: "This toast will not auto-dismiss", variant: "warning", title: "Persistent", duration: 0, closable: true });
    }}>Show Persistent Toast</button>
  `,
};

export const Programmatic: Story = {
  render: () => html`
    <sp-toast-stack id="stack-prog" position="bottom-right" max="5"></sp-toast-stack>
    <button @click=${() => {
      const stack = document.getElementById("stack-prog") as any;
      stack?.show({ message: "Triggered programmatically!", variant: "success", title: "Done", duration: 3000 });
    }}>Trigger Toast</button>
  `,
};

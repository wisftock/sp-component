import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import type { SpConfirmDialogProps } from "../../components/confirm-dialog/sp-confirm-dialog.types.js";
import "../../components/confirm-dialog/sp-confirm-dialog.js";

const meta: Meta<SpConfirmDialogProps> = {
  title: "Components/ConfirmDialog",
  component: "sp-confirm-dialog",
  tags: ["autodocs"],
  argTypes: {
    open: { control: "boolean" },
    title: { control: "text" },
    message: { control: "text" },
    confirmLabel: { control: "text" },
    cancelLabel: { control: "text" },
    variant: { control: "select", options: ["default", "destructive"] },
    hideCancel: { control: "boolean" },
  },
  args: {
    title: "Confirm",
    message: "Are you sure you want to proceed?",
    confirmLabel: "Confirm",
    cancelLabel: "Cancel",
    variant: "default",
    hideCancel: false,
    open: false,
  },
};

export default meta;
type Story = StoryObj<SpConfirmDialogProps>;

export const Default: Story = {
  render: () => html`
    <sp-confirm-dialog
      id="confirm-default"
      title="Confirm Action"
      message="Are you sure you want to proceed with this action?"
    ></sp-confirm-dialog>
    <button @click=${() => {
      const el = document.getElementById("confirm-default") as any;
      if (el) el.open = true;
    }}>Open Confirm Dialog</button>
  `,
};

export const Destructive: Story = {
  render: () => html`
    <sp-confirm-dialog
      id="confirm-destructive"
      title="Delete Item"
      message="This action cannot be undone. The item will be permanently deleted."
      confirm-label="Delete"
      variant="destructive"
    ></sp-confirm-dialog>
    <button @click=${() => {
      const el = document.getElementById("confirm-destructive") as any;
      if (el) el.open = true;
    }}>Open Destructive Dialog</button>
  `,
};

export const HideCancel: Story = {
  render: () => html`
    <sp-confirm-dialog
      id="confirm-hide-cancel"
      title="Information"
      message="This action has been completed."
      confirm-label="OK"
      hide-cancel
    ></sp-confirm-dialog>
    <button @click=${() => {
      const el = document.getElementById("confirm-hide-cancel") as any;
      if (el) el.open = true;
    }}>Open Info Dialog</button>
  `,
};

export const Programmatic: Story = {
  render: () => html`
    <div id="programmatic-result" style="margin-top:12px;font-size:14px;color:#374151;"></div>
    <button @click=${async () => {
      const { SpConfirmDialogComponent } = await import("../../components/confirm-dialog/sp-confirm-dialog.js");
      const result = await SpConfirmDialogComponent.confirm({
        title: "Are you sure?",
        message: "This was triggered programmatically via SpConfirmDialog.confirm(...).",
        confirmLabel: "Yes, proceed",
        cancelLabel: "No, cancel",
      });
      const output = document.getElementById("programmatic-result");
      if (output) output.textContent = "Result: " + (result ? "Confirmed" : "Cancelled");
    }}>Programmatic Confirm</button>
  `,
};

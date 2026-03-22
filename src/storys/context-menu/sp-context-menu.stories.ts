import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import type { SpContextMenuProps } from "../../components/context-menu/sp-context-menu.types.js";
import "../../components/context-menu/sp-context-menu.js";

const meta: Meta<SpContextMenuProps> = {
  title: "Components/ContextMenu",
  component: "sp-context-menu",
  tags: ["autodocs"],
  argTypes: {
    disabled: {
      control: "boolean",
      description: "Disables the context menu",
    },
    trigger: {
      control: "select",
      options: ["contextmenu", "click"],
      description: "Event that opens the menu",
    },
  },
  args: {
    disabled: false,
    trigger: "contextmenu",
  },
};

export default meta;
type Story = StoryObj<SpContextMenuProps>;

// ---- Default (right-click area) ----

export const Default: Story = {
  render: () => html`
    <sp-context-menu>
      <div
        style="
          width: 300px;
          height: 150px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f3f4f6;
          border: 2px dashed #d1d5db;
          border-radius: 8px;
          color: #6b7280;
          font-size: 14px;
          user-select: none;
        "
      >
        Right-click here to open the context menu
      </div>
      <div slot="menu" style="padding: 4px 0;">
        <button style="display:block;width:100%;padding:8px 16px;border:none;background:none;text-align:left;cursor:pointer;font-size:14px;color:#374151;">Open</button>
        <button style="display:block;width:100%;padding:8px 16px;border:none;background:none;text-align:left;cursor:pointer;font-size:14px;color:#374151;">Rename</button>
        <hr style="border:none;border-top:1px solid #f3f4f6;margin:4px 0;" />
        <button style="display:block;width:100%;padding:8px 16px;border:none;background:none;text-align:left;cursor:pointer;font-size:14px;color:#ef4444;">Delete</button>
      </div>
    </sp-context-menu>
  `,
};

// ---- WithClickTrigger ----

export const WithClickTrigger: Story = {
  render: () => html`
    <sp-context-menu trigger="click">
      <button
        style="
          padding: 8px 16px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          background: white;
          cursor: pointer;
          font-size: 14px;
          color: #374151;
        "
      >
        Click me for menu ▾
      </button>
      <div slot="menu" style="padding: 4px 0;">
        <button style="display:block;width:100%;padding:8px 16px;border:none;background:none;text-align:left;cursor:pointer;font-size:14px;color:#374151;">Profile</button>
        <button style="display:block;width:100%;padding:8px 16px;border:none;background:none;text-align:left;cursor:pointer;font-size:14px;color:#374151;">Settings</button>
        <hr style="border:none;border-top:1px solid #f3f4f6;margin:4px 0;" />
        <button style="display:block;width:100%;padding:8px 16px;border:none;background:none;text-align:left;cursor:pointer;font-size:14px;color:#ef4444;">Sign out</button>
      </div>
    </sp-context-menu>
  `,
};

// ---- CustomItems (copy/paste/delete pattern) ----

export const CustomItems: Story = {
  render: () => html`
    <sp-context-menu>
      <div
        style="
          width: 300px;
          height: 120px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #eff6ff;
          border: 1px solid #bfdbfe;
          border-radius: 8px;
          color: #1d4ed8;
          font-size: 14px;
          font-weight: 500;
          user-select: none;
        "
      >
        Right-click for copy/paste menu
      </div>
      <div slot="menu" style="padding: 4px 0; min-width: 180px;">
        <button style="display:flex;align-items:center;gap:10px;width:100%;padding:8px 16px;border:none;background:none;text-align:left;cursor:pointer;font-size:14px;color:#374151;">
          <span>📋</span> Copy
        </button>
        <button style="display:flex;align-items:center;gap:10px;width:100%;padding:8px 16px;border:none;background:none;text-align:left;cursor:pointer;font-size:14px;color:#374151;">
          <span>✂️</span> Cut
        </button>
        <button style="display:flex;align-items:center;gap:10px;width:100%;padding:8px 16px;border:none;background:none;text-align:left;cursor:pointer;font-size:14px;color:#374151;">
          <span>📌</span> Paste
        </button>
        <hr style="border:none;border-top:1px solid #f3f4f6;margin:4px 0;" />
        <button style="display:flex;align-items:center;gap:10px;width:100%;padding:8px 16px;border:none;background:none;text-align:left;cursor:pointer;font-size:14px;color:#ef4444;">
          <span>🗑️</span> Delete
        </button>
      </div>
    </sp-context-menu>
  `,
};

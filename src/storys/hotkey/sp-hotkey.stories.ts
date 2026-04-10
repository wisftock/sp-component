import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "../../components/hotkey/sp-hotkey.js";

const meta: Meta = {
  title: "Components/Hotkey",
  component: "sp-hotkey",
  tags: ["autodocs"],
  argTypes: {
    size: { control: "select", options: ["sm", "md"] },
  },
  args: { size: "md" },
};
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`<sp-hotkey .keys=${["Ctrl", "K"]}></sp-hotkey>`,
};

export const MacStyle: Story = {
  name: "Mac style",
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:12px;">
      <sp-hotkey .keys=${["⌘", "K"]}></sp-hotkey>
      <sp-hotkey .keys=${["⌘", "Shift", "P"]}></sp-hotkey>
      <sp-hotkey .keys=${["⌥", "↑"]}></sp-hotkey>
      <sp-hotkey .keys=${["⌘", "Z"]}></sp-hotkey>
    </div>
  `,
};

export const SmallSize: Story = {
  name: "Small size",
  render: () => html`
    <div style="display:flex;gap:16px;flex-wrap:wrap;align-items:center;">
      <sp-hotkey size="sm" .keys=${["Ctrl", "S"]}></sp-hotkey>
      <sp-hotkey size="sm" .keys=${["Ctrl", "Z"]}></sp-hotkey>
      <sp-hotkey size="sm" .keys=${["F5"]}></sp-hotkey>
    </div>
  `,
};

export const CommandPaletteList: Story = {
  name: "Command palette list",
  render: () => {
    const commands = [
      { label: "Open file",           keys: ["Ctrl", "O"] },
      { label: "Save",                 keys: ["Ctrl", "S"] },
      { label: "Command palette",      keys: ["Ctrl", "Shift", "P"] },
      { label: "Toggle sidebar",       keys: ["Ctrl", "B"] },
      { label: "Format document",      keys: ["Shift", "Alt", "F"] },
      { label: "Find and replace",     keys: ["Ctrl", "H"] },
      { label: "Toggle terminal",      keys: ["Ctrl", "`"] },
      { label: "Undo",                 keys: ["Ctrl", "Z"] },
    ];
    return html`
      <div style="max-width:400px;border:1px solid #e5e7eb;border-radius:10px;overflow:hidden;">
        ${commands.map(cmd => html`
          <div style="display:flex;align-items:center;justify-content:space-between;padding:10px 14px;border-bottom:1px solid #f3f4f6;font-size:13px;color:#374151;">
            <span>${cmd.label}</span>
            <sp-hotkey size="sm" .keys=${cmd.keys}></sp-hotkey>
          </div>
        `)}
      </div>
    `;
  },
};

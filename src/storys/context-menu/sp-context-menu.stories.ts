import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "../../components/context-menu/sp-context-menu.js";

const meta: Meta = {
  title: "Components/ContextMenu",
  component: "sp-context-menu",
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj;

const ITEMS = [
  { label: "Open",      icon: "📂", onClick: () => alert("Open") },
  { label: "Rename",    icon: "✏️",  onClick: () => alert("Rename") },
  { label: "Duplicate", icon: "📋", onClick: () => alert("Duplicate") },
  { separator: true },
  { label: "Share",     icon: "🔗", onClick: () => alert("Share") },
  { separator: true },
  { label: "Delete",    icon: "🗑",  danger: true, onClick: () => alert("Delete") },
];

export const Default: Story = {
  render: () => html`
    <div style="display:flex;align-items:center;justify-content:center;height:300px;background:#f9fafb;border-radius:12px;border:2px dashed #e5e7eb;font-size:14px;color:#6b7280;">
      <sp-context-menu .items=${ITEMS}>
        <div style="padding:20px 32px;background:white;border:1px solid #e5e7eb;border-radius:8px;cursor:context-menu;user-select:none;text-align:center;">
          <strong>Right-click here</strong><br/>
          <span style="font-size:12px;color:#9ca3af">to open the context menu</span>
        </div>
      </sp-context-menu>
    </div>
  `,
};

export const WithDisabledItems: Story = {
  name: "With disabled items",
  render: () => html`
    <div style="display:flex;align-items:center;justify-content:center;height:240px;background:#f9fafb;border-radius:12px;border:2px dashed #e5e7eb;">
      <sp-context-menu .items=${[
        { label: "Edit",   icon: "✏️",  onClick: () => alert("Edit") },
        { label: "Copy",   icon: "📋", disabled: true },
        { label: "Paste",  icon: "📌", disabled: true },
        { separator: true },
        { label: "Delete", icon: "🗑",  danger: true, onClick: () => alert("Delete") },
      ]}>
        <div style="padding:16px 28px;background:white;border:1px solid #e5e7eb;border-radius:8px;cursor:context-menu;user-select:none;">
          Right-click me
        </div>
      </sp-context-menu>
    </div>
  `,
};

export const OnFileItem: Story = {
  name: "File list context",
  render: () => html`
    <div style="max-width:400px;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;">
      ${["report-2024.pdf", "design-v2.fig", "data.csv"].map(name => html`
        <sp-context-menu .items=${[
          { label: "Open",   icon: "📂", onClick: () => alert(`Open ${name}`) },
          { label: "Rename", icon: "✏️",  onClick: () => alert(`Rename ${name}`) },
          { separator: true },
          { label: "Delete", danger: true, onClick: () => alert(`Delete ${name}`) },
        ]}>
          <div style="padding:12px 16px;border-bottom:1px solid #f3f4f6;cursor:context-menu;display:flex;align-items:center;gap:8px;font-size:13px;">
            📄 ${name}
          </div>
        </sp-context-menu>
      `)}
    </div>
  `,
};

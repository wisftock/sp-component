import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "../../components/menu-root/sp-menu-root.js";
import "../../components/menu-root/sp-menu-trigger.js";
import "../../components/menu-root/sp-menu-content.js";
import "../../components/menu-root/sp-menu-item.js";
import "../../components/menu-root/sp-menu-separator.js";
import "../../components/button/sp-button.js";

const meta: Meta = {
  title: "Compound/Menu",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
**Compound Menu** — headless, composable dropdown menu built from sub-elements.

\`\`\`html
<sp-menu-root>
  <sp-menu-trigger>
    <sp-button>Actions</sp-button>
  </sp-menu-trigger>
  <sp-menu-content>
    <sp-menu-option value="edit">Edit</sp-menu-option>
    <sp-menu-separator></sp-menu-separator>
    <sp-menu-option value="delete" danger>Delete</sp-menu-option>
  </sp-menu-content>
</sp-menu-root>
\`\`\`
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const Basic: Story = {
  render: () => html`
    <sp-menu-root>
      <sp-menu-trigger>
        <sp-button>Actions ▾</sp-button>
      </sp-menu-trigger>
      <sp-menu-content>
        <sp-menu-option value="view">View details</sp-menu-option>
        <sp-menu-option value="edit">Edit</sp-menu-option>
        <sp-menu-option value="duplicate">Duplicate</sp-menu-option>
        <sp-menu-separator></sp-menu-separator>
        <sp-menu-option value="delete" danger>Delete</sp-menu-option>
      </sp-menu-content>
    </sp-menu-root>
  `,
};

export const WithDisabledItems: Story = {
  name: "With Disabled Items",
  render: () => html`
    <sp-menu-root>
      <sp-menu-trigger>
        <sp-button variant="outline">Options ▾</sp-button>
      </sp-menu-trigger>
      <sp-menu-content>
        <sp-menu-option value="export">Export</sp-menu-option>
        <sp-menu-option value="share">Share</sp-menu-option>
        <sp-menu-option value="archive" disabled>Archive (unavailable)</sp-menu-option>
        <sp-menu-separator></sp-menu-separator>
        <sp-menu-option value="delete" danger>Delete</sp-menu-option>
      </sp-menu-content>
    </sp-menu-root>
  `,
};

export const WithEventHandler: Story = {
  name: "With Select Event",
  render: () => {
    const onselect = (e: CustomEvent) => {
      const el = document.getElementById("compound-menu-output");
      if (el) el.textContent = `Selected: ${e.detail.value}`;
    };
    return html`
      <div style="display: flex; flex-direction: column; gap: 12px; align-items: flex-start;">
        <sp-menu-root @sp-select=${onselect}>
          <sp-menu-trigger>
            <sp-button>Menu ▾</sp-button>
          </sp-menu-trigger>
          <sp-menu-content>
            <sp-menu-option value="copy">Copy</sp-menu-option>
            <sp-menu-option value="paste">Paste</sp-menu-option>
            <sp-menu-option value="cut">Cut</sp-menu-option>
          </sp-menu-content>
        </sp-menu-root>
        <p id="compound-menu-output" style="font-size: 13px; color: #6b7280;">No selection yet</p>
      </div>
    `;
  },
};

export const CustomTrigger: Story = {
  name: "Custom Trigger (icon button)",
  render: () => html`
    <sp-menu-root>
      <sp-menu-trigger>
        <button style="
          background: none; border: 1px solid #e5e7eb; border-radius: 6px;
          padding: 6px 10px; cursor: pointer; font-size: 16px; color: #374151;
        " title="More options">⋯</button>
      </sp-menu-trigger>
      <sp-menu-content>
        <sp-menu-option value="rename">Rename</sp-menu-option>
        <sp-menu-option value="move">Move to folder</sp-menu-option>
        <sp-menu-separator></sp-menu-separator>
        <sp-menu-option value="delete" danger>Delete permanently</sp-menu-option>
      </sp-menu-content>
    </sp-menu-root>
  `,
};

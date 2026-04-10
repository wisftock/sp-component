import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "../../components/rich-text-editor/sp-rich-text-editor.js";

const meta: Meta = {
  title: "Components/RichTextEditor",
  component: "sp-rich-text-editor",
  tags: ["autodocs"],
  argTypes: {
    label:       { control: "text",    description: "Label shown above the editor toolbar" },
    placeholder: { control: "text",    description: "Placeholder text shown when the editor is empty" },
    value:       { control: "text",    description: "Initial HTML content of the editor" },
    readonly:    { control: "boolean", description: "Hides the toolbar and makes the editor non-editable" },
    disabled:    { control: "boolean", description: "Disables the editor and reduces opacity" },
    minHeight:   { control: "number",  description: "Minimum height of the editor area in pixels (default 160)" },
    maxlength:   { control: "number",  description: "Maximum character limit. Shows a counter when set (0 = no limit)" },
  },
  args: {
    label: "Description",
    placeholder: "Write something...",
    readonly: false,
    disabled: false,
  },
  render: ({ label, placeholder, readonly, disabled }) => html`
    <div style="max-width:720px;">
      <sp-rich-text-editor
        label=${label || ""}
        placeholder=${placeholder || ""}
        ?readonly=${readonly}
        ?disabled=${disabled}
      ></sp-rich-text-editor>
    </div>
  `,
};
export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const WithContent: Story = {
  name: "With initial content",
  render: () => {
    const el = document.createElement("sp-rich-text-editor") as HTMLElement & { value: string };
    el.setAttribute("label", "Article body");
    el.value = "<p><strong>Hello World!</strong> This is a rich text editor.</p><p>You can use <em>italic</em>, <u>underline</u>, and <a href='#'>links</a>.</p><ul><li>Item one</li><li>Item two</li></ul>";
    return el;
  },
};

export const Readonly: Story = {
  args: { readonly: true },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const WithTable: Story = {
  name: "With Table & Image",
  render: () => {
    const el = document.createElement("sp-rich-text-editor") as HTMLElement & { value: string };
    el.setAttribute("label", "Document");
    el.value = `<p>Use the toolbar buttons to insert <strong>tables</strong> and <strong>images</strong>.</p><table class="sp-rte-table"><tbody><tr><th>Name</th><th>Role</th><th>Status</th></tr><tr><td>Alice</td><td>Engineer</td><td>Active</td></tr><tr><td>Bob</td><td>Designer</td><td>Active</td></tr></tbody></table><p></p>`;
    return el;
  },
};

export const CharacterLimit: Story = {
  name: "Character Limit",
  args: { label: "Bio", maxlength: 200, placeholder: "Write a short bio…" },
};

export const EventLog: Story = {
  name: "Event Log (sp-change)",
  render: () => html`
    <div style="max-width:720px;display:flex;flex-direction:column;gap:12px;">
      <sp-rich-text-editor
        label="Content"
        placeholder="Start typing..."
        @sp-change=${(e: CustomEvent) => {
          const out = document.getElementById("rte-log");
          if (out) out.textContent = e.detail.html?.slice(0, 120) ?? "";
        }}
      ></sp-rich-text-editor>
      <code id="rte-log" style="font-size:0.75rem;color:#6366f1;word-break:break-all;">— type to see HTML output —</code>
    </div>
  `,
};

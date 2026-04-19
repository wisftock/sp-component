import type { Meta, StoryObj } from "@storybook/web-components";
import { html, nothing } from "lit";
import type { SpTreeProps } from "../../components/tree/sp-tree.types.js";
import "../../components/tree/sp-tree.js";
import "../../components/tree/sp-tree-item.js";

const meta: Meta<SpTreeProps> = {
  title: "Components/Tree",
  component: "sp-tree",
  tags: ["autodocs"],
  argTypes: {
    selectionMode: {
      control: "select",
      options: ["none", "single", "multiple"],
      description: "Selection mode",
    },
    selectedValues: {
      control: "text",
      description: "Comma-separated pre-selected values",
    },
  },
  args: {
    selectionMode: "single",
    selectedValues: "",
  },
  render: (args) => html`
    <sp-tree
      selection-mode=${args.selectionMode}
      selected-values=${args.selectedValues || nothing}
      style="width: 280px; font-family: sans-serif;"
    >
      <sp-tree-item value="src" label="src" icon="📁">
        <sp-tree-item value="components" label="components" icon="📁">
          <sp-tree-item value="button" label="sp-button.ts" icon="📄"></sp-tree-item>
          <sp-tree-item value="modal" label="sp-modal.ts" icon="📄"></sp-tree-item>
        </sp-tree-item>
        <sp-tree-item value="index" label="index.ts" icon="📄"></sp-tree-item>
      </sp-tree-item>
      <sp-tree-item value="package" label="package.json" icon="📄"></sp-tree-item>
    </sp-tree>
  `,
};

export default meta;
type Story = StoryObj<SpTreeProps>;

export const Default: Story = {};

export const Preexpanded: Story = {
  render: () => html`
    <sp-tree selection-mode="single" style="width: 280px; font-family: sans-serif;">
      <sp-tree-item value="root" label="Project" icon="🗂️" expanded>
        <sp-tree-item value="lib" label="lib" icon="📁" expanded>
          <sp-tree-item value="utils" label="utils.ts" icon="⚙️"></sp-tree-item>
          <sp-tree-item value="helpers" label="helpers.ts" icon="⚙️"></sp-tree-item>
        </sp-tree-item>
        <sp-tree-item value="tests" label="tests" icon="🧪">
          <sp-tree-item value="test1" label="unit.test.ts" icon="📄"></sp-tree-item>
        </sp-tree-item>
      </sp-tree-item>
    </sp-tree>
  `,
};

export const MultipleSelection: Story = {
  render: () => html`
    <div style="font-family: sans-serif;">
      <p style="color: #6b7280; font-size: 0.85rem; margin: 0 0 12px;">Hold Ctrl/Cmd to select multiple items (multiple mode auto-selects on click).</p>
      <sp-tree selection-mode="multiple" style="width: 280px;">
        <sp-tree-item value="file1" label="document.txt" icon="📄"></sp-tree-item>
        <sp-tree-item value="file2" label="image.png" icon="🖼️"></sp-tree-item>
        <sp-tree-item value="file3" label="video.mp4" icon="🎬"></sp-tree-item>
        <sp-tree-item value="file4" label="audio.mp3" icon="🎵"></sp-tree-item>
        <sp-tree-item value="file5" label="archive.zip" icon="📦" disabled></sp-tree-item>
      </sp-tree>
    </div>
  `,
};

export const WithIcons: Story = {
  render: () => html`
    <sp-tree selection-mode="single" style="width: 300px; font-family: sans-serif;">
      <sp-tree-item value="desktop" label="Desktop" icon="🖥️">
        <sp-tree-item value="docs" label="Documents" icon="📂">
          <sp-tree-item value="resume" label="Resume.pdf" icon="📋"></sp-tree-item>
          <sp-tree-item value="cover" label="CoverLetter.docx" icon="📝"></sp-tree-item>
        </sp-tree-item>
        <sp-tree-item value="pics" label="Pictures" icon="🖼️">
          <sp-tree-item value="vacation" label="Vacation 2024" icon="🏖️">
            <sp-tree-item value="photo1" label="photo001.jpg" icon="📸"></sp-tree-item>
            <sp-tree-item value="photo2" label="photo002.jpg" icon="📸"></sp-tree-item>
          </sp-tree-item>
        </sp-tree-item>
        <sp-tree-item value="downloads" label="Downloads" icon="⬇️"></sp-tree-item>
      </sp-tree-item>
    </sp-tree>
  `,
};

export const Loading: Story = {
  render: () => {
    const loadChildren = (e: Event) => {
      const item = e.currentTarget as any;
      if (item._hasChildren) return;
      item.loading = true;
      setTimeout(() => {
        item.loading = false;
        item.innerHTML = `
          <sp-tree-item value="child1" label="Loaded Item 1" icon="📄"></sp-tree-item>
          <sp-tree-item value="child2" label="Loaded Item 2" icon="📄"></sp-tree-item>
          <sp-tree-item value="child3" label="Loaded Item 3" icon="📄"></sp-tree-item>
        `;
        item.expanded = true;
      }, 1500);
    };

    return html`
      <div style="font-family: sans-serif;">
        <p style="color: #6b7280; font-size: 0.85rem; margin: 0 0 12px;">Click items to simulate async loading of children.</p>
        <sp-tree selection-mode="single" style="width: 280px;">
          <sp-tree-item value="async1" label="Async Folder 1" icon="📁" @click=${loadChildren}></sp-tree-item>
          <sp-tree-item value="async2" label="Async Folder 2" icon="📁" @click=${loadChildren}></sp-tree-item>
          <sp-tree-item value="static" label="Static Item" icon="📄"></sp-tree-item>
        </sp-tree>
      </div>
    `;
  },
};

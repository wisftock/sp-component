import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import type { SpCommandPaletteProps } from "../../components/command-palette/sp-command-palette.types.js";
import "../../components/command-palette/sp-command-palette.js";

const meta: Meta<SpCommandPaletteProps> = {
  title: "Components/CommandPalette",
  component: "sp-command-palette",
  tags: ["autodocs"],
  argTypes: {
    open: { control: "boolean", description: "Whether the palette is open" },
    placeholder: { control: "text", description: "Input placeholder" },
    emptyMessage: { control: "text", description: "Message when no results" },
    loading: { control: "boolean", description: "Loading state" },
  },
  args: {
    open: false,
    placeholder: "Search commands...",
    emptyMessage: "No results found",
    loading: false,
  },
};

export default meta;
type Story = StoryObj<SpCommandPaletteProps>;

const sampleItems = [
  { id: "1", label: "New File", description: "Create a new file", icon: "📄", group: "File", keywords: ["create", "new"] },
  { id: "2", label: "Open File", description: "Open an existing file", icon: "📂", group: "File", keywords: ["open", "browse"] },
  { id: "3", label: "Save File", description: "Save current file", icon: "💾", group: "File", keywords: ["save"] },
  { id: "4", label: "Open Settings", description: "Open application settings", icon: "⚙️", group: "Application" },
  { id: "5", label: "Toggle Theme", description: "Switch between light and dark theme", icon: "🎨", group: "Application" },
  { id: "6", label: "Reload Window", description: "Reload the application window", icon: "🔄", group: "Application" },
  { id: "7", label: "Format Document", description: "Format the current document", icon: "✨", group: "Editor" },
  { id: "8", label: "Find & Replace", description: "Find and replace text", icon: "🔍", group: "Editor", keywords: ["search", "replace"] },
  { id: "9", label: "Toggle Sidebar", description: "Show or hide the sidebar", icon: "📋", group: "View" },
  { id: "10", label: "Zoom In", description: "Increase zoom level", icon: "🔎", group: "View" },
];

export const Default: Story = {
  render: () => {
    const open = () => {
      const palette = document.querySelector("#demo-palette") as any;
      if (palette) {
        palette.setItems(sampleItems);
        palette.open = true;
      }
    };

    return html`
      <button
        style="padding: 8px 16px; background: #2563eb; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 0.9rem;"
        @click=${open}
      >
        Open Command Palette (or press Ctrl+K)
      </button>
      <sp-command-palette id="demo-palette"></sp-command-palette>
    `;
  },
};

export const WithLoading: Story = {
  render: () => {
    const open = () => {
      const palette = document.querySelector("#loading-palette") as any;
      if (palette) {
        palette.open = true;
        palette.loading = true;
        setTimeout(() => {
          palette.loading = false;
          palette.setItems(sampleItems);
        }, 2000);
      }
    };

    return html`
      <button
        style="padding: 8px 16px; background: #2563eb; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 0.9rem;"
        @click=${open}
      >
        Open with Loading State
      </button>
      <sp-command-palette id="loading-palette"></sp-command-palette>
    `;
  },
};

export const Programmatic: Story = {
  render: () => {
    const open = () => {
      const palette = document.querySelector("#prog-palette") as any;
      if (palette) {
        palette.setItems([
          { id: "1", label: "Go to Dashboard", icon: "🏠", action: () => alert("Going to Dashboard") },
          { id: "2", label: "Create New Project", icon: "➕", action: () => alert("Creating project...") },
          { id: "3", label: "Invite Team Member", icon: "👥", action: () => alert("Invite dialog opened") },
          { id: "4", label: "Export Data", icon: "📤", action: () => alert("Exporting...") },
          { id: "5", label: "Log Out", icon: "🚪", action: () => alert("Logging out...") },
        ]);
        palette.open = true;
      }
    };

    return html`
      <div style="display: flex; flex-direction: column; gap: 8px; max-width: 400px;">
        <p style="color: #6b7280; font-size: 0.9rem; margin: 0;">
          Click the button below to open the command palette programmatically with action handlers.
        </p>
        <button
          style="padding: 8px 16px; background: #7c3aed; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 0.9rem; align-self: flex-start;"
          @click=${open}
        >
          ⌘ Open Palette
        </button>
      </div>
      <sp-command-palette
        id="prog-palette"
        placeholder="What would you like to do?"
        empty-message="No actions found"
      ></sp-command-palette>
    `;
  },
};

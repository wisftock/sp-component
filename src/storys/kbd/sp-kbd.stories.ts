import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import type { SpKbdProps } from "../../components/kbd/sp-kbd.types.js";
import "../../components/kbd/sp-kbd.js";

const meta: Meta<SpKbdProps> = {
  title: "Components/Kbd",
  component: "sp-kbd",
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Size of the key",
    },
  },
  args: {
    size: "md",
  },
  render: ({ size }) => html`
    <sp-kbd size=${size}>Ctrl</sp-kbd>
  `,
};

export default meta;
type Story = StoryObj<SpKbdProps>;

// ---- Stories ----

export const Default: Story = {
  render: () => html`<sp-kbd>Ctrl</sp-kbd>`,
};

export const Combination: Story = {
  render: () => html`
    <div style="display: inline-flex; align-items: center; gap: 6px; font-size: 14px; color: #374151;">
      <sp-kbd>Ctrl</sp-kbd>
      <span>+</span>
      <sp-kbd>K</sp-kbd>
    </div>
  `,
};

export const Sizes: Story = {
  render: () => html`
    <div style="display: flex; align-items: center; gap: 12px;">
      <sp-kbd size="sm">Esc</sp-kbd>
      <sp-kbd size="md">Enter</sp-kbd>
      <sp-kbd size="lg">Space</sp-kbd>
    </div>
  `,
};

export const CommonShortcuts: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 12px; font-size: 14px; color: #374151;">
      <div style="display: inline-flex; align-items: center; gap: 6px;">
        <sp-kbd>Ctrl</sp-kbd><span>+</span><sp-kbd>C</sp-kbd>
        <span style="margin-left: 8px;">Copy</span>
      </div>
      <div style="display: inline-flex; align-items: center; gap: 6px;">
        <sp-kbd>Ctrl</sp-kbd><span>+</span><sp-kbd>V</sp-kbd>
        <span style="margin-left: 8px;">Paste</span>
      </div>
      <div style="display: inline-flex; align-items: center; gap: 6px;">
        <sp-kbd>&#8984;</sp-kbd><span>+</span><sp-kbd>S</sp-kbd>
        <span style="margin-left: 8px;">Save (Mac)</span>
      </div>
      <div style="display: inline-flex; align-items: center; gap: 6px;">
        <sp-kbd>Alt</sp-kbd><span>+</span><sp-kbd>F4</sp-kbd>
        <span style="margin-left: 8px;">Close window</span>
      </div>
      <div style="display: inline-flex; align-items: center; gap: 6px;">
        <sp-kbd>Ctrl</sp-kbd><span>+</span><sp-kbd>Z</sp-kbd>
        <span style="margin-left: 8px;">Undo</span>
      </div>
    </div>
  `,
};

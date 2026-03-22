import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import type { SpSplitPanelProps } from "../../components/split-panel/sp-split-panel.types.js";
import "../../components/split-panel/sp-split-panel.js";

const meta: Meta<SpSplitPanelProps> = {
  title: "Components/SplitPanel",
  component: "sp-split-panel",
  tags: ["autodocs"],
  argTypes: {
    position: { control: { type: "range", min: 10, max: 90, step: 1 }, description: "Divider position %" },
    orientation: { control: "select", options: ["horizontal", "vertical"], description: "Layout orientation" },
    min: { control: "number", description: "Minimum panel size %" },
    max: { control: "number", description: "Maximum first panel size %" },
    snap: { control: "number", description: "Snap position (0 = disabled)" },
    disabled: { control: "boolean", description: "Disable dragging" },
  },
  args: {
    position: 50,
    orientation: "horizontal",
    min: 10,
    max: 90,
    snap: 0,
    disabled: false,
  },
};

export default meta;
type Story = StoryObj<SpSplitPanelProps>;

const panelStyle = "height: 400px; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;";
const contentStyle = "padding: 16px; font-family: sans-serif; height: 100%; box-sizing: border-box;";

export const Default: Story = {
  render: () => html`
    <div style="${panelStyle}">
      <sp-split-panel position="50" orientation="horizontal">
        <div slot="start" style="${contentStyle} background: #f8fafc;">
          <h3 style="margin-top:0; color: #1e293b;">Code Editor</h3>
          <pre style="background: #1e293b; color: #e2e8f0; padding: 12px; border-radius: 6px; font-size: 0.85rem; overflow: auto;">function greet(name) {
  return \`Hello, \${name}!\`;
}

console.log(greet("World"));</pre>
        </div>
        <div slot="end" style="${contentStyle} background: #ffffff;">
          <h3 style="margin-top:0; color: #1e293b;">Preview</h3>
          <p style="color: #64748b;">Hello, World!</p>
          <p style="color: #94a3b8; font-size: 0.85rem;">Drag the divider to resize panels.</p>
        </div>
      </sp-split-panel>
    </div>
  `,
};

export const Vertical: Story = {
  render: () => html`
    <div style="${panelStyle}">
      <sp-split-panel position="40" orientation="vertical">
        <div slot="start" style="${contentStyle} background: #fefce8;">
          <h3 style="margin-top:0; color: #854d0e;">Top Panel</h3>
          <p>This is the top panel in a vertical split layout.</p>
        </div>
        <div slot="end" style="${contentStyle} background: #f0fdf4;">
          <h3 style="margin-top:0; color: #166534;">Bottom Panel</h3>
          <p>This is the bottom panel. Drag the horizontal divider to resize.</p>
        </div>
      </sp-split-panel>
    </div>
  `,
};

export const CustomDivider: Story = {
  render: () => html`
    <div style="${panelStyle}">
      <sp-split-panel position="60" orientation="horizontal">
        <div slot="start" style="${contentStyle} background: #fdf4ff;">
          <h3 style="margin-top:0; color: #6b21a8;">Left Panel</h3>
          <p>Custom divider handle below.</p>
        </div>
        <div slot="divider" style="display:flex; align-items:center; justify-content:center; width:20px; background:#e9d5ff; cursor:col-resize; font-size:10px; writing-mode:vertical-rl; color:#6b21a8; padding:4px;">
          drag
        </div>
        <div slot="end" style="${contentStyle} background: #f5f3ff;">
          <h3 style="margin-top:0; color: #5b21b6;">Right Panel</h3>
          <p>With a custom divider handle.</p>
        </div>
      </sp-split-panel>
    </div>
  `,
};

export const Nested: Story = {
  render: () => html`
    <div style="height: 500px; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
      <sp-split-panel position="30" orientation="horizontal">
        <div slot="start" style="${contentStyle} background: #f1f5f9;">
          <h3 style="margin-top:0; font-size:0.9rem; color:#475569;">Sidebar</h3>
          <ul style="margin:0; padding-left:16px; color:#64748b; font-size:0.85rem;">
            <li>File 1.ts</li>
            <li>File 2.ts</li>
            <li>styles.css</li>
          </ul>
        </div>
        <div slot="end" style="height:100%;">
          <sp-split-panel position="60" orientation="vertical">
            <div slot="start" style="${contentStyle} background: #1e293b; color: #e2e8f0; font-family: monospace; font-size: 0.85rem;">
              <p style="margin-top:0;">// Editor area</p>
              <p>const x = 42;</p>
            </div>
            <div slot="end" style="${contentStyle} background: #0f172a; color: #94a3b8; font-family: monospace; font-size: 0.8rem;">
              <p style="margin-top:0;">&gt; Terminal output</p>
              <p style="color:#4ade80;">✓ Build successful</p>
            </div>
          </sp-split-panel>
        </div>
      </sp-split-panel>
    </div>
  `,
};

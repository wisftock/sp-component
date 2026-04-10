import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "../../components/resizable-panel/sp-resizable-panel.js";

const meta: Meta = {
  title: "Components/ResizablePanel",
  component: "sp-resizable-panel",
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
};
export default meta;
type Story = StoryObj;

const panelStyle = "padding:20px;font-size:13px;color:#374151;line-height:1.6;";

export const Horizontal: Story = {
  render: () => html`
    <div style="height:400px;padding:24px;">
      <sp-resizable-panel initial-size="35" style="height:100%;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;">
        <div slot="first" style="${panelStyle}background:#f9fafb;">
          <strong style="display:block;margin-bottom:8px;">File Explorer</strong>
          ${["index.html", "app.ts", "style.css", "README.md", "package.json"].map(f => html`
            <div style="padding:6px 8px;border-radius:4px;cursor:pointer;margin-bottom:2px;"
                 @mouseenter=${(e: Event) => (e.target as HTMLElement).style.background = "#e5e7eb"}
                 @mouseleave=${(e: Event) => (e.target as HTMLElement).style.background = ""}
            >📄 ${f}</div>
          `)}
        </div>
        <div slot="second" style="${panelStyle}">
          <strong style="display:block;margin-bottom:8px;">Editor</strong>
          <p>Select a file to view its content. Drag the divider to resize the panels.</p>
          <pre style="background:#1e1e2e;color:#cdd6f4;padding:12px;border-radius:6px;font-size:12px;overflow:auto;">const greet = (name: string) =&gt; {
  console.log(\`Hello, \${name}!\`);
};</pre>
        </div>
      </sp-resizable-panel>
    </div>
  `,
};

export const Vertical: Story = {
  render: () => html`
    <div style="height:500px;padding:24px;">
      <sp-resizable-panel direction="vertical" initial-size="60" style="height:100%;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;">
        <div slot="first" style="${panelStyle}background:#f9fafb;">
          <strong style="display:block;margin-bottom:8px;">Output</strong>
          <pre style="background:#1e1e2e;color:#a6e3a1;padding:12px;border-radius:6px;font-size:12px;font-family:monospace;overflow:auto;">
$ npm run build
✓ Building...
✓ 14 modules transformed
✓ dist/index.js — 42.3 kB
✓ Done in 1.2s</pre>
        </div>
        <div slot="second" style="${panelStyle}">
          <strong style="display:block;margin-bottom:8px;">Terminal</strong>
          <div style="background:#1e1e2e;color:#cdd6f4;padding:12px;border-radius:6px;font-size:12px;font-family:monospace;height:80%;">
            <span style="color:#89b4fa">user@machine</span>:<span style="color:#a6e3a1">~/project</span>$ <span style="animation:blink 1s step-end infinite">▋</span>
          </div>
        </div>
      </sp-resizable-panel>
    </div>
  `,
};

export const ThreePanels: Story = {
  name: "Three panels (nested)",
  render: () => html`
    <div style="height:400px;padding:24px;">
      <sp-resizable-panel initial-size="25" style="height:100%;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;">
        <div slot="first" style="${panelStyle}background:#f0fdf4;">
          <strong>Sidebar</strong><br>Navigation goes here.
        </div>
        <sp-resizable-panel slot="second" initial-size="65" style="height:100%;">
          <div slot="first" style="${panelStyle}">
            <strong>Main Content</strong>
            <p>This is the main editor area. Drag the dividers to resize.</p>
          </div>
          <div slot="second" style="${panelStyle}background:#fafafa;">
            <strong>Properties</strong><br>
            <div style="font-size:12px;color:#6b7280;margin-top:8px;">
              <div>Width: 340px</div>
              <div>Height: 240px</div>
              <div>Color: #3b82f6</div>
            </div>
          </div>
        </sp-resizable-panel>
      </sp-resizable-panel>
    </div>
  `,
};

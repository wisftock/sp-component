import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "../../components/floating-panel/sp-floating-panel.js";

const meta: Meta = {
  title: "Components/FloatingPanel",
  component: "sp-floating-panel",
  tags: ["autodocs"],
  argTypes: {
    title: { control: "text" },
    open: { control: "boolean" },
    collapsed: { control: "boolean" },
    closable: { control: "boolean" },
    resizable: { control: "boolean" },
    x: { control: "number" },
    y: { control: "number" },
    width: { control: "number" },
    height: { control: "number" },
  },
  args: { title: "Panel flotante", open: true, collapsed: false, closable: true, resizable: true, x: 60, y: 60, width: 320, height: 220 },
  render: ({ title, open, collapsed, closable, resizable, x, y, width, height }) => html`
    <div style="position:relative;height:400px;background:#f1f5f9;border-radius:8px;border:1px dashed #cbd5e1;overflow:hidden;">
      <sp-floating-panel
        title=${title}
        ?open=${open}
        ?collapsed=${collapsed}
        ?closable=${closable}
        ?resizable=${resizable}
        x=${x}
        y=${y}
        width=${width}
        height=${height}
      >
        <div style="padding:12px;">
          <p style="margin:0 0 8px;font-size:14px;color:#374151;">Contenido del panel flotante.</p>
          <p style="margin:0;font-size:13px;color:#6b7280;">Puedes arrastrar este panel por el área de trabajo.</p>
        </div>
      </sp-floating-panel>
    </div>
  `,
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
export const Collapsed: Story = { args: { collapsed: true } };
export const NotClosable: Story = { args: { closable: false } };

export const MultiplePanel: Story = {
  render: () => html`
    <div style="position:relative;height:500px;background:#f1f5f9;border-radius:8px;border:1px dashed #cbd5e1;overflow:hidden;">
      <sp-floating-panel title="Inspector" x=${20} y=${20} width=${240} height=${200}>
        <div style="padding:12px;font-size:13px;">
          <div style="display:flex;justify-content:space-between;margin-bottom:8px;"><span style="color:#6b7280;">Ancho</span><strong>320px</strong></div>
          <div style="display:flex;justify-content:space-between;margin-bottom:8px;"><span style="color:#6b7280;">Alto</span><strong>180px</strong></div>
          <div style="display:flex;justify-content:space-between;"><span style="color:#6b7280;">Color</span><strong>#3b82f6</strong></div>
        </div>
      </sp-floating-panel>
      <sp-floating-panel title="Capas" x=${280} y=${40} width=${200} height=${280}>
        <div style="padding:12px;font-size:13px;display:flex;flex-direction:column;gap:6px;">
          ${["Header","Sidebar","Content","Footer"].map(l => html`
            <div style="display:flex;align-items:center;gap:8px;padding:6px;background:white;border-radius:4px;">
              <span>▣</span><span>${l}</span>
            </div>
          `)}
        </div>
      </sp-floating-panel>
    </div>
  `,
};

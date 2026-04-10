import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "../../components/signature/sp-signature.js";

const meta: Meta = {
  title: "Components/Signature",
  component: "sp-signature",
  tags: ["autodocs"],
  argTypes: {
    label:         { control: "text",    description: "Label shown above the signature pad" },
    penColor:      { control: "color",   description: "Stroke color for drawing" },
    penWidth:      { control: "number",  description: "Stroke width in pixels" },
    width:         { control: "number",  description: "Canvas width in pixels" },
    height:        { control: "number",  description: "Canvas height in pixels" },
    disabled:      { control: "boolean", description: "Prevents drawing and disables toolbar buttons" },
    showColorPicker: { control: "boolean", description: "Shows a color picker in the toolbar" },
    showWidthSlider: { control: "boolean", description: "Shows a width slider in the toolbar" },
  },
  args: {
    label: "Signature",
    penColor: "#1e293b",
    penWidth: 2,
    width: 500,
    height: 200,
    disabled: false,
  },
  render: ({ label, penColor, penWidth, width, height, disabled }) => html`
    <div style="max-width:520px;">
      <sp-signature
        label=${label || ""}
        pen-color=${penColor || "#000"}
        pen-width=${penWidth || 2}
        width=${width || 500}
        height=${height || 200}
        ?disabled=${disabled}
      ></sp-signature>
    </div>
  `,
};
export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const BoldPen: Story = {
  name: "Bold pen (width 4)",
  args: { penWidth: 4, penColor: "#1d4ed8" },
};

export const ColoredInk: Story = {
  name: "Colored ink",
  args: { penColor: "#7c3aed", penWidth: 2 },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const EventLog: Story = {
  name: "Event Log (sp-change)",
  render: () => html`
    <div style="max-width:520px;display:flex;flex-direction:column;gap:12px;">
      <sp-signature
        label="Sign here"
        @sp-change=${(e: CustomEvent) => {
          const out = document.getElementById("sig-log");
          if (out) out.textContent = `isEmpty: ${e.detail.isEmpty}, dataUrl length: ${e.detail.dataUrl?.length ?? 0}`;
          const preview = document.getElementById("sig-preview") as HTMLImageElement;
          if (preview) { preview.src = e.detail.dataUrl; preview.style.display = "block"; }
        }}
      ></sp-signature>
      <code id="sig-log" style="font-size:0.75rem;color:#6366f1;">— sign to see event —</code>
      <img id="sig-preview" style="max-width:200px;border:1px solid #e5e7eb;border-radius:8px;display:none;" />
    </div>
  `,
};

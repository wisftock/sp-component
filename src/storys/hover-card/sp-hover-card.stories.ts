import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "../../components/hover-card/sp-hover-card.js";
import "../../components/avatar/sp-avatar.js";

const meta: Meta = {
  title: "Components/HoverCard",
  component: "sp-hover-card",
  tags: ["autodocs"],
  argTypes: {
    placement: { control: "select", options: ["top","bottom","left","right","top-start","top-end","bottom-start","bottom-end"] },
    "open-delay": { control: "number" },
    "close-delay": { control: "number" },
  },
  args: { placement: "bottom", "open-delay": 300, "close-delay": 150 },
  render: (args) => html`
    <div style="padding:48px;display:flex;justify-content:center;">
      <sp-hover-card
        placement=${args.placement}
        open-delay=${args["open-delay"]}
        close-delay=${args["close-delay"]}
      >
        <a href="#" style="color:#3b82f6;font-weight:500;text-decoration:none;">@ana_garcia</a>
        <div slot="content" style="width:260px;">
          <div style="display:flex;gap:12px;align-items:flex-start;">
            <div>
              <p style="margin:0;font-weight:600;font-size:15px;">Ana García</p>
              <p style="margin:2px 0 0;font-size:13px;color:#6b7280;">Diseñadora UX Senior</p>
              <p style="margin:8px 0 0;font-size:13px;color:#374151;">Apasionada por el diseño de interfaces.</p>
            </div>
          </div>
        </div>
      </sp-hover-card>
    </div>
  `,
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const ProductPreview: Story = {
  render: () => html`
    <div style="padding:48px;">
      <sp-hover-card placement="bottom-start">
        <span style="color:#3b82f6;cursor:pointer;font-size:14px;">sp-button</span>
        <div slot="content" style="width:300px;">
          <p style="margin:0 0 6px;font-weight:600;font-size:14px;">SpButton</p>
          <p style="margin:0 0 10px;font-size:13px;color:#6b7280;">Componente de botón con múltiples variantes, estados y tamaños.</p>
          <code style="background:#f3f4f6;padding:4px 8px;border-radius:4px;font-size:12px;">&lt;sp-button variant="primary"&gt;</code>
        </div>
      </sp-hover-card>
    </div>
  `,
};

export const Placements: Story = {
  render: () => html`
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:32px;padding:48px;">
      ${(["top","bottom","left","right"] as const).map(p => html`
        <sp-hover-card placement=${p}>
          <button style="padding:8px 16px;border:1px solid #d1d5db;border-radius:4px;cursor:pointer;background:white;">${p}</button>
          <div slot="content" style="padding:4px;">
            <p style="margin:0;font-size:13px;">Posición: <strong>${p}</strong></p>
          </div>
        </sp-hover-card>
      `)}
    </div>
  `,
};

import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import type { SpSpinnerProps } from "../../components/spinner/sp-spinner.types.js";
import "../../components/spinner/sp-spinner.js";
import "../../components/button/sp-button.js";

const meta: Meta<SpSpinnerProps> = {
  title: "Components/Spinner",
  component: "sp-spinner",
  tags: ["autodocs"],
  argTypes: {
    size:    { control: "select", options: ["sm", "md", "lg", "xl"] },
    variant: { control: "select", options: ["arc", "ring", "dots", "bars", "pulse"], description: "Estilo visual del spinner" },
    label:   { control: "text" },
  },
  args: { size: "md", variant: "arc", label: "Loading..." },
  render: ({ size, variant, label }) => html`
    <sp-spinner size=${size} variant=${variant} label=${label}></sp-spinner>
  `,
};

export default meta;
type Story = StoryObj<SpSpinnerProps>;

export const Default: Story = {
  args: { size: "md", variant: "arc" },
};

export const Variantes: Story = {
  render: () => html`
    <div style="display:flex;align-items:center;gap:32px;padding:24px;flex-wrap:wrap;">
      ${(["arc", "ring", "dots", "bars", "pulse"] as const).map(
        (variant) => html`
          <div style="display:flex;flex-direction:column;align-items:center;gap:10px;">
            <sp-spinner size="lg" variant=${variant}></sp-spinner>
            <span style="font-size:12px;color:#6b7280;font-weight:500;">${variant}</span>
          </div>
        `,
      )}
    </div>
  `,
};

export const VariantesConColores: Story = {
  render: () => html`
    <div style="display:flex;align-items:center;gap:28px;padding:24px;flex-wrap:wrap;">
      <sp-spinner size="lg" variant="arc"   style="color:#3b82f6;"></sp-spinner>
      <sp-spinner size="lg" variant="ring"  style="color:#10b981;"></sp-spinner>
      <sp-spinner size="lg" variant="dots"  style="color:#f59e0b;"></sp-spinner>
      <sp-spinner size="lg" variant="bars"  style="color:#ef4444;"></sp-spinner>
      <sp-spinner size="lg" variant="pulse" style="color:#8b5cf6;"></sp-spinner>
    </div>
  `,
};

export const Sizes: Story = {
  render: () => html`
    <div style="display:flex;align-items:center;gap:24px;padding:16px;">
      <div style="text-align:center;">
        <sp-spinner size="sm"></sp-spinner>
        <p style="margin:8px 0 0;font-size:12px;color:#6b7280;">sm</p>
      </div>
      <div style="text-align:center;">
        <sp-spinner size="md"></sp-spinner>
        <p style="margin:8px 0 0;font-size:12px;color:#6b7280;">md</p>
      </div>
      <div style="text-align:center;">
        <sp-spinner size="lg"></sp-spinner>
        <p style="margin:8px 0 0;font-size:12px;color:#6b7280;">lg</p>
      </div>
      <div style="text-align:center;">
        <sp-spinner size="xl"></sp-spinner>
        <p style="margin:8px 0 0;font-size:12px;color:#6b7280;">xl</p>
      </div>
    </div>
  `,
};

export const Colors: Story = {
  render: () => html`
    <div style="display:flex;align-items:center;gap:20px;padding:16px;">
      <sp-spinner size="lg" style="color:#3b82f6;"></sp-spinner>
      <sp-spinner size="lg" style="color:#10b981;"></sp-spinner>
      <sp-spinner size="lg" style="color:#f59e0b;"></sp-spinner>
      <sp-spinner size="lg" style="color:#ef4444;"></sp-spinner>
      <sp-spinner size="lg" style="color:#8b5cf6;"></sp-spinner>
    </div>
  `,
};

export const InlineWithText: Story = {
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:12px;padding:16px;">
      <div style="display:flex;align-items:center;gap:8px;font-size:14px;color:#374151;">
        <sp-spinner size="sm"></sp-spinner>
        <span>Loading data...</span>
      </div>
      <div style="display:flex;align-items:center;gap:8px;font-size:14px;color:#374151;">
        <sp-spinner size="md"></sp-spinner>
        <span>Processing your request...</span>
      </div>
    </div>
  `,
};

export const InsideButton: Story = {
  render: () => html`
    <div style="display:flex;gap:12px;flex-wrap:wrap;">
      <button style="display:inline-flex;align-items:center;gap:8px;padding:8px 16px;background:#3b82f6;color:white;border:none;border-radius:6px;cursor:pointer;font-size:14px;font-weight:500;">
        <sp-spinner size="sm" style="color:white;"></sp-spinner>
        Saving...
      </button>
      <button style="display:inline-flex;align-items:center;gap:8px;padding:8px 16px;background:white;color:#374151;border:1px solid #d1d5db;border-radius:6px;cursor:pointer;font-size:14px;font-weight:500;">
        <sp-spinner size="sm" style="color:#6b7280;"></sp-spinner>
        Loading
      </button>
    </div>
  `,
};

export const OverlayCard: Story = {
  render: () => html`
    <div style="position:relative;width:320px;padding:24px;border:1px solid #e5e7eb;border-radius:8px;min-height:120px;">
      <p style="margin:0;font-size:14px;color:#374151;">This is some content that is loading...</p>
      <p style="margin:8px 0 0;font-size:13px;color:#9ca3af;">More content here</p>
      <div style="position:absolute;inset:0;background:rgba(255,255,255,0.8);border-radius:8px;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:8px;">
        <sp-spinner size="lg"></sp-spinner>
        <span style="font-size:13px;color:#6b7280;">Loading...</span>
      </div>
    </div>
  `,
};

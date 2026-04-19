import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "../../components/bottom-sheet/sp-bottom-sheet.js";

const meta: Meta = {
  title: "Components/BottomSheet",
  component: "sp-bottom-sheet",
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  argTypes: {
    open:       { control: "boolean",  description: "Controls the visibility of the sheet" },
    title:      { control: "text",     description: "Title text shown in the sheet header" },
    snapHeight: { control: "text",     description: "CSS height of the sheet (e.g. '40vh', '300px')" },
    dismissable: { control: "boolean", description: "Allows closing by dragging down or clicking the backdrop" },
  },
  args: {
    open: false,
    title: "Options",
    snapHeight: "40vh",
    dismissable: true,
  },
  render: (args) => html`
    <div style="padding:40px;text-align:center;">
      <button
        style="padding:10px 24px;background:#3b82f6;color:white;border:none;border-radius:8px;cursor:pointer;font-size:14px;"
        @click=${(e: Event) => {
          const sheet = (e.target as HTMLElement).closest("div")?.parentElement?.querySelector("sp-bottom-sheet") as any;
          if (sheet) sheet.open = true;
        }}
      >Open bottom sheet</button>
    </div>
    <sp-bottom-sheet
      title=${args.title}
      snap-height=${args.snapHeight}
      ?open=${args.open}
      ?dismissable=${args.dismissable}
    >
      <div style="display:flex;flex-direction:column;gap:2px;">
        ${["Share link", "Copy to clipboard", "Download", "Add to favorites"].map(label => html`
          <div style="padding:14px 0;border-bottom:1px solid #f3f4f6;font-size:14px;cursor:pointer;color:#111827;">${label}</div>
        `)}
      </div>
    </sp-bottom-sheet>
  `,
};
export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const WithFooter: Story = {
  name: "With footer buttons",
  render: () => {
    let sheet: any;
    return html`
      <div style="padding:40px;text-align:center;">
        <button
          style="padding:10px 24px;background:#3b82f6;color:white;border:none;border-radius:8px;cursor:pointer;font-size:14px;"
          @click=${() => { if (!sheet) sheet = document.querySelector("sp-bottom-sheet"); sheet!.open = true; }}
        >Open with footer</button>
      </div>

      <sp-bottom-sheet title="Delete item?" snap-height="35vh">
        <p style="font-size:14px;color:#4b5563;line-height:1.6;margin:0;">
          Are you sure you want to delete this item? This action cannot be undone.
        </p>
        <div slot="footer" style="display:flex;gap:10px;">
          <button
            style="flex:1;padding:11px;background:#f3f4f6;border:none;border-radius:8px;cursor:pointer;font-size:14px;font-weight:500;"
            @click=${() => { if (!sheet) sheet = document.querySelector("sp-bottom-sheet"); sheet!.open = false; }}
          >Cancel</button>
          <button
            style="flex:1;padding:11px;background:#ef4444;color:white;border:none;border-radius:8px;cursor:pointer;font-size:14px;font-weight:500;"
            @click=${() => alert("Deleted!")}
          >Delete</button>
        </div>
      </sp-bottom-sheet>
    `;
  },
};

export const Tall: Story = {
  name: "Tall — scrollable content",
  render: () => {
    let sheet: any;
    return html`
      <div style="padding:40px;text-align:center;">
        <button
          style="padding:10px 24px;background:#3b82f6;color:white;border:none;border-radius:8px;cursor:pointer;font-size:14px;"
          @click=${() => { if (!sheet) sheet = document.querySelector("sp-bottom-sheet"); sheet!.open = true; }}
        >Open tall sheet</button>
      </div>

      <sp-bottom-sheet title="Select country" snap-height="75vh">
        <div style="display:flex;flex-direction:column;gap:2px;">
          ${["Argentina", "Bolivia", "Chile", "Colombia", "Costa Rica", "Cuba", "Ecuador", "El Salvador",
             "Guatemala", "Honduras", "México", "Nicaragua", "Panamá", "Paraguay", "Perú",
             "Puerto Rico", "República Dominicana", "Uruguay", "Venezuela"].map(c => html`
            <div style="padding:13px 0;border-bottom:1px solid #f3f4f6;font-size:14px;cursor:pointer;color:#111827;" @click=${() => alert(c)}>${c}</div>
          `)}
        </div>
      </sp-bottom-sheet>
    `;
  },
};

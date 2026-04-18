import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "../../components/aspect-ratio/sp-aspect-ratio.js";

const meta: Meta = {
  title: "Components/AspectRatio",
  component: "sp-aspect-ratio",
  tags: ["autodocs"],
  argTypes: {
    ratio: { control: "text", description: 'Relación de aspecto, ej: "16/9", "4/3", "1/1"' },
  },
  args: { ratio: "16/9" },
  render: ({ ratio }) => html`
    <div style="width:400px;">
      <sp-aspect-ratio ratio=${ratio}>
        <div style="background:#3b82f6;display:flex;align-items:center;justify-content:center;color:white;font-size:18px;font-weight:600;border-radius:8px;">
          ${ratio}
        </div>
      </sp-aspect-ratio>
    </div>
  `,
};

export default meta;
type Story = StoryObj;

export const Widescreen: Story = { args: { ratio: "16/9" } };
export const Standard: Story = { args: { ratio: "4/3" } };
export const Square: Story = { args: { ratio: "1/1" } };
export const Portrait: Story = { args: { ratio: "9/16" } };
export const Cinema: Story = { args: { ratio: "21/9" } };

export const WithImage: Story = {
  render: () => html`
    <div style="width:400px;">
      <sp-aspect-ratio ratio="16/9">
        <img
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80"
          alt="Paisaje de montaña"
          style="width:100%;height:100%;object-fit:cover;border-radius:8px;"
        />
      </sp-aspect-ratio>
    </div>
  `,
};

export const AllRatios: Story = {
  render: () => html`
    <div style="display:flex;gap:16px;flex-wrap:wrap;">
      ${["16/9","4/3","1/1","3/4","21/9"].map(r => html`
        <div style="width:200px;">
          <p style="font-size:12px;margin:0 0 4px;color:#6b7280;">${r}</p>
          <sp-aspect-ratio ratio=${r}>
            <div style="background:#e0e7ff;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:500;border-radius:6px;">${r}</div>
          </sp-aspect-ratio>
        </div>
      `)}
    </div>
  `,
};

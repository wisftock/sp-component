import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "../../components/heatmap/sp-heatmap.js";

function generateData(weeks = 52) {
  const data = [];
  const today = new Date();
  for (let i = 0; i < weeks * 7; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    if (Math.random() > 0.5) {
      data.push({
        date: d.toISOString().slice(0, 10),
        value: Math.floor(Math.random() * 15),
      });
    }
  }
  return data;
}

const DATA = generateData(52);

const meta: Meta = {
  title: "Components/Heatmap",
  component: "sp-heatmap",
  tags: ["autodocs"],
  argTypes: {
    weeks: { control: "number" },
    color: { control: "select", options: ["green","blue","purple","orange"] },
    legend: { control: "boolean" },
    size: { control: "select", options: ["sm","md","lg"] },
  },
  args: { weeks: 52, color: "green", legend: true, size: "md" },
  render: ({ weeks, color, legend, size }) => html`
    <sp-heatmap .data=${DATA} weeks=${weeks} color=${color} ?legend=${legend} size=${size}></sp-heatmap>
  `,
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
export const Blue: Story = { args: { color: "blue" } };
export const Purple: Story = { args: { color: "purple" } };
export const Orange: Story = { args: { color: "orange" } };
export const Small: Story = { args: { size: "sm" } };
export const Large: Story = { args: { size: "lg" } };
export const NoLegend: Story = { args: { legend: false } };

export const LastThreeMonths: Story = {
  render: () => html`
    <sp-heatmap .data=${generateData(13)} weeks=${13} color="blue" legend></sp-heatmap>
  `,
};

export const AllColors: Story = {
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:24px;">
      ${(["green","blue","purple","orange"] as const).map(color => html`
        <div>
          <p style="font-size:13px;font-weight:500;margin:0 0 8px;color:#374151;text-transform:capitalize;">${color}</p>
          <sp-heatmap .data=${generateData(26)} weeks=${26} color=${color} size="sm"></sp-heatmap>
        </div>
      `)}
    </div>
  `,
};

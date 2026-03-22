import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import type { SpScrollAreaProps } from "../../components/scroll-area/sp-scroll-area.types.js";
import "../../components/scroll-area/sp-scroll-area.js";

const meta: Meta<SpScrollAreaProps> = {
  title: "Components/ScrollArea",
  component: "sp-scroll-area",
  tags: ["autodocs"],
  argTypes: {
    orientation: {
      control: "select",
      options: ["vertical", "horizontal", "both"],
      description: "Scroll direction",
    },
    scrollbar: {
      control: "select",
      options: ["auto", "always", "never"],
      description: "Scrollbar visibility",
    },
    maxHeight: { control: "text", description: "CSS max-height value" },
    maxWidth: { control: "text", description: "CSS max-width value" },
  },
  args: {
    orientation: "vertical",
    scrollbar: "auto",
    maxHeight: "",
    maxWidth: "",
  },
};

export default meta;
type Story = StoryObj<SpScrollAreaProps>;

const loremParagraphs = Array.from(
  { length: 10 },
  (_, i) =>
    `<p style="margin: 0 0 12px; color: #374151; line-height: 1.6;">
      Paragraph ${i + 1}: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
      incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
      ullamco laboris nisi ut aliquip ex ea commodo consequat.
    </p>`,
).join("");

export const Default: Story = {
  render: () => html`
    <sp-scroll-area max-height="300px" orientation="vertical" scrollbar="auto" style="width: 400px; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px;">
      <div .innerHTML=${loremParagraphs}></div>
    </sp-scroll-area>
  `,
};

export const Horizontal: Story = {
  render: () => html`
    <sp-scroll-area
      orientation="horizontal"
      scrollbar="always"
      style="width: 400px; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px;"
    >
      <div style="display: flex; gap: 12px; width: max-content;">
        ${Array.from({ length: 20 }, (_, i) => `
          <div style="width:100px; height:100px; background:#eff6ff; border:1px solid #bfdbfe; border-radius:8px; display:flex; align-items:center; justify-content:center; font-size:0.85rem; color:#1d4ed8; flex-shrink:0;">
            Card ${i + 1}
          </div>
        `).join("")}
      </div>
    </sp-scroll-area>
  `,
};

export const Both: Story = {
  render: () => html`
    <sp-scroll-area
      orientation="both"
      scrollbar="always"
      max-height="250px"
      max-width="400px"
      style="border: 1px solid #e5e7eb; border-radius: 8px;"
    >
      <div style="width: 800px; padding: 16px;">
        ${Array.from({ length: 15 }, (_, i) =>
          `<p style="white-space: nowrap; color: #374151; margin: 0 0 8px;">
            Row ${i + 1}: This is a very long line of text that extends beyond the container width to demonstrate horizontal scrolling.
          </p>`
        ).join("")}
      </div>
    </sp-scroll-area>
  `,
};

export const CustomMaxHeight: Story = {
  render: () => html`
    <div style="display: flex; gap: 24px; align-items: flex-start;">
      <div>
        <p style="font-size: 0.8rem; color: #6b7280; margin: 0 0 8px;">max-height: 150px</p>
        <sp-scroll-area
          max-height="150px"
          scrollbar="always"
          style="width: 250px; border: 1px solid #e5e7eb; border-radius: 8px; padding: 12px;"
        >
          <div .innerHTML=${loremParagraphs}></div>
        </sp-scroll-area>
      </div>
      <div>
        <p style="font-size: 0.8rem; color: #6b7280; margin: 0 0 8px;">max-height: 300px</p>
        <sp-scroll-area
          max-height="300px"
          scrollbar="always"
          style="width: 250px; border: 1px solid #e5e7eb; border-radius: 8px; padding: 12px;"
        >
          <div .innerHTML=${loremParagraphs}></div>
        </sp-scroll-area>
      </div>
    </div>
  `,
};

export const AlwaysVisible: Story = {
  render: () => html`
    <sp-scroll-area
      max-height="250px"
      orientation="vertical"
      scrollbar="always"
      style="width: 400px; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px;"
    >
      <div .innerHTML=${loremParagraphs}></div>
    </sp-scroll-area>
  `,
};

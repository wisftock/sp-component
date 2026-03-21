import type { Meta, StoryObj } from "@storybook/web-components";
import { html, nothing } from "lit";
import type { SpCardProps } from "../../components/card/sp-card.types.js";
import "../../components/card/sp-card.js";

const meta: Meta<SpCardProps> = {
  title: "Components/Card",
  component: "sp-card",
  tags: ["autodocs"],
  argTypes: {
    shadow: {
      control: "select",
      options: ["none", "sm", "md", "lg"],
      description: "Shadow depth of the card",
    },
    bordered: {
      control: "boolean",
      description: "Adds a border around the card",
    },
    padding: {
      control: "text",
      description: "Inner padding (CSS value)",
    },
  },
  args: {
    shadow: "sm",
    bordered: false,
    padding: "16px",
  },
  render: ({ shadow, bordered, padding }) => html`
    <sp-card
      shadow=${shadow}
      ?bordered=${bordered}
      padding=${padding || nothing}
      style="max-width: 360px;"
    >
      <p>Card content goes here.</p>
    </sp-card>
  `,
};

export default meta;
type Story = StoryObj<SpCardProps>;

export const Default: Story = {
  args: { shadow: "sm" },
};

export const WithHeader: Story = {
  render: () => html`
    <sp-card shadow="sm" style="max-width: 360px;">
      <span slot="header">Card Title</span>
      <p>This card has a header slot with a title.</p>
    </sp-card>
  `,
};

export const WithFooter: Story = {
  render: () => html`
    <sp-card shadow="sm" style="max-width: 360px;">
      <p>Card body content.</p>
      <div slot="footer" style="display: flex; justify-content: flex-end; gap: 8px;">
        <button>Cancel</button>
        <button>Confirm</button>
      </div>
    </sp-card>
  `,
};

export const WithImage: Story = {
  render: () => html`
    <sp-card shadow="md" padding="0" style="max-width: 360px;">
      <img slot="image" src="https://picsum.photos/seed/card/360/180" alt="Card image" />
      <div style="padding: 16px;">
        <p>Card with an image in the image slot.</p>
      </div>
    </sp-card>
  `,
};

export const Bordered: Story = {
  render: () => html`
    <sp-card shadow="none" bordered style="max-width: 360px;">
      <span slot="header">Bordered Card</span>
      <p>This card has no shadow but a border.</p>
    </sp-card>
  `,
};

export const AllShadows: Story = {
  render: () => html`
    <div style="display: flex; flex-wrap: wrap; gap: 24px;">
      <sp-card shadow="none" style="max-width: 200px;">
        <span slot="header">No shadow</span>
        <p>shadow="none"</p>
      </sp-card>
      <sp-card shadow="sm" style="max-width: 200px;">
        <span slot="header">Small shadow</span>
        <p>shadow="sm"</p>
      </sp-card>
      <sp-card shadow="md" style="max-width: 200px;">
        <span slot="header">Medium shadow</span>
        <p>shadow="md"</p>
      </sp-card>
      <sp-card shadow="lg" style="max-width: 200px;">
        <span slot="header">Large shadow</span>
        <p>shadow="lg"</p>
      </sp-card>
    </div>
  `,
};

export const CardGrid: Story = {
  render: () => html`
    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; max-width: 800px;">
      ${[1, 2, 3, 4, 5, 6].map(
        (n) => html`
          <sp-card shadow="sm" bordered>
            <span slot="header">Card ${n}</span>
            <p>Content for card ${n}.</p>
            <span slot="footer">Footer ${n}</span>
          </sp-card>
        `,
      )}
    </div>
  `,
};

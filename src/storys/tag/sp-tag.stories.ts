import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import type { SpTagProps } from "../../components/tag/sp-tag.types.js";
import "../../components/tag/sp-tag.js";

const meta: Meta<SpTagProps> = {
  title: "Components/Tag",
  component: "sp-tag",
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "success", "warning", "danger", "neutral"],
      description: "Color variant",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Size of the tag",
    },
    removable: {
      control: "boolean",
      description: "Shows a remove button",
    },
    disabled: {
      control: "boolean",
      description: "Disables the tag",
    },
  },
  args: {
    variant: "primary",
    size: "md",
    removable: false,
    disabled: false,
  },
  render: ({ variant, size, removable, disabled }) => html`
    <sp-tag variant=${variant} size=${size} ?removable=${removable} ?disabled=${disabled}>
      Tag label
    </sp-tag>
  `,
};

export default meta;
type Story = StoryObj<SpTagProps>;

export const AllVariants: Story = {
  render: () => html`
    <div style="display: flex; flex-wrap: wrap; gap: 8px; align-items: center;">
      <sp-tag variant="primary">Primary</sp-tag>
      <sp-tag variant="secondary">Secondary</sp-tag>
      <sp-tag variant="success">Success</sp-tag>
      <sp-tag variant="warning">Warning</sp-tag>
      <sp-tag variant="danger">Danger</sp-tag>
      <sp-tag variant="neutral">Neutral</sp-tag>
    </div>
  `,
};

export const Sizes: Story = {
  render: () => html`
    <div style="display: flex; gap: 8px; align-items: center;">
      <sp-tag size="sm">Small</sp-tag>
      <sp-tag size="md">Medium</sp-tag>
      <sp-tag size="lg">Large</sp-tag>
    </div>
  `,
};

export const Removable: Story = {
  render: () => html`
    <div style="display: flex; flex-wrap: wrap; gap: 8px; align-items: center;">
      <sp-tag variant="primary" removable @sp-remove=${(e: Event) => (e.target as HTMLElement).remove()}>
        JavaScript
      </sp-tag>
      <sp-tag variant="success" removable @sp-remove=${(e: Event) => (e.target as HTMLElement).remove()}>
        TypeScript
      </sp-tag>
      <sp-tag variant="warning" removable @sp-remove=${(e: Event) => (e.target as HTMLElement).remove()}>
        CSS
      </sp-tag>
    </div>
  `,
};

export const Disabled: Story = {
  render: () => html`
    <div style="display: flex; flex-wrap: wrap; gap: 8px; align-items: center;">
      <sp-tag variant="primary" disabled>Primary</sp-tag>
      <sp-tag variant="success" removable disabled>Removable but disabled</sp-tag>
      <sp-tag variant="danger" disabled>Danger</sp-tag>
    </div>
  `,
};

export const TagGroup: Story = {
  render: () => html`
    <div style="display: flex; flex-wrap: wrap; gap: 6px; max-width: 400px;">
      <sp-tag variant="primary" removable>React</sp-tag>
      <sp-tag variant="primary" removable>Vue</sp-tag>
      <sp-tag variant="primary" removable>Angular</sp-tag>
      <sp-tag variant="secondary" removable>Node.js</sp-tag>
      <sp-tag variant="secondary" removable>Deno</sp-tag>
      <sp-tag variant="success" removable>Deployed</sp-tag>
      <sp-tag variant="warning" removable>In review</sp-tag>
      <sp-tag variant="neutral" removable>Draft</sp-tag>
    </div>
  `,
};

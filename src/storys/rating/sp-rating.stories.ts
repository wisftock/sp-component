import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import type { SpRatingProps } from "../../components/rating/sp-rating.types.js";
import "../../components/rating/sp-rating.js";

const meta: Meta<SpRatingProps> = {
  title: "Components/Rating",
  component: "sp-rating",
  tags: ["autodocs"],
  argTypes: {
    value: { control: "number", description: "Current rating value" },
    max: { control: "number", description: "Maximum number of stars" },
    precision: { control: "number", description: "1 = whole, 0.5 = half stars" },
    disabled: { control: "boolean", description: "Disables the rating" },
    readonly: { control: "boolean", description: "Makes the rating read-only" },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Size of the stars",
    },
    label: { control: "text", description: "Accessible aria-label" },
  },
  args: {
    value: 0,
    max: 5,
    precision: 1,
    disabled: false,
    readonly: false,
    size: "md",
    label: "Rating",
  },
  render: ({ value, max, precision, disabled, readonly, size, label }) => html`
    <sp-rating
      value=${value}
      max=${max}
      precision=${precision}
      ?disabled=${disabled}
      ?readonly=${readonly}
      size=${size}
      label=${label}
    ></sp-rating>
  `,
};

export default meta;
type Story = StoryObj<SpRatingProps>;

export const Default: Story = {
  args: { value: 0 },
};

export const WithValue: Story = {
  args: { value: 3 },
};

export const Readonly: Story = {
  args: { value: 4, readonly: true },
};

export const Disabled: Story = {
  args: { value: 2, disabled: true },
};

export const Sizes: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 16px;">
      <sp-rating size="sm" value="3" label="Small rating"></sp-rating>
      <sp-rating size="md" value="3" label="Medium rating"></sp-rating>
      <sp-rating size="lg" value="3" label="Large rating"></sp-rating>
    </div>
  `,
};

export const CustomMax: Story = {
  args: { max: 10, value: 7 },
};

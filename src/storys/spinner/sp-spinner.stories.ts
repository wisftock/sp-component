import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import type { SpSpinnerProps } from "../../components/spinner/sp-spinner.types.js";
import "../../components/spinner/sp-spinner.js";

const meta: Meta<SpSpinnerProps> = {
  title: "Components/Spinner",
  component: "sp-spinner",
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg", "xl"],
      description: "Size of the spinner",
    },
    label: {
      control: "text",
      description: "Accessible label (aria-label and sr-only text)",
    },
  },
  args: {
    size: "md",
    label: "Loading...",
  },
  render: ({ size, label }) => html`
    <sp-spinner size=${size} label=${label}></sp-spinner>
  `,
};

export default meta;
type Story = StoryObj<SpSpinnerProps>;

export const Default: Story = {
  args: { size: "md" },
};

export const Sizes: Story = {
  render: () => html`
    <div style="display: flex; align-items: center; gap: 24px;">
      <sp-spinner size="sm"></sp-spinner>
      <sp-spinner size="md"></sp-spinner>
      <sp-spinner size="lg"></sp-spinner>
      <sp-spinner size="xl"></sp-spinner>
    </div>
  `,
};

export const CustomColor: Story = {
  render: () => html`
    <sp-spinner size="lg" style="color: #10b981;"></sp-spinner>
  `,
};

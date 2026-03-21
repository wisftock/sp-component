import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import type { SpProgressBarProps } from "../../components/progress-bar/sp-progress-bar.types.js";
import "../../components/progress-bar/sp-progress-bar.js";

const meta: Meta<SpProgressBarProps> = {
  title: "Components/ProgressBar",
  component: "sp-progress-bar",
  tags: ["autodocs"],
  argTypes: {
    value: {
      control: { type: "range", min: 0, max: 100, step: 1 },
      description: "Current value (0..max)",
    },
    max: {
      control: "number",
      description: "Maximum value (default 100)",
    },
    variant: {
      control: "select",
      options: ["primary", "success", "warning", "danger"],
      description: "Visual style",
    },
    indeterminate: {
      control: "boolean",
      description: "Shows an animated indeterminate state",
    },
    label: {
      control: "text",
      description: "Label displayed above the bar",
    },
    showValue: {
      control: "boolean",
      description: "Shows the percentage above the bar",
    },
  },
  args: {
    value: 50,
    max: 100,
    variant: "primary",
    indeterminate: false,
    label: "",
    showValue: false,
  },
  render: ({ value, max, variant, indeterminate, label, showValue }) => html`
    <sp-progress-bar
      value=${value}
      max=${max}
      variant=${variant}
      ?indeterminate=${indeterminate}
      label=${label}
      ?show-value=${showValue}
      style="width: 400px;"
    ></sp-progress-bar>
  `,
};

export default meta;
type Story = StoryObj<SpProgressBarProps>;

export const Default: Story = {
  args: { value: 50 },
  render: () => html`
    <sp-progress-bar value="50" style="width: 400px;"></sp-progress-bar>
  `,
};

export const AllVariants: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 16px; width: 400px;">
      <sp-progress-bar value="60" variant="primary" label="Primary"></sp-progress-bar>
      <sp-progress-bar value="75" variant="success" label="Success"></sp-progress-bar>
      <sp-progress-bar value="45" variant="warning" label="Warning"></sp-progress-bar>
      <sp-progress-bar value="30" variant="danger" label="Danger"></sp-progress-bar>
    </div>
  `,
};

export const WithLabel: Story = {
  render: () => html`
    <sp-progress-bar value="65" label="Uploading files..." style="width: 400px;"></sp-progress-bar>
  `,
};

export const WithValue: Story = {
  render: () => html`
    <sp-progress-bar value="75" show-value label="Download progress" style="width: 400px;"></sp-progress-bar>
  `,
};

export const Indeterminate: Story = {
  render: () => html`
    <sp-progress-bar indeterminate label="Processing..." style="width: 400px;"></sp-progress-bar>
  `,
};

export const Animated: Story = {
  render: () => html`
    <sp-progress-bar value="75" variant="primary" label="Rendering" show-value style="width: 400px;"></sp-progress-bar>
  `,
};

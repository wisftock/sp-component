import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import type { SpSliderProps } from "../../components/slider/sp-slider.types.js";
import "../../components/slider/sp-slider.js";

const meta: Meta<SpSliderProps> = {
  title: "Components/Slider",
  component: "sp-slider",
  tags: ["autodocs"],
  argTypes: {
    value: { control: "number", description: "Current value" },
    min: { control: "number", description: "Minimum value" },
    max: { control: "number", description: "Maximum value" },
    step: { control: "number", description: "Step increment" },
    disabled: { control: "boolean", description: "Disables the slider" },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Size of the slider",
    },
    label: { control: "text", description: "Label text" },
    showValue: { control: "boolean", description: "Shows the current value" },
    error: { control: "text", description: "Error message" },
    hint: { control: "text", description: "Hint message" },
  },
  args: {
    value: 50,
    min: 0,
    max: 100,
    step: 1,
    disabled: false,
    size: "md",
    label: "",
    showValue: false,
    error: "",
    hint: "",
  },
  render: ({ value, min, max, step, disabled, size, label, showValue, error, hint }) => html`
    <sp-slider
      value=${value}
      min=${min}
      max=${max}
      step=${step}
      ?disabled=${disabled}
      size=${size}
      label=${label}
      ?show-value=${showValue}
      error=${error}
      hint=${hint}
    ></sp-slider>
  `,
};

export default meta;
type Story = StoryObj<SpSliderProps>;

export const Default: Story = {
  args: { value: 50 },
};

export const WithLabel: Story = {
  args: { label: "Volume", value: 60 },
};

export const WithValue: Story = {
  args: { label: "Brightness", value: 75, showValue: true },
};

export const Disabled: Story = {
  args: { value: 40, disabled: true, label: "Disabled slider" },
};

export const Range: Story = {
  args: { min: 0, max: 10, step: 0.5, value: 5, label: "Precision" },
};

export const Sizes: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 24px; width: 300px;">
      <sp-slider size="sm" value="30" label="Small"></sp-slider>
      <sp-slider size="md" value="50" label="Medium"></sp-slider>
      <sp-slider size="lg" value="70" label="Large"></sp-slider>
    </div>
  `,
};

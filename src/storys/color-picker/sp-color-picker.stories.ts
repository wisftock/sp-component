import type { Meta, StoryObj } from "@storybook/web-components";
import { html, nothing } from "lit";
import type { SpColorPickerProps } from "../../components/color-picker/sp-color-picker.types.js";
import "../../components/color-picker/sp-color-picker.js";

const meta: Meta<SpColorPickerProps> = {
  title: "Components/ColorPicker",
  component: "sp-color-picker",
  tags: ["autodocs"],
  argTypes: {
    value: {
      control: "color",
      description: "Current color value (hex string)",
    },
    format: {
      control: "select",
      options: ["hex", "rgb", "hsl"],
      description: "Output format",
    },
    disabled: {
      control: "boolean",
      description: "Disables the picker",
    },
    showAlpha: {
      control: "boolean",
      description: "Show alpha channel slider",
    },
    swatches: {
      control: "text",
      description: "Comma-separated preset colors",
    },
    label: {
      control: "text",
      description: "Label text",
    },
    hint: {
      control: "text",
      description: "Hint text",
    },
    error: {
      control: "text",
      description: "Error message",
    },
  },
  args: {
    value: "#3b82f6",
    format: "hex",
    disabled: false,
    showAlpha: false,
    swatches: "",
    label: "",
    hint: "",
    error: "",
  },
  render: ({ value, format, disabled, showAlpha, swatches, label, hint, error }) => html`
    <sp-color-picker
      value=${value}
      format=${format}
      ?disabled=${disabled}
      ?show-alpha=${showAlpha}
      swatches=${swatches || nothing}
      label=${label || nothing}
      hint=${hint || nothing}
      error=${error || nothing}
    ></sp-color-picker>
  `,
};

export default meta;
type Story = StoryObj<SpColorPickerProps>;

// ---- Default ----

export const Default: Story = {
  args: { value: "#3b82f6", label: "Pick a color" },
};

// ---- WithSwatches ----

export const WithSwatches: Story = {
  args: {
    value: "#3b82f6",
    label: "Brand color",
    swatches: "#ef4444,#f97316,#eab308,#22c55e,#3b82f6,#8b5cf6,#ec4899,#000000,#ffffff",
  },
};

// ---- WithAlpha ----

export const WithAlpha: Story = {
  args: {
    value: "#3b82f6",
    label: "Color with alpha",
    showAlpha: true,
  },
};

// ---- FormatRGB ----

export const FormatRGB: Story = {
  args: {
    value: "#22c55e",
    format: "rgb",
    label: "RGB format",
  },
};

// ---- FormatHSL ----

export const FormatHSL: Story = {
  args: {
    value: "#8b5cf6",
    format: "hsl",
    label: "HSL format",
  },
};

// ---- Disabled ----

export const Disabled: Story = {
  args: {
    value: "#6b7280",
    label: "Disabled picker",
    disabled: true,
  },
};

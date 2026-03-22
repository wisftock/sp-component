import type { Meta, StoryObj } from "@storybook/web-components";
import { html, nothing } from "lit";
import type { SpTimePickerProps } from "../../components/time-picker/sp-time-picker.types.js";
import "../../components/time-picker/sp-time-picker.js";

const meta: Meta<SpTimePickerProps> = {
  title: "Components/TimePicker",
  component: "sp-time-picker",
  tags: ["autodocs"],
  argTypes: {
    value: {
      control: "text",
      description: "Time value in HH:MM or HH:MM:SS format",
    },
    format: {
      control: "select",
      options: ["12", "24"],
      description: "12 or 24 hour display format",
    },
    step: {
      control: "select",
      options: [1, 5, 10, 15, 30, 60],
      description: "Minute step interval",
    },
    showSeconds: {
      control: "boolean",
      description: "Show seconds column",
    },
    min: {
      control: "text",
      description: "Minimum time (HH:MM)",
    },
    max: {
      control: "text",
      description: "Maximum time (HH:MM)",
    },
    disabled: {
      control: "boolean",
      description: "Disables the picker",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Size variant",
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
    placeholder: {
      control: "text",
      description: "Placeholder text",
    },
  },
  args: {
    value: "",
    format: "24",
    step: 1,
    showSeconds: false,
    min: "",
    max: "",
    disabled: false,
    size: "md",
    label: "",
    hint: "",
    error: "",
    placeholder: "HH:MM",
  },
  render: ({ value, format, step, showSeconds, min, max, disabled, size, label, hint, error, placeholder }) => html`
    <sp-time-picker
      value=${value || nothing}
      format=${format}
      step=${step}
      ?show-seconds=${showSeconds}
      min=${min || nothing}
      max=${max || nothing}
      ?disabled=${disabled}
      size=${size}
      label=${label || nothing}
      hint=${hint || nothing}
      error=${error || nothing}
      placeholder=${placeholder || nothing}
    ></sp-time-picker>
  `,
};

export default meta;
type Story = StoryObj<SpTimePickerProps>;

// ---- Default ----

export const Default: Story = {
  args: { label: "Select time" },
};

// ---- Format12h ----

export const Format12h: Story = {
  args: {
    format: "12",
    label: "Appointment time",
    placeholder: "HH:MM AM/PM",
  },
};

// ---- WithStep30 ----

export const WithStep30: Story = {
  args: {
    step: 30,
    label: "Meeting time (30-min slots)",
    hint: "Select in 30-minute increments",
  },
};

// ---- WithSeconds ----

export const WithSeconds: Story = {
  args: {
    showSeconds: true,
    label: "Precise time",
    placeholder: "HH:MM:SS",
  },
};

// ---- WithMinMax ----

export const WithMinMax: Story = {
  args: {
    min: "09:00",
    max: "17:00",
    label: "Business hours only",
    hint: "Between 09:00 and 17:00",
  },
};

// ---- Disabled ----

export const Disabled: Story = {
  args: {
    value: "14:30",
    label: "Disabled time picker",
    disabled: true,
  },
};

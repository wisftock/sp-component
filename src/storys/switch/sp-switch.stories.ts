import type { Meta, StoryObj } from "@storybook/web-components";
import { html, nothing } from "lit";
import type { SpSwitchProps } from "../../components/switch/sp-switch.types.js";
import "../../components/switch/sp-switch.js";

const meta: Meta<SpSwitchProps> = {
  title: "Components/Switch",
  component: "sp-switch",
  tags: ["autodocs"],
  argTypes: {
    checked: {
      control: "boolean",
      description: "Whether the switch is on",
    },
    disabled: {
      control: "boolean",
      description: "Disables the switch",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Size of the switch",
    },
    label: {
      control: "text",
      description: "Label text",
    },
    hint: {
      control: "text",
      description: "Hint text shown below the switch",
    },
    name: {
      control: "text",
      description: "Native input name",
    },
    value: {
      control: "text",
      description: "Native input value",
    },
  },
  args: {
    checked: false,
    disabled: false,
    size: "md",
    label: "",
    hint: "",
    name: "",
    value: "on",
  },
  render: ({ checked, disabled, size, label, hint, name, value }) => html`
    <sp-switch
      ?checked=${checked}
      ?disabled=${disabled}
      size=${size}
      label=${label || nothing}
      hint=${hint || nothing}
      name=${name || nothing}
      value=${value}
    ></sp-switch>
  `,
};

export default meta;
type Story = StoryObj<SpSwitchProps>;

export const Default: Story = {
  args: {},
};

export const Checked: Story = {
  args: { checked: true },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const DisabledChecked: Story = {
  args: { disabled: true, checked: true },
};

export const WithLabel: Story = {
  args: { label: "Enable dark mode" },
};

export const WithHint: Story = {
  args: {
    label: "Marketing emails",
    hint: "Receive promotional offers and product updates",
  },
};

export const Sizes: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 16px;">
      <sp-switch size="sm" label="Small switch"></sp-switch>
      <sp-switch size="md" label="Medium switch (default)"></sp-switch>
      <sp-switch size="lg" label="Large switch"></sp-switch>
    </div>
  `,
};

export const SizesChecked: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 16px;">
      <sp-switch size="sm" label="Small" checked></sp-switch>
      <sp-switch size="md" label="Medium" checked></sp-switch>
      <sp-switch size="lg" label="Large" checked></sp-switch>
    </div>
  `,
};

export const SettingsGroup: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 16px; max-width: 360px;">
      <sp-switch label="Push notifications" checked hint="Receive alerts on your device"></sp-switch>
      <sp-switch label="Email notifications" hint="We will email you for important updates"></sp-switch>
      <sp-switch label="SMS notifications" disabled hint="Requires a verified phone number"></sp-switch>
    </div>
  `,
};

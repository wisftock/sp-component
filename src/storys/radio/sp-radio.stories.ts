import type { Meta, StoryObj } from "@storybook/web-components";
import { html, nothing } from "lit";
import type { SpRadioProps } from "../../components/radio/sp-radio.types.js";
import "../../components/radio/sp-radio.js";
import "../../components/radio/sp-radio-group.js";

const meta: Meta<SpRadioProps> = {
  title: "Components/Radio",
  component: "sp-radio",
  tags: ["autodocs"],
  argTypes: {
    value: {
      control: "text",
      description: "The value of this radio option",
    },
    checked: {
      control: "boolean",
      description: "Whether this radio is selected",
    },
    disabled: {
      control: "boolean",
      description: "Disables the radio",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Size of the radio",
    },
    label: {
      control: "text",
      description: "Label text",
    },
  },
  args: {
    value: "option",
    checked: false,
    disabled: false,
    size: "md",
    label: "Option label",
  },
  render: ({ value, checked, disabled, size, label }) => html`
    <sp-radio
      value=${value}
      ?checked=${checked}
      ?disabled=${disabled}
      size=${size}
      label=${label || nothing}
    ></sp-radio>
  `,
};

export default meta;
type Story = StoryObj<SpRadioProps>;

export const Default: Story = {
  args: { label: "Default option" },
};

export const Checked: Story = {
  args: { checked: true, label: "Selected option" },
};

export const Disabled: Story = {
  args: { disabled: true, label: "Disabled option" },
};

export const DisabledChecked: Story = {
  args: { disabled: true, checked: true, label: "Disabled and selected" },
};

export const Sizes: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 12px;">
      <sp-radio size="sm" label="Small radio" value="sm"></sp-radio>
      <sp-radio size="md" label="Medium radio (default)" value="md"></sp-radio>
      <sp-radio size="lg" label="Large radio" value="lg"></sp-radio>
    </div>
  `,
};

export const WithGroup: Story = {
  render: () => html`
    <sp-radio-group name="plan" value="pro" label="Choose a plan">
      <sp-radio value="free" label="Free — $0/month"></sp-radio>
      <sp-radio value="pro" label="Pro — $9/month"></sp-radio>
      <sp-radio value="enterprise" label="Enterprise — Contact us"></sp-radio>
      <sp-radio value="legacy" label="Legacy (unavailable)" disabled></sp-radio>
    </sp-radio-group>
  `,
};

export const GroupHorizontal: Story = {
  render: () => html`
    <sp-radio-group name="size" value="md" label="Select size" orientation="horizontal">
      <sp-radio value="sm" label="S"></sp-radio>
      <sp-radio value="md" label="M"></sp-radio>
      <sp-radio value="lg" label="L"></sp-radio>
      <sp-radio value="xl" label="XL"></sp-radio>
    </sp-radio-group>
  `,
};

export const GroupWithError: Story = {
  render: () => html`
    <sp-radio-group name="terms" label="Do you agree?" error="You must select an option">
      <sp-radio value="yes" label="Yes, I agree"></sp-radio>
      <sp-radio value="no" label="No, I disagree"></sp-radio>
    </sp-radio-group>
  `,
};

export const GroupWithHint: Story = {
  render: () => html`
    <sp-radio-group name="notify" label="Notification frequency" hint="You can change this setting at any time">
      <sp-radio value="daily" label="Daily digest"></sp-radio>
      <sp-radio value="weekly" label="Weekly summary"></sp-radio>
      <sp-radio value="never" label="Never"></sp-radio>
    </sp-radio-group>
  `,
};

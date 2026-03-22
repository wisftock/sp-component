import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import type { SpTagInputProps } from "../../components/tag-input/sp-tag-input.types.js";
import "../../components/tag-input/sp-tag-input.js";

const meta: Meta<SpTagInputProps> = {
  title: "Components/TagInput",
  component: "sp-tag-input",
  tags: ["autodocs"],
  argTypes: {
    values: { control: "text", description: "Comma-separated current tags" },
    placeholder: { control: "text", description: "Placeholder text" },
    disabled: { control: "boolean" },
    readonly: { control: "boolean" },
    required: { control: "boolean" },
    name: { control: "text" },
    max: { control: "number", description: "Max tags (0 = unlimited)" },
    allowDuplicates: { control: "boolean" },
    delimiter: { control: "text" },
    label: { control: "text" },
    hint: { control: "text" },
    error: { control: "text" },
    size: { control: "select", options: ["sm", "md", "lg"] },
  },
  args: {
    placeholder: "Add tag...",
    size: "md",
    max: 0,
    allowDuplicates: false,
    delimiter: ",",
  },
};

export default meta;
type Story = StoryObj<SpTagInputProps>;

export const Default: Story = {
  render: (args) => html`
    <sp-tag-input
      placeholder=${args.placeholder}
      size=${args.size}
    ></sp-tag-input>
  `,
};

export const WithPresetValues: Story = {
  render: () => html`
    <sp-tag-input
      values="typescript,lit,web-components"
      label="Technologies"
      placeholder="Add technology..."
    ></sp-tag-input>
  `,
};

export const MaxTags: Story = {
  render: () => html`
    <sp-tag-input
      values="one,two"
      max="3"
      label="Max 3 tags"
      hint="You can add up to 3 tags"
    ></sp-tag-input>
  `,
};

export const Disabled: Story = {
  render: () => html`
    <sp-tag-input
      values="locked,tag"
      disabled
      label="Disabled"
    ></sp-tag-input>
  `,
};

export const WithLabelAndError: Story = {
  render: () => html`
    <sp-tag-input
      label="Required tags"
      error="Please add at least one tag"
      required
    ></sp-tag-input>
  `,
};

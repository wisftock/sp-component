import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import type { SpSegmentedControlProps } from "../../components/segmented-control/sp-segmented-control.types.js";
import "../../components/segmented-control/sp-segmented-control.js";

const meta: Meta<SpSegmentedControlProps> = {
  title: "Components/Segmented Control",
  component: "sp-segmented-control",
  tags: ["autodocs"],
  argTypes: {
    value: {
      control: "text",
      description: "Currently selected value",
    },
    disabled: {
      control: "boolean",
      description: "Disables all options",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Size of the control",
    },
    fullWidth: {
      control: "boolean",
      description: "Stretches to fill container width",
    },
  },
  args: {
    value: "month",
    disabled: false,
    size: "md",
    fullWidth: false,
  },
  render: ({ value, disabled, size, fullWidth }) => html`
    <sp-segmented-control
      value=${value}
      size=${size}
      ?disabled=${disabled}
      ?full-width=${fullWidth}
      .options=${[
        { value: "day", label: "Day" },
        { value: "week", label: "Week" },
        { value: "month", label: "Month" },
        { value: "year", label: "Year" },
      ]}
      @sp-change=${(e: CustomEvent) => console.log("sp-change", e.detail)}
    ></sp-segmented-control>
  `,
};

export default meta;
type Story = StoryObj<SpSegmentedControlProps>;

export const Default: Story = {};

export const Sizes: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 16px; align-items: flex-start;">
      <sp-segmented-control
        value="a" size="sm"
        .options=${[{ value: "a", label: "Small" }, { value: "b", label: "Options" }, { value: "c", label: "Here" }]}
      ></sp-segmented-control>
      <sp-segmented-control
        value="a" size="md"
        .options=${[{ value: "a", label: "Medium" }, { value: "b", label: "Options" }, { value: "c", label: "Here" }]}
      ></sp-segmented-control>
      <sp-segmented-control
        value="a" size="lg"
        .options=${[{ value: "a", label: "Large" }, { value: "b", label: "Options" }, { value: "c", label: "Here" }]}
      ></sp-segmented-control>
    </div>
  `,
};

export const WithDisabledOption: Story = {
  render: () => html`
    <sp-segmented-control
      value="view"
      .options=${[
        { value: "view", label: "View" },
        { value: "edit", label: "Edit" },
        { value: "admin", label: "Admin", disabled: true },
      ]}
    ></sp-segmented-control>
  `,
};

export const AllDisabled: Story = {
  args: { disabled: true },
};

export const FullWidth: Story = {
  args: { fullWidth: true },
  render: ({ value, size }) => html`
    <div style="width: 400px;">
      <sp-segmented-control
        value=${value ?? "left"}
        size=${size ?? "md"}
        full-width
        .options=${[
          { value: "left", label: "Left" },
          { value: "center", label: "Center" },
          { value: "right", label: "Right" },
        ]}
      ></sp-segmented-control>
    </div>
  `,
};

export const ViewToggle: Story = {
  render: () => html`
    <sp-segmented-control
      value="grid"
      .options=${[
        { value: "grid", label: "⊞ Grid" },
        { value: "list", label: "☰ List" },
        { value: "table", label: "⊟ Table" },
      ]}
    ></sp-segmented-control>
  `,
};

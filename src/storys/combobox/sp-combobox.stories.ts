import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import type { SpComboboxProps } from "../../components/combobox/sp-combobox.types.js";
import "../../components/combobox/sp-combobox.js";

const FRUIT_OPTIONS = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "cherry", label: "Cherry" },
  { value: "grape", label: "Grape" },
  { value: "mango", label: "Mango" },
  { value: "orange", label: "Orange" },
  { value: "peach", label: "Peach" },
  { value: "pear", label: "Pear" },
];

const meta: Meta<SpComboboxProps> = {
  title: "Components/Combobox",
  component: "sp-combobox",
  tags: ["autodocs"],
  argTypes: {
    value: { control: "text", description: "Currently selected value" },
    placeholder: { control: "text", description: "Input placeholder" },
    disabled: { control: "boolean", description: "Disables the component" },
    required: { control: "boolean", description: "Marks field as required" },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Size of the combobox",
    },
    clearable: { control: "boolean", description: "Shows clear button when value is set" },
    error: { control: "text", description: "Error message" },
    hint: { control: "text", description: "Hint message" },
    label: { control: "text", description: "Label text" },
    noResultsText: { control: "text", description: "Text when no options match" },
  },
  args: {
    value: "",
    placeholder: "Search...",
    disabled: false,
    required: false,
    size: "md",
    clearable: false,
    error: "",
    hint: "",
    label: "",
    noResultsText: "No results found",
  },
  render: ({ value, placeholder, disabled, required, size, clearable, error, hint, label, noResultsText }) => html`
    <sp-combobox
      .value=${value}
      .options=${FRUIT_OPTIONS}
      placeholder=${placeholder}
      ?disabled=${disabled}
      ?required=${required}
      size=${size}
      ?clearable=${clearable}
      error=${error}
      hint=${hint}
      label=${label}
      no-results-text=${noResultsText}
      style="max-width: 320px;"
    ></sp-combobox>
  `,
};

export default meta;
type Story = StoryObj<SpComboboxProps>;

export const Default: Story = {
  render: () => html`
    <sp-combobox
      .options=${FRUIT_OPTIONS}
      placeholder="Search fruits..."
      style="max-width: 320px;"
    ></sp-combobox>
  `,
};

export const WithLabel: Story = {
  render: () => html`
    <sp-combobox
      .options=${FRUIT_OPTIONS}
      label="Favourite fruit"
      placeholder="Search..."
      style="max-width: 320px;"
    ></sp-combobox>
  `,
};

export const WithError: Story = {
  render: () => html`
    <sp-combobox
      .options=${FRUIT_OPTIONS}
      label="Fruit"
      error="Please select a fruit"
      placeholder="Search..."
      style="max-width: 320px;"
    ></sp-combobox>
  `,
};

export const WithClearable: Story = {
  render: () => html`
    <sp-combobox
      .options=${FRUIT_OPTIONS}
      value="banana"
      clearable
      label="Fruit"
      style="max-width: 320px;"
    ></sp-combobox>
  `,
};

export const WithDisabledOptions: Story = {
  render: () => html`
    <sp-combobox
      .options=${[
        { value: "apple", label: "Apple" },
        { value: "banana", label: "Banana", disabled: true },
        { value: "cherry", label: "Cherry" },
        { value: "grape", label: "Grape", disabled: true },
        { value: "mango", label: "Mango" },
      ]}
      label="Fruit (some disabled)"
      placeholder="Search..."
      style="max-width: 320px;"
    ></sp-combobox>
  `,
};

export const Sizes: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 16px; max-width: 320px;">
      <sp-combobox .options=${FRUIT_OPTIONS} size="sm" placeholder="Small"></sp-combobox>
      <sp-combobox .options=${FRUIT_OPTIONS} size="md" placeholder="Medium"></sp-combobox>
      <sp-combobox .options=${FRUIT_OPTIONS} size="lg" placeholder="Large"></sp-combobox>
    </div>
  `,
};

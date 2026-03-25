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
  { value: "pineapple", label: "Pineapple" },
  { value: "strawberry", label: "Strawberry" },
];

const meta: Meta<SpComboboxProps> = {
  title: "Components/Combobox",
  component: "sp-combobox",
  tags: ["autodocs"],
  argTypes: {
    value: { control: "text", description: "Selected value (single mode)" },
    placeholder: { control: "text", description: "Input placeholder" },
    disabled: { control: "boolean", description: "Disables the component" },
    required: { control: "boolean", description: "Marks field as required" },
    size: { control: "select", options: ["sm", "md", "lg"], description: "Size" },
    clearable: { control: "boolean", description: "Shows clear button when value is set" },
    multiple: { control: "boolean", description: "Enables multiple selection" },
    maxSelections: { control: "number", description: "Max selections (0 = unlimited)" },
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
    multiple: false,
    maxSelections: 0,
    error: "",
    hint: "",
    label: "Fruit",
    noResultsText: "No results found",
  },
  render: (args) => html`
    <sp-combobox
      .value=${args.value}
      .options=${FRUIT_OPTIONS}
      placeholder=${args.placeholder}
      ?disabled=${args.disabled}
      ?required=${args.required}
      size=${args.size}
      ?clearable=${args.clearable}
      ?multiple=${args.multiple}
      max-selections=${args.maxSelections}
      error=${args.error}
      hint=${args.hint}
      label=${args.label}
      no-results-text=${args.noResultsText}
      style="max-width: 360px; display: block;"
    ></sp-combobox>
  `,
};

export default meta;
type Story = StoryObj<SpComboboxProps>;

/* ───────────── Single selection ───────────── */

export const Default: Story = {
  name: "Single — Default",
  render: () => html`
    <sp-combobox
      .options=${FRUIT_OPTIONS}
      label="Fruit"
      placeholder="Search fruits..."
      style="max-width: 360px; display: block;"
    ></sp-combobox>
  `,
};

export const WithPreselectedValue: Story = {
  name: "Single — Pre-selected value",
  render: () => html`
    <sp-combobox
      .options=${FRUIT_OPTIONS}
      value="mango"
      label="Fruit"
      clearable
      style="max-width: 360px; display: block;"
    ></sp-combobox>
  `,
};

export const WithError: Story = {
  name: "Single — With error",
  render: () => html`
    <sp-combobox
      .options=${FRUIT_OPTIONS}
      label="Fruit"
      error="Please select a fruit"
      placeholder="Search..."
      style="max-width: 360px; display: block;"
    ></sp-combobox>
  `,
};

export const WithHint: Story = {
  name: "Single — With hint",
  render: () => html`
    <sp-combobox
      .options=${FRUIT_OPTIONS}
      label="Fruit"
      hint="Type to filter the list"
      placeholder="Search..."
      style="max-width: 360px; display: block;"
    ></sp-combobox>
  `,
};

export const WithDisabledOptions: Story = {
  name: "Single — Disabled options",
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
      style="max-width: 360px; display: block;"
    ></sp-combobox>
  `,
};

export const Disabled: Story = {
  name: "Single — Disabled",
  render: () => html`
    <sp-combobox
      .options=${FRUIT_OPTIONS}
      label="Fruit"
      value="banana"
      disabled
      style="max-width: 360px; display: block;"
    ></sp-combobox>
  `,
};

export const Sizes: Story = {
  name: "Single — Sizes",
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 16px; max-width: 360px;">
      <sp-combobox .options=${FRUIT_OPTIONS} size="sm" label="Small" placeholder="Small combobox"></sp-combobox>
      <sp-combobox .options=${FRUIT_OPTIONS} size="md" label="Medium" placeholder="Medium combobox"></sp-combobox>
      <sp-combobox .options=${FRUIT_OPTIONS} size="lg" label="Large" placeholder="Large combobox"></sp-combobox>
    </div>
  `,
};

/* ───────────── Multiple selection ───────────── */

export const MultipleDefault: Story = {
  name: "Multiple — Default",
  render: () => html`
    <sp-combobox
      .options=${FRUIT_OPTIONS}
      label="Favourite fruits"
      placeholder="Search and select..."
      multiple
      clearable
      style="max-width: 420px; display: block;"
    ></sp-combobox>
  `,
};

export const MultiplePreselected: Story = {
  name: "Multiple — Pre-selected values",
  render: () => html`
    <sp-combobox
      .options=${FRUIT_OPTIONS}
      .values=${["apple", "mango", "strawberry"]}
      label="Favourite fruits"
      multiple
      clearable
      style="max-width: 420px; display: block;"
    ></sp-combobox>
  `,
};

export const MultipleMaxSelections: Story = {
  name: "Multiple — Max 3 selections",
  render: () => html`
    <sp-combobox
      .options=${FRUIT_OPTIONS}
      label="Choose up to 3 fruits"
      hint="Maximum 3 fruits allowed"
      placeholder="Search and select..."
      multiple
      max-selections="3"
      clearable
      style="max-width: 420px; display: block;"
    ></sp-combobox>
  `,
};

export const MultipleWithError: Story = {
  name: "Multiple — With error",
  render: () => html`
    <sp-combobox
      .options=${FRUIT_OPTIONS}
      label="Fruits"
      error="Please select at least one fruit"
      placeholder="Search and select..."
      multiple
      style="max-width: 420px; display: block;"
    ></sp-combobox>
  `,
};

export const MultipleSizes: Story = {
  name: "Multiple — Sizes",
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 20px; max-width: 420px;">
      <sp-combobox .options=${FRUIT_OPTIONS} .values=${["apple", "banana"]} size="sm" label="Small" multiple></sp-combobox>
      <sp-combobox .options=${FRUIT_OPTIONS} .values=${["apple", "banana"]} size="md" label="Medium" multiple></sp-combobox>
      <sp-combobox .options=${FRUIT_OPTIONS} .values=${["apple", "banana"]} size="lg" label="Large" multiple></sp-combobox>
    </div>
  `,
};

export const MultipleEventHandling: Story = {
  name: "Multiple — Event handling",
  render: () => {
    const onChange = (e: Event) => {
      const out = document.getElementById("combo-output");
      if (out) out.textContent = JSON.stringify((e as CustomEvent).detail, null, 2);
    };
    return html`
      <div style="display: flex; flex-direction: column; gap: 12px; max-width: 420px;">
        <sp-combobox
          .options=${FRUIT_OPTIONS}
          label="Fruits"
          placeholder="Select fruits..."
          multiple
          clearable
          @sp-change=${onChange}
          style="display: block;"
        ></sp-combobox>
        <pre id="combo-output" style="
          margin: 0; padding: 12px; border-radius: 6px; font-size: 13px;
          background: #f3f4f6; color: #374151; min-height: 48px;
        ">Waiting for selection…</pre>
      </div>
    `;
  },
};

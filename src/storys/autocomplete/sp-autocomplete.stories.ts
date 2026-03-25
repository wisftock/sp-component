import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import type { SpAutocompleteProps } from "../../components/autocomplete/sp-autocomplete.types.js";
import "../../components/autocomplete/sp-autocomplete.js";

const FRUIT_OPTIONS = [
  { value: "apple", label: "Apple", description: "A classic red or green fruit" },
  { value: "banana", label: "Banana", description: "Rich in potassium" },
  { value: "cherry", label: "Cherry", description: "Small and sweet" },
  { value: "grape", label: "Grape", description: "Comes in red or green", disabled: true },
  { value: "mango", label: "Mango", description: "Tropical and sweet" },
  { value: "orange", label: "Orange", description: "High in vitamin C" },
  { value: "peach", label: "Peach", description: "Soft and juicy" },
  { value: "pear", label: "Pear", description: "Mild and sweet" },
  { value: "pineapple", label: "Pineapple", description: "Tropical with a tangy taste" },
  { value: "strawberry", label: "Strawberry", description: "Red and fragrant" },
];

const GROUPED_OPTIONS = [
  { value: "apple", label: "Apple", group: "Common fruits" },
  { value: "banana", label: "Banana", group: "Common fruits" },
  { value: "cherry", label: "Cherry", group: "Common fruits" },
  { value: "mango", label: "Mango", group: "Tropical" },
  { value: "pineapple", label: "Pineapple", group: "Tropical" },
  { value: "coconut", label: "Coconut", group: "Tropical" },
  { value: "blueberry", label: "Blueberry", group: "Berries" },
  { value: "strawberry", label: "Strawberry", group: "Berries" },
  { value: "raspberry", label: "Raspberry", group: "Berries" },
  { value: "blackberry", label: "Blackberry", group: "Berries", disabled: true },
];

const COUNTRY_OPTIONS = [
  { value: "us", label: "United States", group: "Americas" },
  { value: "ca", label: "Canada", group: "Americas" },
  { value: "mx", label: "Mexico", group: "Americas" },
  { value: "br", label: "Brazil", group: "Americas" },
  { value: "gb", label: "United Kingdom", group: "Europe" },
  { value: "de", label: "Germany", group: "Europe" },
  { value: "fr", label: "France", group: "Europe" },
  { value: "es", label: "Spain", group: "Europe" },
  { value: "it", label: "Italy", group: "Europe" },
  { value: "jp", label: "Japan", group: "Asia" },
  { value: "cn", label: "China", group: "Asia" },
  { value: "in", label: "India", group: "Asia" },
  { value: "kr", label: "South Korea", group: "Asia" },
];

const meta: Meta<SpAutocompleteProps> = {
  title: "Components/Autocomplete",
  component: "sp-autocomplete",
  tags: ["autodocs"],
  argTypes: {
    placeholder: { control: "text", description: "Input placeholder" },
    disabled: { control: "boolean", description: "Disables the component" },
    required: { control: "boolean", description: "Marks field as required" },
    size: { control: "select", options: ["sm", "md", "lg"], description: "Size" },
    clearable: { control: "boolean", description: "Shows clear button" },
    multiple: { control: "boolean", description: "Enables multiple selection" },
    maxSelections: { control: "number", description: "Max selections (0 = unlimited)" },
    filterMode: { control: "select", options: ["contains", "startsWith", "none"], description: "Filter mode" },
    loading: { control: "boolean", description: "Shows loading spinner" },
    creatable: { control: "boolean", description: "Allow creating new options" },
    createText: { control: "text", description: "Create option label template" },
    error: { control: "text", description: "Error message" },
    hint: { control: "text", description: "Hint message" },
    label: { control: "text", description: "Label text" },
    noResultsText: { control: "text", description: "Text shown when no options match" },
  },
  args: {
    placeholder: "Search...",
    disabled: false,
    required: false,
    size: "md",
    clearable: false,
    multiple: false,
    maxSelections: 0,
    filterMode: "contains",
    loading: false,
    creatable: false,
    createText: 'Create "{query}"',
    error: "",
    hint: "",
    label: "Fruit",
    noResultsText: "No results found",
  },
  render: (args) => html`
    <sp-autocomplete
      .options=${FRUIT_OPTIONS}
      placeholder=${args.placeholder}
      ?disabled=${args.disabled}
      ?required=${args.required}
      size=${args.size}
      ?clearable=${args.clearable}
      ?multiple=${args.multiple}
      max-selections=${args.maxSelections}
      filter-mode=${args.filterMode}
      ?loading=${args.loading}
      ?creatable=${args.creatable}
      create-text=${args.createText}
      error=${args.error}
      hint=${args.hint}
      label=${args.label}
      no-results-text=${args.noResultsText}
      style="max-width: 380px; display: block;"
    ></sp-autocomplete>
  `,
};

export default meta;
type Story = StoryObj<SpAutocompleteProps>;

/* ───────────── Single selection ───────────── */

export const Default: Story = {
  name: "Single — Default",
  render: () => html`
    <sp-autocomplete
      .options=${FRUIT_OPTIONS}
      label="Fruit"
      placeholder="Search fruits..."
      clearable
      style="max-width: 380px; display: block;"
    ></sp-autocomplete>
  `,
};

export const WithDescriptions: Story = {
  name: "Single — With descriptions",
  render: () => html`
    <sp-autocomplete
      .options=${FRUIT_OPTIONS}
      label="Fruit"
      hint="Each option shows a description"
      placeholder="Search..."
      clearable
      style="max-width: 380px; display: block;"
    ></sp-autocomplete>
  `,
};

export const WithGroups: Story = {
  name: "Single — Grouped options",
  render: () => html`
    <sp-autocomplete
      .options=${GROUPED_OPTIONS}
      label="Fruit"
      placeholder="Search by category..."
      clearable
      style="max-width: 380px; display: block;"
    ></sp-autocomplete>
  `,
};

export const GroupedCountries: Story = {
  name: "Single — Countries by region",
  render: () => html`
    <sp-autocomplete
      .options=${COUNTRY_OPTIONS}
      label="Country"
      placeholder="Search country..."
      clearable
      style="max-width: 380px; display: block;"
    ></sp-autocomplete>
  `,
};

export const FilterStartsWith: Story = {
  name: "Single — Filter: startsWith",
  render: () => html`
    <sp-autocomplete
      .options=${FRUIT_OPTIONS}
      label="Fruit"
      hint='Filter mode: startsWith — try typing "p" or "m"'
      placeholder="Type to filter..."
      filter-mode="startsWith"
      clearable
      style="max-width: 380px; display: block;"
    ></sp-autocomplete>
  `,
};

export const Creatable: Story = {
  name: "Single — Creatable",
  render: () => {
    const onCreate = (e: Event) => {
      const { label } = (e as CustomEvent).detail;
      const out = document.getElementById("create-output");
      if (out) out.textContent = `Created: "${label}"`;
    };
    return html`
      <div style="display: flex; flex-direction: column; gap: 12px; max-width: 380px;">
        <sp-autocomplete
          .options=${FRUIT_OPTIONS}
          label="Fruit"
          hint='Type a name not in the list and select "Create"'
          placeholder="Search or create..."
          creatable
          clearable
          @sp-create=${onCreate}
          style="display: block;"
        ></sp-autocomplete>
        <div id="create-output" style="
          padding: 10px 14px; border-radius: 6px; font-size: 13px;
          background: #F6FFED; color: #389E0D; border: 1px solid #D9F7BE; min-height: 36px;
        ">No option created yet</div>
      </div>
    `;
  },
};

export const Loading: Story = {
  name: "Single — Loading state",
  render: () => html`
    <sp-autocomplete
      .options=${[]}
      label="Async search"
      hint="Simulates fetching results from a server"
      placeholder="Type to search..."
      loading
      filter-mode="none"
      style="max-width: 380px; display: block;"
    ></sp-autocomplete>
  `,
};

export const AsyncSearch: Story = {
  name: "Single — Async search simulation",
  render: () => {
    let timer: ReturnType<typeof setTimeout> | null = null;
    const ALL = [...FRUIT_OPTIONS];
    const onSearch = (e: Event) => {
      const el = e.currentTarget as HTMLElement & { loading: boolean; options: typeof ALL };
      const { query } = (e as CustomEvent).detail as { query: string };
      el.loading = true;
      el.options = [];
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        el.loading = false;
        el.options = ALL.filter(o => o.label.toLowerCase().includes(query.toLowerCase()));
      }, 600);
    };
    return html`
      <sp-autocomplete
        .options=${ALL}
        label="Fruit (async)"
        hint="Results load after 600ms"
        placeholder="Type to search..."
        filter-mode="none"
        debounce="300"
        clearable
        @sp-search=${onSearch}
        style="max-width: 380px; display: block;"
      ></sp-autocomplete>
    `;
  },
};

export const WithError: Story = {
  name: "Single — With error",
  render: () => html`
    <sp-autocomplete
      .options=${FRUIT_OPTIONS}
      label="Fruit"
      error="Please select a valid option"
      placeholder="Search..."
      style="max-width: 380px; display: block;"
    ></sp-autocomplete>
  `,
};

export const Disabled: Story = {
  name: "Single — Disabled",
  render: () => html`
    <sp-autocomplete
      .options=${FRUIT_OPTIONS}
      label="Fruit"
      value="mango"
      disabled
      style="max-width: 380px; display: block;"
    ></sp-autocomplete>
  `,
};

export const Sizes: Story = {
  name: "Single — Sizes",
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 16px; max-width: 380px;">
      <sp-autocomplete .options=${FRUIT_OPTIONS} size="sm" label="Small" placeholder="Small"></sp-autocomplete>
      <sp-autocomplete .options=${FRUIT_OPTIONS} size="md" label="Medium" placeholder="Medium"></sp-autocomplete>
      <sp-autocomplete .options=${FRUIT_OPTIONS} size="lg" label="Large" placeholder="Large"></sp-autocomplete>
    </div>
  `,
};

/* ───────────── Multiple selection ───────────── */

export const MultipleDefault: Story = {
  name: "Multiple — Default",
  render: () => html`
    <sp-autocomplete
      .options=${FRUIT_OPTIONS}
      label="Favourite fruits"
      hint="Search and select multiple. Backspace removes the last tag."
      placeholder="Search and select..."
      multiple
      clearable
      style="max-width: 440px; display: block;"
    ></sp-autocomplete>
  `,
};

export const MultiplePreselected: Story = {
  name: "Multiple — Pre-selected values",
  render: () => html`
    <sp-autocomplete
      .options=${FRUIT_OPTIONS}
      .values=${["apple", "mango", "strawberry"]}
      label="Favourite fruits"
      multiple
      clearable
      style="max-width: 440px; display: block;"
    ></sp-autocomplete>
  `,
};

export const MultipleGrouped: Story = {
  name: "Multiple — Grouped options",
  render: () => html`
    <sp-autocomplete
      .options=${GROUPED_OPTIONS}
      label="Fruits by category"
      placeholder="Search by category..."
      multiple
      clearable
      style="max-width: 440px; display: block;"
    ></sp-autocomplete>
  `,
};

export const MultipleMaxSelections: Story = {
  name: "Multiple — Max 3 selections",
  render: () => html`
    <sp-autocomplete
      .options=${FRUIT_OPTIONS}
      label="Choose up to 3 fruits"
      hint="Maximum 3 selections allowed"
      placeholder="Search and select..."
      multiple
      max-selections="3"
      clearable
      style="max-width: 440px; display: block;"
    ></sp-autocomplete>
  `,
};

export const MultipleCreatable: Story = {
  name: "Multiple — Creatable tags",
  render: () => {
    const options = [...FRUIT_OPTIONS];
    const onCreate = (e: Event) => {
      const { label } = (e as CustomEvent).detail as { label: string };
      const newOpt = { value: label.toLowerCase().replace(/\s+/g, "-"), label, description: "Custom option" };
      options.push(newOpt);
      const el = e.currentTarget as HTMLElement & { options: typeof options };
      el.options = [...options];
    };
    return html`
      <sp-autocomplete
        .options=${options}
        label="Tags"
        hint="Type a new tag and select 'Create' to add it"
        placeholder="Search or create tags..."
        multiple
        creatable
        clearable
        @sp-create=${onCreate}
        style="max-width: 440px; display: block;"
      ></sp-autocomplete>
    `;
  },
};

export const MultipleCountries: Story = {
  name: "Multiple — Countries",
  render: () => html`
    <sp-autocomplete
      .options=${COUNTRY_OPTIONS}
      label="Countries"
      hint="Select one or more countries"
      placeholder="Search country..."
      multiple
      clearable
      style="max-width: 440px; display: block;"
    ></sp-autocomplete>
  `,
};

export const MultipleWithError: Story = {
  name: "Multiple — With error",
  render: () => html`
    <sp-autocomplete
      .options=${FRUIT_OPTIONS}
      label="Fruits"
      error="Please select at least one fruit"
      placeholder="Search and select..."
      multiple
      style="max-width: 440px; display: block;"
    ></sp-autocomplete>
  `,
};

export const MultipleEventHandling: Story = {
  name: "Multiple — Event handling",
  render: () => {
    const onChange = (e: Event) => {
      const out = document.getElementById("ac-output");
      if (out) out.textContent = JSON.stringify((e as CustomEvent).detail, null, 2);
    };
    return html`
      <div style="display: flex; flex-direction: column; gap: 12px; max-width: 440px;">
        <sp-autocomplete
          .options=${FRUIT_OPTIONS}
          label="Fruits"
          placeholder="Select fruits..."
          multiple
          clearable
          @sp-change=${onChange}
          style="display: block;"
        ></sp-autocomplete>
        <pre id="ac-output" style="
          margin: 0; padding: 12px; border-radius: 6px; font-size: 13px;
          background: #f3f4f6; color: #374151; min-height: 48px;
        ">Waiting for selection…</pre>
      </div>
    `;
  },
};

export const MultipleSizes: Story = {
  name: "Multiple — Sizes",
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 20px; max-width: 440px;">
      <sp-autocomplete .options=${FRUIT_OPTIONS} .values=${["apple", "banana"]} size="sm" label="Small" multiple></sp-autocomplete>
      <sp-autocomplete .options=${FRUIT_OPTIONS} .values=${["apple", "banana"]} size="md" label="Medium" multiple></sp-autocomplete>
      <sp-autocomplete .options=${FRUIT_OPTIONS} .values=${["apple", "banana"]} size="lg" label="Large" multiple></sp-autocomplete>
    </div>
  `,
};

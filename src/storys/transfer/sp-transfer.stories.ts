import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "../../components/transfer/sp-transfer.js";

const ITEMS = [
  { value: "apple",  label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "cherry", label: "Cherry" },
  { value: "date",   label: "Date" },
  { value: "elderberry", label: "Elderberry" },
  { value: "fig",    label: "Fig" },
  { value: "grape",  label: "Grape" },
  { value: "honeydew", label: "Honeydew", disabled: true },
];

const meta: Meta = {
  title: "Components/Transfer",
  component: "sp-transfer",
  tags: ["autodocs"],
  argTypes: {
    sourceTitle: { control: "text",    description: "Header label for the left (source) panel" },
    targetTitle: { control: "text",    description: "Header label for the right (target) panel" },
    searchable:  { control: "boolean", description: "Shows a search input in each panel for filtering items" },
    disabled:    { control: "boolean", description: "Disables all interactions including drag & drop" },
  },
  args: {
    sourceTitle: "Available",
    targetTitle: "Selected",
    searchable: true,
    disabled: false,
  },
  render: ({ sourceTitle, targetTitle, searchable, disabled }) => {
    const el = document.createElement("sp-transfer") as HTMLElement & {
      source: typeof ITEMS; value: string[];
    };
    el.setAttribute("source-title", sourceTitle as string);
    el.setAttribute("target-title", targetTitle as string);
    if (searchable) el.setAttribute("searchable", "");
    if (disabled) el.setAttribute("disabled", "");
    el.source = ITEMS;
    el.value = [];
    return el;
  },
};
export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const WithPreselected: Story = {
  name: "With preselected items",
  render: () => {
    const el = document.createElement("sp-transfer") as HTMLElement & {
      source: typeof ITEMS; value: string[];
    };
    el.source = ITEMS;
    el.value = ["apple", "cherry", "fig"];
    return el;
  },
};

export const NoSearch: Story = {
  name: "Without search",
  render: () => {
    const el = document.createElement("sp-transfer") as HTMLElement & {
      source: typeof ITEMS; value: string[];
    };
    el.source = ITEMS;
    el.value = [];
    return el;
  },
};

export const EventLog: Story = {
  name: "Event Log (sp-change)",
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:16px;">
      <sp-transfer
        source-title="Fruits"
        target-title="Basket"
        .source=${ITEMS}
        .value=${[]}
        @sp-change=${(e: CustomEvent) => {
          const out = document.getElementById("transfer-log");
          if (out) out.textContent = "value: " + JSON.stringify(e.detail.value);
        }}
      ></sp-transfer>
      <code id="transfer-log" style="font-size:0.8rem;color:#6366f1;">— move items to see event —</code>
    </div>
  `,
};

import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "../../components/search-input/sp-search-input.js";

const meta: Meta = {
  title: "Components/SearchInput",
  component: "sp-search-input",
  tags: ["autodocs"],
  argTypes: {
    placeholder: { control: "text" },
    debounce: { control: "number", description: "Tiempo de debounce en ms" },
    loading: { control: "boolean" },
    clearable: { control: "boolean" },
    disabled: { control: "boolean" },
    size: { control: "select", options: ["sm","md","lg"] },
    value: { control: "text" },
  },
  args: { placeholder: "Buscar...", debounce: 300, loading: false, clearable: true, disabled: false, size: "md", value: "" },
  render: ({ placeholder, debounce, loading, clearable, disabled, size, value }) => html`
    <sp-search-input
      placeholder=${placeholder}
      debounce=${debounce}
      ?loading=${loading}
      ?clearable=${clearable}
      ?disabled=${disabled}
      size=${size}
      value=${value}
      style="width:300px;"
    ></sp-search-input>
  `,
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
export const WithValue: Story = { args: { value: "componentes" } };
export const Loading: Story = { args: { loading: true } };
export const Disabled: Story = { args: { disabled: true } };
export const Small: Story = { args: { size: "sm" } };
export const Large: Story = { args: { size: "lg" } };

export const AllSizes: Story = {
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:12px;">
      <sp-search-input placeholder="Small" size="sm" style="width:280px;"></sp-search-input>
      <sp-search-input placeholder="Medium" size="md" style="width:280px;"></sp-search-input>
      <sp-search-input placeholder="Large" size="lg" style="width:280px;"></sp-search-input>
    </div>
  `,
};

export const InNavbar: Story = {
  render: () => html`
    <div style="background:#1e293b;padding:12px 24px;border-radius:8px;display:flex;align-items:center;gap:16px;">
      <span style="color:white;font-weight:600;font-size:16px;">Mi App</span>
      <sp-search-input
        placeholder="Buscar en la app..."
        style="width:280px;--sp-bg:rgba(255,255,255,0.1);--sp-border:#475569;--sp-text:white;"
      ></sp-search-input>
    </div>
  `,
};

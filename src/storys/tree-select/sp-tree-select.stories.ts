import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "../../components/tree-select/sp-tree-select.js";

const FILE_TREE = [
  {
    value: "src", label: "src", children: [
      {
        value: "components", label: "components", children: [
          { value: "button", label: "button" },
          { value: "input", label: "input" },
          { value: "modal", label: "modal" },
        ],
      },
      { value: "utils", label: "utils" },
      { value: "types", label: "types" },
    ],
  },
  {
    value: "public", label: "public", children: [
      { value: "images", label: "images" },
      { value: "fonts", label: "fonts" },
    ],
  },
  { value: "package", label: "package.json" },
];

const ORG_TREE = [
  {
    value: "company", label: "Empresa", children: [
      {
        value: "tech", label: "Tecnología", children: [
          { value: "frontend", label: "Frontend" },
          { value: "backend", label: "Backend" },
          { value: "devops", label: "DevOps" },
        ],
      },
      {
        value: "product", label: "Producto", children: [
          { value: "design", label: "Diseño" },
          { value: "research", label: "UX Research" },
        ],
      },
      { value: "marketing", label: "Marketing" },
    ],
  },
];

const meta: Meta = {
  title: "Components/TreeSelect",
  component: "sp-tree-select",
  tags: ["autodocs"],
  argTypes: {
    placeholder: { control: "text" },
    multiple: { control: "boolean" },
    searchable: { control: "boolean" },
    disabled: { control: "boolean" },
    value: { control: "text" },
  },
  args: { placeholder: "Seleccionar...", multiple: false, searchable: true, disabled: false, value: "" },
  render: ({ placeholder, multiple, searchable, disabled }) => html`
    <sp-tree-select
      .options=${ORG_TREE}
      placeholder=${placeholder}
      ?multiple=${multiple}
      ?searchable=${searchable}
      ?disabled=${disabled}
      style="width:280px;"
    ></sp-tree-select>
  `,
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
export const Multiple: Story = { args: { multiple: true } };
export const NotSearchable: Story = { args: { searchable: false } };
export const Disabled: Story = { args: { disabled: true } };

export const FileExplorer: Story = {
  render: () => html`
    <sp-tree-select
      .options=${FILE_TREE}
      placeholder="Seleccionar archivo o carpeta"
      searchable
      style="width:300px;"
    ></sp-tree-select>
  `,
};

export const MultipleSelection: Story = {
  render: () => html`
    <sp-tree-select
      .options=${ORG_TREE}
      placeholder="Seleccionar departamentos"
      multiple
      searchable
      style="width:300px;"
    ></sp-tree-select>
  `,
};

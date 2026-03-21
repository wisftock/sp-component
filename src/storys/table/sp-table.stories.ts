import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import type { SpTableProps } from "../../components/table/sp-table.types.js";
import "../../components/table/sp-table.js";

const SAMPLE_COLUMNS = [
  { key: "name", label: "Name", sortable: true, width: "200px" },
  { key: "role", label: "Role", sortable: true },
  { key: "department", label: "Department" },
  { key: "status", label: "Status", align: "center" as const },
];

const SAMPLE_DATA = [
  { name: "Alice Johnson", role: "Engineer", department: "Engineering", status: "Active" },
  { name: "Bob Smith", role: "Designer", department: "Design", status: "Active" },
  { name: "Carol White", role: "Manager", department: "Product", status: "Inactive" },
  { name: "David Brown", role: "Engineer", department: "Engineering", status: "Active" },
  { name: "Eva Martinez", role: "Analyst", department: "Data", status: "Active" },
];

const meta: Meta<SpTableProps> = {
  title: "Components/Table",
  component: "sp-table",
  tags: ["autodocs"],
  argTypes: {
    loading: { control: "boolean" },
    bordered: { control: "boolean" },
    striped: { control: "boolean" },
    hoverable: { control: "boolean" },
    compact: { control: "boolean" },
    emptyText: { control: "text" },
  },
  args: {
    loading: false,
    bordered: false,
    striped: false,
    hoverable: true,
    compact: false,
    emptyText: "No data available",
  },
};

export default meta;
type Story = StoryObj<SpTableProps>;

export const Default: Story = {
  render: () => html`
    <sp-table
      .columns=${SAMPLE_COLUMNS}
      .data=${SAMPLE_DATA}
    ></sp-table>
  `,
};

export const Sortable: Story = {
  render: () => html`
    <sp-table
      .columns=${SAMPLE_COLUMNS}
      .data=${SAMPLE_DATA}
      hoverable
    ></sp-table>
  `,
};

export const Striped: Story = {
  render: () => html`
    <sp-table
      .columns=${SAMPLE_COLUMNS}
      .data=${SAMPLE_DATA}
      striped
    ></sp-table>
  `,
};

export const Bordered: Story = {
  render: () => html`
    <sp-table
      .columns=${SAMPLE_COLUMNS}
      .data=${SAMPLE_DATA}
      bordered
    ></sp-table>
  `,
};

export const Compact: Story = {
  render: () => html`
    <sp-table
      .columns=${SAMPLE_COLUMNS}
      .data=${SAMPLE_DATA}
      compact
    ></sp-table>
  `,
};

export const Loading: Story = {
  render: () => html`
    <sp-table
      .columns=${SAMPLE_COLUMNS}
      .data=${SAMPLE_DATA}
      loading
    ></sp-table>
  `,
};

export const EmptyState: Story = {
  render: () => html`
    <sp-table
      .columns=${SAMPLE_COLUMNS}
      .data=${[]}
      emptyText="No records found. Try adjusting your filters."
    ></sp-table>
  `,
};

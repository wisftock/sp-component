import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import type { SpTableProps } from "../../components/table/sp-table.types.js";
import "../../components/table/sp-table.js";

const SAMPLE_COLUMNS = [
  { key: "name",   label: "Name",       sortable: true, filterable: true, width: "180px" },
  { key: "role",   label: "Role",       sortable: true, filterable: true },
  { key: "dept",   label: "Department", sortable: true, filterable: true },
  { key: "status", label: "Status",     sortable: true, filterable: true, align: "center" as const },
  { key: "score",  label: "Score",      sortable: true, align: "right" as const,
    render: (v: unknown) => `${v}/100` },
];

const SAMPLE_DATA = [
  { name: "Alice Johnson",  role: "Engineer",  dept: "Engineering", status: "Active",   score: 95 },
  { name: "Bob Smith",      role: "Designer",  dept: "Design",      status: "Active",   score: 82 },
  { name: "Carol White",    role: "Manager",   dept: "Product",     status: "Inactive", score: 68 },
  { name: "David Brown",    role: "Engineer",  dept: "Engineering", status: "Active",   score: 90 },
  { name: "Eva Martinez",   role: "Analyst",   dept: "Data",        status: "Pending",  score: 74 },
  { name: "Frank Castle",   role: "Designer",  dept: "Design",      status: "Active",   score: 88 },
  { name: "Grace Hopper",   role: "Engineer",  dept: "Engineering", status: "Active",   score: 99 },
  { name: "Henry Ford",     role: "Manager",   dept: "Product",     status: "Inactive", score: 55 },
];

const SAMPLE_ACTIONS = [
  {
    label: "Edit",
    icon: "✏️",
    variant: "ghost" as const,
    onClick: (row: Record<string, unknown>) => alert(`Edit: ${row.name}`),
  },
  {
    label: "Delete",
    icon: "🗑",
    variant: "destructive" as const,
    onClick: (row: Record<string, unknown>) => alert(`Delete: ${row.name}`),
  },
];

const meta: Meta<SpTableProps> = {
  title: "Components/Table",
  component: "sp-table",
  tags: ["autodocs"],
  argTypes: {
    loading:      { control: "boolean", description: "Shows a loading overlay with a spinner on the table body" },
    bordered:     { control: "boolean", description: "Adds borders between cells" },
    striped:      { control: "boolean", description: "Alternates row background colors for readability" },
    hoverable:    { control: "boolean", description: "Highlights row on mouse hover" },
    compact:      { control: "boolean", description: "Reduces row height and padding for dense data" },
    selectable:   { control: "boolean", description: "Adds a checkbox column for row selection" },
    reorderable:  { control: "boolean", description: "Enables drag-and-drop row reordering" },
    searchable:   { control: "boolean", description: "Shows a global search bar above the table" },
    stickyHeader: { control: "boolean", description: "Keeps the header row visible while scrolling" },
    pageSize:     { control: "number",  description: "Number of rows per page (enables pagination)" },
    emptyText:    { control: "text",    description: "Message shown when the table has no data" },
    caption:      { control: "text",    description: "Accessible caption rendered above the table" },
  },
  args: {
    loading:      false,
    bordered:     false,
    striped:      false,
    hoverable:    true,
    compact:      false,
    selectable:   false,
    reorderable:  false,
    searchable:   false,
    stickyHeader: false,
    pageSize:     0,
    emptyText:    "No data available",
    caption:      "",
  },
};

export default meta;
type Story = StoryObj<SpTableProps>;

// ── Basic ──────────────────────────────────────────────────────────────
export const Default: Story = {
  render: () => html`
    <sp-table
      .columns=${SAMPLE_COLUMNS}
      .data=${SAMPLE_DATA}
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

// ── Search & Filter ───────────────────────────────────────────────────
export const GlobalSearch: Story = {
  name: "Global Search",
  render: () => html`
    <sp-table
      .columns=${SAMPLE_COLUMNS}
      .data=${SAMPLE_DATA}
      searchable
    ></sp-table>
  `,
};

export const ColumnFilters: Story = {
  name: "Column Filters",
  render: () => html`
    <sp-table
      .columns=${SAMPLE_COLUMNS}
      .data=${SAMPLE_DATA}
    ></sp-table>
  `,
};

export const SearchAndFilters: Story = {
  name: "Search + Column Filters",
  render: () => html`
    <sp-table
      .columns=${SAMPLE_COLUMNS}
      .data=${SAMPLE_DATA}
      searchable
      striped
    ></sp-table>
  `,
};

// ── Sorting ───────────────────────────────────────────────────────────
export const Sortable: Story = {
  render: () => html`
    <sp-table
      .columns=${SAMPLE_COLUMNS}
      .data=${SAMPLE_DATA}
      hoverable
    ></sp-table>
  `,
};

// ── Column reorder ────────────────────────────────────────────────────
export const Reorderable: Story = {
  name: "Column Reorder (Drag & Drop)",
  render: () => html`
    <p style="font-size:13px;color:#6b7280;margin-bottom:12px;">
      Drag the <strong>⋮⋮</strong> handle on any column header to reorder columns.
    </p>
    <sp-table
      .columns=${SAMPLE_COLUMNS}
      .data=${SAMPLE_DATA}
      reorderable
      hoverable
    ></sp-table>
  `,
};

// ── Pagination ────────────────────────────────────────────────────────
export const Pagination: Story = {
  name: "Pagination",
  render: () => html`
    <sp-table
      .columns=${SAMPLE_COLUMNS}
      .data=${SAMPLE_DATA}
      page-size="3"
      striped
    ></sp-table>
  `,
};

// ── Row selection ─────────────────────────────────────────────────────
export const Selectable: Story = {
  name: "Row Selection",
  render: () => html`
    <sp-table
      .columns=${SAMPLE_COLUMNS}
      .data=${SAMPLE_DATA}
      selectable
      hoverable
    ></sp-table>
  `,
};

// ── Row actions ───────────────────────────────────────────────────────
export const RowActions: Story = {
  name: "Row Actions",
  render: () => html`
    <sp-table
      .columns=${SAMPLE_COLUMNS}
      .data=${SAMPLE_DATA}
      .actions=${SAMPLE_ACTIONS}
      hoverable
    ></sp-table>
  `,
};

// ── Caption ───────────────────────────────────────────────────────────
export const WithCaption: Story = {
  name: "With Caption",
  render: () => html`
    <sp-table
      .columns=${SAMPLE_COLUMNS}
      .data=${SAMPLE_DATA}
      caption="Team Members"
      bordered
    ></sp-table>
  `,
};

// ── Sticky header ─────────────────────────────────────────────────────
export const StickyHeader: Story = {
  name: "Sticky Header",
  render: () => html`
    <div style="height:260px;overflow:auto;">
      <sp-table
        .columns=${SAMPLE_COLUMNS}
        .data=${SAMPLE_DATA}
        sticky-header
        striped
      ></sp-table>
    </div>
  `,
};

// ── Full featured ─────────────────────────────────────────────────────
export const FullFeatured: Story = {
  name: "Full Featured",
  render: () => html`
    <sp-table
      .columns=${SAMPLE_COLUMNS}
      .data=${SAMPLE_DATA}
      .actions=${SAMPLE_ACTIONS}
      searchable
      reorderable
      selectable
      striped
      page-size="5"
      caption="Team Overview"
    ></sp-table>
  `,
};

// ── Virtual Scrolling ─────────────────────────────────────────────────
const VIRTUAL_DATA = Array.from({ length: 500 }, (_, i) => ({
  id: i + 1,
  name: `User ${i + 1}`,
  role: ["Engineer", "Designer", "Manager", "Analyst"][i % 4],
  dept: ["Engineering", "Design", "Product", "Data"][i % 4],
  status: ["Active", "Inactive", "Pending"][i % 3],
  score: Math.round(50 + (i % 50)),
}));

const VIRTUAL_COLUMNS = [
  { key: "id",     label: "ID",         sortable: true, width: "80px", align: "right" as const },
  { key: "name",   label: "Name",       sortable: true, filterable: true },
  { key: "role",   label: "Role",       sortable: true, filterable: true },
  { key: "dept",   label: "Department", sortable: true, filterable: true },
  { key: "status", label: "Status",     sortable: true, filterable: true, align: "center" as const },
  { key: "score",  label: "Score",      sortable: true, align: "right" as const,
    render: (v: unknown) => `${v}/100` },
];

export const VirtualScrolling: Story = {
  name: "Virtual Scrolling (500 rows)",
  render: () => html`
    <p style="font-size:13px;color:#6b7280;margin-bottom:12px;">
      Virtual scrolling renders only the visible rows. This example has <strong>500 rows</strong>
      but only a small subset is in the DOM at any time.
    </p>
    <sp-table
      .columns=${VIRTUAL_COLUMNS}
      .data=${VIRTUAL_DATA}
      virtual
      max-height="400px"
      row-height="48"
      searchable
      striped
      hoverable
    ></sp-table>
  `,
};

// ── Page Size Selector ────────────────────────────────────────────────
const LARGE_DATA = Array.from({ length: 50 }, (_, i) => ({
  name: `Person ${i + 1}`,
  role: ["Engineer", "Designer", "Manager", "Analyst"][i % 4],
  dept: ["Engineering", "Design", "Product", "Data"][i % 4],
  status: ["Active", "Inactive", "Pending"][i % 3],
  score: Math.round(60 + (i % 40)),
}));

export const PageSizeSelector: Story = {
  name: "Page Size Selector",
  render: () => html`
    <p style="font-size:13px;color:#6b7280;margin-bottom:12px;">
      When <code>pageSize</code> is set and <code>pageSizeOptions</code> has more than one option,
      a "Rows:" selector appears in the toolbar.
    </p>
    <sp-table
      .columns=${SAMPLE_COLUMNS}
      .data=${LARGE_DATA}
      .pageSizeOptions=${[5, 10, 25, 50]}
      page-size="10"
      searchable
      striped
      hoverable
    ></sp-table>
  `,
};

// ════════════════════════════════════════════════════════════════════════════
// ── Inline Editing, Column Resize & CSV Export ───────────────────────────
// ════════════════════════════════════════════════════════════════════════════

const EDIT_COLUMNS = [
  { key: "id",     label: "ID",     width: "60px",  sortable: true },
  { key: "name",   label: "Name",   width: "180px", sortable: true, editable: true },
  { key: "email",  label: "Email",  width: "220px", sortable: true },
  { key: "role",   label: "Role",   width: "120px", sortable: true, editable: true },
  { key: "status", label: "Status", width: "100px" },
];

const EDIT_DATA = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  name: ["Alice Johnson", "Bob Smith", "Carlos López", "Diana Chen", "Eva Torres"][i % 5],
  email: `user${i + 1}@example.com`,
  role: ["Admin", "Editor", "Viewer"][i % 3],
  status: ["Active", "Inactive", "Pending"][i % 3],
}));

export const InlineEditAndExport: Story = {
  name: "Inline Editing + CSV Export",
  render: () => html`
    <p style="font-size:13px;color:#6b7280;margin-bottom:12px;">
      Double-click on <strong>Name</strong> or <strong>Role</strong> cells to edit inline.
      Drag column borders to resize. Click <strong>CSV</strong> to download.
    </p>
    <sp-table
      title="Users"
      .columns=${EDIT_COLUMNS}
      .data=${EDIT_DATA}
      selectable
      searchable
      exportable
      page-size="10"
      hoverable
    ></sp-table>
  `,
};

export const InlineEditLog: Story = {
  name: "Inline Editing — event log",
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:12px;">
      <p style="margin:0;font-size:0.8rem;color:#6b7280;">Double-click on a <strong>Name</strong> or <strong>Role</strong> cell to edit inline.</p>
      <sp-table
        title="Editable Grid"
        .columns=${EDIT_COLUMNS}
        .data=${[...EDIT_DATA.slice(0, 20)]}
        page-size="8"
        hoverable
        @sp-cell-edit=${(e: CustomEvent) => {
          const out = document.getElementById("edit-log");
          if (out) out.textContent = `Edited "${e.detail.key}" → "${e.detail.value}"`;
        }}
      ></sp-table>
      <code id="edit-log" style="font-size:0.8rem;color:#6366f1;">— double-click a Name or Role cell —</code>
    </div>
  `,
};

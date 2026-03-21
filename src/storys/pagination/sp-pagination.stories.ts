import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import type { SpPaginationProps } from "../../components/pagination/sp-pagination.types.js";
import "../../components/pagination/sp-pagination.js";

const meta: Meta<SpPaginationProps> = {
  title: "Components/Pagination",
  component: "sp-pagination",
  tags: ["autodocs"],
  argTypes: {
    page: {
      control: "number",
      description: "Current page number (1-based)",
    },
    total: {
      control: "number",
      description: "Total number of items",
    },
    pageSize: {
      control: "number",
      description: "Number of items per page",
    },
    siblingCount: {
      control: "number",
      description: "Pages shown on each side of current page",
    },
    disabled: {
      control: "boolean",
      description: "Disables all pagination controls",
    },
  },
  args: {
    page: 1,
    total: 100,
    pageSize: 10,
    siblingCount: 1,
    disabled: false,
  },
  render: ({ page, total, pageSize, siblingCount, disabled }) => html`
    <sp-pagination
      page=${page}
      total=${total}
      pageSize=${pageSize}
      siblingCount=${siblingCount}
      ?disabled=${disabled}
    ></sp-pagination>
  `,
};

export default meta;
type Story = StoryObj<SpPaginationProps>;

export const Default: Story = {
  args: {
    page: 1,
    total: 100,
    pageSize: 10,
  },
};

export const FewPages: Story = {
  args: {
    page: 1,
    total: 30,
    pageSize: 10,
  },
};

export const ManyPages: Story = {
  args: {
    page: 10,
    total: 500,
    pageSize: 10,
  },
};

export const Disabled: Story = {
  args: {
    page: 3,
    total: 100,
    pageSize: 10,
    disabled: true,
  },
};

export const WithPageSizeOptions: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 16px;">
      <div>
        <p style="margin: 0 0 8px; font-size: 14px; color: #6b7280;">10 per page</p>
        <sp-pagination page="1" total="100" pageSize="10"></sp-pagination>
      </div>
      <div>
        <p style="margin: 0 0 8px; font-size: 14px; color: #6b7280;">20 per page</p>
        <sp-pagination page="1" total="100" pageSize="20"></sp-pagination>
      </div>
      <div>
        <p style="margin: 0 0 8px; font-size: 14px; color: #6b7280;">50 per page</p>
        <sp-pagination page="1" total="100" pageSize="50"></sp-pagination>
      </div>
    </div>
  `,
};

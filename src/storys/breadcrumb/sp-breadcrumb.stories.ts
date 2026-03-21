import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import type { SpBreadcrumbProps } from "../../components/breadcrumb/sp-breadcrumb.types.js";
import "../../components/breadcrumb/sp-breadcrumb.js";
import "../../components/breadcrumb/sp-breadcrumb-item.js";

const meta: Meta<SpBreadcrumbProps> = {
  title: "Components/Breadcrumb",
  component: "sp-breadcrumb",
  tags: ["autodocs"],
  argTypes: {
    separator: {
      control: "text",
      description: "Separator character between items",
    },
  },
  args: {
    separator: "/",
  },
  render: ({ separator }) => html`
    <sp-breadcrumb separator=${separator}>
      <sp-breadcrumb-item href="/">Home</sp-breadcrumb-item>
      <sp-breadcrumb-item href="/products">Products</sp-breadcrumb-item>
      <sp-breadcrumb-item>Current Page</sp-breadcrumb-item>
    </sp-breadcrumb>
  `,
};

export default meta;
type Story = StoryObj<SpBreadcrumbProps>;

export const Default: Story = {
  args: {
    separator: "/",
  },
};

export const CustomSeparator: Story = {
  render: () => html`
    <sp-breadcrumb separator="›">
      <sp-breadcrumb-item href="/">Home</sp-breadcrumb-item>
      <sp-breadcrumb-item href="/products">Products</sp-breadcrumb-item>
      <sp-breadcrumb-item>Current Page</sp-breadcrumb-item>
    </sp-breadcrumb>
  `,
};

export const WithLinks: Story = {
  render: () => html`
    <sp-breadcrumb>
      <sp-breadcrumb-item href="https://example.com">Home</sp-breadcrumb-item>
      <sp-breadcrumb-item href="https://example.com/category">Category</sp-breadcrumb-item>
      <sp-breadcrumb-item href="https://example.com/category/sub">Subcategory</sp-breadcrumb-item>
      <sp-breadcrumb-item>Product Name</sp-breadcrumb-item>
    </sp-breadcrumb>
  `,
};

export const Long: Story = {
  render: () => html`
    <sp-breadcrumb>
      <sp-breadcrumb-item href="/">Home</sp-breadcrumb-item>
      <sp-breadcrumb-item href="/level1">Level 1</sp-breadcrumb-item>
      <sp-breadcrumb-item href="/level1/level2">Level 2</sp-breadcrumb-item>
      <sp-breadcrumb-item href="/level1/level2/level3">Level 3</sp-breadcrumb-item>
      <sp-breadcrumb-item>Current Page</sp-breadcrumb-item>
    </sp-breadcrumb>
  `,
};

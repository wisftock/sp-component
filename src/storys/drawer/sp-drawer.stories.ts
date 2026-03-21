import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import type { SpDrawerProps } from "../../components/drawer/sp-drawer.types.js";
import "../../components/drawer/sp-drawer.js";
import "../../components/button/sp-button.js";

const meta: Meta<SpDrawerProps> = {
  title: "Components/Drawer",
  component: "sp-drawer",
  tags: ["autodocs"],
  argTypes: {
    open: { control: "boolean", description: "Whether the drawer is open" },
    label: { control: "text", description: "Accessible aria-label" },
    placement: {
      control: "select",
      options: ["left", "right", "top", "bottom"],
      description: "Slide-in direction",
    },
    size: {
      control: "text",
      description: "Width (left/right) or height (top/bottom)",
    },
    closable: { control: "boolean", description: "Shows a close button" },
    closeOnOverlay: {
      control: "boolean",
      description: "Close when clicking the backdrop",
    },
  },
  args: {
    open: false,
    label: "Demo drawer",
    placement: "right",
    size: "320px",
    closable: true,
    closeOnOverlay: true,
  },
};

export default meta;
type Story = StoryObj<SpDrawerProps>;

// ---- Right (default) ----

export const Right: Story = {
  render: () => {
    const openDrawer = () => {
      const drawer = document.querySelector(
        "#drawer-right",
      ) as HTMLElement & { open: boolean };
      if (drawer) drawer.open = true;
    };
    return html`
      <sp-button @click=${openDrawer}>Open Right Drawer</sp-button>
      <sp-drawer id="drawer-right" placement="right" label="Right drawer">
        <p>This drawer slides in from the right.</p>
      </sp-drawer>
    `;
  },
};

// ---- Left ----

export const Left: Story = {
  render: () => {
    const openDrawer = () => {
      const drawer = document.querySelector(
        "#drawer-left",
      ) as HTMLElement & { open: boolean };
      if (drawer) drawer.open = true;
    };
    return html`
      <sp-button @click=${openDrawer}>Open Left Drawer</sp-button>
      <sp-drawer id="drawer-left" placement="left" label="Left drawer">
        <p>This drawer slides in from the left.</p>
      </sp-drawer>
    `;
  },
};

// ---- Top ----

export const Top: Story = {
  render: () => {
    const openDrawer = () => {
      const drawer = document.querySelector(
        "#drawer-top",
      ) as HTMLElement & { open: boolean };
      if (drawer) drawer.open = true;
    };
    return html`
      <sp-button @click=${openDrawer}>Open Top Drawer</sp-button>
      <sp-drawer id="drawer-top" placement="top" size="200px" label="Top drawer">
        <p>This drawer slides in from the top.</p>
      </sp-drawer>
    `;
  },
};

// ---- Bottom ----

export const Bottom: Story = {
  render: () => {
    const openDrawer = () => {
      const drawer = document.querySelector(
        "#drawer-bottom",
      ) as HTMLElement & { open: boolean };
      if (drawer) drawer.open = true;
    };
    return html`
      <sp-button @click=${openDrawer}>Open Bottom Drawer</sp-button>
      <sp-drawer id="drawer-bottom" placement="bottom" size="200px" label="Bottom drawer">
        <p>This drawer slides in from the bottom.</p>
      </sp-drawer>
    `;
  },
};

// ---- WithHeader ----

export const WithHeader: Story = {
  render: () => {
    const openDrawer = () => {
      const drawer = document.querySelector(
        "#drawer-header",
      ) as HTMLElement & { open: boolean };
      if (drawer) drawer.open = true;
    };
    return html`
      <sp-button @click=${openDrawer}>Open Drawer with Header</sp-button>
      <sp-drawer id="drawer-header" placement="right" label="Drawer with header">
        <div slot="header">Navigation</div>
        <p>Main content goes here.</p>
      </sp-drawer>
    `;
  },
};

// ---- WithFooter ----

export const WithFooter: Story = {
  render: () => {
    const openDrawer = () => {
      const drawer = document.querySelector(
        "#drawer-footer",
      ) as HTMLElement & { open: boolean };
      if (drawer) drawer.open = true;
    };
    const closeDrawer = () => {
      const drawer = document.querySelector(
        "#drawer-footer",
      ) as HTMLElement & { open: boolean };
      if (drawer) drawer.open = false;
    };
    return html`
      <sp-button @click=${openDrawer}>Open Drawer with Footer</sp-button>
      <sp-drawer id="drawer-footer" placement="right" label="Drawer with footer">
        <div slot="header">Edit Item</div>
        <p>Form fields would go here.</p>
        <div slot="footer">
          <sp-button variant="secondary" @click=${closeDrawer}>Cancel</sp-button>
          <sp-button variant="primary" @click=${closeDrawer}>Save</sp-button>
        </div>
      </sp-drawer>
    `;
  },
};

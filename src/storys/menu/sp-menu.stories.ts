import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import type { SpMenuProps } from "../../components/menu/sp-menu.types.js";
import "../../components/menu/sp-menu.js";
import "../../components/menu/sp-menu-item.js";

const meta: Meta<SpMenuProps> = {
  title: "Components/Menu",
  component: "sp-menu",
  tags: ["autodocs"],
  argTypes: {
    placement: {
      control: "select",
      options: ["bottom-start", "bottom-end", "top-start", "top-end", "right", "left"],
      description: "Position of the menu panel relative to the trigger",
    },
    open: {
      control: "boolean",
      description: "Whether the menu is open",
    },
  },
  args: {
    placement: "bottom-start",
    open: false,
  },
};

export default meta;
type Story = StoryObj<SpMenuProps>;

export const DropdownMenu: Story = {
  render: () => html`
    <div style="padding: 40px;">
      <sp-menu placement="bottom-start">
        <button slot="trigger" style="padding: 8px 16px; border: 1px solid #e5e7eb; border-radius: 6px; cursor: pointer; background: white;">
          Options ▾
        </button>
        <sp-menu-item value="edit">Edit</sp-menu-item>
        <sp-menu-item value="duplicate">Duplicate</sp-menu-item>
        <sp-menu-item value="archive">Archive</sp-menu-item>
      </sp-menu>
    </div>
  `,
};

export const WithDangerItem: Story = {
  render: () => html`
    <div style="padding: 40px;">
      <sp-menu placement="bottom-start">
        <button slot="trigger" style="padding: 8px 16px; border: 1px solid #e5e7eb; border-radius: 6px; cursor: pointer; background: white;">
          Actions ▾
        </button>
        <sp-menu-item value="edit">Edit</sp-menu-item>
        <sp-menu-item value="duplicate">Duplicate</sp-menu-item>
        <sp-menu-item value="delete" danger>Delete</sp-menu-item>
      </sp-menu>
    </div>
  `,
};

export const WithDisabledItem: Story = {
  render: () => html`
    <div style="padding: 40px;">
      <sp-menu placement="bottom-start">
        <button slot="trigger" style="padding: 8px 16px; border: 1px solid #e5e7eb; border-radius: 6px; cursor: pointer; background: white;">
          Actions ▾
        </button>
        <sp-menu-item value="edit">Edit</sp-menu-item>
        <sp-menu-item value="publish" disabled>Publish (disabled)</sp-menu-item>
        <sp-menu-item value="delete" danger>Delete</sp-menu-item>
      </sp-menu>
    </div>
  `,
};

export const WithIcons: Story = {
  render: () => html`
    <div style="padding: 40px;">
      <sp-menu placement="bottom-start">
        <button slot="trigger" style="padding: 8px 16px; border: 1px solid #e5e7eb; border-radius: 6px; cursor: pointer; background: white;">
          File ▾
        </button>
        <sp-menu-item value="new">
          <svg slot="prefix" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 5v14M5 12h14"/>
          </svg>
          New File
        </sp-menu-item>
        <sp-menu-item value="open">
          <svg slot="prefix" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1"/>
            <path d="M21 15l-5 5m0 0l-5-5m5 5V10"/>
          </svg>
          Open
        </sp-menu-item>
        <sp-menu-item value="save">
          <svg slot="prefix" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/>
            <polyline points="17 21 17 13 7 13 7 21"/>
            <polyline points="7 3 7 8 15 8"/>
          </svg>
          Save
        </sp-menu-item>
      </sp-menu>
    </div>
  `,
};

export const PlacementVariants: Story = {
  render: () => html`
    <div style="display: flex; gap: 16px; flex-wrap: wrap; padding: 80px 40px;">
      ${(["bottom-start", "bottom-end", "top-start", "top-end"] as const).map(
        (placement) => html`
          <sp-menu placement=${placement} open>
            <button slot="trigger" style="padding: 8px 16px; border: 1px solid #e5e7eb; border-radius: 6px; cursor: pointer; background: white;">
              ${placement} ▾
            </button>
            <sp-menu-item value="a">Option A</sp-menu-item>
            <sp-menu-item value="b">Option B</sp-menu-item>
            <sp-menu-item value="c">Option C</sp-menu-item>
          </sp-menu>
        `,
      )}
    </div>
  `,
};

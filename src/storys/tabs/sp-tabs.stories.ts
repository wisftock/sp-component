import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import type { SpTabsProps } from "../../components/tabs/sp-tabs.types.js";
import "../../components/tabs/sp-tabs.js";
import "../../components/tabs/sp-tab.js";
import "../../components/tabs/sp-tab-panel.js";

const meta: Meta<SpTabsProps> = {
  title: "Components/Tabs",
  component: "sp-tabs",
  tags: ["autodocs"],
  argTypes: {
    active: {
      control: "text",
      description: "The panel name of the active tab",
    },
    placement: {
      control: "select",
      options: ["top", "bottom", "left", "right"],
      description: "Tab bar placement",
    },
  },
  args: {
    active: "tab1",
    placement: "top",
  },
  render: ({ active, placement }) => html`
    <sp-tabs active=${active} placement=${placement}>
      <sp-tab slot="nav" panel="tab1">Tab 1</sp-tab>
      <sp-tab slot="nav" panel="tab2">Tab 2</sp-tab>
      <sp-tab slot="nav" panel="tab3" disabled>Disabled</sp-tab>
      <sp-tab-panel name="tab1">Content of Tab 1</sp-tab-panel>
      <sp-tab-panel name="tab2">Content of Tab 2</sp-tab-panel>
      <sp-tab-panel name="tab3">Content of Tab 3</sp-tab-panel>
    </sp-tabs>
  `,
};

export default meta;
type Story = StoryObj<SpTabsProps>;

export const Default: Story = {
  args: {
    active: "tab1",
    placement: "top",
  },
};

export const WithDisabledTab: Story = {
  render: () => html`
    <sp-tabs active="tab1">
      <sp-tab slot="nav" panel="tab1">Tab 1</sp-tab>
      <sp-tab slot="nav" panel="tab2">Tab 2</sp-tab>
      <sp-tab slot="nav" panel="tab3" disabled>Disabled</sp-tab>
      <sp-tab-panel name="tab1">Content of Tab 1</sp-tab-panel>
      <sp-tab-panel name="tab2">Content of Tab 2</sp-tab-panel>
      <sp-tab-panel name="tab3">Content of Tab 3</sp-tab-panel>
    </sp-tabs>
  `,
};

export const PlacementLeft: Story = {
  render: () => html`
    <sp-tabs active="tab1" placement="left">
      <sp-tab slot="nav" panel="tab1">Tab 1</sp-tab>
      <sp-tab slot="nav" panel="tab2">Tab 2</sp-tab>
      <sp-tab slot="nav" panel="tab3">Tab 3</sp-tab>
      <sp-tab-panel name="tab1">Content of Tab 1</sp-tab-panel>
      <sp-tab-panel name="tab2">Content of Tab 2</sp-tab-panel>
      <sp-tab-panel name="tab3">Content of Tab 3</sp-tab-panel>
    </sp-tabs>
  `,
};

export const PlacementBottom: Story = {
  render: () => html`
    <sp-tabs active="tab1" placement="bottom">
      <sp-tab slot="nav" panel="tab1">Tab 1</sp-tab>
      <sp-tab slot="nav" panel="tab2">Tab 2</sp-tab>
      <sp-tab slot="nav" panel="tab3">Tab 3</sp-tab>
      <sp-tab-panel name="tab1">Content of Tab 1</sp-tab-panel>
      <sp-tab-panel name="tab2">Content of Tab 2</sp-tab-panel>
      <sp-tab-panel name="tab3">Content of Tab 3</sp-tab-panel>
    </sp-tabs>
  `,
};

export const PlacementRight: Story = {
  render: () => html`
    <sp-tabs active="tab1" placement="right">
      <sp-tab slot="nav" panel="tab1">Tab 1</sp-tab>
      <sp-tab slot="nav" panel="tab2">Tab 2</sp-tab>
      <sp-tab slot="nav" panel="tab3">Tab 3</sp-tab>
      <sp-tab-panel name="tab1">Content of Tab 1</sp-tab-panel>
      <sp-tab-panel name="tab2">Content of Tab 2</sp-tab-panel>
      <sp-tab-panel name="tab3">Content of Tab 3</sp-tab-panel>
    </sp-tabs>
  `,
};

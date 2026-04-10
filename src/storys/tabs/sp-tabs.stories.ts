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
    active: { control: "text", description: "Panel name of the active tab" },
    placement: { control: "select", options: ["top", "bottom", "left", "right"] },
  },
  args: { active: "tab1", placement: "top" },
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
  args: { active: "tab1", placement: "top" },
};

export const WithBadge: Story = {
  render: () => html`
    <sp-tabs active="inbox">
      <sp-tab slot="nav" panel="inbox" badge="12">Inbox</sp-tab>
      <sp-tab slot="nav" panel="sent">Sent</sp-tab>
      <sp-tab slot="nav" panel="drafts" badge="3">Drafts</sp-tab>
      <sp-tab slot="nav" panel="spam" badge="99+">Spam</sp-tab>
      <sp-tab-panel name="inbox"><p>12 unread messages</p></sp-tab-panel>
      <sp-tab-panel name="sent"><p>Sent messages</p></sp-tab-panel>
      <sp-tab-panel name="drafts"><p>3 drafts saved</p></sp-tab-panel>
      <sp-tab-panel name="spam"><p>Spam folder</p></sp-tab-panel>
    </sp-tabs>
  `,
};

export const WithIcon: Story = {
  render: () => html`
    <sp-tabs active="home">
      <sp-tab slot="nav" panel="home" icon="🏠">Home</sp-tab>
      <sp-tab slot="nav" panel="profile" icon="👤">Profile</sp-tab>
      <sp-tab slot="nav" panel="settings" icon="⚙️">Settings</sp-tab>
      <sp-tab slot="nav" panel="help" icon="❓">Help</sp-tab>
      <sp-tab-panel name="home"><p>Home content</p></sp-tab-panel>
      <sp-tab-panel name="profile"><p>Profile content</p></sp-tab-panel>
      <sp-tab-panel name="settings"><p>Settings content</p></sp-tab-panel>
      <sp-tab-panel name="help"><p>Help content</p></sp-tab-panel>
    </sp-tabs>
  `,
};

export const Closable: Story = {
  render: () => {
    const tabs = [
      { panel: "t1", label: "Dashboard" },
      { panel: "t2", label: "Analytics" },
      { panel: "t3", label: "Reports" },
    ];
    let active = "t1";
    const container = document.createElement("div");

    const render = () => {
      container.innerHTML = "";
      const tpl = document.createElement("sp-tabs") as any;
      tpl.active = active;

      tabs.forEach(t => {
        const tab = document.createElement("sp-tab") as any;
        tab.slot = "nav";
        tab.panel = t.panel;
        tab.closable = true;
        tab.textContent = t.label;
        tab.addEventListener("sp-tab-close", (e: CustomEvent) => {
          const idx = tabs.findIndex(x => x.panel === e.detail.key);
          if (idx !== -1) tabs.splice(idx, 1);
          if (active === e.detail.key) active = tabs[0]?.panel ?? "";
          render();
        });
        tab.addEventListener("sp-tab-click", (e: CustomEvent) => {
          active = e.detail.panel;
        });
        tpl.appendChild(tab);
      });

      tabs.forEach(t => {
        const panel = document.createElement("sp-tab-panel") as any;
        panel.name = t.panel;
        panel.textContent = `Content for ${t.label}`;
        tpl.appendChild(panel);
      });

      container.appendChild(tpl);
    };

    render();
    return html`${container}`;
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
    <sp-tabs active="tab1" placement="left" style="height: 200px;">
      <sp-tab slot="nav" panel="tab1">General</sp-tab>
      <sp-tab slot="nav" panel="tab2">Security</sp-tab>
      <sp-tab slot="nav" panel="tab3">Notifications</sp-tab>
      <sp-tab-panel name="tab1"><p>General settings</p></sp-tab-panel>
      <sp-tab-panel name="tab2"><p>Security settings</p></sp-tab-panel>
      <sp-tab-panel name="tab3"><p>Notification settings</p></sp-tab-panel>
    </sp-tabs>
  `,
};

export const PlacementRight: Story = {
  render: () => html`
    <sp-tabs active="tab1" placement="right" style="height: 200px;">
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

export const ManyTabs: Story = {
  render: () => html`
    <sp-tabs active="t1">
      ${Array.from({ length: 12 }, (_, i) => html`
        <sp-tab slot="nav" panel="t${i + 1}">Tab ${i + 1}</sp-tab>
      `)}
      ${Array.from({ length: 12 }, (_, i) => html`
        <sp-tab-panel name="t${i + 1}">Content of Tab ${i + 1}</sp-tab-panel>
      `)}
    </sp-tabs>
  `,
};

import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "../../components/select-root/sp-select-root.js";
import "../../components/select-root/sp-select-trigger.js";
import "../../components/select-root/sp-select-content.js";
import "../../components/select-root/sp-select-item.js";
import "../../components/select-root/sp-select-group.js";

const meta: Meta = {
  title: "Compound/Select",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
**Compound Select** — a headless, fully composable select built from sub-elements.
Unlike \`<sp-select>\`, this API gives full control over the trigger, content, and items.

\`\`\`html
<sp-select-root>
  <sp-select-trigger placeholder="Choose…"></sp-select-trigger>
  <sp-select-content>
    <sp-select-item value="a">Option A</sp-select-item>
    <sp-select-item value="b">Option B</sp-select-item>
  </sp-select-content>
</sp-select-root>
\`\`\`
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const Basic: Story = {
  render: () => html`
    <sp-select-root>
      <sp-select-trigger placeholder="Select a fruit…"></sp-select-trigger>
      <sp-select-content>
        <sp-select-item value="apple">Apple</sp-select-item>
        <sp-select-item value="banana">Banana</sp-select-item>
        <sp-select-item value="cherry">Cherry</sp-select-item>
        <sp-select-item value="grape">Grape</sp-select-item>
      </sp-select-content>
    </sp-select-root>
  `,
};

export const WithGroups: Story = {
  name: "With Groups",
  render: () => html`
    <sp-select-root>
      <sp-select-trigger placeholder="Select a country…"></sp-select-trigger>
      <sp-select-content>
        <sp-select-group label="Europe">
          <sp-select-item value="es">Spain</sp-select-item>
          <sp-select-item value="fr">France</sp-select-item>
          <sp-select-item value="de">Germany</sp-select-item>
        </sp-select-group>
        <sp-select-group label="Americas">
          <sp-select-item value="mx">Mexico</sp-select-item>
          <sp-select-item value="us">United States</sp-select-item>
          <sp-select-item value="br">Brazil</sp-select-item>
        </sp-select-group>
      </sp-select-content>
    </sp-select-root>
  `,
};

export const WithDisabledItem: Story = {
  name: "With Disabled Item",
  render: () => html`
    <sp-select-root>
      <sp-select-trigger placeholder="Select a plan…"></sp-select-trigger>
      <sp-select-content>
        <sp-select-item value="free">Free</sp-select-item>
        <sp-select-item value="pro">Pro</sp-select-item>
        <sp-select-item value="enterprise" disabled>Enterprise (contact us)</sp-select-item>
      </sp-select-content>
    </sp-select-root>
  `,
};

export const DisabledRoot: Story = {
  name: "Disabled",
  render: () => html`
    <sp-select-root disabled>
      <sp-select-trigger placeholder="Disabled select" disabled></sp-select-trigger>
      <sp-select-content>
        <sp-select-item value="a">Option A</sp-select-item>
      </sp-select-content>
    </sp-select-root>
  `,
};

export const WithEventHandler: Story = {
  name: "With Change Event",
  render: () => {
    const onchange = (e: CustomEvent) => {
      const el = document.getElementById("compound-select-output");
      if (el) el.textContent = `Selected: ${e.detail.value}`;
    };
    return html`
      <div style="display: flex; flex-direction: column; gap: 12px;">
        <sp-select-root @sp-change=${onchange}>
          <sp-select-trigger placeholder="Choose a role…"></sp-select-trigger>
          <sp-select-content>
            <sp-select-item value="admin">Admin</sp-select-item>
            <sp-select-item value="editor">Editor</sp-select-item>
            <sp-select-item value="viewer">Viewer</sp-select-item>
          </sp-select-content>
        </sp-select-root>
        <p id="compound-select-output" style="font-size: 13px; color: #6b7280;">No selection yet</p>
      </div>
    `;
  },
};

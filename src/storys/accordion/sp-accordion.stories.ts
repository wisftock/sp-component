import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import type { SpAccordionProps } from "../../components/accordion/sp-accordion.types.js";
import "../../components/accordion/sp-accordion.js";
import "../../components/accordion/sp-accordion-item.js";

const meta: Meta<SpAccordionProps> = {
  title: "Components/Accordion",
  component: "sp-accordion",
  tags: ["autodocs"],
  argTypes: {
    multiple: {
      control: "boolean",
      description: "Allow multiple items open simultaneously",
    },
    variant: {
      control: "select",
      options: ["default", "bordered", "ghost"],
      description: "Visual style of the accordion",
    },
  },
  args: {
    multiple: false,
    variant: "default",
  },
  render: (args) => html`
    <sp-accordion variant=${args.variant} ?multiple=${args.multiple}>
      <sp-accordion-item label="What is a Web Component?" value="item1">
        Web Components are a set of web platform APIs that allow you to create reusable custom elements.
      </sp-accordion-item>
      <sp-accordion-item label="How does Lit work?" value="item2">
        Lit is a simple library for building fast, lightweight web components with reactive properties and declarative templates.
      </sp-accordion-item>
      <sp-accordion-item label="What browsers are supported?" value="item3">
        All modern browsers support Web Components natively, including Chrome, Firefox, Safari, and Edge.
      </sp-accordion-item>
    </sp-accordion>
  `,
};

export default meta;
type Story = StoryObj<SpAccordionProps>;

export const Default: Story = {};

export const Multiple: Story = {
  render: () => html`
    <sp-accordion variant="default" multiple>
      <sp-accordion-item label="Section One" value="one">
        Content for section one. Multiple sections can be open at the same time.
      </sp-accordion-item>
      <sp-accordion-item label="Section Two" value="two">
        Content for section two. Try opening multiple items at once.
      </sp-accordion-item>
      <sp-accordion-item label="Section Three" value="three">
        Content for section three. All items can be expanded simultaneously.
      </sp-accordion-item>
    </sp-accordion>
  `,
};

export const WithDisabledItem: Story = {
  render: () => html`
    <sp-accordion variant="default">
      <sp-accordion-item label="Available Section" value="one">
        This section can be toggled normally.
      </sp-accordion-item>
      <sp-accordion-item label="Disabled Section" value="two" disabled>
        This content is not accessible because the item is disabled.
      </sp-accordion-item>
      <sp-accordion-item label="Another Available Section" value="three">
        This section can also be toggled normally.
      </sp-accordion-item>
    </sp-accordion>
  `,
};

export const Variants: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 24px;">
      <div>
        <p style="font-size: 12px; color: #6b7280; margin-bottom: 8px;">Default</p>
        <sp-accordion variant="default">
          <sp-accordion-item label="Item One" value="one">Default variant content.</sp-accordion-item>
          <sp-accordion-item label="Item Two" value="two">Default variant content.</sp-accordion-item>
        </sp-accordion>
      </div>
      <div>
        <p style="font-size: 12px; color: #6b7280; margin-bottom: 8px;">Bordered</p>
        <sp-accordion variant="bordered">
          <sp-accordion-item label="Item One" value="one">Bordered variant content.</sp-accordion-item>
          <sp-accordion-item label="Item Two" value="two">Bordered variant content.</sp-accordion-item>
        </sp-accordion>
      </div>
      <div>
        <p style="font-size: 12px; color: #6b7280; margin-bottom: 8px;">Ghost</p>
        <sp-accordion variant="ghost">
          <sp-accordion-item label="Item One" value="one">Ghost variant content.</sp-accordion-item>
          <sp-accordion-item label="Item Two" value="two">Ghost variant content.</sp-accordion-item>
        </sp-accordion>
      </div>
    </div>
  `,
};

export const Controlled: Story = {
  render: () => html`
    <sp-accordion variant="default">
      <sp-accordion-item label="Pre-opened Item" value="one" open>
        This item is pre-opened. The content is visible immediately on load.
      </sp-accordion-item>
      <sp-accordion-item label="Closed Item" value="two">
        This item starts closed.
      </sp-accordion-item>
      <sp-accordion-item label="Another Closed Item" value="three">
        This item also starts closed.
      </sp-accordion-item>
    </sp-accordion>
  `,
};

import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import type { SpButtonProps } from "../../components/button/sp-button.types.js";
import "../../components/button/sp-button.js";

const meta: Meta<SpButtonProps> = {
  title: "Components/Button",
  component: "sp-button",
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "ghost", "destructive", "outline", "soft", "link"],
      description: "Visual style of the button",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Size of the button",
    },
    disabled: {
      control: "boolean",
      description: "Disables the button",
    },
    loading: {
      control: "boolean",
      description: "Shows a spinner and disables interaction",
    },
    fullWidth: {
      control: "boolean",
      description: "Stretches the button to 100% of its container",
    },
    label: {
      control: "text",
      description: "Accessible aria-label",
    },
    type: {
      control: "select",
      options: ["button", "submit", "reset"],
      description: "Native button type",
    },
    href: {
      control: "text",
      description: "Renders as <a> when provided",
    },
    target: {
      control: "select",
      options: ["_blank", "_self", "_parent", "_top"],
      description: "Link target — used with href",
    },
    name: {
      control: "text",
      description: "Native button name for form submission",
    },
    value: {
      control: "text",
      description: "Native button value for form submission",
    },
  },
  args: {
    variant: "primary",
    size: "md",
    disabled: false,
    loading: false,
    fullWidth: false,
    label: "",
    type: "button",
    href: "",
    target: "",
    name: "",
    value: "",
  },
  render: ({ variant, size, disabled, loading, fullWidth, label, type, href, target, name, value }) => html`
    <sp-button
      variant=${variant}
      size=${size}
      ?disabled=${disabled}
      ?loading=${loading}
      ?full-width=${fullWidth}
      label=${label || nothing}
      type=${type}
      href=${href || nothing}
      target=${target || nothing}
      name=${name || nothing}
      value=${value || nothing}
    >
      ${label || "Button"}
    </sp-button>
  `,
};

// needed for conditional attributes in render
import { nothing } from "lit";

export default meta;
type Story = StoryObj<SpButtonProps>;

// ---- Variants ----

export const Primary: Story = {
  args: { variant: "primary" },
};

export const Secondary: Story = {
  args: { variant: "secondary" },
};

export const Ghost: Story = {
  args: { variant: "ghost" },
};

export const Destructive: Story = {
  args: { variant: "destructive" },
};

// ---- States ----

export const Disabled: Story = {
  args: { disabled: true },
};

export const Loading: Story = {
  args: { loading: true },
};

export const LoadingWithText: Story = {
  render: () => html`
    <sp-button loading>Guardando...</sp-button>
  `,
};

// ---- Sizes ----

export const AllSizes: Story = {
  render: () => html`
    <div style="display: flex; gap: 12px; align-items: center;">
      <sp-button size="sm">Small</sp-button>
      <sp-button size="md">Medium</sp-button>
      <sp-button size="lg">Large</sp-button>
    </div>
  `,
};

// ---- Width ----

export const FullWidth: Story = {
  render: () => html`
    <div style="width: 400px;">
      <sp-button full-width>Full width</sp-button>
    </div>
  `,
};

export const CustomWidths: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 12px; width: 400px;">
      <sp-button style="width: 100%;">100%</sp-button>
      <sp-button style="width: 50%;">50%</sp-button>
      <sp-button style="width: 25%;">25%</sp-button>
      <sp-button style="width: 200px;">200px</sp-button>
    </div>
  `,
};

// ---- Link button ----

export const LinkButton: Story = {
  render: () => html`
    <sp-button href="https://example.com" target="_blank">
      Abrir enlace
    </sp-button>
  `,
};

export const DisabledLink: Story = {
  render: () => html`
    <sp-button href="https://example.com" disabled>
      Enlace deshabilitado
    </sp-button>
  `,
};

// ---- Slots: prefix / suffix ----

export const WithPrefixIcon: Story = {
  render: () => html`
    <sp-button>
      <svg slot="prefix" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M12 5v14M5 12l7 7 7-7"/>
      </svg>
      Descargar
    </sp-button>
  `,
};

export const WithSuffixIcon: Story = {
  render: () => html`
    <sp-button>
      Siguiente
      <svg slot="suffix" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M5 12h14M12 5l7 7-7 7"/>
      </svg>
    </sp-button>
  `,
};

export const WithBothIcons: Story = {
  render: () => html`
    <sp-button>
      <svg slot="prefix" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/>
      </svg>
      Programar
      <svg slot="suffix" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M19 9l-7 7-7-7"/>
      </svg>
    </sp-button>
  `,
};

// ---- All variants overview ----

export const Outline: Story = {
  args: { variant: "outline" },
};

export const Soft: Story = {
  args: { variant: "soft" },
};

export const Link: Story = {
  args: { variant: "link" },
};

export const AllVariants: Story = {
  render: () => html`
    <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center;">
      <sp-button variant="primary">Primary</sp-button>
      <sp-button variant="secondary">Secondary</sp-button>
      <sp-button variant="ghost">Ghost</sp-button>
      <sp-button variant="destructive">Destructive</sp-button>
      <sp-button variant="outline">Outline</sp-button>
      <sp-button variant="soft">Soft</sp-button>
      <sp-button variant="link">Link</sp-button>
      <sp-button disabled>Disabled</sp-button>
      <sp-button loading>Loading</sp-button>
    </div>
  `,
};

import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import type { SpNavbarProps } from "../../components/navbar/sp-navbar.types.js";
import "../../components/navbar/sp-navbar.js";

const meta: Meta<SpNavbarProps> = {
  title: "Components/Navbar",
  component: "sp-navbar",
  tags: ["autodocs"],
  argTypes: {
    fixed: {
      control: "boolean",
      description: "Fixes the navbar to the top of the viewport",
    },
    bordered: {
      control: "boolean",
      description: "Adds a bottom border",
    },
    transparent: {
      control: "boolean",
      description: "Makes the background transparent",
    },
  },
  args: {
    fixed: false,
    bordered: false,
    transparent: false,
  },
  render: (args) => html`
    <sp-navbar
      ?fixed=${args.fixed}
      ?bordered=${args.bordered}
      ?transparent=${args.transparent}
    >
      <span slot="start" style="font-weight: 600; font-size: 18px;">MyApp</span>
      <span slot="end" style="color: #6b7280;">Menu</span>
    </sp-navbar>
  `,
};

export default meta;
type Story = StoryObj<SpNavbarProps>;

export const Default: Story = {};

export const WithBorder: Story = {
  render: () => html`
    <sp-navbar bordered>
      <span slot="start" style="font-weight: 600; font-size: 18px;">MyApp</span>
      <span slot="end" style="color: #6b7280;">Menu</span>
    </sp-navbar>
  `,
};

export const Fixed: Story = {
  render: () => html`
    <div style="height: 120px; background: #f9fafb; font-size: 14px; color: #6b7280; padding: 80px 24px;">
      Page content below a fixed navbar
    </div>
    <sp-navbar fixed bordered>
      <span slot="start" style="font-weight: 600; font-size: 18px;">MyApp</span>
    </sp-navbar>
  `,
};

export const WithLogo: Story = {
  render: () => html`
    <sp-navbar bordered>
      <div slot="start" style="display: flex; align-items: center; gap: 8px;">
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <rect width="28" height="28" rx="6" fill="#3b82f6"/>
          <path d="M8 14l4 4 8-8" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span style="font-weight: 700; font-size: 16px;">Acme</span>
      </div>
    </sp-navbar>
  `,
};

export const WithNavLinks: Story = {
  render: () => html`
    <sp-navbar bordered>
      <span slot="start" style="font-weight: 700; font-size: 16px;">Acme</span>
      <nav slot="center" style="display: flex; gap: 24px; font-size: 14px; font-weight: 500;">
        <a href="#" style="color: #374151; text-decoration: none;">Home</a>
        <a href="#" style="color: #374151; text-decoration: none;">Products</a>
        <a href="#" style="color: #374151; text-decoration: none;">Pricing</a>
        <a href="#" style="color: #374151; text-decoration: none;">About</a>
      </nav>
    </sp-navbar>
  `,
};

export const WithActions: Story = {
  render: () => html`
    <sp-navbar bordered>
      <span slot="start" style="font-weight: 700; font-size: 16px;">Acme</span>
      <nav slot="center" style="display: flex; gap: 24px; font-size: 14px; font-weight: 500;">
        <a href="#" style="color: #374151; text-decoration: none;">Home</a>
        <a href="#" style="color: #374151; text-decoration: none;">Products</a>
      </nav>
      <div slot="end" style="display: flex; gap: 8px;">
        <button style="padding: 6px 14px; border: 1px solid #e5e7eb; border-radius: 6px; background: white; cursor: pointer; font-size: 14px;">
          Sign in
        </button>
        <button style="padding: 6px 14px; border: none; border-radius: 6px; background: #3b82f6; color: white; cursor: pointer; font-size: 14px;">
          Get started
        </button>
      </div>
    </sp-navbar>
  `,
};

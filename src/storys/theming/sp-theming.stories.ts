import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { SpConfig } from "../../config.js";
import "../../components/button/sp-button.js";
import "../../components/badge/sp-badge.js";
import "../../components/input/sp-input.js";
import "../../components/card/sp-card.js";

const meta: Meta = {
  title: "System/Theming",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
**Runtime Theming API** — change the entire look of SP Components at runtime using \`SpConfig\`.

\`\`\`ts
import { SpConfig } from "sp-component";

// Preset themes
SpConfig.setTheme("violet");
SpConfig.setTheme("rose");
SpConfig.setTheme("emerald");

// Custom theme (any --sp-* tokens)
SpConfig.setTheme({ "--sp-primary": "#8b5cf6", "--sp-primary-hover": "#7c3aed" });

// Color scheme
SpConfig.setColorScheme("dark");   // force dark
SpConfig.setColorScheme("light");  // force light
SpConfig.setColorScheme("auto");   // follow OS preference

// Density
SpConfig.setDensity("compact");
SpConfig.setDensity("comfortable");
SpConfig.setDensity("spacious");
\`\`\`
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj;

const previewComponents = () => html`
  <div style="display: flex; flex-wrap: wrap; gap: 12px; align-items: center; margin-top: 16px;">
    <sp-button variant="primary">Primary</sp-button>
    <sp-button variant="outline">Outline</sp-button>
    <sp-button variant="soft">Soft</sp-button>
    <sp-badge variant="primary">Badge</sp-badge>
    <sp-badge variant="success">Active</sp-badge>
    <sp-input placeholder="Input field" style="max-width: 200px;"></sp-input>
  </div>
`;

export const PresetThemes: Story = {
  name: "Preset Themes",
  render: () => {
    const apply = (theme: string) => {
      SpConfig.setTheme(theme as Parameters<typeof SpConfig.setTheme>[0]);
    };
    return html`
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <p style="font-size: 13px; color: #6b7280; margin: 0;">
          Click a theme to apply it globally to all SP components on this page.
        </p>
        <div style="display: flex; gap: 8px; flex-wrap: wrap;">
          <sp-button variant="primary" @click=${() => apply("default")}>Default (Blue)</sp-button>
          <sp-button variant="soft" @click=${() => apply("violet")} style="--sp-primary:#7c3aed;--sp-primary-bg:#f5f3ff;">Violet</sp-button>
          <sp-button variant="soft" @click=${() => apply("rose")} style="--sp-primary:#e11d48;--sp-primary-bg:#fff1f2;">Rose</sp-button>
          <sp-button variant="soft" @click=${() => apply("emerald")} style="--sp-primary:#059669;--sp-primary-bg:#ecfdf5;">Emerald</sp-button>
          <sp-button variant="soft" @click=${() => apply("amber")} style="--sp-primary:#d97706;--sp-primary-bg:#fffbeb;">Amber</sp-button>
          <sp-button variant="soft" @click=${() => apply("slate")} style="--sp-primary:#475569;--sp-primary-bg:#f1f5f9;">Slate</sp-button>
        </div>
        ${previewComponents()}
      </div>
    `;
  },
};

export const ColorScheme: Story = {
  name: "Color Scheme",
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 16px;">
      <p style="font-size: 13px; color: #6b7280; margin: 0;">
        Force light/dark mode independently of the OS preference.
      </p>
      <div style="display: flex; gap: 8px;">
        <sp-button @click=${() => SpConfig.setColorScheme("light")}>Force Light</sp-button>
        <sp-button @click=${() => SpConfig.setColorScheme("dark")}>Force Dark</sp-button>
        <sp-button variant="ghost" @click=${() => SpConfig.setColorScheme("auto")}>Auto (OS)</sp-button>
      </div>
      ${previewComponents()}
    </div>
  `,
};

export const Density: Story = {
  name: "Density",
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 16px;">
      <p style="font-size: 13px; color: #6b7280; margin: 0;">
        Controls padding and font size across form components.
      </p>
      <div style="display: flex; gap: 8px;">
        <sp-button @click=${() => SpConfig.setDensity("compact")}>Compact</sp-button>
        <sp-button @click=${() => SpConfig.setDensity("comfortable")}>Comfortable (default)</sp-button>
        <sp-button @click=${() => SpConfig.setDensity("spacious")}>Spacious</sp-button>
      </div>
      ${previewComponents()}
    </div>
  `,
};

export const CustomTheme: Story = {
  name: "Custom Theme (tokens)",
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 16px;">
      <p style="font-size: 13px; color: #6b7280; margin: 0;">
        Pass any <code>--sp-*</code> token object to fully customize.
      </p>
      <div style="display: flex; gap: 8px; flex-wrap: wrap;">
        <sp-button @click=${() => SpConfig.setTheme({
          "--sp-primary": "#8b5cf6",
          "--sp-primary-hover": "#7c3aed",
          "--sp-primary-active": "#6d28d9",
          "--sp-primary-bg": "#f5f3ff",
        })}>Apply Custom Purple</sp-button>
        <sp-button variant="ghost" @click=${() => SpConfig.resetTheme()}>Reset</sp-button>
      </div>
      ${previewComponents()}
    </div>
  `,
};

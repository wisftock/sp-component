import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { SpConfig } from "../../config.js";
import { es } from "../../locale/es.js";
import "../../components/modal/sp-modal.js";
import "../../components/button/sp-button.js";
import "../../components/autocomplete/sp-autocomplete.js";

const meta: Meta = {
  title: "System/i18n",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
**Global i18n System** — change the UI strings of all SP components at once via \`SpConfig.setLocale()\`.

\`\`\`ts
import { SpConfig } from "sp-component";
import { es } from "sp-component/locale/es";

// Apply full Spanish locale
SpConfig.setLocale(es);

// Or override specific strings
SpConfig.setLocale({
  modal: { closeLabel: "Cerrar" },
  autocomplete: { noResultsText: "Sin resultados" },
});
\`\`\`
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const EnglishLocale: Story = {
  name: "English (default)",
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 16px; max-width: 400px;">
      <sp-autocomplete
        label="Language"
        .options=${[{ value: "en", label: "English" }, { value: "es", label: "Spanish" }]}
        placeholder="Search..."
        no-results-text="No results found"
      ></sp-autocomplete>
      <sp-button @click=${() => {
        const modal = document.getElementById("i18n-modal-en") as HTMLElement & { open: boolean };
        if (modal) modal.open = true;
      }}>Open Modal</sp-button>
      <sp-modal id="i18n-modal-en">
        <span slot="header">Modal Title</span>
        <p>This modal uses the default English locale — the close button says "Close".</p>
      </sp-modal>
    </div>
  `,
};

export const SpanishLocale: Story = {
  name: "Spanish locale (es)",
  render: () => {
    SpConfig.setLocale(es);
    return html`
      <div style="display: flex; flex-direction: column; gap: 16px; max-width: 400px;">
        <sp-autocomplete
          label="Idioma"
          .options=${[{ value: "en", label: "Inglés" }, { value: "es", label: "Español" }]}
        ></sp-autocomplete>
        <sp-button @click=${() => {
          const modal = document.getElementById("i18n-modal-es") as HTMLElement & { open: boolean };
          if (modal) modal.open = true;
        }}>Abrir modal</sp-button>
        <sp-modal id="i18n-modal-es">
          <span slot="header">Título del modal</span>
          <p>Este modal usa el locale español — el botón de cerrar dice "Cerrar".</p>
        </sp-modal>
        <sp-button variant="ghost" @click=${() => SpConfig.resetLocale()}>Reset locale</sp-button>
      </div>
    `;
  },
};

export const PartialOverride: Story = {
  name: "Partial Override",
  render: () => {
    SpConfig.setLocale({ modal: { closeLabel: "✕ Dismiss" } });
    return html`
      <div style="display: flex; flex-direction: column; gap: 16px; max-width: 400px;">
        <p style="font-size: 13px; color: #6b7280; margin: 0;">
          Only <code>modal.closeLabel</code> is overridden — everything else stays default.
        </p>
        <sp-button @click=${() => {
          const modal = document.getElementById("i18n-modal-partial") as HTMLElement & { open: boolean };
          if (modal) modal.open = true;
        }}>Open Modal</sp-button>
        <sp-modal id="i18n-modal-partial">
          <span slot="header">Custom close label</span>
          <p>The close button now reads "✕ Dismiss" instead of "Close".</p>
        </sp-modal>
        <sp-button variant="ghost" @click=${() => SpConfig.resetLocale()}>Reset</sp-button>
      </div>
    `;
  },
};

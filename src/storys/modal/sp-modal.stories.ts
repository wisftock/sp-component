import type { Meta, StoryObj } from "@storybook/web-components";
import { html, nothing } from "lit";
import type { SpModalProps } from "../../components/modal/sp-modal.types.js";
import "../../components/modal/sp-modal.js";
import "../../components/button/sp-button.js";

const meta: Meta<SpModalProps> = {
  title: "Components/Modal",
  component: "sp-modal",
  tags: ["autodocs"],
  argTypes: {
    open: { control: "boolean", description: "Whether the modal is open" },
    label: { control: "text", description: "Accessible aria-label" },
    size: {
      control: "select",
      options: ["sm", "md", "lg", "xl", "full"],
      description: "Size of the modal",
    },
    closable: { control: "boolean", description: "Shows a close button" },
    closeOnOverlay: {
      control: "boolean",
      description: "Close when clicking the backdrop",
    },
  },
  args: {
    open: false,
    label: "Demo modal",
    size: "md",
    closable: true,
    closeOnOverlay: true,
  },
  render: (args) => html`
    <div>
      <sp-button @click=${(e: Event) => {
        const modal = (e.target as HTMLElement).closest("div")?.querySelector("sp-modal") as any;
        if (modal) modal.open = true;
      }}>Open Modal</sp-button>
      <sp-modal
        label=${args.label}
        size=${args.size}
        ?open=${args.open}
        ?closable=${args.closable}
        ?close-on-overlay=${args.closeOnOverlay}
      >
        <p>This is the modal body content. You can put anything here.</p>
      </sp-modal>
    </div>
  `,
};

export default meta;
type Story = StoryObj<SpModalProps>;

// ---- Default (with open button) ----

export const Default: Story = {};

// ---- WithHeader ----

export const WithHeader: Story = {
  render: () => {
    const openModal = () => {
      const modal = document.querySelector(
        "#header-modal",
      ) as HTMLElement & { open: boolean };
      if (modal) modal.open = true;
    };

    return html`
      <sp-button @click=${openModal}>Open Modal with Header</sp-button>
      <sp-modal id="header-modal" label="Modal with header" size="md">
        <div slot="header">Modal Title</div>
        <p>This modal has a header slot.</p>
      </sp-modal>
    `;
  },
};

// ---- WithFooter ----

export const WithFooter: Story = {
  render: () => {
    const openModal = () => {
      const modal = document.querySelector(
        "#footer-modal",
      ) as HTMLElement & { open: boolean };
      if (modal) modal.open = true;
    };
    const closeModal = () => {
      const modal = document.querySelector(
        "#footer-modal",
      ) as HTMLElement & { open: boolean };
      if (modal) modal.open = false;
    };

    return html`
      <sp-button @click=${openModal}>Open Modal with Footer</sp-button>
      <sp-modal id="footer-modal" label="Modal with footer" size="md">
        <div slot="header">Confirm Action</div>
        <p>Are you sure you want to proceed?</p>
        <div slot="footer">
          <sp-button variant="secondary" @click=${closeModal}>Cancel</sp-button>
          <sp-button variant="primary" @click=${closeModal}>Confirm</sp-button>
        </div>
      </sp-modal>
    `;
  },
};

// ---- AllSizes ----

export const AllSizes: Story = {
  render: () => {
    const openModal = (size: string) => {
      const modal = document.querySelector(
        `#modal-${size}`,
      ) as HTMLElement & { open: boolean };
      if (modal) modal.open = true;
    };

    return html`
      <div style="display: flex; gap: 8px; flex-wrap: wrap;">
        ${(["sm", "md", "lg", "xl"] as const).map(
          (size) => html`
            <sp-button @click=${() => openModal(size)}>${size.toUpperCase()}</sp-button>
            <sp-modal id="modal-${size}" label="Modal ${size}" size=${size}>
              <div slot="header">Size: ${size}</div>
              <p>This is a <strong>${size}</strong> modal.</p>
            </sp-modal>
          `,
        )}
      </div>
    `;
  },
};

// ---- NotClosable ----

export const NotClosable: Story = {
  render: () => {
    const openModal = () => {
      const modal = document.querySelector(
        "#no-close-modal",
      ) as HTMLElement & { open: boolean };
      if (modal) modal.open = true;
    };
    const closeModal = () => {
      const modal = document.querySelector(
        "#no-close-modal",
      ) as HTMLElement & { open: boolean };
      if (modal) modal.open = false;
    };

    return html`
      <sp-button @click=${openModal}>Open Non-closable Modal</sp-button>
      <sp-modal
        id="no-close-modal"
        label="Non-closable modal"
        size="md"
        ?closable=${false}
        ?close-on-overlay=${false}
      >
        <div slot="header">Required Action</div>
        <p>You must click a button below to close this modal.</p>
        <div slot="footer">
          <sp-button variant="primary" @click=${closeModal}>Done</sp-button>
        </div>
      </sp-modal>
    `;
  },
};

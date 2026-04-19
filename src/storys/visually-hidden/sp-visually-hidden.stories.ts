import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import type { SpVisuallyHiddenProps } from "../../components/visually-hidden/sp-visually-hidden.types.js";
import "../../components/visually-hidden/sp-visually-hidden.js";

const meta: Meta<SpVisuallyHiddenProps> = {
  title: "Utility/VisuallyHidden",
  component: "sp-visually-hidden",
  tags: ["autodocs"],
  argTypes: {
    focusable: {
      control: "boolean",
      description: "When true, content becomes visible on focus",
    },
  },
  args: {
    focusable: false,
  },
  render: (args) => html`
    <button>
      <sp-visually-hidden ?focusable=${args.focusable}>Click to save the document</sp-visually-hidden>
      Save
    </button>
    <p style="font-size: 13px; color: #6b7280; margin-top: 8px;">
      The button has a visually hidden label for screen readers, while displaying only "Save" visually.
    </p>
  `,
};

export default meta;
type Story = StoryObj<SpVisuallyHiddenProps>;

export const Default: Story = {};

export const Focusable: Story = {
  render: () => html`
    <div>
      <sp-visually-hidden focusable>
        <a href="#main-content" style="display: block; padding: 8px 16px; background: #3b82f6; color: white; border-radius: 4px; text-decoration: none;">
          Skip to main content
        </a>
      </sp-visually-hidden>
      <p style="font-size: 13px; color: #6b7280; margin-top: 8px;">
        Tab into this story to reveal the "Skip to main content" skip link.
        This is the standard accessible skip-link pattern.
      </p>
      <div id="main-content" tabindex="-1">
        <p>Main content area</p>
      </div>
    </div>
  `,
};

import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "../../components/infinite-scroll/sp-infinite-scroll.js";

const meta: Meta = {
  title: "Components/InfiniteScroll",
  component: "sp-infinite-scroll",
  tags: ["autodocs"],
  argTypes: {
    loading: { control: "boolean" },
    "has-more": { control: "boolean" },
    threshold: { control: "number" },
    "loading-text": { control: "text" },
    "end-text": { control: "text" },
  },
  args: {
    loading: false,
    "has-more": true,
    threshold: 200,
    "loading-text": "Cargando...",
    "end-text": "No hay más resultados",
  },
  render: (args) => html`
    <div style="height:400px;overflow-y:auto;border:1px solid #e5e7eb;border-radius:8px;">
      <div style="padding:16px;display:flex;flex-direction:column;gap:8px;">
        ${Array.from({ length: 10 }, (_, i) => html`
          <div style="padding:12px;background:#f9fafb;border-radius:6px;border:1px solid #e5e7eb;font-size:14px;">
            Elemento #${i + 1}
          </div>
        `)}
      </div>
      <sp-infinite-scroll
        ?loading=${args.loading}
        ?has-more=${args["has-more"]}
        threshold=${args.threshold}
        loading-text=${args["loading-text"]}
        end-text=${args["end-text"]}
      ></sp-infinite-scroll>
    </div>
  `,
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const Loading: Story = {
  render: () => html`
    <div style="height:300px;overflow-y:auto;border:1px solid #e5e7eb;border-radius:8px;">
      <div style="padding:16px;">
        ${Array.from({ length: 5 }, (_, i) => html`
          <div style="padding:12px;background:#f9fafb;border-radius:6px;margin-bottom:8px;">Item ${i + 1}</div>
        `)}
      </div>
      <sp-infinite-scroll loading has-more loading-text="Cargando más resultados..."></sp-infinite-scroll>
    </div>
  `,
};

export const EndReached: Story = {
  render: () => html`
    <div style="height:300px;overflow-y:auto;border:1px solid #e5e7eb;border-radius:8px;">
      <div style="padding:16px;">
        ${Array.from({ length: 8 }, (_, i) => html`
          <div style="padding:12px;background:#f9fafb;border-radius:6px;margin-bottom:8px;">Item ${i + 1}</div>
        `)}
      </div>
      <sp-infinite-scroll ?has-more=${false} end-text="Has llegado al final 🎉"></sp-infinite-scroll>
    </div>
  `,
};

import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import type { SpSkeletonProps } from "../../components/skeleton/sp-skeleton.types.js";
import "../../components/skeleton/sp-skeleton.js";

const meta: Meta<SpSkeletonProps> = {
  title: "Components/Skeleton",
  component: "sp-skeleton",
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["text", "circle", "rect"],
      description: "Shape variant",
    },
    width: {
      control: "text",
      description: "CSS width value (e.g. 200px, 100%)",
    },
    height: {
      control: "text",
      description: "CSS height value (e.g. 16px, 48px)",
    },
    animated: {
      control: "boolean",
      description: "Enables shimmer animation",
    },
  },
  args: {
    variant: "text",
    width: "",
    height: "",
    animated: true,
  },
  render: ({ variant, width, height, animated }) => html`
    <sp-skeleton
      variant=${variant}
      width=${width}
      height=${height}
      ?animated=${animated}
      style="display: block; width: 200px;"
    ></sp-skeleton>
  `,
};

export default meta;
type Story = StoryObj<SpSkeletonProps>;

export const Text: Story = {
  render: () => html`
    <div style="width: 300px; display: flex; flex-direction: column; gap: 8px;">
      <sp-skeleton variant="text"></sp-skeleton>
      <sp-skeleton variant="text" width="80%"></sp-skeleton>
      <sp-skeleton variant="text" width="60%"></sp-skeleton>
    </div>
  `,
};

export const Circle: Story = {
  render: () => html`
    <sp-skeleton variant="circle" width="48px" height="48px"></sp-skeleton>
  `,
};

export const Rect: Story = {
  render: () => html`
    <sp-skeleton variant="rect" width="300px" height="160px"></sp-skeleton>
  `,
};

export const NotAnimated: Story = {
  render: () => html`
    <div style="width: 300px; display: flex; flex-direction: column; gap: 8px;">
      <sp-skeleton variant="text" ?animated=${false}></sp-skeleton>
      <sp-skeleton variant="text" width="75%" ?animated=${false}></sp-skeleton>
    </div>
  `,
};

export const CardSkeleton: Story = {
  render: () => html`
    <div style="width: 320px; padding: 16px; border: 1px solid #e5e7eb; border-radius: 8px; display: flex; flex-direction: column; gap: 12px;">
      <sp-skeleton variant="rect" width="100%" height="160px"></sp-skeleton>
      <div style="display: flex; align-items: center; gap: 12px;">
        <sp-skeleton variant="circle" width="40px" height="40px"></sp-skeleton>
        <div style="flex: 1; display: flex; flex-direction: column; gap: 6px;">
          <sp-skeleton variant="text" width="60%"></sp-skeleton>
          <sp-skeleton variant="text" width="40%"></sp-skeleton>
        </div>
      </div>
      <div style="display: flex; flex-direction: column; gap: 6px;">
        <sp-skeleton variant="text"></sp-skeleton>
        <sp-skeleton variant="text"></sp-skeleton>
        <sp-skeleton variant="text" width="70%"></sp-skeleton>
      </div>
    </div>
  `,
};

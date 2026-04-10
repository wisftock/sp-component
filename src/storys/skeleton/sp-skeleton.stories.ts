import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import type { SpSkeletonProps } from "../../components/skeleton/sp-skeleton.types.js";
import "../../components/skeleton/sp-skeleton.js";

const meta: Meta<SpSkeletonProps> = {
  title: "Components/Skeleton",
  component: "sp-skeleton",
  tags: ["autodocs"],
  argTypes: {
    variant: { control: "select", options: ["text", "title", "circle", "rect"] },
    width: { control: "text" },
    height: { control: "text" },
    animated: { control: "boolean" },
    lines: { control: { type: "number", min: 1, max: 10 } },
  },
  args: { variant: "text", width: "", height: "", animated: true, lines: 3 },
  render: ({ variant, width, height, animated, lines }) => html`
    <sp-skeleton
      variant=${variant}
      width=${width}
      height=${height}
      ?animated=${animated}
      .lines=${lines}
      style="display:block;width:280px;"
    ></sp-skeleton>
  `,
};

export default meta;
type Story = StoryObj<SpSkeletonProps>;

export const Text: Story = {
  render: () => html`
    <div style="width:300px;display:flex;flex-direction:column;gap:8px;">
      <sp-skeleton variant="text"></sp-skeleton>
      <sp-skeleton variant="text" width="80%"></sp-skeleton>
      <sp-skeleton variant="text" width="60%"></sp-skeleton>
    </div>
  `,
};

export const Title: Story = {
  render: () => html`
    <div style="width:300px;display:flex;flex-direction:column;gap:10px;">
      <sp-skeleton variant="title" width="60%"></sp-skeleton>
      <sp-skeleton variant="text"></sp-skeleton>
      <sp-skeleton variant="text" width="85%"></sp-skeleton>
      <sp-skeleton variant="text" width="70%"></sp-skeleton>
    </div>
  `,
};

export const Circle: Story = {
  render: () => html`
    <div style="display:flex;align-items:center;gap:12px;">
      <sp-skeleton variant="circle" width="32px" height="32px"></sp-skeleton>
      <sp-skeleton variant="circle" width="48px" height="48px"></sp-skeleton>
      <sp-skeleton variant="circle" width="64px" height="64px"></sp-skeleton>
    </div>
  `,
};

export const Rect: Story = {
  render: () => html`
    <sp-skeleton variant="rect" width="300px" height="160px"></sp-skeleton>
  `,
};

export const NotAnimated: Story = {
  render: () => html`
    <div style="width:300px;display:flex;flex-direction:column;gap:8px;">
      <sp-skeleton variant="text" ?animated=${false}></sp-skeleton>
      <sp-skeleton variant="text" width="75%" ?animated=${false}></sp-skeleton>
    </div>
  `,
};

export const CardSkeleton: Story = {
  render: () => html`
    <div style="width:320px;padding:16px;border:1px solid #e5e7eb;border-radius:8px;display:flex;flex-direction:column;gap:12px;">
      <sp-skeleton variant="rect" width="100%" height="160px"></sp-skeleton>
      <div style="display:flex;align-items:center;gap:12px;">
        <sp-skeleton variant="circle" width="40px" height="40px"></sp-skeleton>
        <div style="flex:1;display:flex;flex-direction:column;gap:6px;">
          <sp-skeleton variant="title" width="60%"></sp-skeleton>
          <sp-skeleton variant="text" width="40%"></sp-skeleton>
        </div>
      </div>
      <div style="display:flex;flex-direction:column;gap:6px;">
        <sp-skeleton variant="text"></sp-skeleton>
        <sp-skeleton variant="text"></sp-skeleton>
        <sp-skeleton variant="text" width="70%"></sp-skeleton>
      </div>
    </div>
  `,
};

export const TableSkeleton: Story = {
  render: () => html`
    <div style="width:500px;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;">
      <!-- Header row -->
      <div style="display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:16px;padding:12px 16px;background:#f9fafb;border-bottom:1px solid #e5e7eb;">
        ${[100, 70, 80, 60].map(w => html`<sp-skeleton variant="text" width="${w}%" ?animated=${false}></sp-skeleton>`)}
      </div>
      <!-- Data rows -->
      ${Array.from({ length: 5 }, () => html`
        <div style="display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:16px;padding:12px 16px;border-bottom:1px solid #f3f4f6;">
          ${[90, 60, 75, 50].map(w => html`<sp-skeleton variant="text" width="${w}%"></sp-skeleton>`)}
        </div>
      `)}
    </div>
  `,
};

export const ProfileSkeleton: Story = {
  render: () => html`
    <div style="width:320px;padding:24px;display:flex;flex-direction:column;align-items:center;gap:16px;border:1px solid #e5e7eb;border-radius:12px;">
      <sp-skeleton variant="circle" width="80px" height="80px"></sp-skeleton>
      <sp-skeleton variant="title" width="50%"></sp-skeleton>
      <sp-skeleton variant="text" width="70%"></sp-skeleton>
      <div style="width:100%;display:flex;gap:8px;justify-content:center;">
        <sp-skeleton variant="rect" width="80px" height="32px"></sp-skeleton>
        <sp-skeleton variant="rect" width="80px" height="32px"></sp-skeleton>
      </div>
    </div>
  `,
};

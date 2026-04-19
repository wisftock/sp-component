import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import type { SpAvatarProps } from "../../components/avatar/sp-avatar.types.js";
import "../../components/avatar/sp-avatar.js";
import "../../components/avatar/sp-avatar-group.js";

const meta: Meta<SpAvatarProps> = {
  title: "Components/Avatar",
  component: "sp-avatar",
  tags: ["autodocs"],
  argTypes: {
    src:      { control: "text",   description: "Image URL" },
    alt:      { control: "text",   description: "Image alt text" },
    initials: { control: "text",   description: "Initials shown when no image" },
    shape:    { control: "select", options: ["circle", "square"] },
    size:     { control: "select", options: ["sm", "md", "lg", "xl"] },
  },
  args: { src: "", alt: "", initials: "JD", shape: "circle", size: "md" },
  render: ({ src, alt, initials, shape, size }) => html`
    <sp-avatar
      src=${src || ""}
      alt=${alt || ""}
      initials=${initials || ""}
      shape=${shape}
      size=${size}
    ></sp-avatar>
  `,
};

export default meta;
type Story = StoryObj<SpAvatarProps>;

// ─── Single Avatar ──────────────────────────────────────────────────────────

export const Default: Story = {};

export const WithImage: Story = {
  args: { src: "https://i.pravatar.cc/150?img=3", alt: "User avatar", initials: "" },
};

export const WithInitials: Story = {
  args: { src: "", initials: "Jane Doe" },
};

export const Placeholder: Story = {
  args: { src: "", initials: "" },
};

export const Shapes: Story = {
  render: () => html`
    <div style="display:flex;gap:16px;align-items:center;">
      <sp-avatar src="https://i.pravatar.cc/150?img=5" shape="circle" size="lg"></sp-avatar>
      <sp-avatar src="https://i.pravatar.cc/150?img=5" shape="square" size="lg"></sp-avatar>
      <sp-avatar initials="AB" shape="circle" size="lg"></sp-avatar>
      <sp-avatar initials="AB" shape="square" size="lg"></sp-avatar>
    </div>
  `,
};

export const Sizes: Story = {
  render: () => html`
    <div style="display:flex;gap:16px;align-items:center;">
      <sp-avatar src="https://i.pravatar.cc/150?img=7" size="sm"></sp-avatar>
      <sp-avatar src="https://i.pravatar.cc/150?img=7" size="md"></sp-avatar>
      <sp-avatar src="https://i.pravatar.cc/150?img=7" size="lg"></sp-avatar>
      <sp-avatar src="https://i.pravatar.cc/150?img=7" size="xl"></sp-avatar>
    </div>
  `,
};

// ─── Avatar Group ───────────────────────────────────────────────────────────

export const Group: Story = {
  name: "Group — default (max 4)",
  render: () => html`
    <sp-avatar-group max="4" size="md">
      <sp-avatar src="https://i.pravatar.cc/150?img=1"></sp-avatar>
      <sp-avatar src="https://i.pravatar.cc/150?img=2"></sp-avatar>
      <sp-avatar src="https://i.pravatar.cc/150?img=3"></sp-avatar>
      <sp-avatar src="https://i.pravatar.cc/150?img=4"></sp-avatar>
      <sp-avatar src="https://i.pravatar.cc/150?img=5"></sp-avatar>
      <sp-avatar src="https://i.pravatar.cc/150?img=6"></sp-avatar>
    </sp-avatar-group>
  `,
};

export const GroupWithInitials: Story = {
  name: "Group — with initials",
  render: () => html`
    <sp-avatar-group max="3" size="md">
      <sp-avatar initials="Ana García"></sp-avatar>
      <sp-avatar initials="Bob Smith"></sp-avatar>
      <sp-avatar initials="Carlos López"></sp-avatar>
      <sp-avatar initials="Diana Chen"></sp-avatar>
      <sp-avatar initials="Eva Torres"></sp-avatar>
    </sp-avatar-group>
  `,
};

export const GroupSizes: Story = {
  name: "Group — all sizes",
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:20px;">
      ${(["sm","md","lg","xl"] as const).map(size => html`
        <div style="display:flex;align-items:center;gap:16px;">
          <span style="font-size:0.75rem;color:#6b7280;width:24px;">${size}</span>
          <sp-avatar-group size=${size} max="4">
            <sp-avatar src="https://i.pravatar.cc/150?img=10"></sp-avatar>
            <sp-avatar src="https://i.pravatar.cc/150?img=11"></sp-avatar>
            <sp-avatar src="https://i.pravatar.cc/150?img=12"></sp-avatar>
            <sp-avatar src="https://i.pravatar.cc/150?img=13"></sp-avatar>
            <sp-avatar src="https://i.pravatar.cc/150?img=14"></sp-avatar>
          </sp-avatar-group>
        </div>
      `)}
    </div>
  `,
};

export const GroupWithCustomTotal: Story = {
  name: "Group — custom total count",
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:12px;">
      <p style="margin:0;font-size:0.8rem;color:#6b7280;">
        Showing 3 avatars but indicating 47 total members.
      </p>
      <sp-avatar-group max="3" total="47" size="md">
        <sp-avatar src="https://i.pravatar.cc/150?img=20"></sp-avatar>
        <sp-avatar src="https://i.pravatar.cc/150?img=21"></sp-avatar>
        <sp-avatar src="https://i.pravatar.cc/150?img=22"></sp-avatar>
      </sp-avatar-group>
    </div>
  `,
};

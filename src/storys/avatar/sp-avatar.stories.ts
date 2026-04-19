import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import type { SpAvatarProps } from "../../components/avatar/sp-avatar.types.js";
import "../../components/avatar/sp-avatar.js";

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

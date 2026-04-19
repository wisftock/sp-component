import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import type { SpTimelineProps } from "../../components/timeline/sp-timeline.types.js";
import "../../components/timeline/sp-timeline.js";

const meta: Meta<SpTimelineProps> = {
  title: "Components/Timeline",
  component: "sp-timeline",
  tags: ["autodocs"],
  argTypes: {
    reverse: { control: "boolean", description: "Reverses the display order of items" },
  },
  args: {
    reverse: false,
  },
  render: (args) => html`
    <sp-timeline
      ?reverse=${args.reverse}
      .items=${[
        { label: "Account created", variant: "success" },
        { label: "Profile updated", variant: "default" },
        { label: "First login", variant: "info" },
      ]}
    ></sp-timeline>
  `,
};

export default meta;
type Story = StoryObj<SpTimelineProps>;

export const Default: Story = {};

export const WithDescriptions: Story = {
  render: () => html`
    <sp-timeline
      .items=${[
        { label: "Order placed", description: "Your order #1234 has been received and is being processed.", variant: "success" },
        { label: "Payment confirmed", description: "Payment of $49.99 was successfully processed.", variant: "info" },
        { label: "Preparing shipment", description: "Your items are being packed and prepared for delivery.", variant: "default" },
        { label: "Awaiting delivery", description: "Your package will arrive within 2-3 business days.", variant: "warning" },
      ]}
    ></sp-timeline>
  `,
};

export const WithTime: Story = {
  render: () => html`
    <sp-timeline
      .items=${[
        { label: "Meeting started", time: "09:00 AM", variant: "info" },
        { label: "Requirements reviewed", time: "09:30 AM", variant: "default" },
        { label: "Design approved", time: "10:15 AM", variant: "success" },
        { label: "Development kick-off", time: "11:00 AM", variant: "success" },
      ]}
    ></sp-timeline>
  `,
};

export const AllVariants: Story = {
  render: () => html`
    <sp-timeline
      .items=${[
        { label: "Default event", description: "This uses the default variant.", variant: "default" },
        { label: "Success event", description: "This action completed successfully.", variant: "success" },
        { label: "Warning event", description: "This requires your attention.", variant: "warning" },
        { label: "Error event", description: "This action failed.", variant: "error" },
        { label: "Info event", description: "Here is some useful information.", variant: "info" },
      ]}
    ></sp-timeline>
  `,
};

export const Reversed: Story = {
  render: () => html`
    <sp-timeline
      reverse
      .items=${[
        { label: "Step 1: Initiated", time: "Day 1", variant: "success" },
        { label: "Step 2: In Progress", time: "Day 3", variant: "info" },
        { label: "Step 3: Review", time: "Day 7", variant: "warning" },
        { label: "Step 4: Complete", time: "Day 10", variant: "success" },
      ]}
    ></sp-timeline>
  `,
};

import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import type { SpStepperProps } from "../../components/stepper/sp-stepper.types.js";
import "../../components/stepper/sp-stepper.js";

const meta: Meta<SpStepperProps> = {
  title: "Components/Stepper",
  component: "sp-stepper",
  tags: ["autodocs"],
  argTypes: {
    activeStep: {
      control: { type: "number", min: 0 },
      description: "Index of the currently active step (0-based)",
    },
    orientation: {
      control: "select",
      options: ["horizontal", "vertical"],
      description: "Layout direction of the stepper",
    },
    linear: {
      control: "boolean",
      description: "When true, prevents navigating ahead of active step",
    },
  },
  args: {
    activeStep: 0,
    orientation: "horizontal",
    linear: true,
  },
};

export default meta;
type Story = StoryObj<SpStepperProps>;

export const Default: Story = {
  render: () => html`
    <sp-stepper
      .steps=${[
        { label: "Account" },
        { label: "Profile" },
        { label: "Review" },
      ]}
      .activeStep=${1}
    ></sp-stepper>
  `,
};

export const WithDescriptions: Story = {
  render: () => html`
    <sp-stepper
      .steps=${[
        { label: "Account", description: "Create your account" },
        { label: "Profile", description: "Set up your profile" },
        { label: "Review", description: "Review and submit" },
      ]}
      .activeStep=${1}
    ></sp-stepper>
  `,
};

export const WithError: Story = {
  render: () => html`
    <sp-stepper
      .steps=${[
        { label: "Account" },
        { label: "Profile", status: "error" },
        { label: "Review" },
      ]}
      .activeStep=${1}
    ></sp-stepper>
  `,
};

export const Vertical: Story = {
  render: () => html`
    <div style="height: 200px;">
      <sp-stepper
        orientation="vertical"
        .steps=${[
          { label: "Account", description: "Create your account" },
          { label: "Profile", description: "Set up your profile" },
          { label: "Review", description: "Review and submit" },
        ]}
        .activeStep=${1}
      ></sp-stepper>
    </div>
  `,
};

export const NonLinear: Story = {
  render: () => html`
    <sp-stepper
      .linear=${false}
      .steps=${[
        { label: "Step 1" },
        { label: "Step 2" },
        { label: "Step 3" },
        { label: "Step 4" },
      ]}
      .activeStep=${1}
    ></sp-stepper>
  `,
};

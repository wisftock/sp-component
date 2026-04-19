import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import type { SpStepperProps } from "../../components/stepper/sp-stepper.types.js";
import "../../components/stepper/sp-stepper.js";
import "../../components/button/sp-button.js";

const meta: Meta<SpStepperProps> = {
  title: "Components/Stepper",
  component: "sp-stepper",
  tags: ["autodocs"],
  argTypes: {
    activeStep:   { control: { type: "number", min: 0 }, description: "Index of the currently active step (0-based)" },
    orientation:  { control: "select", options: ["horizontal", "vertical"], description: "Layout direction of the steps" },
    linear:       { control: "boolean", description: "When true, prevents jumping ahead of the active step" },
    editable:     { control: "boolean", description: "Allows clicking completed steps to go back" },
    showProgress: { control: "boolean", description: "Shows a 'Step N of M' text above the steps" },
  },
  args: { activeStep: 0, orientation: "horizontal", linear: true, editable: false, showProgress: false },
  render: (args) => html`
    <sp-stepper
      .steps=${[{ label: "Account" }, { label: "Profile" }, { label: "Review" }]}
      .activeStep=${args.activeStep}
      orientation=${args.orientation}
      ?linear=${args.linear}
      ?editable=${args.editable}
      ?show-progress=${args.showProgress}
    ></sp-stepper>
  `,
};

export default meta;
type Story = StoryObj<SpStepperProps>;

export const Default: Story = {};

export const Interactive: Story = {
  render: () => {
    const steps = [
      { label: "Account", description: "Create your account" },
      { label: "Profile", description: "Set up your profile" },
      { label: "Preferences", description: "Choose your preferences" },
      { label: "Review", description: "Review and submit" },
    ];
    let active = 0;

    const container = document.createElement("div");
    container.style.display = "flex";
    container.style.flexDirection = "column";
    container.style.gap = "24px";

    const stepper = document.createElement("sp-stepper") as any;
    stepper.steps = steps;
    stepper.activeStep = active;
    stepper.linear = true;

    const stepContent = document.createElement("div");
    stepContent.style.padding = "20px";
    stepContent.style.border = "1px solid #e5e7eb";
    stepContent.style.borderRadius = "8px";
    stepContent.style.minHeight = "80px";

    const actions = document.createElement("div");
    actions.style.display = "flex";
    actions.style.gap = "8px";
    actions.style.justifyContent = "flex-end";

    const updateUI = () => {
      stepper.activeStep = active;
      stepContent.innerHTML = `<p style="margin:0;font-size:14px;color:#374151;"><strong>${steps[active]?.label}</strong> — ${steps[active]?.description}</p>`;
      (backBtn as any).disabled = active === 0;
      (nextBtn as any).textContent = active === steps.length - 1 ? "Finish" : "Next";
    };

    const backBtn = document.createElement("sp-button") as any;
    backBtn.variant = "secondary";
    backBtn.textContent = "Back";
    backBtn.addEventListener("click", () => { if (active > 0) { active--; updateUI(); } });

    const nextBtn = document.createElement("sp-button") as any;
    nextBtn.variant = "primary";
    nextBtn.textContent = "Next";
    nextBtn.addEventListener("click", () => {
      if (active < steps.length - 1) { active++; updateUI(); }
      else { active = 0; updateUI(); }
    });

    actions.appendChild(backBtn);
    actions.appendChild(nextBtn);
    container.appendChild(stepper);
    container.appendChild(stepContent);
    container.appendChild(actions);

    updateUI();
    return html`${container}`;
  },
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
    <sp-stepper
      orientation="vertical"
      .steps=${[
        { label: "Account", description: "Create your account and verify your email address" },
        { label: "Profile", description: "Set up your public profile and preferences" },
        { label: "Review", description: "Review your information and submit" },
      ]}
      .activeStep=${1}
    ></sp-stepper>
  `,
};

export const VerticalWithProgress: Story = {
  render: () => html`
    <sp-stepper
      orientation="vertical"
      show-progress
      .steps=${[
        { label: "Step One", description: "First step of the process" },
        { label: "Step Two", description: "Second step of the process" },
        { label: "Step Three" },
        { label: "Step Four", optional: true },
      ]}
      .activeStep=${2}
    ></sp-stepper>
  `,
};

export const NonLinear: Story = {
  render: () => html`
    <sp-stepper
      .linear=${false}
      .steps=${[
        { label: "Step 1" }, { label: "Step 2" },
        { label: "Step 3" }, { label: "Step 4" },
      ]}
      .activeStep=${1}
    ></sp-stepper>
  `,
};

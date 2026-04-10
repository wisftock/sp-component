import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "../../components/onboarding/sp-onboarding.js";

const meta: Meta = {
  title: "Components/Onboarding",
  component: "sp-onboarding",
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  argTypes: {
    steps:       { control: "object",  description: "Array of step objects — each with title, description, and optional image or icon" },
    open:        { control: "boolean", description: "Controls modal visibility" },
    step:        { control: "number",  description: "Currently active step index (0-based)" },
    dismissable: { control: "boolean", description: "Shows a skip button and allows closing by clicking the backdrop" },
    finishLabel: { control: "text",    description: "Label for the button on the last step (default: 'Get started')" },
  },
};
export default meta;
type Story = StoryObj;

const STEPS = [
  { icon: "👋", title: "Welcome to the platform", description: "We're excited to have you here. Let's walk you through the key features so you can get the most out of your experience." },
  { icon: "🎨", title: "Customize your workspace", description: "Set up your theme, layout, and preferences. Everything can be configured to match your workflow." },
  { icon: "🤝", title: "Invite your team", description: "Collaboration is at the core. Invite teammates with a single click and work together in real time." },
  { icon: "🚀", title: "You're all set!", description: "You've completed the setup. Explore the dashboard and start building something great. We're here if you need help." },
];

export const Default: Story = {
  render: () => {
    let ob: any;
    return html`
      <div style="display:flex;align-items:center;justify-content:center;height:100vh;background:#f9fafb;">
        <button
          style="padding:11px 28px;background:#3b82f6;color:white;border:none;border-radius:8px;cursor:pointer;font-size:14px;font-weight:500;"
          @click=${() => { if (!ob) ob = document.querySelector("sp-onboarding"); ob!.open = true; ob!.step = 0; }}
        >Start onboarding</button>

        <sp-onboarding .steps=${STEPS} open></sp-onboarding>
      </div>
    `;
  },
};

export const WithImages: Story = {
  name: "With illustration images",
  render: () => {
    const steps = [
      { title: "Analyze your data", description: "Import your datasets and get instant insights with our powerful analytics engine.", image: "https://illustrations.popsy.co/amber/data-analysis.svg" },
      { title: "Build dashboards", description: "Create beautiful, interactive dashboards in minutes using our drag-and-drop builder.", image: "https://illustrations.popsy.co/amber/designer.svg" },
      { title: "Share & collaborate", description: "Publish your dashboards and share them with your team or the world.", image: "https://illustrations.popsy.co/amber/teamwork.svg" },
    ];
    let ob: any;
    return html`
      <div style="display:flex;align-items:center;justify-content:center;height:100vh;background:#f9fafb;">
        <button
          style="padding:11px 28px;background:#3b82f6;color:white;border:none;border-radius:8px;cursor:pointer;font-size:14px;font-weight:500;"
          @click=${() => { if (!ob) ob = document.querySelector("sp-onboarding"); ob!.open = true; ob!.step = 0; }}
        >Start tour</button>
        <sp-onboarding .steps=${steps} open finish-label="Start building →"></sp-onboarding>
      </div>
    `;
  },
};

export const NotDismissable: Story = {
  name: "Required (not dismissable)",
  render: () => html`
    <div style="display:flex;align-items:center;justify-content:center;height:100vh;background:#f9fafb;">
      <sp-onboarding
        .steps=${STEPS.slice(0, 3)}
        open
        ?dismissable=${false}
        finish-label="Accept & continue"
        @sp-finish=${() => alert("Onboarding complete!")}
      ></sp-onboarding>
    </div>
  `,
};

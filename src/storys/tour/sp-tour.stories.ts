import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "../../components/tour/sp-tour.js";

const STEPS = [
  { target: "#tour-new",      title: "Create new", content: "Start a new project from scratch or from a template.", placement: "bottom" as const },
  { target: "#tour-search",   title: "Search",     content: "Quickly find anything — files, people, commands.", placement: "bottom" as const },
  { target: "#tour-notif",    title: "Notifications", content: "Stay up to date with team activity and mentions.", placement: "bottom" as const },
  { target: "#tour-settings", title: "Settings",   content: "Customize your workspace, theme and integrations.", placement: "bottom" as const },
];

const meta: Meta = {
  title: "Components/Tour",
  component: "sp-tour",
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    steps:  { control: "object",  description: "Array of tour steps — each with target (CSS selector), content, and optional title and placement (top | bottom | left | right)" },
    step:   { control: "number",  description: "Currently active step index (0-based)" },
    active: { control: "boolean", description: "Shows or hides the tour overlay" },
  },
  args: {
    steps: STEPS,
    step: 0,
    active: false,
  },
  render: (args) => html`
    <div style="min-height:300px;background:#f9fafb;border-radius:8px;padding:32px;font-family:system-ui,sans-serif;">
      <header style="background:#fff;border-bottom:1px solid #e5e7eb;padding:0 24px;height:56px;display:flex;align-items:center;gap:12px;margin:-32px -32px 32px;border-radius:8px 8px 0 0;">
        <span style="font-weight:700;font-size:1.1rem;color:#111827;margin-right:auto;">MyApp</span>
        <button id="tour-new" style="padding:6px 14px;background:#3b82f6;color:#fff;border:none;border-radius:6px;cursor:pointer;font-size:14px;">+ New</button>
        <input id="tour-search" type="text" placeholder="Search…" style="padding:6px 12px;border:1px solid #d1d5db;border-radius:6px;font-size:14px;width:200px;"/>
        <button id="tour-notif" style="width:36px;height:36px;background:none;border:1px solid #d1d5db;border-radius:6px;cursor:pointer;font-size:18px;">🔔</button>
        <button id="tour-settings" style="width:36px;height:36px;background:none;border:1px solid #d1d5db;border-radius:6px;cursor:pointer;font-size:18px;">⚙</button>
      </header>
      <button
        style="padding:10px 24px;background:#6366f1;color:#fff;border:none;border-radius:8px;cursor:pointer;font-size:14px;font-weight:500;"
        @click=${() => {
          const t = document.querySelector("sp-tour") as any;
          if (t) { t.step = args.step ?? 0; t.active = true; }
        }}
      >Start Tour</button>
      <sp-tour
        .steps=${args.steps}
        .step=${args.step}
        ?active=${args.active}
      ></sp-tour>
    </div>
  `,
};
export default meta;
type Story = StoryObj;

function startTour() {
  const t = document.querySelector("sp-tour") as HTMLElement & { step: number; active: boolean };
  if (t) { t.step = 0; t.active = true; }
}

export const Default: Story = {
  name: "Product tour (4 steps)",
  render: () => html`
    <div style="
      min-height:100vh;
      background:var(--sp-bg,#f9fafb);
      font-family:system-ui,sans-serif;
    ">
      <!-- Fake app header -->
      <header style="
        background:#fff;border-bottom:1px solid #e5e7eb;
        padding:0 24px;height:56px;display:flex;align-items:center;gap:12px;
      ">
        <span style="font-weight:700;font-size:1.1rem;color:#111827;margin-right:auto;">MyApp</span>

        <button id="tour-new"
          style="padding:6px 14px;background:#3b82f6;color:#fff;border:none;border-radius:6px;cursor:pointer;font-size:14px;">
          + New
        </button>

        <input id="tour-search"
          type="text" placeholder="Search…"
          style="padding:6px 12px;border:1px solid #d1d5db;border-radius:6px;font-size:14px;width:200px;outline:none;"
        />

        <button id="tour-notif"
          style="width:36px;height:36px;background:none;border:1px solid #d1d5db;border-radius:6px;cursor:pointer;font-size:18px;">
          🔔
        </button>

        <button id="tour-settings"
          style="width:36px;height:36px;background:none;border:1px solid #d1d5db;border-radius:6px;cursor:pointer;font-size:18px;">
          ⚙
        </button>
      </header>

      <!-- Page content -->
      <main style="padding:32px 24px;">
        <div style="
          background:#fff;border-radius:12px;border:1px solid #e5e7eb;
          padding:32px;max-width:600px;
        ">
          <h2 style="margin:0 0 8px;color:#111827;">Welcome!</h2>
          <p style="margin:0 0 20px;color:#6b7280;font-size:14px;">
            Click the button below to start the guided tour of the interface.
          </p>

          <button
            style="padding:10px 24px;background:#6366f1;color:#fff;border:none;border-radius:8px;cursor:pointer;font-size:14px;font-weight:500;"
            @click=${() => startTour()}
          >
            Start Tour
          </button>

          <div id="tour-status" style="margin-top:16px;font-size:13px;color:#6366f1;font-family:monospace;min-height:20px;"></div>
        </div>
      </main>
    </div>

    <sp-tour
      .steps=${STEPS}
      @sp-step-change=${(e: CustomEvent) => {
        const el = document.getElementById("tour-status");
        if (el) el.textContent = `Step ${e.detail.step + 1} of ${STEPS.length}`;
      }}
      @sp-finish=${() => {
        const el = document.getElementById("tour-status");
        if (el) el.textContent = "Tour completed!";
      }}
      @sp-skip=${() => {
        const el = document.getElementById("tour-status");
        if (el) el.textContent = "Tour skipped.";
      }}
    ></sp-tour>
  `,
};

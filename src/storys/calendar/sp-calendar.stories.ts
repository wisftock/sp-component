import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import type { SpCalendarProps } from "../../components/calendar/sp-calendar.types.js";
import "../../components/calendar/sp-calendar.js";

const meta: Meta<SpCalendarProps> = {
  title: "Components/Calendar",
  component: "sp-calendar",
  tags: ["autodocs"],
  argTypes: {
    value: {
      control: "text",
      description: "Selected date in ISO format (YYYY-MM-DD)",
    },
    min: {
      control: "text",
      description: "Minimum selectable date (YYYY-MM-DD)",
    },
    max: {
      control: "text",
      description: "Maximum selectable date (YYYY-MM-DD)",
    },
    locale: {
      control: "text",
      description: "BCP 47 locale (e.g. en-US, es, fr)",
    },
    firstDayOfWeek: {
      control: "select",
      options: [0, 1],
      description: "First day of week: 0=Sunday, 1=Monday",
    },
    disabled: {
      control: "boolean",
      description: "Disables all interaction",
    },
    readonly: {
      control: "boolean",
      description: "Allows navigation but not selection",
    },
  },
  args: {
    value: "",
    min: "",
    max: "",
    locale: "",
    firstDayOfWeek: 1,
    disabled: false,
    readonly: false,
  },
  render: ({ value, min, max, locale, firstDayOfWeek, disabled, readonly }) => html`
    <sp-calendar
      value=${value || ""}
      min=${min || ""}
      max=${max || ""}
      locale=${locale || ""}
      first-day-of-week=${firstDayOfWeek}
      ?disabled=${disabled}
      ?readonly=${readonly}
    ></sp-calendar>
  `,
};

export default meta;
type Story = StoryObj<SpCalendarProps>;

export const Default: Story = {};

export const WithSelectedDate: Story = {
  name: "With Selected Date",
  args: { value: "2025-06-15" },
};

export const WithMinMax: Story = {
  name: "With Min / Max Range",
  args: {
    min: "2025-06-05",
    max: "2025-06-25",
  },
};

export const Disabled: Story = {
  args: { disabled: true, value: "2025-06-15" },
};

export const Readonly: Story = {
  args: { readonly: true, value: "2025-06-15" },
};

export const SundayStart: Story = {
  name: "Week starts on Sunday",
  args: { firstDayOfWeek: 0 },
};

export const LocaleEs: Story = {
  name: "Locale: español",
  args: { locale: "es", firstDayOfWeek: 1 },
};

export const LocaleFr: Story = {
  name: "Locale: français",
  args: { locale: "fr", firstDayOfWeek: 1 },
};

export const WithEventLog: Story = {
  name: "Event Log (sp-change)",
  render: () => html`
    <div style="display:flex;gap:32px;align-items:flex-start;flex-wrap:wrap;">
      <sp-calendar
        @sp-change=${(e: CustomEvent<{ value: string }>) => {
          const log = document.getElementById("cal-log");
          if (log) log.textContent = `sp-change → value: "${e.detail.value}"`;
        }}
      ></sp-calendar>
      <div style="padding-top:8px;">
        <p style="margin:0 0 8px;font-size:0.8rem;color:#64748b;font-family:monospace;">Event output:</p>
        <code id="cal-log" style="font-size:0.85rem;color:#6366f1;">— select a date —</code>
      </div>
    </div>
  `,
};

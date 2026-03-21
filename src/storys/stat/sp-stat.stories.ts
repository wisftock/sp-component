import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import type { SpStatProps } from "../../components/stat/sp-stat.types.js";
import "../../components/stat/sp-stat.js";

const meta: Meta<SpStatProps> = {
  title: "Components/Stat",
  component: "sp-stat",
  tags: ["autodocs"],
  argTypes: {
    label: { control: "text", description: "Descriptive label for the metric" },
    value: { control: "text", description: "Primary value to display" },
    prefix: { control: "text", description: "Text before value (e.g. $)" },
    suffix: { control: "text", description: "Text after value (e.g. %)" },
    trend: {
      control: "select",
      options: ["up", "down", "neutral"],
      description: "Trend direction",
    },
    trendValue: { control: "text", description: "Trend description text" },
    description: { control: "text", description: "Additional context text" },
  },
  args: {
    label: "Total Revenue",
    value: "42,500",
    prefix: "$",
    suffix: "",
    trend: "neutral",
    trendValue: "",
    description: "",
  },
};

export default meta;
type Story = StoryObj<SpStatProps>;

export const Default: Story = {
  render: () => html`
    <div style="padding: 24px; background: white; border-radius: 8px; border: 1px solid #e5e7eb; width: 200px;">
      <sp-stat label="Total Users" value="12,340"></sp-stat>
    </div>
  `,
};

export const WithTrendUp: Story = {
  render: () => html`
    <div style="padding: 24px; background: white; border-radius: 8px; border: 1px solid #e5e7eb; width: 220px;">
      <sp-stat
        label="Monthly Revenue"
        value="48,200"
        prefix="$"
        trend="up"
        trendValue="+12.5% vs last month"
      ></sp-stat>
    </div>
  `,
};

export const WithTrendDown: Story = {
  render: () => html`
    <div style="padding: 24px; background: white; border-radius: 8px; border: 1px solid #e5e7eb; width: 220px;">
      <sp-stat
        label="Churn Rate"
        value="3.2"
        suffix="%"
        trend="down"
        trendValue="-0.8% vs last month"
      ></sp-stat>
    </div>
  `,
};

export const WithPrefixSuffix: Story = {
  render: () => html`
    <div style="display: flex; gap: 24px; flex-wrap: wrap;">
      <div style="padding: 24px; background: white; border-radius: 8px; border: 1px solid #e5e7eb; width: 180px;">
        <sp-stat label="Revenue" value="9,200" prefix="$"></sp-stat>
      </div>
      <div style="padding: 24px; background: white; border-radius: 8px; border: 1px solid #e5e7eb; width: 180px;">
        <sp-stat label="Conversion" value="5.4" suffix="%"></sp-stat>
      </div>
      <div style="padding: 24px; background: white; border-radius: 8px; border: 1px solid #e5e7eb; width: 180px;">
        <sp-stat label="Score" value="9.1" prefix="" suffix="/ 10"></sp-stat>
      </div>
    </div>
  `,
};

export const WithDescription: Story = {
  render: () => html`
    <div style="padding: 24px; background: white; border-radius: 8px; border: 1px solid #e5e7eb; width: 240px;">
      <sp-stat
        label="Active Sessions"
        value="1,847"
        trend="up"
        trendValue="+234 today"
        description="Across all platforms and devices"
      ></sp-stat>
    </div>
  `,
};

export const StatGrid: Story = {
  render: () => html`
    <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px;">
      <div style="padding: 24px; background: white; border-radius: 8px; border: 1px solid #e5e7eb;">
        <sp-stat
          label="Total Revenue"
          value="84,200"
          prefix="$"
          trend="up"
          trendValue="+8.2%"
        ></sp-stat>
      </div>
      <div style="padding: 24px; background: white; border-radius: 8px; border: 1px solid #e5e7eb;">
        <sp-stat
          label="Active Users"
          value="12,450"
          trend="up"
          trendValue="+1,200"
        ></sp-stat>
      </div>
      <div style="padding: 24px; background: white; border-radius: 8px; border: 1px solid #e5e7eb;">
        <sp-stat
          label="Churn Rate"
          value="2.8"
          suffix="%"
          trend="down"
          trendValue="-0.3%"
        ></sp-stat>
      </div>
      <div style="padding: 24px; background: white; border-radius: 8px; border: 1px solid #e5e7eb;">
        <sp-stat
          label="Satisfaction"
          value="4.8"
          suffix="/ 5"
          trend="neutral"
          trendValue="no change"
        ></sp-stat>
      </div>
    </div>
  `,
};

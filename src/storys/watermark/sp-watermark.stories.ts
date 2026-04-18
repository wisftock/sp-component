import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "../../components/watermark/sp-watermark.js";

const meta: Meta = {
  title: "Components/Watermark",
  component: "sp-watermark",
  tags: ["autodocs"],
  argTypes: {
    text: { control: "text", description: "Texto de la marca de agua" },
    opacity: { control: { type: "range", min: 0, max: 1, step: 0.05 }, description: "Opacidad (0-1)" },
    rotate: { control: "number", description: "Ángulo de rotación en grados" },
    "gap-x": { control: "number" },
    "gap-y": { control: "number" },
    color: { control: "color" },
    font: { control: "text" },
  },
  args: { text: "CONFIDENCIAL", opacity: 0.15, rotate: -22, "gap-x": 200, "gap-y": 140, color: "#000", font: "14px sans-serif" },
  render: ({ text, opacity, rotate, color, font }) => html`
    <sp-watermark text=${text} opacity=${opacity} rotate=${rotate} color=${color} font=${font}>
      <div style="padding:40px;background:white;border-radius:8px;border:1px solid #e5e7eb;min-height:200px;">
        <h3 style="margin:0 0 12px;font-size:18px;">Documento confidencial</h3>
        <p style="margin:0 0 8px;color:#374151;">Este es el contenido del documento protegido con marca de agua.</p>
        <p style="margin:0;color:#6b7280;font-size:14px;">La marca de agua aparece como una capa semitransparente sobre todo el contenido.</p>
      </div>
    </sp-watermark>
  `,
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const Draft: Story = {
  args: { text: "BORRADOR", opacity: 0.12, color: "#3b82f6" },
};

export const Internal: Story = {
  args: { text: "USO INTERNO", opacity: 0.1, rotate: -30 },
};

export const Preview: Story = {
  args: { text: "VISTA PREVIA", opacity: 0.2, color: "#6b7280" },
};

export const LowOpacity: Story = {
  args: { opacity: 0.05 },
};

export const HighOpacity: Story = {
  args: { opacity: 0.3 },
};

export const OnDocument: Story = {
  render: () => html`
    <sp-watermark text="CONFIDENCIAL" opacity=${0.12} rotate=${-22}>
      <div style="padding:32px;background:white;border-radius:8px;border:1px solid #e5e7eb;max-width:600px;">
        <h2 style="margin:0 0 16px;">Reporte Financiero Q1 2025</h2>
        <p style="margin:0 0 12px;color:#374151;">Este reporte contiene información financiera sensible de la empresa. Su distribución está restringida a personal autorizado.</p>
        <table style="width:100%;border-collapse:collapse;font-size:14px;margin-top:16px;">
          <tr style="background:#f9fafb;">
            <th style="padding:8px 12px;text-align:left;border:1px solid #e5e7eb;">Concepto</th>
            <th style="padding:8px 12px;text-align:right;border:1px solid #e5e7eb;">Q1 2025</th>
            <th style="padding:8px 12px;text-align:right;border:1px solid #e5e7eb;">Variación</th>
          </tr>
          <tr>
            <td style="padding:8px 12px;border:1px solid #e5e7eb;">Ingresos</td>
            <td style="padding:8px 12px;text-align:right;border:1px solid #e5e7eb;">$1,240,000</td>
            <td style="padding:8px 12px;text-align:right;border:1px solid #e5e7eb;color:#10b981;">+18%</td>
          </tr>
          <tr>
            <td style="padding:8px 12px;border:1px solid #e5e7eb;">Gastos operativos</td>
            <td style="padding:8px 12px;text-align:right;border:1px solid #e5e7eb;">$890,000</td>
            <td style="padding:8px 12px;text-align:right;border:1px solid #e5e7eb;color:#ef4444;">+5%</td>
          </tr>
        </table>
      </div>
    </sp-watermark>
  `,
};

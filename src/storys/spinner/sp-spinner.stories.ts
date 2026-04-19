import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import type { SpSpinnerProps } from "../../components/spinner/sp-spinner.types.js";
import "../../components/spinner/sp-spinner.js";

const meta: Meta<SpSpinnerProps> = {
  title: "Components/Spinner",
  component: "sp-spinner",
  tags: ["autodocs"],
  argTypes: {
    size:    { control: "select", options: ["sm", "md", "lg", "xl"] },
    variant: { control: "select", options: ["arc", "ring", "dots", "bars", "pulse"] },
    label:   { control: "text" },
  },
  args: { size: "md", variant: "arc", label: "Loading..." },
  render: ({ size, variant, label }) => html`
    <sp-spinner size=${size} variant=${variant} label=${label}></sp-spinner>
  `,
};

export default meta;
type Story = StoryObj<SpSpinnerProps>;

export const Default: Story = {};

export const Variantes: Story = {
  render: () => html`
    <div style="display:flex;align-items:center;gap:32px;padding:24px;flex-wrap:wrap;">
      ${(["arc","ring","dots","bars","pulse"] as const).map(v => html`
        <div style="display:flex;flex-direction:column;align-items:center;gap:10px;">
          <sp-spinner size="lg" variant=${v}></sp-spinner>
          <span style="font-size:12px;color:#6b7280;font-weight:500;">${v}</span>
        </div>
      `)}
    </div>
  `,
};

export const Sizes: Story = {
  render: () => html`
    <div style="display:flex;align-items:center;gap:24px;padding:16px;">
      ${(["sm","md","lg","xl"] as const).map(s => html`
        <div style="text-align:center;">
          <sp-spinner size=${s}></sp-spinner>
          <p style="margin:8px 0 0;font-size:12px;color:#6b7280;">${s}</p>
        </div>
      `)}
    </div>
  `,
};

export const Colores: Story = {
  render: () => html`
    <div style="display:flex;align-items:center;gap:20px;padding:16px;flex-wrap:wrap;">
      ${["#3b82f6","#10b981","#f59e0b","#ef4444","#8b5cf6","#ec4899","#14b8a6"].map(c => html`
        <sp-spinner size="lg" style="color:${c};"></sp-spinner>
      `)}
    </div>
  `,
};

export const VariantesConColores: Story = {
  name: "Variantes + Colores",
  render: () => html`
    <div style="display:flex;align-items:center;gap:28px;padding:24px;flex-wrap:wrap;">
      <sp-spinner size="lg" variant="arc"   style="color:#3b82f6;"></sp-spinner>
      <sp-spinner size="lg" variant="ring"  style="color:#10b981;"></sp-spinner>
      <sp-spinner size="lg" variant="dots"  style="color:#f59e0b;"></sp-spinner>
      <sp-spinner size="lg" variant="bars"  style="color:#ef4444;"></sp-spinner>
      <sp-spinner size="lg" variant="pulse" style="color:#8b5cf6;"></sp-spinner>
    </div>
  `,
};

export const InlineWithText: Story = {
  name: "Inline con texto",
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:12px;padding:16px;">
      <div style="display:flex;align-items:center;gap:8px;font-size:14px;color:#374151;">
        <sp-spinner size="sm"></sp-spinner><span>Cargando datos...</span>
      </div>
      <div style="display:flex;align-items:center;gap:8px;font-size:14px;color:#374151;">
        <sp-spinner size="md"></sp-spinner><span>Procesando solicitud...</span>
      </div>
      <div style="display:flex;align-items:center;gap:8px;font-size:14px;color:#6b7280;">
        <sp-spinner size="sm" variant="dots"></sp-spinner><span>Sincronizando...</span>
      </div>
    </div>
  `,
};

export const InsideButton: Story = {
  name: "Dentro de botón",
  render: () => html`
    <div style="display:flex;gap:12px;flex-wrap:wrap;">
      <button style="display:inline-flex;align-items:center;gap:8px;padding:8px 16px;background:#6366f1;color:white;border:none;border-radius:6px;cursor:pointer;font-size:14px;font-weight:500;">
        <sp-spinner size="sm" style="color:white;"></sp-spinner> Guardando...
      </button>
      <button style="display:inline-flex;align-items:center;gap:8px;padding:8px 16px;background:white;color:#374151;border:1px solid #d1d5db;border-radius:6px;cursor:pointer;font-size:14px;font-weight:500;">
        <sp-spinner size="sm" style="color:#6b7280;" variant="ring"></sp-spinner> Cargando
      </button>
      <button style="display:inline-flex;align-items:center;gap:8px;padding:8px 16px;background:#10b981;color:white;border:none;border-radius:6px;cursor:pointer;font-size:14px;font-weight:500;">
        <sp-spinner size="sm" style="color:white;" variant="dots"></sp-spinner> Procesando
      </button>
    </div>
  `,
};

export const OverlayCard: Story = {
  name: "Overlay sobre card",
  render: () => html`
    <div style="position:relative;width:320px;padding:24px;border:1px solid #e5e7eb;border-radius:8px;min-height:120px;">
      <p style="margin:0;font-size:14px;color:#374151;">Contenido que está cargando...</p>
      <p style="margin:8px 0 0;font-size:13px;color:#9ca3af;">Más contenido aquí</p>
      <div style="position:absolute;inset:0;background:rgba(255,255,255,0.85);border-radius:8px;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:8px;backdrop-filter:blur(2px);">
        <sp-spinner size="lg"></sp-spinner>
        <span style="font-size:13px;color:#6b7280;">Cargando...</span>
      </div>
    </div>
  `,
};

export const FullPageOverlay: Story = {
  name: "Overlay página completa",
  render: () => html`
    <div style="position:relative;width:100%;height:300px;background:#f9fafb;border-radius:8px;border:1px solid #e5e7eb;overflow:hidden;">
      <div style="padding:24px;">
        <div style="height:16px;background:#e5e7eb;border-radius:4px;margin-bottom:12px;width:60%;"></div>
        <div style="height:12px;background:#e5e7eb;border-radius:4px;margin-bottom:8px;width:80%;"></div>
        <div style="height:12px;background:#e5e7eb;border-radius:4px;width:40%;"></div>
      </div>
      <div style="position:absolute;inset:0;background:rgba(249,250,251,0.9);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;">
        <sp-spinner size="xl" variant="arc" style="color:#6366f1;"></sp-spinner>
        <div style="text-align:center;">
          <p style="margin:0;font-size:16px;font-weight:600;color:#111827;">Cargando aplicación</p>
          <p style="margin:4px 0 0;font-size:14px;color:#6b7280;">Por favor espere...</p>
        </div>
      </div>
    </div>
  `,
};

export const FondoOscuro: Story = {
  name: "Sobre fondo oscuro",
  render: () => html`
    <div style="background:#0f172a;padding:40px;border-radius:12px;display:flex;align-items:center;gap:40px;flex-wrap:wrap;">
      ${(["arc","ring","dots","bars","pulse"] as const).map(v => html`
        <div style="display:flex;flex-direction:column;align-items:center;gap:10px;">
          <sp-spinner size="lg" variant=${v} style="color:#818cf8;"></sp-spinner>
          <span style="font-size:11px;color:#64748b;font-weight:500;">${v}</span>
        </div>
      `)}
    </div>
  `,
};

export const EstadosCarga: Story = {
  name: "Estados de carga",
  render: () => html`
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px;max-width:600px;">
      ${[
        { label: "Subiendo archivo", pct: "45%", color: "#3b82f6", variant: "arc" },
        { label: "Analizando datos", pct: "72%", color: "#8b5cf6", variant: "ring" },
        { label: "Generando reporte", pct: "91%", color: "#10b981", variant: "dots" },
      ].map(({ label, pct, color, variant }) => html`
        <div style="padding:20px;border:1px solid #e5e7eb;border-radius:10px;text-align:center;display:flex;flex-direction:column;align-items:center;gap:12px;background:#fff;">
          <sp-spinner size="lg" variant=${variant as any} style="color:${color};"></sp-spinner>
          <div>
            <p style="margin:0;font-size:13px;font-weight:600;color:#111827;">${label}</p>
            <p style="margin:4px 0 0;font-size:20px;font-weight:700;color:${color};">${pct}</p>
          </div>
        </div>
      `)}
    </div>
  `,
};

export const SkeletonWithSpinner: Story = {
  name: "Skeleton + spinner",
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:20px;max-width:480px;">
      <div style="position:relative;padding:20px;border:1px solid #e5e7eb;border-radius:12px;background:#fff;">
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:14px;">
          <div style="width:40px;height:40px;border-radius:50%;background:#e5e7eb;animation:pulse 1.5s ease-in-out infinite;"></div>
          <div style="flex:1;">
            <div style="height:12px;background:#e5e7eb;border-radius:4px;margin-bottom:6px;width:60%;animation:pulse 1.5s ease-in-out infinite;"></div>
            <div style="height:10px;background:#e5e7eb;border-radius:4px;width:40%;animation:pulse 1.5s ease-in-out infinite;"></div>
          </div>
        </div>
        <div style="height:10px;background:#e5e7eb;border-radius:4px;margin-bottom:8px;animation:pulse 1.5s ease-in-out infinite;"></div>
        <div style="height:10px;background:#e5e7eb;border-radius:4px;margin-bottom:8px;width:80%;animation:pulse 1.5s ease-in-out infinite;"></div>
        <div style="height:10px;background:#e5e7eb;border-radius:4px;width:55%;animation:pulse 1.5s ease-in-out infinite;"></div>
        <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);">
          <sp-spinner size="md" style="color:#6366f1;"></sp-spinner>
        </div>
      </div>
      <style>@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}</style>
    </div>
  `,
};

export const MultiStepLoading: Story = {
  name: "Pasos de carga secuencial",
  render: () => html`
    <div style="max-width:380px;padding:24px;border:1px solid #e5e7eb;border-radius:16px;background:#fff;">
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:20px;">
        <sp-spinner size="lg" variant="arc" style="color:#6366f1;"></sp-spinner>
        <div>
          <p style="margin:0;font-size:15px;font-weight:700;color:#111827;">Iniciando sesión</p>
          <p style="margin:2px 0 0;font-size:13px;color:#6b7280;">Verificando credenciales...</p>
        </div>
      </div>
      <div style="display:flex;flex-direction:column;gap:10px;">
        ${[
          { step: "Autenticando usuario", done: true, color: "#10b981" },
          { step: "Cargando permisos", done: true, color: "#10b981" },
          { step: "Sincronizando datos", done: false, color: "#6366f1" },
          { step: "Preparando interfaz", done: false, color: "#d1d5db" },
        ].map(({ step, done, color }) => html`
          <div style="display:flex;align-items:center;gap:10px;">
            ${done
              ? html`<div style="width:18px;height:18px;border-radius:50%;background:#ecfdf5;border:1.5px solid #10b981;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                  <svg width="10" height="10" viewBox="0 0 10 10"><polyline points="1.5,5 4,7.5 8.5,2.5" stroke="#10b981" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </div>`
              : html`<sp-spinner size="sm" style="color:${color};flex-shrink:0;"></sp-spinner>`}
            <span style="font-size:13px;color:${done ? '#6b7280' : '#111827'};font-weight:${done ? '400' : '500'};">${step}</span>
          </div>
        `)}
      </div>
    </div>
  `,
};

export const SpinnerTarjetas: Story = {
  name: "Tarjetas de estado",
  render: () => html`
    <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:16px;max-width:520px;">
      ${[
        { title: "Procesando pago", sub: "Visa ···· 4242", variant: "arc", color: "#6366f1", bg: "#f5f3ff" },
        { title: "Enviando email", sub: "ana@empresa.com", variant: "dots", color: "#0ea5e9", bg: "#f0f9ff" },
        { title: "Exportando PDF", sub: "reporte-q1-2026.pdf", variant: "bars", color: "#10b981", bg: "#f0fdf4" },
        { title: "Actualizando BD", sub: "12,450 registros", variant: "ring", color: "#f59e0b", bg: "#fffbeb" },
      ].map(({ title, sub, variant, color, bg }) => html`
        <div style="padding:18px;border-radius:12px;background:${bg};border:1px solid ${color}22;display:flex;align-items:center;gap:14px;">
          <sp-spinner size="md" variant=${variant as any} style="color:${color};flex-shrink:0;"></sp-spinner>
          <div>
            <p style="margin:0;font-size:13px;font-weight:600;color:#111827;">${title}</p>
            <p style="margin:3px 0 0;font-size:11px;color:#6b7280;">${sub}</p>
          </div>
        </div>
      `)}
    </div>
  `,
};

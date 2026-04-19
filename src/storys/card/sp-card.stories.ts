import type { Meta, StoryObj } from "@storybook/web-components";
import { html, nothing } from "lit";
import type { SpCardProps } from "../../components/card/sp-card.types.js";
import "../../components/card/sp-card.js";

const meta: Meta<SpCardProps> = {
  title: "Components/Card",
  component: "sp-card",
  tags: ["autodocs"],
  argTypes: {
    shadow: {
      control: "select",
      options: ["none", "sm", "md", "lg"],
      description: "Shadow depth of the card",
    },
    bordered: {
      control: "boolean",
      description: "Adds a border around the card",
    },
    padding: {
      control: "text",
      description: "Inner padding (CSS value)",
    },
  },
  args: {
    shadow: "sm",
    bordered: false,
    padding: "16px",
  },
  render: ({ shadow, bordered, padding }) => html`
    <sp-card
      shadow=${shadow}
      ?bordered=${bordered}
      padding=${padding || nothing}
      style="max-width: 360px;"
    >
      <p>Card content goes here.</p>
    </sp-card>
  `,
};

export default meta;
type Story = StoryObj<SpCardProps>;

export const Default: Story = {
  args: { shadow: "sm" },
};

export const WithHeader: Story = {
  render: () => html`
    <sp-card shadow="sm" style="max-width: 360px;">
      <span slot="header">Card Title</span>
      <p>This card has a header slot with a title.</p>
    </sp-card>
  `,
};

export const WithFooter: Story = {
  render: () => html`
    <sp-card shadow="sm" style="max-width: 360px;">
      <p>Card body content.</p>
      <div slot="footer" style="display: flex; justify-content: flex-end; gap: 8px;">
        <button>Cancel</button>
        <button>Confirm</button>
      </div>
    </sp-card>
  `,
};

export const WithImage: Story = {
  render: () => html`
    <sp-card shadow="md" padding="0" style="max-width: 360px;">
      <img slot="image" src="https://picsum.photos/seed/card/360/180" alt="Card image" />
      <div style="padding: 16px;">
        <p>Card with an image in the image slot.</p>
      </div>
    </sp-card>
  `,
};

export const Bordered: Story = {
  render: () => html`
    <sp-card shadow="none" bordered style="max-width: 360px;">
      <span slot="header">Bordered Card</span>
      <p>This card has no shadow but a border.</p>
    </sp-card>
  `,
};

export const AllShadows: Story = {
  render: () => html`
    <div style="display: flex; flex-wrap: wrap; gap: 24px;">
      <sp-card shadow="none" style="max-width: 200px;">
        <span slot="header">No shadow</span>
        <p>shadow="none"</p>
      </sp-card>
      <sp-card shadow="sm" style="max-width: 200px;">
        <span slot="header">Small shadow</span>
        <p>shadow="sm"</p>
      </sp-card>
      <sp-card shadow="md" style="max-width: 200px;">
        <span slot="header">Medium shadow</span>
        <p>shadow="md"</p>
      </sp-card>
      <sp-card shadow="lg" style="max-width: 200px;">
        <span slot="header">Large shadow</span>
        <p>shadow="lg"</p>
      </sp-card>
    </div>
  `,
};

export const CardGrid: Story = {
  render: () => html`
    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; max-width: 800px;">
      ${[1, 2, 3, 4, 5, 6].map(
        (n) => html`
          <sp-card shadow="sm" bordered>
            <span slot="header">Card ${n}</span>
            <p>Content for card ${n}.</p>
            <span slot="footer">Footer ${n}</span>
          </sp-card>
        `,
      )}
    </div>
  `,
};

export const ProfileCard: Story = {
  name: "Tarjeta de perfil",
  render: () => html`
    <div style="display:flex;gap:20px;flex-wrap:wrap;">
      ${[
        { name: "Ana García", role: "Lead Designer", dept: "Producto", avatar: "AG", color: "#6366f1", joined: "Mar 2023", projects: 24, reviews: 148 },
        { name: "Carlos López", role: "Senior Dev", dept: "Engineering", avatar: "CL", color: "#0ea5e9", joined: "Jan 2022", projects: 38, reviews: 312 },
        { name: "María Ruiz", role: "Product Manager", dept: "Estrategia", avatar: "MR", color: "#10b981", joined: "Jun 2024", projects: 12, reviews: 67 },
      ].map(({ name, role, dept, avatar, color, joined, projects, reviews }) => html`
        <sp-card shadow="md" style="width:240px;">
          <div style="display:flex;flex-direction:column;align-items:center;padding:8px 0 16px;">
            <div style="width:64px;height:64px;border-radius:50%;background:linear-gradient(135deg,${color},${color}99);display:flex;align-items:center;justify-content:center;margin-bottom:12px;box-shadow:0 4px 12px ${color}44;">
              <span style="color:white;font-size:22px;font-weight:700;">${avatar}</span>
            </div>
            <p style="margin:0;font-size:15px;font-weight:700;color:#111827;">${name}</p>
            <p style="margin:3px 0 0;font-size:12px;color:#6b7280;">${role}</p>
            <span style="margin-top:8px;padding:3px 10px;border-radius:20px;background:${color}15;color:${color};font-size:11px;font-weight:600;">${dept}</span>
            <div style="display:flex;gap:24px;margin-top:16px;padding-top:14px;border-top:1px solid #f3f4f6;width:100%;">
              <div style="text-align:center;flex:1;">
                <p style="margin:0;font-size:18px;font-weight:700;color:#111827;">${projects}</p>
                <p style="margin:2px 0 0;font-size:10px;color:#9ca3af;">Proyectos</p>
              </div>
              <div style="width:1px;background:#f3f4f6;"></div>
              <div style="text-align:center;flex:1;">
                <p style="margin:0;font-size:18px;font-weight:700;color:#111827;">${reviews}</p>
                <p style="margin:2px 0 0;font-size:10px;color:#9ca3af;">Reviews</p>
              </div>
            </div>
          </div>
          <div slot="footer" style="display:flex;gap:8px;">
            <button style="flex:1;padding:8px;border:1px solid ${color};color:${color};background:transparent;border-radius:6px;cursor:pointer;font-size:12px;font-weight:600;">Mensaje</button>
            <button style="flex:1;padding:8px;background:${color};color:white;border:none;border-radius:6px;cursor:pointer;font-size:12px;font-weight:600;">Ver perfil</button>
          </div>
        </sp-card>
      `)}
    </div>
  `,
};

export const PricingCards: Story = {
  name: "Tarjetas de precio",
  render: () => html`
    <div style="display:flex;gap:16px;flex-wrap:wrap;align-items:flex-start;">
      ${[
        { plan: "Free", price: "$0", period: "/mes", color: "#6b7280", features: ["5 proyectos", "1 GB almacenamiento", "Soporte comunidad"], cta: "Comenzar gratis", highlight: false },
        { plan: "Pro", price: "$29", period: "/mes", color: "#6366f1", features: ["50 proyectos", "50 GB almacenamiento", "Soporte email 48h", "Analytics avanzado"], cta: "Empezar prueba", highlight: true },
        { plan: "Enterprise", price: "$99", period: "/mes", color: "#0f172a", features: ["Ilimitado", "500 GB almacenamiento", "Soporte dedicado", "SSO + SAML", "SLA 99.9%"], cta: "Contactar ventas", highlight: false },
      ].map(({ plan, price, period, color, features, cta, highlight }) => html`
        <sp-card shadow=${highlight ? "lg" : "sm"} style="width:220px;position:relative;${highlight ? `border:2px solid ${color};` : ''}">
          ${highlight ? html`<div style="position:absolute;top:-12px;left:50%;transform:translateX(-50%);background:#6366f1;color:white;font-size:11px;font-weight:700;padding:3px 12px;border-radius:20px;">MÁS POPULAR</div>` : ''}
          <div>
            <p style="margin:0 0 4px;font-size:13px;font-weight:600;color:#6b7280;text-transform:uppercase;letter-spacing:.06em;">${plan}</p>
            <div style="display:flex;align-items:baseline;gap:2px;margin-bottom:16px;">
              <span style="font-size:32px;font-weight:800;color:${color};">${price}</span>
              <span style="font-size:13px;color:#9ca3af;">${period}</span>
            </div>
            <ul style="margin:0;padding:0;list-style:none;display:flex;flex-direction:column;gap:8px;">
              ${features.map(f => html`
                <li style="display:flex;align-items:center;gap:8px;font-size:13px;color:#374151;">
                  <span style="color:${color};font-size:14px;">✓</span> ${f}
                </li>
              `)}
            </ul>
          </div>
          <div slot="footer">
            <button style="width:100%;padding:10px;background:${highlight ? color : 'transparent'};color:${highlight ? 'white' : color};border:${highlight ? 'none' : `2px solid ${color}`};border-radius:8px;cursor:pointer;font-size:14px;font-weight:600;">${cta}</button>
          </div>
        </sp-card>
      `)}
    </div>
  `,
};

export const StatCards: Story = {
  name: "Tarjetas KPI",
  render: () => html`
    <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:16px;max-width:560px;">
      ${[
        { label: "Ingresos totales", value: "$84,250", change: "+18.2%", up: true, icon: "💰", color: "#10b981", bg: "#f0fdf4" },
        { label: "Usuarios activos", value: "12,847", change: "+5.4%", up: true, icon: "👥", color: "#3b82f6", bg: "#eff6ff" },
        { label: "Tasa de churn", value: "2.1%", change: "+0.3%", up: false, icon: "📉", color: "#ef4444", bg: "#fef2f2" },
        { label: "NPS Score", value: "72", change: "+4 pts", up: true, icon: "⭐", color: "#f59e0b", bg: "#fffbeb" },
      ].map(({ label, value, change, up, icon, color, bg }) => html`
        <sp-card shadow="sm" padding="20px" style="background:${bg};">
          <div style="display:flex;align-items:flex-start;justify-content:space-between;">
            <div>
              <p style="margin:0 0 6px;font-size:12px;font-weight:500;color:#6b7280;">${label}</p>
              <p style="margin:0;font-size:26px;font-weight:800;color:#111827;">${value}</p>
            </div>
            <span style="font-size:28px;">${icon}</span>
          </div>
          <div style="margin-top:12px;display:flex;align-items:center;gap:4px;">
            <span style="font-size:12px;font-weight:600;color:${up ? '#10b981' : '#ef4444'};">${up ? '▲' : '▼'} ${change}</span>
            <span style="font-size:12px;color:#9ca3af;">vs mes anterior</span>
          </div>
        </sp-card>
      `)}
    </div>
  `,
};

export const ProductCard: Story = {
  name: "Tarjeta de producto",
  render: () => html`
    <div style="display:flex;gap:20px;flex-wrap:wrap;">
      ${[
        { name: "Auriculares Pro X", price: "$89.00", oldPrice: "$120.00", badge: "−25%", rating: 4.8, reviews: 234, emoji: "🎧", color: "#6366f1" },
        { name: "Teclado Mecánico", price: "$149.00", oldPrice: null, badge: "Nuevo", rating: 4.5, reviews: 87, emoji: "⌨️", color: "#0ea5e9" },
        { name: "Monitor 4K 27\"", price: "$399.00", oldPrice: "$450.00", badge: "−11%", rating: 4.9, reviews: 512, emoji: "🖥️", color: "#10b981" },
      ].map(({ name, price, oldPrice, badge, rating, reviews, emoji, color }) => html`
        <sp-card shadow="md" padding="0" style="width:200px;cursor:pointer;transition:transform .15s;"
          onmouseenter="this.style.transform='translateY(-4px)'" onmouseleave="this.style.transform='translateY(0)'">
          <div style="position:relative;">
            <div style="height:140px;background:linear-gradient(135deg,${color}15,${color}30);display:flex;align-items:center;justify-content:center;font-size:52px;">
              ${emoji}
            </div>
            <span style="position:absolute;top:10px;right:10px;background:${color};color:white;font-size:11px;font-weight:700;padding:3px 8px;border-radius:6px;">${badge}</span>
          </div>
          <div style="padding:14px;">
            <p style="margin:0 0 6px;font-size:13px;font-weight:600;color:#111827;line-height:1.3;">${name}</p>
            <div style="display:flex;align-items:center;gap:4px;margin-bottom:8px;">
              <span style="color:#f59e0b;font-size:12px;">${'★'.repeat(Math.floor(rating))}</span>
              <span style="font-size:11px;color:#9ca3af;">${rating} (${reviews})</span>
            </div>
            <div style="display:flex;align-items:baseline;gap:6px;">
              <span style="font-size:18px;font-weight:800;color:${color};">${price}</span>
              ${oldPrice ? html`<span style="font-size:12px;color:#9ca3af;text-decoration:line-through;">${oldPrice}</span>` : ''}
            </div>
          </div>
          <div slot="footer" style="padding:0 14px 14px;">
            <button style="width:100%;padding:9px;background:${color};color:white;border:none;border-radius:8px;cursor:pointer;font-size:13px;font-weight:600;">Agregar al carrito</button>
          </div>
        </sp-card>
      `)}
    </div>
  `,
};

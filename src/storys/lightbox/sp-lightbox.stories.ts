import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "../../components/lightbox/sp-lightbox.js";

/* ── Colecciones de imágenes ──────────────────────────────────────────── */

const NATURALEZA = [
  { src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80", thumb: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&q=60", alt: "Montaña nevada", caption: "Picos nevados al amanecer" },
  { src: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&q=80", thumb: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=200&q=60", alt: "Bosque verde", caption: "Sendero en el bosque" },
  { src: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1200&q=80", thumb: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=200&q=60", alt: "Camino al atardecer", caption: "Camino de tierra al ocaso" },
  { src: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=1200&q=80", thumb: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=200&q=60", alt: "Flores silvestres", caption: "Campo de flores silvestres" },
];

const ARQUITECTURA = [
  { src: "https://images.unsplash.com/photo-1488972685288-c3fd157d7c7a?w=1200&q=80", thumb: "https://images.unsplash.com/photo-1488972685288-c3fd157d7c7a?w=200&q=60", alt: "Edificio moderno", caption: "Fachada de cristal — Tokio, 2023" },
  { src: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1200&q=80", thumb: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=200&q=60", alt: "Interior minimalista", caption: "Espacio abierto — Copenhague" },
  { src: "https://images.unsplash.com/photo-1481026469463-66327c86e544?w=1200&q=80", thumb: "https://images.unsplash.com/photo-1481026469463-66327c86e544?w=200&q=60", alt: "Puente urbano", caption: "Puente de acero — Londres" },
  { src: "https://images.unsplash.com/photo-1460317442991-0ec209397118?w=1200&q=80", thumb: "https://images.unsplash.com/photo-1460317442991-0ec209397118?w=200&q=60", alt: "Escalera espiral", caption: "Escalera helicoidal — Milán" },
];

const PRODUCTOS = [
  { src: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80", thumb: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&q=60", alt: "Reloj premium", caption: "Chronograph Pro — $420" },
  { src: "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=800&q=80", thumb: "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=200&q=60", alt: "Perfume", caption: "Eau de Parfum — $180" },
  { src: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=800&q=80", thumb: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=200&q=60", alt: "Zapatillas", caption: "Runner X — $130" },
  { src: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&q=80", thumb: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=200&q=60", alt: "Cámara", caption: "Mirrorless Pro — $1,200" },
];

const RETRATOS = [
  { src: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&q=80", thumb: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&q=60", alt: "Retrato 1" },
  { src: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&q=80", thumb: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&q=60", alt: "Retrato 2" },
  { src: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=800&q=80", thumb: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=200&q=60", alt: "Retrato 3" },
  { src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80", thumb: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=60", alt: "Retrato 4" },
];

/* ── Meta ─────────────────────────────────────────────────────────────── */

const meta: Meta = {
  title: "Components/Lightbox",
  component: "sp-lightbox",
  tags: ["autodocs"],
  argTypes: {
    open:          { control: "boolean" },
    index:         { control: "number" },
    "show-thumbs": { control: "boolean" },
  },
  args: { open: true, index: 0, "show-thumbs": true },
  render: ({ open, index }) => html`
    <sp-lightbox .images=${NATURALEZA} ?open=${open} index=${index} show-thumbs></sp-lightbox>
    ${!open ? html`<p style="color:#6b7280;font-size:14px;">Activa "open" en los controles para ver el lightbox.</p>` : ""}
  `,
};

export default meta;
type Story = StoryObj;

/* ── 1. Default ───────────────────────────────────────────────────────── */

export const Default: Story = { args: { open: true } };

/* ── 2. Sin miniaturas ───────────────────────────────────────────────── */

export const SinMiniaturas: Story = {
  name: "Sin Miniaturas",
  args: { open: true, "show-thumbs": false },
};

/* ── 3. Cinema — negro total, imagen grande, título en overlay ─────── */

export const Cinema: Story = {
  name: "Cinema (negro total)",
  render: () => html`
    <style>
      .lb-cinema {
        --sp-lb-overlay-bg: #000;
        --sp-lb-img-max-w: 95vw;
        --sp-lb-img-max-h: 88vh;
        --sp-lb-img-radius: 0px;
        --sp-lb-btn-bg: rgba(255,255,255,0.08);
        --sp-lb-btn-hover-bg: rgba(255,255,255,0.18);
        --sp-lb-accent: #e11d48;
      }
    </style>
    <div class="lb-cinema">
      <sp-lightbox .images=${ARQUITECTURA} open show-thumbs></sp-lightbox>
    </div>
  `,
};

/* ── 4. Producto — fondo claro, imagen con sombra, botones oscuros ─── */

export const Producto: Story = {
  name: "Producto (fondo claro)",
  render: () => html`
    <style>
      .lb-producto {
        --sp-lb-overlay-bg: rgba(248, 248, 248, 0.97);
        --sp-lb-btn-bg: rgba(0,0,0,0.07);
        --sp-lb-btn-hover-bg: rgba(0,0,0,0.14);
        --sp-lb-btn-color: #111;
        --sp-lb-btn-border: 1px solid rgba(0,0,0,0.1);
        --sp-lb-img-radius: 12px;
        --sp-lb-img-shadow: 0 20px 60px rgba(0,0,0,0.18);
        --sp-lb-img-max-w: 70vw;
        --sp-lb-img-max-h: 80vh;
        --sp-lb-accent: #6366f1;
      }
    </style>
    <div class="lb-producto">
      <sp-lightbox .images=${PRODUCTOS} open show-thumbs></sp-lightbox>
    </div>
  `,
};

/* ── 5. Minimal — overlay semitransparente, sin distracciones ────────── */

export const Minimal: Story = {
  name: "Minimal (overlay suave)",
  render: () => html`
    <style>
      .lb-minimal {
        --sp-lb-overlay-bg: rgba(15, 15, 15, 0.78);
        --sp-lb-img-radius: 8px;
        --sp-lb-img-shadow: 0 8px 40px rgba(0,0,0,0.5);
        --sp-lb-btn-bg: rgba(255,255,255,0.06);
        --sp-lb-btn-hover-bg: rgba(255,255,255,0.15);
      }
    </style>
    <div class="lb-minimal">
      <sp-lightbox .images=${NATURALEZA} open></sp-lightbox>
    </div>
  `,
};

/* ── 6. Polaroid — fondo oscuro con imagen enmarcada en blanco ──────── */

export const Polaroid: Story = {
  name: "Polaroid (marco blanco)",
  render: () => html`
    <style>
      .lb-polaroid {
        --sp-lb-overlay-bg: rgba(30, 27, 20, 0.95);
        --sp-lb-img-radius: 2px;
        --sp-lb-img-shadow: 0 0 0 12px #fff, 0 0 0 14px #e5e7eb, 0 24px 48px rgba(0,0,0,0.5);
        --sp-lb-img-max-w: 72vw;
        --sp-lb-img-max-h: 72vh;
        --sp-lb-btn-bg: rgba(255,255,255,0.1);
        --sp-lb-btn-hover-bg: rgba(255,255,255,0.22);
        --sp-lb-accent: #f59e0b;
      }
    </style>
    <div class="lb-polaroid">
      <sp-lightbox .images=${RETRATOS} open show-thumbs></sp-lightbox>
    </div>
  `,
};

/* ── 7. Azul — tema de marca azul ───────────────────────────────────── */

export const TemaAzul: Story = {
  name: "Tema Azul (marca)",
  render: () => html`
    <style>
      .lb-azul {
        --sp-lb-overlay-bg: rgba(10, 20, 50, 0.96);
        --sp-lb-btn-bg: rgba(99, 102, 241, 0.25);
        --sp-lb-btn-hover-bg: rgba(99, 102, 241, 0.5);
        --sp-lb-btn-color: #fff;
        --sp-lb-img-radius: 6px;
        --sp-lb-img-shadow: 0 0 0 2px rgba(99,102,241,0.4), 0 20px 40px rgba(0,0,0,0.4);
        --sp-lb-accent: #818cf8;
      }
    </style>
    <div class="lb-azul">
      <sp-lightbox .images=${ARQUITECTURA} open show-thumbs></sp-lightbox>
    </div>
  `,
};

/* ── 8. Galería masonry con trigger manual ───────────────────────────── */

const MASONRY_IMAGES = [...NATURALEZA, ...ARQUITECTURA];

export const GaleriaMasonry: Story = {
  name: "Galería Masonry (click para abrir)",
  render: () => html`
    <style>
      .lb-masonry-grid {
        columns: 3;
        column-gap: 10px;
        max-width: 780px;
      }
      @media (max-width: 600px) { .lb-masonry-grid { columns: 2; } }
      .lb-masonry-item {
        break-inside: avoid;
        margin-bottom: 10px;
        border-radius: 8px;
        overflow: hidden;
        cursor: pointer;
        position: relative;
      }
      .lb-masonry-item img {
        width: 100%;
        height: auto;
        display: block;
        transition: transform 0.25s, opacity 0.25s;
      }
      .lb-masonry-item:hover img { transform: scale(1.04); opacity: 0.88; }
      .lb-masonry-item::after {
        content: '⤢';
        position: absolute;
        bottom: 8px;
        right: 10px;
        color: #fff;
        font-size: 18px;
        opacity: 0;
        transition: opacity 0.2s;
        pointer-events: none;
      }
      .lb-masonry-item:hover::after { opacity: 1; }
    </style>

    <div class="lb-masonry-grid">
      ${MASONRY_IMAGES.map((img, i) => html`
        <div class="lb-masonry-item" @click=${() => {
          const lb = document.querySelector("sp-lightbox.lb-masonry-lb") as any;
          if (lb) lb.openAt(i);
        }}>
          <img src=${img.thumb} alt=${img.alt} loading="lazy"/>
        </div>
      `)}
    </div>
    <sp-lightbox
      class="lb-masonry-lb"
      .images=${MASONRY_IMAGES}
      show-thumbs
    ></sp-lightbox>
  `,
};

/* ── 9. Una sola imagen ──────────────────────────────────────────────── */

export const ImagenUnica: Story = {
  name: "Imagen Única",
  render: () => html`
    <sp-lightbox
      .images=${[NATURALEZA[0]]}
      open
    ></sp-lightbox>
  `,
};

/* ── 10. Galería con trigger en cuadrícula ───────────────────────────── */

export const GaleriaCuadricula: Story = {
  name: "Galería con Cuadrícula",
  render: () => html`
    <style>
      .lb-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
        gap: 8px;
        max-width: 700px;
      }
      .lb-grid-item {
        aspect-ratio: 4/3;
        border-radius: 8px;
        overflow: hidden;
        cursor: pointer;
        position: relative;
      }
      .lb-grid-item img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.2s;
      }
      .lb-grid-item:hover img { transform: scale(1.06); }
      .lb-grid-badge {
        position: absolute;
        inset: 0;
        display: flex;
        align-items: flex-end;
        padding: 8px;
        background: linear-gradient(transparent 50%, rgba(0,0,0,0.55));
        opacity: 0;
        transition: opacity 0.2s;
        color: #fff;
        font-size: 11px;
        font-weight: 500;
      }
      .lb-grid-item:hover .lb-grid-badge { opacity: 1; }
    </style>

    <div class="lb-grid">
      ${PRODUCTOS.map((img, i) => html`
        <div class="lb-grid-item" @click=${() => {
          const lb = document.querySelector("sp-lightbox.lb-grid-lb") as any;
          if (lb) lb.openAt(i);
        }}>
          <img src=${img.thumb} alt=${img.alt} loading="lazy"/>
          <div class="lb-grid-badge">${img.caption}</div>
        </div>
      `)}
    </div>
    <sp-lightbox
      class="lb-grid-lb"
      .images=${PRODUCTOS}
      show-thumbs
    ></sp-lightbox>
  `,
};

import type { Meta, StoryObj } from "@storybook/web-components";
import { html, nothing } from "lit";
import type { SpIconProps } from "../../components/icon/sp-icon.types.js";
import "../../components/icon/sp-icon.js";

// ── Catálogo completo de iconos por categoría ────────────────────────────────
const ICON_CATALOG: Record<string, string[]> = {
  "Navegación & Flechas": [
    "arrow-right", "arrow-left", "arrow-down", "arrow-up",
    "arrow-up-right", "arrow-down-left", "arrow-up-left", "arrow-down-right",
    "chevron-right", "chevron-left", "chevron-down", "chevron-up",
    "chevron-double-right", "chevron-double-left",
    "external-link", "corner-down-right", "corner-up-left",
    "corner-up-right", "corner-down-left",
    "move", "drag-handle",
  ],
  "Acciones": [
    "check", "close", "plus", "minus", "trash", "edit", "copy",
    "download", "upload", "refresh", "rotate-cw", "rotate-ccw",
    "share", "send", "save", "filter", "sort", "sort-asc", "sort-desc",
    "undo", "redo", "scissors", "pin", "crop", "zoom-in", "zoom-out",
    "archive", "expand", "collapse", "eraser", "paste", "reply", "forward",
  ],
  "Estado & Feedback": [
    "info", "warning", "error", "check-circle", "x-circle", "alert-circle",
    "help-circle", "loader", "check-square", "minus-square",
    "plus-circle", "minus-circle", "shield-alert", "ban", "octagon",
  ],
  "Controles UI": [
    "search", "menu", "more-horizontal", "more-vertical",
    "eye", "eye-off", "link", "link-off", "maximize", "minimize",
    "sliders", "grid", "list", "toggle-left", "toggle-right",
    "at-sign", "hash", "indent", "outdent", "scan",
    "keyboard", "mouse", "command",
    "switch-horizontal", "switch-vertical", "hand", "pointer", "fullscreen",
  ],
  "Personas & Org": [
    "user", "users", "user-plus", "user-check", "user-minus", "user-x",
    "briefcase", "contact", "user-circle",
  ],
  "Archivos & Contenido": [
    "folder", "folder-open", "folder-plus", "folder-minus",
    "file", "file-text", "file-plus", "file-minus", "file-x",
    "file-check", "file-code", "file-audio", "file-video", "file-image",
    "image", "video", "music", "code", "terminal", "package",
    "tag", "bookmark", "book-open", "book",
    "clipboard", "clipboard-check", "clipboard-list",
    "database", "paperclip", "newspaper",
  ],
  "Comunicación": [
    "mail", "mail-open", "phone", "phone-off", "phone-call",
    "message", "message-circle", "message-plus",
    "bell", "bell-off", "inbox", "rss", "notification",
  ],
  "Media & Reproducción": [
    "play", "pause", "stop-circle", "skip-back", "skip-forward",
    "rewind", "fast-forward", "repeat", "shuffle",
    "play-circle", "pause-circle", "film",
    "volume", "volume-1", "volume-2", "volume-x",
    "headphones", "monitor", "tv", "cast", "screen-share",
    "camera", "mic", "mic-off", "printer",
  ],
  "Compras & Finanzas": [
    "shopping-cart", "shopping-bag", "gift",
    "dollar-sign", "euro", "pound", "bitcoin",
    "percent", "receipt", "wallet", "credit-card", "banknote",
  ],
  "Social & Interacción": [
    "thumbs-up", "thumbs-down", "heart", "star",
    "crown", "gem", "badge-check", "award", "medal",
  ],
  "Datos & Gráficos": [
    "bar-chart", "bar-chart-2", "line-chart", "pie-chart",
    "activity", "trending-up", "trending-down", "gauge", "target", "sigma",
  ],
  "Ubicación & Mapas": [
    "home", "map-pin", "globe", "navigation", "compass", "map",
    "crosshair", "route", "milestone", "building", "store",
  ],
  "Tiempo & Calendario": [
    "calendar", "calendar-plus", "calendar-check",
    "clock", "timer", "alarm-clock", "hourglass", "history",
  ],
  "Seguridad": [
    "lock", "unlock", "shield", "shield-check", "key", "fingerprint", "power",
  ],
  "Diseño & Tipografía": [
    "pen", "pencil", "paintbrush", "palette", "layers",
    "align-left", "align-center", "align-right", "align-justify",
    "bold", "italic", "underline", "strikethrough", "type", "heading",
    "frame", "component", "list-ordered", "quote", "infinity",
  ],
  "Layout & Estructura": [
    "settings", "layout", "sidebar", "columns",
    "panel-left", "panel-right", "panel-top", "panel-bottom",
    "split-square", "table2",
  ],
  "Dispositivos & Tech": [
    "laptop", "tablet", "smartphone", "cpu",
    "hard-drive", "server", "battery", "battery-charging",
    "wifi", "wifi-off", "bluetooth", "cloud", "cloud-upload", "cloud-download",
  ],
  "Desarrollo & Código": [
    "bug", "git-branch", "git-commit", "git-merge", "git-pull-request",
    "braces", "curly-braces", "variable", "webhook",
  ],
  "Naturaleza & Clima": [
    "flame", "leaf", "snowflake", "wind", "cloud-rain",
    "umbrella", "thermometer", "droplet",
  ],
  "Misc": [
    "flag", "sun", "moon", "zap", "sparkles", "rocket", "truck",
    "smile", "frown", "meh", "coffee", "anchor", "feather",
  ],
};

const allIconNames = Object.values(ICON_CATALOG).flat();

const meta: Meta<SpIconProps> = {
  title: "Components/Icon",
  component: "sp-icon",
  tags: ["autodocs"],
  argTypes: {
    name: {
      control: "select",
      options: allIconNames,
      description: "Nombre del icono",
    },
    size: {
      control: "select",
      options: ["xs", "sm", "md", "lg", "xl"],
      description: "Tamaño del icono",
    },
    label: {
      control: "text",
      description: "Etiqueta accesible (aria-label)",
    },
    color: {
      control: "color",
      description: "Color del trazo",
    },
  },
  args: { name: "check", size: "md", label: "", color: "" },
  render: ({ name, size, label, color }) => html`
    <sp-icon
      name=${name}
      size=${size}
      label=${label || nothing}
      color=${color || nothing}
    ></sp-icon>
  `,
};

export default meta;
type Story = StoryObj<SpIconProps>;

export const Default: Story = {
  args: { name: "check", size: "md" },
};

export const Tamaños: Story = {
  render: () => html`
    <div style="display:flex;gap:24px;align-items:center;padding:16px;">
      ${(["xs", "sm", "md", "lg", "xl"] as const).map(
        (size) => html`
          <div style="display:flex;flex-direction:column;align-items:center;gap:8px;">
            <sp-icon name="star" size=${size}></sp-icon>
            <span style="font-size:11px;color:#6b7280;">${size}</span>
          </div>
        `,
      )}
    </div>
  `,
};

export const Colores: Story = {
  render: () => html`
    <div style="display:flex;gap:20px;align-items:center;padding:16px;">
      <sp-icon name="heart"    size="lg" color="#ef4444"></sp-icon>
      <sp-icon name="star"     size="lg" color="#f59e0b"></sp-icon>
      <sp-icon name="check"    size="lg" color="#10b981"></sp-icon>
      <sp-icon name="info"     size="lg" color="#3b82f6"></sp-icon>
      <sp-icon name="zap"      size="lg" color="#8b5cf6"></sp-icon>
      <sp-icon name="flame"    size="lg" color="#f97316"></sp-icon>
      <sp-icon name="sparkles" size="lg" color="#ec4899"></sp-icon>
    </div>
  `,
};

export const IconButtonBar: Story = {
  name: "Barra de acciones",
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:20px;max-width:600px;">
      <div style="display:flex;align-items:center;gap:4px;padding:6px;background:#f9fafb;border:1px solid #e5e7eb;border-radius:10px;width:fit-content;">
        ${[
          { name: "bold", title: "Negrita" },
          { name: "italic", title: "Cursiva" },
          { name: "underline", title: "Subrayado" },
          { name: "strikethrough", title: "Tachado" },
        ].map(({ name, title }) => html`
          <button title=${title} style="padding:8px;border:none;background:transparent;border-radius:6px;cursor:pointer;display:flex;align-items:center;justify-content:center;"
            onmouseenter="this.style.background='#e5e7eb'" onmouseleave="this.style.background='transparent'">
            <sp-icon name=${name} size="md"></sp-icon>
          </button>
        `)}
        <div style="width:1px;height:22px;background:#e5e7eb;margin:0 4px;"></div>
        ${[
          { name: "align-left", title: "Izquierda" },
          { name: "align-center", title: "Centro" },
          { name: "align-right", title: "Derecha" },
          { name: "align-justify", title: "Justificado" },
        ].map(({ name, title }) => html`
          <button title=${title} style="padding:8px;border:none;background:transparent;border-radius:6px;cursor:pointer;display:flex;align-items:center;justify-content:center;"
            onmouseenter="this.style.background='#e5e7eb'" onmouseleave="this.style.background='transparent'">
            <sp-icon name=${name} size="md"></sp-icon>
          </button>
        `)}
        <div style="width:1px;height:22px;background:#e5e7eb;margin:0 4px;"></div>
        ${[
          { name: "link", title: "Enlace", active: false },
          { name: "image", title: "Imagen", active: false },
          { name: "code", title: "Código", active: true },
        ].map(({ name, title, active }) => html`
          <button title=${title} style="padding:8px;border:none;background:${active ? '#eff6ff' : 'transparent'};border-radius:6px;cursor:pointer;display:flex;align-items:center;justify-content:center;"
            onmouseenter="this.style.background='#e5e7eb'" onmouseleave="this.style.background='${active ? '#eff6ff' : 'transparent'}'">
            <sp-icon name=${name} size="md" color=${active ? '#3b82f6' : ''}></sp-icon>
          </button>
        `)}
      </div>

      <div style="display:flex;gap:8px;padding:10px;background:#fff;border:1px solid #e5e7eb;border-radius:10px;width:fit-content;">
        ${[
          { name: "edit", color: "#6366f1", bg: "#f5f3ff", title: "Editar" },
          { name: "copy", color: "#0ea5e9", bg: "#f0f9ff", title: "Copiar" },
          { name: "share", color: "#10b981", bg: "#f0fdf4", title: "Compartir" },
          { name: "trash", color: "#ef4444", bg: "#fef2f2", title: "Eliminar" },
        ].map(({ name, color, bg, title }) => html`
          <button title=${title} style="padding:10px;border:none;background:${bg};border-radius:8px;cursor:pointer;display:flex;align-items:center;gap:6px;font-size:13px;font-weight:500;color:${color};">
            <sp-icon name=${name} size="sm" color=${color}></sp-icon>
            ${title}
          </button>
        `)}
      </div>
    </div>
  `,
};

export const SemanticIcons: Story = {
  name: "Iconos semánticos",
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:10px;max-width:480px;">
      ${[
        { icon: "check-circle", label: "Operación exitosa", sub: "Los cambios se guardaron correctamente.", color: "#10b981", bg: "#f0fdf4", border: "#bbf7d0" },
        { icon: "info", label: "Información", sub: "Tu cuenta será revisada en 24 horas.", color: "#3b82f6", bg: "#eff6ff", border: "#bfdbfe" },
        { icon: "warning", label: "Advertencia", sub: "Este archivo es mayor a 10 MB.", color: "#f59e0b", bg: "#fffbeb", border: "#fde68a" },
        { icon: "x-circle", label: "Error al procesar", sub: "No se pudo conectar con el servidor.", color: "#ef4444", bg: "#fef2f2", border: "#fecaca" },
      ].map(({ icon, label, sub, color, bg, border }) => html`
        <div style="display:flex;align-items:flex-start;gap:12px;padding:14px 16px;border-radius:10px;background:${bg};border:1px solid ${border};">
          <sp-icon name=${icon} size="lg" color=${color} style="flex-shrink:0;margin-top:1px;"></sp-icon>
          <div>
            <p style="margin:0;font-size:14px;font-weight:600;color:#111827;">${label}</p>
            <p style="margin:3px 0 0;font-size:13px;color:#4b5563;">${sub}</p>
          </div>
        </div>
      `)}
    </div>
  `,
};

export const IconsInForm: Story = {
  name: "Iconos en formularios",
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:14px;max-width:380px;">
      ${[
        { icon: "user", label: "Nombre completo", placeholder: "Ana García", type: "text" },
        { icon: "mail", label: "Email", placeholder: "ana@empresa.com", type: "email" },
        { icon: "lock", label: "Contraseña", placeholder: "••••••••", type: "password" },
        { icon: "search", label: "Buscar", placeholder: "Buscar usuario...", type: "search" },
      ].map(({ icon, label, placeholder, type }) => html`
        <div>
          <label style="display:block;font-size:13px;font-weight:500;color:#374151;margin-bottom:5px;">${label}</label>
          <div style="position:relative;">
            <span style="position:absolute;left:10px;top:50%;transform:translateY(-50%);display:flex;align-items:center;pointer-events:none;">
              <sp-icon name=${icon} size="sm" color="#9ca3af"></sp-icon>
            </span>
            <input type=${type} placeholder=${placeholder}
              style="width:100%;padding:9px 12px 9px 34px;border:1px solid #d1d5db;border-radius:8px;font-size:14px;box-sizing:border-box;color:#111827;outline:none;"
              onfocus="this.style.borderColor='#6366f1';this.style.boxShadow='0 0 0 3px #e0e7ff'"
              onblur="this.style.borderColor='#d1d5db';this.style.boxShadow='none'" />
          </div>
        </div>
      `)}
      <button style="padding:10px;background:#6366f1;color:white;border:none;border-radius:8px;font-size:14px;font-weight:600;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;">
        <sp-icon name="arrow-right" size="sm" color="white"></sp-icon>
        Continuar
      </button>
    </div>
  `,
};

export const CatalogoCompleto: Story = {
  name: "Catálogo Completo (305+)",
  render: () => html`
    <div style="font-family:inherit;padding:8px 16px;">
      ${Object.entries(ICON_CATALOG).map(
        ([category, names]) => html`
          <div style="margin-bottom:36px;">
            <h3 style="margin:0 0 14px;font-size:12px;font-weight:700;
                        color:#6b7280;text-transform:uppercase;letter-spacing:.08em;
                        border-bottom:2px solid #f3f4f6;padding-bottom:8px;">
              ${category}
              <span style="font-weight:400;color:#9ca3af;margin-left:6px;">(${names.length})</span>
            </h3>
            <div style="display:flex;flex-wrap:wrap;gap:6px;">
              ${names.map(
                (name) => html`
                  <div style="display:flex;flex-direction:column;align-items:center;
                              gap:6px;padding:12px 10px;min-width:76px;
                              border:1px solid #f3f4f6;border-radius:8px;
                              background:#fafafa;cursor:default;
                              transition:all .15s;"
                       title=${name}
                       onmouseenter="this.style.background='#eff6ff';this.style.borderColor='#bfdbfe'"
                       onmouseleave="this.style.background='#fafafa';this.style.borderColor='#f3f4f6'">
                    <sp-icon name=${name} size="md"></sp-icon>
                    <span style="font-size:9.5px;color:#6b7280;text-align:center;
                                  word-break:break-all;max-width:76px;line-height:1.3;">
                      ${name}
                    </span>
                  </div>
                `,
              )}
            </div>
          </div>
        `,
      )}
    </div>
  `,
};

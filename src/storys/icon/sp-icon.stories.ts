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

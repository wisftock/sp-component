import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "../../components/menubar/sp-menubar.js";

const MENUS = [
  {
    label: "Archivo",
    items: [
      { label: "Nuevo", value: "new", shortcut: "Ctrl+N" },
      { label: "Abrir...", value: "open", shortcut: "Ctrl+O" },
      { type: "separator" },
      { label: "Guardar", value: "save", shortcut: "Ctrl+S" },
      { label: "Guardar como...", value: "save-as", shortcut: "Ctrl+Shift+S" },
      { type: "separator" },
      { label: "Salir", value: "exit" },
    ],
  },
  {
    label: "Editar",
    items: [
      { label: "Deshacer", value: "undo", shortcut: "Ctrl+Z" },
      { label: "Rehacer", value: "redo", shortcut: "Ctrl+Y" },
      { type: "separator" },
      { label: "Cortar", value: "cut", shortcut: "Ctrl+X" },
      { label: "Copiar", value: "copy", shortcut: "Ctrl+C" },
      { label: "Pegar", value: "paste", shortcut: "Ctrl+V" },
    ],
  },
  {
    label: "Ver",
    items: [
      { label: "Zoom +", value: "zoom-in", shortcut: "Ctrl++" },
      { label: "Zoom -", value: "zoom-out", shortcut: "Ctrl+-" },
      { label: "Restablecer zoom", value: "zoom-reset" },
      { type: "separator" },
      { label: "Pantalla completa", value: "fullscreen", shortcut: "F11" },
    ],
  },
  {
    label: "Ayuda",
    items: [
      { label: "Documentación", value: "docs" },
      { label: "Atajos de teclado", value: "shortcuts" },
      { type: "separator" },
      { label: "Acerca de...", value: "about" },
    ],
  },
];

const meta: Meta = {
  title: "Components/Menubar",
  component: "sp-menubar",
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <sp-menubar .menus=${MENUS}></sp-menubar>
  `,
};

export const Simple: Story = {
  render: () => html`
    <sp-menubar .menus=${[
      {
        label: "Proyecto",
        items: [
          { label: "Nuevo proyecto", value: "new-project" },
          { label: "Abrir proyecto", value: "open-project" },
          { label: "Cerrar proyecto", value: "close-project" },
        ],
      },
      {
        label: "Herramientas",
        items: [
          { label: "Configuración", value: "settings" },
          { label: "Extensiones", value: "extensions" },
        ],
      },
    ]}></sp-menubar>
  `,
};

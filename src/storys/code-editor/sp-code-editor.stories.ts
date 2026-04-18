import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "../../components/code-editor/sp-code-editor.js";

const STARTER = `function hola(nombre) {
  return \`Hola, \${nombre}!\`;
}

console.log(hola('Mundo'));`;

const meta: Meta = {
  title: "Components/CodeEditor",
  component: "sp-code-editor",
  tags: ["autodocs"],
  argTypes: {
    language: { control: "select", options: ["js","ts","css","html","python","json","text"] },
    filename: { control: "text" },
    readonly: { control: "boolean" },
    "tab-size": { control: "number" },
  },
  args: { language: "js", filename: "index.js", readonly: false, "tab-size": 2 },
  render: ({ language, filename, readonly }) => html`
    <sp-code-editor
      .value=${STARTER}
      language=${language}
      filename=${filename}
      ?readonly=${readonly}
    ></sp-code-editor>
  `,
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const Readonly: Story = {
  args: { readonly: true, filename: "ejemplo.js" },
};

export const TypeScript: Story = {
  render: () => html`
    <sp-code-editor
      .value=${"interface Usuario {\n  id: number;\n  nombre: string;\n}\n\nconst user: Usuario = { id: 1, nombre: 'Ana' };"}
      language="ts"
      filename="usuario.ts"
    ></sp-code-editor>
  `,
};

export const CSS: Story = {
  render: () => html`
    <sp-code-editor
      .value=${".container {\n  display: flex;\n  gap: 16px;\n  padding: 24px;\n}"}
      language="css"
      filename="estilos.css"
    ></sp-code-editor>
  `,
};

export const NoFilename: Story = {
  render: () => html`
    <sp-code-editor .value=${STARTER} language="js"></sp-code-editor>
  `,
};

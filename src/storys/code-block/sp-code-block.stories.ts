import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "../../components/code-block/sp-code-block.js";

const JS_CODE = `function saludar(nombre) {
  const mensaje = \`Hola, \${nombre}!\`;
  console.log(mensaje);
  return mensaje;
}

saludar('Mundo');`;

const TS_CODE = `interface Usuario {
  id: number;
  nombre: string;
  email: string;
}

async function obtenerUsuario(id: number): Promise<Usuario> {
  const res = await fetch(\`/api/usuarios/\${id}\`);
  return res.json();
}`;

const CSS_CODE = `.card {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 24px;
  border-radius: 8px;
  background: var(--sp-bg, white);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}`;

const meta: Meta = {
  title: "Components/CodeBlock",
  component: "sp-code-block",
  tags: ["autodocs"],
  argTypes: {
    language: { control: "select", options: ["js","ts","css","html","json","bash","python"] },
    filename: { control: "text" },
    "line-numbers": { control: "boolean" },
    copyable: { control: "boolean" },
    "max-height": { control: "text" },
  },
  args: { language: "js", filename: "", "line-numbers": true, copyable: true, "max-height": "" },
  render: ({ language, filename, copyable }) => html`
    <sp-code-block
      code=${JS_CODE}
      language=${language}
      filename=${filename}
      ?line-numbers=${true}
      ?copyable=${copyable}
    ></sp-code-block>
  `,
};

export default meta;
type Story = StoryObj;

export const JavaScript: Story = {
  render: () => html`<sp-code-block code=${JS_CODE} language="js" filename="saludar.js"></sp-code-block>`,
};

export const TypeScript: Story = {
  render: () => html`<sp-code-block code=${TS_CODE} language="ts" filename="usuario.ts"></sp-code-block>`,
};

export const CSS: Story = {
  render: () => html`<sp-code-block code=${CSS_CODE} language="css" filename="card.css"></sp-code-block>`,
};

export const NoLineNumbers: Story = {
  render: () => html`<sp-code-block code=${JS_CODE} language="js" ?line-numbers=${false}></sp-code-block>`,
};

export const NoCopy: Story = {
  render: () => html`<sp-code-block code=${JS_CODE} language="js" ?copyable=${false}></sp-code-block>`,
};

export const MaxHeight: Story = {
  render: () => html`
    <sp-code-block
      code=${TS_CODE + "\n\n" + JS_CODE + "\n\n" + CSS_CODE}
      language="ts"
      filename="largo.ts"
      max-height="200px"
    ></sp-code-block>
  `,
};

import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "../../components/markdown/sp-markdown.js";

const CONTENT = `# Título principal

Este es un párrafo con **texto en negrita**, *cursiva* y \`código inline\`.

## Listas

### Sin orden
- Primer elemento
- Segundo elemento
- Tercer elemento con **énfasis**

### Ordenada
1. Paso inicial
2. Segundo paso
3. Tercer paso

## Código

\`\`\`javascript
function saludar(nombre) {
  return \`Hola, \${nombre}!\`;
}
\`\`\`

## Tabla

| Componente | Estado | Versión |
|------------|--------|---------|
| sp-button  | Estable | 2.0.0  |
| sp-modal   | Estable | 2.0.0  |
| sp-gantt   | Beta    | 2.0.0  |

> **Nota:** Este es un bloque de cita para destacar información importante.

---

[Enlace de ejemplo](https://example.com)
`;

const meta: Meta = {
  title: "Components/Markdown",
  component: "sp-markdown",
  tags: ["autodocs"],
  argTypes: {
    content: { control: "text", description: "Texto en formato Markdown" },
  },
  args: { content: CONTENT },
  render: ({ content }) => html`<sp-markdown content=${content}></sp-markdown>`,
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const Simple: Story = {
  args: { content: "## Hola mundo\n\nEste es un **párrafo simple** con markdown." },
};

export const WithCode: Story = {
  args: {
    content: "## Ejemplo de código\n\n```typescript\ninterface Props {\n  name: string;\n  age: number;\n}\n```",
  },
};

export const WithTable: Story = {
  args: {
    content: "## Tabla de precios\n\n| Plan | Precio | Usuarios |\n|------|--------|----------|\n| Free | $0 | 5 |\n| Pro | $29 | 50 |\n| Enterprise | $99 | Ilimitado |",
  },
};

import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "../../components/markdown/sp-markdown.js";

const FULL_DOC = `# Guía de inicio rápido

Bienvenido a **sp-component** — una librería de Web Components construida con [Lit](https://lit.dev).

## Instalación

\`\`\`bash
npm install sp-component
# o con pnpm
pnpm add sp-component
\`\`\`

## Uso básico

\`\`\`html
<script type="module">
  import 'sp-component/dist/index.js';
</script>

<sp-button variant="primary">Hola mundo</sp-button>
\`\`\`

## Componentes disponibles

| Componente      | Categoría   | Estado   |
|-----------------|-------------|----------|
| \`sp-button\`   | Entrada     | Estable  |
| \`sp-modal\`    | Overlay     | Estable  |
| \`sp-table\`    | Datos       | Estable  |
| \`sp-gantt\`    | Datos       | Beta     |
| \`sp-sparkline\`| Visualización | Estable |

## Tematización

Puedes personalizar los colores usando CSS custom properties:

\`\`\`css
:root {
  --sp-primary: #6366f1;
  --sp-bg: #ffffff;
  --sp-border: #e5e7eb;
}
\`\`\`

> **Tip:** Todos los tokens CSS están documentados en la sección de **Design Tokens**.

## Accesibilidad

Todos los componentes siguen las guías **WCAG 2.1 AA**:

- Navegación completa por teclado
- Atributos \`aria-*\` correctos
- Relación de contraste ≥ 4.5:1

---

¿Preguntas? Abre un issue en [GitHub](https://github.com/example/sp-component).
`;

const BLOG_POST = `# Construyendo Design Systems con Web Components

*Publicado el 18 de abril, 2026 · 5 min de lectura*

---

Los **Design Systems** se han convertido en la columna vertebral del desarrollo frontend moderno. En este artículo exploraremos cómo los Web Components ofrecen una solución *framework-agnostic* ideal para escalar.

## ¿Por qué Web Components?

A diferencia de React o Vue, los Web Components son un estándar del navegador:

1. **Encapsulación real** con Shadow DOM
2. **Interoperabilidad** con cualquier framework
3. **Sin dependencias** de runtime

\`\`\`javascript
class MiBoton extends HTMLElement {
  connectedCallback() {
    this.innerHTML = '<button>Click me</button>';
  }
}
customElements.define('mi-boton', MiBoton);
\`\`\`

## Lit: el camino más sencillo

[Lit](https://lit.dev) añade reactividad y templates declarativos sobre los Web Components nativos:

\`\`\`typescript
@customElement('sp-button')
class SpButton extends LitElement {
  @property() variant = 'primary';

  render() {
    return html\`<button class=\${this.variant}><slot></slot></button>\`;
  }
}
\`\`\`

> La clave es mantener los componentes **pequeños, enfocados y composables**.

## Conclusión

Web Components + Lit = la combinación perfecta para Design Systems que sobreviven cambios de framework.
`;

const CHANGELOG = `# Changelog

## v2.1.0 — 2026-04-18

### Nuevas funciones
- \`sp-signature\`: prop \`show-colors\` para controlar la paleta independientemente
- \`sp-carousel\`: breakpoints tablet (≤768px) y mobile (≤480px)
- \`sp-lightbox\`: 10 variantes de diseño con CSS custom properties

### Correcciones
- \`sp-combobox\`: dropdown ahora ocupa el ancho completo del input
- \`sp-autocomplete\`: idem que combobox
- \`sp-cascader\`: panel alineado al trigger
- \`sp-sidebar\`: botón collapse se superpone correctamente (overflow fix)

### Eliminados
- \`sp-color-swatch\` — reemplazado por CSS custom properties directas
- \`sp-avatar-group\` — integrado dentro de \`sp-avatar\`
- \`sp-navbar\`, \`sp-menu\`, \`sp-menu-root\`, \`sp-nav-menu\`

---

## v2.0.0 — 2026-04-05

### Breaking changes
- Tokens CSS renombrados: \`--color-*\` → \`--sp-*\`
- \`sp-select\` reemplazado por \`sp-combobox\`
`;

const TABLA_PRECIOS = `## Planes y precios

| Plan         | Precio / mes | Usuarios  | Soporte         |
|--------------|:------------:|:---------:|-----------------|
| **Free**     | $0           | 5         | Comunidad       |
| **Pro**      | $29          | 50        | Email (48h)     |
| **Business** | $99          | 250       | Chat (8h)       |
| **Enterprise**| Consultar   | Ilimitado | Dedicado (1h)   |

> Todos los planes incluyen **SSL gratuito**, **CDN global** y **99.9% SLA**.
`;

const meta: Meta = {
  title: "Components/Markdown",
  component: "sp-markdown",
  tags: ["autodocs"],
  argTypes: {
    content: { control: "text", description: "Texto en formato Markdown" },
  },
  args: { content: FULL_DOC },
  render: ({ content }) => html`
    <div style="max-width:720px;">
      <sp-markdown content=${content}></sp-markdown>
    </div>
  `,
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};

export const BlogPost: Story = {
  name: "Post de blog",
  render: () => html`
    <div style="max-width:680px;font-family:Georgia,serif;">
      <sp-markdown content=${BLOG_POST}></sp-markdown>
    </div>
  `,
};

export const Changelog: Story = {
  name: "Changelog",
  render: () => html`
    <div style="max-width:680px;">
      <sp-markdown content=${CHANGELOG}></sp-markdown>
    </div>
  `,
};

export const TablaDePrecio: Story = {
  name: "Tabla de precios",
  render: () => html`
    <div style="max-width:580px;">
      <sp-markdown content=${TABLA_PRECIOS}></sp-markdown>
    </div>
  `,
};

export const Simple: Story = {
  args: { content: "## Hola mundo\n\nEste es un **párrafo simple** con markdown y `código inline`." },
};

export const WithCode: Story = {
  name: "Con código",
  args: {
    content: "## Ejemplo TypeScript\n\n```typescript\ninterface Usuario {\n  id: number;\n  nombre: string;\n  email: string;\n}\n\nconst getUsuario = async (id: number): Promise<Usuario> => {\n  const res = await fetch(`/api/usuarios/${id}`);\n  return res.json();\n};\n```",
  },
};

export const ApiReference: Story = {
  name: "Referencia de API",
  render: () => html`
    <div style="max-width:720px;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;">
      <div style="background:#111827;padding:14px 20px;display:flex;align-items:center;gap:10px;">
        <span style="width:12px;height:12px;border-radius:50%;background:#ef4444;display:inline-block;"></span>
        <span style="width:12px;height:12px;border-radius:50%;background:#f59e0b;display:inline-block;"></span>
        <span style="width:12px;height:12px;border-radius:50%;background:#10b981;display:inline-block;"></span>
        <span style="margin-left:12px;font-size:13px;color:#6b7280;font-family:monospace;">API Reference · sp-component v2.1</span>
      </div>
      <div style="padding:24px;background:#fff;">
        <sp-markdown content=${"## `POST /api/users`\n\nCrea un nuevo usuario en el sistema.\n\n### Headers\n\n| Header | Requerido | Descripción |\n|---|---|---|\n| `Authorization` | Sí | `Bearer <token>` |\n| `Content-Type` | Sí | `application/json` |\n\n### Body\n\n```json\n{\n  \"name\": \"Ana García\",\n  \"email\": \"ana@empresa.com\",\n  \"role\": \"admin\"\n}\n```\n\n### Respuesta exitosa `201 Created`\n\n```json\n{\n  \"id\": \"usr_01HXYZ\",\n  \"name\": \"Ana García\",\n  \"email\": \"ana@empresa.com\",\n  \"role\": \"admin\",\n  \"createdAt\": \"2026-04-19T10:00:00Z\"\n}\n```\n\n> **Nota:** El campo `id` es inmutable y no puede modificarse después de la creación.\n\n### Errores\n\n| Código | Descripción |\n|---|---|\n| `400` | Body inválido o campos faltantes |\n| `401` | Token no proporcionado o expirado |\n| `409` | Email ya registrado |"}></sp-markdown>
      </div>
    </div>
  `,
};

export const TerminosCondiciones: Story = {
  name: "Términos y condiciones",
  render: () => html`
    <div style="max-width:660px;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.06);">
      <div style="background:#f9fafb;padding:16px 24px;border-bottom:1px solid #e5e7eb;display:flex;justify-content:space-between;align-items:center;">
        <div>
          <p style="margin:0;font-size:15px;font-weight:700;color:#111827;">Términos de Uso</p>
          <p style="margin:2px 0 0;font-size:12px;color:#6b7280;">Actualizado el 19 de abril, 2026</p>
        </div>
        <span style="background:#fef3c7;color:#92400e;font-size:11px;font-weight:600;padding:4px 10px;border-radius:20px;">Requiere aceptación</span>
      </div>
      <div style="padding:24px;max-height:400px;overflow-y:auto;">
        <sp-markdown content=${"## 1. Aceptación de términos\n\nAl acceder y utilizar esta plataforma, usted acepta cumplir con los presentes **Términos de Uso**. Si no está de acuerdo, por favor **no utilice el servicio**.\n\n## 2. Uso permitido\n\nEl servicio está destinado a:\n\n1. Uso comercial legítimo\n2. Desarrollo y pruebas de software\n3. Educación e investigación\n\n> **Prohibido:** uso para actividades ilegales, spam o scraping masivo.\n\n## 3. Privacidad de datos\n\nTratamos sus datos conforme al **RGPD** y leyes locales aplicables. Consulte nuestra [Política de Privacidad](#) para más detalles.\n\n## 4. Limitación de responsabilidad\n\nEl servicio se provee **tal cual** (`as-is`), sin garantías expresas o implícitas de disponibilidad continua.\n\n## 5. Contacto\n\nPara consultas legales: `legal@empresa.com`"}></sp-markdown>
      </div>
      <div style="padding:16px 24px;border-top:1px solid #e5e7eb;background:#f9fafb;display:flex;justify-content:flex-end;gap:10px;">
        <button style="padding:8px 18px;border:1px solid #d1d5db;background:white;border-radius:6px;cursor:pointer;font-size:14px;">Rechazar</button>
        <button style="padding:8px 18px;background:#6366f1;color:white;border:none;border-radius:6px;cursor:pointer;font-size:14px;font-weight:500;">Aceptar y continuar</button>
      </div>
    </div>
  `,
};

export const ReadmeGitHub: Story = {
  name: "README estilo GitHub",
  render: () => html`
    <div style="max-width:760px;border:1px solid #d0d7de;border-radius:6px;overflow:hidden;font-family:system-ui,sans-serif;">
      <div style="background:#f6f8fa;padding:10px 16px;border-bottom:1px solid #d0d7de;display:flex;align-items:center;gap:8px;">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="#57606a"><path d="M0 1.75A.75.75 0 0 1 .75 1h4.253c1.227 0 2.317.59 3 1.501A3.743 3.743 0 0 1 11.006 1h4.245a.75.75 0 0 1 .75.75v10.5a.75.75 0 0 1-.75.75h-4.507a2.25 2.25 0 0 0-1.591.659l-.622.621a.75.75 0 0 1-1.06 0l-.622-.621A2.25 2.25 0 0 0 5.258 13H.75a.75.75 0 0 1-.75-.75Zm7.251 10.324.004-5.073-.002-2.253A2.25 2.25 0 0 0 5.003 2.5H1.5v9h3.757a3.75 3.75 0 0 1 1.994.574ZM8.755 4.75l-.004 7.322a3.752 3.752 0 0 1 1.992-.572H14.5v-9h-3.495a2.25 2.25 0 0 0-2.25 2.25Z"/></svg>
        <span style="font-size:13px;font-weight:600;color:#24292f;">README.md</span>
      </div>
      <div style="padding:24px 32px;background:#fff;">
        <sp-markdown content=${"# sp-component\n\n> Web Components de alto rendimiento construidos con Lit 3\n\n[![npm](https://img.shields.io/badge/npm-v2.1.0-blue)](https://npmjs.com) [![license](https://img.shields.io/badge/license-MIT-green)](https://opensource.org)\n\n## Instalación\n\n```bash\nnpm install sp-component\n```\n\n## Uso rápido\n\n```html\n<script type=\"module\" src=\"sp-component/dist/index.js\"></script>\n\n<sp-button variant=\"primary\">Comenzar</sp-button>\n<sp-spinner size=\"md\"></sp-spinner>\n```\n\n## Componentes\n\n| Componente | Descripción | Estado |\n|---|---|---|\n| `sp-button` | Botón con variantes | ✅ Estable |\n| `sp-card` | Tarjeta con slots | ✅ Estable |\n| `sp-spinner` | Indicadores de carga | ✅ Estable |\n| `sp-gantt` | Diagrama Gantt | 🚧 Beta |\n\n## Contribuir\n\n1. Haz un fork del repositorio\n2. Crea tu rama: `git checkout -b feat/mi-feature`\n3. Abre un Pull Request\n\n## Licencia\n\nMIT © 2026 sp-component"}></sp-markdown>
      </div>
    </div>
  `,
};

export const EmbeddedInCard: Story = {
  name: "Embebido en card",
  render: () => html`
    <div style="max-width:680px;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;box-shadow:0 4px 16px rgba(0,0,0,0.06);">
      <div style="background:#6366f1;padding:16px 24px;">
        <h2 style="margin:0;color:#fff;font-size:18px;font-weight:700;">Documentación</h2>
        <p style="margin:4px 0 0;color:#c7d2fe;font-size:13px;">sp-markdown · v2.1.0</p>
      </div>
      <div style="padding:24px;">
        <sp-markdown content=${"## Descripción\n\nEl componente `sp-markdown` renderiza texto Markdown como HTML seguro.\n\n## Props\n\n| Prop | Tipo | Default |\n|------|------|---------|\n| `content` | `string` | `''` |\n\n## Ejemplo\n\n```html\n<sp-markdown content=\"# Hola\"></sp-markdown>\n```\n\n> El componente sanitiza el HTML para prevenir XSS."}></sp-markdown>
      </div>
    </div>
  `,
};

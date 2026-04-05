# SP Components

[![GitLab](https://img.shields.io/badge/GitLab-wisftock%2Fsp--component-orange?logo=gitlab)](https://gitlab.com/wisftock/sp-component)
[![npm](https://img.shields.io/npm/v/sp-component)](https://www.npmjs.com/package/sp-component)

Una librería de **Web Components** construida con [Lit](https://lit.dev/), compatible con cualquier framework — Angular, React, Vue, Svelte o HTML puro.

**Repositorio:** https://gitlab.com/wisftock/sp-component

- **Sin dependencias extra** — solo Lit como peer dependency
- **TypeScript completo** — tipos incluidos en el paquete
- **Form-associated** — integración nativa con `<form>` y `FormData` con validación via `ElementInternals`
- **Accesible** — navegación por teclado y ARIA en todos los componentes interactivos
- **Dark mode** — automático vía `prefers-color-scheme` con sistema de tokens CSS
- **Themeable** — sistema de tokens completo + API `SpConfig.setTheme()` con temas predefinidos
- **i18n** — todos los strings internos configurables vía `SpConfig.setLocale()`
- **Floating UI** — posicionamiento inteligente de dropdowns, popovers y tooltips (flip, shift, auto-update)
- **Animaciones de entrada y salida** — todos los overlays animados en apertura y cierre
- **Compound components** — API headless/composable para menú y select
- **Tree-shakeable** — importa solo lo que necesitas
- **CDN ready** — bundle IIFE listo para usar sin bundler
- **CLI** — herramienta para copiar componentes directamente a tu proyecto

---

## Tabla de Contenidos

- [Instalación](#instalación)
  - [npm / yarn / pnpm](#npm--yarn--pnpm)
  - [CDN (sin bundler)](#cdn-sin-bundler)
- [Quick Start](#quick-start)
- [Tokens CSS y Dark Mode](#tokens-css-y-dark-mode)
- [SpConfig API](#spconfig-api)
  - [Temas predefinidos](#temas-predefinidos)
  - [Tema personalizado](#tema-personalizado)
  - [Color scheme](#color-scheme)
  - [Densidad](#densidad)
  - [i18n / Internacionalización](#i18n--internacionalización)
- [Uso por Framework](#uso-por-framework)
  - [HTML / Vanilla JS](#html--vanilla-js)
  - [Angular](#angular)
  - [React](#react)
  - [Vue 3](#vue-3)
- [Componentes](#componentes)
  - [Form Inputs](#form-inputs)
  - [Buttons & Actions](#buttons--actions)
  - [Navigation](#navigation)
  - [Overlays](#overlays)
  - [Data Display](#data-display)
  - [Feedback & Status](#feedback--status)
  - [Layout & Utilities](#layout--utilities)
  - [Compound Components](#compound-components-1)
- [Referencia de Componentes](#referencia-de-componentes)
  - [sp-button](#sp-button)
  - [sp-input](#sp-input)
  - [sp-select](#sp-select)
  - [sp-form](#sp-form)
  - [sp-modal](#sp-modal)
  - [sp-drawer](#sp-drawer)
  - [sp-segmented-control](#sp-segmented-control)
  - [sp-inline-edit](#sp-inline-edit)
  - [sp-spinner](#sp-spinner)
  - [sp-accordion](#sp-accordion)
- [Compound Components](#compound-components)
  - [sp-menu-root](#sp-menu-root)
  - [sp-select-root](#sp-select-root)
- [Form Validation API](#form-validation-api)
- [Eventos](#eventos)
- [Form Participation](#form-participation)
- [Theming](#theming)
- [CLI Tool](#cli-tool)
- [Contribuir](#contribuir)
- [Licencia](#licencia)

---

## Instalación

### npm / yarn / pnpm

```bash
npm install sp-component
# o
yarn add sp-component
# o
pnpm add sp-component
```

### CDN (sin bundler)

Si no usas un bundler, puedes cargar la librería directamente desde un CDN o sirviendo el archivo local:

```html
<!-- Desde el paquete publicado -->
<script type="module" src="https://cdn.jsdelivr.net/npm/sp-component/cdn"></script>

<!-- O desde node_modules si instalaste con npm -->
<script type="module" src="/node_modules/sp-component/dist-cdn/sp-component.min.js"></script>
```

El bundle CDN incluye Lit y todo lo necesario — no hace falta ninguna otra dependencia. Todos los componentes quedan disponibles como custom elements globales:

```html
<!DOCTYPE html>
<html>
  <head>
    <script type="module" src="/node_modules/sp-component/dist-cdn/sp-component.min.js"></script>
    <link rel="stylesheet" href="/node_modules/sp-component/dist/tokens.css" />
  </head>
  <body>
    <sp-button variant="primary">Hola mundo</sp-button>
    <sp-spinner size="md"></sp-spinner>
  </body>
</html>
```

---

## Quick Start

### Importar todo (recomendado para prototipos)

```js
import "sp-component";
import "sp-component/tokens.css";
```

### Importar solo lo necesario (recomendado para producción)

```js
import "sp-component/components/button";
import "sp-component/components/input";
import "sp-component/tokens.css";
```

Esto permite que el bundler elimine el código de los componentes que no uses (tree-shaking).

---

## Tokens CSS y Dark Mode

Importa el archivo de tokens **una sola vez** en la raíz de tu aplicación:

```js
// main.js / main.ts
import "sp-component/tokens.css";
```

```html
<!-- o con link tag -->
<link rel="stylesheet" href="node_modules/sp-component/dist/tokens.css" />
```

Los tokens definen CSS custom properties para modo claro y oscuro usando `prefers-color-scheme`. Los componentes se adaptan automáticamente — no necesitas ninguna configuración adicional.

### Sistema de tokens completo

```css
/* Colores */
--sp-primary, --sp-primary-hover, --sp-primary-bg, --sp-primary-focus
--sp-error, --sp-success, --sp-warning, --sp-info
--sp-bg, --sp-bg-subtle, --sp-bg-muted
--sp-text, --sp-text-secondary, --sp-text-muted, --sp-text-placeholder
--sp-border, --sp-border-subtle, --sp-border-strong
--sp-overlay, --sp-shadow-sm, --sp-shadow, --sp-shadow-lg

/* Tipografía */
--sp-font-sans, --sp-font-mono
--sp-font-size-xs, --sp-font-size-sm, --sp-font-size-base, --sp-font-size-md
--sp-font-size-lg, --sp-font-size-xl, --sp-font-size-2xl
--sp-font-weight-normal, --sp-font-weight-medium, --sp-font-weight-semibold, --sp-font-weight-bold
--sp-line-height-tight, --sp-line-height-normal, --sp-line-height-loose

/* Espaciado */
--sp-space-0 (0px) → --sp-space-16 (64px)

/* Border radius */
--sp-radius-none, --sp-radius-sm, --sp-radius-base, --sp-radius-md
--sp-radius-lg, --sp-radius-xl, --sp-radius-2xl, --sp-radius-full

/* Transiciones y animaciones */
--sp-duration-fast (100ms), --sp-duration-base (150ms), --sp-duration-slow (250ms)
--sp-easing-default, --sp-easing-in, --sp-easing-out, --sp-easing-in-out
--sp-anim-duration-mount (200ms), --sp-anim-duration-unmount (150ms)
--sp-easing-spring, --sp-easing-bounce

/* Z-index */
--sp-z-navbar, --sp-z-dropdown, --sp-z-tooltip, --sp-z-overlay, --sp-z-toast
```

---

## SpConfig API

`SpConfig` es un singleton global que controla el tema, color scheme, densidad e i18n de toda la librería en runtime.

```js
import { SpConfig } from "sp-component";
```

### Temas predefinidos

Cambia la paleta de colores primarios en una sola línea:

```js
SpConfig.setTheme("violet");   // violeta
SpConfig.setTheme("rose");     // rojo rosado
SpConfig.setTheme("emerald");  // verde
SpConfig.setTheme("amber");    // amarillo/naranja
SpConfig.setTheme("slate");    // gris azulado
SpConfig.setTheme("default");  // azul (default)
```

| Tema       | Color principal |
| ---------- | --------------- |
| `default`  | `#3b82f6` azul  |
| `violet`   | `#7c3aed`       |
| `rose`     | `#e11d48`       |
| `emerald`  | `#059669`       |
| `amber`    | `#d97706`       |
| `slate`    | `#475569`       |

### Tema personalizado

Pasa un objeto con tokens `--sp-*` para sobreescribir cualquier valor:

```js
SpConfig.setTheme({
  "--sp-primary": "#6366f1",
  "--sp-primary-hover": "#4f46e5",
  "--sp-primary-active": "#4338ca",
  "--sp-primary-bg": "#eef2ff",
  "--sp-primary-focus": "rgba(99, 102, 241, 0.2)",
});
```

### Color scheme

Fuerza el modo claro u oscuro sin depender de la preferencia del sistema:

```js
SpConfig.setColorScheme("light");  // fuerza modo claro
SpConfig.setColorScheme("dark");   // fuerza modo oscuro
SpConfig.setColorScheme("auto");   // sigue prefers-color-scheme (default)
```

### Densidad

Controla el espaciado interno de todos los componentes:

```js
SpConfig.setDensity("compact");     // más compacto
SpConfig.setDensity("comfortable"); // espaciado normal (default)
SpConfig.setDensity("spacious");    // más espacioso
```

### i18n / Internacionalización

Todos los strings internos de la librería (labels de botones, placeholders, aria-labels) son configurables. Hay dos locales incluidos:

```js
import { SpConfig } from "sp-component";
import { es } from "sp-component/locale/es";
import { en } from "sp-component/locale/en";

// Cambiar a español
SpConfig.setLocale(es);

// Cambiar a inglés
SpConfig.setLocale(en);

// Override parcial (solo lo que necesitas cambiar)
SpConfig.setLocale({
  modal: { closeLabel: "Cerrar ventana" },
  common: { confirm: "Aceptar", cancel: "Cancelar" },
});
```

Strings configurables por componente:

| Sección       | Strings                                                           |
| ------------- | ----------------------------------------------------------------- |
| `common`      | `close`, `clear`, `cancel`, `confirm`, `remove`, `loading`, `dismiss` |
| `modal`       | `closeLabel`                                                      |
| `drawer`      | `closeLabel`                                                      |
| `input`       | `clearLabel`                                                      |
| `autocomplete`| `clearLabel`, `openLabel`, `closeLabel`, `removeLabel`            |
| `combobox`    | `clearLabel`, `removeLabel`                                       |
| `pagination`  | `firstPageLabel`, `prevPageLabel`, `nextPageLabel`, `lastPageLabel` |
| `table`       | `searchPlaceholder`, `empty`, `filteredEmpty`, `clearFilters`, ... |
| `fileUpload`  | `removeFileLabel`                                                 |
| `timePicker`  | Labels de incremento/decremento para horas, minutos y segundos    |
| `colorPicker` | `pickerLabel`, `hueLabel`, `alphaLabel`, `valueLabel`             |
| `calendar`    | Labels de navegación de meses y años                              |
| `carousel`    | Labels de slides con soporte para `{index}` y `{total}`           |

---

## Uso por Framework

### HTML / Vanilla JS

```html
<!DOCTYPE html>
<html>
  <head>
    <script type="module">
      import "sp-component";
      import "sp-component/tokens.css";
    </script>
  </head>
  <body>
    <sp-button variant="primary">Enviar</sp-button>
    <sp-input label="Email" type="email" placeholder="tu@email.com"></sp-input>

    <script>
      document.querySelector("sp-input").addEventListener("sp-input", (e) => {
        console.log(e.detail.value);
      });
    </script>
  </body>
</html>
```

---

### Angular

Agrega `CUSTOM_ELEMENTS_SCHEMA` al módulo o componente standalone:

```ts
// app.module.ts
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import "sp-component";
import "sp-component/tokens.css";

@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
```

```ts
// Componente standalone (Angular 15+)
import { Component, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import "sp-component";

@Component({
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <sp-input label="Usuario" [value]="username" (sp-input)="username = $event.detail.value"></sp-input>
    <sp-button variant="primary" (sp-click)="submit()">Ingresar</sp-button>
  `,
})
export class LoginComponent {
  username = "";
  submit() {
    /* ... */
  }
}
```

---

### React

**React 19+** soporta custom elements de forma nativa:

```tsx
import "sp-component";
import "sp-component/tokens.css";

export function LoginForm() {
  const handleInput = (e: Event) => {
    const { value } = (e as CustomEvent<{ value: string }>).detail;
    console.log(value);
  };

  return (
    <div>
      <sp-input label="Email" type="email" onSp-input={handleInput} />
      <sp-button variant="primary">Ingresar</sp-button>
    </div>
  );
}
```

**React 18 y anteriores** — usa `useRef` + `addEventListener`:

```tsx
import { useRef, useEffect } from "react";
import "sp-component";
import "sp-component/tokens.css";

export function LoginForm() {
  const inputRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const input = inputRef.current;
    const handleInput = (e: Event) => {
      console.log((e as CustomEvent<{ value: string }>).detail.value);
    };
    input?.addEventListener("sp-input", handleInput);
    return () => input?.removeEventListener("sp-input", handleInput);
  }, []);

  return (
    <div>
      <sp-input ref={inputRef} label="Email" type="email" />
      <sp-button variant="primary">Ingresar</sp-button>
    </div>
  );
}
```

---

### Vue 3

Vue 3 detecta los custom elements automáticamente si el tag contiene un guión (`sp-`):

```vue
<script setup lang="ts">
import { ref } from "vue";
import "sp-component";
import "sp-component/tokens.css";

const email = ref("");
const role = ref("");
</script>

<template>
  <sp-input label="Email" type="email" :value="email" @sp-input="email = $event.detail.value" />

  <sp-select label="Rol" :value="role" @sp-change="role = $event.detail.value" />

  <sp-button variant="primary">Enviar</sp-button>
</template>
```

---

## Componentes

### Form Inputs

| Componente        | Tag                      | Descripción                                                               |
| ----------------- | ------------------------ | ------------------------------------------------------------------------- |
| Form              | `<sp-form>`              | Wrapper de formulario con validación integrada y evento `sp-submit`       |
| Input             | `<sp-input>`             | Text, email, password, number, search. Variantes: `outline`, `filled`    |
| Textarea          | `<sp-textarea>`          | Texto multilínea con contador de caracteres                               |
| Checkbox          | `<sp-checkbox>`          | Checkbox con animación de checkmark                                       |
| Checkbox Group    | `<sp-checkbox-group>`    | Grupo de checkboxes                                                       |
| Radio             | `<sp-radio>`             | Botón de radio con animación del punto                                    |
| Radio Group       | `<sp-radio-group>`       | Grupo de radios                                                           |
| Switch            | `<sp-switch>`            | Toggle on/off                                                             |
| Select            | `<sp-select>`            | Dropdown con soporte a selección múltiple y `loading`                     |
| Combobox          | `<sp-combobox>`          | Select con búsqueda — individual o múltiple                               |
| Autocomplete      | `<sp-autocomplete>`      | Búsqueda con grupos, descripciones, creatable y async                     |
| Number Input      | `<sp-number-input>`      | Input numérico con incremento/decremento                                  |
| Slider            | `<sp-slider>`            | Range slider — modo simple o rango dual                                   |
| Rating            | `<sp-rating>`            | Valoración por estrellas                                                  |
| OTP Input         | `<sp-otp-input>`         | Input de código de un solo uso (dígito a dígito)                          |
| File Upload       | `<sp-file-upload>`       | Selector de archivos con drag & drop                                      |
| Time Picker       | `<sp-time-picker>`       | Selector de hora/minuto/segundo                                           |
| Color Picker      | `<sp-color-picker>`      | Selector HSV con input hex y paleta de colores                            |
| Tag Input         | `<sp-tag-input>`         | Input para crear tags de texto libre                                      |
| Form Field        | `<sp-form-field>`        | Envuelve cualquier input con label, hint y error                          |
| Segmented Control | `<sp-segmented-control>` | Grupo de botones con selección exclusiva, form-associated                 |
| Inline Edit       | `<sp-inline-edit>`       | Texto que se convierte en input al hacer clic                             |

### Buttons & Actions

| Componente  | Tag                | Descripción                                                                    |
| ----------- | ------------------ | ------------------------------------------------------------------------------ |
| Button      | `<sp-button>`      | Variantes: `primary`, `secondary`, `ghost`, `destructive`, `outline`, `soft`, `link` |
| Copy Button | `<sp-copy-button>` | Copia texto al portapapeles con feedback visual                                |

### Navigation

| Componente | Tag                                        | Descripción                                 |
| ---------- | ------------------------------------------ | ------------------------------------------- |
| Tabs       | `<sp-tabs>` + `<sp-tab>`                   | Navegación por pestañas                     |
| Breadcrumb | `<sp-breadcrumb>` + `<sp-breadcrumb-item>` | Ruta de navegación                          |
| Pagination | `<sp-pagination>`                          | Paginación con salto a página               |
| Navbar     | `<sp-navbar>`                              | Barra de navegación superior                |
| Sidebar    | `<sp-sidebar>`                             | Navegación lateral colapsable               |
| Menu       | `<sp-menu>` + `<sp-menu-item>`             | Menú desplegable con navegación por teclado |
| Stepper    | `<sp-stepper>`                             | Indicador de progreso por pasos             |

### Overlays

| Componente      | Tag                    | Descripción                                                     |
| --------------- | ---------------------- | --------------------------------------------------------------- |
| Modal           | `<sp-modal>`           | Diálogo con focus trap, ESC, animación de entrada/salida y razón de cierre |
| Drawer          | `<sp-drawer>`          | Panel deslizante con focus trap, swipe y razón de cierre        |
| Popover         | `<sp-popover>`         | Panel flotante con posicionamiento inteligente (Floating UI)    |
| Tooltip         | `<sp-tooltip>`         | Pista de texto con posicionamiento automático (Floating UI)     |
| Toast           | `<sp-toast>`           | Notificación temporal con barra de progreso                     |
| Toast Stack     | `<sp-toast-stack>`     | Contenedor para apilar toasts                                   |
| Confirm Dialog  | `<sp-confirm-dialog>`  | Prompt de confirmación con aceptar/cancelar                     |
| Command Palette | `<sp-command-palette>` | Búsqueda de comandos estilo Spotlight con anuncio de resultados |

### Data Display

| Componente           | Tag                                      | Descripción                                       |
| -------------------- | ---------------------------------------- | ------------------------------------------------- |
| Table                | `<sp-table>`                             | Tabla de datos con ordenamiento y selección       |
| Card                 | `<sp-card>`                              | Contenedor con slots de header/footer             |
| Badge                | `<sp-badge>`                             | Etiqueta de estado — `primary`, `success`, `warning`, `error`, `info`, `neutral`, `purple`, `teal`, `orange`, `cyan` |
| Tag                  | `<sp-tag>`                               | Etiqueta dismissable                              |
| Avatar               | `<sp-avatar>`                            | Imagen o iniciales de usuario con punto de estado |
| Stat                 | `<sp-stat>`                              | Métrica con valor, label y tendencia              |
| Timeline             | `<sp-timeline>`                          | Lista vertical de eventos                         |
| Accordion            | `<sp-accordion>` + `<sp-accordion-item>` | Secciones colapsables con animación de apertura y cierre |
| Tree                 | `<sp-tree>` + `<sp-tree-item>`           | Árbol jerárquico de datos                         |
| Gallery              | `<sp-gallery>`                           | Grilla de imágenes con lightbox                   |
| Carousel             | `<sp-carousel>`                          | Carrusel deslizante de contenido                  |
| Calendar             | `<sp-calendar>`                          | Calendario mensual con selección de fecha         |
| Calendar Date Picker | `<sp-calendar-date-picker>`              | Input con popup de calendario                     |

### Feedback & Status

| Componente   | Tag                 | Descripción                                    |
| ------------ | ------------------- | ---------------------------------------------- |
| Alert        | `<sp-alert>`        | Mensaje inline — info, success, warning, error |
| Progress Bar | `<sp-progress-bar>` | Indicador de progreso lineal                   |
| Spinner      | `<sp-spinner>`      | Spinner de carga                               |
| Skeleton     | `<sp-skeleton>`     | Placeholder de carga                           |

### Layout & Utilities

| Componente      | Tag                    | Descripción                              |
| --------------- | ---------------------- | ---------------------------------------- |
| Divider         | `<sp-divider>`         | Separador horizontal o vertical          |
| Split Panel     | `<sp-split-panel>`     | Layout de dos paneles redimensionables   |
| Scroll Area     | `<sp-scroll-area>`     | Contenedor con scrollbar personalizado   |
| Empty State     | `<sp-empty-state>`     | Placeholder de estado vacío con acción   |
| Icon            | `<sp-icon>`            | Wrapper SVG con variantes de tamaño      |
| Kbd             | `<sp-kbd>`             | Display de teclas de teclado             |
| Visually Hidden | `<sp-visually-hidden>` | Contenido solo para lectores de pantalla |

### Compound Components

| Componente          | Tags                                                                                    | Descripción                             |
| ------------------- | --------------------------------------------------------------------------------------- | --------------------------------------- |
| Menu (compound)     | `<sp-menu-root>` `<sp-menu-trigger>` `<sp-menu-content>` `<sp-menu-option>` `<sp-menu-separator>` | Menú headless completamente composable  |
| Select (compound)   | `<sp-select-root>` `<sp-select-trigger>` `<sp-select-content>` `<sp-select-item>` `<sp-select-group>` | Select headless completamente composable |

---

## Referencia de Componentes

### sp-button

```html
<!-- Variantes básicas -->
<sp-button variant="primary">Primary</sp-button>
<sp-button variant="secondary">Secondary</sp-button>
<sp-button variant="ghost">Ghost</sp-button>
<sp-button variant="destructive">Eliminar</sp-button>

<!-- Nuevas variantes -->
<sp-button variant="outline">Outline</sp-button>
<sp-button variant="soft">Soft</sp-button>
<sp-button variant="link">Link</sp-button>

<!-- Tamaños -->
<sp-button size="sm">Pequeño</sp-button>
<sp-button size="md">Mediano</sp-button>
<sp-button size="lg">Grande</sp-button>

<!-- Estados -->
<sp-button disabled>Deshabilitado</sp-button>
<sp-button loading>Cargando...</sp-button>
<sp-button full-width>Ancho completo</sp-button>

<!-- Como enlace -->
<sp-button href="https://example.com" target="_blank">Abrir enlace</sp-button>

<!-- Para formularios -->
<sp-button type="submit">Enviar</sp-button>
<sp-button type="reset">Limpiar</sp-button>
```

| Propiedad    | Tipo                                                                      | Default   | Descripción                           |
| ------------ | ------------------------------------------------------------------------- | --------- | ------------------------------------- |
| `variant`    | `primary \| secondary \| ghost \| destructive \| outline \| soft \| link` | `primary` | Estilo visual del botón               |
| `size`       | `sm \| md \| lg`                                                          | `md`      | Tamaño del botón                      |
| `disabled`   | `boolean`                                                                 | `false`   | Deshabilita el botón                  |
| `loading`    | `boolean`                                                                 | `false`   | Muestra spinner y bloquea interacción |
| `full-width` | `boolean`                                                                 | `false`   | Expande al 100% del contenedor        |
| `type`       | `button \| submit \| reset`                                               | `button`  | Tipo nativo del botón                 |
| `href`       | `string`                                                                  | —         | Renderiza como `<a>` cuando se provee |
| `target`     | `string`                                                                  | —         | Target del enlace (requiere `href`)   |
| `label`      | `string`                                                                  | —         | `aria-label` accesible                |

| Evento     | Detail       | Descripción                                          |
| ---------- | ------------ | ---------------------------------------------------- |
| `sp-click` | `{ source }` | Emitido al hacer click (si no está disabled/loading) |

| Slot      | Descripción                         |
| --------- | ----------------------------------- |
| (default) | Contenido / texto del botón         |
| `prefix`  | Contenido antes del label (icono)   |
| `suffix`  | Contenido después del label (icono) |

---

### sp-input

```html
<!-- Tipos -->
<sp-input type="text" label="Nombre" placeholder="Tu nombre"></sp-input>
<sp-input type="email" label="Email" placeholder="tu@email.com"></sp-input>
<sp-input type="password" label="Contraseña"></sp-input>
<sp-input type="search" label="Buscar" clearable></sp-input>

<!-- Variantes -->
<sp-input variant="outline" label="Outline (default)"></sp-input>
<sp-input variant="filled" label="Filled"></sp-input>

<!-- Con hint y error -->
<sp-input label="Usuario" hint="Mínimo 6 caracteres" minlength="6"></sp-input>
<sp-input label="Email" error="El email no es válido"></sp-input>

<!-- Contador de caracteres -->
<sp-input label="Bio" maxlength="120" placeholder="Cuéntanos sobre ti"></sp-input>

<!-- Tamaños -->
<sp-input size="sm" label="Pequeño"></sp-input>
<sp-input size="md" label="Mediano"></sp-input>
<sp-input size="lg" label="Grande"></sp-input>
```

| Propiedad     | Tipo                                                          | Default     | Descripción                                             |
| ------------- | ------------------------------------------------------------- | ----------- | ------------------------------------------------------- |
| `type`        | `text \| email \| password \| number \| search \| tel \| url` | `text`      | Tipo del input nativo                                   |
| `variant`     | `outline \| filled`                                           | `outline`   | Estilo visual del input                                 |
| `value`       | `string`                                                      | `""`        | Valor del input                                         |
| `label`       | `string`                                                      | —           | Label visible                                           |
| `placeholder` | `string`                                                      | —           | Placeholder                                             |
| `hint`        | `string`                                                      | —           | Texto de ayuda debajo del input                         |
| `error`       | `string`                                                      | —           | Mensaje de error                                        |
| `size`        | `sm \| md \| lg`                                              | `md`        | Tamaño del input                                        |
| `disabled`    | `boolean`                                                     | `false`     | Deshabilita el input                                    |
| `readonly`    | `boolean`                                                     | `false`     | Solo lectura                                            |
| `required`    | `boolean`                                                     | `false`     | Campo requerido                                         |
| `clearable`   | `boolean`                                                     | `false`     | Muestra botón para limpiar el valor                     |
| `loading`     | `boolean`                                                     | `false`     | Muestra spinner (útil para validación asíncrona)        |
| `maxlength`   | `number`                                                      | —           | Máximo de caracteres — muestra contador automáticamente |
| `minlength`   | `number`                                                      | —           | Mínimo de caracteres                                    |
| `name`        | `string`                                                      | —           | Nombre para `FormData`                                  |

| Método                    | Descripción                                         |
| ------------------------- | --------------------------------------------------- |
| `setCustomValidity(msg)`  | Establece un error personalizado (vacío para limpiar) |
| `checkValidity()`         | Retorna `true` si el campo es válido                |
| `reportValidity()`        | Muestra la UI de validación y retorna la validez    |

| Evento      | Detail      | Descripción                    |
| ----------- | ----------- | ------------------------------ |
| `sp-input`  | `{ value }` | Se emite en cada keystroke     |
| `sp-change` | `{ value }` | Se emite al confirmar el valor |
| `sp-clear`  | —           | Se emite al presionar limpiar  |
| `sp-focus`  | —           | Recibió el foco                |
| `sp-blur`   | —           | Perdió el foco                 |

---

### sp-select

```html
<sp-select
  label="País"
  placeholder="Selecciona un país"
  .options=${[
    { value: "ar", label: "Argentina" },
    { value: "mx", label: "México" },
    { value: "es", label: "España" },
  ]}
></sp-select>

<!-- Estado loading (ej. opciones cargando desde API) -->
<sp-select label="Categoría" loading placeholder="Cargando opciones..."></sp-select>

<!-- Selección múltiple -->
<sp-select label="Tecnologías" multiple .options=${[...]}></sp-select>
```

| Propiedad     | Tipo               | Default | Descripción                                             |
| ------------- | ------------------ | ------- | ------------------------------------------------------- |
| `value`       | `string`           | `""`    | Valor seleccionado                                      |
| `placeholder` | `string`           | —       | Opción vacía inicial                                    |
| `options`     | `SpSelectOption[]` | `[]`    | Array de opciones `{ value, label, disabled?, group? }` |
| `multiple`    | `boolean`          | `false` | Permite múltiples selecciones                           |
| `loading`     | `boolean`          | `false` | Muestra spinner (útil mientras se cargan opciones)      |
| `disabled`    | `boolean`          | `false` | Deshabilita el select                                   |
| `required`    | `boolean`          | `false` | Campo requerido                                         |
| `size`        | `sm \| md \| lg`   | `md`    | Tamaño del select                                       |
| `error`       | `string`           | —       | Mensaje de error                                        |
| `hint`        | `string`           | —       | Texto de ayuda                                          |
| `label`       | `string`           | —       | Label visible                                           |
| `name`        | `string`           | —       | Nombre para `FormData`                                  |

| Método                    | Descripción                                           |
| ------------------------- | ----------------------------------------------------- |
| `setCustomValidity(msg)`  | Establece un error personalizado (vacío para limpiar) |
| `checkValidity()`         | Retorna `true` si el campo es válido                  |
| `reportValidity()`        | Muestra la UI de validación y retorna la validez      |

---

### sp-form

Wrapper de formulario que integra todos los componentes `sp-*` form-associated. Previene el submit cuando hay campos inválidos y emite `sp-submit` con los datos del formulario.

```html
<sp-form id="my-form">
  <sp-input name="email" type="email" label="Email" required></sp-input>
  <sp-select name="role" label="Rol" required .options=${[...]}></sp-select>
  <sp-checkbox name="terms" required label="Acepto los términos"></sp-checkbox>
  <sp-button type="submit">Enviar</sp-button>
</sp-form>

<script>
  document.getElementById("my-form").addEventListener("sp-submit", (e) => {
    const data = Object.fromEntries(e.detail.formData);
    console.log(data); // { email: "...", role: "...", terms: "on" }
  });

  document.getElementById("my-form").addEventListener("sp-invalid", () => {
    console.log("Formulario inválido");
  });
</script>
```

| Propiedad    | Tipo      | Default | Descripción                                        |
| ------------ | --------- | ------- | -------------------------------------------------- |
| `novalidate` | `boolean` | `false` | Omite la validación al hacer submit                |

| Método              | Descripción                                            |
| ------------------- | ------------------------------------------------------ |
| `submit()`          | Envía el formulario programáticamente (con validación) |
| `reset()`           | Resetea todos los campos                               |
| `checkValidity()`   | Retorna `true` si todos los campos son válidos         |
| `reportValidity()`  | Muestra errores de validación y retorna la validez     |

| Evento       | Detail            | Descripción                                   |
| ------------ | ----------------- | --------------------------------------------- |
| `sp-submit`  | `{ formData }`    | Se emite cuando el formulario es válido       |
| `sp-invalid` | —                 | Se emite cuando hay campos inválidos al submit|
| `sp-reset`   | —                 | Se emite al resetear el formulario            |

---

### sp-modal

```html
<sp-modal id="my-modal" label="Confirmar acción">
  <span slot="header">¿Estás seguro?</span>
  <p>Esta acción no se puede deshacer.</p>
  <div slot="footer">
    <sp-button variant="secondary" id="cancel">Cancelar</sp-button>
    <sp-button variant="destructive" id="confirm">Eliminar</sp-button>
  </div>
</sp-modal>

<sp-button id="open-btn">Abrir modal</sp-button>

<script>
  const modal = document.getElementById("my-modal");
  document.getElementById("open-btn").addEventListener("sp-click", () => {
    modal.open = true;
  });

  // El evento sp-hide incluye la razón de cierre
  modal.addEventListener("sp-hide", (e) => {
    console.log(e.detail.reason); // "escape" | "overlay" | "button"
  });
</script>
```

El modal tiene **animación de entrada y salida** — al cerrar, espera que termine la animación CSS antes de llamar `dialog.close()`.

| Propiedad          | Tipo                           | Default | Descripción                           |
| ------------------ | ------------------------------ | ------- | ------------------------------------- |
| `open`             | `boolean`                      | `false` | Abre/cierra el modal                  |
| `label`            | `string`                       | —       | `aria-label` del dialog               |
| `size`             | `sm \| md \| lg \| xl \| full` | `md`    | Tamaño del panel                      |
| `closable`         | `boolean`                      | `true`  | Muestra botón de cierre (✕)           |
| `close-on-overlay` | `boolean`                      | `true`  | Cierra al hacer click fuera del panel |

| Evento          | Detail       | Descripción                                                  |
| --------------- | ------------ | ------------------------------------------------------------ |
| `sp-show`       | —            | Se emite al abrir el modal                                   |
| `sp-hide`       | `{ reason }` | Se emite al cerrar — `reason`: `escape \| overlay \| button` |
| `sp-after-hide` | —            | Se emite ~50ms después del cierre (útil para limpieza)       |

| Slot      | Descripción                       |
| --------- | --------------------------------- |
| (default) | Cuerpo del modal                  |
| `header`  | Encabezado del modal              |
| `footer`  | Pie del modal (botones de acción) |

---

### sp-drawer

```html
<sp-drawer id="my-drawer" placement="right" size="360px">
  <span slot="header">Configuración</span>
  <p>Contenido del drawer...</p>
</sp-drawer>

<script>
  document.getElementById("my-drawer").addEventListener("sp-hide", (e) => {
    // reason: "escape" | "overlay" | "button" | "swipe"
    console.log("Cerrado por:", e.detail.reason);
  });
</script>
```

| Propiedad          | Tipo                             | Default | Descripción                            |
| ------------------ | -------------------------------- | ------- | -------------------------------------- |
| `open`             | `boolean`                        | `false` | Abre/cierra el drawer                  |
| `placement`        | `left \| right \| top \| bottom` | `right` | Dirección de entrada                   |
| `size`             | `string`                         | `320px` | Ancho (left/right) o alto (top/bottom) |
| `closable`         | `boolean`                        | `true`  | Muestra botón de cierre (✕)            |
| `close-on-overlay` | `boolean`                        | `true`  | Cierra al hacer click fuera            |

| Evento          | Detail       | Descripción                                                           |
| --------------- | ------------ | --------------------------------------------------------------------- |
| `sp-show`       | —            | Se emite al abrir                                                     |
| `sp-hide`       | `{ reason }` | Se emite al cerrar — `reason`: `escape \| overlay \| button \| swipe` |
| `sp-after-hide` | —            | Se emite 300ms después del cierre                                     |

---

### sp-segmented-control

Grupo de botones con selección exclusiva. Ideal para toggles de vista, filtros de tiempo, o cualquier opción mutuamente excluyente. Es **form-associated** — funciona con `<form>` y `FormData`.

```html
<sp-segmented-control value="week" name="view" id="view-control"></sp-segmented-control>

<script>
  const ctrl = document.getElementById("view-control");
  ctrl.options = [
    { value: "day", label: "Día" },
    { value: "week", label: "Semana" },
    { value: "month", label: "Mes" },
    { value: "year", label: "Año" },
  ];
  ctrl.addEventListener("sp-change", (e) => {
    console.log(e.detail.value);
  });
</script>
```

| Propiedad    | Tipo                         | Default | Descripción                                            |
| ------------ | ---------------------------- | ------- | ------------------------------------------------------ |
| `value`      | `string`                     | `""`    | Valor del item seleccionado                            |
| `options`    | `SpSegmentedControlOption[]` | `[]`    | Array de opciones `{ value, label, disabled?, icon? }` |
| `disabled`   | `boolean`                    | `false` | Deshabilita todas las opciones                         |
| `required`   | `boolean`                    | `false` | Campo requerido en formularios                         |
| `name`       | `string`                     | —       | Nombre para `FormData`                                 |
| `size`       | `sm \| md \| lg`             | `md`    | Tamaño del control                                     |
| `full-width` | `boolean`                    | `false` | Se expande al ancho del contenedor                     |

---

### sp-inline-edit

Texto que se convierte en un input al hacer clic.

```html
<sp-inline-edit value="Nombre del proyecto" name="title"></sp-inline-edit>
```

**Interacción:**
- **Clic o Enter/Espacio** sobre el texto → activa el modo edición
- **Enter** en el input → confirma y guarda el nuevo valor
- **Escape** en el input → cancela y restaura el valor anterior

| Propiedad     | Tipo                             | Default           | Descripción                                |
| ------------- | -------------------------------- | ----------------- | ------------------------------------------ |
| `value`       | `string`                         | `""`              | Valor actual del campo                     |
| `placeholder` | `string`                         | —                 | Placeholder del input en modo edición      |
| `type`        | `text \| number \| email \| url` | `text`            | Tipo del input                             |
| `disabled`    | `boolean`                        | `false`           | Deshabilita la edición                     |
| `readonly`    | `boolean`                        | `false`           | Muestra el valor sin permitir edición      |
| `name`        | `string`                         | —                 | Nombre para `FormData`                     |
| `empty-text`  | `string`                         | `"Click to edit"` | Texto cuando el valor está vacío           |

---

### sp-spinner

```html
<sp-spinner size="sm"></sp-spinner>
<sp-spinner size="md"></sp-spinner>
<sp-spinner size="lg"></sp-spinner>
<sp-spinner size="xl"></sp-spinner>
```

| Propiedad | Tipo                   | Default | Descripción                         |
| --------- | ---------------------- | ------- | ----------------------------------- |
| `size`    | `sm \| md \| lg \| xl` | `md`    | Tamaño del spinner                  |
| `label`   | `string`               | `""`    | Texto accesible para screen readers |

---

### sp-accordion

```html
<sp-accordion>
  <sp-accordion-item label="¿Qué es SP Components?">
    Una librería de Web Components compatible con cualquier framework.
  </sp-accordion-item>
  <sp-accordion-item label="¿Cómo se instala?">
    Ejecuta <code>npm install sp-component</code>.
  </sp-accordion-item>
  <sp-accordion-item label="Sección deshabilitada" disabled>
    Este item no se puede abrir.
  </sp-accordion-item>
</sp-accordion>

<!-- Múltiples items abiertos a la vez -->
<sp-accordion multiple>
  <sp-accordion-item label="Item 1" open>Contenido 1</sp-accordion-item>
  <sp-accordion-item label="Item 2">Contenido 2</sp-accordion-item>
</sp-accordion>
```

El accordion tiene **animación en apertura y cierre** — la altura transiciona suavemente en ambas direcciones.

| Propiedad (accordion) | Tipo                           | Default   | Descripción                            |
| --------------------- | ------------------------------ | --------- | -------------------------------------- |
| `multiple`            | `boolean`                      | `false`   | Permite varios items abiertos a la vez |
| `variant`             | `default \| bordered \| ghost` | `default` | Estilo visual del acordeón             |

| Propiedad (accordion-item) | Tipo      | Default | Descripción              |
| -------------------------- | --------- | ------- | ------------------------ |
| `label`                    | `string`  | —       | Texto del encabezado     |
| `open`                     | `boolean` | `false` | Abre el item por defecto |
| `disabled`                 | `boolean` | `false` | Deshabilita el item      |
| `value`                    | `string`  | —       | Identificador del item   |

---

## Compound Components

Los compound components ofrecen una **API headless/composable** — tú controlas la estructura HTML y el estilo, los sub-elementos se encargan del comportamiento y la accesibilidad.

### sp-menu-root

```html
<sp-menu-root>
  <sp-menu-trigger>
    <sp-button>Acciones ▾</sp-button>
  </sp-menu-trigger>
  <sp-menu-content>
    <sp-menu-option value="view">Ver detalles</sp-menu-option>
    <sp-menu-option value="edit">Editar</sp-menu-option>
    <sp-menu-option value="duplicate">Duplicar</sp-menu-option>
    <sp-menu-separator></sp-menu-separator>
    <sp-menu-option value="delete" danger>Eliminar</sp-menu-option>
  </sp-menu-content>
</sp-menu-root>

<script>
  document.querySelector("sp-menu-root").addEventListener("sp-select", (e) => {
    console.log(e.detail.value); // "view" | "edit" | "duplicate" | "delete"
  });
</script>
```

| Sub-elemento        | Descripción                                      |
| ------------------- | ------------------------------------------------ |
| `sp-menu-root`      | Contenedor raíz — gestiona el estado open/close  |
| `sp-menu-trigger`   | Envuelve cualquier elemento activador            |
| `sp-menu-content`   | Panel de opciones                                |
| `sp-menu-option`    | Opción individual (prop `danger` para estilo rojo, `disabled` para deshabilitar) |
| `sp-menu-separator` | Separador visual entre grupos de opciones        |

| Evento      | Detail        | Descripción                              |
| ----------- | ------------- | ---------------------------------------- |
| `sp-select` | `{ value }`   | Se emite al seleccionar una opción       |

---

### sp-select-root

```html
<sp-select-root>
  <sp-select-trigger placeholder="Selecciona un país"></sp-select-trigger>
  <sp-select-content>
    <sp-select-group label="América">
      <sp-select-item value="ar">Argentina</sp-select-item>
      <sp-select-item value="mx">México</sp-select-item>
    </sp-select-group>
    <sp-select-group label="Europa">
      <sp-select-item value="es">España</sp-select-item>
    </sp-select-group>
  </sp-select-content>
</sp-select-root>

<script>
  document.querySelector("sp-select-root").addEventListener("sp-select", (e) => {
    console.log(e.detail.value, e.detail.label);
  });
</script>
```

| Sub-elemento        | Descripción                                       |
| ------------------- | ------------------------------------------------- |
| `sp-select-root`    | Contenedor raíz — gestiona el estado open/close   |
| `sp-select-trigger` | Botón activador con prop `placeholder`            |
| `sp-select-content` | Panel de opciones                                 |
| `sp-select-item`    | Opción individual con prop `value`                |
| `sp-select-group`   | Grupo de opciones con prop `label`                |

| Evento      | Detail               | Descripción                        |
| ----------- | -------------------- | ---------------------------------- |
| `sp-select` | `{ value, label }`   | Se emite al seleccionar una opción |

---

## Form Validation API

Los componentes form-associated (`sp-input`, `sp-textarea`, `sp-select`, `sp-checkbox`, `sp-switch`) exponen una API de validación nativa compatible con los formularios del navegador.

### Métodos públicos

```js
const input = document.querySelector("sp-input");

// Error personalizado (ej. validación del servidor)
input.setCustomValidity("Este email ya está registrado");
// Limpiar el error personalizado
input.setCustomValidity("");

// Verificar validez sin mostrar UI
input.checkValidity(); // → true | false

// Mostrar UI de validación y verificar validez
input.reportValidity(); // → true | false
```

### CSS :user-invalid / :user-valid

Todos los componentes tienen soporte nativo para las pseudo-clases `:user-invalid` y `:user-valid`. El borde rojo aparece **automáticamente** cuando el usuario interactuó con un campo y lo dejó inválido (sin necesitar JS):

```css
/* Estos estilos ya están incluidos en cada componente */
:host(:user-invalid) .sp-input-container {
  border-color: var(--sp-error, #FF4D4F);
}
:host(:user-valid) .sp-input-container {
  border-color: var(--sp-success, #22c55e);
}
```

### Ejemplo: error del servidor

```js
const form = document.querySelector("sp-form");
const emailInput = document.querySelector("sp-input[name='email']");

form.addEventListener("sp-submit", async (e) => {
  const res = await fetch("/api/register", {
    method: "POST",
    body: e.detail.formData,
  });

  if (!res.ok) {
    const { field, message } = await res.json();
    if (field === "email") {
      emailInput.setCustomValidity(message);
      emailInput.reportValidity();
    }
  }
});

// Limpiar el error al escribir de nuevo
emailInput.addEventListener("sp-input", () => {
  emailInput.setCustomValidity("");
});
```

---

## Eventos

Todos los eventos tienen el prefijo `sp-` para evitar colisiones con eventos nativos del DOM.

| Evento           | Detail                     | Descripción                                                        |
| ---------------- | -------------------------- | ------------------------------------------------------------------ |
| `sp-click`       | `{ source }`               | Botón clickeado                                                    |
| `sp-input`       | `{ value }`                | Valor del input cambiado (cada keystroke)                          |
| `sp-change`      | `{ value }` o `{ values }` | Selección confirmada                                               |
| `sp-search`      | `{ query }`                | Query del autocomplete (para fetch async)                          |
| `sp-create`      | `{ label }`                | El usuario pidió crear una nueva opción                            |
| `sp-focus`       | —                          | El elemento recibió el foco                                        |
| `sp-blur`        | —                          | El elemento perdió el foco                                         |
| `sp-clear`       | —                          | Botón de limpiar clickeado                                         |
| `sp-show`        | —                          | Overlay abierto                                                    |
| `sp-hide`        | `{ reason }`               | Overlay cerrado — `reason`: `escape \| overlay \| button \| swipe` |
| `sp-after-hide`  | —                          | ~50ms después de cerrar (útil para limpieza post-animación)        |
| `sp-submit`      | `{ formData }`             | Formulario enviado y válido (`sp-form`)                            |
| `sp-invalid`     | —                          | Intento de submit con campos inválidos (`sp-form`)                 |
| `sp-reset`       | —                          | Formulario reseteado (`sp-form`)                                   |
| `sp-select`      | `{ value, label? }`        | Opción seleccionada (compound components)                          |
| `sp-toggle`      | `{ open, value }`          | Item del accordion abierto/cerrado                                 |
| `sp-edit-start`  | —                          | Inline edit entró en modo edición                                  |
| `sp-edit-cancel` | —                          | Inline edit canceló la edición                                     |

---

## Form Participation

Los componentes de formulario son **form-associated custom elements** — participan en el submit nativo y en la validación de `<form>` exactamente igual que un `<input>` nativo.

**Componentes form-associated:**
`sp-input`, `sp-textarea`, `sp-select`, `sp-checkbox`, `sp-radio`, `sp-switch`,
`sp-number-input`, `sp-slider`, `sp-rating`, `sp-otp-input`, `sp-combobox`,
`sp-autocomplete`, `sp-file-upload`, `sp-tag-input`, `sp-color-picker`,
`sp-time-picker`, `sp-calendar-date-picker`, `sp-segmented-control`, `sp-inline-edit`

### Con `<sp-form>` (recomendado)

```html
<sp-form id="signup-form">
  <sp-input name="email" type="email" label="Email" required></sp-input>
  <sp-textarea name="message" label="Mensaje" maxlength="500" required></sp-textarea>
  <sp-select name="role" label="Rol" required .options=${[...]}></sp-select>
  <sp-checkbox name="agree" value="yes" required>Acepto los términos</sp-checkbox>
  <sp-button type="submit">Registrarse</sp-button>
</sp-form>

<script>
  document.getElementById("signup-form").addEventListener("sp-submit", (e) => {
    const data = Object.fromEntries(e.detail.formData);
    console.log(data);
    // { email: "...", message: "...", role: "...", agree: "yes" }
  });
</script>
```

### Con `<form>` nativo

También puedes usar los componentes dentro de un `<form>` HTML estándar:

```html
<form id="native-form">
  <sp-input name="email" type="email" label="Email" required></sp-input>
  <sp-button type="submit">Enviar</sp-button>
</form>

<script>
  document.getElementById("native-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    console.log(Object.fromEntries(data));
  });
</script>
```

---

## Theming

### Con SpConfig (recomendado)

```js
import { SpConfig } from "sp-component";

// Tema predefinido
SpConfig.setTheme("violet");

// Tema personalizado con tokens CSS
SpConfig.setTheme({
  "--sp-primary": "#6366f1",
  "--sp-primary-hover": "#4f46e5",
  "--sp-primary-active": "#4338ca",
  "--sp-primary-bg": "#eef2ff",
  "--sp-primary-focus": "rgba(99, 102, 241, 0.2)",
});

// Color scheme
SpConfig.setColorScheme("dark");   // fuerza modo oscuro
SpConfig.setColorScheme("light");  // fuerza modo claro
SpConfig.setColorScheme("auto");   // sigue prefers-color-scheme

// Densidad
SpConfig.setDensity("compact");
SpConfig.setDensity("comfortable");
SpConfig.setDensity("spacious");

// Resetear todo
SpConfig.reset();
```

### Overrides con CSS

También puedes sobreescribir tokens directamente en tu CSS:

```css
:root {
  --sp-primary: #6366f1;
  --sp-primary-hover: #4f46e5;
  --sp-primary-bg: #eef2ff;
  --sp-primary-focus: rgba(99, 102, 241, 0.2);

  /* Tipografía */
  --sp-font-sans: "Inter", system-ui, sans-serif;
  --sp-font-size-base: 15px;

  /* Bordes */
  --sp-radius-base: 6px;
  --sp-radius-lg: 10px;
}
```

Los componentes heredan la fuente del documento automáticamente:

```css
body {
  font-family: "Inter", sans-serif;
}
```

---

## CLI Tool

La herramienta CLI permite copiar componentes directamente a tu proyecto para personalizarlos sin depender del paquete npm.

### Instalación

```bash
npm install -g @sp-component/cli
# o usar sin instalar
npx @sp-component/cli <comando>
```

### Comandos

```bash
# Ver todos los componentes disponibles
npx @sp-component/cli list

# Copiar un componente a tu proyecto
npx @sp-component/cli add button

# Copiar varios componentes a la vez
npx @sp-component/cli add button modal select input

# Copiar los tokens CSS y configuración base
npx @sp-component/cli init
```

Los archivos se copian a `src/components/sp/<nombre>/` en tu proyecto, listos para modificar.

---

## Contribuir

```bash
# Clonar e instalar
git clone https://gitlab.com/wisftock/sp-component.git
cd sp-component
npm install

# Storybook (desarrollo visual)
npm run storybook

# Tests
npm run test
npm run test:watch   # modo watch

# Type check
npm run type-check

# Build librería
npm run build

# Build CDN bundle
npm run build:cdn

# Build CLI
npm run build:cli

# Build todo
npm run build:all
```

Antes de abrir un PR:

```bash
npm run type-check   # 0 errores de TypeScript
npm run test         # todos los tests pasando
npm run build        # dist/ generado correctamente
```

---

## Licencia

MIT © [wisftock](https://gitlab.com/wisftock)

# SP Components

[![npm](https://img.shields.io/npm/v/sp-component?color=6366f1&label=npm)](https://www.npmjs.com/package/sp-component)
[![GitLab](https://img.shields.io/badge/GitLab-wisftock%2Fsp--component-orange?logo=gitlab)](https://gitlab.com/wisftock/sp-component)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](./LICENSE)
[![Built with Lit](https://img.shields.io/badge/Built%20with-Lit-blue?logo=lit)](https://lit.dev)

Librería de **Web Components** construida con [Lit 3](https://lit.dev/), compatible con Angular, React, Vue, Svelte y HTML puro. Más de 100 componentes listos para producción.

---

## Características

- **Sin dependencias de runtime** — solo Lit como peer dependency
- **TypeScript** — tipos incluidos, sin configuración adicional
- **Form-associated** — integración nativa con `<form>` y `FormData` vía `ElementInternals`
- **Accesible** — navegación por teclado, roles ARIA y anuncios en todos los componentes interactivos
- **Dark mode** — automático vía `prefers-color-scheme`, con sistema de tokens CSS
- **Themeable** — API `SpConfig.setTheme()` con temas predefinidos y soporte de tokens custom
- **i18n** — todos los strings internos configurables vía `SpConfig.setLocale()`
- **Floating UI** — posicionamiento inteligente de dropdowns, popovers y tooltips
- **Tree-shakeable** — importa solo lo que necesitas
- **CDN ready** — bundle IIFE incluido para uso sin bundler
- **CLI** — herramienta para copiar componentes directamente a tu proyecto

---

## Tabla de contenidos

- [Instalación](#instalación)
- [Quick Start](#quick-start)
- [SpConfig API](#spconfig-api)
- [Uso por framework](#uso-por-framework)
- [Catálogo de componentes](#catálogo-de-componentes)
- [Referencia de API](#referencia-de-api)
- [Form Validation](#form-validation)
- [Eventos](#eventos)
- [Theming](#theming)
- [CLI Tool](#cli-tool)
- [Desarrollo](#desarrollo)
- [Licencia](#licencia)

---

## Instalación

```bash
npm install sp-component
# yarn add sp-component
# pnpm add sp-component
```

### CDN (sin bundler)

```html
<script type="module" src="https://cdn.jsdelivr.net/npm/sp-component/cdn"></script>
```

O desde `node_modules`:

```html
<script type="module" src="/node_modules/sp-component/dist-cdn/sp-component.min.js"></script>
```

El bundle CDN incluye Lit y todos los componentes — no requiere dependencias adicionales.

---

## Quick Start

### Importar todo

```js
import "sp-component";
```

### Importar solo lo necesario (recomendado para producción)

```js
import "sp-component/components/button";
import "sp-component/components/input";
import "sp-component/components/modal";
```

El bundler eliminará automáticamente los componentes no utilizados (tree-shaking).

---

## SpConfig API

`SpConfig` es un singleton global que controla el tema, color scheme, densidad e i18n en runtime.

```js
import { SpConfig } from "sp-component";
```

### Temas predefinidos

```js
SpConfig.setTheme("default");  // azul  #3b82f6
SpConfig.setTheme("violet");   // violeta  #7c3aed
SpConfig.setTheme("rose");     // rojo  #e11d48
SpConfig.setTheme("emerald");  // verde  #059669
SpConfig.setTheme("amber");    // naranja  #d97706
SpConfig.setTheme("slate");    // gris  #475569
```

### Tema personalizado

```js
SpConfig.setTheme({
  "--sp-primary":       "#6366f1",
  "--sp-primary-hover": "#4f46e5",
  "--sp-primary-active":"#4338ca",
  "--sp-primary-bg":    "#eef2ff",
  "--sp-primary-focus": "rgba(99,102,241,0.2)",
});
```

### Color scheme y densidad

```js
SpConfig.setColorScheme("light");       // fuerza modo claro
SpConfig.setColorScheme("dark");        // fuerza modo oscuro
SpConfig.setColorScheme("auto");        // sigue prefers-color-scheme (default)

SpConfig.setDensity("compact");         // más compacto
SpConfig.setDensity("comfortable");     // normal (default)
SpConfig.setDensity("spacious");        // más espacioso
```

### i18n

```js
import { SpConfig } from "sp-component";
import { es } from "sp-component/locale/es";
import { en } from "sp-component/locale/en";

SpConfig.setLocale(es);   // español
SpConfig.setLocale(en);   // inglés

// Override parcial
SpConfig.setLocale({
  modal: { closeLabel: "Cerrar ventana" },
  common: { confirm: "Aceptar", cancel: "Cancelar" },
});
```

---

## Uso por framework

### HTML / Vanilla JS

```html
<!DOCTYPE html>
<html>
<head>
  <script type="module" src="/node_modules/sp-component/dist-cdn/sp-component.min.js"></script>
</head>
<body>
  <sp-button variant="primary" id="btn">Enviar</sp-button>
  <sp-input label="Email" type="email" id="email"></sp-input>

  <script>
    document.getElementById("email").addEventListener("sp-input", (e) => {
      console.log(e.detail.value);
    });
  </script>
</body>
</html>
```

### Angular

```ts
// app.module.ts
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import "sp-component";

@NgModule({ schemas: [CUSTOM_ELEMENTS_SCHEMA] })
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
    <sp-input label="Email" [value]="email" (sp-input)="email = $event.detail.value"></sp-input>
    <sp-button variant="primary" (sp-click)="submit()">Ingresar</sp-button>
  `,
})
export class LoginComponent {
  email = "";
  submit() { /* ... */ }
}
```

### React

**React 19+** soporta custom elements de forma nativa:

```tsx
import "sp-component";

export function LoginForm() {
  return (
    <div>
      <sp-input label="Email" type="email" onSp-input={(e) => console.log(e.detail.value)} />
      <sp-button variant="primary">Ingresar</sp-button>
    </div>
  );
}
```

**React 18 y anteriores** — usa `useRef` + `addEventListener`:

```tsx
import { useRef, useEffect } from "react";
import "sp-component";

export function LoginForm() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    const handler = (e: Event) => console.log((e as CustomEvent).detail.value);
    el?.addEventListener("sp-input", handler);
    return () => el?.removeEventListener("sp-input", handler);
  }, []);

  return <sp-input ref={ref} label="Email" type="email" />;
}
```

### Vue 3

Vue 3 detecta los custom elements automáticamente cuando el tag contiene un guión:

```vue
<script setup lang="ts">
import { ref } from "vue";
import "sp-component";

const email = ref("");
</script>

<template>
  <sp-input label="Email" :value="email" @sp-input="email = $event.detail.value" />
  <sp-button variant="primary">Enviar</sp-button>
</template>
```

---

## Catálogo de componentes

### Formularios e inputs

| Componente           | Tag                          | Descripción                                               |
|----------------------|------------------------------|-----------------------------------------------------------|
| Form                 | `<sp-form>`                  | Wrapper con validación integrada y evento `sp-submit`     |
| Form Field           | `<sp-form-field>`            | Envuelve cualquier input con label, hint y error          |
| Input                | `<sp-input>`                 | Text, email, password, number, search — variantes outline/filled |
| Password Input       | `<sp-password-input>`        | Input de contraseña con toggle de visibilidad             |
| Masked Input         | `<sp-masked-input>`          | Input con máscara de formato (teléfono, tarjeta, fecha…)  |
| Phone Input          | `<sp-phone-input>`           | Input de teléfono con selector de país y prefijo          |
| Search Input         | `<sp-search-input>`          | Input de búsqueda con debounce y botón de limpiar         |
| Number Input         | `<sp-number-input>`          | Numérico con botones de incremento/decremento             |
| Textarea             | `<sp-textarea>`              | Texto multilínea con contador de caracteres               |
| Checkbox             | `<sp-checkbox>`              | Checkbox con animación de checkmark                       |
| Checkbox Group       | `<sp-checkbox-group>`        | Grupo de checkboxes                                       |
| Radio                | `<sp-radio>`                 | Botón de radio                                            |
| Switch               | `<sp-switch>`                | Toggle on/off                                             |
| Rating               | `<sp-rating>`                | Valoración por estrellas                                  |
| Slider               | `<sp-slider>`                | Range slider — modo simple o rango dual                   |
| Select               | `<sp-select>`                | Dropdown con soporte a selección múltiple y loading       |
| Select (compound)    | `<sp-select-root>`           | Select headless completamente composable                  |
| Combobox             | `<sp-combobox>`              | Select con búsqueda — individual o múltiple               |
| Autocomplete         | `<sp-autocomplete>`          | Búsqueda con grupos, creatable y async                    |
| Cascader             | `<sp-cascader>`              | Selector jerárquico multinivel                            |
| Mention              | `<sp-mention>`               | Input con autocompletado al escribir `@`                  |
| Tag Input            | `<sp-tag-input>`             | Input para crear tags de texto libre                      |
| Transfer             | `<sp-transfer>`              | Selector de transferencia entre dos listas                |
| OTP Input            | `<sp-otp-input>`             | Input de código de un solo uso (dígito a dígito)          |
| Color Picker         | `<sp-color-picker>`          | Selector HSV con input hex y paleta                       |
| Time Picker          | `<sp-time-picker>`           | Selector de hora / minuto / segundo                       |
| Date Time Picker     | `<sp-date-time-picker>`      | Selector de fecha y hora con popup de calendario          |
| Date Range Picker    | `<sp-date-range-picker>`     | Selector de rango de fechas                               |
| Month Picker         | `<sp-month-picker>`          | Selector de mes y año                                     |
| File Upload          | `<sp-file-upload>`           | Selector de archivos con drag & drop                      |
| Segmented Control    | `<sp-segmented-control>`     | Grupo de botones con selección exclusiva, form-associated |
| Inline Edit          | `<sp-inline-edit>`           | Texto que se convierte en input al hacer clic             |

### Botones y acciones

| Componente    | Tag                | Descripción                                                                    |
|---------------|--------------------|--------------------------------------------------------------------------------|
| Button        | `<sp-button>`      | Variantes: `primary`, `secondary`, `ghost`, `destructive`, `outline`, `soft`, `link` |
| Copy Button   | `<sp-copy-button>` | Copia texto al portapapeles con feedback visual                                |
| FAB           | `<sp-fab>`         | Floating Action Button con posición fija en pantalla                           |

### Navegación

| Componente  | Tag                                        | Descripción                                       |
|-------------|--------------------------------------------|---------------------------------------------------|
| Tabs        | `<sp-tabs>` + `<sp-tab>`                   | Navegación por pestañas                           |
| Breadcrumb  | `<sp-breadcrumb>` + `<sp-breadcrumb-item>` | Ruta de navegación                                |
| Pagination  | `<sp-pagination>`                          | Paginación con salto a página                     |
| Sidebar     | `<sp-sidebar>`                             | Navegación lateral colapsable                     |
| Menubar     | `<sp-menubar>`                             | Barra de menú horizontal estilo aplicación        |
| Stepper     | `<sp-stepper>`                             | Indicador de progreso por pasos                   |
| Toolbar     | `<sp-toolbar>`                             | Barra de herramientas con acciones agrupadas      |
| Anchor      | `<sp-anchor>`                              | Navegación por anclas con scroll suave            |

### Overlays y notificaciones

| Componente        | Tag                      | Descripción                                                        |
|-------------------|--------------------------|--------------------------------------------------------------------|
| Modal             | `<sp-modal>`             | Diálogo con focus trap, ESC y animación de entrada/salida          |
| Drawer            | `<sp-drawer>`            | Panel deslizante con focus trap, swipe y subtítulo                 |
| Popover           | `<sp-popover>`           | Panel flotante con posicionamiento inteligente (Floating UI)       |
| Tooltip           | `<sp-tooltip>`           | Pista de texto con posicionamiento automático                      |
| Hover Card        | `<sp-hover-card>`        | Tarjeta con información extra al hacer hover                       |
| Toast             | `<sp-toast>`             | Notificación temporal con barra de progreso                        |
| Toast Stack       | `<sp-toast-stack>`       | Contenedor para apilar toasts                                      |
| Confirm Dialog    | `<sp-confirm-dialog>`    | Prompt de confirmación con aceptar/cancelar                        |
| Command Palette   | `<sp-command-palette>`   | Búsqueda de comandos estilo Spotlight                              |
| Notification Center | `<sp-notification-center>` | Panel de notificaciones con contador de no leídas              |
| Floating Panel    | `<sp-floating-panel>`    | Panel flotante y reposicionable por el usuario                     |
| Onboarding        | `<sp-onboarding>`        | Flujo de bienvenida con pasos y modal                              |
| Tour              | `<sp-tour>`              | Guía interactiva con highlights sobre la UI                        |
| Bottom Sheet      | `<sp-bottom-sheet>`      | Panel modal desde el borde inferior (patrón mobile)               |

### Visualización de datos

| Componente           | Tag                                      | Descripción                                          |
|----------------------|------------------------------------------|------------------------------------------------------|
| Table                | `<sp-table>`                             | Tabla con ordenamiento, filtros y selección          |
| Card                 | `<sp-card>`                              | Contenedor con slots de header/footer                |
| Badge                | `<sp-badge>`                             | Etiqueta de estado — 10 variantes de color           |
| Tag                  | `<sp-tag>`                               | Etiqueta dismissable                                 |
| Avatar               | `<sp-avatar>`                            | Imagen o iniciales con punto de estado y grupo       |
| Stat                 | `<sp-stat>`                              | Métrica con valor, label y tendencia                 |
| Accordion            | `<sp-accordion>` + `<sp-accordion-item>` | Secciones colapsables con animación                  |
| Timeline             | `<sp-timeline>`                          | Lista vertical de eventos                            |
| Descriptions         | `<sp-descriptions>`                      | Lista de pares clave-valor en grid                   |
| Tree                 | `<sp-tree>` + `<sp-tree-item>`           | Árbol jerárquico con selección y carga asíncrona     |
| Tree Select          | `<sp-tree-select>`                       | Selector desplegable de árbol                        |
| Calendar             | `<sp-calendar>`                          | Calendario mensual con selección de fecha            |
| Gantt                | `<sp-gantt>`                             | Diagrama de Gantt para planificación de proyectos    |
| Kanban               | `<sp-kanban>`                            | Tablero Kanban con columnas y drag & drop            |
| Org Chart            | `<sp-org-chart>`                         | Organigrama jerárquico                               |
| Heatmap              | `<sp-heatmap>`                           | Mapa de calor estilo GitHub contributions            |
| Sparkline            | `<sp-sparkline>`                         | Minigráfico de línea/barra/área                      |
| Gallery              | `<sp-gallery>`                           | Grilla de imágenes con lightbox integrado            |
| Carousel             | `<sp-carousel>`                          | Carrusel deslizante de contenido                     |
| Lightbox             | `<sp-lightbox>`                          | Visor de imágenes a pantalla completa                |

### Contenido enriquecido y media

| Componente      | Tag                    | Descripción                                            |
|-----------------|------------------------|--------------------------------------------------------|
| Markdown        | `<sp-markdown>`        | Renderizador de Markdown con resaltado de sintaxis     |
| Code Block      | `<sp-code-block>`      | Bloque de código con copia y resaltado                 |
| Code Editor     | `<sp-code-editor>`     | Editor de código en el navegador                       |
| Diff Viewer     | `<sp-diff-viewer>`     | Visualizador de diferencias entre dos textos           |
| Rich Text Editor| `<sp-rich-text-editor>`| Editor WYSIWYG completo                                |
| Image Compare   | `<sp-image-compare>`   | Comparador de imágenes con divisor deslizante          |
| Image Crop      | `<sp-image-crop>`      | Recortador interactivo de imágenes                     |
| Audio Player    | `<sp-audio-player>`    | Reproductor de audio con controles personalizados      |
| Video Player    | `<sp-video-player>`    | Reproductor de video con controles personalizados      |
| PDF Viewer      | `<sp-pdf-viewer>`      | Visor de documentos PDF                                |
| Chat Bubble     | `<sp-chat-bubble>`     | Burbuja de mensaje estilo chat                         |
| Signature       | `<sp-signature>`       | Canvas para captura de firma digital                   |
| Credit Card     | `<sp-credit-card>`     | Tarjeta de crédito interactiva con flip y validación   |

### Feedback y estado

| Componente      | Tag                  | Descripción                                       |
|-----------------|----------------------|---------------------------------------------------|
| Alert           | `<sp-alert>`         | Mensaje inline — info, success, warning, error    |
| Banner          | `<sp-banner>`        | Mensaje de página completa (anuncio o aviso)      |
| Progress Bar    | `<sp-progress-bar>`  | Indicador de progreso lineal                      |
| Progress Circle | `<sp-progress-circle>`| Indicador de progreso circular                   |
| Spinner         | `<sp-spinner>`       | Spinner de carga — 5 tamaños (`xs` a `xl`)        |
| Skeleton        | `<sp-skeleton>`      | Placeholder de carga                              |
| Result          | `<sp-result>`        | Pantalla de resultado (éxito, error, 404…)        |

### Layout y utilidades

| Componente       | Tag                    | Descripción                                             |
|------------------|------------------------|---------------------------------------------------------|
| Stack            | `<sp-stack>`           | Flexbox vertical u horizontal con gap y align           |
| Grid             | `<sp-grid>`            | CSS Grid con cols y gap configurables                   |
| Container        | `<sp-container>`       | Ancho máximo centrado — sm/md/lg/xl/2xl                 |
| Split Panel      | `<sp-split-panel>`     | Layout de dos paneles redimensionables                  |
| Resizable Panel  | `<sp-resizable-panel>` | Panel con handle para redimensionar                     |
| Scroll Area      | `<sp-scroll-area>`     | Contenedor con scrollbar personalizado                  |
| Aspect Ratio     | `<sp-aspect-ratio>`    | Contenedor que mantiene proporción de aspecto           |
| Collapsible      | `<sp-collapsible>`     | Contenedor colapsable con animación                     |
| Virtual List     | `<sp-virtual-list>`    | Renderizado virtualizado para listas de 10,000+ ítems   |
| Sortable List    | `<sp-sortable-list>`   | Lista reordenable con drag & drop                       |
| DnD Zone         | `<sp-dnd-zone>`        | Zona de arrastrar y soltar personalizable               |
| Infinite Scroll  | `<sp-infinite-scroll>` | Carga automática al llegar al final del scroll          |
| Divider          | `<sp-divider>`         | Separador horizontal o vertical                         |
| Empty State      | `<sp-empty-state>`     | Placeholder de estado vacío con acción                  |
| Back to Top      | `<sp-back-top>`        | Botón flotante para volver al inicio de la página       |
| Watermark        | `<sp-watermark>`       | Marca de agua repetida en canvas sobre el contenido     |
| Icon             | `<sp-icon>`            | 305+ iconos SVG integrados con tamaños predefinidos     |
| Visually Hidden  | `<sp-visually-hidden>` | Contenido solo para lectores de pantalla                |

---

## Referencia de API

### sp-button

```html
<sp-button variant="primary">Primary</sp-button>
<sp-button variant="secondary">Secondary</sp-button>
<sp-button variant="ghost">Ghost</sp-button>
<sp-button variant="outline">Outline</sp-button>
<sp-button variant="soft">Soft</sp-button>
<sp-button variant="destructive">Eliminar</sp-button>
<sp-button variant="link">Enlace</sp-button>

<sp-button size="sm">Pequeño</sp-button>
<sp-button size="md">Mediano</sp-button>
<sp-button size="lg">Grande</sp-button>

<sp-button loading>Cargando...</sp-button>
<sp-button disabled>Deshabilitado</sp-button>
<sp-button full-width>Ancho completo</sp-button>
<sp-button href="https://example.com" target="_blank">Enlace externo</sp-button>
<sp-button type="submit">Enviar formulario</sp-button>
```

| Propiedad    | Tipo                                                                      | Default   |
|--------------|---------------------------------------------------------------------------|-----------|
| `variant`    | `primary \| secondary \| ghost \| destructive \| outline \| soft \| link` | `primary` |
| `size`       | `sm \| md \| lg`                                                          | `md`      |
| `disabled`   | `boolean`                                                                 | `false`   |
| `loading`    | `boolean`                                                                 | `false`   |
| `full-width` | `boolean`                                                                 | `false`   |
| `type`       | `button \| submit \| reset`                                               | `button`  |
| `href`       | `string`                                                                  | —         |
| `target`     | `string`                                                                  | —         |
| `label`      | `string`                                                                  | —         |

| Slot      | Descripción                         |
|-----------|-------------------------------------|
| (default) | Texto del botón                     |
| `prefix`  | Contenido antes del label (icono)   |
| `suffix`  | Contenido después del label (icono) |

---

### sp-input

```html
<sp-input type="text"     label="Nombre"     placeholder="Tu nombre"></sp-input>
<sp-input type="email"    label="Email"      placeholder="tu@email.com"></sp-input>
<sp-input type="password" label="Contraseña"></sp-input>
<sp-input type="search"   label="Buscar"     clearable></sp-input>

<sp-input label="Con hint"  hint="Mínimo 6 caracteres" minlength="6"></sp-input>
<sp-input label="Con error" error="El email no es válido"></sp-input>
<sp-input label="Bio"       maxlength="120"></sp-input>

<sp-input variant="filled" label="Filled"></sp-input>
<sp-input size="sm" label="Pequeño"></sp-input>
<sp-input size="lg" label="Grande"></sp-input>
<sp-input loading label="Validando..."></sp-input>
```

| Propiedad     | Tipo                                                          | Default   |
|---------------|---------------------------------------------------------------|-----------|
| `type`        | `text \| email \| password \| number \| search \| tel \| url` | `text`    |
| `variant`     | `outline \| filled`                                           | `outline` |
| `value`       | `string`                                                      | `""`      |
| `label`       | `string`                                                      | —         |
| `placeholder` | `string`                                                      | —         |
| `hint`        | `string`                                                      | —         |
| `error`       | `string`                                                      | —         |
| `size`        | `sm \| md \| lg`                                              | `md`      |
| `disabled`    | `boolean`                                                     | `false`   |
| `readonly`    | `boolean`                                                     | `false`   |
| `required`    | `boolean`                                                     | `false`   |
| `clearable`   | `boolean`                                                     | `false`   |
| `loading`     | `boolean`                                                     | `false`   |
| `maxlength`   | `number`                                                      | —         |
| `minlength`   | `number`                                                      | —         |
| `name`        | `string`                                                      | —         |

| Método                   | Descripción                                        |
|--------------------------|----------------------------------------------------|
| `setCustomValidity(msg)` | Establece un error personalizado (vacío = limpiar) |
| `checkValidity()`        | Retorna `true` si el campo es válido               |
| `reportValidity()`       | Muestra la UI de validación y retorna la validez   |

| Evento      | Detail      |
|-------------|-------------|
| `sp-input`  | `{ value }` |
| `sp-change` | `{ value }` |
| `sp-clear`  | —           |
| `sp-focus`  | —           |
| `sp-blur`   | —           |

---

### sp-select

```html
<sp-select label="País" placeholder="Selecciona un país" .options=${[
  { value: "ar", label: "Argentina" },
  { value: "mx", label: "México" },
  { value: "es", label: "España" },
]}></sp-select>

<sp-select label="Categoría" loading placeholder="Cargando..."></sp-select>
<sp-select label="Tecnologías" multiple .options=${[...]}></sp-select>
```

| Propiedad     | Tipo               | Default | Descripción                                             |
|---------------|--------------------|---------|---------------------------------------------------------|
| `value`       | `string`           | `""`    | Valor seleccionado                                      |
| `placeholder` | `string`           | —       | Texto cuando no hay selección                           |
| `options`     | `SpSelectOption[]` | `[]`    | Array `{ value, label, disabled?, group? }`             |
| `multiple`    | `boolean`          | `false` | Permite múltiples selecciones                           |
| `loading`     | `boolean`          | `false` | Muestra spinner mientras cargan las opciones            |
| `disabled`    | `boolean`          | `false` | —                                                       |
| `required`    | `boolean`          | `false` | —                                                       |
| `size`        | `sm \| md \| lg`   | `md`    | —                                                       |
| `error`       | `string`           | —       | —                                                       |
| `hint`        | `string`           | —       | —                                                       |
| `label`       | `string`           | —       | —                                                       |
| `name`        | `string`           | —       | —                                                       |

---

### sp-form

```html
<sp-form id="my-form">
  <sp-input  name="email" type="email" label="Email"      required></sp-input>
  <sp-select name="role"  label="Rol"                     required .options=${[...]}></sp-select>
  <sp-checkbox name="terms" required>Acepto los términos</sp-checkbox>
  <sp-button type="submit">Enviar</sp-button>
</sp-form>

<script>
  document.getElementById("my-form").addEventListener("sp-submit", (e) => {
    const data = Object.fromEntries(e.detail.formData);
    console.log(data); // { email: "...", role: "...", terms: "on" }
  });
</script>
```

| Evento       | Detail         |
|--------------|----------------|
| `sp-submit`  | `{ formData }` |
| `sp-invalid` | —              |
| `sp-reset`   | —              |

---

### sp-modal

```html
<sp-modal id="my-modal" label="Confirmar" size="md">
  <span slot="header">¿Estás seguro?</span>
  <p>Esta acción no se puede deshacer.</p>
  <div slot="footer">
    <sp-button variant="secondary" id="cancel">Cancelar</sp-button>
    <sp-button variant="destructive" id="confirm">Eliminar</sp-button>
  </div>
</sp-modal>

<script>
  const modal = document.getElementById("my-modal");
  document.getElementById("open-btn").addEventListener("sp-click", () => modal.open = true);
  modal.addEventListener("sp-hide", (e) => {
    // reason: "escape" | "overlay" | "button"
    console.log(e.detail.reason);
  });
</script>
```

| Propiedad          | Tipo                           | Default | Descripción                           |
|--------------------|--------------------------------|---------|---------------------------------------|
| `open`             | `boolean`                      | `false` | —                                     |
| `label`            | `string`                       | —       | `aria-label` del dialog               |
| `size`             | `sm \| md \| lg \| xl \| full` | `md`    | —                                     |
| `closable`         | `boolean`                      | `true`  | Muestra botón ✕                       |
| `close-on-overlay` | `boolean`                      | `true`  | Cierra al hacer click fuera           |

| Slot      | Descripción              |
|-----------|--------------------------|
| (default) | Cuerpo del modal         |
| `header`  | Encabezado               |
| `footer`  | Pie con botones de acción|

---

### sp-drawer

```html
<sp-drawer id="drawer" placement="right" size="380px" subtitle="Panel de configuración">
  <span slot="header">Configuración</span>
  <p>Contenido del drawer...</p>
</sp-drawer>

<script>
  document.getElementById("drawer").addEventListener("sp-hide", (e) => {
    // reason: "escape" | "overlay" | "button" | "swipe"
    console.log(e.detail.reason);
  });
</script>
```

| Propiedad          | Tipo                             | Default | Descripción                                |
|--------------------|----------------------------------|---------|--------------------------------------------|
| `open`             | `boolean`                        | `false` | —                                          |
| `placement`        | `left \| right \| top \| bottom` | `right` | Dirección de entrada                       |
| `size`             | `string`                         | `320px` | Ancho (left/right) o alto (top/bottom)     |
| `subtitle`         | `string`                         | `""`    | Subtítulo bajo el header                   |
| `loading`          | `boolean`                        | `false` | Muestra spinner sobre el contenido         |
| `no-overlay`       | `boolean`                        | `false` | Sin overlay — el drawer flota sobre el UI  |
| `closable`         | `boolean`                        | `true`  | Muestra botón ✕                            |
| `close-on-overlay` | `boolean`                        | `true`  | Cierra al hacer click en el overlay        |

| Comportamiento   | Descripción                                                        |
|------------------|--------------------------------------------------------------------|
| Focus trap       | Tab y Shift+Tab ciclan el foco dentro del drawer                   |
| Swipe to close   | Deslizar en la dirección opuesta al origen cierra el drawer        |
| ESC              | Cierra el drawer si está abierto                                   |

---

### sp-accordion

```html
<sp-accordion>
  <sp-accordion-item label="¿Qué es SP Components?">
    Una librería de Web Components compatible con cualquier framework.
  </sp-accordion-item>
  <sp-accordion-item label="¿Cómo se instala?">
    <code>npm install sp-component</code>
  </sp-accordion-item>
  <sp-accordion-item label="Sección deshabilitada" disabled>
    Este ítem no puede abrirse.
  </sp-accordion-item>
</sp-accordion>

<!-- Múltiples items abiertos -->
<sp-accordion multiple>
  <sp-accordion-item label="Item 1" open>Contenido 1</sp-accordion-item>
  <sp-accordion-item label="Item 2">Contenido 2</sp-accordion-item>
</sp-accordion>
```

| Propiedad (accordion)      | Tipo                           | Default   |
|----------------------------|--------------------------------|-----------|
| `multiple`                 | `boolean`                      | `false`   |
| `variant`                  | `default \| bordered \| ghost` | `default` |

| Propiedad (accordion-item) | Tipo      | Default |
|----------------------------|-----------|---------|
| `label`                    | `string`  | —       |
| `open`                     | `boolean` | `false` |
| `disabled`                 | `boolean` | `false` |
| `value`                    | `string`  | —       |

---

### sp-virtual-list

Renderiza únicamente los ítems visibles en la ventana del viewport. Ideal para listas de miles de registros sin impacto en el rendimiento.

```js
const list = document.querySelector("sp-virtual-list");
list.items = Array.from({ length: 10_000 }, (_, i) => ({ id: i, name: `Item ${i}` }));
list.renderItem = (item) => html`
  <div style="padding: 0 16px; height: 100%; display: flex; align-items: center;">
    ${item.name}
  </div>
`;
```

```html
<sp-virtual-list item-height="48" height="500px" buffer="3"></sp-virtual-list>
```

| Propiedad     | Tipo                          | Default  | Descripción                                  |
|---------------|-------------------------------|----------|----------------------------------------------|
| `items`       | `unknown[]`                   | `[]`     | Array de datos                               |
| `renderItem`  | `(item) => TemplateResult`    | —        | Función de renderizado por ítem              |
| `item-height` | `number`                      | `48`     | Alto fijo de cada ítem en px                 |
| `height`      | `string`                      | `400px`  | Alto del contenedor                          |
| `buffer`      | `number`                      | `3`      | Ítems extra renderizados fuera del viewport  |

| Método              | Descripción                                      |
|---------------------|--------------------------------------------------|
| `scrollToIndex(n)`  | Hace scroll hasta el ítem en la posición `n`     |

| Evento          | Detail       |
|-----------------|--------------|
| `sp-item-click` | `{ item, index }` |

---

### sp-sortable-list

```html
<sp-sortable-list
  .items=${[
    { id: "1", label: "Primer ítem", description: "Descripción", icon: "🎨" },
    { id: "2", label: "Segundo ítem", description: "Descripción", icon: "⚙️" },
  ]}
  handles
  @sp-change=${(e) => console.log(e.detail.items)}
></sp-sortable-list>
```

| Propiedad  | Tipo      | Default | Descripción                                   |
|------------|-----------|---------|-----------------------------------------------|
| `items`    | `SortableItem[]` | `[]` | Array `{ id, label, description?, icon?, disabled? }` |
| `disabled` | `boolean` | `false` | Deshabilita el reordenado                     |
| `handles`  | `boolean` | `false` | Limita el drag al ícono handle ⠿              |

| Evento      | Detail        |
|-------------|---------------|
| `sp-change` | `{ items }`   |

---

### sp-credit-card

```html
<sp-credit-card
  number="4111111111111111"
  name="María García"
  expiry="12/28"
  cvv="123"
  interactive
></sp-credit-card>
```

| Propiedad     | Tipo                                                    | Default      |
|---------------|---------------------------------------------------------|--------------|
| `number`      | `string`                                                | `""`         |
| `name`        | `string`                                                | `""`         |
| `expiry`      | `string`                                                | `""`         |
| `cvv`         | `string`                                                | `""`         |
| `network`     | `visa \| mastercard \| amex \| discover \| ...`         | auto-detect  |
| `flipped`     | `boolean`                                               | `false`      |
| `interactive` | `boolean`                                               | `false`      |
| `masked`      | `boolean`                                               | `false`      |
| `size`        | `sm \| md \| lg`                                        | `md`         |

---

## Form Validation

Los componentes form-associated exponen una API de validación compatible con formularios nativos:

```js
const input = document.querySelector("sp-input");

input.setCustomValidity("Este email ya está registrado");
input.setCustomValidity("");   // limpia el error
input.checkValidity();         // → true | false (sin UI)
input.reportValidity();        // → true | false (con UI)
```

**Componentes form-associated:**
`sp-input`, `sp-password-input`, `sp-masked-input`, `sp-textarea`, `sp-select`, `sp-checkbox`,
`sp-radio`, `sp-switch`, `sp-number-input`, `sp-slider`, `sp-rating`, `sp-otp-input`,
`sp-combobox`, `sp-autocomplete`, `sp-file-upload`, `sp-tag-input`, `sp-color-picker`,
`sp-time-picker`, `sp-date-time-picker`, `sp-date-range-picker`, `sp-calendar-date-picker`,
`sp-segmented-control`, `sp-inline-edit`

### Ejemplo: error del servidor

```js
const form    = document.querySelector("sp-form");
const emailEl = document.querySelector("sp-input[name='email']");

form.addEventListener("sp-submit", async (e) => {
  const res = await fetch("/api/register", { method: "POST", body: e.detail.formData });
  if (!res.ok) {
    const { field, message } = await res.json();
    if (field === "email") {
      emailEl.setCustomValidity(message);
      emailEl.reportValidity();
    }
  }
});

emailEl.addEventListener("sp-input", () => emailEl.setCustomValidity(""));
```

---

## Eventos

Todos los eventos tienen el prefijo `sp-` para evitar colisiones con eventos DOM nativos.

| Evento           | Detail                     | Descripción                                                  |
|------------------|----------------------------|--------------------------------------------------------------|
| `sp-click`       | `{ source }`               | Botón clickeado                                              |
| `sp-input`       | `{ value }`                | Valor cambiado (cada keystroke)                              |
| `sp-change`      | `{ value }` / `{ values }` | Selección confirmada                                         |
| `sp-search`      | `{ query }`                | Query del autocomplete (para fetch async)                    |
| `sp-create`      | `{ label }`                | El usuario pidió crear una nueva opción                      |
| `sp-focus`       | —                          | El elemento recibió el foco                                  |
| `sp-blur`        | —                          | El elemento perdió el foco                                   |
| `sp-clear`       | —                          | Botón de limpiar clickeado                                   |
| `sp-show`        | —                          | Overlay abierto                                              |
| `sp-hide`        | `{ reason }`               | Overlay cerrado — `reason`: `escape \| overlay \| button \| swipe` |
| `sp-after-hide`  | —                          | Emitido tras la animación de cierre                          |
| `sp-submit`      | `{ formData }`             | Formulario enviado y válido                                  |
| `sp-invalid`     | —                          | Intento de submit con campos inválidos                       |
| `sp-reset`       | —                          | Formulario reseteado                                         |
| `sp-select`      | `{ value, label? }`        | Opción seleccionada (compound select)                        |
| `sp-toggle`      | `{ open, value }`          | Item del accordion abierto/cerrado                           |
| `sp-item-click`  | `{ item, index }`          | Ítem de virtual-list clickeado                               |
| `sp-edit-start`  | —                          | Inline edit entró en modo edición                            |
| `sp-edit-cancel` | —                          | Inline edit canceló la edición                               |

---

## Theming

### Tokens CSS

```css
/* Colores semánticos */
--sp-primary, --sp-primary-hover, --sp-primary-active, --sp-primary-bg, --sp-primary-focus
--sp-error, --sp-success, --sp-warning, --sp-info
--sp-bg, --sp-bg-subtle, --sp-bg-muted
--sp-text, --sp-text-secondary, --sp-text-muted, --sp-text-placeholder
--sp-border, --sp-border-subtle, --sp-border-strong
--sp-overlay, --sp-shadow-sm, --sp-shadow, --sp-shadow-lg

/* Tipografía */
--sp-font-sans, --sp-font-mono
--sp-font-size-xs ... --sp-font-size-2xl
--sp-font-weight-normal ... --sp-font-weight-bold

/* Espaciado */
--sp-space-0 (0px) → --sp-space-16 (64px)

/* Border radius */
--sp-radius-none, --sp-radius-sm, --sp-radius-base, --sp-radius-md,
--sp-radius-lg, --sp-radius-xl, --sp-radius-2xl, --sp-radius-full

/* Transiciones */
--sp-duration-fast (100ms), --sp-duration-base (150ms), --sp-duration-slow (250ms)
--sp-easing-default, --sp-easing-spring, --sp-easing-bounce

/* Z-index */
--sp-z-dropdown, --sp-z-tooltip, --sp-z-overlay, --sp-z-toast
```

### Override con CSS

```css
:root {
  --sp-primary:       #6366f1;
  --sp-primary-hover: #4f46e5;
  --sp-primary-bg:    #eef2ff;
  --sp-font-sans:     "Inter", system-ui, sans-serif;
  --sp-radius-base:   6px;
}
```

---

## CLI Tool

Copia componentes directamente a tu proyecto para personalizarlos sin depender del paquete npm.

```bash
# Ver todos los componentes disponibles
npx @sp-component/cli list

# Copiar un componente
npx @sp-component/cli add button

# Copiar varios componentes
npx @sp-component/cli add button modal input select

# Inicializar tokens y configuración base
npx @sp-component/cli init
```

Los archivos se copian a `src/components/sp/<nombre>/`, listos para modificar.

---

## Desarrollo

```bash
git clone https://gitlab.com/wisftock/sp-component.git
cd sp-component
npm install

npm run storybook        # Storybook en http://localhost:6006
npm run test             # Vitest
npm run test:watch       # Vitest en modo watch
npm run type-check       # TypeScript strict
npm run build            # dist/ (ES modules + tipos)
npm run build:cdn        # dist-cdn/ (IIFE bundle)
npm run build:cli        # packages/cli
npm run build:all        # Todo de una vez
npm run lint             # ESLint
npm run format           # Prettier
```

Antes de abrir un PR:

```bash
npm run type-check && npm run test && npm run build
```

---

## Licencia

MIT © [wisftock](https://gitlab.com/wisftock)

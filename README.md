# SP Components

Una librería de **Web Components** construida con [Lit](https://lit.dev/), compatible con cualquier framework — Angular, React, Vue, Svelte o HTML puro.

- **Sin dependencias extra** — solo Lit como peer dependency
- **TypeScript completo** — tipos incluidos en el paquete
- **Form-associated** — integración nativa con `<form>` y `FormData`
- **Accesible** — navegación por teclado y ARIA en todos los componentes interactivos
- **Dark mode** — automático vía `prefers-color-scheme` con sistema de tokens CSS
- **Themeable** — CSS custom properties para colores, espaciado y tipografía
- **Tree-shakeable** — importa solo lo que necesitas
- **CDN ready** — bundle IIFE listo para usar sin bundler

---

## Tabla de Contenidos

- [Instalación](#instalación)
  - [npm / yarn / pnpm](#npm--yarn--pnpm)
  - [CDN (sin bundler)](#cdn-sin-bundler)
- [Quick Start](#quick-start)
- [Tokens CSS y Dark Mode](#tokens-css-y-dark-mode)
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
- [Referencia de Componentes](#referencia-de-componentes)
  - [sp-button](#sp-button)
  - [sp-input](#sp-input)
  - [sp-modal](#sp-modal)
  - [sp-spinner](#sp-spinner)
  - [sp-accordion](#sp-accordion)
- [Eventos](#eventos)
- [Form Participation](#form-participation)
- [Theming](#theming)
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
<!-- Desde el paquete publicado (una vez en npm) -->
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

      document.querySelector("sp-button").addEventListener("sp-click", () => {
        console.log("clicked!");
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
  submit() { /* ... */ }
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
      <sp-button variant="primary" onSp-click={() => console.log("submit")}>
        Ingresar
      </sp-button>
    </div>
  );
}
```

**React 18 y anteriores** — usa `useRef` + `addEventListener` porque React 18 no reenvía eventos custom a props:

```tsx
import { useRef, useEffect } from "react";
import "sp-component";
import "sp-component/tokens.css";

export function LoginForm() {
  const inputRef = useRef<HTMLElement>(null);
  const buttonRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const input = inputRef.current;
    const button = buttonRef.current;

    const handleInput = (e: Event) => {
      console.log((e as CustomEvent<{ value: string }>).detail.value);
    };
    const handleClick = () => console.log("submit");

    input?.addEventListener("sp-input", handleInput);
    button?.addEventListener("sp-click", handleClick);

    return () => {
      input?.removeEventListener("sp-input", handleInput);
      button?.removeEventListener("sp-click", handleClick);
    };
  }, []);

  return (
    <div>
      <sp-input ref={inputRef} label="Email" type="email" />
      <sp-button ref={buttonRef} variant="primary">Ingresar</sp-button>
    </div>
  );
}
```

> Para usar `ref` en custom elements con TypeScript, declara los tipos globales extendiendo `JSX.IntrinsicElements` o usa `as any`.

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
  <sp-input
    label="Email"
    type="email"
    :value="email"
    @sp-input="email = $event.detail.value"
  />

  <sp-select
    label="Rol"
    :value="role"
    @sp-change="role = $event.detail.value"
  />

  <sp-button variant="primary" @sp-click="submit">Enviar</sp-button>
</template>
```

---

## Componentes

### Form Inputs

| Componente     | Tag                   | Descripción                                            |
| -------------- | --------------------- | ------------------------------------------------------ |
| Input          | `<sp-input>`          | Text, email, password, number, search, tel, url        |
| Textarea       | `<sp-textarea>`       | Texto multilínea                                       |
| Checkbox       | `<sp-checkbox>`       | Checkbox individual con label                          |
| Checkbox Group | `<sp-checkbox-group>` | Grupo de checkboxes                                    |
| Radio          | `<sp-radio>`          | Botón de radio                                         |
| Radio Group    | `<sp-radio-group>`    | Grupo de radios                                        |
| Switch         | `<sp-switch>`         | Toggle on/off                                          |
| Select         | `<sp-select>`         | Dropdown con soporte a selección múltiple              |
| Combobox       | `<sp-combobox>`       | Select con búsqueda — individual o múltiple            |
| Autocomplete   | `<sp-autocomplete>`   | Búsqueda con grupos, descripciones, creatable y async  |
| Number Input   | `<sp-number-input>`   | Input numérico con incremento/decremento               |
| Slider         | `<sp-slider>`         | Range slider                                           |
| Rating         | `<sp-rating>`         | Valoración por estrellas                               |
| OTP Input      | `<sp-otp-input>`      | Input de código de un solo uso (dígito a dígito)       |
| File Upload    | `<sp-file-upload>`    | Selector de archivos con drag & drop                   |
| Time Picker    | `<sp-time-picker>`    | Selector de hora/minuto/segundo                        |
| Color Picker   | `<sp-color-picker>`   | Selector HSV con input hex y paleta de colores         |
| Tag Input      | `<sp-tag-input>`      | Input para crear tags de texto libre                   |
| Form Field     | `<sp-form-field>`     | Envuelve cualquier input con label, hint y error       |

### Buttons & Actions

| Componente  | Tag                | Descripción                                        |
| ----------- | ------------------ | -------------------------------------------------- |
| Button      | `<sp-button>`      | Primary, secondary, ghost, destructive, link       |
| Copy Button | `<sp-copy-button>` | Copia texto al portapapeles con feedback visual    |

### Navigation

| Componente | Tag                                        | Descripción                              |
| ---------- | ------------------------------------------ | ---------------------------------------- |
| Tabs       | `<sp-tabs>` + `<sp-tab>`                   | Navegación por pestañas                  |
| Breadcrumb | `<sp-breadcrumb>` + `<sp-breadcrumb-item>` | Ruta de navegación                       |
| Pagination | `<sp-pagination>`                          | Paginación con salto a página            |
| Navbar     | `<sp-navbar>`                              | Barra de navegación superior             |
| Sidebar    | `<sp-sidebar>`                             | Navegación lateral colapsable            |
| Menu       | `<sp-menu>` + `<sp-menu-item>`             | Menú desplegable con navegación por teclado |
| Stepper    | `<sp-stepper>`                             | Indicador de progreso por pasos          |

### Overlays

| Componente      | Tag                    | Descripción                                    |
| --------------- | ---------------------- | ---------------------------------------------- |
| Modal           | `<sp-modal>`           | Diálogo con focus trap y cierre con ESC        |
| Drawer          | `<sp-drawer>`          | Panel deslizante con focus trap y ESC          |
| Popover         | `<sp-popover>`         | Panel flotante anclado a un elemento           |
| Tooltip         | `<sp-tooltip>`         | Pista de texto al hacer hover/focus            |
| Toast           | `<sp-toast>`           | Notificación temporal                          |
| Toast Stack     | `<sp-toast-stack>`     | Contenedor para apilar toasts                  |
| Confirm Dialog  | `<sp-confirm-dialog>`  | Prompt de confirmación con aceptar/cancelar    |
| Command Palette | `<sp-command-palette>` | Búsqueda de comandos estilo Spotlight          |

### Data Display

| Componente           | Tag                                      | Descripción                                     |
| -------------------- | ---------------------------------------- | ----------------------------------------------- |
| Table                | `<sp-table>`                             | Tabla de datos con ordenamiento y selección     |
| Card                 | `<sp-card>`                              | Contenedor con slots de header/footer           |
| Badge                | `<sp-badge>`                             | Etiqueta de estado                              |
| Tag                  | `<sp-tag>`                               | Etiqueta dismissable                            |
| Avatar               | `<sp-avatar>`                            | Imagen o iniciales de usuario con punto de estado |
| Stat                 | `<sp-stat>`                              | Métrica con valor, label y tendencia            |
| Timeline             | `<sp-timeline>`                          | Lista vertical de eventos                       |
| Accordion            | `<sp-accordion>` + `<sp-accordion-item>` | Secciones de contenido colapsables              |
| Tree                 | `<sp-tree>` + `<sp-tree-item>`           | Árbol jerárquico de datos                       |
| Gallery              | `<sp-gallery>`                           | Grilla de imágenes con lightbox                 |
| Carousel             | `<sp-carousel>`                          | Carrusel deslizante de contenido                |
| Calendar             | `<sp-calendar>`                          | Calendario mensual con selección de fecha       |
| Calendar Date Picker | `<sp-calendar-date-picker>`              | Input con popup de calendario                   |

### Feedback & Status

| Componente   | Tag                 | Descripción                                       |
| ------------ | ------------------- | ------------------------------------------------- |
| Alert        | `<sp-alert>`        | Mensaje inline — info, success, warning, error    |
| Progress Bar | `<sp-progress-bar>` | Indicador de progreso lineal                      |
| Spinner      | `<sp-spinner>`      | Spinner de carga                                  |
| Skeleton     | `<sp-skeleton>`     | Placeholder de carga                              |

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

---

## Referencia de Componentes

### sp-button

```html
<!-- Variantes -->
<sp-button variant="primary">Primary</sp-button>
<sp-button variant="secondary">Secondary</sp-button>
<sp-button variant="ghost">Ghost</sp-button>
<sp-button variant="destructive">Eliminar</sp-button>

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

<!-- Con iconos en slots -->
<sp-button variant="primary">
  <sp-icon slot="prefix" name="save"></sp-icon>
  Guardar
</sp-button>

<!-- Para formularios -->
<sp-button type="submit">Enviar</sp-button>
<sp-button type="reset">Limpiar</sp-button>
```

| Propiedad   | Tipo                                             | Default     | Descripción                              |
| ----------- | ------------------------------------------------ | ----------- | ---------------------------------------- |
| `variant`   | `primary \| secondary \| ghost \| destructive`   | `primary`   | Estilo visual del botón                  |
| `size`      | `sm \| md \| lg`                                 | `md`        | Tamaño del botón                         |
| `disabled`  | `boolean`                                        | `false`     | Deshabilita el botón                     |
| `loading`   | `boolean`                                        | `false`     | Muestra spinner y bloquea interacción    |
| `full-width`| `boolean`                                        | `false`     | Expande al 100% del contenedor           |
| `type`      | `button \| submit \| reset`                      | `button`    | Tipo nativo del botón                    |
| `href`      | `string`                                         | —           | Renderiza como `<a>` cuando se provee    |
| `target`    | `string`                                         | —           | Target del enlace (requiere `href`)      |
| `label`     | `string`                                         | —           | `aria-label` accesible                   |

| Evento     | Detail            | Descripción                           |
| ---------- | ----------------- | ------------------------------------- |
| `sp-click` | `{ source }`      | Emitido al hacer click (si no está disabled/loading) |

| Slot     | Descripción                        |
| -------- | ---------------------------------- |
| (default)| Contenido / texto del botón        |
| `prefix` | Contenido antes del label (icono)  |
| `suffix` | Contenido después del label (icono)|

---

### sp-input

```html
<!-- Tipos -->
<sp-input type="text" label="Nombre" placeholder="Tu nombre"></sp-input>
<sp-input type="email" label="Email" placeholder="tu@email.com"></sp-input>
<sp-input type="password" label="Contraseña"></sp-input>
<sp-input type="search" label="Buscar" clearable></sp-input>

<!-- Con hint y error -->
<sp-input label="Usuario" hint="Mínimo 6 caracteres" minlength="6"></sp-input>
<sp-input label="Email" error="El email no es válido"></sp-input>

<!-- Tamaños -->
<sp-input size="sm" label="Pequeño"></sp-input>
<sp-input size="md" label="Mediano"></sp-input>
<sp-input size="lg" label="Grande"></sp-input>

<!-- Estados -->
<sp-input disabled label="Deshabilitado"></sp-input>
<sp-input readonly value="Solo lectura" label="Read Only"></sp-input>
<sp-input required label="Requerido"></sp-input>
```

| Propiedad     | Tipo                                                  | Default  | Descripción                                  |
| ------------- | ----------------------------------------------------- | -------- | -------------------------------------------- |
| `type`        | `text \| email \| password \| number \| search \| tel \| url` | `text` | Tipo del input nativo                |
| `value`       | `string`                                              | `""`     | Valor del input                              |
| `label`       | `string`                                              | —        | Label visible                                |
| `placeholder` | `string`                                              | —        | Placeholder                                  |
| `hint`        | `string`                                              | —        | Texto de ayuda debajo del input              |
| `error`       | `string`                                              | —        | Mensaje de error (pone el input en estado inválido) |
| `size`        | `sm \| md \| lg`                                      | `md`     | Tamaño del input                             |
| `disabled`    | `boolean`                                             | `false`  | Deshabilita el input                         |
| `readonly`    | `boolean`                                             | `false`  | Solo lectura                                 |
| `required`    | `boolean`                                             | `false`  | Campo requerido                              |
| `clearable`   | `boolean`                                             | `false`  | Muestra botón para limpiar el valor          |
| `maxlength`   | `number`                                              | —        | Máximo de caracteres                         |
| `minlength`   | `number`                                              | —        | Mínimo de caracteres                         |
| `name`        | `string`                                              | —        | Nombre para `FormData`                       |

| Evento     | Detail        | Descripción                     |
| ---------- | ------------- | ------------------------------- |
| `sp-input` | `{ value }`   | Se emite en cada keystroke      |
| `sp-change`| `{ value }`   | Se emite al confirmar el valor  |
| `sp-clear` | —             | Se emite al presionar limpiar   |
| `sp-focus` | —             | Recibió el foco                 |
| `sp-blur`  | —             | Perdió el foco                  |

---

### sp-modal

```html
<!-- Modal básico -->
<sp-modal id="my-modal" label="Título del modal" open>
  <span slot="header">Mi Modal</span>
  <p>Contenido del modal aquí.</p>
  <div slot="footer">
    <sp-button variant="secondary" id="cancel">Cancelar</sp-button>
    <sp-button variant="primary" id="confirm">Confirmar</sp-button>
  </div>
</sp-modal>

<sp-button id="open-btn">Abrir modal</sp-button>

<script>
  const modal = document.getElementById("my-modal");
  document.getElementById("open-btn").addEventListener("sp-click", () => {
    modal.open = true;
  });
  document.getElementById("cancel").addEventListener("sp-click", () => {
    modal.open = false;
  });
  modal.addEventListener("sp-close", () => {
    console.log("modal cerrado");
  });
</script>
```

| Propiedad        | Tipo                          | Default  | Descripción                                     |
| ---------------- | ----------------------------- | -------- | ----------------------------------------------- |
| `open`           | `boolean`                     | `false`  | Abre/cierra el modal                            |
| `label`          | `string`                      | —        | `aria-label` del dialog                         |
| `size`           | `sm \| md \| lg \| xl \| full`| `md`     | Tamaño del panel                                |
| `closable`       | `boolean`                     | `true`   | Muestra botón de cierre (✕)                     |
| `close-on-overlay`| `boolean`                    | `true`   | Cierra al hacer click fuera del panel           |

| Evento     | Detail | Descripción                   |
| ---------- | ------ | ----------------------------- |
| `sp-open`  | —      | Se emite al abrir el modal    |
| `sp-close` | —      | Se emite al cerrar el modal   |

| Slot       | Descripción                        |
| ---------- | ---------------------------------- |
| (default)  | Cuerpo del modal                   |
| `header`   | Encabezado del modal               |
| `footer`   | Pie del modal (botones de acción)  |

---

### sp-spinner

```html
<!-- Tamaños -->
<sp-spinner size="sm"></sp-spinner>
<sp-spinner size="md"></sp-spinner>
<sp-spinner size="lg"></sp-spinner>
<sp-spinner size="xl"></sp-spinner>

<!-- Con label accesible (visible solo para screen readers) -->
<sp-spinner size="md" label="Cargando datos..."></sp-spinner>
```

| Propiedad | Tipo                  | Default | Descripción                               |
| --------- | --------------------- | ------- | ----------------------------------------- |
| `size`    | `sm \| md \| lg \| xl`| `md`    | Tamaño del spinner                        |
| `label`   | `string`              | `""`    | Texto accesible para screen readers       |

---

### sp-accordion

```html
<!-- Básico -->
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

<!-- Variantes -->
<sp-accordion variant="bordered">...</sp-accordion>
<sp-accordion variant="ghost">...</sp-accordion>
```

| Propiedad (accordion) | Tipo                              | Default    | Descripción                                    |
| --------------------- | --------------------------------- | ---------- | ---------------------------------------------- |
| `multiple`            | `boolean`                         | `false`    | Permite tener varios items abiertos a la vez   |
| `variant`             | `default \| bordered \| ghost`    | `default`  | Estilo visual del acordeón                     |

| Propiedad (accordion-item) | Tipo      | Default | Descripción                    |
| -------------------------- | --------- | ------- | ------------------------------ |
| `label`                    | `string`  | —       | Texto del encabezado           |
| `open`                     | `boolean` | `false` | Abre el item por defecto       |
| `disabled`                 | `boolean` | `false` | Deshabilita el item            |
| `value`                    | `string`  | —       | Identificador del item         |

---

## Eventos

Todos los eventos tienen el prefijo `sp-` para evitar colisiones con eventos nativos del DOM.

| Evento      | Detail                      | Descripción                                         |
| ----------- | --------------------------- | --------------------------------------------------- |
| `sp-click`  | `{ source }`                | Botón clickeado                                     |
| `sp-input`  | `{ value }`                 | Valor del input cambiado (cada keystroke)           |
| `sp-change` | `{ value }` o `{ values }`  | Selección confirmada                                |
| `sp-search` | `{ query }`                 | Query del autocomplete (para fetch async)           |
| `sp-create` | `{ label }`                 | El usuario pidió crear una nueva opción             |
| `sp-focus`  | —                           | El elemento recibió el foco                         |
| `sp-blur`   | —                           | El elemento perdió el foco                          |
| `sp-clear`  | —                           | Botón de limpiar clickeado                          |
| `sp-open`   | —                           | Overlay abierto                                     |
| `sp-close`  | —                           | Overlay cerrado                                     |

```js
document.querySelector("sp-input").addEventListener("sp-input", (e) => {
  console.log(e.detail.value); // string
});

document.querySelector("sp-autocomplete").addEventListener("sp-change", (e) => {
  console.log(e.detail.values); // string[] en modo multiple
});
```

---

## Form Participation

Los componentes de formulario son **form-associated custom elements** — participan en el submit nativo y en la validación de `<form>` exactamente igual que un `<input>` nativo.

```html
<form id="signup-form">
  <sp-input name="email" type="email" label="Email" required></sp-input>
  <sp-textarea name="message" label="Mensaje" required></sp-textarea>
  <sp-select name="role" label="Rol" required></sp-select>
  <sp-checkbox name="agree" value="yes" required>
    Acepto los términos
  </sp-checkbox>
  <sp-button type="submit">Registrarse</sp-button>
</form>

<script>
  document.getElementById("signup-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    console.log(Object.fromEntries(data));
    // { email: "...", message: "...", role: "...", agree: "yes" }
  });
</script>
```

---

## Theming

### Personalizar la paleta de colores

Sobreescribe cualquier token CSS en tu propio archivo de estilos:

```css
:root {
  --sp-primary: #6366f1;        /* indigo en lugar de azul */
  --sp-primary-hover: #4f46e5;
  --sp-primary-bg: #eef2ff;
  --sp-primary-focus: rgba(99, 102, 241, 0.2);
}
```

### Aplicar tu propia tipografía

Los componentes heredan la fuente del documento automáticamente:

```css
body {
  font-family: "Inter", sans-serif;
}
```

### CSS Custom Properties por componente

Algunos componentes exponen propiedades CSS adicionales para personalización fina:

```css
/* sp-button */
sp-button {
  --sp-button-radius: 8px;
  --sp-button-font-size: 15px;
  --sp-button-transition: opacity 0.15s ease;
  --sp-button-spinner-size: 1em;
}
```

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

MIT © wisftock

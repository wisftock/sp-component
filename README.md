# SP Components

A library of **58 Web Components** built with [Lit](https://lit.dev), compatible with any framework — Angular, React, Vue, Svelte, or plain HTML.

[![npm version](https://img.shields.io/npm/v/sp-component)](https://www.npmjs.com/package/sp-component)
[![license](https://img.shields.io/npm/l/sp-component)](./LICENSE)

- **Zero extra dependencies** — only Lit as peer dependency
- **Full TypeScript support** — types included
- **Form-associated** — native `<form>` + `FormData` integration
- **Accessible** — keyboard navigation & ARIA on all interactive components
- **Dark mode** — automatic via `prefers-color-scheme` with CSS token system
- **Themeable** — CSS custom properties for colors, spacing and typography
- **Tree-shakeable** — import only what you need

---

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Dark Mode & Theming](#dark-mode--theming)
- [Usage by Framework](#usage-by-framework)
  - [HTML / Vanilla JS](#html--vanilla-js)
  - [Angular](#angular)
  - [React](#react)
  - [Vue 3](#vue-3)
- [Components](#components)
  - [Form Inputs](#form-inputs)
  - [Buttons & Actions](#buttons--actions)
  - [Navigation](#navigation)
  - [Overlays](#overlays)
  - [Data Display](#data-display)
  - [Feedback & Status](#feedback--status)
  - [Layout & Utilities](#layout--utilities)
- [Events](#events)
- [Form Participation](#form-participation)
- [Contributing](#contributing)
- [License](#license)

---

## Installation

```bash
# npm
npm install sp-component

# yarn
yarn add sp-component

# pnpm
pnpm add sp-component
```

---

## Quick Start

Import all components at once:

```js
import "sp-component";
```

Or import only what you need (tree-shaking):

```js
import "sp-component/components/button";
import "sp-component/components/input";
import "sp-component/components/autocomplete";
```

---

## Dark Mode & Theming

Import the token file once at the root of your app to enable dark mode and global theming:

```js
// main.js / main.ts
import "sp-component";
import "sp-component/tokens.css";
```

```html
<!-- or via link tag -->
<link rel="stylesheet" href="node_modules/sp-component/dist/tokens.css" />
```

The token file defines CSS custom properties for both light and dark mode using `prefers-color-scheme`. Components automatically adapt — no configuration needed.

### Customize the color palette

Override any token in your own CSS:

```css
:root {
  --sp-primary:       #6366f1;   /* indigo instead of blue */
  --sp-primary-hover: #4f46e5;
  --sp-primary-bg:    #eef2ff;
  --sp-primary-focus: rgba(99, 102, 241, 0.2);
}
```

### Apply your own font

All components inherit the document font automatically:

```css
body {
  font-family: "Inter", sans-serif;
}
```

### Standard semantic colors

| Token | Light | Dark |
|---|---|---|
| `--sp-success` | `#52C41A` | `#73D13D` |
| `--sp-info`    | `#1677FF` | `#4096FF` |
| `--sp-warning` | `#FAAD14` | `#FFC53D` |
| `--sp-error`   | `#FF4D4F` | `#FF7875` |

---

## Usage by Framework

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
    <sp-button variant="primary">Click me</sp-button>

    <sp-input
      label="Email"
      type="email"
      placeholder="you@example.com"
    ></sp-input>

    <sp-autocomplete
      label="Country"
      placeholder="Search..."
    ></sp-autocomplete>

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

Add `CUSTOM_ELEMENTS_SCHEMA` to your module or standalone component:

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

```html
<!-- template -->
<sp-input
  label="Username"
  [value]="username"
  (sp-input)="username = $event.detail.value"
></sp-input>

<sp-autocomplete
  label="Category"
  [options]="options"
  (sp-change)="onSelect($event.detail.value)"
></sp-autocomplete>

<sp-button variant="primary" (sp-click)="submit()">Submit</sp-button>
```

---

### React

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
      <sp-button variant="primary">Login</sp-button>
    </div>
  );
}
```

> **React 18 and earlier:** attach events via `useRef` + `addEventListener` since React 18 does not forward custom event props. React 19+ supports custom elements natively.

---

### Vue 3

```vue
<script setup>
import { ref } from "vue";
import "sp-component";
import "sp-component/tokens.css";

const value = ref("");
const selected = ref([]);
</script>

<template>
  <sp-input
    label="Search"
    :value="value"
    @sp-input="value = $event.detail.value"
  />

  <sp-autocomplete
    label="Tags"
    :options="options"
    multiple
    @sp-change="selected = $event.detail.values"
  />

  <sp-button variant="primary" @sp-click="search">Search</sp-button>
</template>
```

---

## Components

### Form Inputs

| Component | Tag | Description |
|---|---|---|
| Input | `<sp-input>` | Text, email, password, number, search, tel, url |
| Textarea | `<sp-textarea>` | Multi-line text input |
| Checkbox | `<sp-checkbox>` | Single checkbox with label |
| Checkbox Group | `<sp-checkbox-group>` | Group of checkboxes |
| Radio | `<sp-radio>` | Radio button |
| Radio Group | `<sp-radio-group>` | Group of radio buttons |
| Switch | `<sp-switch>` | Toggle switch (on/off) |
| Select | `<sp-select>` | Dropdown select with optional multiple |
| Combobox | `<sp-combobox>` | Searchable select — single or multiple |
| Autocomplete | `<sp-autocomplete>` | Search with groups, descriptions, creatable, async |
| Number Input | `<sp-number-input>` | Numeric input with increment/decrement |
| Slider | `<sp-slider>` | Range slider |
| Rating | `<sp-rating>` | Star rating input |
| OTP Input | `<sp-otp-input>` | One-time password digit input |
| File Upload | `<sp-file-upload>` | Drag & drop file picker |
| Time Picker | `<sp-time-picker>` | Hour/minute/second picker |
| Color Picker | `<sp-color-picker>` | HSV color picker with hex input and swatches |
| Tag Input | `<sp-tag-input>` | Free-text tag creation input |
| Form Field | `<sp-form-field>` | Label + hint + error wrapper for any input |

### Buttons & Actions

| Component | Tag | Description |
|---|---|---|
| Button | `<sp-button>` | Primary, secondary, ghost, destructive, link |
| Copy Button | `<sp-copy-button>` | Copies text to clipboard with feedback |

### Navigation

| Component | Tag | Description |
|---|---|---|
| Tabs | `<sp-tabs>` + `<sp-tab>` | Tabbed navigation |
| Breadcrumb | `<sp-breadcrumb>` + `<sp-breadcrumb-item>` | Page path navigation |
| Pagination | `<sp-pagination>` | Page number navigation with jump-to |
| Navbar | `<sp-navbar>` | Top navigation bar |
| Sidebar | `<sp-sidebar>` | Collapsible side navigation |
| Menu | `<sp-menu>` + `<sp-menu-item>` | Dropdown menu with keyboard navigation |
| Stepper | `<sp-stepper>` | Multi-step progress indicator |

### Overlays

| Component | Tag | Description |
|---|---|---|
| Modal | `<sp-modal>` | Dialog with focus trap + ESC close |
| Drawer | `<sp-drawer>` | Slide-in panel with focus trap + ESC close |
| Popover | `<sp-popover>` | Anchored floating panel |
| Tooltip | `<sp-tooltip>` | Hover/focus hint |
| Toast | `<sp-toast>` | Temporary notification |
| Toast Stack | `<sp-toast-stack>` | Container for stacked toasts |
| Confirm Dialog | `<sp-confirm-dialog>` | Confirmation prompt with accept/cancel |
| Command Palette | `<sp-command-palette>` | Spotlight-style command search |

### Data Display

| Component | Tag | Description |
|---|---|---|
| Table | `<sp-table>` | Data table with sorting and selection |
| Card | `<sp-card>` | Content container with header/footer slots |
| Badge | `<sp-badge>` | Status indicator label |
| Tag | `<sp-tag>` | Dismissible label |
| Avatar | `<sp-avatar>` | User image or initials with status dot |
| Stat | `<sp-stat>` | Metric display (value + label + trend) |
| Timeline | `<sp-timeline>` | Vertical event list |
| Accordion | `<sp-accordion>` + `<sp-accordion-item>` | Collapsible content sections |
| Tree | `<sp-tree>` + `<sp-tree-item>` | Hierarchical data tree |
| Gallery | `<sp-gallery>` | Image grid with lightbox |
| Carousel | `<sp-carousel>` | Sliding content carousel |
| Calendar | `<sp-calendar>` | Month calendar with date selection |
| Calendar Date Picker | `<sp-calendar-date-picker>` | Input field with calendar popup |

### Feedback & Status

| Component | Tag | Description |
|---|---|---|
| Alert | `<sp-alert>` | Inline message — info, success, warning, error |
| Progress Bar | `<sp-progress-bar>` | Linear progress indicator |
| Spinner | `<sp-spinner>` | Loading spinner |
| Skeleton | `<sp-skeleton>` | Loading placeholder |

### Layout & Utilities

| Component | Tag | Description |
|---|---|---|
| Divider | `<sp-divider>` | Horizontal/vertical separator |
| Split Panel | `<sp-split-panel>` | Resizable two-pane layout |
| Scroll Area | `<sp-scroll-area>` | Custom scrollbar container |
| Empty State | `<sp-empty-state>` | Zero-data placeholder with action |
| Icon | `<sp-icon>` | SVG icon wrapper with size variants |
| Kbd | `<sp-kbd>` | Keyboard key display |
| Visually Hidden | `<sp-visually-hidden>` | Screen-reader-only content |

---

## Events

All components emit prefixed custom events to avoid collisions with native DOM events.

| Event | Detail | Description |
|---|---|---|
| `sp-click` | `{ source }` | Button clicked |
| `sp-input` | `{ value }` | Input value changed (every keystroke) |
| `sp-change` | `{ value }` or `{ values }` | Selection committed |
| `sp-search` | `{ query }` | Autocomplete query changed (for async fetch) |
| `sp-create` | `{ label }` | User requested to create a new option |
| `sp-focus` | — | Element received focus |
| `sp-blur` | — | Element lost focus |
| `sp-clear` | — | Clear button clicked |
| `sp-open` | — | Overlay opened |
| `sp-close` | — | Overlay closed |

```js
document.querySelector("sp-input").addEventListener("sp-input", (e) => {
  console.log(e.detail.value);
});

document.querySelector("sp-autocomplete").addEventListener("sp-change", (e) => {
  console.log(e.detail.values); // string[] in multiple mode
});
```

---

## Form Participation

All form input components are **form-associated custom elements** — they participate in native `<form>` submission and validation just like `<input>` does.

```html
<form id="signup-form">
  <sp-input    name="email"    type="email" required></sp-input>
  <sp-textarea name="message"              required></sp-textarea>
  <sp-select   name="role"                 required></sp-select>
  <sp-checkbox name="agree"   value="yes"  required></sp-checkbox>
  <sp-button   type="submit">Send</sp-button>
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

## Contributing

```bash
# Clone and install
git clone https://gitlab.com/wisftock/sp-component.git
cd sp-component
npm install

# Run Storybook
npm run storybook

# Run tests
npm run test

# Type check
npm run type-check

# Build
npm run build
```

Before submitting a PR:

```bash
npm run type-check   # 0 TypeScript errors
npm run test         # 1010 tests passing
npm run build        # dist/ generated correctly
```

---

## License

MIT © wisftock

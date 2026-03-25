# SP Components

A library of **57 Web Components** , compatible with any framework — Angular, React, Vue, Svelte, or plain HTML.

- Zero runtime dependencies (only Lit)
- Full TypeScript support
- Form-associated (native `<form>` integration)
- Keyboard navigation & ARIA accessible
- `prefers-reduced-motion` support

---

## Table of Contents

- [SP Components](#sp-components)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
  - [Quick Start](#quick-start)
  - [Usage by Framework](#usage-by-framework)
    - [HTML / Vanilla JS](#html--vanilla-js)
    - [Angular](#angular)
    - [React](#react)
    - [Vue 3](#vue-3)
  - [Components](#components)
    - [Form Inputs](#form-inputs)
    - [Buttons \& Actions](#buttons--actions)
    - [Navigation](#navigation)
    - [Overlays](#overlays)
    - [Display](#display)
  - [Customization](#customization)
  - [Events](#events)
  - [Form Participation](#form-participation)
  - [Contributing](#contributing)
  - [License](#license)

---

## Installation

```bash
npm install libreria-component
```

---

## Quick Start

Import everything at once:

```js
import "libreria-component";
```

Or import only the components you need:

```js
import "libreria-component/components/button";
import "libreria-component/components/input";
```

---

## Usage by Framework

### HTML / Vanilla JS

```html
<!DOCTYPE html>
<html>
  <head>
    <script type="module">
      import "libreria-component";
    </script>
  </head>
  <body>
    <sp-button variant="primary">Click me</sp-button>

    <sp-input
      label="Email"
      type="email"
      placeholder="you@example.com"
    ></sp-input>

    <script>
      document.querySelector("sp-button").addEventListener("sp-click", () => {
        console.log("clicked!");
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
import "libreria-component";

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

<sp-button variant="primary" (sp-click)="submit()">Submit</sp-button>
```

---

### React

```tsx
import "libreria-component";

export function LoginForm() {
  const handleInput = (e: Event) => {
    const detail = (e as CustomEvent<{ value: string }>).detail;
    console.log(detail.value);
  };

  return (
    <div>
      <sp-input label="Email" type="email" onSp-input={handleInput} />
      <sp-button variant="primary">Login</sp-button>
    </div>
  );
}
```

> **Tip:** React 19+ supports custom element event props natively. For React 18 and earlier, attach events with `useRef` + `addEventListener`.

---

### Vue 3

```vue
<script setup>
import "libreria-component";

const value = ref("");
</script>

<template>
  <sp-input
    label="Search"
    :value="value"
    @sp-input="value = $event.detail.value"
  />
  <sp-button variant="primary" @sp-click="search">Search</sp-button>
</template>
```

---

## Components

### Form Inputs

| Component   | Tag                | Description                                     |
| ----------- | ------------------ | ----------------------------------------------- |
| Input       | `<sp-input>`       | Text, email, password, number, search, tel, url |
| Textarea    | `<sp-textarea>`    | Multi-line text input                           |
| Checkbox    | `<sp-checkbox>`    | Single checkbox with label                      |
| Radio       | `<sp-radio>`       | Radio button                                    |
| Switch      | `<sp-switch>`      | Toggle switch (on/off)                          |
| Select      | `<sp-select>`      | Dropdown select                                 |
| Combobox    | `<sp-combobox>`    | Searchable select with keyboard navigation      |
| Slider      | `<sp-slider>`      | Range slider                                    |
| Rating      | `<sp-rating>`      | Star rating input                               |
| OTP Input   | `<sp-otp-input>`   | One-time password digit input                   |
| File Upload | `<sp-file-upload>` | File picker input                               |
| Form Field  | `<sp-form-field>`  | Label + hint + error wrapper for any input      |

### Buttons & Actions

| Component   | Tag                | Description                            |
| ----------- | ------------------ | -------------------------------------- |
| Button      | `<sp-button>`      | Primary, secondary, ghost, destructive |
| Copy Button | `<sp-copy-button>` | Copies text to clipboard               |

### Navigation

| Component  | Tag                                         | Description                   |
| ---------- | ------------------------------------------- | ----------------------------- |
| Tabs       | `<sp-tabs>` + `<sp-tab>` + `<sp-tab-panel>` | Tabbed navigation             |
| Breadcrumb | `<sp-breadcrumb>` + `<sp-breadcrumb-item>`  | Page path navigation          |
| Pagination | `<sp-pagination>`                           | Page number navigation        |
| Navbar     | `<sp-navbar>`                               | Top navigation bar            |
| Sidebar    | `<sp-sidebar>`                              | Side navigation               |
| Stepper    | `<sp-stepper>`                              | Multi-step progress indicator |

### Overlays

| Component | Tag                            | Description                                |
| --------- | ------------------------------ | ------------------------------------------ |
| Modal     | `<sp-modal>`                   | Dialog with focus trap + ESC close         |
| Drawer    | `<sp-drawer>`                  | Slide-in panel with focus trap + ESC close |
| Popover   | `<sp-popover>`                 | Anchored floating panel                    |
| Tooltip   | `<sp-tooltip>`                 | Hover/focus hint                           |
| Toast     | `<sp-toast>`                   | Temporary notification                     |
| Menu      | `<sp-menu>` + `<sp-menu-item>` | Dropdown menu with keyboard navigation     |

### Display

| Component       | Tag                    | Description                                    |
| --------------- | ---------------------- | ---------------------------------------------- |
| Card            | `<sp-card>`            | Content container                              |
| Badge           | `<sp-badge>`           | Status indicator label                         |
| Tag             | `<sp-tag>`             | Dismissible label                              |
| Alert           | `<sp-alert>`           | Inline message (info, success, warning, error) |
| Avatar          | `<sp-avatar>`          | User image or initials                         |
| Icon            | `<sp-icon>`            | SVG icon wrapper                               |
| Divider         | `<sp-divider>`         | Horizontal/vertical separator                  |
| Stat            | `<sp-stat>`            | Metric display (value + label)                 |
| Timeline        | `<sp-timeline>`        | Vertical event list                            |
| Table           | `<sp-table>`           | Data table                                     |
| Empty State     | `<sp-empty-state>`     | Zero-data placeholder                          |
| Accordion       | `<sp-accordion-item>`  | Collapsible content section                    |
| Progress Bar    | `<sp-progress-bar>`    | Linear progress indicator                      |
| Skeleton        | `<sp-skeleton>`        | Loading placeholder                            |
| Spinner         | `<sp-spinner>`         | Loading spinner                                |
| Visually Hidden | `<sp-visually-hidden>` | Screen reader only content                     |

---

## Customization

All components expose CSS custom properties for theming. Example with `sp-button`:

```css
sp-button {
  --sp-button-radius: 8px;
  --sp-button-font-size: 16px;
  --sp-button-transition: background 0.2s ease;
}
```

You can also target internal parts using `::part()`:

```css
sp-input::part(input) {
  font-family: "Inter", sans-serif;
}

sp-button::part(button) {
  letter-spacing: 0.05em;
}
```

---

## Events

All components emit prefixed custom events to avoid collisions with native DOM events.

| Event       | Detail       | Description                              |
| ----------- | ------------ | ---------------------------------------- |
| `sp-click`  | `{ source }` | Button clicked                           |
| `sp-input`  | `{ value }`  | Input value changed (on every keystroke) |
| `sp-change` | `{ value }`  | Input value committed (on blur/enter)    |
| `sp-focus`  | —            | Element received focus                   |
| `sp-blur`   | —            | Element lost focus                       |
| `sp-clear`  | —            | Clear button clicked on input            |
| `sp-open`   | —            | Overlay opened (modal, drawer, popover)  |
| `sp-close`  | —            | Overlay closed                           |

```js
document.querySelector("sp-input").addEventListener("sp-input", (e) => {
  console.log(e.detail.value); // current value
});
```

---

## Form Participation

All form input components are **form-associated custom elements** — they work with native `<form>` just like `<input>` does.

```html
<form id="my-form">
  <sp-input name="email" type="email" required></sp-input>
  <sp-textarea name="message" required></sp-textarea>
  <sp-checkbox name="agree" value="yes"></sp-checkbox>
  <sp-button type="submit">Send</sp-button>
</form>

<script>
  document.getElementById("my-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    console.log(Object.fromEntries(data)); // { email: "...", message: "...", agree: "yes" }
  });
</script>
```

---

## Contributing

```bash
# Clone and install
git clone https://github.com/wisftock/libreria-component.git
cd libreria-component
npm install

# Run Storybook (component explorer)
npm run storybook

# Run tests
npm run test

# Run tests in watch mode
npm run test:watch

# Build
npm run build
```

Before submitting a PR, ensure:

```bash
npm run type-check   # TypeScript — no errors
npm run test         # All 633 tests pass
npm run build        # Build succeeds
```

---

## License

MIT © wisftock

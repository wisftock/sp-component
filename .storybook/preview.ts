import type { Preview } from "@storybook/web-components";

// Prevent "already been used with this registry" errors when multiple story
// files import the same custom element (Chromatic loads all stories in one context).
const _originalDefine = customElements.define.bind(customElements);
customElements.define = (name, constructor, options?) => {
  if (!customElements.get(name)) {
    _originalDefine(name, constructor, options);
  }
};

const preview: Preview = {
  parameters: {
    layout: "centered",
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /date$/i,
      },
    },
  },
};

export default preview;

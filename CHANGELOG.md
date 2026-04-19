# Changelog

All notable changes to `sp-component` will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [0.1.0] — 2026-04-19

### Added
- `sp-credit-card` — production-ready: 7 card networks, interactive flip, masked mode, size variants, `sp-flip` sub-component, Luhn validation, full a11y
- 305 built-in SVG icons in `sp-icon`
- Spinner size variants (`xs`, `sm`, `md`, `lg`, `xl`)
- `sp-virtual-list` — virtualized rendering for large datasets (10,000+ rows)
- `sp-sortable-list` — drag-and-drop reorderable list with handle support and disabled items
- Layout primitives: `sp-stack`, `sp-grid`, `sp-container`
- `sp-watermark` — canvas-based repeating watermark overlay
- `sp-drawer` new props: `subtitle`, `loading`, `no-overlay`
- `sp-drawer` new behaviors: focus trap (Tab cycling), swipe-to-close gesture
- CDN bundle via `vite.config.cdn.ts` → `dist-cdn/sp-component.min.js`
- Carousel responsive layout, lightbox with close button, 10 new story designs
- 15 additional components (virtual-list, sortable-list, layout, watermark, and more)

### Changed
- `lit` moved from `dependencies` to `peerDependencies` (correct npm publishing practice)
- Combobox, autocomplete, and cascader dropdowns now align to input width
- `sp-avatar-group` restored inside the avatar component

### Removed
- `sp-menu`, `sp-menu-root`, `sp-navbar` — replaced by sidebar navigation pattern
- `sp-nav-menu` — removed
- `sp-avatar-group` standalone component (merged into `sp-avatar`)
- `sp-color-swatch` standalone component
- `./tokens.css` export (file not present in dist)

### Fixed
- Sidebar collapse button z-index overlap
- Accordion transition using `grid-template-rows` (replaced `max-height` hack)
- Dropdown alignment in combobox, autocomplete, and cascader
- Storybook crash caused by conflicting `focusin` document listeners in drawer
- TypeScript strict-mode errors in `sp-drawer` (non-null assertions on touch/focus arrays)
- 6 npm audit vulnerabilities resolved (1 moderate, 5 high) via `npm audit fix`

---

## [0.0.4] — 2025 (prior release)

### Added
- Floating UI integration for tooltip/popover positioning
- Theming system (CSS custom properties)
- i18n support infrastructure
- Form validation utilities
- Compound component patterns
- CLI package (`packages/cli`)
- Demo showcase page for all 58 components
- Chromatic visual regression testing setup

### Fixed
- Cross-project CSS compatibility hardening
- Duplicate custom element registration in Chromatic
- Missing `config.ts` for CI type-check

---

## [0.0.3] — 2025 (prior release)

### Added
- CDN bundle and build configuration
- Full README rewrite with complete component catalog

---

## [0.0.1 – 0.0.2] — Initial releases

### Added
- Initial set of Web Components built on Lit 3
- Storybook integration with `@storybook/web-components-vite`
- TypeScript, ESLint, Prettier, Vitest setup
- Components: button, input, select, table, badge, avatar, card, drawer, modal, toast, tooltip, sidebar, accordion, tabs, and more

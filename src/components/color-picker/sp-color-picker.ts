import { LitElement, unsafeCSS } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import styles from "./sp-color-picker.css?inline";
import { colorPickerTemplate } from "./sp-color-picker.template.js";
import type { SpColorPickerFormat } from "./sp-color-picker.types.js";

/**
 * Color picker component with hue/saturation/lightness canvas and preset swatches.
 *
 * @element sp-color-picker
 *
 * @prop {string}               value     - Hex color string (default #000000)
 * @prop {SpColorPickerFormat}  format    - Output format: hex | rgb | hsl
 * @prop {boolean}              disabled  - Disables the picker
 * @prop {boolean}              readonly  - Prevents changes
 * @prop {string}               name      - Form field name
 * @prop {string}               label     - Label text
 * @prop {string}               hint      - Hint text
 * @prop {string}               error     - Error message
 * @prop {boolean}              showAlpha - Show alpha channel slider (attribute: show-alpha)
 * @prop {string}               swatches  - Comma-separated preset colors
 *
 * @fires {CustomEvent<{ value: string }>} sp-change - Emitted when color is committed
 * @fires {CustomEvent<{ value: string }>} sp-input  - Emitted on every color change
 */
@customElement("sp-color-picker")
export class SpColorPickerComponent extends LitElement {
  static override styles = unsafeCSS(styles);
  static formAssociated = true;

  readonly #internals: ElementInternals;

  constructor() {
    super();
    this.#internals = this.attachInternals();
  }

  @property({ type: String, reflect: true })
  value = "#000000";

  @property({ type: String })
  format: SpColorPickerFormat = "hex";

  @property({ type: Boolean, reflect: true })
  disabled = false;

  @property({ type: Boolean, reflect: true })
  readonly = false;

  @property({ type: String })
  name = "";

  @property({ type: String })
  label = "";

  @property({ type: String })
  hint = "";

  @property({ type: String })
  error = "";

  @property({ type: Boolean, attribute: "show-alpha" })
  showAlpha = false;

  @property({ type: String })
  swatches = "";

  @state()
  _open = false;

  @state()
  _h = 0;

  @state()
  _s = 100;

  @state()
  _l = 50;

  @state()
  _a = 1;

  private _canvasDragging = false;
  private _canvasEl: HTMLElement | null = null;

  override render() {
    return colorPickerTemplate.call(this);
  }

  override connectedCallback() {
    super.connectedCallback();
    document.addEventListener("pointerdown", this._handleDocumentPointerDown);
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener("pointerdown", this._handleDocumentPointerDown);
  }

  override updated(changedProperties: Map<string, unknown>) {
    if (changedProperties.has("value")) {
      this.#internals.setFormValue(this.value);
    }
  }

  formResetCallback(): void {
    this.value = "#000000";
    this._h = 0;
    this._s = 100;
    this._l = 50;
    this._a = 1;
    this.#internals.setFormValue(this.value);
  }

  _toggle() {
    if (this.disabled || this.readonly) return;
    this._open = !this._open;
    if (this._open) {
      this._parseHex(this.value);
    }
  }

  _parseHex(hex: string) {
    const result = hexToHsl(hex);
    if (result) {
      this._h = result.h;
      this._s = result.s;
      this._l = result.l;
    }
  }

  _formatValue(): string {
    if (this.format === "rgb") {
      return hslToRgb(this._h, this._s, this._l);
    }
    if (this.format === "hsl") {
      return hslToHslString(this._h, this._s, this._l);
    }
    return hslToHex(this._h, this._s, this._l);
  }

  _emitChange() {
    const val = this._formatValue();
    this.value = val;
    this.dispatchEvent(
      new CustomEvent("sp-change", {
        detail: { value: val },
        bubbles: true,
        composed: true,
      }),
    );
    this.dispatchEvent(
      new CustomEvent("sp-input", {
        detail: { value: val },
        bubbles: true,
        composed: true,
      }),
    );
  }

  readonly _handleHueInput = (e: Event) => {
    const input = e.target as HTMLInputElement;
    this._h = Number(input.value);
    this._emitChange();
  };

  readonly _handleAlphaInput = (e: Event) => {
    const input = e.target as HTMLInputElement;
    this._a = Number(input.value) / 100;
    this._emitChange();
  };

  readonly _handleHexInput = (e: Event) => {
    const input = e.target as HTMLInputElement;
    const val = input.value.trim();
    this._parseHex(val.startsWith("#") ? val : `#${val}`);
    this._emitChange();
  };

  _selectSwatch(color: string) {
    this.value = color;
    this._parseHex(color);
    this._open = false;
    this.dispatchEvent(
      new CustomEvent("sp-change", {
        detail: { value: color },
        bubbles: true,
        composed: true,
      }),
    );
  }

  readonly _startCanvasDrag = (e: PointerEvent) => {
    if (this.disabled || this.readonly) return;
    this._canvasDragging = true;
    this._canvasEl = e.currentTarget as HTMLElement;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    this._updateFromCanvas(e);
  };

  readonly _onPointerMove = (e: PointerEvent) => {
    if (!this._canvasDragging) return;
    this._updateFromCanvas(e);
  };

  readonly _onPointerUp = (e: PointerEvent) => {
    if (!this._canvasDragging) return;
    this._canvasDragging = false;
    this._updateFromCanvas(e);
    this._emitChange();
    this._canvasEl = null;
  };

  private _updateFromCanvas(e: PointerEvent) {
    const target = (e.currentTarget as HTMLElement) ?? this._canvasEl;
    if (!target) return;
    const rect = target.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
    this._s = Math.round(x * 100);
    // y=0 → lightness 100, y=1 → lightness 0
    this._l = Math.round((1 - y) * 50);
    this._emitChange();
  }

  private readonly _handleDocumentPointerDown = (e: PointerEvent) => {
    if (!e.composedPath().includes(this) && this._open) {
      this._open = false;
    }
  };
}

// ---- Module-level color helpers ----

export function hexToHsl(hex: string): { h: number; s: number; l: number } | null {
  const clean = hex.replace(/^#/, "");
  if (clean.length !== 6) return null;
  const r = parseInt(clean.slice(0, 2), 16) / 255;
  const g = parseInt(clean.slice(2, 4), 16) / 255;
  const b = parseInt(clean.slice(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0;
  let s = 0;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

export function hslToHex(h: number, s: number, l: number): string {
  const [r, g, b] = hslToRgbValues(h, s, l);
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function hslToRgb(h: number, s: number, l: number): string {
  const [r, g, b] = hslToRgbValues(h, s, l);
  return `rgb(${r}, ${g}, ${b})`;
}

export function hslToHslString(h: number, s: number, l: number): string {
  return `hsl(${h}, ${s}%, ${l}%)`;
}

function hslToRgbValues(h: number, s: number, l: number): [number, number, number] {
  const sn = s / 100;
  const ln = l / 100;
  const a = sn * Math.min(ln, 1 - ln);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    return Math.round((ln - a * Math.max(-1, Math.min(k - 3, 9 - k, 1))) * 255);
  };
  return [f(0), f(8), f(4)];
}

function toHex(n: number): string {
  return n.toString(16).padStart(2, "0");
}

declare global {
  interface HTMLElementTagNameMap {
    "sp-color-picker": SpColorPickerComponent;
  }
}

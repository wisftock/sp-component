/**
 * Test setup — polyfills for happy-dom gaps
 */

// Form-Associated Custom Elements: happy-dom doesn't implement attachInternals.
// We store form values in a WeakMap and patch FormData to include them.

const _formValueMap = new WeakMap<HTMLElement, FormDataEntryValue | null>();

if (typeof HTMLElement.prototype.attachInternals !== "function") {
  HTMLElement.prototype.attachInternals = function (this: HTMLElement) {
    const el = this;
    const _validity: ValidityState = {
      badInput: false, customError: false, patternMismatch: false,
      rangeOverflow: false, rangeUnderflow: false, stepMismatch: false,
      tooLong: false, tooShort: false, typeMismatch: false,
      valid: true, valueMissing: false,
    };
    return {
      setFormValue(val: FormDataEntryValue | null) {
        _formValueMap.set(el, val);
      },
      setValidity(_flags: Partial<ValidityState>, _msg?: string) {},
      reportValidity() { return true; },
      checkValidity() { return true; },
      get form() { return null; },
      get validity() { return _validity; },
      get validationMessage() { return ""; },
      get willValidate() { return true; },
      get labels() { return [] as unknown as NodeList; },
    } as unknown as ElementInternals;
  };
}

// Patch FormData to collect values from form-associated custom elements
const _OriginalFormData = globalThis.FormData;
class _PatchedFormData extends _OriginalFormData {
  constructor(form?: HTMLFormElement) {
    super(form);
    if (form) {
      form.querySelectorAll("*").forEach((el) => {
        const value = _formValueMap.get(el as HTMLElement);
        const name = (el as HTMLElement & { name?: string }).name || el.getAttribute("name");
        if (name && value !== null && value !== undefined) {
          this.append(name, value as string);
        }
      });
    }
  }
}
// @ts-ignore
globalThis.FormData = _PatchedFormData;

// ─── Canvas 2D context mock (happy-dom returns null for getContext) ───────────
// Components like sp-signature, sp-watermark, sp-color-swatch use canvas.
const _mockCtx: Partial<CanvasRenderingContext2D> & Record<string, unknown> = {
  scale: () => {},
  save: () => {},
  restore: () => {},
  translate: () => {},
  rotate: () => {},
  setTransform: () => {},
  beginPath: () => {},
  closePath: () => {},
  moveTo: () => {},
  lineTo: () => {},
  arc: () => {},
  quadraticCurveTo: () => {},
  bezierCurveTo: () => {},
  stroke: () => {},
  fill: () => {},
  fillRect: () => {},
  clearRect: () => {},
  strokeRect: () => {},
  fillText: () => {},
  strokeText: () => {},
  putImageData: () => {},
  drawImage: () => {},
  clip: () => {},
  createLinearGradient: () => ({ addColorStop: () => {} } as CanvasGradient),
  createPattern: () => null,
  measureText: () => ({ width: 0 } as TextMetrics),
  getImageData: () => ({ data: new Uint8ClampedArray([128, 128, 128, 255]), width: 1, height: 1, colorSpace: "srgb" } as ImageData),
  get fillStyle() { return ""; },
  set fillStyle(_v: string | CanvasGradient | CanvasPattern) {},
  get strokeStyle() { return ""; },
  set strokeStyle(_v: string | CanvasGradient | CanvasPattern) {},
  get lineWidth() { return 1; },
  set lineWidth(_v: number) {},
  get lineCap() { return "butt" as CanvasLineCap; },
  set lineCap(_v: CanvasLineCap) {},
  get lineJoin() { return "miter" as CanvasLineJoin; },
  set lineJoin(_v: CanvasLineJoin) {},
  get font() { return "10px sans-serif"; },
  set font(_v: string) {},
  get textAlign() { return "left" as CanvasTextAlign; },
  set textAlign(_v: CanvasTextAlign) {},
  get globalAlpha() { return 1; },
  set globalAlpha(_v: number) {},
  get shadowColor() { return ""; },
  set shadowColor(_v: string) {},
  get shadowBlur() { return 0; },
  set shadowBlur(_v: number) {},
  get strokeDashArray() { return []; },
};

// @ts-ignore
HTMLCanvasElement.prototype.getContext = function (_type: string) {
  return _mockCtx as unknown as CanvasRenderingContext2D;
};

HTMLCanvasElement.prototype.toDataURL = function () {
  return "data:image/png;base64,";
};

// ─── Clipboard API mock ───────────────────────────────────────────────────────
if (!navigator.clipboard) {
  Object.defineProperty(navigator, "clipboard", {
    value: {
      writeText: (_text: string) => Promise.resolve(),
      readText: () => Promise.resolve(""),
    },
    writable: true,
    configurable: true,
  });
} else if (!navigator.clipboard.writeText) {
  Object.defineProperty(navigator.clipboard, "writeText", {
    value: (_text: string) => Promise.resolve(),
    writable: true,
    configurable: true,
  });
}

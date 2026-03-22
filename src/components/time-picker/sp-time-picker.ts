import { LitElement, unsafeCSS } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import styles from "./sp-time-picker.css?inline";
import { timePickerTemplate } from "./sp-time-picker.template.js";
import type { SpTimePickerFormat, SpTimePickerPeriod, SpTimePickerSize } from "./sp-time-picker.types.js";

/**
 * Time picker component with 12/24h format support and scrollable time columns.
 *
 * @element sp-time-picker
 *
 * @prop {string}              value       - Time in HH:MM or HH:MM:SS format
 * @prop {SpTimePickerFormat}  format      - 12 or 24 hour display (default "24")
 * @prop {number}              step        - Minute step interval (1, 5, 10, 15, 30, 60)
 * @prop {boolean}             showSeconds - Show seconds column (attribute: show-seconds)
 * @prop {string}              min         - Minimum time HH:MM
 * @prop {string}              max         - Maximum time HH:MM
 * @prop {boolean}             disabled    - Disables the picker
 * @prop {boolean}             readonly    - Makes the picker read-only
 * @prop {boolean}             required    - Marks the field as required
 * @prop {string}              name        - Form field name
 * @prop {string}              placeholder - Placeholder text
 * @prop {string}              label       - Label text
 * @prop {string}              hint        - Hint text
 * @prop {string}              error       - Error message
 * @prop {SpTimePickerSize}    size        - Size: sm | md | lg
 *
 * @fires {CustomEvent<{ value: string }>} sp-change - Emitted when time is confirmed
 * @fires {CustomEvent}                    sp-clear  - Emitted when value is cleared
 */
@customElement("sp-time-picker")
export class SpTimePickerComponent extends LitElement {
  static override styles = unsafeCSS(styles);
  static formAssociated = true;

  readonly #internals: ElementInternals;

  constructor() {
    super();
    this.#internals = this.attachInternals();
  }

  @property({ type: String })
  value = "";

  @property({ type: String })
  format: SpTimePickerFormat = "24";

  @property({ type: Number })
  step = 1;

  @property({ type: Boolean, attribute: "show-seconds" })
  showSeconds = false;

  @property({ type: String })
  min = "";

  @property({ type: String })
  max = "";

  @property({ type: Boolean, reflect: true })
  disabled = false;

  @property({ type: Boolean, reflect: true })
  readonly = false;

  @property({ type: Boolean, reflect: true })
  required = false;

  @property({ type: String })
  name = "";

  @property({ type: String })
  placeholder = "HH:MM";

  @property({ type: String })
  label = "";

  @property({ type: String })
  hint = "";

  @property({ type: String })
  error = "";

  @property({ type: String, reflect: true })
  size: SpTimePickerSize = "md";

  @state()
  _open = false;

  @state()
  _hours = 0;

  @state()
  _minutes = 0;

  @state()
  _seconds = 0;

  @state()
  _period: SpTimePickerPeriod = "AM";

  override render() {
    return timePickerTemplate.call(this);
  }

  override connectedCallback() {
    super.connectedCallback();
    document.addEventListener("pointerdown", this._handleDocumentPointerDown);
    document.addEventListener("keydown", this._handleDocumentKeydown);
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener("pointerdown", this._handleDocumentPointerDown);
    document.removeEventListener("keydown", this._handleDocumentKeydown);
  }

  override updated(changedProperties: Map<string, unknown>) {
    if (changedProperties.has("value")) {
      this.#internals.setFormValue(this.value);
      if (this.required) {
        if (!this.value) {
          this.#internals.setValidity({ valueMissing: true }, "This field is required");
        } else {
          this.#internals.setValidity({});
        }
      } else {
        this.#internals.setValidity({});
      }
    }
  }

  formResetCallback(): void {
    this.value = "";
    this._hours = 0;
    this._minutes = 0;
    this._seconds = 0;
    this._period = "AM";
    this.#internals.setFormValue("");
  }

  _toggle() {
    if (this.disabled || this.readonly) return;
    this._open = !this._open;
    if (this._open && this.value) {
      this._parseValue(this.value);
    }
  }

  _parseValue(val: string) {
    const parts = val.split(":");
    if (parts.length >= 2) {
      let h = parseInt(parts[0] ?? "0", 10);
      const m = parseInt(parts[1] ?? "0", 10);
      const s = parts[2] ? parseInt(parts[2], 10) : 0;

      if (this.format === "12") {
        this._period = h >= 12 ? "PM" : "AM";
        if (h > 12) h -= 12;
        if (h === 0) h = 12;
      }

      this._hours = isNaN(h) ? 0 : h;
      this._minutes = isNaN(m) ? 0 : m;
      this._seconds = isNaN(s) ? 0 : s;
    }
  }

  _displayHours(): number {
    if (this.format === "12") {
      return this._hours === 0 ? 12 : this._hours;
    }
    return this._hours;
  }

  _formatDisplay(): string {
    if (!this.value) return "";
    return this.value;
  }

  _formatValue(): string {
    if (this.format === "12") {
      let h = this._hours % 12;
      if (this._period === "PM") h += 12;
      const hours = String(h).padStart(2, "0");
      const mins = String(this._minutes).padStart(2, "0");
      const secs = String(this._seconds).padStart(2, "0");
      return this.showSeconds ? `${hours}:${mins}:${secs}` : `${hours}:${mins}`;
    }
    const hours = String(this._hours).padStart(2, "0");
    const mins = String(this._minutes).padStart(2, "0");
    const secs = String(this._seconds).padStart(2, "0");
    return this.showSeconds ? `${hours}:${mins}:${secs}` : `${hours}:${mins}`;
  }

  _changeHours(dir: number) {
    if (this.format === "12") {
      this._hours = ((this._hours - 1 + dir + 12) % 12) + 1;
    } else {
      this._hours = (this._hours + dir + 24) % 24;
    }
  }

  _changeMinutes(dir: number) {
    const effectiveStep = this.step > 0 ? this.step : 1;
    this._minutes = ((this._minutes + dir * effectiveStep) + 60) % 60;
  }

  _changeSeconds(dir: number) {
    this._seconds = (this._seconds + dir + 60) % 60;
  }

  _togglePeriod() {
    this._period = this._period === "AM" ? "PM" : "AM";
  }

  _setNow() {
    const now = new Date();
    this._hours = this.format === "12"
      ? (now.getHours() % 12) || 12
      : now.getHours();
    this._minutes = now.getMinutes();
    this._seconds = now.getSeconds();
    this._period = now.getHours() >= 12 ? "PM" : "AM";
  }

  _confirm() {
    const val = this._formatValue();
    if (this._isOutOfRange(val)) return;
    this.value = val;
    this._open = false;
    this.dispatchEvent(
      new CustomEvent("sp-change", {
        detail: { value: val },
        bubbles: true,
        composed: true,
      }),
    );
  }

  _clear(e: Event) {
    e.stopPropagation();
    this.value = "";
    this._open = false;
    this.dispatchEvent(new CustomEvent("sp-clear", { bubbles: true, composed: true }));
    this.dispatchEvent(
      new CustomEvent("sp-change", {
        detail: { value: "" },
        bubbles: true,
        composed: true,
      }),
    );
  }

  _selectTime(t: string) {
    if (this._isOutOfRange(t)) return;
    this.value = t;
    this._parseValue(t);
    this._open = false;
    this.dispatchEvent(
      new CustomEvent("sp-change", {
        detail: { value: t },
        bubbles: true,
        composed: true,
      }),
    );
  }

  _getTimeOptions(): string[] {
    const options: string[] = [];
    const effectiveStep = this.step > 0 ? this.step : 1;
    for (let h = 0; h < 24; h++) {
      for (let m = 0; m < 60; m += effectiveStep) {
        const time = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
        if (!this._isOutOfRange(time)) {
          options.push(time);
        }
      }
    }
    return options;
  }

  _isOutOfRange(time: string): boolean {
    if (this.min && time < this.min) return true;
    if (this.max && time > this.max) return true;
    return false;
  }

  private readonly _handleDocumentPointerDown = (e: PointerEvent) => {
    if (!e.composedPath().includes(this) && this._open) {
      this._open = false;
    }
  };

  private readonly _handleDocumentKeydown = (e: KeyboardEvent) => {
    if (e.key === "Escape" && this._open) {
      this._open = false;
    }
  };
}

declare global {
  interface HTMLElementTagNameMap {
    "sp-time-picker": SpTimePickerComponent;
  }
}

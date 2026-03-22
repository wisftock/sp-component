import { LitElement, unsafeCSS } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import styles from "./sp-calendar-date-picker.css?inline";
import { datePickerTemplate } from "./sp-calendar-date-picker.template.js";
import "./sp-calendar.js";

export type SpDatePickerFormat = "YYYY-MM-DD" | "DD/MM/YYYY" | "MM/DD/YYYY";

/**
 * Date picker component — text field + calendar popover.
 *
 * @element sp-date-picker
 *
 * @prop {string}  value           - Selected date in ISO format (YYYY-MM-DD)
 * @prop {string}  min             - Minimum selectable date (YYYY-MM-DD)
 * @prop {string}  max             - Maximum selectable date (YYYY-MM-DD)
 * @prop {string}  locale          - BCP 47 locale
 * @prop {number}  firstDayOfWeek  - 0=Sunday, 1=Monday (default: 1)
 * @prop {string}  mode            - "single" | "range" | "multiple"
 * @prop {string}  format          - Display format: "YYYY-MM-DD" | "DD/MM/YYYY" | "MM/DD/YYYY"
 * @prop {string}  placeholder     - Placeholder text
 * @prop {boolean} disabled        - Disables all interaction
 * @prop {boolean} readonly        - Readonly input
 * @prop {string}  label           - Field label
 * @prop {string}  hint            - Hint text below the field
 * @prop {string}  error           - Error text (also applies error styling)
 *
 * @fires {CustomEvent<{ value: string }>} sp-change - Emitted when a date is selected
 */
@customElement("sp-date-picker")
export class SpCalendarDatePickerComponent extends LitElement {
  static override styles = unsafeCSS(styles);

  static formAssociated = true;

  @property({ type: String, reflect: true })
  value = "";

  @property({ type: String })
  min = "";

  @property({ type: String })
  max = "";

  @property({ type: String })
  locale = "";

  @property({ type: Number, attribute: "first-day-of-week" })
  firstDayOfWeek = 1;

  @property({ type: String })
  mode = "single";

  @property({ type: String, attribute: "value-start" })
  valueStart = "";

  @property({ type: String, attribute: "value-end" })
  valueEnd = "";

  @property({ type: String })
  values = "";

  @property({ type: String })
  format: SpDatePickerFormat = "YYYY-MM-DD";

  @property({ type: String })
  placeholder = "";

  @property({ type: Boolean, reflect: true })
  disabled = false;

  @property({ type: Boolean, reflect: true })
  readonly = false;

  @property({ type: String })
  label = "";

  @property({ type: String })
  hint = "";

  @property({ type: String })
  error = "";

  @state()
  _open = false;

  @state()
  _internalValue = "";

  private _internals: ElementInternals | null = null;
  private _boundHandleKeydown: (e: KeyboardEvent) => void;

  constructor() {
    super();
    try {
      this._internals = this.attachInternals();
    } catch {
      // Fallback for environments that don't support form association
    }
    this._boundHandleKeydown = this._handleKeydown.bind(this);
  }

  override connectedCallback(): void {
    super.connectedCallback();
    if (this.value) {
      this._internalValue = this.value;
      this._updateFormValue();
    }
  }

  override updated(changedProperties: Map<string, unknown>): void {
    super.updated(changedProperties);
    if (changedProperties.has("value")) {
      this._internalValue = this.value;
      this._updateFormValue();
    }
  }

  override render() {
    return datePickerTemplate.call(this);
  }

  get _displayValue(): string {
    if (!this._internalValue) return "";
    const date = this._parseISO(this._internalValue);
    if (!date) return this._internalValue;
    return this._formatDate(date);
  }

  _parseISO(iso: string): Date | null {
    if (!iso) return null;
    const [y, m, d] = iso.split("-").map(Number);
    if (!y || !m || !d) return null;
    const date = new Date(y, m - 1, d);
    return isNaN(date.getTime()) ? null : date;
  }

  _formatDate(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");

    switch (this.format) {
      case "DD/MM/YYYY":
        return `${d}/${m}/${y}`;
      case "MM/DD/YYYY":
        return `${m}/${d}/${y}`;
      case "YYYY-MM-DD":
      default:
        return `${y}-${m}-${d}`;
    }
  }

  _updateFormValue(): void {
    this._internals?.setFormValue(this._internalValue);
  }

  _open_popover(): void {
    if (this.disabled || this.readonly) return;
    this._open = true;
    document.addEventListener("click", this._handleOutsideClick, { capture: true });
    document.addEventListener("keydown", this._boundHandleKeydown, { capture: true });
  }

  _close_popover(): void {
    this._open = false;
    document.removeEventListener("click", this._handleOutsideClick, { capture: true });
    document.removeEventListener("keydown", this._boundHandleKeydown, { capture: true });
  }

  _handleFieldClick(e: MouseEvent): void {
    e.stopPropagation();
    if (this._open) {
      this._close_popover();
    } else {
      this._open_popover();
    }
  }

  _toggleOpen(): void {
    if (this._open) {
      this._close_popover();
    } else {
      this._open_popover();
    }
  }

  _handleCalendarChange = (e: CustomEvent<any>): void => {
    const detail = e.detail;
    if (this.mode === "range") {
      this.valueStart = detail.valueStart ?? "";
      this.valueEnd = detail.valueEnd ?? "";
      this._internalValue = this.valueStart && this.valueEnd
        ? `${this._formatDate(this._parseISO(this.valueStart)!)} → ${this._formatDate(this._parseISO(this.valueEnd)!)}`
        : this._formatDate(this._parseISO(detail.valueStart ?? "") ?? new Date());
      if (this.valueStart && this.valueEnd) this._open = false;
    } else if (this.mode === "multiple") {
      this.values = (detail.values as string[]).join(",");
      this._internalValue = `${(detail.values as string[]).length} selected`;
    } else {
      this.value = detail.value ?? "";
      this._internalValue = this.value ? this._formatDate(this._parseISO(this.value)!) : "";
      this._open = false;
    }
    this._updateFormValue();
    this.dispatchEvent(new CustomEvent("sp-change", { detail, bubbles: true, composed: true }));
  };

  _handleOutsideClick = (e: MouseEvent): void => {
    const path = e.composedPath();
    if (path.length === 0) return;
    const target = path[0] as Node;
    if (!this.contains(target) && !this.shadowRoot?.contains(target)) {
      this._open = false;
    }
  };

  private _handleKeydown(e: KeyboardEvent): void {
    if (e.key === "Escape") {
      this._close_popover();
    }
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this._close_popover();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "sp-date-picker": SpCalendarDatePickerComponent;
  }
}

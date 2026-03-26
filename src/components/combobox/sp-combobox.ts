import { LitElement, unsafeCSS } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import styles from "./sp-combobox.css?inline";
import { comboboxTemplate } from "./sp-combobox.template.js";
import type { SpComboboxSize, SpComboboxOption } from "./sp-combobox.types.js";

/**
 * Searchable combobox (select with filter) component. Supports single and multiple selection.
 *
 * @element sp-combobox
 *
 * @prop {string}               value          - Selected value (single mode)
 * @prop {string[]}             values         - Selected values (multiple mode)
 * @prop {SpComboboxOption[]}   options        - Array of selectable options
 * @prop {string}               placeholder    - Input placeholder text
 * @prop {boolean}              disabled       - Disables the component
 * @prop {boolean}              required       - Marks the field as required
 * @prop {string}               name           - Native input name
 * @prop {SpComboboxSize}       size           - Size: sm | md | lg
 * @prop {boolean}              clearable      - Shows a clear button when value is set
 * @prop {boolean}              multiple       - Enables multiple selection
 * @prop {number}               maxSelections  - Maximum number of selections (0 = unlimited)
 * @prop {string}               error          - Error message
 * @prop {string}               hint           - Hint message
 * @prop {string}               label          - Label text
 * @prop {string}               noResultsText  - Text shown when no options match
 *
 * @fires {CustomEvent<{ value: string }>}    sp-change - Single: emitted when selection changes
 * @fires {CustomEvent<{ values: string[] }>} sp-change - Multiple: emitted when selection changes
 * @fires {CustomEvent}                        sp-clear  - Emitted when the value is cleared
 *
 * @csspart input - The inner text input element
 */
@customElement("sp-combobox")
export class SpComboboxComponent extends LitElement {
  static override styles = unsafeCSS(styles);
  static formAssociated = true;

  readonly #internals: ElementInternals;

  constructor() {
    super();
    this.#internals = this.attachInternals();
  }

  @property({ type: String })
  value = "";

  @property({ type: Array })
  values: string[] = [];

  @property({ type: Array })
  options: SpComboboxOption[] = [];

  @property({ type: String })
  placeholder = "Search...";

  @property({ type: Boolean, reflect: true })
  disabled = false;

  @property({ type: Boolean, reflect: true })
  required = false;

  @property({ type: String })
  name = "";

  @property({ type: String, reflect: true })
  size: SpComboboxSize = "md";

  @property({ type: Boolean })
  clearable = false;

  @property({ type: Boolean })
  multiple = false;

  @property({ type: Number, attribute: "max-selections" })
  maxSelections = 0;

  @property({ type: String })
  error = "";

  @property({ type: String })
  hint = "";

  @property({ type: String })
  label = "";

  @property({ type: String, attribute: "no-results-text" })
  noResultsText = "No results found";

  @state()
  _searchText = "";

  @state()
  _open = false;

  _focused = false;

  @state()
  _highlightedIndex: number | null = null;

  get _filteredOptions(): SpComboboxOption[] {
    const q = this._searchText.toLowerCase();
    return this.options.filter(o => o.label.toLowerCase().includes(q));
  }

  get _selectedLabel(): string {
    return this.options.find(o => o.value === this.value)?.label ?? "";
  }

  _getVisibleOptions(): SpComboboxOption[] {
    return this._filteredOptions;
  }

  private _updateFormValue(): void {
    if (this.multiple) {
      const fd = new FormData();
      this.values.forEach(v => fd.append(this.name || "values", v));
      this.#internals.setFormValue(fd);
      if (this.required && this.values.length === 0) {
        this.#internals.setValidity({ valueMissing: true }, "Please select at least one value");
      } else {
        this.#internals.setValidity({});
      }
    } else {
      this.#internals.setFormValue(this.value);
      if (this.required && !this.value) {
        this.#internals.setValidity({ valueMissing: true }, "Please select a value");
      } else {
        this.#internals.setValidity({});
      }
    }
  }

  formResetCallback(): void {
    this.value = "";
    this.values = [];
    this._updateFormValue();
  }

  override updated(changedProperties: Map<string, unknown>): void {
    super.updated(changedProperties);
    const relevant = ["value", "values", "required", "multiple"];
    if (relevant.some(k => changedProperties.has(k))) {
      this._updateFormValue();
    }
  }

  private readonly _handleOutsideClick = (e: MouseEvent) => {
    if (!this.contains(e.target as Node) && e.composedPath()[0] !== this) {
      this._open = false;
      this._searchText = "";
      this._highlightedIndex = null;
    }
  };

  override connectedCallback(): void {
    super.connectedCallback();
    document.addEventListener("mousedown", this._handleOutsideClick);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    document.removeEventListener("mousedown", this._handleOutsideClick);
  }

  readonly _handleToggleDropdown = (e: Event) => {
    e.stopPropagation();
    if (this.disabled) return;
    if (this._open) {
      this._open = false;
      this._searchText = "";
      this._highlightedIndex = null;
    } else {
      this._open = true;
      this._searchText = "";
      this.updateComplete.then(() => {
        this.renderRoot.querySelector<HTMLInputElement>(".sp-combobox-input")?.focus();
      });
    }
  };

  readonly _handleInputFocus = () => {
    this._open = true;
    this._searchText = "";
  };

  readonly _handleInputInput = (e: Event) => {
    this._searchText = (e.target as HTMLInputElement).value;
    this._open = true;
    this._highlightedIndex = null;
  };

  readonly _handleSelect = (option: SpComboboxOption) => {
    if (option.disabled) return;

    if (this.multiple) {
      const alreadySelected = this.values.includes(option.value);
      if (alreadySelected) {
        this.values = this.values.filter(v => v !== option.value);
      } else if (this.maxSelections === 0 || this.values.length < this.maxSelections) {
        this.values = [...this.values, option.value];
      }
      this._searchText = "";
      this._highlightedIndex = null;
      this._updateFormValue();
      this.updateComplete.then(() => {
        this.renderRoot.querySelector<HTMLInputElement>(".sp-combobox-input")?.focus();
      });
      this.dispatchEvent(new CustomEvent("sp-change", { detail: { values: this.values }, bubbles: true, composed: true }));
      return;
    }

    this.value = option.value;
    this._searchText = "";
    this._open = false;
    this._highlightedIndex = null;
    this._updateFormValue();
    this.dispatchEvent(new CustomEvent("sp-change", { detail: { value: this.value }, bubbles: true, composed: true }));
  };

  readonly _handleRemoveValue = (val: string, e: Event) => {
    e.stopPropagation();
    this.values = this.values.filter(v => v !== val);
    this._updateFormValue();
    this.dispatchEvent(new CustomEvent("sp-change", { detail: { values: this.values }, bubbles: true, composed: true }));
  };

  readonly _handleClear = (e: Event) => {
    e.stopPropagation();
    if (this.multiple) {
      this.values = [];
    } else {
      this.value = "";
    }
    this._searchText = "";
    this._open = false;
    this._highlightedIndex = null;
    this._updateFormValue();
    this.dispatchEvent(new CustomEvent("sp-clear", { bubbles: true, composed: true }));
  };

  readonly _handleKeydown = (e: KeyboardEvent): void => {
    // Backspace removes last tag in multiple mode
    if (e.key === "Backspace" && this.multiple && this._searchText === "" && this.values.length > 0) {
      this.values = this.values.slice(0, -1);
      this._updateFormValue();
      this.dispatchEvent(new CustomEvent("sp-change", { detail: { values: this.values }, bubbles: true, composed: true }));
      return;
    }

    if (!this._open) {
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        this._open = true;
        return;
      }
      return;
    }

    const options = this._getVisibleOptions();
    const currentIdx = this._highlightedIndex ?? -1;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      this._highlightedIndex = currentIdx < options.length - 1 ? currentIdx + 1 : 0;
      this.updateComplete.then(() => this._scrollHighlightedIntoView());
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      this._highlightedIndex = currentIdx > 0 ? currentIdx - 1 : options.length - 1;
      this.updateComplete.then(() => this._scrollHighlightedIntoView());
    } else if (e.key === "Enter" && currentIdx >= 0) {
      e.preventDefault();
      const opt = options[currentIdx];
      if (opt && !opt.disabled) {
        this._handleSelect(opt);
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      this._open = false;
      this._highlightedIndex = null;
    } else if (e.key === "Home") {
      e.preventDefault();
      this._highlightedIndex = 0;
      this.updateComplete.then(() => this._scrollHighlightedIntoView());
    } else if (e.key === "End") {
      e.preventDefault();
      this._highlightedIndex = options.length - 1;
      this.updateComplete.then(() => this._scrollHighlightedIntoView());
    }
  };

  private _scrollHighlightedIntoView(): void {
    if (this._highlightedIndex === null) return;
    const el = this.renderRoot.querySelector<HTMLElement>(`#sp-combo-opt-${this._highlightedIndex}`);
    el?.scrollIntoView({ block: "nearest" });
  }

  override render() {
    return comboboxTemplate.call(this);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "sp-combobox": SpComboboxComponent;
  }
}

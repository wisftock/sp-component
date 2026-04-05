import { LitElement, unsafeCSS } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import styles from "./sp-autocomplete.css?inline";
import { autocompleteTemplate } from "./sp-autocomplete.template.js";
import type { SpAutocompleteSize, SpAutocompleteFilterMode, SpAutocompleteOption } from "./sp-autocomplete.types.js";
import { setupFloating } from "../../utils/floating.js";

/**
 * Autocomplete component with single/multiple selection, option groups,
 * descriptions, creatable mode, and async search support.
 *
 * @element sp-autocomplete
 *
 * @prop {string}                    value         - Selected value (single mode)
 * @prop {string[]}                  values        - Selected values (multiple mode)
 * @prop {SpAutocompleteOption[]}    options       - Array of options (supports group & description)
 * @prop {string}                    placeholder   - Input placeholder
 * @prop {boolean}                   disabled      - Disables the component
 * @prop {boolean}                   required      - Marks the field as required
 * @prop {string}                    name          - Form field name
 * @prop {SpAutocompleteSize}        size          - sm | md | lg
 * @prop {boolean}                   clearable     - Shows clear button
 * @prop {boolean}                   multiple      - Enables multiple selection
 * @prop {number}                    maxSelections - Max selections (0 = unlimited)
 * @prop {SpAutocompleteFilterMode}  filterMode    - contains | startsWith | none (async)
 * @prop {boolean}                   loading       - Shows loading spinner in dropdown
 * @prop {boolean}                   creatable     - Allows creating new options
 * @prop {string}                    createText    - Template for create option label
 * @prop {number}                    debounce      - Debounce ms for sp-search event
 * @prop {string}                    error         - Error message
 * @prop {string}                    hint          - Hint message
 * @prop {string}                    label         - Label text
 * @prop {string}                    noResultsText - Text when no options match
 *
 * @fires {CustomEvent<{ value: string }>}    sp-change - Single mode selection change
 * @fires {CustomEvent<{ values: string[] }>} sp-change - Multiple mode selection change
 * @fires {CustomEvent<{ query: string }>}    sp-search - Input query changed (for async fetch)
 * @fires {CustomEvent<{ label: string }>}    sp-create - User requested to create a new option
 * @fires {CustomEvent}                        sp-clear  - Selection was cleared
 */
@customElement("sp-autocomplete")
export class SpAutocompleteComponent extends LitElement {
  static override styles = unsafeCSS(styles);
  static formAssociated = true;

  readonly #internals: ElementInternals;
  #debounceTimer: ReturnType<typeof setTimeout> | null = null;
  #cleanupFloating?: () => void;

  constructor() {
    super();
    this.#internals = this.attachInternals();
  }

  @property({ type: String })
  value = "";

  @property({ type: Array })
  values: string[] = [];

  @property({ type: Array })
  options: SpAutocompleteOption[] = [];

  @property({ type: String })
  placeholder = "Search...";

  @property({ type: Boolean, reflect: true })
  disabled = false;

  @property({ type: Boolean, reflect: true })
  required = false;

  @property({ type: String })
  name = "";

  @property({ type: String, reflect: true })
  size: SpAutocompleteSize = "md";

  @property({ type: Boolean })
  clearable = false;

  @property({ type: Boolean })
  multiple = false;

  @property({ type: Number, attribute: "max-selections" })
  maxSelections = 0;

  @property({ type: String, attribute: "filter-mode" })
  filterMode: SpAutocompleteFilterMode = "contains";

  @property({ type: Boolean })
  loading = false;

  @property({ type: Boolean })
  creatable = false;

  @property({ type: String, attribute: "create-text" })
  createText = 'Create "{query}"';

  @property({ type: Number })
  debounce = 0;

  @property({ type: String })
  error = "";

  @property({ type: String })
  hint = "";

  @property({ type: String })
  label = "";

  @property({ type: String, attribute: "no-results-text" })
  noResultsText = "No results found";

  @state()
  _query = "";

  @state()
  _open = false;

  @state()
  _highlightedIndex: number | null = null;

  // ---- Computed ----

  get _filteredOptions(): SpAutocompleteOption[] {
    if (this.filterMode === "none") return this.options;
    const q = this._query.toLowerCase();
    if (!q) return this.options;
    return this.options.filter(o => {
      const label = o.label.toLowerCase();
      return this.filterMode === "startsWith" ? label.startsWith(q) : label.includes(q);
    });
  }

  /** Flat navigable options (used for keyboard index) */
  get _flatOptions(): SpAutocompleteOption[] {
    return this._filteredOptions;
  }

  /** Options grouped for rendering */
  get _renderGroups(): Array<{ label: string | null; options: Array<{ option: SpAutocompleteOption; flatIndex: number }> }> {
    const flat = this._filteredOptions;
    const hasGroups = flat.some(o => o.group);
    if (!hasGroups) {
      return [{ label: null, options: flat.map((o, i) => ({ option: o, flatIndex: i })) }];
    }
    const map = new Map<string, Array<{ option: SpAutocompleteOption; flatIndex: number }>>();
    flat.forEach((o, i) => {
      const g = o.group ?? "";
      if (!map.has(g)) map.set(g, []);
      map.get(g)!.push({ option: o, flatIndex: i });
    });
    return Array.from(map.entries()).map(([label, options]) => ({
      label: label || null,
      options,
    }));
  }

  get _selectedLabel(): string {
    return this.options.find(o => o.value === this.value)?.label ?? this.value;
  }

  /** True if the "create" option should be shown */
  get _showCreate(): boolean {
    if (!this.creatable || !this._query.trim()) return false;
    return !this._filteredOptions.some(o => o.label.toLowerCase() === this._query.toLowerCase());
  }

  get _createLabel(): string {
    return this.createText.replace("{query}", this._query);
  }

  // ---- Form internals ----

  private _updateFormValue(): void {
    if (this.multiple) {
      const fd = new FormData();
      this.values.forEach(v => fd.append(this.name || "values", v));
      this.#internals.setFormValue(fd);
      if (this.required && this.values.length === 0) {
        this.#internals.setValidity({ valueMissing: true }, "Please select at least one option");
      } else {
        this.#internals.setValidity({});
      }
    } else {
      this.#internals.setFormValue(this.value);
      if (this.required && !this.value) {
        this.#internals.setValidity({ valueMissing: true }, "Please select an option");
      } else {
        this.#internals.setValidity({});
      }
    }
  }

  formResetCallback(): void {
    this.value = "";
    this.values = [];
    this._query = "";
    this._updateFormValue();
  }

  override updated(changedProperties: Map<string, unknown>): void {
    super.updated(changedProperties);
    if (["value", "values", "required", "multiple"].some(k => changedProperties.has(k))) {
      this._updateFormValue();
    }
  }

  // ---- Outside click ----

  private readonly _handleOutsideClick = (e: MouseEvent) => {
    if (!this.contains(e.target as Node) && e.composedPath()[0] !== this) {
      this._close();
    }
  };

  private _close(): void {
    this._open = false;
    this._highlightedIndex = null;
    if (!this.multiple) this._query = "";
  }

  override connectedCallback(): void {
    super.connectedCallback();
    document.addEventListener("mousedown", this._handleOutsideClick);
    void this.updateComplete.then(() => this.#initFloating());
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.#cleanupFloating?.();
    document.removeEventListener("mousedown", this._handleOutsideClick);
    if (this.#debounceTimer) clearTimeout(this.#debounceTimer);
  }

  #initFloating() {
    this.#cleanupFloating?.();
    const reference = this.shadowRoot?.querySelector<HTMLElement>(".sp-ac-container");
    const floating = this.shadowRoot?.querySelector<HTMLElement>(".sp-ac-dropdown");
    if (!reference || !floating) return;
    this.#cleanupFloating = setupFloating({
      reference,
      floating,
      placement: "bottom-start",
      distance: 4,
      matchWidth: true,
    });
  }

  // ---- Event handlers ----

  readonly _handleToggleDropdown = (e: Event) => {
    e.stopPropagation();
    if (this.disabled) return;
    if (this._open) {
      this._close();
    } else {
      this._open = true;
      this.updateComplete.then(() => {
        this.renderRoot.querySelector<HTMLInputElement>(".sp-ac-input")?.focus();
      });
    }
  };

  readonly _handleInputFocus = () => {
    this._open = true;
  };

  readonly _handleInputInput = (e: Event) => {
    this._query = (e.target as HTMLInputElement).value;
    this._open = true;
    this._highlightedIndex = null;

    if (this.debounce > 0) {
      if (this.#debounceTimer) clearTimeout(this.#debounceTimer);
      this.#debounceTimer = setTimeout(() => {
        this.dispatchEvent(new CustomEvent("sp-search", { detail: { query: this._query }, bubbles: true, composed: true }));
      }, this.debounce);
    } else {
      this.dispatchEvent(new CustomEvent("sp-search", { detail: { query: this._query }, bubbles: true, composed: true }));
    }
  };

  readonly _handleSelect = (option: SpAutocompleteOption) => {
    if (option.disabled) return;

    if (this.multiple) {
      const selected = this.values.includes(option.value);
      if (selected) {
        this.values = this.values.filter(v => v !== option.value);
      } else if (this.maxSelections === 0 || this.values.length < this.maxSelections) {
        this.values = [...this.values, option.value];
      }
      this._query = "";
      this._highlightedIndex = null;
      this._updateFormValue();
      this.updateComplete.then(() => {
        this.renderRoot.querySelector<HTMLInputElement>(".sp-ac-input")?.focus();
      });
      this.dispatchEvent(new CustomEvent("sp-change", { detail: { values: this.values }, bubbles: true, composed: true }));
      return;
    }

    this.value = option.value;
    this._query = "";
    this._open = false;
    this._highlightedIndex = null;
    this._updateFormValue();
    this.dispatchEvent(new CustomEvent("sp-change", { detail: { value: this.value }, bubbles: true, composed: true }));
  };

  readonly _handleCreate = () => {
    const label = this._query.trim();
    if (!label) return;
    this._query = "";
    this._open = false;
    this._highlightedIndex = null;
    this.dispatchEvent(new CustomEvent("sp-create", { detail: { label }, bubbles: true, composed: true }));
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
    this._query = "";
    this._open = false;
    this._highlightedIndex = null;
    this._updateFormValue();
    this.dispatchEvent(new CustomEvent("sp-clear", { bubbles: true, composed: true }));
  };

  readonly _handleKeydown = (e: KeyboardEvent): void => {
    // Backspace removes last tag in multiple mode
    if (e.key === "Backspace" && this.multiple && this._query === "" && this.values.length > 0) {
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

    // Total navigable items = flat options + optional create item
    const flat = this._flatOptions;
    const totalItems = flat.length + (this._showCreate ? 1 : 0);
    const currentIdx = this._highlightedIndex ?? -1;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      this._highlightedIndex = currentIdx < totalItems - 1 ? currentIdx + 1 : 0;
      this.updateComplete.then(() => this._scrollHighlightedIntoView());
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      this._highlightedIndex = currentIdx > 0 ? currentIdx - 1 : totalItems - 1;
      this.updateComplete.then(() => this._scrollHighlightedIntoView());
    } else if (e.key === "Enter" && currentIdx >= 0) {
      e.preventDefault();
      if (this._showCreate && currentIdx === flat.length) {
        this._handleCreate();
      } else {
        const opt = flat[currentIdx];
        if (opt && !opt.disabled) this._handleSelect(opt);
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      this._close();
    } else if (e.key === "Home") {
      e.preventDefault();
      this._highlightedIndex = 0;
      this.updateComplete.then(() => this._scrollHighlightedIntoView());
    } else if (e.key === "End") {
      e.preventDefault();
      this._highlightedIndex = totalItems - 1;
      this.updateComplete.then(() => this._scrollHighlightedIntoView());
    }
  };

  private _scrollHighlightedIntoView(): void {
    if (this._highlightedIndex === null) return;
    const el = this.renderRoot.querySelector<HTMLElement>(`#sp-ac-opt-${this._highlightedIndex}`);
    el?.scrollIntoView({ block: "nearest" });
  }

  override render() {
    return autocompleteTemplate.call(this);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "sp-autocomplete": SpAutocompleteComponent;
  }
}

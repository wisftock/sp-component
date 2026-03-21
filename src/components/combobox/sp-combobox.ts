import { LitElement, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import styles from "./sp-combobox.css?inline";
import { comboboxTemplate } from "./sp-combobox.template.js";
import type { SpComboboxSize, SpComboboxOption } from "./sp-combobox.types.js";

/**
 * Searchable combobox (select with filter) component.
 *
 * @element sp-combobox
 *
 * @prop {string}               value          - Currently selected value
 * @prop {SpComboboxOption[]}   options        - Array of selectable options
 * @prop {string}               placeholder    - Input placeholder text
 * @prop {boolean}              disabled       - Disables the component
 * @prop {boolean}              required       - Marks the field as required
 * @prop {string}               name           - Native input name
 * @prop {SpComboboxSize}       size           - Size: sm | md | lg
 * @prop {boolean}              clearable      - Shows a clear button when value is set
 * @prop {string}               error          - Error message
 * @prop {string}               hint           - Hint message
 * @prop {string}               label          - Label text
 * @prop {string}               noResultsText  - Text shown when no options match
 *
 * @fires {CustomEvent<{ value: string }>} sp-change - Emitted when selection changes
 * @fires {CustomEvent}                    sp-clear  - Emitted when the value is cleared
 *
 * @csspart input - The inner text input element
 */
@customElement("sp-combobox")
export class SpComboboxComponent extends LitElement {
  static override styles = unsafeCSS(styles);

  @property({ type: String })
  value = "";

  @property({ type: Array })
  options: SpComboboxOption[] = [];

  @property({ type: String })
  placeholder = "Search...";

  @property({ type: Boolean, reflect: true })
  disabled = false;

  @property({ type: Boolean })
  required = false;

  @property({ type: String })
  name = "";

  @property({ type: String, reflect: true })
  size: SpComboboxSize = "md";

  @property({ type: Boolean })
  clearable = false;

  @property({ type: String })
  error = "";

  @property({ type: String })
  hint = "";

  @property({ type: String })
  label = "";

  @property({ type: String, attribute: "no-results-text" })
  noResultsText = "No results found";

  _searchText = "";
  _open = false;
  _focused = false;

  get _filteredOptions(): SpComboboxOption[] {
    const q = this._searchText.toLowerCase();
    return this.options.filter(o => o.label.toLowerCase().includes(q));
  }

  get _selectedLabel(): string {
    return this.options.find(o => o.value === this.value)?.label ?? "";
  }

  private readonly _handleOutsideClick = (e: MouseEvent) => {
    if (!this.contains(e.target as Node) && e.composedPath()[0] !== this) {
      this._open = false;
      this._searchText = "";
      this.requestUpdate();
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

  readonly _handleInputFocus = () => {
    this._open = true;
    this._searchText = "";
    this.requestUpdate();
  };

  readonly _handleInputInput = (e: Event) => {
    this._searchText = (e.target as HTMLInputElement).value;
    this._open = true;
    this.requestUpdate();
  };

  readonly _handleSelect = (option: SpComboboxOption) => {
    if (option.disabled) return;
    this.value = option.value;
    this._searchText = "";
    this._open = false;
    this.requestUpdate();
    this.dispatchEvent(new CustomEvent("sp-change", { detail: { value: this.value }, bubbles: true, composed: true }));
  };

  readonly _handleClear = (e: Event) => {
    e.stopPropagation();
    this.value = "";
    this._searchText = "";
    this._open = false;
    this.requestUpdate();
    this.dispatchEvent(new CustomEvent("sp-clear", { bubbles: true, composed: true }));
  };

  override render() {
    return comboboxTemplate.call(this);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "sp-combobox": SpComboboxComponent;
  }
}

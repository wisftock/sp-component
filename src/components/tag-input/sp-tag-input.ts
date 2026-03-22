import { LitElement, unsafeCSS } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import styles from "./sp-tag-input.css?inline";
import { tagInputTemplate } from "./sp-tag-input.template.js";
import type { SpTagInputSize } from "./sp-tag-input.types.js";

/**
 * Tag input component — a form-associated input that manages a list of tags.
 *
 * @element sp-tag-input
 *
 * @prop {string}          values           - Comma-separated current tags
 * @prop {string}          placeholder      - Placeholder for the inner input
 * @prop {boolean}         disabled         - Disables the component
 * @prop {boolean}         readonly         - Makes the component read-only
 * @prop {boolean}         required         - Marks as required
 * @prop {string}          name             - Form field name
 * @prop {number}          max              - Max number of tags (0 = unlimited)
 * @prop {boolean}         allowDuplicates  - Allow duplicate tags
 * @prop {string}          delimiter        - Character(s) that trigger tag creation
 * @prop {string}          label            - Label text
 * @prop {string}          hint             - Hint text
 * @prop {string}          error            - Error message
 * @prop {SpTagInputSize}  size             - Size: sm | md | lg
 *
 * @fires {CustomEvent<{ values: string[] }>} sp-change - Emitted when tags change
 * @fires {CustomEvent<{ value: string }>}    sp-add    - Emitted when a tag is added
 * @fires {CustomEvent<{ value: string }>}    sp-remove - Emitted when a tag is removed
 */
@customElement("sp-tag-input")
export class SpTagInputComponent extends LitElement {
  static override styles = unsafeCSS(styles);
  static formAssociated = true;

  readonly #internals: ElementInternals;

  constructor() {
    super();
    this.#internals = this.attachInternals();
  }

  @property({ type: String })
  values = "";

  @property({ type: String })
  placeholder = "Add tag...";

  @property({ type: Boolean, reflect: true })
  disabled = false;

  @property({ type: Boolean, reflect: true })
  readonly = false;

  @property({ type: Boolean, reflect: true })
  required = false;

  @property({ type: String })
  name = "";

  @property({ type: Number })
  max = 0;

  @property({ type: Boolean, attribute: "allow-duplicates" })
  allowDuplicates = false;

  @property({ type: String })
  delimiter = ",";

  @property({ type: String })
  label = "";

  @property({ type: String })
  hint = "";

  @property({ type: String })
  error = "";

  @property({ type: String, reflect: true })
  size: SpTagInputSize = "md";

  @state()
  _tags: string[] = [];

  @state()
  _inputValue = "";

  @state()
  _focused = false;

  private _prevValues = "";

  override render() {
    return tagInputTemplate.call(this);
  }

  override willUpdate(changedProperties: Map<string, unknown>) {
    if (changedProperties.has("values") && this.values !== this._prevValues) {
      this._prevValues = this.values;
      this._tags = this.values
        ? this.values
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        : [];
      this.#internals.setFormValue(this.values);
    }
  }

  readonly _focusInput = () => {
    const input = this.shadowRoot?.querySelector<HTMLInputElement>(".sp-tag-input-input");
    input?.focus();
  };

  readonly _handleTextInput = (e: Event) => {
    const input = e.target as HTMLInputElement;
    const val = input.value;

    if (this.delimiter && val.includes(this.delimiter)) {
      const parts = val.split(this.delimiter);
      for (let i = 0; i < parts.length - 1; i++) {
        const tag = parts[i]!.trim();
        if (tag) this._addTag(tag);
      }
      this._inputValue = parts[parts.length - 1]!.trim();
    } else {
      this._inputValue = val;
    }
  };

  readonly _handleKeydown = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const tag = this._inputValue.trim();
      if (tag) {
        this._addTag(tag);
        this._inputValue = "";
      }
      return;
    }
    if (e.key === "Backspace" && this._inputValue === "") {
      if (this._tags.length > 0) {
        const lastTag = this._tags[this._tags.length - 1]!;
        this._removeTag(lastTag);
      }
    }
  };

  readonly _handleBlur = () => {
    const tag = this._inputValue.trim();
    if (tag) {
      this._addTag(tag);
      this._inputValue = "";
    }
    this._focused = false;
  };

  _addTag(tag: string) {
    if (this.disabled || this.readonly) return;
    if (this.max > 0 && this._tags.length >= this.max) return;
    if (!this.allowDuplicates && this._tags.includes(tag)) return;

    this._tags = [...this._tags, tag];
    this._syncValues();

    this.dispatchEvent(
      new CustomEvent("sp-add", {
        detail: { value: tag },
        bubbles: true,
        composed: true,
      }),
    );
  }

  _removeTag(tag: string) {
    if (this.disabled || this.readonly) return;
    const idx = this._tags.indexOf(tag);
    if (idx === -1) return;

    this._tags = [...this._tags.slice(0, idx), ...this._tags.slice(idx + 1)];
    this._syncValues();

    this.dispatchEvent(
      new CustomEvent("sp-remove", {
        detail: { value: tag },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private _syncValues() {
    this.values = this._tags.join(",");
    this._prevValues = this.values;
    this.#internals.setFormValue(this.values);

    this.dispatchEvent(
      new CustomEvent("sp-change", {
        detail: { values: [...this._tags] },
        bubbles: true,
        composed: true,
      }),
    );
  }

  formResetCallback(): void {
    this._tags = [];
    this.values = "";
    this._prevValues = "";
    this._inputValue = "";
    this.#internals.setFormValue("");
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "sp-tag-input": SpTagInputComponent;
  }
}

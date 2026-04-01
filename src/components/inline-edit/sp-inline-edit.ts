import { LitElement, unsafeCSS } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import styles from "./sp-inline-edit.css?inline";
import { inlineEditTemplate } from "./sp-inline-edit.template.js";
import type { SpInlineEditType } from "./sp-inline-edit.types.js";

/**
 * Inline edit component — displays text that becomes editable on click.
 *
 * @element sp-inline-edit
 *
 * @prop {string}           value       - The current text value
 * @prop {string}           placeholder - Placeholder text for the input
 * @prop {SpInlineEditType} type        - Input type: text | number | email | url
 * @prop {boolean}          disabled    - Disables editing
 * @prop {boolean}          readonly    - Shows value without edit capability
 * @prop {boolean}          required    - Marks the field as required
 * @prop {string}           name        - Form field name
 * @prop {number}           maxlength   - Maximum character length (0 = no limit)
 * @prop {boolean}          editing     - Controls editing state programmatically
 * @prop {string}           emptyText   - Text to display when value is empty (default "Click to edit")
 *
 * @fires {CustomEvent<{ value: string }>} sp-change - Emitted when value is confirmed
 * @fires {CustomEvent}                    sp-edit-start - Emitted when editing begins
 * @fires {CustomEvent}                    sp-edit-cancel - Emitted when editing is cancelled
 */
@customElement("sp-inline-edit")
export class SpInlineEditComponent extends LitElement {
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
  placeholder = "";

  @property({ type: String, reflect: true })
  type: SpInlineEditType = "text";

  @property({ type: Boolean, reflect: true })
  disabled = false;

  @property({ type: Boolean, reflect: true })
  readonly = false;

  @property({ type: Boolean, reflect: true })
  required = false;

  @property({ type: String })
  name = "";

  @property({ type: Number })
  maxlength = 0;

  @property({ type: Boolean, reflect: true })
  editing = false;

  @property({ type: String, attribute: "empty-text" })
  emptyText = "Click to edit";

  @state()
  _draft = "";

  override render() {
    return inlineEditTemplate.call(this);
  }

  override updated(changed: Map<string, unknown>) {
    if (changed.has("value")) {
      this.#internals.setFormValue(this.value);
    }
    if (changed.has("editing") && this.editing) {
      this._draft = this.value;
      this.updateComplete.then(() => {
        this.shadowRoot?.querySelector<HTMLInputElement>(".sp-inline-edit-input")?.focus();
      });
    }
    if (changed.has("value") || changed.has("required")) {
      if (this.required && !this.value) {
        this.#internals.setValidity({ valueMissing: true }, "This field is required");
      } else {
        this.#internals.setValidity({});
      }
    }
  }

  formResetCallback(): void {
    this.value = "";
    this.editing = false;
    this.#internals.setFormValue("");
  }

  readonly _handleActivate = (): void => {
    if (this.disabled || this.readonly) return;
    this.editing = true;
    this.dispatchEvent(
      new CustomEvent("sp-edit-start", { bubbles: true, composed: true }),
    );
  };

  readonly _handleInput = (e: Event): void => {
    this._draft = (e.target as HTMLInputElement).value;
  };

  readonly _handleConfirm = (): void => {
    const prev = this.value;
    this.value = this._draft;
    this.editing = false;
    if (this.value !== prev) {
      this.dispatchEvent(
        new CustomEvent("sp-change", {
          detail: { value: this.value },
          bubbles: true,
          composed: true,
        }),
      );
    }
  };

  readonly _handleCancel = (): void => {
    this._draft = this.value;
    this.editing = false;
    this.dispatchEvent(
      new CustomEvent("sp-edit-cancel", { bubbles: true, composed: true }),
    );
  };

  readonly _handleKeydown = (e: KeyboardEvent): void => {
    if (e.key === "Enter") {
      e.preventDefault();
      this._handleConfirm();
    } else if (e.key === "Escape") {
      e.preventDefault();
      this._handleCancel();
    }
  };

  readonly _handleDisplayKeydown = (e: KeyboardEvent): void => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      this._handleActivate();
    }
  };
}

declare global {
  interface HTMLElementTagNameMap {
    "sp-inline-edit": SpInlineEditComponent;
  }
}

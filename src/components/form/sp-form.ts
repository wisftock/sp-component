import { LitElement, html, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import styles from "./sp-form.css?inline";

/**
 * Form wrapper that integrates with form-associated sp-* components.
 *
 * Renders a native <form> whose validity includes all sp-* form controls
 * placed inside it. Prevents submission when invalid and emits sp-submit
 * with the serialized FormData on success.
 *
 * @element sp-form
 *
 * @prop {boolean} novalidate - Skip validation on submit
 *
 * @fires {CustomEvent<{ formData: FormData }>} sp-submit  - Fired when form is valid and submitted
 * @fires {CustomEvent}                          sp-invalid - Fired when form is submitted but invalid
 * @fires {CustomEvent}                          sp-reset   - Fired when form is reset
 *
 * @slot - Form content (sp-input, sp-select, sp-checkbox, etc.)
 */
@customElement("sp-form")
export class SpFormComponent extends LitElement {
  static override styles = unsafeCSS(styles);

  @property({ type: Boolean })
  novalidate = false;

  #form: HTMLFormElement | null = null;

  override render() {
    return html`
      <form novalidate @submit=${this.#handleSubmit} @reset=${this.#handleReset}>
        <slot></slot>
      </form>
    `;
  }

  override firstUpdated() {
    this.#form = this.shadowRoot?.querySelector("form") ?? null;
  }

  readonly #handleSubmit = (e: SubmitEvent) => {
    e.preventDefault();
    if (!this.novalidate && !this.#form!.reportValidity()) {
      this.dispatchEvent(
        new CustomEvent("sp-invalid", { bubbles: true, composed: true }),
      );
      return;
    }
    const formData = new FormData(this.#form!);
    this.dispatchEvent(
      new CustomEvent("sp-submit", {
        detail: { formData },
        bubbles: true,
        composed: true,
      }),
    );
  };

  readonly #handleReset = () => {
    this.dispatchEvent(
      new CustomEvent("sp-reset", { bubbles: true, composed: true }),
    );
  };

  /** Programmatically submit the form (triggers validation). */
  submit(): void {
    this.#form?.requestSubmit();
  }

  /** Programmatically reset the form. */
  reset(): void {
    this.#form?.reset();
  }

  /** Returns true if all form controls are valid. */
  checkValidity(): boolean {
    return this.#form?.checkValidity() ?? true;
  }

  /** Shows validation UI and returns true if all controls are valid. */
  reportValidity(): boolean {
    return this.#form?.reportValidity() ?? true;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "sp-form": SpFormComponent;
  }
}

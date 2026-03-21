import { LitElement, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import styles from "./sp-form-field.css?inline";
import { formFieldTemplate } from "./sp-form-field.template.js";

/**
 * Form field wrapper that provides consistent label + error + hint layout.
 *
 * @element sp-form-field
 *
 * @prop {string}   label    - Label text displayed above the control
 * @prop {string}   error    - Error message displayed below the control
 * @prop {string}   hint     - Hint text displayed below the control (hidden when error is set)
 * @prop {boolean}  required - Shows a required asterisk next to the label
 * @prop {boolean}  disabled - Dims the entire field
 * @prop {string}   labelFor - The id of the form control to associate the label with
 *
 * @slot - The form control(s) to wrap
 */
@customElement("sp-form-field")
export class SpFormFieldComponent extends LitElement {
  static override styles = unsafeCSS(styles);

  @property({ type: String })
  label = "";

  @property({ type: String })
  error = "";

  @property({ type: String })
  hint = "";

  @property({ type: Boolean, reflect: true })
  required = false;

  @property({ type: Boolean, reflect: true })
  disabled = false;

  @property({ type: String, attribute: "label-for" })
  labelFor = "";

  override render() {
    return formFieldTemplate.call(this);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "sp-form-field": SpFormFieldComponent;
  }
}

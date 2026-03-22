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

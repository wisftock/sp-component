import { describe, it, expect, beforeEach, vi } from "vitest";
import "./sp-combobox.js";
import type { SpComboboxComponent } from "./sp-combobox.js";
import type { SpComboboxOption } from "./sp-combobox.types.js";

const TEST_OPTIONS: SpComboboxOption[] = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "cherry", label: "Cherry" },
  { value: "grape", label: "Grape", disabled: true },
];

function createElement(): SpComboboxComponent {
  const el = document.createElement("sp-combobox") as SpComboboxComponent;
  el.options = TEST_OPTIONS;
  document.body.appendChild(el);
  return el;
}

describe("sp-combobox", () => {
  let el: SpComboboxComponent;

  beforeEach(() => {
    document.body.innerHTML = "";
    el = createElement();
  });

  it("renders the combobox input", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-combobox-input")).not.toBeNull();
  });

  it("reflects disabled attribute when set", async () => {
    el.disabled = true;
    await el.updateComplete;
    expect(el.hasAttribute("disabled")).toBe(true);
  });

  it("reflects size attribute", async () => {
    el.size = "lg";
    await el.updateComplete;
    expect(el.getAttribute("size")).toBe("lg");
  });

  it("shows dropdown when input receives focus", async () => {
    await el.updateComplete;
    const input = el.shadowRoot?.querySelector<HTMLInputElement>(".sp-combobox-input")!;
    input.dispatchEvent(new FocusEvent("focus"));
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-combobox-dropdown")).not.toBeNull();
  });

  it("filters options by search text", async () => {
    await el.updateComplete;
    el._searchText = "an";
    el._open = true;
    el.requestUpdate();
    await el.updateComplete;
    const filtered = el._filteredOptions;
    expect(filtered.map(o => o.value)).toContain("banana");
    expect(filtered.map(o => o.value)).not.toContain("apple");
    expect(filtered.map(o => o.value)).not.toContain("cherry");
  });

  it("selects option on mousedown and closes dropdown", async () => {
    await el.updateComplete;
    el._open = true;
    el.requestUpdate();
    await el.updateComplete;
    const options = el.shadowRoot?.querySelectorAll<HTMLElement>(".sp-combobox-option");
    options![0].dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
    expect(el.value).toBe("apple");
    expect(el._open).toBe(false);
  });

  it("emits sp-change with value when option is selected", async () => {
    await el.updateComplete;
    const listener = vi.fn();
    el.addEventListener("sp-change", listener);
    el._handleSelect(TEST_OPTIONS[1]);
    expect(listener).toHaveBeenCalledOnce();
    expect((listener.mock.calls[0][0] as CustomEvent).detail).toEqual({ value: "banana" });
  });

  it("shows the clear button when clearable and value is set", async () => {
    el.clearable = true;
    el.value = "apple";
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-combobox-clear")).not.toBeNull();
  });

  it("clears value and emits sp-clear when clear button is clicked", async () => {
    el.clearable = true;
    el.value = "apple";
    await el.updateComplete;
    const clearListener = vi.fn();
    el.addEventListener("sp-clear", clearListener);
    const clearBtn = el.shadowRoot?.querySelector<HTMLButtonElement>(".sp-combobox-clear")!;
    clearBtn.click();
    expect(el.value).toBe("");
    expect(clearListener).toHaveBeenCalledOnce();
  });

  it("shows no-results message when no options match search", async () => {
    await el.updateComplete;
    el._searchText = "zzz";
    el._open = true;
    el.requestUpdate();
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-combobox-no-results")).not.toBeNull();
  });

  it("shows label when label prop is set", async () => {
    el.label = "Fruit";
    await el.updateComplete;
    const labelEl = el.shadowRoot?.querySelector(".sp-combobox-label");
    expect(labelEl?.textContent?.trim()).toContain("Fruit");
  });

  it("shows required asterisk when required is set", async () => {
    el.label = "Fruit";
    el.required = true;
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-required")).not.toBeNull();
  });

  it("shows error message", async () => {
    el.error = "Selection required";
    await el.updateComplete;
    const errorEl = el.shadowRoot?.querySelector(".sp-combobox-error");
    expect(errorEl?.textContent?.trim()).toBe("Selection required");
  });

  it("shows hint message", async () => {
    el.hint = "Type to search";
    await el.updateComplete;
    const hintEl = el.shadowRoot?.querySelector(".sp-combobox-hint");
    expect(hintEl?.textContent?.trim()).toBe("Type to search");
  });

  it("does not show hint when error is also set", async () => {
    el.error = "Error";
    el.hint = "Hint";
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-combobox-hint")).toBeNull();
    expect(el.shadowRoot?.querySelector(".sp-combobox-error")).not.toBeNull();
  });

  it("disabled option is not selected when clicked", async () => {
    await el.updateComplete;
    const listener = vi.fn();
    el.addEventListener("sp-change", listener);
    el._handleSelect(TEST_OPTIONS[3]); // grape is disabled
    expect(listener).not.toHaveBeenCalled();
    expect(el.value).toBe("");
  });

  it("_selectedLabel returns label for current value", async () => {
    el.value = "cherry";
    await el.updateComplete;
    expect(el._selectedLabel).toBe("Cherry");
  });
});

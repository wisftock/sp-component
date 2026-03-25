import { describe, it, expect, beforeEach, vi } from "vitest";
import "./sp-autocomplete.js";
import type { SpAutocompleteComponent } from "./sp-autocomplete.js";
import type { SpAutocompleteOption } from "./sp-autocomplete.types.js";

const BASE_OPTIONS: SpAutocompleteOption[] = [
  { value: "apple", label: "Apple", description: "A red fruit" },
  { value: "banana", label: "Banana" },
  { value: "cherry", label: "Cherry", group: "Berries" },
  { value: "grape", label: "Grape", group: "Berries", disabled: true },
  { value: "mango", label: "Mango", group: "Tropical" },
];

function createElement(props: Partial<SpAutocompleteOption[]> = []): SpAutocompleteComponent {
  const el = document.createElement("sp-autocomplete") as SpAutocompleteComponent;
  el.options = BASE_OPTIONS;
  document.body.appendChild(el);
  return el;
}

describe("sp-autocomplete — single mode", () => {
  let el: SpAutocompleteComponent;

  beforeEach(() => {
    document.body.innerHTML = "";
    el = createElement();
  });

  it("renders the input", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-ac-input")).not.toBeNull();
  });

  it("reflects disabled attribute", async () => {
    el.disabled = true;
    await el.updateComplete;
    expect(el.hasAttribute("disabled")).toBe(true);
  });

  it("reflects size attribute", async () => {
    el.size = "lg";
    await el.updateComplete;
    expect(el.getAttribute("size")).toBe("lg");
  });

  it("opens dropdown on focus", async () => {
    await el.updateComplete;
    el._handleInputFocus();
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-ac-dropdown")).not.toBeNull();
  });

  it("filters options with contains mode (default)", async () => {
    el._query = "an";
    el._open = true;
    el.requestUpdate();
    await el.updateComplete;
    const flat = el._flatOptions;
    expect(flat.map(o => o.value)).toContain("banana");
    expect(flat.map(o => o.value)).toContain("mango");
    expect(flat.map(o => o.value)).not.toContain("cherry");
  });

  it("filters with startsWith mode", async () => {
    el.filterMode = "startsWith";
    el._query = "ba";
    el._open = true;
    el.requestUpdate();
    await el.updateComplete;
    const flat = el._flatOptions;
    expect(flat.map(o => o.value)).toContain("banana");
    expect(flat.map(o => o.value)).not.toContain("apple");
  });

  it("no client-side filtering with filterMode=none", async () => {
    el.filterMode = "none";
    el._query = "xyz";
    await el.updateComplete;
    expect(el._flatOptions.length).toBe(BASE_OPTIONS.length);
  });

  it("selects option and closes dropdown", async () => {
    el._open = true;
    el._handleSelect(BASE_OPTIONS[0]);
    expect(el.value).toBe("apple");
    expect(el._open).toBe(false);
  });

  it("emits sp-change with value", async () => {
    const listener = vi.fn();
    el.addEventListener("sp-change", listener);
    el._handleSelect(BASE_OPTIONS[1]);
    expect(listener).toHaveBeenCalledOnce();
    expect((listener.mock.calls[0][0] as CustomEvent).detail).toEqual({ value: "banana" });
  });

  it("does not select disabled option", async () => {
    const listener = vi.fn();
    el.addEventListener("sp-change", listener);
    el._handleSelect(BASE_OPTIONS[3]); // grape is disabled
    expect(listener).not.toHaveBeenCalled();
    expect(el.value).toBe("");
  });

  it("shows option description", async () => {
    el._open = true;
    el.requestUpdate();
    await el.updateComplete;
    const desc = el.shadowRoot?.querySelector(".sp-ac-option-desc");
    expect(desc?.textContent?.trim()).toBe("A red fruit");
  });

  it("shows group labels", async () => {
    el._open = true;
    el.requestUpdate();
    await el.updateComplete;
    const groups = el.shadowRoot?.querySelectorAll(".sp-ac-group-label");
    expect(groups?.length).toBeGreaterThan(0);
  });

  it("shows loading spinner when loading=true", async () => {
    el.loading = true;
    el._open = true;
    el.requestUpdate();
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-ac-loading")).not.toBeNull();
  });

  it("hides options when loading", async () => {
    el.loading = true;
    el._open = true;
    el.requestUpdate();
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-ac-option")).toBeNull();
  });

  it("shows no-results when query matches nothing", async () => {
    el._query = "zzzz";
    el._open = true;
    el.requestUpdate();
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-ac-no-results")).not.toBeNull();
  });

  it("shows create option when creatable and no exact match", async () => {
    el.creatable = true;
    el._query = "NewFruit";
    el._open = true;
    el.requestUpdate();
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-ac-option--create")).not.toBeNull();
  });

  it("does not show create when query exactly matches a label", async () => {
    el.creatable = true;
    el._query = "Apple";
    el._open = true;
    el.requestUpdate();
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-ac-option--create")).toBeNull();
  });

  it("emits sp-create when create option is clicked", async () => {
    el.creatable = true;
    el._query = "Pineapple";
    const listener = vi.fn();
    el.addEventListener("sp-create", listener);
    el._handleCreate();
    expect(listener).toHaveBeenCalledOnce();
    expect((listener.mock.calls[0][0] as CustomEvent).detail).toEqual({ label: "Pineapple" });
  });

  it("emits sp-search on input", async () => {
    await el.updateComplete;
    const listener = vi.fn();
    el.addEventListener("sp-search", listener);
    el._handleInputInput({ target: { value: "app" } } as unknown as Event);
    await el.updateComplete;
    expect(listener).toHaveBeenCalledOnce();
    expect((listener.mock.calls[0][0] as CustomEvent).detail.query).toBe("app");
  });

  it("clears value and emits sp-clear", async () => {
    el.clearable = true;
    el.value = "apple";
    await el.updateComplete;
    const listener = vi.fn();
    el.addEventListener("sp-clear", listener);
    el._handleClear(new MouseEvent("click"));
    expect(el.value).toBe("");
    expect(listener).toHaveBeenCalledOnce();
  });

  it("shows label and required asterisk", async () => {
    el.label = "Fruit";
    el.required = true;
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-ac-label")?.textContent?.trim()).toContain("Fruit");
    expect(el.shadowRoot?.querySelector(".sp-ac-required")).not.toBeNull();
  });

  it("shows error message", async () => {
    el.error = "Required field";
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-ac-error")?.textContent?.trim()).toBe("Required field");
  });

  it("shows hint message", async () => {
    el.hint = "Start typing";
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-ac-hint")?.textContent?.trim()).toBe("Start typing");
  });

  it("closes on ESC key", async () => {
    el._open = true;
    await el.updateComplete;
    el._handleKeydown(new KeyboardEvent("keydown", { key: "Escape" }));
    await el.updateComplete;
    expect(el._open).toBe(false);
  });

  it("participates in form", async () => {
    const form = document.createElement("form");
    document.body.appendChild(form);
    const ac = document.createElement("sp-autocomplete") as SpAutocompleteComponent;
    ac.setAttribute("name", "fruit");
    ac.options = BASE_OPTIONS;
    form.appendChild(ac);
    await ac.updateComplete;
    ac.value = "mango";
    await ac.updateComplete;
    const data = new FormData(form);
    expect(data.get("fruit")).toBe("mango");
  });
});

describe("sp-autocomplete — multiple mode", () => {
  let el: SpAutocompleteComponent;

  beforeEach(() => {
    document.body.innerHTML = "";
    el = document.createElement("sp-autocomplete") as SpAutocompleteComponent;
    el.options = BASE_OPTIONS;
    el.multiple = true;
    document.body.appendChild(el);
  });

  it("renders multi-wrap", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-ac-multi-wrap")).not.toBeNull();
  });

  it("adds values and keeps dropdown open", async () => {
    el._open = true;
    el._handleSelect(BASE_OPTIONS[0]);
    el._handleSelect(BASE_OPTIONS[1]);
    expect(el.values).toEqual(["apple", "banana"]);
    expect(el._open).toBe(true);
  });

  it("toggles off selected value", async () => {
    el._handleSelect(BASE_OPTIONS[0]);
    el._handleSelect(BASE_OPTIONS[0]);
    expect(el.values).toEqual([]);
  });

  it("emits sp-change with values array", async () => {
    const listener = vi.fn();
    el.addEventListener("sp-change", listener);
    el._handleSelect(BASE_OPTIONS[0]);
    expect((listener.mock.calls[0][0] as CustomEvent).detail).toEqual({ values: ["apple"] });
  });

  it("respects maxSelections", async () => {
    el.maxSelections = 2;
    el._handleSelect(BASE_OPTIONS[0]);
    el._handleSelect(BASE_OPTIONS[1]);
    el._handleSelect(BASE_OPTIONS[2]); // rejected
    expect(el.values).toEqual(["apple", "banana"]);
  });

  it("shows tags for selected values", async () => {
    el.values = ["apple", "banana"];
    await el.updateComplete;
    const tags = el.shadowRoot?.querySelectorAll(".sp-ac-tag");
    expect(tags?.length).toBe(2);
  });

  it("removes value when tag × is mousedown'd", async () => {
    el.values = ["apple", "banana"];
    await el.updateComplete;
    const e = new MouseEvent("mousedown", { bubbles: true });
    el._handleRemoveValue("apple", e);
    await el.updateComplete;
    expect(el.values).not.toContain("apple");
    expect(el.values).toContain("banana");
  });

  it("removes last tag on Backspace when query is empty", async () => {
    el.values = ["apple", "banana"];
    el._query = "";
    el._handleKeydown(new KeyboardEvent("keydown", { key: "Backspace" }));
    await el.updateComplete;
    expect(el.values).toEqual(["apple"]);
  });

  it("clears all values", async () => {
    el.clearable = true;
    el.values = ["apple", "banana"];
    await el.updateComplete;
    el._handleClear(new MouseEvent("click"));
    await el.updateComplete;
    expect(el.values).toEqual([]);
  });
});

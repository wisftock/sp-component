import { describe, it, expect, beforeEach, vi } from "vitest";
import "../checkbox/sp-checkbox.js";
import "./sp-checkbox-group.js";
import type { SpCheckboxGroupComponent } from "./sp-checkbox-group.js";
import type { SpCheckboxComponent } from "../checkbox/sp-checkbox.js";

function createGroup(): SpCheckboxGroupComponent {
  const el = document.createElement("sp-checkbox-group") as SpCheckboxGroupComponent;
  document.body.appendChild(el);
  return el;
}

function addCheckbox(group: SpCheckboxGroupComponent, value: string, label: string): SpCheckboxComponent {
  const cb = document.createElement("sp-checkbox") as SpCheckboxComponent;
  cb.value = value;
  cb.label = label;
  group.appendChild(cb);
  return cb;
}

describe("sp-checkbox-group", () => {
  let group: SpCheckboxGroupComponent;

  beforeEach(() => {
    document.body.innerHTML = "";
    group = createGroup();
  });

  // ---- Rendering ----

  it("renders a fieldset in shadow DOM", async () => {
    await group.updateComplete;
    expect(group.shadowRoot?.querySelector("fieldset")).not.toBeNull();
  });

  it("renders slot in shadow DOM", async () => {
    await group.updateComplete;
    expect(group.shadowRoot?.querySelector("slot")).not.toBeNull();
  });

  // ---- Default props ----

  it("is not disabled by default", async () => {
    await group.updateComplete;
    expect(group.disabled).toBe(false);
    expect(group.hasAttribute("disabled")).toBe(false);
  });

  it("reflects default orientation as vertical", async () => {
    await group.updateComplete;
    expect(group.getAttribute("orientation")).toBe("vertical");
  });

  it("has empty values by default", async () => {
    await group.updateComplete;
    expect(group.values).toBe("");
  });

  // ---- Reflection ----

  it("reflects disabled attribute when set", async () => {
    group.disabled = true;
    await group.updateComplete;
    expect(group.hasAttribute("disabled")).toBe(true);
  });

  it("reflects orientation attribute when changed to horizontal", async () => {
    group.orientation = "horizontal";
    await group.updateComplete;
    expect(group.getAttribute("orientation")).toBe("horizontal");
  });

  // ---- Label / legend ----

  it("shows legend when label is set", async () => {
    group.label = "Select interests";
    await group.updateComplete;
    const legend = group.shadowRoot?.querySelector("legend");
    expect(legend?.textContent?.trim()).toBe("Select interests");
  });

  it("does not show legend when label is empty", async () => {
    await group.updateComplete;
    expect(group.shadowRoot?.querySelector("legend")).toBeNull();
  });

  // ---- Error / hint ----

  it("shows error message when error prop is set", async () => {
    group.error = "Select at least one";
    await group.updateComplete;
    const err = group.shadowRoot?.querySelector(".sp-checkbox-group-error");
    expect(err?.textContent?.trim()).toBe("Select at least one");
  });

  it("shows hint when hint prop is set and no error", async () => {
    group.hint = "You can select multiple";
    await group.updateComplete;
    const hint = group.shadowRoot?.querySelector(".sp-checkbox-group-hint");
    expect(hint?.textContent?.trim()).toBe("You can select multiple");
  });

  it("does not show hint when error is also set", async () => {
    group.error = "Error!";
    group.hint = "Some hint";
    await group.updateComplete;
    expect(group.shadowRoot?.querySelector(".sp-checkbox-group-hint")).toBeNull();
  });

  // ---- Syncing ----

  it("syncs checked state from values prop", async () => {
    const cb1 = addCheckbox(group, "a", "A");
    const cb2 = addCheckbox(group, "b", "B");
    group.values = "b";
    await group.updateComplete;
    await cb1.updateComplete;
    await cb2.updateComplete;
    expect(cb2.checked).toBe(true);
    expect(cb1.checked).toBe(false);
  });

  it("syncs name to child checkboxes", async () => {
    const cb1 = addCheckbox(group, "a", "A");
    group.name = "interests";
    await group.updateComplete;
    await cb1.updateComplete;
    expect(cb1.name).toBe("interests");
  });

  it("disables all child checkboxes when group is disabled", async () => {
    const cb1 = addCheckbox(group, "a", "A");
    const cb2 = addCheckbox(group, "b", "B");
    group.disabled = true;
    await group.updateComplete;
    await cb1.updateComplete;
    await cb2.updateComplete;
    expect(cb1.disabled).toBe(true);
    expect(cb2.disabled).toBe(true);
  });

  // ---- sp-change event ----

  it("emits sp-change with updated values array when checkbox changes", async () => {
    const cb1 = addCheckbox(group, "tech", "Tech");
    await group.updateComplete;
    await cb1.updateComplete;

    const listener = vi.fn();
    group.addEventListener("sp-change", listener);

    cb1.dispatchEvent(
      new CustomEvent("sp-change", {
        detail: { checked: true, indeterminate: false },
        bubbles: true,
        composed: true,
      }),
    );

    expect(listener).toHaveBeenCalledOnce();
    const event = listener.mock.calls[0]![0] as CustomEvent<{ values: string[] }>;
    expect(event.detail.values).toContain("tech");
  });

  it("updates values when a child checkbox emits sp-change checked=true", async () => {
    const cb1 = addCheckbox(group, "design", "Design");
    await group.updateComplete;
    await cb1.updateComplete;

    cb1.dispatchEvent(
      new CustomEvent("sp-change", {
        detail: { checked: true, indeterminate: false },
        bubbles: true,
        composed: true,
      }),
    );

    expect(group.values).toContain("design");
  });

  it("removes value when checkbox emits sp-change checked=false", async () => {
    group.values = "a,b";
    const cb1 = addCheckbox(group, "a", "A");
    await group.updateComplete;
    await cb1.updateComplete;

    cb1.dispatchEvent(
      new CustomEvent("sp-change", {
        detail: { checked: false, indeterminate: false },
        bubbles: true,
        composed: true,
      }),
    );

    const vals = group.values.split(",").filter((v) => v.length > 0);
    expect(vals).not.toContain("a");
  });

  // ---- max prop ----

  it("max prop prevents checking beyond limit", async () => {
    group.max = 1;
    group.values = "a";
    const cb1 = addCheckbox(group, "a", "A");
    const cb2 = addCheckbox(group, "b", "B");
    await group.updateComplete;
    await cb1.updateComplete;
    await cb2.updateComplete;

    // Try to add cb2 when max=1 already hit
    cb2.dispatchEvent(
      new CustomEvent("sp-change", {
        detail: { checked: true, indeterminate: false },
        bubbles: true,
        composed: true,
      }),
    );

    const vals = group.values.split(",").filter((v) => v.length > 0);
    expect(vals.length).toBeLessThanOrEqual(1);
  });

  // ---- Form participation ----

  it("participates in form — checked values in FormData", async () => {
    const form = document.createElement("form");
    document.body.appendChild(form);
    const g = document.createElement("sp-checkbox-group") as SpCheckboxGroupComponent;
    g.setAttribute("name", "interests");
    g.values = "technology";
    form.appendChild(g);
    await g.updateComplete;
    const data = new FormData(form);
    expect(data.get("interests")).toBe("technology");
  });

  it("formResetCallback resets values to empty string", async () => {
    group.values = "a,b";
    await group.updateComplete;
    group.formResetCallback();
    expect(group.values).toBe("");
  });

  // ---- Orientation ----

  it("orientation horizontal reflects correctly", async () => {
    group.orientation = "horizontal";
    await group.updateComplete;
    expect(group.getAttribute("orientation")).toBe("horizontal");
  });

  it("orientation vertical reflects correctly", async () => {
    group.orientation = "vertical";
    await group.updateComplete;
    expect(group.getAttribute("orientation")).toBe("vertical");
  });
});

import { describe, it, expect, beforeEach, vi } from "vitest";
import "./sp-radio.js";
import "./sp-radio-group.js";
import type { SpRadioGroupComponent } from "./sp-radio-group.js";
import type { SpRadioComponent } from "./sp-radio.js";

function createGroup(): SpRadioGroupComponent {
  const el = document.createElement("sp-radio-group") as SpRadioGroupComponent;
  document.body.appendChild(el);
  return el;
}

function addRadio(group: SpRadioGroupComponent, value: string, label: string): SpRadioComponent {
  const radio = document.createElement("sp-radio") as SpRadioComponent;
  radio.value = value;
  radio.label = label;
  group.appendChild(radio);
  return radio;
}

describe("sp-radio-group", () => {
  let group: SpRadioGroupComponent;

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
    group.label = "Choose an option";
    await group.updateComplete;
    const legend = group.shadowRoot?.querySelector("legend");
    expect(legend?.textContent).toBe("Choose an option");
  });

  it("does not show legend when label is empty", async () => {
    await group.updateComplete;
    expect(group.shadowRoot?.querySelector("legend")).toBeNull();
  });

  // ---- Error / hint ----

  it("shows error message when error prop is set", async () => {
    group.error = "Please select one";
    await group.updateComplete;
    const err = group.shadowRoot?.querySelector(".sp-radio-group-error");
    expect(err?.textContent).toBe("Please select one");
  });

  it("shows hint when hint prop is set and no error", async () => {
    group.hint = "Pick the best option";
    await group.updateComplete;
    const hint = group.shadowRoot?.querySelector(".sp-radio-group-hint");
    expect(hint?.textContent).toBe("Pick the best option");
  });

  it("does not show hint when error is also set", async () => {
    group.error = "Error!";
    group.hint = "Some hint";
    await group.updateComplete;
    expect(group.shadowRoot?.querySelector(".sp-radio-group-hint")).toBeNull();
  });

  // ---- Syncing ----

  it("syncs checked state to child radios based on value", async () => {
    const r1 = addRadio(group, "a", "A");
    const r2 = addRadio(group, "b", "B");
    group.value = "b";
    await group.updateComplete;
    await r1.updateComplete;
    await r2.updateComplete;
    expect(r2.checked).toBe(true);
    expect(r1.checked).toBe(false);
  });

  it("syncs name to child radios", async () => {
    const r1 = addRadio(group, "a", "A");
    group.name = "my-group";
    await group.updateComplete;
    await r1.updateComplete;
    expect(r1.name).toBe("my-group");
  });

  it("disables all child radios when group is disabled", async () => {
    const r1 = addRadio(group, "a", "A");
    const r2 = addRadio(group, "b", "B");
    group.disabled = true;
    await group.updateComplete;
    await r1.updateComplete;
    await r2.updateComplete;
    expect(r1.disabled).toBe(true);
    expect(r2.disabled).toBe(true);
  });

  // ---- sp-change event ----

  it("emits sp-change when a child radio emits sp-change", async () => {
    const r1 = addRadio(group, "option-x", "X");
    await group.updateComplete;
    await r1.updateComplete;

    const listener = vi.fn();
    group.addEventListener("sp-change", listener);

    r1.dispatchEvent(
      new CustomEvent("sp-change", {
        detail: { value: "option-x" },
        bubbles: true,
        composed: true,
      }),
    );

    expect(listener).toHaveBeenCalledOnce();
    const event = listener.mock.calls[0]![0] as CustomEvent<{ value: string }>;
    expect(event.detail.value).toBe("option-x");
  });

  it("updates value when a child radio emits sp-change", async () => {
    const r1 = addRadio(group, "option-y", "Y");
    await group.updateComplete;
    await r1.updateComplete;

    r1.dispatchEvent(
      new CustomEvent("sp-change", {
        detail: { value: "option-y" },
        bubbles: true,
        composed: true,
      }),
    );

    expect(group.value).toBe("option-y");
  });
});

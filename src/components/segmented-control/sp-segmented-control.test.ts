import { describe, it, expect, beforeEach } from "vitest";
import "./sp-segmented-control.js";
import type { SpSegmentedControlComponent } from "./sp-segmented-control.js";

function createElement(): SpSegmentedControlComponent {
  const el = document.createElement("sp-segmented-control") as SpSegmentedControlComponent;
  document.body.appendChild(el);
  return el;
}

describe("sp-segmented-control", () => {
  let el: SpSegmentedControlComponent;
  beforeEach(() => { document.body.innerHTML = ""; el = createElement(); });

  it("renders segmented group in shadow DOM", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-segmented")).not.toBeNull();
  });

  it("renders buttons for each option", async () => {
    el.options = [
      { value: "a", label: "Option A" },
      { value: "b", label: "Option B" },
      { value: "c", label: "Option C" },
    ];
    await el.updateComplete;
    const btns = el.shadowRoot?.querySelectorAll(".sp-segmented-option");
    expect(btns?.length).toBe(3);
  });

  it("marks selected option as pressed", async () => {
    el.options = [{ value: "a", label: "A" }, { value: "b", label: "B" }];
    el.value = "a";
    await el.updateComplete;
    const btn = el.shadowRoot?.querySelector<HTMLButtonElement>(".sp-segmented-option--selected");
    expect(btn?.getAttribute("aria-pressed")).toBe("true");
  });

  it("fires sp-change on option click", async () => {
    el.options = [{ value: "a", label: "A" }, { value: "b", label: "B" }];
    await el.updateComplete;
    const received: CustomEvent[] = [];
    el.addEventListener("sp-change", (e) => received.push(e as CustomEvent));
    const btns = el.shadowRoot?.querySelectorAll<HTMLButtonElement>(".sp-segmented-option");
    btns?.[0]?.click();
    expect(received.length).toBe(1);
    expect(received[0].detail.value).toBe("a");
  });

  it("updates value on click", async () => {
    el.options = [{ value: "x", label: "X" }, { value: "y", label: "Y" }];
    await el.updateComplete;
    const btns = el.shadowRoot?.querySelectorAll<HTMLButtonElement>(".sp-segmented-option");
    btns?.[1]?.click();
    expect(el.value).toBe("y");
  });

  it("defaults to md size", async () => {
    await el.updateComplete;
    expect(el.size).toBe("md");
  });

  it("disabled options cannot be clicked", async () => {
    el.options = [{ value: "a", label: "A", disabled: true }];
    await el.updateComplete;
    const btn = el.shadowRoot?.querySelector<HTMLButtonElement>(".sp-segmented-option");
    expect(btn?.disabled).toBe(true);
  });

  it("shows icon when option has icon", async () => {
    el.options = [{ value: "a", label: "A", icon: "★" }];
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-segmented-icon")).not.toBeNull();
  });

  it("does not fire sp-change if same value clicked", async () => {
    el.options = [{ value: "a", label: "A" }];
    el.value = "a";
    await el.updateComplete;
    const received: CustomEvent[] = [];
    el.addEventListener("sp-change", (e) => received.push(e as CustomEvent));
    const btn = el.shadowRoot?.querySelector<HTMLButtonElement>(".sp-segmented-option");
    btn?.click();
    expect(received.length).toBe(0);
  });
});

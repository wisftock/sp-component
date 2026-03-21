import { describe, it, expect, beforeEach } from "vitest";
import "./sp-form-field.js";
import type { SpFormFieldComponent } from "./sp-form-field.js";

function createElement(): SpFormFieldComponent {
  const el = document.createElement("sp-form-field") as SpFormFieldComponent;
  document.body.appendChild(el);
  return el;
}

describe("sp-form-field", () => {
  let el: SpFormFieldComponent;

  beforeEach(() => {
    document.body.innerHTML = "";
    el = createElement();
  });

  // ---- Rendering ----

  it("renders a slot in shadow DOM", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector("slot")).not.toBeNull();
  });

  it("renders the form field container", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-form-field")).not.toBeNull();
  });

  // ---- Default props ----

  it("is not required by default", async () => {
    await el.updateComplete;
    expect(el.required).toBe(false);
    expect(el.hasAttribute("required")).toBe(false);
  });

  it("is not disabled by default", async () => {
    await el.updateComplete;
    expect(el.disabled).toBe(false);
    expect(el.hasAttribute("disabled")).toBe(false);
  });

  // ---- Label ----

  it("shows label when label prop is set", async () => {
    el.label = "Email address";
    await el.updateComplete;
    const label = el.shadowRoot?.querySelector(".sp-form-field-label");
    expect(label).not.toBeNull();
    expect(label?.textContent?.trim()).toContain("Email address");
  });

  it("does not show label when label prop is empty", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-form-field-label")).toBeNull();
  });

  // ---- Required asterisk ----

  it("shows required asterisk when required is true and label is set", async () => {
    el.label = "Name";
    el.required = true;
    await el.updateComplete;
    const required = el.shadowRoot?.querySelector(".sp-required");
    expect(required).not.toBeNull();
  });

  it("does not show required asterisk when required is false", async () => {
    el.label = "Name";
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-required")).toBeNull();
  });

  // ---- Error ----

  it("shows error message when error prop is set", async () => {
    el.error = "This field is required";
    await el.updateComplete;
    const err = el.shadowRoot?.querySelector(".sp-form-field-error");
    expect(err?.textContent).toBe("This field is required");
  });

  it("sets role=alert on error element", async () => {
    el.error = "Something went wrong";
    await el.updateComplete;
    const err = el.shadowRoot?.querySelector(".sp-form-field-error");
    expect(err?.getAttribute("role")).toBe("alert");
  });

  it("does not show error element when error is empty", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-form-field-error")).toBeNull();
  });

  // ---- Hint ----

  it("shows hint when hint prop is set and no error", async () => {
    el.hint = "Enter your full name";
    await el.updateComplete;
    const hint = el.shadowRoot?.querySelector(".sp-form-field-hint");
    expect(hint?.textContent).toBe("Enter your full name");
  });

  it("does not show hint when error is also set", async () => {
    el.error = "Error!";
    el.hint = "Some hint";
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-form-field-hint")).toBeNull();
  });

  // ---- Disabled state ----

  it("adds sp-form-field--disabled class when disabled", async () => {
    el.disabled = true;
    await el.updateComplete;
    const field = el.shadowRoot?.querySelector(".sp-form-field");
    expect(field?.classList.contains("sp-form-field--disabled")).toBe(true);
  });

  it("reflects disabled attribute when set", async () => {
    el.disabled = true;
    await el.updateComplete;
    expect(el.hasAttribute("disabled")).toBe(true);
  });

  // ---- labelFor ----

  it("sets for attribute on label when labelFor is provided", async () => {
    el.label = "Username";
    el.labelFor = "username-input";
    await el.updateComplete;
    const label = el.shadowRoot?.querySelector(".sp-form-field-label");
    expect(label?.getAttribute("for")).toBe("username-input");
  });

  it("does not set for attribute when labelFor is empty", async () => {
    el.label = "Username";
    await el.updateComplete;
    const label = el.shadowRoot?.querySelector(".sp-form-field-label");
    expect(label?.getAttribute("for")).toBeNull();
  });

  // ---- Slot content ----

  it("projects slotted content", async () => {
    el.innerHTML = "<input id='test-input' />";
    await el.updateComplete;
    expect(el.querySelector("#test-input")).not.toBeNull();
  });
});

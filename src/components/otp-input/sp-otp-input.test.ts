import { describe, it, expect, beforeEach, vi } from "vitest";
import "./sp-otp-input.js";
import type { SpOtpInputComponent } from "./sp-otp-input.js";

function createElement(attrs: Record<string, unknown> = {}): SpOtpInputComponent {
  const el = document.createElement("sp-otp-input") as SpOtpInputComponent;
  for (const [key, val] of Object.entries(attrs)) {
    if (typeof val === "boolean") {
      if (val) el.setAttribute(key, "");
    } else {
      (el as unknown as Record<string, unknown>)[key] = val;
    }
  }
  document.body.appendChild(el);
  return el;
}

describe("sp-otp-input", () => {
  let el: SpOtpInputComponent;

  beforeEach(() => {
    document.body.innerHTML = "";
    el = createElement();
  });

  it("default length is 6", async () => {
    await el.updateComplete;
    expect(el.length).toBe(6);
  });

  it("renders correct number of inputs based on length", async () => {
    el.length = 4;
    await el.updateComplete;
    const inputs = el.shadowRoot?.querySelectorAll(".sp-otp-cell");
    expect(inputs?.length).toBe(4);
  });

  it("renders 6 inputs by default", async () => {
    await el.updateComplete;
    const inputs = el.shadowRoot?.querySelectorAll(".sp-otp-cell");
    expect(inputs?.length).toBe(6);
  });

  it("reflects disabled attribute", async () => {
    el.disabled = true;
    await el.updateComplete;
    expect(el.hasAttribute("disabled")).toBe(true);
  });

  it("reflects invalid attribute", async () => {
    el.invalid = true;
    await el.updateComplete;
    expect(el.hasAttribute("invalid")).toBe(true);
  });

  it("reflects size attribute", async () => {
    el.size = "lg";
    await el.updateComplete;
    expect(el.getAttribute("size")).toBe("lg");
  });

  it("sets placeholder on each input", async () => {
    el.placeholder = "*";
    await el.updateComplete;
    const inputs = el.shadowRoot?.querySelectorAll<HTMLInputElement>(".sp-otp-cell");
    inputs?.forEach((input) => {
      expect(input.getAttribute("placeholder")).toBe("*");
    });
  });

  it("does not emit sp-change when disabled", async () => {
    el.disabled = true;
    await el.updateComplete;

    const listener = vi.fn();
    el.addEventListener("sp-change", listener);

    const inputs = el.shadowRoot?.querySelectorAll<HTMLInputElement>(".sp-otp-cell");
    const firstInput = inputs?.[0];
    if (firstInput) {
      firstInput.value = "5";
      firstInput.dispatchEvent(new Event("input", { bubbles: true }));
    }
    await el.updateComplete;

    expect(listener).not.toHaveBeenCalled();
  });

  it("emits sp-change when a digit is entered", async () => {
    await el.updateComplete;

    const listener = vi.fn();
    el.addEventListener("sp-change", listener);

    const inputs = el.shadowRoot?.querySelectorAll<HTMLInputElement>(".sp-otp-cell");
    const firstInput = inputs?.[0];
    if (firstInput) {
      firstInput.value = "3";
      firstInput.dispatchEvent(new Event("input", { bubbles: true }));
    }
    await el.updateComplete;

    expect(listener).toHaveBeenCalledOnce();
    const detail = (listener.mock.calls[0][0] as CustomEvent<{ value: string }>).detail;
    expect(detail.value).toContain("3");
  });

  it("emits sp-complete when all inputs are filled", async () => {
    el.length = 3;
    await el.updateComplete;

    const completeListener = vi.fn();
    el.addEventListener("sp-complete", completeListener);

    const inputs = el.shadowRoot?.querySelectorAll<HTMLInputElement>(".sp-otp-cell");

    // Fill all 3 cells
    const values = ["1", "2", "3"];
    inputs?.forEach((input, i) => {
      input.value = values[i];
      input.dispatchEvent(new Event("input", { bubbles: true }));
    });
    await el.updateComplete;

    expect(completeListener).toHaveBeenCalled();
    const detail = (completeListener.mock.calls[0][0] as CustomEvent<{ value: string }>).detail;
    expect(detail.value).toBe("123");
  });

  it("participates in form — value in FormData", async () => {
    const form = document.createElement("form");
    document.body.appendChild(form);
    const otp = document.createElement("sp-otp-input") as SpOtpInputComponent;
    otp.setAttribute("name", "code");
    otp.length = 4;
    form.appendChild(otp);
    await otp.updateComplete;
    otp.value = "1234";
    await otp.updateComplete;
    const data = new FormData(form);
    expect(data.get("code")).toBe("1234");
  });
});

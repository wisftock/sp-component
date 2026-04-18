import { describe, it, expect, beforeEach, vi } from "vitest";
import "./sp-rating.js";
import type { SpRatingComponent } from "./sp-rating.js";

function createElement(): SpRatingComponent {
  const el = document.createElement("sp-rating") as SpRatingComponent;
  document.body.appendChild(el);
  return el;
}

describe("sp-rating", () => {
  let el: SpRatingComponent;

  beforeEach(() => {
    document.body.innerHTML = "";
    el = createElement();
  });

  it("renders correct number of stars (default max=5)", async () => {
    await el.updateComplete;
    const stars = el.shadowRoot?.querySelectorAll(".sp-rating-star");
    expect(stars?.length).toBe(5);
  });

  it("renders correct number of stars with custom max", async () => {
    el.max = 10;
    await el.updateComplete;
    const stars = el.shadowRoot?.querySelectorAll(".sp-rating-star");
    expect(stars?.length).toBe(10);
  });

  it("has default value of 0", async () => {
    await el.updateComplete;
    expect(el.value).toBe(0);
  });

  it("reflects value: active stars match value", async () => {
    el.value = 3;
    await el.updateComplete;
    const activeStars = el.shadowRoot?.querySelectorAll(".sp-rating-star--active");
    expect(activeStars?.length).toBe(3);
  });

  it("reflects disabled attribute when set", async () => {
    el.disabled = true;
    await el.updateComplete;
    expect(el.hasAttribute("disabled")).toBe(true);
  });

  it("reflects readonly attribute when set", async () => {
    el.readonly = true;
    await el.updateComplete;
    expect(el.hasAttribute("readonly")).toBe(true);
  });

  it("reflects size attribute", async () => {
    el.size = "lg";
    await el.updateComplete;
    expect(el.getAttribute("size")).toBe("lg");
  });

  it("emits sp-change with value when star is clicked", async () => {
    await el.updateComplete;
    const listener = vi.fn();
    el.addEventListener("sp-change", listener);
    const stars = el.shadowRoot?.querySelectorAll<HTMLButtonElement>(".sp-rating-star");
    stars![2]!.click();
    expect(listener).toHaveBeenCalledOnce();
    expect((listener.mock.calls[0]![0] as CustomEvent).detail).toEqual({ value: 3 });
  });

  it("updates value when star is clicked", async () => {
    await el.updateComplete;
    const stars = el.shadowRoot?.querySelectorAll<HTMLButtonElement>(".sp-rating-star");
    stars![1]!.click();
    expect(el.value).toBe(2);
  });

  it("hover updates active stars display", async () => {
    el.value = 2;
    await el.updateComplete;
    el._handleHover(4);
    await el.updateComplete;
    const activeStars = el.shadowRoot?.querySelectorAll(".sp-rating-star--active");
    expect(activeStars?.length).toBe(4);
  });

  it("leave resets hover and shows original value", async () => {
    el.value = 2;
    await el.updateComplete;
    el._handleHover(4);
    await el.updateComplete;
    el._handleLeave();
    await el.updateComplete;
    const activeStars = el.shadowRoot?.querySelectorAll(".sp-rating-star--active");
    expect(activeStars?.length).toBe(2);
  });

  it("disabled prevents sp-change from firing on click", async () => {
    el.disabled = true;
    await el.updateComplete;
    const listener = vi.fn();
    el.addEventListener("sp-change", listener);
    const stars = el.shadowRoot?.querySelectorAll<HTMLButtonElement>(".sp-rating-star");
    stars![2]!.click();
    expect(listener).not.toHaveBeenCalled();
  });

  it("readonly prevents sp-change from firing on click", async () => {
    el.readonly = true;
    await el.updateComplete;
    const listener = vi.fn();
    el.addEventListener("sp-change", listener);
    el._handleClick(3);
    expect(listener).not.toHaveBeenCalled();
  });
});

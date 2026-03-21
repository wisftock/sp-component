import { describe, it, expect, beforeEach } from "vitest";
import "./sp-empty-state.js";
import type { SpEmptyStateComponent } from "./sp-empty-state.js";

function createElement(): SpEmptyStateComponent {
  const el = document.createElement("sp-empty-state") as SpEmptyStateComponent;
  document.body.appendChild(el);
  return el;
}

describe("sp-empty-state", () => {
  let el: SpEmptyStateComponent;

  beforeEach(() => {
    document.body.innerHTML = "";
    el = createElement();
  });

  it("renders the empty state container", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-empty-state")).not.toBeNull();
  });

  it("shows default title", async () => {
    await el.updateComplete;
    const title = el.shadowRoot?.querySelector(".sp-empty-state-title");
    expect(title?.textContent?.trim()).toBe("No data found");
  });

  it("shows custom title", async () => {
    el.title = "Nothing here yet";
    await el.updateComplete;
    const title = el.shadowRoot?.querySelector(".sp-empty-state-title");
    expect(title?.textContent?.trim()).toBe("Nothing here yet");
  });

  it("shows description when provided", async () => {
    el.description = "Try adding some items to get started.";
    await el.updateComplete;
    const desc = el.shadowRoot?.querySelector(".sp-empty-state-description");
    expect(desc?.textContent?.trim()).toBe("Try adding some items to get started.");
  });

  it("does not render description when empty", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-empty-state-description")).toBeNull();
  });

  it("shows default SVG when no icon provided", async () => {
    await el.updateComplete;
    const icon = el.shadowRoot?.querySelector(".sp-empty-state-icon");
    expect(icon?.querySelector("svg")).not.toBeNull();
    expect(icon?.querySelector("img")).toBeNull();
  });

  it("shows img element when icon prop is provided", async () => {
    el.icon = "https://example.com/icon.svg";
    await el.updateComplete;
    const icon = el.shadowRoot?.querySelector(".sp-empty-state-icon");
    expect(icon?.querySelector("img")).not.toBeNull();
    expect(icon?.querySelector("svg")).toBeNull();
  });

  it("img src matches the icon prop", async () => {
    el.icon = "https://example.com/custom-icon.png";
    await el.updateComplete;
    const img = el.shadowRoot?.querySelector(".sp-empty-state-icon img");
    expect(img?.getAttribute("src")).toBe("https://example.com/custom-icon.png");
  });

  it("renders actions slot area", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-empty-state-actions")).not.toBeNull();
  });

  it("shows slot content in actions area", async () => {
    el.innerHTML = "<button>Add item</button>";
    await el.updateComplete;
    expect(el.querySelector("button")?.textContent).toBe("Add item");
  });
});

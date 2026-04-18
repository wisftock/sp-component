import { describe, it, expect, beforeEach } from "vitest";
import "./sp-bottom-sheet.js";
import type { SpBottomSheetComponent } from "./sp-bottom-sheet.js";

function createElement(): SpBottomSheetComponent {
  const el = document.createElement("sp-bottom-sheet") as SpBottomSheetComponent;
  document.body.appendChild(el);
  return el;
}

describe("sp-bottom-sheet", () => {
  let el: SpBottomSheetComponent;
  beforeEach(() => { document.body.innerHTML = ""; el = createElement(); });

  it("renders nothing when closed", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-bs")).toBeNull();
  });

  it("renders sheet when open", async () => {
    el.open = true;
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-bs")).not.toBeNull();
  });

  it("renders overlay by default when open", async () => {
    el.open = true;
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-bs-overlay")).not.toBeNull();
  });

  it("does not render overlay when overlay is false", async () => {
    el.open = true;
    el.overlay = false;
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-bs-overlay")).toBeNull();
  });

  it("shows title when set", async () => {
    el.open = true;
    el.title = "Mi hoja";
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-bs-title")?.textContent?.trim()).toBe("Mi hoja");
  });

  it("fires sp-close when overlay clicked", async () => {
    el.open = true;
    await el.updateComplete;
    const received: CustomEvent[] = [];
    el.addEventListener("sp-close", (e) => received.push(e as CustomEvent));
    const overlay = el.shadowRoot?.querySelector<HTMLElement>(".sp-bs-overlay");
    overlay?.click();
    expect(received.length).toBe(1);
  });

  it("fires sp-close when close button clicked", async () => {
    el.open = true;
    el.title = "Hoja";
    await el.updateComplete;
    const received: CustomEvent[] = [];
    el.addEventListener("sp-close", (e) => received.push(e as CustomEvent));
    const closeBtn = el.shadowRoot?.querySelector<HTMLButtonElement>(".sp-bs-close");
    closeBtn?.click();
    expect(received.length).toBe(1);
  });

  it("renders drag handle when draggable", async () => {
    el.open = true;
    el.draggable = true;
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-bs-handle")).not.toBeNull();
  });

  it("renders content slot", async () => {
    el.open = true;
    el.innerHTML = "<p>Contenido</p>";
    await el.updateComplete;
    expect(el.querySelector("p")).not.toBeNull();
  });
});

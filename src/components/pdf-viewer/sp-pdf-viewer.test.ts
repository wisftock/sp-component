import { describe, it, expect, beforeEach } from "vitest";
import "./sp-pdf-viewer.js";
import type { SpPdfViewerComponent } from "./sp-pdf-viewer.js";

function createElement(): SpPdfViewerComponent {
  const el = document.createElement("sp-pdf-viewer") as SpPdfViewerComponent;
  document.body.appendChild(el);
  return el;
}

describe("sp-pdf-viewer", () => {
  let el: SpPdfViewerComponent;
  beforeEach(() => { document.body.innerHTML = ""; el = createElement(); });

  it("renders empty state when no src", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-pdf--empty")).not.toBeNull();
  });

  it("renders pdf container when src is set", async () => {
    el.src = "test.pdf";
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-pdf")).not.toBeNull();
  });

  it("renders iframe with src", async () => {
    el.src = "test.pdf";
    await el.updateComplete;
    const iframe = el.shadowRoot?.querySelector<HTMLIFrameElement>("iframe");
    expect(iframe).not.toBeNull();
    expect(iframe?.src).toContain("test.pdf");
  });

  it("defaults height to 600", async () => {
    await el.updateComplete;
    expect(el.height).toBe(600);
  });

  it("applies custom height", async () => {
    el.src = "test.pdf";
    el.height = 400;
    await el.updateComplete;
    const body = el.shadowRoot?.querySelector<HTMLElement>(".sp-pdf__body");
    expect(body?.style.height).toBe("400px");
  });

  it("renders toolbar by default", async () => {
    el.src = "test.pdf";
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-pdf__toolbar")).not.toBeNull();
  });

  it("hides toolbar when toolbar is false", async () => {
    el.src = "test.pdf";
    el.toolbar = false;
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-pdf__toolbar")).toBeNull();
  });

  it("defaults label to 'PDF document'", async () => {
    await el.updateComplete;
    expect(el.label).toBe("PDF document");
  });

  it("fires sp-load event when iframe loads", async () => {
    el.src = "test.pdf";
    await el.updateComplete;
    const received: CustomEvent[] = [];
    el.addEventListener("sp-load", (e) => received.push(e as CustomEvent));
    const iframe = el.shadowRoot?.querySelector<HTMLIFrameElement>("iframe");
    iframe?.dispatchEvent(new Event("load"));
    expect(received.length).toBe(1);
  });
});

import { describe, it, expect, beforeEach } from "vitest";
import "./sp-infinite-scroll.js";
import type { SpInfiniteScrollComponent } from "./sp-infinite-scroll.js";

function createElement(): SpInfiniteScrollComponent {
  const el = document.createElement("sp-infinite-scroll") as SpInfiniteScrollComponent;
  document.body.appendChild(el);
  return el;
}

describe("sp-infinite-scroll", () => {
  let el: SpInfiniteScrollComponent;
  beforeEach(() => { document.body.innerHTML = ""; el = createElement(); });

  it("renders content container in shadow DOM", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-is-content")).not.toBeNull();
  });

  it("renders sentinel element", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-is-sentinel")).not.toBeNull();
  });

  it("defaults loading to false", async () => {
    await el.updateComplete;
    expect(el.loading).toBe(false);
  });

  it("defaults hasMore to true", async () => {
    await el.updateComplete;
    expect(el.hasMore).toBe(true);
  });

  it("shows loader when loading is true", async () => {
    el.loading = true;
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-is-loader")).not.toBeNull();
  });

  it("does not show loader when loading is false", async () => {
    el.loading = false;
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-is-loader")).toBeNull();
  });

  it("shows end text when hasMore is false and not loading", async () => {
    el.hasMore = false;
    el.loading = false;
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-is-end")).not.toBeNull();
  });

  it("hides end text when hasMore is true", async () => {
    el.hasMore = true;
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-is-end")).toBeNull();
  });

  it("shows custom end text", async () => {
    el.hasMore = false;
    el.endText = "Fin de la lista";
    await el.updateComplete;
    const endEl = el.shadowRoot?.querySelector(".sp-is-end");
    expect(endEl?.textContent?.trim()).toBe("Fin de la lista");
  });

  it("shows custom loading text", async () => {
    el.loading = true;
    el.loadingText = "Espera...";
    await el.updateComplete;
    const loader = el.shadowRoot?.querySelector(".sp-is-loader");
    expect(loader?.textContent).toContain("Espera...");
  });
});

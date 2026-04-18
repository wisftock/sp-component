import { describe, it, expect, beforeEach } from "vitest";
import "./sp-descriptions.js";
import type { SpDescriptionsComponent } from "./sp-descriptions.js";

function createElement(): SpDescriptionsComponent {
  const el = document.createElement("sp-descriptions") as SpDescriptionsComponent;
  document.body.appendChild(el);
  return el;
}

describe("sp-descriptions", () => {
  let el: SpDescriptionsComponent;
  beforeEach(() => { document.body.innerHTML = ""; el = createElement(); });

  it("renders table in shadow DOM", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-desc")).not.toBeNull();
  });

  it("renders label-value pairs", async () => {
    el.items = [{ label: "Nombre", value: "Juan" }, { label: "Edad", value: 30 }];
    await el.updateComplete;
    const labels = el.shadowRoot?.querySelectorAll(".sp-desc-label");
    expect(labels?.length).toBe(2);
  });

  it("shows label text with colon by default", async () => {
    el.items = [{ label: "Estado", value: "Activo" }];
    await el.updateComplete;
    const label = el.shadowRoot?.querySelector(".sp-desc-label");
    expect(label?.textContent?.trim()).toBe("Estado:");
  });

  it("hides colon when colon is false", async () => {
    el.items = [{ label: "Estado", value: "Activo" }];
    el.colon = false;
    await el.updateComplete;
    const label = el.shadowRoot?.querySelector(".sp-desc-label");
    expect(label?.textContent?.trim()).toBe("Estado");
  });

  it("shows title when set", async () => {
    el.title = "Detalles del usuario";
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-desc-title")?.textContent?.trim()).toBe("Detalles del usuario");
  });

  it("does not show title when empty", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-desc-title")).toBeNull();
  });

  it("defaults to 2 columns", async () => {
    await el.updateComplete;
    expect(el.columns).toBe(2);
  });

  it("renders values in td elements", async () => {
    el.items = [{ label: "Nombre", value: "María" }];
    await el.updateComplete;
    const val = el.shadowRoot?.querySelector(".sp-desc-value");
    expect(val?.textContent?.trim()).toBe("María");
  });

  it("defaults to md size", async () => {
    await el.updateComplete;
    expect(el.size).toBe("md");
  });

  it("defaults to default variant", async () => {
    await el.updateComplete;
    expect(el.variant).toBe("default");
  });
});

import { describe, it, expect, beforeEach } from "vitest";
import "./sp-result.js";
import type { SpResultComponent } from "./sp-result.js";

function createElement(): SpResultComponent {
  const el = document.createElement("sp-result") as SpResultComponent;
  document.body.appendChild(el);
  return el;
}

describe("sp-result", () => {
  let el: SpResultComponent;

  beforeEach(() => {
    document.body.innerHTML = "";
    el = createElement();
  });

  it("renders the result container in shadow DOM", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-result")).not.toBeNull();
  });

  it("has default status of info", async () => {
    await el.updateComplete;
    expect(el.status).toBe("info");
  });

  it("shows title when set", async () => {
    el.title = "Operación exitosa";
    await el.updateComplete;
    const titleEl = el.shadowRoot?.querySelector(".sp-result-title");
    expect(titleEl?.textContent?.trim()).toBe("Operación exitosa");
  });

  it("shows subtitle when set", async () => {
    el.subtitle = "Tu solicitud fue procesada";
    await el.updateComplete;
    const subtitleEl = el.shadowRoot?.querySelector(".sp-result-subtitle");
    expect(subtitleEl?.textContent?.trim()).toBe("Tu solicitud fue procesada");
  });

  it("updates status property", async () => {
    el.status = "success";
    await el.updateComplete;
    expect(el.status).toBe("success");
  });

  it("applies status modifier class", async () => {
    el.status = "error";
    await el.updateComplete;
    const icon = el.shadowRoot?.querySelector(".sp-result-icon");
    expect(icon?.classList.contains("sp-result-icon--error")).toBe(true);
  });

  it("renders icon for success status", async () => {
    el.status = "success";
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector("svg")).not.toBeNull();
  });

  it("renders icon for warning status", async () => {
    el.status = "warning";
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector("svg")).not.toBeNull();
  });

  it("shows HTTP status code when set", async () => {
    el.status = "404";
    await el.updateComplete;
    const codeEl = el.shadowRoot?.querySelector(".sp-result-status");
    expect(codeEl?.textContent?.trim()).toBe("404");
  });

  it("renders extra slot content", async () => {
    el.innerHTML = `<button slot="extra">Reintentar</button>`;
    await el.updateComplete;
    expect(el.querySelector("button")?.textContent).toBe("Reintentar");
  });
});

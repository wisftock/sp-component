import { describe, it, expect, beforeEach, vi } from "vitest";
import "./sp-masked-input.js";
import type { SpMaskedInputComponent } from "./sp-masked-input.js";

function createElement(): SpMaskedInputComponent {
  const el = document.createElement("sp-masked-input") as SpMaskedInputComponent;
  document.body.appendChild(el);
  return el;
}

describe("sp-masked-input", () => {
  let el: SpMaskedInputComponent;

  beforeEach(() => {
    document.body.innerHTML = "";
    el = createElement();
  });

  // ---- Renderizado base ----

  it("renderiza un input[type=text] en shadow DOM", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector("input[type=text]")).not.toBeNull();
  });

  // ---- Props por defecto ----

  it("value vacío por defecto", async () => {
    await el.updateComplete;
    expect(el.value).toBe("");
  });

  it("mask vacío por defecto", async () => {
    await el.updateComplete;
    expect(el.mask).toBe("");
  });

  it("disabled es false por defecto", async () => {
    await el.updateComplete;
    expect(el.disabled).toBe(false);
  });

  it("invalid es false por defecto", async () => {
    await el.updateComplete;
    expect(el.invalid).toBe(false);
  });

  // ---- Aplicación de máscara ----

  it("aplica máscara de fecha al establecer value", async () => {
    el.mask = "99/99/9999";
    el.value = "01012024";
    await el.updateComplete;
    const input = el.shadowRoot?.querySelector<HTMLInputElement>("input");
    expect(input?.value).toBe("01/01/2024");
  });

  it("aplica máscara de teléfono al establecer value", async () => {
    el.mask = "(999) 999-9999";
    el.value = "5551234567";
    await el.updateComplete;
    const input = el.shadowRoot?.querySelector<HTMLInputElement>("input");
    expect(input?.value).toBe("(555) 123-4567");
  });

  it("aplica máscara de tarjeta de crédito al establecer value", async () => {
    el.mask = "9999 9999 9999 9999";
    el.value = "1234567890123456";
    await el.updateComplete;
    const input = el.shadowRoot?.querySelector<HTMLInputElement>("input");
    expect(input?.value).toBe("1234 5678 9012 3456");
  });

  // ---- Evento sp-input ----

  it("emite sp-input con value (sin máscara) y masked al escribir", async () => {
    el.mask = "99/99/9999";
    await el.updateComplete;
    const listener = vi.fn();
    el.addEventListener("sp-input", listener);

    const input = el.shadowRoot?.querySelector<HTMLInputElement>("input")!;
    input.value = "01/01";
    input.dispatchEvent(new Event("input", { bubbles: true, composed: true }));

    expect(listener).toHaveBeenCalledOnce();
    const evt = listener.mock.calls[0]![0] as CustomEvent<{ value: string; masked: string }>;
    expect(typeof evt.detail.value).toBe("string");
    expect(typeof evt.detail.masked).toBe("string");
  });

  // ---- Evento sp-change ----

  it("emite sp-change con value y masked al perder foco", async () => {
    el.mask = "99/99/9999";
    el.value = "01012024";
    await el.updateComplete;
    const listener = vi.fn();
    el.addEventListener("sp-change", listener);

    const input = el.shadowRoot?.querySelector<HTMLInputElement>("input")!;
    input.dispatchEvent(new Event("change", { bubbles: true, composed: true }));

    expect(listener).toHaveBeenCalledOnce();
    const evt = listener.mock.calls[0]![0] as CustomEvent<{ value: string; masked: string }>;
    expect(evt.detail.masked).toBe("01/01/2024");
  });

  // ---- Disabled ----

  it("el input queda deshabilitado cuando disabled=true", async () => {
    el.disabled = true;
    await el.updateComplete;
    const input = el.shadowRoot?.querySelector<HTMLInputElement>("input");
    expect(input?.disabled).toBe(true);
  });

  // ---- Invalid ----

  it("refleja atributo invalid cuando se establece", async () => {
    el.invalid = true;
    await el.updateComplete;
    expect(el.hasAttribute("invalid")).toBe(true);
  });

  // ---- Show mask ----

  it("muestra hint de máscara cuando showMask=true y hay mask", async () => {
    el.mask = "99/99/9999";
    el.showMask = true;
    await el.updateComplete;
    const hint = el.shadowRoot?.querySelector(".sp-mi-hint");
    expect(hint?.textContent).toBe("99/99/9999");
  });

  it("no muestra hint cuando showMask=false", async () => {
    el.mask = "99/99/9999";
    el.showMask = false;
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-mi-hint")).toBeNull();
  });

  // ---- Error ----

  it("muestra mensaje de error cuando error está definido", async () => {
    el.error = "Formato inválido";
    await el.updateComplete;
    const errorEl = el.shadowRoot?.querySelector(".sp-mi-error");
    expect(errorEl?.textContent).toBe("Formato inválido");
  });

  it("no muestra elemento de error cuando error está vacío", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-mi-error")).toBeNull();
  });
});

import { describe, it, expect, beforeEach, vi } from "vitest";
import "./sp-password-input.js";
import type { SpPasswordInputComponent } from "./sp-password-input.js";

function createElement(): SpPasswordInputComponent {
  const el = document.createElement("sp-password-input") as SpPasswordInputComponent;
  document.body.appendChild(el);
  return el;
}

describe("sp-password-input", () => {
  let el: SpPasswordInputComponent;

  beforeEach(() => {
    document.body.innerHTML = "";
    el = createElement();
  });

  // ---- Renderizado base ----

  it("renderiza un input[type=password] por defecto", async () => {
    await el.updateComplete;
    const input = el.shadowRoot?.querySelector("input");
    expect(input?.type).toBe("password");
  });

  it("renderiza el botón de toggle", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector("button.sp-pw-toggle")).not.toBeNull();
  });

  // ---- Props por defecto ----

  it("value vacío por defecto", async () => {
    await el.updateComplete;
    expect(el.value).toBe("");
  });

  it("disabled es false por defecto", async () => {
    await el.updateComplete;
    expect(el.disabled).toBe(false);
  });

  it("showStrength es false por defecto", async () => {
    await el.updateComplete;
    expect(el.showStrength).toBe(false);
  });

  it("placeholder por defecto es 'Contraseña'", async () => {
    await el.updateComplete;
    const input = el.shadowRoot?.querySelector<HTMLInputElement>("input");
    expect(input?.placeholder).toBe("Contraseña");
  });

  // ---- Toggle de visibilidad ----

  it("cambia a type=text al hacer click en el toggle", async () => {
    await el.updateComplete;
    const btn = el.shadowRoot?.querySelector<HTMLButtonElement>("button.sp-pw-toggle")!;
    btn.click();
    await el.updateComplete;
    const input = el.shadowRoot?.querySelector<HTMLInputElement>("input");
    expect(input?.type).toBe("text");
  });

  it("vuelve a type=password al hacer click dos veces en el toggle", async () => {
    await el.updateComplete;
    const btn = el.shadowRoot?.querySelector<HTMLButtonElement>("button.sp-pw-toggle")!;
    btn.click();
    await el.updateComplete;
    btn.click();
    await el.updateComplete;
    const input = el.shadowRoot?.querySelector<HTMLInputElement>("input");
    expect(input?.type).toBe("password");
  });

  it("aria-label del toggle cambia según visibilidad", async () => {
    await el.updateComplete;
    const btn = el.shadowRoot?.querySelector<HTMLButtonElement>("button.sp-pw-toggle")!;
    expect(btn.getAttribute("aria-label")).toBe("Mostrar contraseña");
    btn.click();
    await el.updateComplete;
    expect(btn.getAttribute("aria-label")).toBe("Ocultar contraseña");
  });

  // ---- Evento sp-input ----

  it("emite sp-input con value y strength al escribir", async () => {
    await el.updateComplete;
    const listener = vi.fn();
    el.addEventListener("sp-input", listener);

    const input = el.shadowRoot?.querySelector<HTMLInputElement>("input")!;
    input.value = "Test1234";
    input.dispatchEvent(new Event("input", { bubbles: true, composed: true }));

    expect(listener).toHaveBeenCalledOnce();
    const evt = listener.mock.calls[0]![0] as CustomEvent<{ value: string; strength: number }>;
    expect(evt.detail.value).toBe("Test1234");
    expect(typeof evt.detail.strength).toBe("number");
  });

  // ---- Evento sp-change ----

  it("emite sp-change con value y strength al perder foco", async () => {
    el.value = "Hola123!";
    await el.updateComplete;
    const listener = vi.fn();
    el.addEventListener("sp-change", listener);

    const input = el.shadowRoot?.querySelector<HTMLInputElement>("input")!;
    input.dispatchEvent(new Event("change", { bubbles: true, composed: true }));

    expect(listener).toHaveBeenCalledOnce();
    const evt = listener.mock.calls[0]![0] as CustomEvent<{ value: string; strength: number }>;
    expect(evt.detail.value).toBe("Hola123!");
    expect(typeof evt.detail.strength).toBe("number");
  });

  // ---- calcStrength ----

  it("strength 0 para contraseña vacía", async () => {
    await el.updateComplete;
    const listener = vi.fn();
    el.addEventListener("sp-input", listener);

    const input = el.shadowRoot?.querySelector<HTMLInputElement>("input")!;
    input.value = "";
    input.dispatchEvent(new Event("input", { bubbles: true, composed: true }));

    const evt = listener.mock.calls[0]![0] as CustomEvent<{ strength: number }>;
    expect(evt.detail.strength).toBe(0);
  });

  it("strength 4 para contraseña muy fuerte", async () => {
    await el.updateComplete;
    const listener = vi.fn();
    el.addEventListener("sp-input", listener);

    const input = el.shadowRoot?.querySelector<HTMLInputElement>("input")!;
    input.value = "Abc123!@#xyz";
    input.dispatchEvent(new Event("input", { bubbles: true, composed: true }));

    const evt = listener.mock.calls[0]![0] as CustomEvent<{ strength: number }>;
    expect(evt.detail.strength).toBe(4);
  });

  // ---- Indicador de fuerza ----

  it("no muestra barra de fuerza cuando showStrength=false", async () => {
    el.value = "test";
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-pw-strength")).toBeNull();
  });

  it("muestra barra de fuerza cuando showStrength=true y hay valor", async () => {
    el.showStrength = true;
    el.value = "test";
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-pw-strength")).not.toBeNull();
  });

  it("no muestra barra de fuerza cuando showStrength=true pero value está vacío", async () => {
    el.showStrength = true;
    el.value = "";
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-pw-strength")).toBeNull();
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
});

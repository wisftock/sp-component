import { describe, it, expect, beforeEach, vi } from "vitest";
import "./sp-credit-card.js";
import type { SpCreditCardComponent } from "./sp-credit-card.js";

function createElement(): SpCreditCardComponent {
  const el = document.createElement("sp-credit-card") as SpCreditCardComponent;
  document.body.appendChild(el);
  return el;
}

describe("sp-credit-card", () => {
  let el: SpCreditCardComponent;

  beforeEach(() => {
    document.body.innerHTML = "";
    el = createElement();
  });

  // ── Estructura base ────────────────────────────────────────────────────
  it("renders the card scene in shadow DOM", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-cc-scene")).not.toBeNull();
  });

  it("renders front and back faces", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-cc-front")).not.toBeNull();
    expect(el.shadowRoot?.querySelector(".sp-cc-back")).not.toBeNull();
  });

  // ── Flip ───────────────────────────────────────────────────────────────
  it("is not flipped by default", async () => {
    await el.updateComplete;
    expect(el.flipped).toBe(false);
    const card = el.shadowRoot?.querySelector(".sp-cc-card");
    expect(card?.classList.contains("flipped")).toBe(false);
  });

  it("adds flipped class when flipped=true", async () => {
    el.flipped = true;
    await el.updateComplete;
    const card = el.shadowRoot?.querySelector(".sp-cc-card");
    expect(card?.classList.contains("flipped")).toBe(true);
  });

  // ── Evento sp-flip ─────────────────────────────────────────────────────
  it("emits sp-flip event when flipped changes", async () => {
    await el.updateComplete;
    const handler = vi.fn();
    el.addEventListener("sp-flip", handler);
    el.flipped = true;
    await el.updateComplete;
    expect(handler).toHaveBeenCalledOnce();
    expect((handler.mock.calls[0][0] as CustomEvent).detail).toEqual({ flipped: true });
  });

  it("does NOT emit sp-flip on initial render", async () => {
    const handler = vi.fn();
    el.addEventListener("sp-flip", handler);
    await el.updateComplete;
    expect(handler).not.toHaveBeenCalled();
  });

  // ── Modo interactivo ───────────────────────────────────────────────────
  it("flips on click when interactive=true", async () => {
    el.interactive = true;
    await el.updateComplete;
    const scene = el.shadowRoot?.querySelector(".sp-cc-scene") as HTMLElement;
    scene?.click();
    await el.updateComplete;
    expect(el.flipped).toBe(true);
  });

  it("does NOT flip on click when interactive=false", async () => {
    await el.updateComplete;
    const scene = el.shadowRoot?.querySelector(".sp-cc-scene") as HTMLElement;
    scene?.click();
    await el.updateComplete;
    expect(el.flipped).toBe(false);
  });

  it("scene has role=button and tabindex=0 when interactive", async () => {
    el.interactive = true;
    await el.updateComplete;
    const scene = el.shadowRoot?.querySelector(".sp-cc-scene");
    expect(scene?.getAttribute("role")).toBe("button");
    expect(scene?.getAttribute("tabindex")).toBe("0");
  });

  it("scene has role=group when not interactive", async () => {
    await el.updateComplete;
    const scene = el.shadowRoot?.querySelector(".sp-cc-scene");
    expect(scene?.getAttribute("role")).toBe("group");
  });

  // ── Contenido del frente ───────────────────────────────────────────────
  it("displays holder name on front", async () => {
    el.holder = "JUAN PEREZ";
    await el.updateComplete;
    const front = el.shadowRoot?.querySelector(".sp-cc-front");
    expect(front?.textContent).toContain("JUAN PEREZ");
  });

  it("displays expiry on front", async () => {
    el.expiry = "12/28";
    await el.updateComplete;
    const front = el.shadowRoot?.querySelector(".sp-cc-front");
    expect(front?.textContent).toContain("12/28");
  });

  // ── CVV y masked ───────────────────────────────────────────────────────
  it("displays CVV placeholder on back when cvv is empty", async () => {
    await el.updateComplete;
    const cvvBox = el.shadowRoot?.querySelector(".sp-cc-cvv-value");
    expect(cvvBox?.textContent?.trim()).toBe("•••");
  });

  it("displays actual CVV when set", async () => {
    el.cvv = "123";
    await el.updateComplete;
    const cvvBox = el.shadowRoot?.querySelector(".sp-cc-cvv-value");
    expect(cvvBox?.textContent?.trim()).toBe("123");
  });

  it("hides CVV with ••• when masked=true even if cvv is set", async () => {
    el.cvv = "123";
    el.masked = true;
    await el.updateComplete;
    const cvvBox = el.shadowRoot?.querySelector(".sp-cc-cvv-value");
    expect(cvvBox?.textContent?.trim()).toBe("•••");
  });

  // ── Detección de red ───────────────────────────────────────────────────
  it("shows VISA label for Visa card number", async () => {
    el.number = "4111111111111111";
    await el.updateComplete;
    const front = el.shadowRoot?.querySelector(".sp-cc-front");
    expect(front?.textContent).toContain("VISA");
  });

  it("shows Mastercard logo for Mastercard number", async () => {
    el.number = "5500000000000004";
    await el.updateComplete;
    const front = el.shadowRoot?.querySelector(".sp-cc-front");
    expect(front?.querySelector("[aria-label='Mastercard']")).not.toBeNull();
  });

  it("shows American Express logo for Amex number", async () => {
    el.number = "371449635398431";
    await el.updateComplete;
    const front = el.shadowRoot?.querySelector(".sp-cc-front");
    expect(front?.querySelector("[aria-label='American Express']")).not.toBeNull();
  });

  it("shows Discover logo for Discover number", async () => {
    el.number = "6011111111111117";
    await el.updateComplete;
    const front = el.shadowRoot?.querySelector(".sp-cc-front");
    expect(front?.querySelector("[aria-label='Discover']")).not.toBeNull();
  });

  it("shows UnionPay logo for UnionPay number", async () => {
    el.number = "6212345678901234";
    await el.updateComplete;
    const front = el.shadowRoot?.querySelector(".sp-cc-front");
    expect(front?.querySelector("[aria-label='UnionPay']")).not.toBeNull();
  });

  it("shows Diners Club logo for Diners number", async () => {
    el.number = "30569309025904";
    await el.updateComplete;
    const front = el.shadowRoot?.querySelector(".sp-cc-front");
    expect(front?.querySelector("[aria-label='Diners Club']")).not.toBeNull();
  });

  it("shows JCB logo for JCB number", async () => {
    el.number = "3530111333300000";
    await el.updateComplete;
    const front = el.shadowRoot?.querySelector(".sp-cc-front");
    expect(front?.querySelector("[aria-label='JCB']")).not.toBeNull();
  });

  // ── Validación de longitud ─────────────────────────────────────────────
  it("does not show invalid class for empty number", async () => {
    el.number = "";
    await el.updateComplete;
    const numEl = el.shadowRoot?.querySelector(".sp-cc-number");
    expect(numEl?.classList.contains("sp-cc-number--invalid")).toBe(false);
  });

  it("shows invalid class when number length is wrong", async () => {
    el.number = "411111"; // Visa pero longitud incorrecta
    await el.updateComplete;
    const numEl = el.shadowRoot?.querySelector(".sp-cc-number");
    expect(numEl?.classList.contains("sp-cc-number--invalid")).toBe(true);
  });

  it("does not show invalid class for correct VISA length (16 digits)", async () => {
    el.number = "4111111111111111";
    await el.updateComplete;
    const numEl = el.shadowRoot?.querySelector(".sp-cc-number");
    expect(numEl?.classList.contains("sp-cc-number--invalid")).toBe(false);
  });

  it("does not show invalid class for correct AMEX length (15 digits)", async () => {
    el.number = "371449635398431";
    await el.updateComplete;
    const numEl = el.shadowRoot?.querySelector(".sp-cc-number");
    expect(numEl?.classList.contains("sp-cc-number--invalid")).toBe(false);
  });

  // ── Sanitización del gradient ──────────────────────────────────────────
  it("applies a valid custom gradient", async () => {
    el.theme = "custom";
    el.gradient = "linear-gradient(135deg, #000 0%, #fff 100%)";
    await el.updateComplete;
    const front = el.shadowRoot?.querySelector(".sp-cc-front") as HTMLElement;
    expect(front?.style.background).toContain("linear-gradient");
  });

  it("ignores an invalid custom gradient", async () => {
    el.theme = "custom";
    el.gradient = "javascript:alert(1)";
    await el.updateComplete;
    const front = el.shadowRoot?.querySelector(".sp-cc-front") as HTMLElement;
    expect(front?.style.background).toBe("");
  });

  // ── Tamaños ────────────────────────────────────────────────────────────
  it("renders at md size (380x230) by default", async () => {
    await el.updateComplete;
    const scene = el.shadowRoot?.querySelector(".sp-cc-scene") as HTMLElement;
    expect(scene?.style.width).toBe("380px");
    expect(scene?.style.height).toBe("230px");
  });

  it("renders at sm size (300x182) when size=sm", async () => {
    el.size = "sm";
    await el.updateComplete;
    const scene = el.shadowRoot?.querySelector(".sp-cc-scene") as HTMLElement;
    expect(scene?.style.width).toBe("300px");
    expect(scene?.style.height).toBe("182px");
  });

  it("renders at lg size (460x279) when size=lg", async () => {
    el.size = "lg";
    await el.updateComplete;
    const scene = el.shadowRoot?.querySelector(".sp-cc-scene") as HTMLElement;
    expect(scene?.style.width).toBe("460px");
    expect(scene?.style.height).toBe("279px");
  });

  // ── Enmascarado del número ─────────────────────────────────────────────
  it("masks card number with dots for missing digits", async () => {
    el.number = "4111";
    await el.updateComplete;
    const numEl = el.shadowRoot?.querySelector(".sp-cc-number");
    expect(numEl?.textContent).toContain("•");
  });

  // ── Accesibilidad ──────────────────────────────────────────────────────
  it("has aria-live announce region", async () => {
    await el.updateComplete;
    const announce = el.shadowRoot?.querySelector(".sp-cc-announce");
    expect(announce?.getAttribute("aria-live")).toBe("polite");
  });

  it("has correct aria-label from label prop", async () => {
    el.label = "Tarjeta de crédito VISA";
    await el.updateComplete;
    const scene = el.shadowRoot?.querySelector(".sp-cc-scene");
    expect(scene?.getAttribute("aria-label")).toBe("Tarjeta de crédito VISA");
  });
});

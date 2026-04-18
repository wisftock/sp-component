import { describe, it, expect, beforeEach } from "vitest";
import "./sp-rich-text-editor.js";
import type { SpRichTextEditorComponent } from "./sp-rich-text-editor.js";

function createElement(): SpRichTextEditorComponent {
  const el = document.createElement("sp-rich-text-editor") as SpRichTextEditorComponent;
  document.body.appendChild(el);
  return el;
}

describe("sp-rich-text-editor", () => {
  let el: SpRichTextEditorComponent;
  beforeEach(() => { document.body.innerHTML = ""; el = createElement(); });

  it("renders editor container in shadow DOM", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-rte")).not.toBeNull();
  });

  it("renders toolbar", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-rte__toolbar")).not.toBeNull();
  });

  it("renders editable area", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-rte__editor")).not.toBeNull();
  });

  it("editor area has contenteditable attribute", async () => {
    await el.updateComplete;
    const editor = el.shadowRoot?.querySelector<HTMLElement>(".sp-rte__editor");
    expect(editor?.hasAttribute("contenteditable")).toBe(true);
  });

  it("defaults placeholder", async () => {
    await el.updateComplete;
    expect(el.placeholder).toBe("Write something…");
  });

  it("defaults disabled to false", async () => {
    await el.updateComplete;
    expect(el.disabled).toBe(false);
  });

  it("shows label when set", async () => {
    el.label = "Mi editor";
    await el.updateComplete;
    const label = el.shadowRoot?.querySelector(".sp-rte__label");
    expect(label?.textContent?.trim()).toBe("Mi editor");
  });

  it("does not show label element when label is empty", async () => {
    el.label = "";
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-rte__label")).toBeNull();
  });

  it("toolbar is hidden in readonly mode", async () => {
    el.readonly = true;
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-rte__toolbar")).toBeNull();
  });

  it("editor loses contenteditable when disabled", async () => {
    el.disabled = true;
    await el.updateComplete;
    const editor = el.shadowRoot?.querySelector<HTMLElement>(".sp-rte__editor");
    // ?contenteditable=${false} removes the attribute
    expect(editor?.hasAttribute("contenteditable")).toBe(false);
  });
});

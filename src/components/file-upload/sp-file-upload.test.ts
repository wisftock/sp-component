import { describe, it, expect, beforeEach, vi } from "vitest";
import "./sp-file-upload.js";
import type { SpFileUploadComponent } from "./sp-file-upload.js";

function createElement(): SpFileUploadComponent {
  const el = document.createElement("sp-file-upload") as SpFileUploadComponent;
  document.body.appendChild(el);
  return el;
}

function makeFile(name: string, size: number, type = "text/plain"): File {
  const blob = new Blob(["x".repeat(size)], { type });
  return new File([blob], name, { type });
}

describe("sp-file-upload", () => {
  let el: SpFileUploadComponent;

  beforeEach(() => {
    document.body.innerHTML = "";
    el = createElement();
  });

  it("renders the dropzone element", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-file-dropzone")).not.toBeNull();
  });

  it("renders a file input inside the dropzone", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector("input[type=file]")).not.toBeNull();
  });

  it("reflects disabled attribute when set", async () => {
    el.disabled = true;
    await el.updateComplete;
    expect(el.hasAttribute("disabled")).toBe(true);
  });

  it("file input has correct accept attribute", async () => {
    el.accept = "image/*";
    await el.updateComplete;
    const input = el.shadowRoot?.querySelector<HTMLInputElement>("input[type=file]");
    expect(input?.getAttribute("accept")).toBe("image/*");
  });

  it("file input has multiple attribute when multiple is true", async () => {
    el.multiple = true;
    await el.updateComplete;
    const input = el.shadowRoot?.querySelector<HTMLInputElement>("input[type=file]");
    expect(input?.multiple).toBe(true);
  });

  it("_processFiles adds file to internal list", async () => {
    await el.updateComplete;
    const file = makeFile("test.txt", 100);
    el._processFiles([file]);
    expect(el._files).toHaveLength(1);
    expect(el._files[0]!.name).toBe("test.txt");
  });

  it("emits sp-change when valid file is processed", async () => {
    await el.updateComplete;
    const listener = vi.fn();
    el.addEventListener("sp-change", listener);
    const file = makeFile("doc.pdf", 500);
    el._processFiles([file]);
    expect(listener).toHaveBeenCalledOnce();
    expect((listener.mock.calls[0]![0] as CustomEvent).detail.files).toHaveLength(1);
  });

  it("maxSize validation emits sp-error for oversized file", async () => {
    el.maxSize = 100;
    await el.updateComplete;
    const listener = vi.fn();
    el.addEventListener("sp-error", listener);
    const bigFile = makeFile("big.txt", 200);
    el._processFiles([bigFile]);
    expect(listener).toHaveBeenCalledOnce();
    expect((listener.mock.calls[0]![0] as CustomEvent).detail.message).toContain("exceeds max size");
  });

  it("maxSize validation does not add oversized file to list", async () => {
    el.maxSize = 100;
    await el.updateComplete;
    const bigFile = makeFile("big.txt", 200);
    el._processFiles([bigFile]);
    expect(el._files).toHaveLength(0);
  });

  it("removeFile removes file from list and emits sp-change", async () => {
    await el.updateComplete;
    el._files = [makeFile("a.txt", 10), makeFile("b.txt", 20)];
    const listener = vi.fn();
    el.addEventListener("sp-change", listener);
    el._removeFile(0);
    expect(el._files).toHaveLength(1);
    expect(el._files[0]!.name).toBe("b.txt");
    expect(listener).toHaveBeenCalledOnce();
  });

  it("adds dragging class on dragover", async () => {
    await el.updateComplete;
    const zone = el.shadowRoot?.querySelector(".sp-file-dropzone")!;
    const dragEvent = new DragEvent("dragover", { bubbles: true, cancelable: true });
    zone.dispatchEvent(dragEvent);
    await el.updateComplete;
    expect(el._dragging).toBe(true);
  });

  it("dragover calls preventDefault", async () => {
    await el.updateComplete;
    const zone = el.shadowRoot?.querySelector(".sp-file-dropzone")!;
    const dragEvent = new DragEvent("dragover", { bubbles: true, cancelable: true });
    const preventDefaultSpy = vi.spyOn(dragEvent, "preventDefault");
    zone.dispatchEvent(dragEvent);
    expect(preventDefaultSpy).toHaveBeenCalled();
  });

  it("shows external error message", async () => {
    el.error = "Upload failed";
    await el.updateComplete;
    const errorEl = el.shadowRoot?.querySelector(".sp-file-error");
    expect(errorEl?.textContent?.trim()).toBe("Upload failed");
  });

  it("shows hint text inside dropzone", async () => {
    el.hint = "PNG, JPG up to 5MB";
    await el.updateComplete;
    const hintEl = el.shadowRoot?.querySelector(".sp-file-hint");
    expect(hintEl?.textContent?.trim()).toBe("PNG, JPG up to 5MB");
  });
});

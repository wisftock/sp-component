import { describe, it, expect, beforeEach } from "vitest";
import "./sp-diff-viewer.js";
import type { SpDiffViewerComponent } from "./sp-diff-viewer.js";

function createElement(): SpDiffViewerComponent {
  const el = document.createElement("sp-diff-viewer") as SpDiffViewerComponent;
  document.body.appendChild(el);
  return el;
}

describe("sp-diff-viewer", () => {
  let el: SpDiffViewerComponent;

  beforeEach(() => {
    document.body.innerHTML = "";
    el = createElement();
  });

  it("renders the diff container in shadow DOM", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-diff")).not.toBeNull();
  });

  it("has default mode of unified", async () => {
    await el.updateComplete;
    expect(el.mode).toBe("unified");
  });

  it("shows filename in header when set", async () => {
    el.filename = "app.ts";
    await el.updateComplete;
    const filename = el.shadowRoot?.querySelector(".sp-diff-filename");
    expect(filename?.textContent?.trim()).toBe("app.ts");
  });

  it("renders unified table by default", async () => {
    el.oldText = "line1\nline2";
    el.newText = "line1\nline3";
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-diff-table")).not.toBeNull();
  });

  it("renders split view when mode=split is toggled", async () => {
    el.oldText = "hello";
    el.newText = "world";
    await el.updateComplete;
    const splitBtn = el.shadowRoot?.querySelector<HTMLButtonElement>(".sp-diff-toggle button:last-child");
    splitBtn?.click();
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-diff-split")).not.toBeNull();
  });

  it("shows add count in stats", async () => {
    el.oldText = "line1";
    el.newText = "line1\nline2";
    await el.updateComplete;
    const addCount = el.shadowRoot?.querySelector(".sp-diff-add-count");
    expect(addCount?.textContent).toContain("+");
  });

  it("shows del count in stats", async () => {
    el.oldText = "line1\nline2";
    el.newText = "line1";
    await el.updateComplete;
    const delCount = el.shadowRoot?.querySelector(".sp-diff-del-count");
    expect(delCount?.textContent).toContain("-");
  });

  it("renders add rows for added lines", async () => {
    el.oldText = "";
    el.newText = "new line";
    await el.updateComplete;
    const addRow = el.shadowRoot?.querySelector("tr.sp-diff-add");
    expect(addRow).not.toBeNull();
  });

  it("renders del rows for deleted lines", async () => {
    el.oldText = "old line";
    el.newText = "";
    await el.updateComplete;
    const delRow = el.shadowRoot?.querySelector("tr.sp-diff-del");
    expect(delRow).not.toBeNull();
  });

  it("renders toggle buttons for unified/split", async () => {
    await el.updateComplete;
    const buttons = el.shadowRoot?.querySelectorAll(".sp-diff-toggle button");
    expect(buttons?.length).toBe(2);
  });
});

import { describe, it, expect, beforeEach, vi } from "vitest";
import "./sp-code-block.js";
import type { SpCodeBlockComponent } from "./sp-code-block.js";

function createElement(): SpCodeBlockComponent {
  const el = document.createElement("sp-code-block") as SpCodeBlockComponent;
  document.body.appendChild(el);
  return el;
}

describe("sp-code-block", () => {
  let el: SpCodeBlockComponent;

  beforeEach(() => {
    document.body.innerHTML = "";
    el = createElement();
  });

  it("renders the code block container in shadow DOM", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-cb")).not.toBeNull();
  });

  it("has default language of js", async () => {
    await el.updateComplete;
    expect(el.language).toBe("js");
  });

  it("shows language badge in header when no filename", async () => {
    el.language = "ts";
    await el.updateComplete;
    const lang = el.shadowRoot?.querySelector(".sp-cb-lang");
    expect(lang?.textContent?.trim()).toBe("ts");
  });

  it("shows filename in header when set", async () => {
    el.filename = "app.ts";
    await el.updateComplete;
    const fname = el.shadowRoot?.querySelector(".sp-cb-filename");
    expect(fname?.textContent?.trim()).toBe("app.ts");
  });

  it("renders line numbers by default", async () => {
    el.code = "line1\nline2\nline3";
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-cb-gutter")).not.toBeNull();
  });

  it("hides line numbers when line-numbers=false", async () => {
    el.code = "const x = 1;";
    el.lineNumbers = false;
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-cb-gutter")).toBeNull();
  });

  it("renders copy button when copyable=true", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-cb-copy")).not.toBeNull();
  });

  it("hides copy button when copyable=false", async () => {
    el.copyable = false;
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-cb-copy")).toBeNull();
  });

  it("renders code content", async () => {
    el.code = "const x = 42;";
    await el.updateComplete;
    const code = el.shadowRoot?.querySelector(".sp-cb-code");
    expect(code?.textContent).toContain("x");
  });

  it("applies max-height style when set", async () => {
    el.maxHeight = "300px";
    await el.updateComplete;
    const scroll = el.shadowRoot?.querySelector<HTMLElement>(".sp-cb-scroll");
    expect(scroll?.style.maxHeight || scroll?.getAttribute("style")).toContain("300px");
  });

  it("shows header section when filename, language or copyable", async () => {
    el.filename = "test.js";
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-cb-header")).not.toBeNull();
  });
});

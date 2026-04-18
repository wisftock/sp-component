import { describe, it, expect, beforeEach } from "vitest";
import "./sp-markdown.js";
import type { SpMarkdownComponent } from "./sp-markdown.js";

function createElement(): SpMarkdownComponent {
  const el = document.createElement("sp-markdown") as SpMarkdownComponent;
  document.body.appendChild(el);
  return el;
}

describe("sp-markdown", () => {
  let el: SpMarkdownComponent;
  beforeEach(() => { document.body.innerHTML = ""; el = createElement(); });

  it("renders markdown container in shadow DOM", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-md")).not.toBeNull();
  });

  it("renders h1 for # heading", async () => {
    el.content = "# Hello World";
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector("h1")).not.toBeNull();
    expect(el.shadowRoot?.querySelector("h1")?.textContent?.trim()).toBe("Hello World");
  });

  it("renders h2 for ## heading", async () => {
    el.content = "## Subtitle";
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector("h2")?.textContent?.trim()).toBe("Subtitle");
  });

  it("renders strong for **bold**", async () => {
    el.content = "Text **bold** here";
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector("strong")).not.toBeNull();
    expect(el.shadowRoot?.querySelector("strong")?.textContent).toBe("bold");
  });

  it("renders em for *italic*", async () => {
    el.content = "Text *italic* here";
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector("em")).not.toBeNull();
  });

  it("renders code block for fenced code", async () => {
    el.content = "```js\nconst x = 1;\n```";
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector("pre")).not.toBeNull();
  });

  it("renders blockquote", async () => {
    el.content = "> A quote";
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector("blockquote")).not.toBeNull();
  });

  it("renders unordered list", async () => {
    el.content = "- item one\n- item two";
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector("ul")).not.toBeNull();
    expect(el.shadowRoot?.querySelectorAll("li").length).toBe(2);
  });

  it("renders paragraph for plain text", async () => {
    el.content = "Just a paragraph.";
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector("p")).not.toBeNull();
  });

  it("renders inline code with backticks", async () => {
    el.content = "Use `const` keyword";
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector("code")).not.toBeNull();
  });
});

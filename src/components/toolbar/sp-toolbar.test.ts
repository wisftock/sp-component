import { describe, it, expect, beforeEach } from "vitest";
import "./sp-toolbar.js";
import type { SpToolbarComponent } from "./sp-toolbar.js";

function createElement(): SpToolbarComponent {
  const el = document.createElement("sp-toolbar") as SpToolbarComponent;
  document.body.appendChild(el);
  return el;
}

describe("sp-toolbar", () => {
  let el: SpToolbarComponent;
  beforeEach(() => { document.body.innerHTML = ""; el = createElement(); });

  it("renders toolbar container in shadow DOM", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-tb")).not.toBeNull();
  });

  it("renders default slot", async () => {
    el.innerHTML = "<button>B</button>";
    await el.updateComplete;
    expect(el.querySelector("button")).not.toBeNull();
  });

  it("defaults orientation to horizontal", async () => {
    await el.updateComplete;
    expect(el.orientation).toBe("horizontal");
  });

  it("has toolbar role", async () => {
    await el.updateComplete;
    const tb = el.shadowRoot?.querySelector("[role='toolbar']");
    expect(tb).not.toBeNull();
  });
});

describe("sp-toolbar-sep", () => {
  beforeEach(() => { document.body.innerHTML = ""; });

  it("renders separator in shadow DOM", async () => {
    const el = document.createElement("sp-toolbar-sep");
    document.body.appendChild(el);
    await (el as any).updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-tb-sep")).not.toBeNull();
  });
});

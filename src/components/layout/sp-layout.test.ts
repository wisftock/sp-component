import { describe, it, expect, beforeEach } from "vitest";
import "./sp-layout.js";
import type { SpStackComponent, SpGridComponent, SpContainerComponent } from "./sp-layout.js";

describe("sp-stack", () => {
  beforeEach(() => { document.body.innerHTML = ""; });

  it("renders stack container in shadow DOM", async () => {
    const el = document.createElement("sp-stack") as SpStackComponent;
    document.body.appendChild(el);
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-stack")).not.toBeNull();
  });

  it("defaults to column direction", async () => {
    const el = document.createElement("sp-stack") as SpStackComponent;
    document.body.appendChild(el);
    await el.updateComplete;
    expect(el.direction).toBe("column");
  });

  it("applies row class for row direction", async () => {
    const el = document.createElement("sp-stack") as SpStackComponent;
    el.direction = "row";
    document.body.appendChild(el);
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-stack--row")).not.toBeNull();
  });

  it("applies wrap class", async () => {
    const el = document.createElement("sp-stack") as SpStackComponent;
    el.wrap = true;
    document.body.appendChild(el);
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-stack--wrap")).not.toBeNull();
  });

  it("applies full class", async () => {
    const el = document.createElement("sp-stack") as SpStackComponent;
    el.full = true;
    document.body.appendChild(el);
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-stack--full")).not.toBeNull();
  });

  it("applies custom gap via style", async () => {
    const el = document.createElement("sp-stack") as SpStackComponent;
    el.gap = "16px";
    document.body.appendChild(el);
    await el.updateComplete;
    const div = el.shadowRoot?.querySelector<HTMLElement>(".sp-stack");
    expect(div?.style.gap).toBe("16px");
  });
});

describe("sp-grid", () => {
  beforeEach(() => { document.body.innerHTML = ""; });

  it("renders grid container in shadow DOM", async () => {
    const el = document.createElement("sp-grid") as SpGridComponent;
    document.body.appendChild(el);
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-grid")).not.toBeNull();
  });

  it("defaults to 12 columns", async () => {
    const el = document.createElement("sp-grid") as SpGridComponent;
    document.body.appendChild(el);
    await el.updateComplete;
    expect(el.cols).toBe(12);
  });

  it("renders slot", async () => {
    const el = document.createElement("sp-grid") as SpGridComponent;
    el.innerHTML = "<div>cell</div>";
    document.body.appendChild(el);
    await el.updateComplete;
    expect(el.querySelector("div")).not.toBeNull();
  });
});

describe("sp-container", () => {
  beforeEach(() => { document.body.innerHTML = ""; });

  it("renders container in shadow DOM", async () => {
    const el = document.createElement("sp-container") as SpContainerComponent;
    document.body.appendChild(el);
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-container")).not.toBeNull();
  });

  it("defaults to xl size", async () => {
    const el = document.createElement("sp-container") as SpContainerComponent;
    document.body.appendChild(el);
    await el.updateComplete;
    expect(el.size).toBe("xl");
    expect(el.shadowRoot?.querySelector(".sp-container--xl")).not.toBeNull();
  });

  it("applies custom size class", async () => {
    const el = document.createElement("sp-container") as SpContainerComponent;
    el.size = "sm";
    document.body.appendChild(el);
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-container--sm")).not.toBeNull();
  });
});

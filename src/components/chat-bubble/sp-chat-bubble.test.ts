import { describe, it, expect, beforeEach } from "vitest";
import "./sp-chat-bubble.js";
import type { SpChatBubbleComponent } from "./sp-chat-bubble.js";

function createElement(): SpChatBubbleComponent {
  const el = document.createElement("sp-chat-bubble") as SpChatBubbleComponent;
  document.body.appendChild(el);
  return el;
}

describe("sp-chat-bubble", () => {
  let el: SpChatBubbleComponent;

  beforeEach(() => {
    document.body.innerHTML = "";
    el = createElement();
  });

  // ---- Rendering ----

  it("renders the row wrapper in shadow DOM", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-cb-row")).not.toBeNull();
  });

  it("renders the bubble element", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-cb-bubble")).not.toBeNull();
  });

  it("renders avatar by default (show-avatar=true)", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-cb-avatar")).not.toBeNull();
  });

  // ---- Default props ----

  it("has mine=false by default", async () => {
    await el.updateComplete;
    expect(el.mine).toBe(false);
    expect(el.hasAttribute("mine")).toBe(false);
  });

  it("has status=sent by default", async () => {
    await el.updateComplete;
    expect(el.status).toBe("sent");
  });

  it("has typing=false by default", async () => {
    await el.updateComplete;
    expect(el.typing).toBe(false);
    expect(el.hasAttribute("typing")).toBe(false);
  });

  it("has showAvatar=true by default", async () => {
    await el.updateComplete;
    expect(el.showAvatar).toBe(true);
  });

  // ---- Avatar ----

  it("hides avatar when show-avatar is false", async () => {
    el.showAvatar = false;
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-cb-avatar")).toBeNull();
  });

  it("renders img tag when avatar URL is provided", async () => {
    el.avatar = "https://example.com/avatar.png";
    el.name = "Ana";
    await el.updateComplete;
    const img = el.shadowRoot?.querySelector(".sp-cb-avatar img") as HTMLImageElement;
    expect(img).not.toBeNull();
    expect(img.src).toContain("avatar.png");
  });

  it("renders initials when avatar URL is empty", async () => {
    el.name = "Juan Perez";
    await el.updateComplete;
    const avatar = el.shadowRoot?.querySelector(".sp-cb-avatar");
    expect(avatar?.textContent?.trim()).toBe("JP");
  });

  it("renders ? initials when name is empty", async () => {
    el.name = "";
    el.avatar = "";
    await el.updateComplete;
    const avatar = el.shadowRoot?.querySelector(".sp-cb-avatar");
    expect(avatar?.textContent?.trim()).toBe("?");
  });

  // ---- Name display ----

  it("shows sender name when mine=false and name is set", async () => {
    el.mine = false;
    el.name = "María";
    await el.updateComplete;
    const nameEl = el.shadowRoot?.querySelector(".sp-cb-name");
    expect(nameEl?.textContent?.trim()).toBe("María");
  });

  it("does not show sender name when mine=true", async () => {
    el.mine = true;
    el.name = "María";
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-cb-name")).toBeNull();
  });

  // ---- Typing indicator ----

  it("renders typing dots when typing=true", async () => {
    el.typing = true;
    await el.updateComplete;
    const dots = el.shadowRoot?.querySelectorAll(".sp-cb-dot");
    expect(dots?.length).toBe(3);
  });

  it("does not render dots when typing=false", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelectorAll(".sp-cb-dot").length).toBe(0);
  });

  it("reflects typing attribute", async () => {
    el.typing = true;
    await el.updateComplete;
    expect(el.hasAttribute("typing")).toBe(true);
  });

  // ---- Status icon ----

  it("renders status meta when mine=true and not typing", async () => {
    el.mine = true;
    el.status = "delivered";
    await el.updateComplete;
    const statusEl = el.shadowRoot?.querySelector(".sp-cb-status");
    expect(statusEl).not.toBeNull();
  });

  it("does not render status when mine=false", async () => {
    el.mine = false;
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-cb-status")).toBeNull();
  });

  it("applies status class according to status prop", async () => {
    el.mine = true;
    el.status = "read";
    await el.updateComplete;
    const statusEl = el.shadowRoot?.querySelector(".sp-cb-status");
    expect(statusEl?.classList.contains("sp-cb-status--read")).toBe(true);
  });

  // ---- Time ----

  it("renders time when time prop is set", async () => {
    el.time = "10:35";
    await el.updateComplete;
    const timeEl = el.shadowRoot?.querySelector(".sp-cb-time");
    expect(timeEl?.textContent?.trim()).toBe("10:35");
  });

  it("does not render time element when time is empty", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-cb-time")).toBeNull();
  });

  // ---- mine reflect ----

  it("reflects mine attribute when set", async () => {
    el.mine = true;
    await el.updateComplete;
    expect(el.hasAttribute("mine")).toBe(true);
  });
});

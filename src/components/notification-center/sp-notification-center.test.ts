import { describe, it, expect, beforeEach } from "vitest";
import "./sp-notification-center.js";
import type { SpNotificationCenterComponent, SpNotification } from "./sp-notification-center.js";

function createElement(): SpNotificationCenterComponent {
  const el = document.createElement("sp-notification-center") as SpNotificationCenterComponent;
  document.body.appendChild(el);
  return el;
}

const NOTIFICATIONS: SpNotification[] = [
  { id: "1", title: "Nuevo mensaje", body: "Tienes un mensaje nuevo", read: false, type: "info" },
  { id: "2", title: "Tarea completada", read: true, type: "success" },
];

describe("sp-notification-center", () => {
  let el: SpNotificationCenterComponent;
  beforeEach(() => { document.body.innerHTML = ""; el = createElement(); });

  it("renders bell trigger button in shadow DOM", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-nc-trigger")).not.toBeNull();
  });

  it("dropdown is not visible by default", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-nc-dropdown")).toBeNull();
  });

  it("opens dropdown on trigger click", async () => {
    await el.updateComplete;
    const btn = el.shadowRoot?.querySelector<HTMLButtonElement>(".sp-nc-trigger");
    btn?.click();
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-nc-dropdown")).not.toBeNull();
  });

  it("shows badge for unread count", async () => {
    el.notifications = NOTIFICATIONS;
    await el.updateComplete;
    const badge = el.shadowRoot?.querySelector(".sp-nc-badge");
    expect(badge?.textContent?.trim()).toBe("1");
  });

  it("does not show badge when all read", async () => {
    el.notifications = [{ id: "1", title: "A", read: true }];
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-nc-badge")).toBeNull();
  });

  it("shows empty state when no notifications", async () => {
    el.notifications = [];
    const btn = el.shadowRoot?.querySelector<HTMLButtonElement>(".sp-nc-trigger");
    btn?.click();
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-nc-empty")).not.toBeNull();
  });

  it("renders notifications in list", async () => {
    el.notifications = NOTIFICATIONS;
    const btn = el.shadowRoot?.querySelector<HTMLButtonElement>(".sp-nc-trigger");
    btn?.click();
    await el.updateComplete;
    const items = el.shadowRoot?.querySelectorAll(".sp-nc-item");
    expect(items?.length).toBe(2);
  });

  it("fires sp-notification-click on item click", async () => {
    el.notifications = NOTIFICATIONS;
    const btn = el.shadowRoot?.querySelector<HTMLButtonElement>(".sp-nc-trigger");
    btn?.click();
    await el.updateComplete;
    const received: CustomEvent[] = [];
    el.addEventListener("sp-notification-click", (e) => received.push(e as CustomEvent));
    const item = el.shadowRoot?.querySelector<HTMLElement>(".sp-nc-item");
    item?.click();
    expect(received.length).toBe(1);
  });

  it("fires sp-dismiss on dismiss click", async () => {
    el.notifications = NOTIFICATIONS;
    const btn = el.shadowRoot?.querySelector<HTMLButtonElement>(".sp-nc-trigger");
    btn?.click();
    await el.updateComplete;
    const received: CustomEvent[] = [];
    el.addEventListener("sp-dismiss", (e) => received.push(e as CustomEvent));
    const dismiss = el.shadowRoot?.querySelector<HTMLButtonElement>(".sp-nc-dismiss");
    dismiss?.click();
    expect(received.length).toBe(1);
    expect(received[0].detail.id).toBe("1");
  });
});

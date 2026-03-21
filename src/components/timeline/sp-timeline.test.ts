import { describe, it, expect, beforeEach } from "vitest";
import "./sp-timeline.js";
import type { SpTimelineComponent } from "./sp-timeline.js";
import type { SpTimelineItem } from "./sp-timeline.types.js";

const SAMPLE_ITEMS: SpTimelineItem[] = [
  { label: "Order placed", description: "Your order has been received.", time: "10:00 AM", variant: "success" },
  { label: "Processing", description: "We are preparing your order.", time: "11:00 AM", variant: "info" },
  { label: "Shipped", description: "Your order is on its way.", time: "2:00 PM", variant: "default" },
  { label: "Delivered", variant: "warning" },
];

function createElement(): SpTimelineComponent {
  const el = document.createElement("sp-timeline") as SpTimelineComponent;
  document.body.appendChild(el);
  return el;
}

describe("sp-timeline", () => {
  let el: SpTimelineComponent;

  beforeEach(() => {
    document.body.innerHTML = "";
    el = createElement();
    el.items = SAMPLE_ITEMS;
  });

  it("renders the timeline container", async () => {
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector(".sp-timeline")).not.toBeNull();
  });

  it("renders correct number of items", async () => {
    await el.updateComplete;
    const items = el.shadowRoot?.querySelectorAll(".sp-timeline-item");
    expect(items?.length).toBe(4);
  });

  it("renders item labels", async () => {
    await el.updateComplete;
    const labels = el.shadowRoot?.querySelectorAll(".sp-timeline-label");
    expect(labels?.[0]?.textContent?.trim()).toBe("Order placed");
    expect(labels?.[1]?.textContent?.trim()).toBe("Processing");
  });

  it("renders item descriptions", async () => {
    await el.updateComplete;
    const descriptions = el.shadowRoot?.querySelectorAll(".sp-timeline-description");
    expect(descriptions?.[0]?.textContent?.trim()).toBe("Your order has been received.");
  });

  it("renders item time", async () => {
    await el.updateComplete;
    const times = el.shadowRoot?.querySelectorAll(".sp-timeline-time");
    expect(times?.[0]?.textContent?.trim()).toBe("10:00 AM");
  });

  it("does not render description when not provided", async () => {
    await el.updateComplete;
    const items = el.shadowRoot?.querySelectorAll(".sp-timeline-item");
    const lastItem = items?.[3];
    expect(lastItem?.querySelector(".sp-timeline-description")).toBeNull();
  });

  it("does not render time when not provided", async () => {
    await el.updateComplete;
    const items = el.shadowRoot?.querySelectorAll(".sp-timeline-item");
    const lastItem = items?.[3];
    expect(lastItem?.querySelector(".sp-timeline-time")).toBeNull();
  });

  it("applies variant class to items", async () => {
    await el.updateComplete;
    const items = el.shadowRoot?.querySelectorAll(".sp-timeline-item");
    expect(items?.[0]?.classList.contains("sp-timeline-item--success")).toBe(true);
    expect(items?.[1]?.classList.contains("sp-timeline-item--info")).toBe(true);
    expect(items?.[3]?.classList.contains("sp-timeline-item--warning")).toBe(true);
  });

  it("applies default variant class when variant not specified", async () => {
    el.items = [{ label: "Event" }];
    await el.updateComplete;
    const item = el.shadowRoot?.querySelector(".sp-timeline-item");
    expect(item?.classList.contains("sp-timeline-item--default")).toBe(true);
  });

  it("reverses item order when reverse is true", async () => {
    el.reverse = true;
    await el.updateComplete;
    const labels = el.shadowRoot?.querySelectorAll(".sp-timeline-label");
    expect(labels?.[0]?.textContent?.trim()).toBe("Delivered");
    expect(labels?.[3]?.textContent?.trim()).toBe("Order placed");
  });

  it("last item has no line connector", async () => {
    await el.updateComplete;
    const items = el.shadowRoot?.querySelectorAll(".sp-timeline-item");
    const lastItem = items?.[items.length - 1];
    expect(lastItem?.querySelector(".sp-timeline-line")).toBeNull();
  });

  it("all items except last have line connector", async () => {
    await el.updateComplete;
    const items = el.shadowRoot?.querySelectorAll(".sp-timeline-item");
    for (let i = 0; i < items!.length - 1; i++) {
      expect(items?.[i]?.querySelector(".sp-timeline-line")).not.toBeNull();
    }
  });
});

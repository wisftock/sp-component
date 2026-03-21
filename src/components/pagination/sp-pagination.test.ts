import { describe, it, expect, beforeEach, vi } from "vitest";
import "./sp-pagination.js";
import type { SpPaginationComponent } from "./sp-pagination.js";

function createElement(props: Partial<{ page: number; total: number; pageSize: number; siblingCount: number; disabled: boolean }> = {}): SpPaginationComponent {
  const el = document.createElement("sp-pagination") as SpPaginationComponent;
  if (props.page !== undefined) el.page = props.page;
  if (props.total !== undefined) el.total = props.total;
  if (props.pageSize !== undefined) el.pageSize = props.pageSize;
  if (props.siblingCount !== undefined) el.siblingCount = props.siblingCount;
  if (props.disabled !== undefined) el.disabled = props.disabled;
  document.body.appendChild(el);
  return el;
}

describe("sp-pagination", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("renders nav with aria-label Pagination", async () => {
    const el = createElement({ total: 100 });
    await el.updateComplete;
    const nav = el.shadowRoot?.querySelector("nav.sp-pagination");
    expect(nav).not.toBeNull();
    expect(nav?.getAttribute("aria-label")).toBe("Pagination");
  });

  it("renders correct number of page buttons for small total", async () => {
    const el = createElement({ total: 30, pageSize: 10 });
    await el.updateComplete;
    const pageBtns = [...el.shadowRoot!.querySelectorAll("button[aria-label^='Page']")];
    expect(pageBtns.length).toBe(3);
  });

  it("prev button is disabled on page 1", async () => {
    const el = createElement({ total: 100, page: 1 });
    await el.updateComplete;
    const prev = el.shadowRoot?.querySelector(".sp-pagination-prev") as HTMLButtonElement;
    expect(prev.disabled).toBe(true);
  });

  it("next button is disabled on last page", async () => {
    const el = createElement({ total: 30, pageSize: 10, page: 3 });
    await el.updateComplete;
    const next = el.shadowRoot?.querySelector(".sp-pagination-next") as HTMLButtonElement;
    expect(next.disabled).toBe(true);
  });

  it("clicking a page button emits sp-change with correct page", async () => {
    const el = createElement({ total: 50, pageSize: 10, page: 1 });
    await el.updateComplete;
    const listener = vi.fn();
    el.addEventListener("sp-change", listener);
    const pageBtns = [...el.shadowRoot!.querySelectorAll("button[aria-label^='Page']")] as HTMLButtonElement[];
    pageBtns[1].click();
    expect(listener).toHaveBeenCalledOnce();
    expect((listener.mock.calls[0][0] as CustomEvent).detail).toEqual({ page: 2 });
  });

  it("clicking prev decrements page", async () => {
    const el = createElement({ total: 50, pageSize: 10, page: 3 });
    await el.updateComplete;
    const prev = el.shadowRoot?.querySelector(".sp-pagination-prev") as HTMLButtonElement;
    prev.click();
    await el.updateComplete;
    expect(el.page).toBe(2);
  });

  it("clicking next increments page", async () => {
    const el = createElement({ total: 50, pageSize: 10, page: 1 });
    await el.updateComplete;
    const next = el.shadowRoot?.querySelector(".sp-pagination-next") as HTMLButtonElement;
    next.click();
    await el.updateComplete;
    expect(el.page).toBe(2);
  });

  it("active page button has aria-current=page", async () => {
    const el = createElement({ total: 50, pageSize: 10, page: 2 });
    await el.updateComplete;
    const activeBtn = el.shadowRoot?.querySelector("[aria-current='page']");
    expect(activeBtn).not.toBeNull();
    expect(activeBtn?.textContent?.trim()).toBe("2");
  });

  it("computes totalPages correctly", () => {
    const el = createElement({ total: 95, pageSize: 10 });
    expect(el.totalPages).toBe(10);
  });

  it("totalPages is at least 1 when total is 0", () => {
    const el = createElement({ total: 0 });
    expect(el.totalPages).toBe(1);
  });

  it("shows ellipsis for large page counts", async () => {
    const el = createElement({ total: 200, pageSize: 10, page: 5 });
    await el.updateComplete;
    const dots = el.shadowRoot?.querySelector(".sp-pagination-dots");
    expect(dots).not.toBeNull();
  });

  it("disabled state prevents navigation via _goTo", async () => {
    const el = createElement({ total: 100, pageSize: 10, page: 3, disabled: true });
    await el.updateComplete;
    const listener = vi.fn();
    el.addEventListener("sp-change", listener);
    el._goTo(4);
    expect(listener).not.toHaveBeenCalled();
    expect(el.page).toBe(3);
  });

  it("reflects disabled attribute", async () => {
    const el = createElement({ total: 100, disabled: true });
    await el.updateComplete;
    expect(el.hasAttribute("disabled")).toBe(true);
  });
});

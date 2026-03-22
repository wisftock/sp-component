import { LitElement, nothing, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import styles from "./sp-tree.css?inline";
import { treeTemplate } from "./sp-tree.template.js";
import type { SpTreeSelectionMode } from "./sp-tree.types.js";
import type { SpTreeItemComponent } from "./sp-tree-item.js";

/**
 * Tree component for hierarchical data.
 *
 * @element sp-tree
 *
 * @prop {SpTreeSelectionMode} selectionMode   - "none" | "single" | "multiple"
 * @prop {string}              selectedValues  - Comma-separated selected values
 *
 * @fires {CustomEvent<{values:string[]}>} sp-selection-change - Emitted when selection changes
 *
 * @slot - sp-tree-item elements
 */
@customElement("sp-tree")
export class SpTreeComponent extends LitElement {
  static override styles = unsafeCSS(styles);

  @property({ type: String, attribute: "selection-mode" })
  selectionMode: SpTreeSelectionMode = "single";

  @property({ type: String, attribute: "selected-values" })
  selectedValues = "";

  @property({ type: String })
  label = "";

  private _getVisibleItems(): SpTreeItemComponent[] {
    return this._getVisibleItemsFrom(this);
  }

  private _getVisibleItemsFrom(root: Element): SpTreeItemComponent[] {
    const result: SpTreeItemComponent[] = [];
    for (const child of Array.from(root.children)) {
      if (child.tagName.toLowerCase() === "sp-tree-item") {
        const item = child as SpTreeItemComponent;
        result.push(item);
        if (item.expanded) {
          result.push(...this._getVisibleItemsFrom(item));
        }
      }
    }
    return result;
  }

  private _getAllItems(): SpTreeItemComponent[] {
    return Array.from(
      this.querySelectorAll<SpTreeItemComponent>("sp-tree-item"),
    );
  }

  override connectedCallback() {
    super.connectedCallback();
    this.addEventListener("sp-click", this._handleItemClick as EventListener);
    this.addEventListener("keydown", this._handleKeydown);
    // Apply initial selectedValues
    this.updateComplete.then(() => this._syncSelection());
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener("sp-click", this._handleItemClick as EventListener);
    this.removeEventListener("keydown", this._handleKeydown);
  }

  override updated(changed: Map<string, unknown>) {
    if (changed.has("selectedValues")) {
      this._syncSelection();
    }
  }

  private _syncSelection(): void {
    if (!this.selectedValues) return;
    const values = this.selectedValues
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean);
    this._getAllItems().forEach((item) => {
      item.selected = values.includes(item.value);
    });
  }

  private _handleItemClick = (e: CustomEvent<{ value: string; label: string }>): void => {
    const target = e.target as SpTreeItemComponent;
    if (this.selectionMode === "none") return;

    const allItems = this._getAllItems();

    if (this.selectionMode === "single") {
      allItems.forEach((item) => {
        item.selected = item === target;
      });
    } else if (this.selectionMode === "multiple") {
      target.selected = !target.selected;
    }

    const selectedValues = allItems
      .filter((item) => item.selected)
      .map((item) => item.value);

    this.selectedValues = selectedValues.join(",");

    this.dispatchEvent(
      new CustomEvent("sp-selection-change", {
        detail: { values: selectedValues },
        bubbles: true,
        composed: true,
      }),
    );
  };

  private _handleKeydown = (e: KeyboardEvent): void => {
    const items = this._getVisibleItems();
    if (items.length === 0) return;

    const focused = items.findIndex(
      (item) =>
        item === document.activeElement ||
        item.shadowRoot?.activeElement != null,
    );

    if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = focused < items.length - 1 ? focused + 1 : 0;
      const row = items[next]?.shadowRoot?.querySelector<HTMLElement>(".sp-tree-item-row");
      row?.focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const prev = focused > 0 ? focused - 1 : items.length - 1;
      const row = items[prev]?.shadowRoot?.querySelector<HTMLElement>(".sp-tree-item-row");
      row?.focus();
    } else if (e.key === "ArrowRight" && focused >= 0) {
      const item = items[focused];
      if (item && item._hasChildren && !item.expanded) {
        item.expanded = true;
        item.dispatchEvent(new CustomEvent("sp-expand", { detail: { value: item.value }, bubbles: true, composed: true }));
        e.preventDefault();
      }
    } else if (e.key === "ArrowLeft" && focused >= 0) {
      const item = items[focused];
      if (item && item._hasChildren && item.expanded) {
        item.expanded = false;
        item.dispatchEvent(new CustomEvent("sp-collapse", { detail: { value: item.value }, bubbles: true, composed: true }));
        e.preventDefault();
      }
    }
  };

  override render() {
    return treeTemplate.call(this);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "sp-tree": SpTreeComponent;
  }
}

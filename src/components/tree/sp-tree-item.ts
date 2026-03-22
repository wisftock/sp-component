import { LitElement, unsafeCSS } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import styles from "./sp-tree-item.css?inline";
import { treeItemTemplate } from "./sp-tree-item.template.js";

/**
 * Tree item component for use inside sp-tree.
 *
 * @element sp-tree-item
 *
 * @prop {string}  value    - Unique value identifier
 * @prop {string}  label    - Display label
 * @prop {boolean} expanded - Whether children are visible
 * @prop {boolean} selected - Whether this item is selected
 * @prop {boolean} disabled - Prevents interaction
 * @prop {string}  icon     - HTML/emoji icon
 * @prop {boolean} loading  - Shows a spinner
 *
 * @fires {CustomEvent<{value:string,label:string}>} sp-click    - Emitted on click
 * @fires {CustomEvent<{value:string}>}              sp-expand   - Emitted when expanded
 * @fires {CustomEvent<{value:string}>}              sp-collapse - Emitted when collapsed
 *
 * @slot      - Nested sp-tree-item children
 * @slot icon - Custom icon content
 */
@customElement("sp-tree-item")
export class SpTreeItemComponent extends LitElement {
  static override styles = unsafeCSS(styles);

  @property({ type: String })
  value = "";

  @property({ type: String })
  label = "";

  @property({ type: Boolean, reflect: true })
  expanded = false;

  @property({ type: Boolean, reflect: true })
  selected = false;

  @property({ type: Boolean })
  disabled = false;

  @property({ type: String })
  icon = "";

  @property({ type: Boolean })
  loading = false;

  @property({ type: Number })
  level = 1;

  @state()
  _hasChildren = false;

  _onSlotChange = (): void => {
    const slot = this.shadowRoot?.querySelector<HTMLSlotElement>(
      "slot:not([name])",
    );
    if (!slot) return;
    const children = slot
      .assignedElements({ flatten: true })
      .filter((el) => el.tagName.toLowerCase() === "sp-tree-item");
    this._hasChildren = children.length > 0;
  };

  _toggleExpand = (e: Event): void => {
    e.stopPropagation();
    if (this.disabled) return;
    this.expanded = !this.expanded;
    this.dispatchEvent(
      new CustomEvent(this.expanded ? "sp-expand" : "sp-collapse", {
        detail: { value: this.value },
        bubbles: true,
        composed: true,
      }),
    );
  };

  _handleClick = (e: Event): void => {
    if (this.disabled) return;
    this.dispatchEvent(
      new CustomEvent("sp-click", {
        detail: { value: this.value, label: this.label },
        bubbles: true,
        composed: true,
      }),
    );
  };

  _handleKeydown = (e: KeyboardEvent): void => {
    if (this.disabled) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      this._handleClick(e);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      if (this._hasChildren && !this.expanded) {
        this.expanded = true;
        this.dispatchEvent(
          new CustomEvent("sp-expand", {
            detail: { value: this.value },
            bubbles: true,
            composed: true,
          }),
        );
      }
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      if (this._hasChildren && this.expanded) {
        this.expanded = false;
        this.dispatchEvent(
          new CustomEvent("sp-collapse", {
            detail: { value: this.value },
            bubbles: true,
            composed: true,
          }),
        );
      }
    }
  };

  override render() {
    return treeItemTemplate.call(this);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "sp-tree-item": SpTreeItemComponent;
  }
}

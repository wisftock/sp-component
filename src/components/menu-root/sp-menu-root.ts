import { html, unsafeCSS } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { SpBaseElement } from "../../base/SpBaseElement.js";

const styles = `
  :host { display: inline-block; position: relative; }
`;

/**
 * Compound menu root — manages open/close state.
 *
 * @element sp-menu-root
 *
 * @example
 * ```html
 * <sp-menu-root>
 *   <sp-menu-trigger>Actions</sp-menu-trigger>
 *   <sp-menu-content>
 *     <sp-menu-item value="edit">Edit</sp-menu-item>
 *     <sp-menu-separator></sp-menu-separator>
 *     <sp-menu-item value="delete" danger>Delete</sp-menu-item>
 *   </sp-menu-content>
 * </sp-menu-root>
 * ```
 */
@customElement("sp-menu-root")
export class SpMenuRootElement extends SpBaseElement {
  static override styles = unsafeCSS(styles);

  @property({ type: Boolean, reflect: true })
  disabled = false;

  @state()
  _open = false;

  override render() {
    return html`<slot></slot>`;
  }

  override connectedCallback() {
    super.connectedCallback();
    this.addEventListener("sp-menu-trigger-click", this._handleTriggerClick as EventListener);
    this.addEventListener("sp-menu-option-click", this._handleItemClick as EventListener);
    document.addEventListener("click", this._handleDocumentClick);
    document.addEventListener("keydown", this._handleKeydown);
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener("sp-menu-trigger-click", this._handleTriggerClick as EventListener);
    this.removeEventListener("sp-menu-option-click", this._handleItemClick as EventListener);
    document.removeEventListener("click", this._handleDocumentClick);
    document.removeEventListener("keydown", this._handleKeydown);
  }

  private readonly _handleTriggerClick = () => {
    if (this.disabled) return;
    this._open = !this._open;
    this._syncState();
  };

  private readonly _handleItemClick = (e: CustomEvent<{ value: string }>) => {
    this._open = false;
    this._syncState();
    this.emit("sp-select", { value: e.detail.value });
  };

  private readonly _handleDocumentClick = (e: MouseEvent) => {
    if (!e.composedPath().includes(this) && this._open) {
      this._open = false;
      this._syncState();
    }
  };

  private readonly _handleKeydown = (e: KeyboardEvent) => {
    if (e.key === "Escape" && this._open) {
      this._open = false;
      this._syncState();
    }
  };

  private _syncState() {
    const content = this.querySelector("sp-menu-content");
    if (content) {
      if (this._open) {
        content.setAttribute("open", "");
      } else {
        content.removeAttribute("open");
      }
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "sp-menu-root": SpMenuRootElement;
  }
}

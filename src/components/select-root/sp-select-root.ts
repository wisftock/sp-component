import { html, unsafeCSS } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { SpBaseElement } from "../../base/SpBaseElement.js";

const styles = `
  :host { display: inline-block; position: relative; }
`;

/**
 * Compound select root — manages open/close state and coordinates sub-elements.
 *
 * @element sp-select-root
 *
 * @fires {CustomEvent<{ value: string }>} sp-change - Emitted when selection changes
 *
 * @example
 * ```html
 * <sp-select-root>
 *   <sp-select-trigger placeholder="Choose…"></sp-select-trigger>
 *   <sp-select-content>
 *     <sp-select-item value="a">Option A</sp-select-item>
 *     <sp-select-item value="b">Option B</sp-select-item>
 *   </sp-select-content>
 * </sp-select-root>
 * ```
 */
@customElement("sp-select-root")
export class SpSelectRootElement extends SpBaseElement {
  static override styles = unsafeCSS(styles);

  @property({ type: String, reflect: true })
  value = "";

  @property({ type: Boolean, reflect: true })
  disabled = false;

  @state()
  _open = false;

  override render() {
    return html`<slot></slot>`;
  }

  override connectedCallback() {
    super.connectedCallback();
    this.addEventListener("sp-trigger-click", this._handleTriggerClick as EventListener);
    this.addEventListener("sp-select-item-click", this._handleItemClick as EventListener);
    document.addEventListener("click", this._handleDocumentClick);
    document.addEventListener("keydown", this._handleKeydown);
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener("sp-trigger-click", this._handleTriggerClick as EventListener);
    this.removeEventListener("sp-select-item-click", this._handleItemClick as EventListener);
    document.removeEventListener("click", this._handleDocumentClick);
    document.removeEventListener("keydown", this._handleKeydown);
  }

  private readonly _handleTriggerClick = () => {
    if (this.disabled) return;
    this._open = !this._open;
    this._syncState();
  };

  private readonly _handleItemClick = (e: CustomEvent<{ value: string; label: string }>) => {
    this.value = e.detail.value;
    this._open = false;
    this._syncState();
    this.emit("sp-change", { value: this.value });
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

  /** Propagates state to trigger and content sub-elements via DOM attributes. */
  private _syncState() {
    const trigger = this.querySelector("sp-select-trigger");
    const content = this.querySelector("sp-select-content");
    if (trigger) {
      trigger.setAttribute("aria-expanded", String(this._open));
      trigger.setAttribute("current-value", this.value);
    }
    if (content) {
      if (this._open) {
        content.setAttribute("open", "");
      } else {
        content.removeAttribute("open");
      }
      content.setAttribute("selected-value", this.value);
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "sp-select-root": SpSelectRootElement;
  }
}

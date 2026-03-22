import { LitElement, unsafeCSS } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import styles from "./sp-split-panel.css?inline";
import { splitPanelTemplate } from "./sp-split-panel.template.js";
import type { SpSplitPanelOrientation } from "./sp-split-panel.types.js";

/**
 * Split panel component with draggable divider.
 *
 * @element sp-split-panel
 *
 * @prop {number}                  position    - Position of divider as percentage (0-100)
 * @prop {SpSplitPanelOrientation} orientation - "horizontal" (side by side) or "vertical" (stacked)
 * @prop {number}                  min         - Minimum percentage for either panel
 * @prop {number}                  max         - Maximum percentage for first panel
 * @prop {number}                  snap        - Snap to this position when close (0 = no snap)
 * @prop {boolean}                 disabled    - Disable dragging
 * @prop {string}                  storageKey  - When set, save/restore position from localStorage
 *
 * @fires {CustomEvent<{position:number}>} sp-resize     - Emitted during drag
 * @fires {CustomEvent<{position:number}>} sp-resize-end - Emitted when drag ends
 *
 * @slot start   - First panel content
 * @slot end     - Second panel content
 * @slot divider - Custom divider handle
 */
@customElement("sp-split-panel")
export class SpSplitPanelComponent extends LitElement {
  static override styles = unsafeCSS(styles);

  @property({ type: Number, reflect: true })
  position = 50;

  @property({ type: String, reflect: true })
  orientation: SpSplitPanelOrientation = "horizontal";

  @property({ type: Number })
  min = 10;

  @property({ type: Number })
  max = 90;

  @property({ type: Number })
  snap = 0;

  @property({ type: Boolean, reflect: true })
  disabled = false;

  @property({ type: String, attribute: "storage-key" })
  storageKey = "";

  @state()
  _dragging = false;

  @state()
  _isMobile = false;

  @state()
  _currentPosition = 50;

  private _dragStartPos = 0;
  private _dragStartPosition = 0;
  private _mobileQuery: MediaQueryList | null = null;
  private _mobileListener: ((e: MediaQueryListEvent) => void) | null = null;

  override connectedCallback() {
    super.connectedCallback();

    // Restore from localStorage if storageKey is set
    if (this.storageKey) {
      const saved = localStorage.getItem(this.storageKey);
      if (saved !== null) {
        const parsed = parseFloat(saved);
        if (!isNaN(parsed)) {
          this.position = parsed;
        }
      }
    }
    this._currentPosition = this.position;

    // Responsive: detect mobile
    if (typeof window.matchMedia === "function") {
      this._mobileQuery = window.matchMedia("(max-width: 479px)");
      this._isMobile = this._mobileQuery.matches;
      this._mobileListener = (e: MediaQueryListEvent) => {
        this._isMobile = e.matches;
      };
      this._mobileQuery.addEventListener("change", this._mobileListener);
    }
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    if (this._mobileQuery && this._mobileListener) {
      this._mobileQuery.removeEventListener("change", this._mobileListener);
    }
  }

  override willUpdate(changed: Map<string, unknown>) {
    if (changed.has("position") && !this._dragging) {
      this._currentPosition = this.position;
    }
  }

  _startDrag = (e: MouseEvent): void => {
    if (this.disabled) return;
    e.preventDefault();
    this._dragging = true;
    this._dragStartPos =
      this.orientation === "horizontal" ? e.clientX : e.clientY;
    this._dragStartPosition = this._currentPosition;
    window.addEventListener("mousemove", this._onMouseMove);
    window.addEventListener("mouseup", this._onMouseUp);
  };

  private _onMouseMove = (e: MouseEvent): void => {
    const clientPos =
      this.orientation === "horizontal" ? e.clientX : e.clientY;
    this._updatePosition(clientPos);
  };

  private _onMouseUp = (): void => {
    this._dragging = false;
    window.removeEventListener("mousemove", this._onMouseMove);
    window.removeEventListener("mouseup", this._onMouseUp);
    this.position = this._currentPosition;
    if (this.storageKey) {
      localStorage.setItem(this.storageKey, String(this._currentPosition));
    }
    this.dispatchEvent(
      new CustomEvent("sp-resize-end", {
        detail: { position: this._currentPosition },
        bubbles: true,
        composed: true,
      }),
    );
  };

  _startTouchDrag = (e: TouchEvent): void => {
    if (this.disabled) return;
    e.preventDefault();
    this._dragging = true;
    const touch = e.touches[0];
    if (!touch) return;
    this._dragStartPos =
      this.orientation === "horizontal" ? touch.clientX : touch.clientY;
    this._dragStartPosition = this._currentPosition;
    window.addEventListener("touchmove", this._onTouchMove, { passive: false });
    window.addEventListener("touchend", this._onTouchEnd);
  };

  private _onTouchMove = (e: TouchEvent): void => {
    e.preventDefault();
    const touch = e.touches[0];
    if (!touch) return;
    const clientPos =
      this.orientation === "horizontal" ? touch.clientX : touch.clientY;
    this._updatePosition(clientPos);
  };

  private _onTouchEnd = (): void => {
    this._dragging = false;
    window.removeEventListener("touchmove", this._onTouchMove);
    window.removeEventListener("touchend", this._onTouchEnd);
    this.position = this._currentPosition;
    if (this.storageKey) {
      localStorage.setItem(this.storageKey, String(this._currentPosition));
    }
    this.dispatchEvent(
      new CustomEvent("sp-resize-end", {
        detail: { position: this._currentPosition },
        bubbles: true,
        composed: true,
      }),
    );
  };

  _handleDividerDblClick = (): void => {
    if (this.disabled) return;
    this._currentPosition = 50;
    this.position = 50;
    if (this.storageKey) {
      localStorage.setItem(this.storageKey, "50");
    }
    this.dispatchEvent(
      new CustomEvent("sp-resize", {
        detail: { position: 50 },
        bubbles: true,
        composed: true,
      }),
    );
    this.dispatchEvent(
      new CustomEvent("sp-resize-end", {
        detail: { position: 50 },
        bubbles: true,
        composed: true,
      }),
    );
  };

  private _updatePosition(clientPos: number): void {
    const rect = this.getBoundingClientRect();
    const totalSize =
      this.orientation === "horizontal" ? rect.width : rect.height;
    if (totalSize === 0) return;

    const offset = clientPos - this._dragStartPos;
    const offsetPercent = (offset / totalSize) * 100;
    let newPos = this._dragStartPosition + offsetPercent;

    // Clamp
    newPos = Math.max(this.min, Math.min(this.max, newPos));

    // Snap
    if (this.snap > 0 && Math.abs(newPos - this.snap) < 3) {
      newPos = this.snap;
    }

    this._currentPosition = Math.round(newPos * 100) / 100;

    this.dispatchEvent(
      new CustomEvent("sp-resize", {
        detail: { position: this._currentPosition },
        bubbles: true,
        composed: true,
      }),
    );
  }

  _handleDividerKeydown = (e: KeyboardEvent): void => {
    if (this.disabled) return;
    const step = e.shiftKey ? 10 : 1;
    let handled = false;

    if (
      (this.orientation === "horizontal" && e.key === "ArrowLeft") ||
      (this.orientation === "vertical" && e.key === "ArrowUp")
    ) {
      e.preventDefault();
      this._currentPosition = Math.max(
        this.min,
        this._currentPosition - step,
      );
      handled = true;
    } else if (
      (this.orientation === "horizontal" && e.key === "ArrowRight") ||
      (this.orientation === "vertical" && e.key === "ArrowDown")
    ) {
      e.preventDefault();
      this._currentPosition = Math.min(
        this.max,
        this._currentPosition + step,
      );
      handled = true;
    }

    if (handled) {
      this.position = this._currentPosition;
      this.dispatchEvent(
        new CustomEvent("sp-resize", {
          detail: { position: this._currentPosition },
          bubbles: true,
          composed: true,
        }),
      );
    }
  };

  override render() {
    return splitPanelTemplate.call(this);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "sp-split-panel": SpSplitPanelComponent;
  }
}

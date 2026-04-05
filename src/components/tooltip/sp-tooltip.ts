import { LitElement, unsafeCSS } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import styles from "./sp-tooltip.css?inline";
import { tooltipTemplate } from "./sp-tooltip.template.js";
import type { SpTooltipPlacement, SpTooltipTrigger } from "./sp-tooltip.types.js";
import { setupFloating } from "../../utils/floating.js";

/**
 * Tooltip component that shows contextual information on hover, focus, or click.
 *
 * @element sp-tooltip
 *
 * @prop {string}              content    - Text content shown in the tooltip
 * @prop {SpTooltipPlacement}  placement  - Tooltip position: top | bottom | left | right
 * @prop {SpTooltipTrigger}    trigger    - What triggers visibility: hover | focus | click | manual
 * @prop {boolean}             disabled   - Disables the tooltip
 * @prop {boolean}             open       - Controls visibility (set manually when trigger=manual)
 * @prop {number}              distance   - Gap in px between trigger and tooltip
 * @prop {number}              showDelay  - Delay in ms before showing (default 300)
 * @prop {number}              hideDelay  - Delay in ms before hiding (default 100)
 * @prop {string}              maxWidth   - CSS max-width for tooltip (default "200px")
 *
 * @slot - The element that triggers the tooltip
 */
@customElement("sp-tooltip")
export class SpTooltipComponent extends LitElement {
  static override styles = unsafeCSS(styles);

  @state() _id = `sp-tooltip-${Math.random().toString(36).slice(2, 9)}`;

  #showTimer: ReturnType<typeof setTimeout> | undefined;
  #hideTimer: ReturnType<typeof setTimeout> | undefined;
  #cleanupFloating?: () => void;

  @property({ type: String })
  content = "";

  @property({ type: String, reflect: true })
  placement: SpTooltipPlacement = "top";

  @property({ type: String })
  trigger: SpTooltipTrigger = "hover";

  @property({ type: Boolean, reflect: true })
  disabled = false;

  @property({ type: Boolean, reflect: true })
  open = false;

  @property({ type: Number })
  distance = 8;

  @property({ type: Number })
  showDelay = 300;

  @property({ type: Number })
  hideDelay = 100;

  @property({ type: String })
  maxWidth = "200px";

  override connectedCallback() {
    super.connectedCallback();
    void this.updateComplete.then(() => this.#initFloating());
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.#cleanupFloating?.();
    clearTimeout(this.#showTimer);
    clearTimeout(this.#hideTimer);
  }

  #initFloating() {
    this.#cleanupFloating?.();
    const wrapper = this.shadowRoot?.querySelector<HTMLElement>(".sp-tooltip-wrapper");
    const tooltip = this.shadowRoot?.querySelector<HTMLElement>(".sp-tooltip");
    if (!wrapper || !tooltip) return;
    this.#cleanupFloating = setupFloating({
      reference: wrapper,
      floating: tooltip,
      placement: this.placement,
      distance: this.distance,
    });
  }

  override render() {
    return tooltipTemplate.call(this);
  }

  _show(): void {
    clearTimeout(this.#hideTimer);
    const doShow = () => { this.open = true; };
    if (this.showDelay > 0) {
      this.#showTimer = setTimeout(doShow, this.showDelay);
    } else {
      doShow();
    }
  }

  _hide(): void {
    clearTimeout(this.#showTimer);
    const doHide = () => { this.open = false; };
    if (this.hideDelay > 0) {
      this.#hideTimer = setTimeout(doHide, this.hideDelay);
    } else {
      doHide();
    }
  }

  readonly _handleMouseEnter = () => {
    if (this.trigger === "hover") this._show();
  };

  readonly _handleMouseLeave = () => {
    if (this.trigger === "hover") this._hide();
  };

  readonly _handleFocusIn = () => {
    if (this.trigger === "focus") this._show();
  };

  readonly _handleFocusOut = () => {
    if (this.trigger === "focus") this._hide();
  };

  readonly _handleClick = () => {
    if (this.trigger === "click") {
      if (this.open) {
        this.open = false;
      } else {
        this.open = true;
      }
    }
  };
}

declare global {
  interface HTMLElementTagNameMap {
    "sp-tooltip": SpTooltipComponent;
  }
}

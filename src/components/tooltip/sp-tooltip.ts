import { LitElement, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import styles from "./sp-tooltip.css?inline";
import { tooltipTemplate } from "./sp-tooltip.template.js";
import type { SpTooltipPlacement, SpTooltipTrigger } from "./sp-tooltip.types.js";

/**
 * Tooltip component that shows contextual information on hover, focus, or click.
 *
 * @element sp-tooltip
 *
 * @prop {string}              content   - Text content shown in the tooltip
 * @prop {SpTooltipPlacement}  placement - Tooltip position: top | bottom | left | right
 * @prop {SpTooltipTrigger}    trigger   - What triggers visibility: hover | focus | click | manual
 * @prop {boolean}             disabled  - Disables the tooltip
 * @prop {boolean}             open      - Controls visibility (set manually when trigger=manual)
 * @prop {number}              distance  - Gap in px between trigger and tooltip
 *
 * @slot - The element that triggers the tooltip
 */
@customElement("sp-tooltip")
export class SpTooltipComponent extends LitElement {
  static override styles = unsafeCSS(styles);

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

  override render() {
    return tooltipTemplate.call(this);
  }

  _getTooltipStyle(): string {
    const d = `${this.distance}px`;
    const positions: Record<SpTooltipPlacement, string> = {
      top: `bottom: calc(100% + ${d}); left: 50%; transform: translateX(-50%);`,
      bottom: `top: calc(100% + ${d}); left: 50%; transform: translateX(-50%);`,
      left: `right: calc(100% + ${d}); top: 50%; transform: translateY(-50%);`,
      right: `left: calc(100% + ${d}); top: 50%; transform: translateY(-50%);`,
    };
    return positions[this.placement];
  }

  readonly _handleMouseEnter = () => {
    if (this.trigger === "hover") this.open = true;
  };

  readonly _handleMouseLeave = () => {
    if (this.trigger === "hover") this.open = false;
  };

  readonly _handleFocusIn = () => {
    if (this.trigger === "focus") this.open = true;
  };

  readonly _handleFocusOut = () => {
    if (this.trigger === "focus") this.open = false;
  };

  readonly _handleClick = () => {
    if (this.trigger === "click") this.open = !this.open;
  };
}

declare global {
  interface HTMLElementTagNameMap {
    "sp-tooltip": SpTooltipComponent;
  }
}
